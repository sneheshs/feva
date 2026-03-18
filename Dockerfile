
# Use lightweight Python image
FROM python:3.12-slim

# Set environment variables for Flask
ENV FLASK_APP=feva.py
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies and uv (for package + runtime)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential && \
    curl -LsSf https://astral.sh/uv/install.sh | sh && \
    apt-get purge -y curl && apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Add uv to PATH (uv installs to ~/.cargo/bin)
ENV PATH="/root/.cargo/bin:$PATH"

# Copy dependency file (pyproject.toml or requirements.txt)
COPY pyproject.toml ./
COPY . .

RUN /root/.local/bin/uv run download_ffmpeg.py

# Expose Flask port
EXPOSE 5000

# Run the app using uv (for performance)
CMD ["/root/.local/bin/uv", "run", "feva.py", "--port=5000", "--host=0.0.0.0"]
