const User = require('../../database/model/user.model');
const Task = require('../../database/model/task.model');


const addTask = async (req, res) => {
	try {
		const { task, id, start_plan, time_start_plan, end_plan, time_end_plan, assign_ids, owner_id, follower_ids, description } = req.body;

		if (!task) {
			return res.status(400).send('Please enter the task!');
		}
		if (task.length < 10) {
			return res.status(400).send('Task must have at least 10 characters');
		}
		if (!assign_ids || assign_ids.length === 0 || !follower_ids || follower_ids.length === 0) {
			return res.status(400).send('Please select assignee and follower');
		}

		const taskDetail = new Task({
			task,
			createdBy: id,
			start_plan,
			time_start_plan,
			end_plan,
			time_end_plan,
			assign_ids,
			owner_id,
			follower_ids,
			description,
		});

		await taskDetail.save();
		// return res.status(200).send(taskDetail);
		return res.status(200).send({ taskDetail, _id: taskDetail._id });
	} catch (error) {
		console.error('Error adding task:', error);
		return res.status(400).send('Task addition failed: ' + error.message); // Trả về thông báo lỗi cụ thể
	}
};

const getAllTasks = async (req, res) => {
	const { id } = req.query;
	try {
		if (!id) return res.status(400).send('User ID is required');
		let user = await User.findOne({ _id: id });
		let tasklist = await Task.find({ $or: [{ assign_ids: user.username }, { follower_ids: user.username }, { createdBy: id }] })
		console.log("AllTasks: User:", user);

		// if (tasklist.length === 0) return res.status(404).send('No tasks found');

		// Add category to each task
		tasklist = tasklist.map(task => {
			let taskObj = task.toObject();
			if (task.createdBy.toString() === id) {
				taskObj.category = 'createdby';
			} else if (task.assign_ids.includes(user.username)) {
				taskObj.category = 'assigned';
			} else if (task.follower_ids.includes(user.username)) {
				taskObj.category = 'followed';
			}
			return taskObj;
		});

		console.log("AllTasks: Task", tasklist);
		return res.status(200).send(tasklist);
	} catch (error) {
		return res.status(400).send(error);
	}
};

// Tất cả Task được tạo bởi user
const getCreateByTasks = async (req, res) => {
	const { id } = req.query;
	try {
		if (!id) return res.status(400).send('User ID is required');
		let tasklist = await Task.find({ createdBy: id })

		// if (tasklist.length === 0) return res.status(404).send('No tasks found');

		// Add category to each task
		tasklist = tasklist.map(task => {
			let taskObj = task.toObject();
			taskObj.category = 'createdby';
			return taskObj;
		});

		console.log("CreatedBy:", tasklist);
		return res.status(200).send(tasklist);
	} catch (error) {
		return res.status(400).send(error);
	}
};

// Tất cả Task được giao cho user thực hiện
const getAssignedTasks = async (req, res) => {
	const { id } = req.query;
	try {
		if (!id) return res.status(400).send('User ID is required');
		// user name của userid, vì assign_ids nhận các username nên ta tìm theo username của user
		let user = await User.findOne({ _id: id });
		console.log("Assigned Tasks: User:", user);
		let tasklist = await Task.find({ assign_ids: user.username })

		// if (tasklist.length === 0) return res.status(404).send('No tasks found');

		// Add category to each task
		tasklist = tasklist.map(task => {
			let taskObj = task.toObject();
			taskObj.category = 'assigned';
			return taskObj;
		});

		console.log("Assigned Tasks: Tasks: ", tasklist);
		return res.status(200).send(tasklist);
	} catch (error) {
		return res.status(400).send(error);
	}
};

// Tất cả Task được giao cho user theo dõi
const getFollowedTasks = async (req, res) => {
	const { id } = req.query;
	try {
		if (!id) return res.status(400).send('User ID is required');
		//
		let user = await User.findOne({ _id: id });
		console.log("Followed Tasks: User:", user);
		let tasklist = await Task.find({ follower_ids: user.username })

		// if (tasklist.length === 0) return res.status(404).send('No tasks found');

		// Add category to each task
		tasklist = tasklist.map(task => {
			let taskObj = task.toObject();
			taskObj.category = 'followed';
			return taskObj;
		});

		console.log("Followed Task: Tasks: ", tasklist);
		console.log("Length: ", tasklist.length);
		return res.status(200).send(tasklist);
	} catch (error) {
		return res.status(400).send(error);
	}
};

const getTaskById = async (req, res) => {
	const { id } = req.query;
	console.log("Received request to get task with ID:", id);
	try {
		if (!id) return res.status(400).send('Task ID is required');

		const task = await Task.findById(id);
		console.log('Task is : ', task);
		if (!task) return res.status(404).send('No task found');

		return res.status(200).send(task);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const editTask = async (req, res) => {
	const { id, task, start_plan, time_start_plan, end_plan, time_end_plan, assign_ids, owner_id, follower_ids, status, description, } = req.body;
	console.log('request body: ', req.body);
	try {
		if (!id) return res.status(400).send('Task ID is required');
		let taskToUpdate = await Task.findById(id);
		if (!taskToUpdate) return res.status(404).send('Task not found');
		////
		if (task) taskToUpdate.task = task;
		if (start_plan) taskToUpdate.start_plan = start_plan;
		if (time_start_plan) taskToUpdate.time_start_plan = time_start_plan;
		if (end_plan) taskToUpdate.end_plan = end_plan;
		if (time_end_plan) taskToUpdate.time_end_plan = time_end_plan;
		if (assign_ids) taskToUpdate.assign_ids = assign_ids;
		if (owner_id) taskToUpdate.owner_id = owner_id;
		if (follower_ids) taskToUpdate.follower_ids = follower_ids;
		if (status) taskToUpdate.status = status;
		if (description) taskToUpdate.description = description;

		await taskToUpdate.save();
		return res.status(200).send(taskToUpdate);
	} catch (error) {
		return res.status(400).send('Task update failed');
	}
};

const statusChange = async (req, res) => {
	const { id, string } = req.body;
	try {
		let task = await Task.findById(id);
		if (!task) return res.status(404).send('Task not found');
		const statusOrder = ['backlog', 'todo', 'doing', 'done'];
		let currentIndex = statusOrder.indexOf(task.status);
		if (string === 'right' && currentIndex < statusOrder.length - 1) {
			task.status = statusOrder[currentIndex + 1];
		} else if (string === 'left' && currentIndex > 0) {
			task.status = statusOrder[currentIndex - 1];
		} else {
			return res.status(400).send('Invalid status change direction');
		}
		await task.save();
		return res.status(200).send(task);
	} catch (error) {
		return res.status(400).send('Status change failed');
	}
};

const deleteTask = async (req, res) => {
	const { id } = req.params;
	try {
		let response = await Task.findByIdAndDelete(id);
		if (!response) return res.status(404).send('Task not found');
		return res.status(200).send('Task deleted successfully');
	} catch (error) {
		return res.status(400).send('Task deletion failed');
	}
};

module.exports = {
	addTask,
	getAllTasks,
	editTask,
	statusChange,
	deleteTask,
	getCreateByTasks,
	getAssignedTasks,
	getFollowedTasks,
	getTaskById,
};
