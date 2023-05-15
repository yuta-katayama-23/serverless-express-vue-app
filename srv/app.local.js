import chalk from 'chalk';
import app from './app.js';

app.listen(3000, () => {
	console.log();
	console.log('  ♻️  Server running at:');
	console.log(`    - Local:   ${chalk.cyan('http://localhost:3000')}`);
	console.log();
});
