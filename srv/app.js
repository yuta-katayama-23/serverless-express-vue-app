import 'dotenv/config';
import express from 'express';
import appRoot from 'app-root-path';
import compression from 'compression';
import helmet from 'helmet';
import cacheResponseDirective from 'express-cache-response-directive';

import expressSession from 'express-session';
import connectDynamodb from 'connect-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import config from 'config';
import CustomHttpError from './lib/custom-http-error.js';
import CustomOpenidClient from './lib/custom-openid-client.js';

import errorResponse from './lib/error-response.js';
import consoleExpressRouting from './lib/console-express-routing.js';
import createRoutes from './routes/index.js';

const nodeEnv = process.env.NODE_ENV;
const app = express();

app.set('trust proxy', 1);

app.use(compression({ level: 1, memLevel: 3 }));
app.use(errorResponse());
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				// for Vue : EvalError: Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive: "script-src 'self'".
				'script-src': ["'self'", "'unsafe-eval'"]
			}
		}
	})
);
app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DynamoDBStore = connectDynamodb(expressSession);
app.use(
	expressSession({
		...config.get('dynamodb.session'),
		secret: process.env.COOKIE_SECRET,
		store: new DynamoDBStore({
			client:
				nodeEnv === 'development' || nodeEnv === 'localdev'
					? new DynamoDBClient({ endpoint: 'http://localhost:4566' })
					: null, // https://github.com/ca98am79/connect-dynamodb/blob/master/lib/connect-dynamodb.js#LL64C53-L64C76
			table: 'serverless-express-vue-app-sessions'
		})
	})
);

app.use(cacheResponseDirective());
app.use((req, res, next) => {
	res.cacheControl('no-store');
	next();
});

const { locals } = app;
locals.errors = { HttpError: CustomHttpError };
locals.authClient = await CustomOpenidClient.init({
	...config.get('auth'),
	client_id: process.env.CLIENT_ID,
	client_secret: process.env.CLIENT_SECRET,
	redirect_uri: process.env.REDIRECT_URI
});

const routes = await createRoutes();
Object.keys(routes).forEach((route) => {
	routes[route]({ app });
});

app.get('*', (req, res) => {
	res.sendFile(appRoot.resolve('dist/index.html'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	res.error(err);
});

consoleExpressRouting({ app });

export default app;
