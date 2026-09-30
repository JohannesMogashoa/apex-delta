import { inngest } from './client.js';

export const developmentHealthcheck = inngest.createFunction(
  {
    id: 'development-healthcheck',
    triggers: [
      {
        event: 'apex-delta/development.healthcheck',
      },
    ],
  },
  async ({ event, step }) => {
    const ts = await step.run('capture-timestamp', async () => {
      return new Date().toISOString();
    });

    return {
      ok: true,
      timestamp: ts,
      event,
    };
  },
);

export const functions = [developmentHealthcheck];
