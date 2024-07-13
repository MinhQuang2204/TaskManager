import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialTask = localStorage.getItem('task')
	? JSON.parse(localStorage.getItem('task'))
	: null;

const initialState = {
	TaskData: initialTask,
	AllTasks: [],
	//
	CreatedByTasks: [],
	AssignedTasks: [],
	FollowedTasks: [],


	currentTask: null,
	loading: false,
	error: null,
	//

};

export const taskSlice = createSlice({
	name: 'Task',
	initialState,
	reducers: {
		taskAddedSuccessfully: (state, action) => {
			state.AllTasks.push(action.payload);
		},
		taskAddFailure: (state) => {
			return state;
		},
		getAllTaskSuccess: (state, action) => {
			state.AllTasks = action.payload;
		},
		getAllTaskFailure: (state) => {
			return state;
		},
		/////
		getCreatedByTasksSuccess: (state, action) => {
			state.CreatedByTasks = action.payload;
		},
		getCreatedByTasksFailure: (state) => {
			return state;
		},
		getAssignedTasksSuccess: (state, action) => {
			state.AssignedTasks = action.payload;
		},
		getAssignedTasksFailure: (state) => {
			return state;
		},
		getFollowedTasksSuccess: (state, action) => {
			state.FollowedTasks = action.payload;
		},
		getFollowedTasksFailure: (state) => {
			return state;
		},
		// /////
		editTaskSuccess: (state, action) => {
			const updatedTask = action.payload;
			// Cập nhật AllTasks
			const indexAllTasks = state.AllTasks.findIndex(task => task._id === updatedTask._id);
			if (indexAllTasks !== -1) { state.AllTasks[indexAllTasks] = updatedTask; }

			// Cập nhật CreatedByTasks
			const indexCreatedByTasks = state.CreatedByTasks.findIndex(task => task._id === updatedTask._id);
			if (indexCreatedByTasks !== -1) { state.CreatedByTasks[indexCreatedByTasks] = updatedTask; }

			// Cập nhật AssignedTasks
			const indexAssignedTasks = state.AssignedTasks.findIndex(task => task._id === updatedTask._id);
			if (indexAssignedTasks !== -1) { state.AssignedTasks[indexAssignedTasks] = updatedTask; }

			// Cập nhật FollowedTasks
			const indexFollowedTasks = state.FollowedTasks.findIndex(task => task._id === updatedTask._id);
			if (indexFollowedTasks !== -1) { state.FollowedTasks[indexFollowedTasks] = updatedTask }

		},
		deleteSuccess: (state, action) => {
			state.AllTasks = state.AllTasks.filter(task => task._id !== action.payload);
			state.CreatedByTasks = state.CreatedByTasks.filter(task => task._id !== action.payload);
			state.AssignedTasks = state.AssignedTasks.filter(task => task._id !== action.payload);
			state.FollowedTasks = state.FollowedTasks.filter(task => task._id !== action.payload);
		},
		deleteFail: (state) => {
			return state;
		},

		////
		getTaskByIdStart: (state) => {
			state.loading = true;
			state.error = null;
		},
		getTaskByIdSuccess: (state, action) => {
			state.loading = false;
			state.currentTask = action.payload;
		},
		getTaskByIdFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},

		////

	},
});

export const {
	taskAddFailure,
	taskAddedSuccessfully,
	getAllTaskFailure,
	getAllTaskSuccess,

	////
	getCreatedByTasksSuccess,
	getCreatedByTasksFailure,
	getAssignedTasksSuccess,
	getAssignedTasksFailure,
	getFollowedTasksSuccess,
	getFollowedTasksFailure,
	////

	deleteSuccess,
	deleteFail,
	editTaskSuccess,

	//////
	getTaskByIdStart,
	getTaskByIdSuccess,
	getTaskByIdFailure,
	//////

} = taskSlice.actions;

export default taskSlice.reducer;

export const addTask = (task, id, start_plan, time_start_plan, end_plan, time_end_plan, assign_ids, owner_id, follower_ids, description,) => async (dispatch) => {
	try {
		const taskData = new FormData();
		taskData.append('task', task);
		taskData.append('id', id);
		taskData.append('start_plan', start_plan);
		taskData.append('time_start_plan', time_start_plan);
		taskData.append('end_plan', end_plan);
		taskData.append('time_end_plan', time_end_plan);
		assign_ids.forEach(assign_id => taskData.append('assign_ids[]', assign_id));
		taskData.append('owner_id', owner_id);
		follower_ids.forEach(follower_id => taskData.append('follower_ids[]', follower_id));
		taskData.append('description', description);

		const response = await axios.post('http://localhost:4000/task/add', taskData, {
			headers: {
				'Content-Type': 'multipart/form-data', // Cần thiết lập header 'Content-Type' cho taskData
			},
		});

		if (response.data) {
			const { taskDetail, _id } = response.data; // Lấy taskDetail và _id từ phản hồi
			dispatch(taskAddedSuccessfully(taskDetail)); // Dispatch task details vào store
			return Promise.resolve(_id); // Trả về _id của task đã được thêm vào như một promise được resolve
		}
	} catch (error) {
		dispatch(taskAddFailure());
		return Promise.reject(error); // Return a rejected promise with the error
	}
};

