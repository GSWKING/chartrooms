
const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
let cache = {};

// 1、发送数据及错误响应
function send404(res){
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Error 404: resource not found.');
    res.end();
}

function sendFile(res, filePath, fileContents){
    res.writeHead(
        200,
        {'content-type': mainModule.lookup(path.basename(filePath))}
    );
    res.end(fileContents);
}

function serveStatic(res, cache, absPath){
    if(cache[absPath]){
        sendFile(res, absPath, cache[absPath]);
    }else{
        fs.existsSync(absPath, function(exists){
            if(exists){
                fs.readFile(absPath).then((data)=>{
                    cache[absPath] = data;
                    sendFile(res, absPath, data);
                }).cache((err)=>{
                    send404(res);
                });
            }else{
                send404(res);
            }
        });
    }
}