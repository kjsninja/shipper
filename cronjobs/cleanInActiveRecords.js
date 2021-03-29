require('dotenv').config({});
require('../lib/basedir');

const Cron = require('../lib/Cron');
const FileModel = require('../models/Files');
const Files = require('../lib/Files');

const job = Cron.addJob(process.env.CRON_SCHED, function() {
  FileModel.getInactiveFiles(process.env.INACTIVE_FILE_TTL || 5).then( async (data) => {
    console.log(`Processing ${data.length} file(s)...`);
    for (let i = 0; i < data.length; i++) {
      const file = data[i];
      console.log(`Deleting file ${file.id}...`);
      const storage = new Files(file.storage);
      await storage.deleteFile(file);
    }
  }).finally( () => {
    console.log('Done processing...');
  });
});

console.log('Starting CRON...');
job.start();
