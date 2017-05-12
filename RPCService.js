const TAG = 'RPCService';
var log = require("./SocketModel/logcat");
var light_rpc = require('./RPC/index.js');
var controller = require("./DeviceTransceiverController");
var port = 6667;

var rpc = new light_rpc({
    cmdUnlock: function(deviceId){
        log.i(TAG, "cmdUnlock(%s)", deviceId);
        controller.cmdUnlock(deviceId);
    },

    cmdSend: function (deviceId, packet){
        log.i(TAG, "cmdSend(%s)", deviceId);
        controller.cmdSend(deviceId, packet);
    }
});

log.i(TAG, "SmartLock RPC Service listen at port %d", port);
rpc.listen(port);
