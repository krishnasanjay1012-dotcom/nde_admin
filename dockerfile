# FROM mcr.microsoft.com/playwright:v1.52.0-noble

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# CMD ["npx", "playwright", "test", "login.spec.js", "--project=chromium"]


FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libnspr4 \
    libnss3 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libgbm-dev \
    libgtk-3-0 \
    libasound2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxshmfence1 \
    libdrm2 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

RUN npm ci

RUN npx playwright install chromium

COPY . .

CMD ["npx", "playwright", "test", "login.spec.js", "--project=chromium"]


