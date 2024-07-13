const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
	{
		task: { type: String },
		status: {
			type: String,
			enum: ['backlog', 'todo', 'doing', 'done'],
			default: 'backlog',
		},
		start_plan: { type: Date }, // Ngày bắt đầu dự kiến
		time_start_plan: { type: String }, // Giờ bắt đầu dự kiến
		end_plan: { type: Date }, // Ngày kết thúc dự kiến
		time_end_plan: { type: String }, // Giờ kết thúc dự kiến
		assign_ids: [{
			type: mongoose.Schema.Types.String,
			ref: 'User'
		}], // Người thực hiện
		owner_id: {
			type: mongoose.Schema.Types.String,
			ref: 'User'
		}, // Người giao việc
		follower_ids: [{
			type: mongoose.Schema.Types.String,
			ref: 'User'
		}], // Người theo dõi/phối hợp thực hiện
		description: {
			type: String
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
