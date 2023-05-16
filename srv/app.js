import express from 'express';
import appRoot from 'app-root-path';
import compression from 'compression';
import helmet from 'helmet';
import cacheResponseDirective from 'express-cache-response-directive';

import errorResponse from './lib/error-response.js';
import consoleExpressRouting from './lib/console-express-routing.js';
import createRoutes from './routes/index.js';

const app = express();

app.set('trust proxy', 1);

app.use(compression({ level: 1, memLevel: 3 }));
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
app.use(errorResponse());
app.use(cacheResponseDirective());

app.use((req, res, next) => {
	res.cacheControl('no-store');
	next();
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
