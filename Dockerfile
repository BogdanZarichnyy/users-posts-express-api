# Використовуємо образ лінукс Alpine з версією node 22.17.0
FROM node:22.17.0-alpine

# Вказуємо нашу робочу директорію
WORKDIR /app

# Скопіювати package.json і package-lock.json в середину контейнера
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо решту файлів додатку в контейнер
COPY . .

# Встановити Prisma
RUN npm install -g prisma

# Генеруємо prisma-client
RUN prisma generate

# Копіюємо Prisma schema
COPY prisma/schema.prisma ./prisma/

# Вікриваємо порт 3000 в нашому контейнері
EXPOSE 3000

# Запускаємо сервер
CMD ["npm", "start"]