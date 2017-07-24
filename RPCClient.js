const TAG = 'RPCClient';
var log = require("./module/log/logcat");
var light_rpc = require('./module/rpc/index.js');
var port = 6667;
var rpc = new light_rpc();

var SmartlockListenner = {
    onSmlockLoginEvent: function(obj) {
        log.i(TAG, "onSmlockLoginEvent(): errno = %d", obj.errno);
    },
    onSmlockLogoutEvent: function(obj) {
        log.i(TAG, "onSmlockLogoutEvent(): errno = %d", obj.errno);
    },
    onSmlockOpenDoorEvent: function(obj) {
        log.i(TAG, "onSmlockOpenDoorEvent(): errno = %d", obj.errno);
    },

    onSmlockGetBatteryEvent: function(obj) {
        log.i(TAG, "onSmlockGetBatteryEvent(): battery = %d", obj.battery);
    },

    onSmlockGetStorageEvent: function(obj) {
        log.i(TAG, "onSmlockGetStorageEvent(): fp = %d, ch = %d, ic = %d", obj.fp, obj.ch, obj.ic);
    },

    onSmlockGetUnlocktraceEvent: function(obj) {
        log.i(TAG, "onSmlockGetUnlocktraceEvent(): index = %d, userid = %d", obj.index, obj.userid);
    },

    onSmlockExceptionEvent: function(obj) {
        log.i(TAG, "onSmlockExceptionEvent(): errno = %d", obj.errno);
    }
};

function cmdSmlockLogout(obj) {
    rpc.connect(port, 'localhost', function(remote, conn){
        remote.cmdSmlockLogout(obj);
        conn.destroy();
        conn.end();
    });
}

function cmdSmlockOpenDoor(obj) {
    rpc.connect(port, 'localhost', function(remote, conn){
        remote.cmdSmlockOpenDoor(obj);
        conn.destroy();
        conn.end();
    });
}

function cmdSmlockGetBattery(obj) {
    rpc.connect(port, 'localhost', function(remote, conn){
        remote.cmdSmlockGetBattery(obj);
        conn.destroy();
        conn.end();
    });
}
function cmdSmlockGetStorage(obj) {
    rpc.connect(port, 'localhost', function(remote, conn){
        remote.cmdSmlockGetStorage(obj);
        conn.destroy();
        conn.end();
    });
}

function cmdSmlockGetUnlocktrace(obj) {
    rpc.connect(port, 'localhost', function(remote, conn){
        remote.cmdSmlockGetUnlocktrace(obj);

    });
}

var deviceId = "SSSSSSSSSSSS";
var rpc_rmote =  require("./DeviceTransceiverController").api;
var rpc_conn;

/*rpc.connect(port, 'localhost', function(remote, conn){
    rpc_rmote = remote;
    rpc_conn = conn;
    rpc_rmote.ackSmlockEvent(SmartlockListenner);

    //conn.destroy();
    //conn.end();
});*/

rpc_rmote.ackSmlockEvent(SmartlockListenner);
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
        processJson(postData);
    });
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(Buffer.from(strIndex));

}).listen(3000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3000/');