export const getAllTasks = (token, id) => async (dispatch) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: { id },
	};

	try {
		const response = await axios.get('http://localhost:4000/task/tasks', config);
		if (response.data) {
			dispatch(getAllTaskSuccess(response.data));
		}
	} catch (error) {
		dispatch(getAllTaskFailure());
		toast.error('Thất bại khi lấy dữ liệu công việc. Vui lòng thử lại!');
	}
};

///////////////////////
export const getCreatedByTasks = (token, id) => async (dispatch) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: { id },
	};

	try {
		const response = await axios.get('http://localhost:4000/task/createdbyTasks', config);
		if (response.data) {
			dispatch(getCreatedByTasksSuccess(response.data));
		}
	} catch (error) {
		dispatch(getCreatedByTasksFailure());
		toast.error('Thất bại khi lấy dữ liệu công việc. Vui lòng thử lại!');
	}
};

export const getAssignedTasks = (token, id) => async (dispatch) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: { id },
	};

	try {
		const response = await axios.get('http://localhost:4000/task/assignedTasks', config);
		if (response.data) {
			dispatch(getAssignedTasksSuccess(response.data));
		}
	} catch (error) {
		dispatch(getAssignedTasksFailure());
		toast.error('Thất bại khi lấy dữ liệu công việc. Vui lòng thử lại!');
	}
};

export const getFollowedTasks = (token, id) => async (dispatch) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: { id },
	};

	try {
		const response = await axios.get('http://localhost:4000/task/followedTasks', config);
		if (response.data) {
			dispatch(getFollowedTasksSuccess(response.data));
		}
	} catch (error) {
		dispatch(getFollowedTasksFailure());
		toast.error('Thất bại khi lấy dữ liệu công việc. Vui lòng thử lại!');
	}
};


export const editTask = (id, task, start_plan, time_start_plan, end_plan, time_end_plan, assign_ids, owner_id, follower_ids, status, description,) => async (dispatch) => {
	const taskData = { id, task, start_plan, time_start_plan, end_plan, time_end_plan, assign_ids, owner_id, follower_ids, status, description, };
	try {
		const response = await axios.put(`http://localhost:4000/task/edit/${id}`, taskData);
		if (response.data) {
			dispatch(editTaskSuccess(response.data));
			return Promise.resolve(response.data);
		}

	} catch (error) {
		toast.error('Cập nhật thông tin công việc thất bại');
		return Promise.reject();
	}
};

export const getTaskById = (id) => async (dispatch) => {
	dispatch(getTaskByIdStart());
	const config = { params: { id: id } };
	try {
		const response = await axios.get(`http://localhost:4000/task/${id}`, config);
		dispatch(getTaskByIdSuccess(response.data));
	} catch (error) {
		dispatch(getTaskByIdFailure(error.response.data));
		toast.error("Thất bại khi lấy dữ liệu công việc. Vui lòng thử lại!");
	}
};

////////////////////////////

export const arrowClick = (item, string) => async (dispatch) => {
	const taskData = {
		id: item._id,
		status: string,
		string
	};

	try {
		const response = await axios.put(
			`http://localhost:4000/task/${taskData.id}`,
			taskData
		);

		if (response.data) {
			dispatch(editTaskSuccess(response.data)); // Cập nhật state với dữ liệu mới
			toast.success('Đã cập nhật trạng thái công việc mới');
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}
	} catch (error) {
		toast.error('Cập nhật trạng thái công việc thất bại');
		console.log(error);
	}
};

export const deleteItem = (id) => async (dispatch) => {
	try {
		const response = await axios.delete(`http://localhost:4000/task/${id}`);
		if (response.data) {
			dispatch(deleteSuccess(id));
			toast.success('Xoá công việc thành công');
		}
	} catch (error) {
		dispatch(deleteFail());
		toast.error('Lỗi khi xoá công việc, vui lòng thử lại!');
	}
};

