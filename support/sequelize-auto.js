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

	/**
	 * 日付関係
	 */
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

	if (columns.updated_at) {
		columns.updated_at.get = function () {
			return DateTime.fromJSDate(
				this.getDataValue('updatedAt')
			).toUnixInteger();
		};
		if (!isView) {
			columns.updated_at.set = function (v) {
				this.setDataValue(
					'updatedAt',
					v ? DateTime.fromSeconds(v).toFormat('yyyy-LL-dd HH:mm:ss') : null
				);
			};
		}
		if (isView && columns.updated_at.defaultValue)
			delete columns.updated_at.defaultValue;
	}

	if (columns.last_logined_at) {
		columns.last_logined_at.get = function () {
			return DateTime.fromJSDate(
				this.getDataValue('lastLoginedAt')
			).toUnixInteger();
		};
		if (!isView) {
			columns.last_logined_at.set = function (v) {
				this.setDataValue(
					'lastLoginedAt',
					v ? DateTime.fromSeconds(v).toFormat('yyyy-LL-dd HH:mm:ss') : null
				);
			};
		}
		if (isView && columns.last_logined_at.defaultValue)
			delete columns.last_logined_at.defaultValue;
	}

	/**
	 * enum関係
	 */
	if (columns.account_type_id) {
		columns.account_type = { type: 'DataTypes.VIRTUAL' };
		columns.account_type.get = function () {
			return this.getDataValue('accountTypeId') === '1'
				? 'personal'
				: 'business';
		};
		if (!isView) {
			columns.account_type.set = function (v) {
				this.setDataValue('accountTypeId', v === 'personal' ? 1 : 2);
			};
		}
	}

	if (columns.gender_id) {
		columns.gender = { type: 'DataTypes.VIRTUAL' };
		columns.gender.get = function () {
			switch (this.getDataValue('genderId')) {
				case 1:
					return 'male';
				case 2:
					return 'female';
				case 3:
					return 'notselect';
				default:
					return null;
			}
		};
		if (!isView) {
			columns.gender.set = function (v) {
				switch (v) {
					case 'male':
						this.setDataValue('genderId', 1);
						break;
					case 'female':
						this.setDataValue('genderId', 2);
						break;
					case 'notselect':
						this.setDataValue('genderId', 3);
						break;
					default:
						this.setDataValue('genderId', null);
				}
			};
		}
	}

	/**
	 * その他
	 */
	if (tableName === 'users') {
		columns.full_name = { type: 'DataTypes.VIRTUAL' };
		columns.full_name.get = function () {
			return `${this.getDataValue('firstName')} ${this.getDataValue(
				'lastName'
			)}`;
		};
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
	td.text[tableName] = td.text[tableName].replace(
		/"DataTypes.VIRTUAL"/g,
		'DataTypes.VIRTUAL'
	);

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
