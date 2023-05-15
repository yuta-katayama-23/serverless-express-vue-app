import serverlessExpress from '@vendia/serverless-express';

import app from './app.js';

// eslint-disable-next-line import/prefer-default-export
export const handler = serverlessExpress({ app });
