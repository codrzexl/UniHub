#!/bin/bash

echo "========================================"
echo "UniHub Project Startup Script"
echo "========================================"
echo

echo "Starting MongoDB (if installed locally)..."
echo "Note: If you're using MongoDB Atlas, skip this step"
echo

echo "Installing server dependencies..."
cd server
npm install
echo

echo "Creating .env file from template..."
if [ ! -f .env ]; then
    cp env.example .env
    echo ".env file created! Please edit it with your configuration."
else
    echo ".env file already exists."
fi
echo

echo "Starting server..."
gnome-terminal --title="UniHub Server" -- bash -c "npm run dev; exec bash" &
echo

echo "Installing client dependencies..."
cd ../client
npm install
echo

echo "Starting client..."
gnome-terminal --title="UniHub Client" -- bash -c "npm start; exec bash" &
echo

echo "========================================"
echo "Project started successfully!"
echo "========================================"
echo
echo "Server: http://localhost:5000"
echo "Client: http://localhost:3000"
echo
echo "Press any key to exit..."
read -n 1
