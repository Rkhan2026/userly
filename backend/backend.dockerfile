# Use the official Node.js 20 image as the base image
# This ensures that the container will have Node.js and npm pre-installed.
FROM node:20

# Set the working directory inside the container
# All subsequent commands will be run relative to this directory.
WORKDIR /app

# Copy the package.json and package-lock.json (if available) to the working directory
# This ensures that only dependency-related files are copied initially for better layer caching.
COPY package*.json ./

# Install the project dependencies
# This installs dependencies defined in package.json, creating the `node_modules` directory.
RUN npm install

# Copy the Prisma directory into the container
# This is needed for Prisma to generate the necessary client code for database interaction.
COPY prisma ./prisma

# Run Prisma's client code generation
# This step prepares Prisma for use in the application.
RUN npx prisma generate

# Copy all remaining files into the working directory in the container
# This includes application code, assets, and any other required files.
COPY . .

# Expose port 4000 to allow external access to the application
# This must match the port the application listens on.
EXPOSE 4000

# Define the default command to run when the container starts
# In this case, the command starts the Node.js application.
CMD ["node", "index.js"]
