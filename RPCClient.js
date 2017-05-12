const TAG = 'RPCClient';
var log = require("./SocketModel/logcat");
var light_rpc = require('./RPC/index.js');
var port = 6667;
var rpc = new light_rpc();

function cmdLock(deviceId) {
    rpc.connect(port, 'localhost', function(remote, conn){
        remote.cmdUnlock(deviceId);
        conn.destroy();
        conn.end();
    });
}

cmdLock("123456789abc");