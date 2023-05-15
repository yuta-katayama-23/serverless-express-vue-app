import express from 'express';
import appRoot from 'app-root-path';

const app = express();
app.use(express.static('dist'));

app.get('*', (req, res) => {
	res.sendFile(appRoot.resolve('dist/index.html'));
});

export default app;
