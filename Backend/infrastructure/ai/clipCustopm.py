import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import timm
from transformers import AutoModel

class PhraseCrossAggregator(nn.Module):
    def __init__(self, dim: int, num_heads: int = 4):
        super().__init__()
        self.cross_attn = nn.MultiheadAttention(
            embed_dim=dim, num_heads=num_heads, batch_first=True
        )

    def forward(self, img_emb: torch.Tensor, phr_emb: torch.Tensor) -> torch.Tensor:
        """
        img_emb : (B, D)        – CLS / global token from vision encoder
        phr_emb : (B, K, D)     – CLS embeddings from BERT for K phrases
        Returns fused, L2‑normalised embedding (B, D)
        """
        q = img_emb.unsqueeze(1)              # (B, 1, D)
        k = v = phr_emb                       # (B, K, D)
        fused, _ = self.cross_attn(q, k, v)   # (B, 1, D)
        fused = fused.squeeze(1)              # (B, D)
        return F.normalize(fused, p=2, dim=-1)


class SwinEncoder(nn.Module):
    def __init__(self, model_name="swin_base_patch4_window7_224", proj_dim=256):
        super().__init__()
        self.model = timm.create_model(model_name,
                                       pretrained=True,
                                       num_classes=0,
                                       global_pool="avg")
        self.proj = nn.Linear(self.model.num_features, proj_dim)

    def forward(self, x):
        feat = self.model(x)
        feat = self.proj(feat)
        return F.normalize(feat, p=2, dim=-1)


class BioClinicalBERTEncoder(nn.Module):
    def __init__(self, proj_dim=256, n_heads=4):
        super().__init__()
        self.model = AutoModel.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
        for p in self.model.parameters():
            p.requires_grad = False
        self.model.eval()

        self.proj = nn.Linear(self.model.config.hidden_size, proj_dim)
        self.agg  = PhraseCrossAggregator(proj_dim, num_heads=n_heads)

    @torch.no_grad()
    def _encode_bert(self, input_ids, attention_mask):
        return self.model(input_ids=input_ids,
                          attention_mask=attention_mask).last_hidden_state[:, 0]

    def forward(self, input_ids, attention_mask, img_emb=None):
        if input_ids.dim() == 3:                  # (B, K, L)
            B, K, L = input_ids.shape
            ids  = input_ids.view(-1, L)
            mask = attention_mask.view(-1, L)

            cls = self._encode_bert(ids, mask)    # (B*K, H)
            cls = self.proj(cls)                  # (B*K, D)
            cls = F.normalize(cls, p=2, dim=-1)
            cls = cls.view(B, K, -1)              # (B, K, D)

            if img_emb is None:
                raise ValueError("Need image embedding for cross-attention")
            return self.agg(img_emb, cls)         # (B, D)

        elif input_ids.dim() == 2:                # (B, L) for inference
            cls = self._encode_bert(input_ids, attention_mask)
            cls = self.proj(cls)
            return F.normalize(cls, p=2, dim=-1)

        else:
            raise ValueError(f"Invalid input_ids shape: {input_ids.shape}")


class MedCLIPCustom(nn.Module):
    def __init__(self, proj_dim=256):
        super().__init__()
        self.vision_encoder = SwinEncoder(proj_dim=proj_dim)
        self.text_encoder   = BioClinicalBERTEncoder(proj_dim=proj_dim)
        self.logit_scale    = nn.Parameter(torch.ones([]) * np.log(1 / 0.07))

    def forward(self, images, input_ids, attention_mask):
        img_feat = self.vision_encoder(images)  # (B, D)
        txt_feat = self.text_encoder(input_ids, attention_mask, img_feat)  # (B, D)
        return img_feat, txt_feat