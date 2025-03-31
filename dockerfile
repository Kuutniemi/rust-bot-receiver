# Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate  # Add this to regenerate Prisma Client for the correct environment
EXPOSE 9888
CMD ["node", "app.js"]