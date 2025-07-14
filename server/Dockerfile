FROM node:20-alpine AS base
WORKDIR /src

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the project (compiles TypeScript & generates Prisma client)
RUN npm run build

# Production image
FROM node:20-alpine AS production
WORKDIR /app

# Copy only necessary files from base image
COPY --from=base /src/package*.json ./
COPY --from=base /src/build ./build
COPY --from=base /src/generated ./generated

# Install only production deps
RUN npm install --only=production

# Run the app
CMD ["node", "build/index.js"]
