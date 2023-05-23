import config from 'config';
import appRoot from 'app-root-path';
import SequelizeAuto from 'sequelize-auto';
import Sequelize from 'sequelize';
import { DateTime } from 'luxon';

const sequelize = new Sequelize(config.get('sequelize'));

const auto = new SequelizeAuto(sequelize, null, null, {
	directory: appRoot.resolve('/srv/models-auto'),
	caseFile: 'l',
	caseModel: 'c',
	caseProp: 'c',
	lang: 'esm',
	singularize: true,
	views: true,
	additional: { timestamps: false }
});

let td = await auto.build();

Object.keys(td.tables).forEach((tableName) => {
	const isView = tableName.startsWith('v');
	const columns = td.tables[tableName];

	if (columns.id && isView) delete columns.id.defaultValue;

	if (columns.created_at) {
		columns.created_at.get = function () {
			return DateTime.fromJSDate(
				this.getDataValue('createdAt')
			).toUnixInteger();
		};
		if (!isView) {
			columns.created_at.set = function (v) {
				this.setDataValue(
					'createdAt',
					v ? DateTime.fromSeconds(v).toFormat('yyyy-LL-dd HH:mm:ss') : null
				);
			};
		}
		if (isView && columns.created_at.defaultValue)
			delete columns.created_at.defaultValue;
	}
});

td = auto.relate(td);
const tt = auto.generate(td);
td.text = tt;

const addImport = (text, importModules) => {
	let t = text;
	importModules.forEach((module) => {
		const matchResult = text.match(module.name);
		if (!matchResult && !Array.isArray(matchResult)) return;
		const target = `const { Model, Sequelize } = _sequelize;\n`;
		t = module.nameImport
			? t.replace(
					target,
					`import { ${module.name} } from '${module.path}';\n${target}`
			  )
			: t.replace(
					target,
					`import ${module.name} from '${module.path}';\n${target}`
			  );
	});

	return t;
};
Object.keys(td.text).forEach((tableName) => {
	td.text[tableName] = addImport(td.text[tableName], [
		{ name: 'DateTime', path: 'luxon', nameImport: true }
	]);

	const addCustomFunc = `toJSON(options = {}) {
        const json = super.toJSON();
        if(options.exclude && Array.isArray(options.exclude))
            options.exclude.forEach((key) => delete json[key]);
        return json;
    }`;

	td.text[tableName] = td.text[tableName].replace(
		/}\n+$/,
		`\n${addCustomFunc}\n}`
	);
});

await auto.write(td);
