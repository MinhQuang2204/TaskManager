const mongoose = require('mongoose');

const FileUploadSchema = mongoose.Schema({
    files: [
        {
            fileName: {
                type: String,
                required: true
            },
            filePath: {
                type: String,
                required: true
            },
            fileType: {
                type: String,
                required: true
            },
            fileSize: {
                type: String,
                required: true
            }
        }
    ],
    idtask: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    }
}, {
    timestamps: true
});

const FilesUpload = mongoose.model('FilesUpload', FileUploadSchema);
//
module.exports = FilesUpload;
//