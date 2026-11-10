# Production GPU Dockerfile for Aarogya Drishti MedGemma 1.5 4B Service
FROM nvidia/cuda:12.4.1-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.10 \
    python3-pip \
    libgl1-mesa-glx \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy service code & configs
COPY deployment/medgemma_service_fastapi.py ./main.py
COPY deployment/deployment_config.json ./deployment_config.json
COPY model_weights/ ./model_weights/
COPY preprocessing/ ./preprocessing/

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]

