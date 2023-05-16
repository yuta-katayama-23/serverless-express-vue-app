import { strict as assert } from 'assert';
import lodash from 'lodash';
import Table from 'cli-table3';
import chalk from 'chalk';

const { toUpper } = lodash;

const methodsColors = {
	OPTIONS: 'grey',
	GET: 'green',
	POST: 'blue',
	PUT: 'yellow',
	PATCH: 'yellow',
	DELETE: 'red'
};
const visibleMethods = Object.keys(methodsColors);

const prepareMethods = (methods) =>
	methods
		.filter((method) => visibleMethods.includes(method))
		.sort(
			(first, second) =>
				visibleMethods.indexOf(first) - visibleMethods.indexOf(second)
		)
		.map((method) => chalk[methodsColors[method] || 'default'](method))
		.join(', ');

const createApiRoutesTable = (routingList) => {
	const table = new Table({
		chars: {
			top: '',
			'top-mid': '',
			'top-left': '',
			'top-right': '',
			bottom: '',
			'bottom-mid': '',
			'bottom-left': '',
			'bottom-right': '',
			left: '',
			'left-mid': '',
			mid: '',
			'mid-mid': '',
			right: '',
			'right-mid': '',
			middle: '  '
		},
		style: { 'padding-left': 0, 'padding-right': 0, compact: true }
	});

	Object.keys(routingList).forEach((key) =>
		table.push([
			// 最後の"/"を削除
			`    - ${key.replace(/\/$/, '')}:`,
			prepareMethods(routingList[key])
		])
	);

	return table;
};

export default (options = {}) => {
	assert.ok(options.app, 'app must be required');

	const {
		app: {
			_router: { stack: layers }
		}
	} = options;
	const routingList = {};

	const routerStacks = layers.filter(
		(layer) => layer.handle.stack && layer.name === 'router'
	);
	const routeLayers = layers.filter((layer) => layer.route);

	routerStacks.forEach((routerStack) => {
		const basePath = routerStack.regexp
			.toString()
			.replaceAll('\\', '')
			.replace('/^', '')
			.replace('/?(?=/|$)/i', '');

		routerStack.handle.stack.forEach((stack) => {
			const {
				route: { path, methods }
			} = stack;

			if (routingList[`${basePath}${path}`]) {
				routingList[`${basePath}${path}`].push(
					toUpper(Object.keys(methods).shift())
				);
				return;
			}
			routingList[`${basePath}${path}`] = [
				toUpper(Object.keys(methods).shift())
			];
		});
	});

	routeLayers.forEach((layer) => {
		const {
			route: { path, methods }
		} = layer;

		if (routingList[path]) {
			routingList[path].push(toUpper(Object.keys(methods).shift()));
			return;
		}
		routingList[path] = [toUpper(Object.keys(methods).shift())];
	});

	console.log('  🔀 Api routes found:');
	console.log(createApiRoutesTable(routingList).toString());
};
