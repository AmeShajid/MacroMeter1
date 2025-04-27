# MacroMeter

An intelligent food tracking system that combines computer vision and weight measurement to automatically calculate macronutrients.

## Project Overview

MacroMeter is a system that:
1. Uses a camera to identify food items
2. Measures food weight using a smart scale
3. Calculates macronutrients based on food type and weight
4. Logs the data to a tracking app or custom dashboard

## Tech Stack

### Hardware Components
- Raspberry Pi
- Camera Module
- Food-grade Scale
- GPIO/Bluetooth Interface

### Software Components
- Backend: Python (FastAPI)
- Frontend: React Native
- AI: TensorFlow/PyTorch for food recognition
- Database: MongoDB
- APIs: USDA FoodData Central

## Project Structure
```
MacroMeter/
├── hardware/           # Hardware interface code
│   ├── scale/         # Scale communication
│   └── camera/        # Camera interface
├── ai/                # AI model and food recognition
│   ├── models/        # Trained models
│   └── inference/     # Inference code
├── backend/           # FastAPI backend
│   ├── api/          # API endpoints
│   ├── models/       # Database models
│   └── services/     # Business logic
├── frontend/          # React Native app
│   ├── src/          # Source code
│   └── assets/       # Static assets
└── docs/             # Documentation
```

## Setup Instructions

### Hardware Setup
1. Connect the camera module to Raspberry Pi
2. Connect the food scale (via GPIO or Bluetooth)
3. Install required drivers and dependencies

### Software Setup
1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set up the AI model:
```bash
cd ai
python setup_model.py
```

3. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

4. Start the frontend:
```bash
cd frontend
npm install
npm start
```

## Development Workflow
1. Create a new branch for your feature
2. Make changes and test locally
3. Submit a pull request
4. Get code reviewed
5. Merge to main

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
MIT License 