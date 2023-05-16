import fs from 'fs';
import appRoot from 'app-root-path';
import lodash from 'lodash';

const { camelCase } = lodash;

export default async () => {
	const routes = {};

	const directoryDirents = fs
		.readdirSync(appRoot.resolve('srv/routes'), { withFileTypes: true })
		.filter((dirent) => !dirent.isFile());

	await Promise.all(
		directoryDirents.map(async (dirent) => {
			const module = await import(`./${dirent.name}/index.js`);
			routes[camelCase(dirent.name)] = module.default;
		})
	);

	return routes;
};
