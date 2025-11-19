const multer = require('multer');

module.exports.uploadFile = (fileId,loc="./public/general/") => multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if(req?.query?.location){
                cb(null, `./public/${req.query.location}/`)
            }else{
                cb(null, loc)
            }
        },
        filename: (req, file, cb) => {
            const ext = file.originalname.split(".").pop();
            cb(null, Date.now() + "." + ext)
        }
    })
}).single(fileId);
