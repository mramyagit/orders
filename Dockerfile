FROM node:18.16.0-alpine

# Create app directory
WORKDIR /var/www/orders

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install

EXPOSE 4747
CMD [ "node", "orders.js" ]