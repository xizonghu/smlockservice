var deviceService = require('./SocketModel/DeviceService');
var log = require("./SocketModel/logcat");
var SmartLockInfo = require('./SocketModel/SmartLockInfo').SmartLockInfo;
var UnlockCmd = require('./SocketModel/SmartLockInfo').UnlockCmd;
var db = require("./SocketModel/DatabaseService");

const TAG = 'DeviceTransceiverController';

log.i(TAG, "start");

deviceService.onReceiver(function(deviceId, data) {
    //log.i(TAG, "onReceiver(%s): data = %s", deviceId, data.toString("hex"));
    var lockInfo = SmartLockInfo.unpack(data);
    switch (lockInfo.typePacket) {
        case SmartLockInfo.TYPE_INFO_UNLOCK: {
            db.addUnlock(deviceId, lockInfo.data);
            break;
        }
        case SmartLockInfo.TYPE_INFO_BATTERY: {
            db.addBattery(deviceId,lockInfo.data.battery);
            break;
        }
        case SmartLockInfo.TYPE_INFO_STORAGE: {
            db.addStorage(deviceId,lockInfo.data.valTEXT, lockInfo.data.valFP, lockInfo.data.valIC);
            break;
        }
        case SmartLockInfo.TYPE_UNDEFINED: {
            log.w(TAG, "TYPE_UNDEFINED");
            break;
        }
    }
});

deviceService.onConnect(function(deviceId) {
    log.i(TAG, "onConnect(%s): device connect", deviceId);
});

deviceService.onDisconnet(function(deviceId) {
    log.i(TAG, "onDisconnet(%s): device disconnect", deviceId);
});

function cmdSend(deviceId, packet) {
    deviceService.send(deviceId, packet);
}

function cmdUnlock(deviceId) {
    var pwd = "000000";
    var cmd = new UnlockCmd(pwd);
    var packet = SmartLockInfo.pack(SmartLockInfo.DIRECT_SERVER_TO_CLIENT, SmartLockInfo.TYPE_CMD_UNLOCK, 6, cmd);
    cmdSend(deviceId, packet);
}
exports.cmdSend = cmdSend;
exports.cmdUnlock = cmdUnlock;