# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/public /app/public
COPY package*.json ./
COPY vite.config.ts .
COPY index.html .
RUN npm install
EXPOSE 4173
CMD ["npx", "vite", "preview", "--host"]