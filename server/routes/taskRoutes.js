const express = require('express');
const router = express.Router();
const multer = require('multer');
const taskController = require('../controllers/taskController');

// Thiết lập Multer để xử lý tệp được tải lên
const storage = multer.memoryStorage(); // Lưu trữ dữ liệu của tệp trong bộ nhớ
const upload = multer({ storage: storage });

// Đường dẫn để thêm task với tệp được tải lên
router.post('/add', upload.single('file'), taskController.addTask);

// Các route khác không liên quan đến việc tải lên tệp
router.get('/tasks', taskController.getAllTasks);
router.get('/createdbyTasks', taskController.getCreateByTasks); // Đảm bảo controller tương ứng là getCreateByTasks, không phải getCreateByTasks
router.get('/assignedTasks', taskController.getAssignedTasks);
router.get('/followedTasks', taskController.getFollowedTasks);
router.put('/edit/:id', taskController.editTask);
router.put('/:id', taskController.statusChange); // Endpoint này sẽ thay đổi trạng thái của task, vì vậy đổi tên cho phù hợp
router.delete('/:id', taskController.deleteTask);
router.get('/:id', taskController.getTaskById);

module.exports = router;
