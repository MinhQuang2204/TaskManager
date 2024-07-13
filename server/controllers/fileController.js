const FilesUpload = require('../../database/model/file.model')
const fs = require('fs');

// Hàm multiFileUpload
const multiFileUpload = async (req, res, next) => {
    console.log("Req body: ", req.body);
    console.log("Req files:", req.files);
    try {
        const { idtask } = req.body;

        const files = req.files.map(file => ({
            fileName: file.filename,
            filePath: file.path,
            fileType: file.mimetype,
            fileSize: file.size.toString()
        }));

        const newUpload = new FilesUpload({
            files,
            idtask
        });

        await newUpload.save();

        res.status(201).json({
            message: 'Multiple files uploaded successfully',
            data: newUpload
        });
    } catch (error) {
        next(error);
    }
};

// Hàm getMultiFileUpload
const getMultiFileUpload = async (req, res, next) => {
    console.log('Req query: ', req.query)
    console.log('Req params: ', req.params)
    console.log('Req body: ', req.body)

    const { id } = req.params; // Lấy idtask từ query parameters

    console.log("Id: ", id)
    try {
        // Nếu không có idtask, trả về lỗi
        if (!id) {
            return res.status(400).json({
                message: 'idtask is required'
            });
        }
        // Tìm các file với idtask cụ thể
        const uploads = await FilesUpload.findOne({ idtask: id });
        // 
        console.log('Uploads: ', uploads)
        //
        res.status(200).json({
            message: 'Files retrieved successfully',
            data: uploads
        });
    } catch (error) {
        next(error);
    }
};

// Edit multitask
const editMultiFileUpload = async (req, res) => {
    const { idtask, object } = req.body;
    const files = req.files.map(file => ({
        fileName: file.filename,
        filePath: file.path,
        fileType: file.mimetype,
        fileSize: file.size.toString()
    }));

    let parsedObjects = [];
    // Kiểm tra nếu object tồn tại
    if (object) {
        // Trường hợp object là một mảng
        if (Array.isArray(object)) {
            parsedObjects = object.map(item => {
                const parsedItem = JSON.parse(item);
                return {
                    fileName: parsedItem.name,
                    filePath: parsedItem.path,
                    fileType: parsedItem.type,
                    fileSize: parsedItem.size
                };
            });
        }
        // Trường hợp object là một đối tượng
        else {
            const parsedItem = JSON.parse(object);
            parsedObjects = [{
                fileName: parsedItem.name,
                filePath: parsedItem.path,
                fileType: parsedItem.type,
                fileSize: parsedItem.size
            }];
        }
        // In kết quả đã phân tích
        console.log('Parsed Objects:', parsedObjects);
    }

    //console.log("ID TASK: ", idtask);
    //console.log("Files: ", files);

    try {
        if (!idtask) return res.status(400).send('Task ID is required');
        let filesToUpdate = await FilesUpload.findOne({ idtask: idtask });
        if (!filesToUpdate) return res.status(404).send('Files not found');

        // Lấy danh sách các tệp hiện tại trong DB
        const currentFiles = filesToUpdate.files;
        const parsedFilePaths = parsedObjects.map(obj => obj.filePath);

        // Xác định các tệp cần xóa
        const filesToDelete = currentFiles.filter(file => !parsedFilePaths.includes(file.filePath));

        // Xóa các tệp từ thư mục tải lên
        filesToDelete.forEach(file => {
            fs.unlink(file.filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', file.filePath, err);
                } else {
                    console.log('Deleted file:', file.filePath);
                }
            });
        });

        // Cập nhật các tệp trong cơ sở dữ liệu
        filesToUpdate.files = [...parsedObjects, ...files];
        await filesToUpdate.save();

        return res.status(201).json({
            message: 'Multiple files uploaded successfully',
            data: filesToUpdate
        });
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(400).send('Task update failed');
    }
};

module.exports = {
    multiFileUpload,
    getMultiFileUpload,
    editMultiFileUpload,
};