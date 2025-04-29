FROM node:20-alpine AS base
WORKDIR /src

# Install dependencoes
COPY package*.json ./ 
RUN npm install

# Copy rest of the files
COPY . .

# run prisma generate 
RUN npx prisma generate

FROM base AS production

ENV NODE_PATH=./build


RUN npm run start

