FROM python:3.12-slim
WORKDIR /app
COPY requiriments.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
ENV FLASK_ENV=production
ENV PORT=5000
CMD ["flask", "--app", "run.py", "run"]