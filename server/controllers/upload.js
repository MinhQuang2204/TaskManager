const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đường dẫn tới thư mục uploads trong thư mục server
const uploadDirectory = path.join(__dirname, '../../server/uploads');

// Kiểm tra và tạo thư mục nếu không tồn tại
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory)
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'application/pdf' ||                           // PDF
        file.mimetype === 'application/msword' ||                        // Word
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || // Word
        file.mimetype === 'application/vnd.ms-excel' ||                  // Excel
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||      // Excel
        file.mimetype === 'application/vnd.ms-powerpoint' ||             // PowerPoint .ppt
        file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || // PowerPoint .pptx
        file.mimetype === 'text/plain'                                    // Text
    ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({ storage, fileFilter })

module.exports = upload; 