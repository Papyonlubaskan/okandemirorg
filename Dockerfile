# Use the official Node.js 20 image
FROM node:20-alpine

# Force rebuild - Railway cache bust

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set DATABASE_URL for build (Railway will override at runtime)
ENV DATABASE_URL="mysql://root:password@localhost:3306/okandemir"

# Set NODE_ENV for production
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Expose port (Railway will set PORT env var)
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", ".next/standalone/server.js"]