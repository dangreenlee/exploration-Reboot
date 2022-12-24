# Uses node:16.15.0 as a base image
FROM node:16.15.0

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install any needed packages specified here
RUN npm install better-sqlite3 discord.js@13.0.0

# Set the TOKEN environment variable
ENV TOKEN=your_token_here

# Command to run the app when the container launches
CMD ["node", "bot.js"]