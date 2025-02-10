FROM python:3.12-slim

RUN apt-get update && apt-get install -y libmagic1 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

ENV FLASK_ENV=production
ENV FLASK_APP=run.py
ENV HOST=0.0.0.0
EXPOSE 5000

CMD ["sh", "-c", "flask db upgrade && gunicorn -c gunicorn_config.py run:app"]