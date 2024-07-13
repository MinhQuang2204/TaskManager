const mongoose = require('mongoose');

const discussionSchema = mongoose.Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const Discussion = mongoose.model('Discussion', discussionSchema);
module.exports = Discussion;
