var deviceService = require('./module/spi/DeviceService');
var log = require("./module/log/logcat");
var SLP = require('./module/protocol/SLP').SLP;
var SlpSmartlock = require('./module/protocol/SlpSmartlock').SlpSmartlock;
var SlpBlemaster = require('./module/protocol/SlpBlemaster').SlpBlemaster;

const TAG = 'DeviceTransceiverController';

//来自远程调用的回调函数
var rpcCallbk = null;
var smlockpwd;

//当有BLE_MASTER过来的消息时，该listenner被触发
var listenner = {
    onConnectEvent: function(obj) {
        cmdSend(obj.deviceId, SlpSmartlock.login(smlockpwd));
    },
    onDisconnectEvent: function(obj) {
        rpcCallbk.onSmlockLogoutEvent(obj);
    },
    onLoginEvent: function(obj) {
        rpcCallbk.onSmlockLoginEvent(obj);
    },
    onLogoutEvent: function(obj) {
        cmdSend(obj.deviceId, SlpBlemaster.disconncet());
    },
    onOpenDoorEvent: function(obj) {
        rpcCallbk.onSmlockOpenDoorEvent(obj);
    },
    onGetBatteryEvent: function(obj) {
        rpcCallbk.onSmlockGetBatteryEvent(obj);
    },
    onGetStorageEvent: function(obj) {
        rpcCallbk.onSmlockGetStorageEvent(obj);
    },
    onGetUnlocktraceEvent: function(obj) {
        rpcCallbk.onSmlockGetUnlocktraceEvent(obj);
    }
}

var api = {
    cmdSmlockOpenDoor: function(obj){
        cmdSend(obj.deviceId, SlpSmartlock.openDoor());
    },

    cmdSmlockGetBattery: function(obj){
        cmdSend(obj.deviceId, SlpSmartlock.getBattery());
    },

    cmdSmlockGetStorage: function(obj){
        cmdSend(obj.deviceId, SlpSmartlock.getStorage());
    },

    cmdSmlockGetUnlocktrace: function(obj){
        cmdSend(obj.deviceId, SlpSmartlock.getUnlocktrace(obj.index));
    },

    cmdSmlockLogin: function(obj) {
        smlockpwd = obj.pwd;
        cmdSend(obj.deviceId, SlpBlemaster.connect(obj.lockid));
    },

    cmdSmlockLogout: function(obj) {
        cmdSend(obj.deviceId, SlpSmartlock.logout());
    },

    ackSmlockEvent: function(obj) {
        rpcCallbk = obj;
    }
};

function receiverCallbk (deviceId, data) {
    //log.i(TAG, "onReceiver(%s): data = %s", deviceId, data.toString("hex"));
    var slp = SLP.toObject(data);
    log.i(TAG, "onReceiver(%s): link = %d", deviceId, slp.link);

    //来自网关蓝牙
    if (SLP.LINK_BLEMASTER_TO_SEVER == slp.link) {
        //SlpBlemaster.process(slp, listenner.SlpBlemasterCallbk);
        SlpBlemaster.process(deviceId, slp, listenner);
    }
    //来自指纹锁
    else if (SLP.LINK_SMLOCK_TO_SERVER == slp.link) {
        SlpSmartlock.process(deviceId, slp, listenner);
    }
}

function connectCallbk (deviceId) {
    log.i(TAG, "onConnect(%s): device connect", deviceId);
    //db.addDeviceInfo(deviceId);
}

function disconnectCallbk (deviceId) {
    log.i(TAG, "onDisconnet(%s): device disconnect", deviceId);
}

function cmdSend(deviceId, packet) {
    log.d(TAG, "cmdSend(): deviceId = %s", deviceId);
    deviceService.send(deviceId, packet);
}

function ackSmlock(listenner) {
    SmartlockListenner = listenner;
}

function ackBlemaster(listenner) {
    BlemasterListenner = listenner;
}

log.i(TAG, "start");
deviceService.onReceiver(receiverCallbk);
deviceService.onConnect(connectCallbk);
deviceService.onDisconnet(disconnectCallbk);

//var s = SlpSmartlock.login("123456");
//s = SlpBlemaster.connect("122334455667");
//var s = SlpSmartlock.getUnlocktrace(1);
//api.cmdSmlockLogin({deviceId: "SSSSSSSSSSSS", lockid: [1,2,3,4,5,6], pwd: [7,7,7,7,7,7]});
//receiverCallbk("123456789", Buffer.from([0x55, 0xd1, 0x01, 0x01, 0x01]));
//exports.cmdSend = cmdSend;
//exports.ackSmlock = ackSmlock;
//exports.ackBlemaster = ackBlemaster;
exports.api = api;