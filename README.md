# Shipper

A simple API tool that allows you to download/upload files using Express.

# Prerequisite

Make sure you have `node version v12 or higher`.

# Install

```
npm install
```

# How to run

1. Make sure to update the `.env`.

```
NODE_ENV=development
PORT=3000

UPLOAD_DIR=uploads

# default to disk
# make sure you have upload dir
STORAGE_TYPE=disk

DB_HOST=127.0.0.1
DB_USER=postgres
DB_PASS=password
DB_NAME=shipper       # make sure you have database name called shipper
DB_PORT=5432
```

2. Run the dev

```
# run the migration first
npm run migrate

npm run dev
```

3. Run test

```
npm run test
```

4. Run PROD

```
npm start
```