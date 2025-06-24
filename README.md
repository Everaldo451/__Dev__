# __DEV__

<p>__DEV__ is a full-stack project that represents a course platform and allows teachers
to create courses and students to register for them.</p>

![Status: Development](https://img.shields.io/badge/Status-Development-yellow)

## ⚙️ Tech Stack:

- 🐍 Flask (Python backend with JWT Auth)
- ⚛️ React (Vite) — frontend build served via Nginx
- 🐳 Docker & Docker Compose
- 🧰 Nginx (serves React static files + reverse proxy to Flask API)
- 🐬 MySQL (Database)
- 🧠 Redis (JWT Token Blacklist)

## 📁 Project Structure

- `/frontend`: React app (build artifacts served by Nginx)
- `/backend*`: Flask API with MySQL and Redis integration
- `/frontend/nginx`: Nginx config files (serving React + proxy to backend)
- `/docker-compose.yml`
- `/.env.example`: Environment variables example

## 🧪 Setup and Running

1. **Clone the repository**

```bash
git clone https://github.com/Everaldo451/__Dev__
```

2. Create a `.env` file in the root folder of the project with the variables present in `.env.example`.

3. **Build and run the containers**

```bash
$ docker-compose up -d --build
```

4. **Access the app**

- 🌐 Frontend (React served via Nginx): http://localhost
- 🔙 Backend (Flask API proxied internally): http://localhost:5000 (used internally, not necessarily exposed)

## Authors

- Everaldo Veloso Cavalcanti Junior