import { BullMonitorExpress } from '@bull-monitor/express';
import Queue from 'bull';
import express from 'express';
import { Redis } from 'ioredis';
import { BullAdapter } from '@bull-monitor/root/dist/bull-adapter';

const redis = new Redis(process.env.REDIS_URL || '');

const port = 4444;
const baseUrl = '/ui';
(async () => {
  const app = express();
  const monitor = new BullMonitorExpress({
    queues: [new BullAdapter(new Queue('extraction', { createClient: () => redis }))],
  });
  await monitor.init();
  app.use(baseUrl, monitor.router);
  app.listen(port, () => console.log(`http://localhost:${port}${baseUrl}`));
})();
