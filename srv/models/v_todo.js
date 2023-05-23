import _sequelize from 'sequelize';
import { DateTime } from 'luxon';

const { Model, Sequelize } = _sequelize;

export default class vTodo extends Model {
	static init(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					allowNull: false,
					primaryKey: true
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
				userId: {
					type: DataTypes.INTEGER.UNSIGNED,
					allowNull: false,
					field: 'user_id'
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
				updatedAt: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
					field: 'updated_at'
				},
				createdAt: {
					type: DataTypes.DATE,
					allowNull: false,
					get() {
						return DateTime.fromJSDate(
							this.getDataValue('createdAt')
						).toUnixInteger();
					},
					field: 'created_at'
				}
			},
			{
				sequelize,
				tableName: 'v_todos',
				timestamps: false
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
