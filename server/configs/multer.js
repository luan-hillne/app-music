const multer = require('multer'); // giup lay kieu du lieu file khi tai len server
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload