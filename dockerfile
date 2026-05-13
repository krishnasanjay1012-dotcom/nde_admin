# FROM mcr.microsoft.com/playwright:v1.52.0-noble

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# CMD ["npx", "playwright", "test", "login.spec.js", "--project=chromium"]


# Base image
FROM node:18

# Work directory inside container
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers + dependencies
RUN npx playwright install --with-deps

# Copy full project
COPY . .

# Default command to run tests
CMD ["npx", "playwright", "test", "login.spec.js", "--project=chromium"]



