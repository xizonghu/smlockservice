const TAG = 'WebStarter';
var log = require("./module/log/logcat");

function processJson(strJson) {
    var obj = JSON.parse(strJson);
    if ("cmdSmlockLogin" == obj.TYPE) {
        rpc_rmote.cmdSmlockLogin({deviceId: deviceId, lockId: "\x11\x12\x13\x11\x12\x13", pwd: "111111"});
    }
    else if ("cmdSmlockLogout" == obj.TYPE) {
        rpc_rmote.cmdSmlockLogout({deviceId: deviceId});
    }
    else if ("cmdSmlockOpenDoor" == obj.TYPE) {
        rpc_rmote.cmdSmlockOpenDoor({deviceId: deviceId});
    }
    else if ("cmdSmlockGetUnlocktrace" == obj.TYPE) {
        rpc_rmote.cmdSmlockGetUnlocktrace({deviceId: deviceId, index: 1});
    }
}

var http = require('http');
var url = require("url");
var path = require("path");
var strIndex = require("./web/test").strIndex;
var hostname = "localhost";
var port = 7777;

http.createServer(function (req, res) {
    // 设置接收数据编码格式为 UTF-8
    req.setEncoding('utf-8');
    var postData = ""; //POST & GET ： name=zzl&email=zzl@sina.com
    // 数据块接收中
    req.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    // 数据接收完毕，执行回调函数
    req.addListener("end", function () {
        console.log('数据接收完毕');
        console.log(postData);
        if ("" == postData) {
            console.log('空');
            return;
        }
        processJson(postData);
    });
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(Buffer.from(strIndex));

}).listen(port, hostname);
console.log("Server running at http://localhost:7777/");
