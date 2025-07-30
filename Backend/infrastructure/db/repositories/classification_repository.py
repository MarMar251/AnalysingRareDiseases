import torch
import json
import random
import numpy as np
import torch.nn.functional as F
from torchvision import transforms
from transformers import AutoTokenizer
from PIL import Image
from typing import List, Dict, Any, Optional
from pathlib import Path
from collections import defaultdict
import logging
from dataclasses import dataclass

from domain.interfaces.repositories.classification_repository_interface import IClassificationRepository
from domain.entities.disease import Disease
from core.settings import settings
# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("ClassificationRepository")


class ClassificationRepository(IClassificationRepository):
    """
    Repository implementation for classification operations using MedCLIP
    """
    _instance = None
    _is_initialized = False
    
    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            logger.info("Creating new ClassificationRepository instance")
            cls._instance = super(ClassificationRepository, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        # Skip initialization if already initialized
        if ClassificationRepository._is_initialized:
            return
        
        self.model = None
        self.tokenizer = None
        self.device = None
        self.img_transform = None
        self.txt_embeddings = None
        self.phrase_info = None
    
    def initialize_model(self) -> None:
        """Initialize the MedCLIP model"""
        if ClassificationRepository._is_initialized:
            logger.info("Model already initialized, skipping")
            return
            
        logger.info("Initializing MedCLIP model...")
        
        # Set up device
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {self.device}")

        # Set random seed for reproducibility
        seed = 42
        random.seed(seed)
        np.random.seed(seed)
        torch.manual_seed(seed)
        
        # Image transformation pipeline
        self.img_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406],
                               [0.229, 0.224, 0.225])
        ])
        
        # Load tokenizer
        logger.info("Loading Bio_ClinicalBERT tokenizer...")
        self.tokenizer = AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
        
        # Get model path
        model_path = settings.medclip_model_path
        logger.info(f"Loading MedCLIP model from: {model_path}")
        
        # Load model
        from infrastructure.ai.clipCustopm import MedCLIPCustom
        self.model = MedCLIPCustom(proj_dim=256).to(self.device)
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.eval()
        
        logger.info("MedCLIP model initialization complete")
        ClassificationRepository._is_initialized = True
    
    def _get_confidence_label(self, score: float) -> str:
        """Convert similarity score to confidence label"""
        if score >= 0.90: return "Almost certain"
        if score >= 0.70: return "Very likely"
        if score >= 0.50: return "Likely"
        if score >= 0.30: return "Uncertain"
        return "Unlikely"

    def classify_image(self, image_path: str, diseases: List[Disease], max_phrases: int = 12, top_k: int = 5) -> List[dict]:
        """
        Classify an image against a list of diseases.
        
        Args:
            image_path: Path to the image file
            diseases: List of diseases to compare against
            max_phrases: Maximum number of phrases to sample per disease
            top_k: Number of top predictions to return
            
        Returns:
            List of dictionaries with disease name, score, and best matching phrase
        """
        if not ClassificationRepository._is_initialized:
            self.initialize_model()
        
        logger.info(f"Processing image: {image_path}")
        
        # Load and process image
        img = Image.open(image_path).convert("RGB")
        img_tensor = self.img_transform(img).unsqueeze(0).to(self.device)
        
        # Get image embeddings
        with torch.no_grad():
            img_emb = F.normalize(self.model.vision_encoder(img_tensor), dim=-1)
        
        # Build disease phrases
        phrases, owners = [], []
        for disease in diseases:
            # Split description into sentences/phrases
            disease_phrases = [p.strip() for p in disease.description.split("\n") if p.strip()]
            if disease_phrases:
                # Limit phrases if needed
                if len(disease_phrases) > max_phrases:
                    disease_phrases = random.sample(disease_phrases, max_phrases)
                
                for phrase in disease_phrases:
                    phrases.append(phrase)
                    owners.append(disease.name)
        
        if not phrases:
            logger.warning("No valid phrases found in disease descriptions")
            return []
        
        # Get text embeddings
        logger.info(f"Processing {len(phrases)} phrases from {len(set(owners))} diseases")
        tok = self.tokenizer(phrases, padding=True, truncation=True, 
                          max_length=128, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            txt_emb = self.model.text_encoder(tok.input_ids, tok.attention_mask)
            txt_emb = F.normalize(txt_emb, dim=-1)
        
        # Calculate similarities with temperature scaling
        with torch.no_grad():
            # Apply temperature scaling from the model
            logits = (self.model.logit_scale.exp() * img_emb @ txt_emb.T).squeeze(0)
            
            # Normalize to 0-1 range for easier interpretation
            sims = logits
            sims_min, sims_max = sims.min(), sims.max()
            sims_norm = ((sims - sims_min) / (sims_max - sims_min + 1e-8)).cpu().numpy()
        
        # Aggregate by disease
        dz_sims = defaultdict(list)
        dz_phrases = defaultdict(list)
        
        for sim, phrase, disease_name in zip(sims_norm, phrases, owners):
            dz_sims[disease_name].append(sim)
            dz_phrases[disease_name].append((sim, phrase))
        
        # Calculate mean score for each disease
        dz_mean = {dz: float(np.mean(sims)) for dz, sims in dz_sims.items()}
        
        # Get top diseases
        top_diseases = sorted(dz_mean.items(), key=lambda x: x[1], reverse=True)[:top_k]
        
        # Format results
        results = []
        for disease_name, score in top_diseases:
            # Get best phrase for this disease
            disease_phrase_pairs = dz_phrases[disease_name]
            disease_phrase_pairs.sort(key=lambda x: x[0], reverse=True)
            best_phrase = disease_phrase_pairs[0][1]
            
            # Add confidence label for logging
            confidence = self._get_confidence_label(score)
            logger.info(f"Disease: {disease_name}, Score: {score:.3f}, Confidence: {confidence}")
            
            results.append({
                "disease_name": disease_name,
                "score": score,
                "best_phrase": best_phrase
            })
        
        logger.info(f"Classification complete. Found {len(results)} matching diseases.")
        return results