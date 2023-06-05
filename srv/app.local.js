import chalk from 'chalk';
import app from './app.js';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log();
	console.log('  ♻️  Server running at:');
	console.log(`    - Local:   ${chalk.cyan(`http://localhost:${PORT}`)}`);
	console.log();
});
