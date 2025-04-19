# Use Python base image
FROM python:3.9

# Install tesseract for OCR
RUN apt-get update && apt-get install -y tesseract-ocr

# Set working directory
WORKDIR /app

# Copy all project files into container
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir \
    fastapi uvicorn httpx python-dotenv pillow pytesseract \
    speechrecognition python-multipart pymongo

# Add current path to Python module path
ENV PYTHONPATH=/app

# Run FastAPI app on port 8002
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
