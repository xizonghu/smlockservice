const TAG = 'RPCService';
var log = require("./module/log/logcat");
var light_rpc = require('./module/rpc/index.js');
var controller = require("./DeviceTransceiverController");
var SlpBlemaster = require('./module/protocol/SlpBlemaster').SlpBlemaster;
var SlpSmartlock = require('./module/protocol/SlpSmartlock').SlpSmartlock;
var port = 6667;

var rpc = new light_rpc({
    cmdSmlockOpenDoor: function(obj){
        log.i(TAG, "cmdSmlockOpenDoor()");
        controller.api.cmdSmlockOpenDoor(obj);
    },

    cmdSmlockGetBattery: function(obj){
        log.i(TAG, "cmdSmlockGetBattery()");
        controller.api.cmdSmlockGetBattery(obj);
    },

    cmdSmlockGetStorage: function(obj){
        log.i(TAG, "cmdSmlockGetStorage()");
        controller.api.cmdSmlockGetStorage(obj);
    },

    cmdSmlockGetUnlocktrace: function(obj){
        log.i(TAG, "cmdSmlockGetUnlocktrace()");
        controller.api.cmdSmlockGetUnlocktrace(obj);
    },

    cmdSmlockLogin: function(obj) {
        log.i(TAG, "cmdSmlockLogin()");
        controller.api.cmdSmlockLogin(obj);
    },

    cmdSmlockLogout: function(obj) {
        log.i(TAG, "cmdSmlockLogout()");
        controller.api.cmdSmlockLogout(obj);
    },

    ackSmlockEvent: function(obj) {
        log.i(TAG, "ackSmlockEvent()");
        controller.api.ackSmlockEvent(obj);
    }
});

log.i(TAG, "SmartLock RPC Service listen at port %d", port);
rpc.listen(port);
