import _sequelize from 'sequelize';
import { DateTime } from 'luxon';

const { Model, Sequelize } = _sequelize;

export default class todo extends Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER.UNSIGNED,
					allowNull: false,
					primaryKey: true
				},
				userId: {
					type: DataTypes.INTEGER.UNSIGNED,
					allowNull: false,
					references: {
						model: 'users',
						key: 'id'
					},
					field: 'user_id'
				},
				title: {
					type: DataTypes.STRING(32),
					allowNull: false
				},
				content: {
					type: DataTypes.STRING(256),
					allowNull: true
				},
				isComplete: {
					type: DataTypes.TINYINT,
					allowNull: true,
					defaultValue: 0,
					field: 'is_complete'
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
				}
			},
			{
				sequelize,
				tableName: 'todos',
				timestamps: false,
				indexes: [
					{
						name: 'PRIMARY',
						unique: true,
						using: 'BTREE',
						fields: [{ name: 'id' }]
					},
					{
						name: 'todos_ibfk_1_idx',
						using: 'BTREE',
						fields: [{ name: 'user_id' }]
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
