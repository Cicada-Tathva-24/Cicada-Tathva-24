# Use an official Node.js runtime as a base image
FROM oven/bun:1 as base 

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN bun install

# Copy the application code into the container
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Define the command to run your app
CMD ["bun", "run","server.js"]

