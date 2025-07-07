# Makefile for Digital Habits vs Mental Health Analysis

# Define the Python interpreter
PYTHON = python3

# Define the virtual environment directory (using existing .venv at project root)
VENV_DIR = ../.venv

.PHONY: help setup install clean run test lint format

# Default target
all: help

help:
	@echo "Available commands:"
	@echo "  setup     		- Set up the project environment"
	@echo "  install   		- Install dependencies"
	@echo "  clean     		- Clean up generated files"
	@echo "  train_model    - Train the ML model"
	@echo "  serve     		- Start the API server"
	@echo "  test      		- Run tests (when implemented)"
	@echo "  lint      		- Run code linting"
	@echo "  format    		- Format code"

# Set up project environment (use existing .venv)
setup: $(VENV_DIR)/bin/activate

# Create virtual environment and install dependencies
$(VENV_DIR)/bin/activate: requirements.txt
	test -d $(VENV_DIR) || $(PYTHON) -m venv $(VENV_DIR)
	. $(VENV_DIR)/bin/activate && pip install -r requirements.txt
	touch $(VENV_DIR)/bin/activate

# Install dependencies
install: $(VENV_DIR)/bin/activate
	@echo "Dependencies installed successfully"

# Clean up generated files
clean:
	rm -rf results/figures/*.png
	rm -rf results/reports/*.md
	rm -rf results/models/*
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -name "*.pyc" -delete
	@echo "Cleaned generated files"

# train Model
train_model: $(VENV_DIR)/bin/activate
	@echo "Training MindfulTech model..."
	. $(VENV_DIR)/bin/activate && python train_model.py

# Start API server
serve: $(VENV_DIR)/bin/activate
	@echo "🚀 Starting MindfulTech API server..."
	. $(VENV_DIR)/bin/activate && cd api && python app.py

# Run linting (when flake8 is added to requirements)
lint:
	@echo "Linting not configured yet. Add flake8 to requirements.txt"

# Format code (when black is added to requirements)
format:
	@echo "Code formatting not configured yet. Add black to requirements.txt"

# Run tests (when pytest is added)
test:
	@echo "Tests not implemented yet. Add pytest to requirements.txt"