# Stage 1: Build
FROM node:20.11.0-alpine AS build

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Stage 2: Production
FROM node:20.11.0-alpine

WORKDIR /usr/src/app

# Copy only necessary files from build stage
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/generated ./generated
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/index.js ./
COPY --from=build /usr/src/app/node_modules ./node_modules

# Expose the port the app will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
