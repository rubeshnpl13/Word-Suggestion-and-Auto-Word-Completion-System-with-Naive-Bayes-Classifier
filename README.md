How to Run Locally
1) Prerequisites
Node.js v14+ (recommend current LTS)
MongoDB (local instance or a cloud URI like MongoDB Atlas)
Python (only if backend calls a Python script for predictions) and required Python packages
2) Setup
Clone repository
git clone <repo-url>
cd AutoWord-Detection-System
Install frontend dependencies

cd frontend
npm install
Install backend dependencies

cd ../backend
npm install
Configure backend environment

Create a .env file in backend/ (if required) with:
MONGODB_URI=<your-mongodb-connection-string>
Add any other required variables found in the backend code (e.g., PORT, JWT_SECRET, PYTHON_SCRIPT_PATH)
If Python is used:
Install dependencies (example): pip install -r requirements.txt (if the file exists)
Ensure the backend’s config/path to the Python script or model matches your local paths
3) Start Servers
Start backend
cd backend
npm start
Start frontend

Open a new terminal tab/window
cd frontend
npm start
Access the app

Open: http://localhost:3000
Note: The frontend dev server runs on port 3000 by default (React). If the port is occupied, React may prompt to use another port.
4) Troubleshooting
Frontend cannot reach backend (CORS or 404)
Verify backend is running (default port often 5000 or from .env)
Ensure frontend API base URL points to the backend (e.g., http://localhost:5000)
MongoDB connection errors

Confirm MONGODB_URI is correct and MongoDB is running
For local: mongodb://127.0.0.1:27017/<db-name>
Python script not found or missing packages

Check PYTHON_SCRIPT_PATH or similar env/config
Install Python deps in the same environment you’re using to run the script
5) Scripts Reference (adjust if different in package.json)
Backend
npm start → starts the server
npm run dev → starts with nodemon (if configured)
Frontend

npm start → starts the React dev server
npm run build → production build
6) Environment Variables Example (backend/.env)
Example
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/autoword
PYTHON_SCRIPT_PATH=../model-training/predict.py (only if used)
JWT_SECRET=replace-with-strong-secret (if authentication exists)
