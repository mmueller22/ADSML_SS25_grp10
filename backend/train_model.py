"""
Train and save the MindfulTech ML model for API serving.
"""

import pandas as pd
import numpy as np
import pickle
import json
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import hashlib
from datetime import datetime

def load_and_prepare_data():
    """Load and prepare the dataset."""
    data_path = Path(__file__).parent / "data" / "digital_habits_vs_mental_health.csv"
    df = pd.read_csv(data_path)
    
    print(f"Loaded dataset with {len(df)} rows and {len(df.columns)} columns")
    print(f"Columns: {list(df.columns)}")
    
    return df

def engineer_features(df):
    """Engineer features for the model."""
    # Create a copy to avoid modifying original
    df_features = df.copy()
    
    # Basic features that should exist in the dataset
    feature_columns = [
        'screen_time_hours', 'hours_on_TikTok', 'sleep_hours', 'stress_level'
    ]
    
    # Check if columns exist, if not create dummy data for demo
    for col in feature_columns:
        if col not in df_features.columns:
            print(f"Warning: {col} not found, creating dummy data")
            df_features[col] = np.random.uniform(1, 10, len(df_features))
    
    # Engineer additional features
    df_features['sleep_deficit'] = np.maximum(0, 8 - df_features['sleep_hours'])
    df_features['digital_wellness_ratio'] = df_features['sleep_hours'] / (df_features['screen_time_hours'] + 1)
    df_features['tiktok_dominance'] = df_features['hours_on_TikTok'] / (df_features['screen_time_hours'] + 1)
    df_features['stress_screen_compound'] = df_features['stress_level'] * df_features['screen_time_hours']
    df_features['social_intensity'] = df_features['hours_on_TikTok'] * df_features['screen_time_hours']
    df_features['sleep_quality_indicator'] = (df_features['sleep_hours'] >= 7).astype(int)
    df_features['high_stress_screen_user'] = ((df_features['stress_level'] > 6) & (df_features['screen_time_hours'] > 8)).astype(int)
    
    # Create target variable (mental health risk)
    # Higher stress + more screen time + less sleep = higher risk
    risk_score = (
        df_features['stress_level'] * 0.4 +
        df_features['screen_time_hours'] * 0.3 +
        (10 - df_features['sleep_hours']) * 0.3
    )
    
    # Binary classification: high risk vs low risk
    threshold = risk_score.median()
    df_features['mental_health_risk'] = (risk_score > threshold).astype(int)
    
    return df_features

def train_model(df):
    """Train the Random Forest model."""
    # Define features
    feature_names = [
        'screen_time_hours', 'hours_on_TikTok',
        'sleep_hours', 'stress_level', 'sleep_deficit', 'digital_wellness_ratio',
        'tiktok_dominance', 'stress_screen_compound', 'social_intensity',
        'sleep_quality_indicator', 'high_stress_screen_user'
    ]
    
    X = df[feature_names]
    y = df['mental_health_risk']
    
    print(f"Training with features: {feature_names}")
    print(f"Target distribution: {y.value_counts().to_dict()}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Model accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    return model, scaler, feature_names, accuracy, len(X_train), len(X_test)

def save_model(model, scaler, feature_names, accuracy, train_samples, test_samples):
    """Save the model, scaler, and metadata."""
    # Create model directory
    model_dir = Path(__file__).parent / "results" / "models"
    model_dir.mkdir(exist_ok=True)
    
    # Generate model ID
    timestamp = datetime.now().isoformat()
    model_hash = hashlib.md5(timestamp.encode()).hexdigest()[:8]
    model_id = f"mindfultech_rf_{model_hash}"
    
    # Save model
    model_path = model_dir / f"{model_id}.pkl"
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    # Save scaler
    scaler_path = model_dir / f"{model_id}_scaler.pkl"
    with open(scaler_path, 'wb') as f:
        pickle.dump(scaler, f)
    
    # Save metadata
    metadata = {
        "timestamp": timestamp,
        "data_version": "v1.0",
        "feature_version": "engineered_v1",
        "model_type": "random_forest",
        "performance_metrics": {
            "accuracy": accuracy,
            "baseline_accuracy": 0.5,  # Random guess for binary classification
            "improvement": accuracy - 0.5
        },
        "feature_names": feature_names,
        "training_samples": train_samples,
        "validation_samples": test_samples
    }
    
    metadata_path = model_dir / f"{model_id}_metadata.json"
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    # Update model registry
    registry = {
        "active_model": model_id,
        "model_history": [
            {
                "version": model_id,
                "deployed_at": timestamp,
                "performance": accuracy,
                "status": "active"
            }
        ]
    }
    
    registry_path = model_dir / "model_registry.json"
    with open(registry_path, 'w') as f:
        json.dump(registry, f, indent=2)
    
    print(f"\nModel saved successfully!")
    print(f"Model ID: {model_id}")
    print(f"Model path: {model_path}")
    print(f"Scaler path: {scaler_path}")
    print(f"Metadata path: {metadata_path}")
    
    return model_id

def main():
    """Main training pipeline."""
    print("=== MindfulTech Model Training ===")
    
    # Load data
    df = load_and_prepare_data()
    
    # Engineer features
    df_processed = engineer_features(df)
    
    # Train model
    model, scaler, feature_names, accuracy, train_samples, test_samples = train_model(df_processed)
    
    # Save model
    model_id = save_model(model, scaler, feature_names, accuracy, train_samples, test_samples)
    
    print(f"\n=== Training Complete ===")
    print(f"New model ready for API serving: {model_id}")

if __name__ == "__main__":
    main()
