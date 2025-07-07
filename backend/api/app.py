"""
Flask API server for MindfulTech ML model predictions.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import json
from pathlib import Path
import logging
from typing import Optional, Dict, List, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Model paths
MODEL_DIR = Path(__file__).parent.parent / "results" / "models"
MODEL_REGISTRY_PATH = MODEL_DIR / "model_registry.json"

class MindfulTechPredictor:
    def __init__(self):
        self.model: Optional[Any] = None
        self.scaler: Optional[Any] = None
        self.feature_names: Optional[List[str]] = None
        self.model_metadata: Optional[Dict[str, Any]] = None
        self.load_model()
    
    def load_model(self):
        """Load the active model from the registry."""
        try:
            # Load model registry
            with open(MODEL_REGISTRY_PATH, 'r') as f:
                registry = json.load(f)
            
            active_model_id = registry['active_model']
            logger.info(f"Loading active model: {active_model_id}")
            
            # Load model files
            model_path = MODEL_DIR / f"{active_model_id}.pkl"
            scaler_path = MODEL_DIR / f"{active_model_id}_scaler.pkl"
            metadata_path = MODEL_DIR / f"{active_model_id}_metadata.json"
            
            # Load model and scaler
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            with open(scaler_path, 'rb') as f:
                self.scaler = pickle.load(f)
            
            # Load metadata
            with open(metadata_path, 'r') as f:
                self.model_metadata = json.load(f)
            
            if self.model_metadata:
                self.feature_names = self.model_metadata['feature_names']
                logger.info(f"Model loaded successfully. Features: {self.feature_names}")
            else:
                raise ValueError("Model metadata is empty")
            
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
    
    def engineer_features(self, data):
        """Engineer features from raw input data."""
        df = pd.DataFrame([data])
        
        # Feature engineering based on the model's expected features
        df['sleep_deficit'] = np.maximum(0, 8 - df['sleep_hours'])
        df['digital_wellness_ratio'] = df['sleep_hours'] / (df['screen_time_hours'] + 1)
        df['tiktok_dominance'] = df['hours_on_TikTok'] / (df['screen_time_hours'] + 1)
        df['stress_screen_compound'] = df['stress_level'] * df['screen_time_hours']
        df['social_intensity'] = df['hours_on_TikTok'] * df['screen_time_hours']
        df['sleep_quality_indicator'] = (df['sleep_hours'] >= 7).astype(int)
        df['high_stress_screen_user'] = ((df['stress_level'] > 6) & (df['screen_time_hours'] > 8)).astype(int)
        
        return df
    
    def predict(self, input_data):
        """Make prediction on input data."""
        try:
            # Validate that model and scaler are loaded
            if self.model is None:
                raise ValueError("Model not loaded. Please check model files.")
            if self.scaler is None:
                raise ValueError("Scaler not loaded. Please check scaler files.")
            if self.feature_names is None:
                raise ValueError("Feature names not loaded. Please check metadata files.")
            
            # Engineer features
            df = self.engineer_features(input_data)
            
            # Select only the features the model expects
            feature_data = df[self.feature_names].values
            
            # Scale features
            scaled_features = self.scaler.transform(feature_data)
            
            # Make prediction
            prediction = self.model.predict(scaled_features)[0]
            prediction_proba = self.model.predict_proba(scaled_features)[0]
            
            # Get class names (assuming binary classification)
            classes = self.model.classes_
            
            return {
                'prediction': int(prediction),
                'prediction_label': 'High Risk' if prediction == 1 else 'Low Risk',
                'confidence': float(max(prediction_proba)),
                'probability_scores': {
                    'low_risk': float(prediction_proba[0]),
                    'high_risk': float(prediction_proba[1]) if len(prediction_proba) > 1 else 0.0
                },
                'risk_level': self._calculate_risk_level(prediction_proba),
                'recommendations': self._generate_recommendations(input_data)
            }
            
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            raise
    
    def _calculate_risk_level(self, proba):
        """Calculate risk level based on probability."""
        high_risk_prob = proba[1] if len(proba) > 1 else 0.0
        
        if high_risk_prob < 0.3:
            return 'Low'
        elif high_risk_prob < 0.7:
            return 'Moderate'
        else:
            return 'High'
    
    def _generate_recommendations(self, data):
        """Generate personalized recommendations."""
        recommendations = []
        
        if data['screen_time_hours'] > 8:
            recommendations.append("Consider reducing daily screen time to under 8 hours")
        
        if data['sleep_hours'] < 7:
            recommendations.append("Aim for 7-9 hours of sleep per night for better mental health")
        
        if data['hours_on_TikTok'] > 3:
            recommendations.append("Limit TikTok usage to reduce mental health impact")
        
        if data['stress_level'] > 7:
            recommendations.append("Practice stress management techniques like meditation or exercise")
        
        if not recommendations:
            recommendations.append("Keep up your healthy digital habits!")
        
        return recommendations

# Initialize predictor
predictor = MindfulTechPredictor()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'model_loaded': predictor.model is not None,
        'model_metadata': predictor.model_metadata
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Make prediction endpoint."""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'screen_time_hours', 'hours_on_TikTok', 'sleep_hours', 'stress_level'
        ]
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Make prediction
        result = predictor.predict(data)
        
        return jsonify({
            'success': True,
            'result': result,
            'input_data': data
        })
        
    except Exception as e:
        logger.error(f"Prediction endpoint error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model information."""
    return jsonify({
        'model_metadata': predictor.model_metadata,
        'feature_names': predictor.feature_names,
        'model_type': 'Random Forest Classifier'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8081)
