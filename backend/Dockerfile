FROM python:3.12-slim

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requiriments.txt

EXPOSE 5000

ENV FLASK_ENV=production
ENV PORT=5000

CMD ["flask", "--app", "run", "run.py"]