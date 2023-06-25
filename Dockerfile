FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

COPY . .

# Mount the local code directory to the container's /app directory
VOLUME /app

ENV TZ Asia/Kolkata

# Start the app
CMD ["npm", "run", "dev"]
