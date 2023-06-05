import _sequelize from 'sequelize';
import { DateTime } from 'luxon';

const { Model, Sequelize } = _sequelize;

export default class user extends Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER.UNSIGNED,
					allowNull: false,
					primaryKey: true
				},
				accountTypeId: {
					type: DataTypes.TINYINT,
					allowNull: false,
					comment: '1:personal, 2:business',
					field: 'account_type_id'
				},
				email: {
					type: DataTypes.STRING(128),
					allowNull: false,
					unique: 'email_idx'
				},
				lastName: {
					type: DataTypes.STRING(32),
					allowNull: true,
					field: 'last_name'
				},
				firstName: {
					type: DataTypes.STRING(32),
					allowNull: true,
					field: 'first_name'
				},
				genderId: {
					type: DataTypes.TINYINT,
					allowNull: false,
					comment: '1:male, 2:female, 3:notselect',
					field: 'gender_id'
				},
				lastLoginedAt: {
					type: DataTypes.DATE,
					allowNull: true,
					get() {
						return DateTime.fromJSDate(
							this.getDataValue('lastLoginedAt')
						).toUnixInteger();
					},
					set(v) {
						this.setDataValue(
							'lastLoginedAt',
							v ? DateTime.fromSeconds(v).toFormat('yyyy-LL-dd HH:mm:ss') : null
						);
					},
					field: 'last_logined_at'
				},
				updatedAt: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
					get() {
						return DateTime.fromJSDate(
							this.getDataValue('updatedAt')
						).toUnixInteger();
					},
					set(v) {
						this.setDataValue(
							'updatedAt',
							v ? DateTime.fromSeconds(v).toFormat('yyyy-LL-dd HH:mm:ss') : null
						);
					},
					field: 'updated_at'
				},
				createdAt: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
					get() {
						return DateTime.fromJSDate(
							this.getDataValue('createdAt')
						).toUnixInteger();
					},
					set(v) {
						this.setDataValue(
							'createdAt',
							v ? DateTime.fromSeconds(v).toFormat('yyyy-LL-dd HH:mm:ss') : null
						);
					},
					field: 'created_at'
				},
				accountType: {
					type: DataTypes.VIRTUAL,
					get() {
						return this.getDataValue('accountTypeId') === 1
							? 'personal'
							: 'business';
					},
					set(v) {
						this.setDataValue('accountTypeId', v === 'personal' ? 1 : 2);
					},
					field: 'account_type'
				},
				gender: {
					type: DataTypes.VIRTUAL,
					get() {
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
					},
					set(v) {
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
					}
				},
				fullName: {
					type: DataTypes.VIRTUAL,
					get() {
						return `${this.getDataValue('firstName')} ${this.getDataValue(
							'lastName'
						)}`;
					},
					field: 'full_name'
				}
			},
			{
				sequelize,
				tableName: 'users',
				timestamps: false,
				indexes: [
					{
						name: 'PRIMARY',
						unique: true,
						using: 'BTREE',
						fields: [{ name: 'id' }]
					},
					{
						name: 'email_idx',
						unique: true,
						using: 'BTREE',
						fields: [{ name: 'email' }]
					}
				]
			}
		);
	}

	toJSON(options = {}) {
		const json = super.toJSON();
		if (options.exclude && Array.isArray(options.exclude))
			options.exclude.forEach((key) => delete json[key]);
		return json;
	}
}
