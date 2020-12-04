const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey,
});

const deleteFolderRecursive = (xpath) => {
  if (fs.existsSync(xpath)) {
    fs.readdirSync(xpath).forEach((file, _index) => {
      const curPath = path.join(xpath, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(xpath);
  }
};

const deleteS3 = (file, cb) => {
  if (process.env.NODE_ENV === 'production') {
    let params = {
      Bucket: config.s3.bucket,
      Prefix: file,
    };
    s3.listObjects(params, (err, data) => {
      if (err) { return cb(err); }

      if (data.Contents.length === 0) { return cb(); }

      params = { Bucket: config.s3.bucket };
      params.Delete = { Objects: [] };

      data.Contents.forEach((content) => {
        params.Delete.Objects.push({ Key: content.Key });
      });

      s3.deleteObjects(params, (err, data) => {
        if (err) { return cb(err); }
        if (data.Contents && data.Contents.length === 1000) {
          deleteS3(file, cb);
        } else { cb(); }
      });
    });
  } else {
    deleteFolderRecursive(`./public/${file}`);
    cb();
  }
};
exports.deleteS3 = deleteS3;
