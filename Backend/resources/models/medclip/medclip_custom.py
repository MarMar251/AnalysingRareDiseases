import torch
import torch.nn as nn
import torch.nn.functional as F
import timm
from transformers import AutoModel


# ─────────────────────────── Vision branch ────────────────────────────
class SwinEncoder(nn.Module):
    """
    Swin-Transformer backbone (ImageNet-pretrained) + MLP projection
    مطابق لتخطيط MedCLIP: Linear → ReLU → LayerNorm ثم L2-normalize
    """
    def __init__(self,
                 model_name: str = "swin_base_patch4_window7_224",
                 proj_dim:   int = 256):
        super().__init__()

        # backbone بدون رأس تصنيف
        self.model = timm.create_model(
            model_name,
            pretrained=True,
            num_classes=0,
            global_pool="avg"
        )

        # رأس الإسقاط
        self.proj = nn.Sequential(
            nn.Linear(self.model.num_features, proj_dim, bias=True),
            nn.ReLU(inplace=True),
            nn.LayerNorm(proj_dim)
        )

    def forward(self, x):
        feats = self.model(x)          # (B, F_backbone)
        feats = self.proj(feats)       # (B, proj_dim)
        return F.normalize(feats, dim=-1)  # (B, proj_dim)  L2-norm


# ─────────────────────────── Text branch ──────────────────────────────
class BioClinicalBERTEncoder(nn.Module):
    """
    Bio_ClinicalBERT مجمَّد + رأس إسقاط مطابق لـ MedCLIP
    """
    def __init__(self, proj_dim: int = 256):
        super().__init__()

        # تحميل النموذج اللغوي الطبي
        self.model = AutoModel.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")

        # تجميد الأوزان
        for p in self.model.parameters():
            p.requires_grad = False

        # رأس الإسقاط
        self.proj = nn.Sequential(
            nn.Linear(self.model.config.hidden_size, proj_dim, bias=True),
            nn.ReLU(inplace=True),
            nn.LayerNorm(proj_dim)
        )

    def forward(self, input_ids, attention_mask):
        outputs = self.model(input_ids=input_ids, attention_mask=attention_mask)
        cls = outputs.last_hidden_state[:, 0, :]      # (B, 768)
        feats = self.proj(cls)                        # (B, proj_dim)
        return F.normalize(feats, dim=-1)             # (B, proj_dim)


# ─────────────────────────── Wrapper (MedCLIP-compatible) ─────────────
class MedCLIPCustom(nn.Module):
    """
    واجهة متوافقة تماماً مع MedCLIP:
      forward() يرجع dict يحوي logits وصور/نصوص متطابقة البُعد (256)
    """
    def __init__(self,
                 vision_name: str = "swin_base_patch4_window7_224",
                 proj_dim:   int  = 256):
        super().__init__()

        self.vision_encoder = SwinEncoder(model_name=vision_name,
                                          proj_dim=proj_dim)
        self.text_encoder   = BioClinicalBERTEncoder(proj_dim=proj_dim)

        # معامل الحرارة القابل للتعلم (τ⁻¹)
        self.logit_scale = nn.Parameter(
            torch.ones([]) * torch.log(torch.tensor(1 / 0.07))
        )

    def forward(self,
                images,            # Tensor  (B, 3, H, W)
                input_ids,         # Tensor  (B, L)
                attention_mask,    # Tensor  (B, L)
                return_embeds: bool = False):

        img_feat = self.vision_encoder(images)                 # (B, 256)
        txt_feat = self.text_encoder(input_ids, attention_mask)  # (B, 256)

        # مصفوفة التشابه (CLIP scaling)
        logit_scale = self.logit_scale.exp().clamp(max=100.0)
        logits = logit_scale * img_feat @ txt_feat.T            # (B, B)

        out = {
            "logits":          logits,     # صورة مقابل نص
            "logits_per_text": logits.T    # نص مقابل صورة
        }

        if return_embeds:
            out["img_embeds"]  = img_feat
            out["text_embeds"] = txt_feat

        return out
