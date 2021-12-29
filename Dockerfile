FROM node:lts-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci --prod
COPY . .
EXPOSE 3000
CMD ["node", "."]