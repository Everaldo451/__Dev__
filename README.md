# __DEV__

<p>__DEV__ is a full-stack project that represents a course platform and allows teachers
to create courses and students to register for them.</p>

![Status: Development](https://img.shields.io/badge/Status-Development-yellow)

## Technologies Used:

- Flask
- React
- Vite

## Local Setup Guide

1. Clone the repository:

```bash
git clone https://github.com/Everaldo451/__Dev__
```

2. Create your Python virtual environment:

```bash
cd backend
python -m venv venv
```

3. Activate the virtual environment and install the dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend folder with the variables present in `.env.example`.

5. Run the backend server:

```bash
flask --app run run.py
```

6. In a new terminal window, navigate to the frontend folder and install the React dependencies:

```bash
cd frontend
npm install
```

7. Create a `.env` file in the frontend folder with the variables present in `.env.example`.

8. Run the React application:

```bash
npm run dev
```

## Authors

- Everaldo