let crypto = require('crypto');
let fs = require('fs');

module.exports = {
    md5: function(data){
        var result = crypto.createHash('md5').update(data).digest("hex");
        return result;
    },

    delFile: function(filePath){
        fs.unlink(filePath, function(err){
            if(err){
                console.log('文件:'+filePath+'删除失败！');
            }else{
                console.log('文件:'+filePath+'删除成功！');
            }
            
        })
    },

    pathToFileName: function(pathName, mark){
        mark = mark || '\\'
        return pathName.substring(pathName.lastIndexOf(mark)+1, pathName.length)
    }
}

