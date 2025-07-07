# MindfulTech: Digital Wellness Assessment Platform

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Course Project**: Applied Data Science & Machine Learning  
> **Institution**: Fachhochschule Wedel  
> **Semester**: Summer 2025  
> **Instructor**: Christo Zonnev [@christozonnev](https://github.com/christozonnev)  
> **Group**: ADSML_SS25_grp10

A machine learning-powered web application that analyzes digital habits and provides personalized mental wellness recommendations based on screen time, sleep patterns, stress levels, and social media usage.

# Project Overview

## Goal

This project aims to explore and implement AI/ML concepts within the context of a realistic, practical application that addresses modern digital wellness challenges. Our objectives include:

- **Applied Machine Learning**: Develop hands-on experience with real-world data science workflows, from exploratory data analysis to model deployment
- **End-to-End Development**: Build a complete ML-powered application spanning data processing, model training, API development, and user interface design
- **Practical Problem Solving**: Address the growing concern of screen time and social media impact on mental health through data-driven insights

## Dataset & Methodology

### Data Source
We utilized an interesting dataset from Kaggle: [Digital Habits vs Mental Health Dataset](https://www.kaggle.com/datasets/abhishekdave9/digital-habits-vs-mental-health-dataset) that explores the relationship between screen time and mental well-being.

### Approach
After conducting initial exploratory data analysis and experimenting with various algorithms, we selected the **Random Forest algorithm** for its robustness and interpretability in handling the complex relationships between digital habits and mental health indicators.

### Key Features Analyzed
- **Screen Time Hours**: Daily device usage patterns
- **Sleep Hours**: Sleep quality and duration metrics  
- **Stress Level**: Self-reported stress measurements (1-10 scale)
- **TikTok Usage**: Specific social media platform engagement
- **Engineered Features**: Digital wellness ratios, sleep deficits, and interaction terms

# Architecture

## 📊 Backend (`/backend/`)

**Technologies**: Python, scikit-learn, Flask, pandas, numpy

Contains all data analysis, algorithms, models, and computational components:

- **`data/`** - Dataset files and data resources
- **`src/`** - Core Python modules and utilities including Jupyter notebooks
- **`api/`** - Flask REST API server for ML model predictions
- **`results/`** - Generated outputs, trained models, and analysis figures
- **`train_model.py`** - Model training pipeline and serialization
- **`requirements.txt`** - Python dependencies and package versions
- **`Makefile`** - Build automation and development commands

## 🎨 Frontend (`/frontend/`)

**Technologies**: React, TypeScript, Vite, Tailwind CSS, Shadcn/UI

Modern web application providing an intuitive user interface:

- **Interactive Assessment Form**: Multi-step questionnaire for digital habits data collection
- **Real-time ML Predictions**: Integration with backend API for instant wellness assessments  
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI Components**: Built with Shadcn/UI and styled with Tailwind CSS
- **Type Safety**: Full TypeScript implementation for robust development

## 🔄 ML Pipeline

1. **Data Preprocessing**: Feature engineering and outlier detection
2. **Model Training**: Random Forest classifier with 70/15/15 train/validation/test split
3. **Model Validation**: Cross-validation and performance metrics analysis
4. **Model Deployment**: Serialized model serving via Flask API
5. **Prediction**: Real-time inference with confidence scores and recommendations

# Quick Start

## Prerequisites
- **Python 3.9+** with pip - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** with npm - [Download Node.js](https://nodejs.org/en/download/)
- **Git** for version control - [Download Git](https://git-scm.com/downloads)

## Installation & Setup

### 1. Clone Repository
```bash
git clone <https://github.com/mmueller22/ADSML_SS25_grp10>
cd ADSML_SS25_grp10
```

### 2. Backend Setup
```bash
cd backend
make setup          # Install dependencies and setup environment
make train_model     # Train the ML model (optional - pre-trained model included)
```

### 3. Start API Server
```bash
make serve
# 🚀 API available at http://localhost:8081
```

### 4. Frontend Setup  
```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start development server
# 🌐 Frontend available at http://localhost:8080
```

## Usage

1. **Open the application** in your browser at `http://localhost:8080`
2. **Complete the assessment** by answering questions about your digital habits
3. **View your results** including risk assessment and personalized recommendations
4. **Explore the insights** to understand factors affecting your digital wellness

## API Endpoints

- `GET /health` - Health check and model status
- `GET /model-info` - Model metadata and feature information  
- `POST /predict` - Generate wellness predictions from input data

### Example API Request
```bash
curl -X POST http://localhost:8001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "screen_time_hours": 8,
    "hours_on_TikTok": 2,
    "sleep_hours": 6,
    "stress_level": 7
  }'
```

# Technical Details

## Model Performance
- **Algorithm**: Random Forest Classifier
- **Features**: 11 engineered features from 4 input variables
- **Performance**: ~99% accuracy on test set (note: high accuracy may indicate data characteristics)
- **Validation**: 5-fold cross-validation with 70/15/15 train/validation/test split
- **Output**: Risk classification with confidence scores and personalized recommendations

## Technology Stack
- **Backend**: Python, Flask, scikit-learn, pandas, numpy
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn/UI
- **ML Pipeline**: Jupyter notebooks, pickle serialization, REST API
- **Development**: Makefile automation, ESLint, hot reloading

## Project Structure Details
```
ADSML_SS25_grp10/
├── backend/
│   ├── api/                 # Flask API server
│   ├── data/               # Dataset and data files  
│   ├── src/                # Jupyter notebooks and analysis
│   ├── results/            # Model outputs and figures
│   ├── train_model.py      # Model training pipeline
│   ├── requirements.txt    # Python dependencies
│   └── Makefile           # Build automation
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # API client and utilities
│   │   └── pages/         # Application pages
│   ├── package.json       # Node.js dependencies
│   └── vite.config.ts     # Build configuration
└── README.md              # This file
```

# Contributing

This is an educational project for Applied Data Science & Machine Learning course. While not actively maintained post-course, the codebase serves as a reference implementation.

# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# Acknowledgments

- **Dataset**: [Digital Habits vs Mental Health Dataset](https://www.kaggle.com/datasets/abhishekdave9/digital-habits-vs-mental-health-dataset) from Kaggle
- **Course Instructor**: Christo Zonnev [@christozonnev](https://github.com/christozonnev)
- **Institution**: Fachhochschule Wedel
- **UI Components**: Built with [Shadcn/UI](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/)