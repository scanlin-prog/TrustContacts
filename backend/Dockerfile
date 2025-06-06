# Образ сборщика проекта
FROM node:20.18-alpine AS builder

# Указываем нашу рабочую дерикторию
WORKDIR /home/backend/app

# Копируем package.json и package-lock.json внутрь контейнера
COPY package*.json ./

# Устанавливаем зависимости
RUN npm i

# Копируем оставшееся приложение в контейнер
COPY . .

# Устанавливаем Prisma
RUN npm install -g prisma

# Генерируем Prisma client
RUN prisma generate --schema=src/prisma/schema.prisma

#Собираем проект
RUN npm run build

# Образ разработки
FROM node:20.18-alpine AS development

ENV NODE_ENV=development

# Указываем нашу рабочую дерикторию
WORKDIR /home/backend/app

# Копируем только необходимые файлы из этапа builder
COPY --from=builder /home/backend/app/package*.json ./

RUN npm i --omit=dev

COPY --from=builder /home/backend/app/build ./
COPY --from=builder /home/backend/app/src/prisma/schema.prisma ./prisma/

# Устанавливаем Prisma
RUN npm install -g prisma

# Генерируем Prisma client
RUN prisma generate

# Порт, который будет использовать контейнер
EXPOSE 3000

# Команда для запуска проекта
CMD ["npm", "start"]