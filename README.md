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
PORT=

# PATH TO UPLOAD
UPLOAD_DIR=

# default to disk
# make sure you have upload dir
STORAGE_TYPE=disk

# in minutes
# default 5minutes
INACTIVE_FILE_TTL=5

DB_HOST=127.0.0.1
DB_USER=postgres
DB_PASS=password
DB_NAME=shipper       # make sure you have database name called shipper
DB_PORT=5432

CRON_SCHED=* * * * *

# Ratelimit Time to live in minutes
# Default 1 day
RATELIMIT_TTL=86400

# limit daily download per ip
DAILY_DOWNLOAD=5

# limit daily upload per ip
DAILY_UPLOAD=5

# Path to the json file got from google service account
GOOGLE_APPLICATION_CREDENTIALS=./YOUR/PATH/TO/JSON/config.json

# your bucket name
GCP_BUCKET_NAME=YOUR-BUCKET-NAME
```

2. Run the dev

```
# run the migration first
npm run migrate

npm run dev

# start the cron in separate process
npm run cron
```

3. Run test

```
npm run test
```

4. Run PROD

```
npm start

# start the cron in separate process
npm run cron
```