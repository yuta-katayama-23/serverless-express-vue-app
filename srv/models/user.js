import _sequelize from 'sequelize';
import { DateTime } from 'luxon';

const { Model, Sequelize } = _sequelize;

export default class user extends Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
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
					field: 'last_logined_at'
				},
				updatedAt: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
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
