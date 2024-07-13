const express = require('express');
const router = express.Router();

const User = require('../../database/model/user.model'); // Đường dẫn đến model
const Task = require('../../database/model/task.model')
const upload = require('../controllers/upload'); // Path đến file cấu hình upload
const fileController = require('../controllers/fileController'); // Path đến file controller
const discussionController = require('../controllers/discussController');

// Route để lấy danh sách user
router.get('/getusers', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Routes để xử lý file 
router.route('/multiupload/edit/:id').put(upload.array('file'), fileController.editMultiFileUpload);
router.route('/multiupload/:id').get(upload.array('file'), fileController.getMultiFileUpload);
router.route('/multiupload').post(upload.array('file'), fileController.multiFileUpload);

// Routes để xử lý discussion
router.post('/adddiscuss', discussionController.addDiscussion);
router.get('/discussions/:id', discussionController.getDiscussionsByTask);
router.delete('deldiscuss/:id', discussionController.deleteDiscussion);

//
router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const tasks = await Task.find({ task: new RegExp(query, 'i') });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
