FROM python:3.11-slim
RUN apt-get update && \
    apt-get install -y wget unzip chromium chromium-driver
WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]
