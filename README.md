# User Authentication System

This project is a user authentication system built with Node.js, Express, MongoDB, and React. It includes features such as user registration, login, logout, and account deletion. The system uses sessions for managing user authentication.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Deployment Instructions](#deployment-instructions)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features

- User registration with email and password
- User login with session management
- User logout
- Account deletion
- Profile display with user details

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- React
- Axios
- Bootstrap
- Express-session
- CORS

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v14.x or later)
- npm (v6.x or later)
- MongoDB (v4.x or later)

## Setup Instructions

### Backend Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/user-auth-system.git
   cd user-auth-system/backend
Install the dependencies:

Create a .env file in the backend directory and add the following environment variables:

Start the backend server:

Frontend Setup
Navigate to the frontend directory:

Install the dependencies:

Start the frontend development server:

Running the Application
Ensure the backend server is running on http://localhost:4002.
Ensure the frontend development server is running on http://localhost:3000.
Open your browser and navigate to http://localhost:3000.
Deployment Instructions
Backend Deployment
Set up a server (e.g., AWS EC2, DigitalOcean) and install Node.js and MongoDB.

Clone the repository to your server.

Follow the backend setup instructions to install dependencies and configure environment variables.

Use a process manager like PM2 to keep the backend server running:

Frontend Deployment
Build the frontend application:

Serve the static files using a web server (e.g., Nginx, Apache) or a static site hosting service (e.g., Netlify, Vercel).

API Endpoints
User Registration
URL: /api/register
Method: POST
Body:
User Login
URL: /api/login
Method: POST
Body:
User Logout
URL: /api/logout
Method: POST
Delete User Account
URL: /api/user/:email
Method: DELETE
License
This project is licensed under the MIT License. See the LICENSE file for details.

