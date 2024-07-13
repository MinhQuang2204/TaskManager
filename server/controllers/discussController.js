const Discussion = require('../../database/model/discussion.model');

const addDiscussion = async (req, res) => {
    try {
        const { taskId, userName, content } = req.body;
        if (!taskId || !userName || !content) {
            return res.status(400).send('All fields are required');
        }

        const newDiscussion = new Discussion({ taskId, userName, content });
        await newDiscussion.save();
        return res.status(201).send(newDiscussion);
    } catch (error) {
        console.error('Error adding discussion:', error);
        return res.status(500).send('Error adding discussion');
    }
};

const getDiscussionsByTask = async (req, res) => {
    try {
        const { id } = req.params;
        const discussions = await Discussion.find({ taskId: id });
        return res.status(200).send(discussions);

    } catch (error) {
        console.error('Error fetching discussions:', error);
        return res.status(500).send('Error fetching discussions');
    }
};

const deleteDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        await Discussion.findByIdAndDelete(id);
        return res.status(200).send('Discussion deleted');
    } catch (error) {
        console.error('Error deleting discussion:', error);
        return res.status(500).send('Error deleting discussion');
    }
};

module.exports = { addDiscussion, getDiscussionsByTask, deleteDiscussion };
