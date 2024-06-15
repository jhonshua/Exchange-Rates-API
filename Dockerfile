FROM node:18.13.0

# Download the stable Chrome .deb package
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Install dependencies for Chrome (if needed)
RUN apt-get update && apt-get install -y libnss3 xvfb

# Working directory
WORKDIR /app

# Copy application code
COPY . .

# Install Node.js dependencies
RUN npm install

# Set Chrome as Puppeteer executable (optional, if using Puppeteer)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

EXPOSE 5000

CMD ["npm", "start"]

