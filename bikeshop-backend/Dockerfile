FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Lance le serveur en mode dev (si tu utilises nodemon, change ici)
CMD ["npm", "run", "dev"]