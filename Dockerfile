# Multi-runtime image: Node + Python for SportsPredictor
FROM node:20-bullseye

# Install Python3 and pip
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy portfolio app
COPY package*.json ./
RUN npm ci --only=production
COPY . ./

# Copy NFL predictor code from monorepo path
# The build context should include the repo root. Adjust COPY path if building from repo root.
COPY ../sportsPredictor/NFL /app/sportsPredictor/NFL

# Install Python dependencies for NFL
RUN python3 -m venv /app/.venv \
 && . /app/.venv/bin/activate \
 && pip install --no-cache-dir -r /app/sportsPredictor/NFL/requirements.txt

# Environment
ENV PATH="/app/.venv/bin:${PATH}"
ENV PORT=3000

EXPOSE 3000

# Start Node server
CMD ["npm", "start"]


