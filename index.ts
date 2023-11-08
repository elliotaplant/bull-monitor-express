import { BullMonitorExpress } from '@bull-monitor/express';
import Queue from 'bull';
import express from 'express';
import { Redis } from 'ioredis';
import { BullAdapter } from '@bull-monitor/root/dist/bull-adapter';

const port = process.env.PORT || 4444;

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is a required env var');
}

const redis = new Redis(process.env.REDIS_URL);
const bullQueueRegex = /(?<=bull:).*(?=:id)/gm;
const baseUrl = '/ui';

async function updateQueues(monitor: BullMonitorExpress) {
  const bullKeys = await redis.keys('bull:*:id');

  const queueNames: string[] = [];
  for (const bullKey of bullKeys) {
    const parsedQueueName = bullKey.match(bullQueueRegex)?.at(0);
    if (parsedQueueName) {
      queueNames.push(parsedQueueName);
    }
  }
  const queues = queueNames.map(
    (queueName) => new BullAdapter(new Queue(queueName, { createClient: () => redis }))
  );

  monitor.setQueues(queues);
}

async function main(): Promise<void> {
  const app = express();
  const monitor = new BullMonitorExpress({ queues: [] });

  await updateQueues(monitor);

  await monitor.init();

  app.use(baseUrl, monitor.router);

  app.use('/update', async (req, res) => {
    await updateQueues(monitor);
    res.send('Queues updated successfully');
  });
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}${baseUrl}`);
    console.log(`Update queues at http://localhost:${port}/update`);
  });
}

main().catch(console.error);
