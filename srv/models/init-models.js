import _sequelize from 'sequelize';
import _todo from './todo.js';
import _user from './user.js';
import _vTodo from './v_todo.js';

const { DataTypes } = _sequelize;

export default function initModels(sequelize) {
	const todo = _todo.init(sequelize, DataTypes);
	const user = _user.init(sequelize, DataTypes);
	const vTodo = _vTodo.init(sequelize, DataTypes);

	todo.belongsTo(user, { as: 'user', foreignKey: 'userId' });
	user.hasMany(todo, { as: 'todos', foreignKey: 'userId' });

	return {
		todo,
		user,
		vTodo
	};
}
