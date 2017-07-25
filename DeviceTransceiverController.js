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
        log.d(TAG, "onConnectEvent()");
        cmdSend(obj.deviceId, SlpSmartlock.login(smlockpwd));
    },
    onDisconnectEvent: function(obj) {
        log.d(TAG, "onDisconnectEvent()");
        rpcCallbk.onSmlockLogoutEvent(obj);
    },
    onLoginEvent: function(obj) {
        log.d(TAG, "onLoginEvent()");
        rpcCallbk.onSmlockLoginEvent(obj);
    },
    onLogoutEvent: function(obj) {
        log.d(TAG, "onLogoutEvent()");
        cmdSend(obj.deviceId, SlpBlemaster.disconncet());
    },
    onOpenDoorEvent: function(obj) {
        log.d(TAG, "onOpenDoorEvent()");
        rpcCallbk.onSmlockOpenDoorEvent(obj);
    },
    onGetBatteryEvent: function(obj) {
        log.d(TAG, "onGetBatteryEvent()");
        rpcCallbk.onSmlockGetBatteryEvent(obj);
    },
    onGetStorageEvent: function(obj) {
        log.d(TAG, "onGetStorageEvent()");
        rpcCallbk.onSmlockGetStorageEvent(obj);
    },
    onGetUnlocktraceEvent: function(obj) {
        log.d(TAG, "onGetUnlocktraceEvent()");
        rpcCallbk.onSmlockGetUnlocktraceEvent(obj);
    },
    onSmlockExceptionEvent: function(obj) {
        log.d(TAG, "onSmlockExceptionEvent()");
        if (rpcCallbk.onSmlockExceptionEvent) rpcCallbk.onSmlockExceptionEvent(obj);
    },
}

var api = {
    cmdSmlockOpenDoor: function(obj){
        log.d(TAG, "cmdSmlockOpenDoor()");
        cmdSend(obj.deviceId, SlpSmartlock.openDoor());
    },

    cmdSmlockGetBattery: function(obj){
        log.d(TAG, "cmdSmlockGetBattery()");
        cmdSend(obj.deviceId, SlpSmartlock.getBattery());
    },

    cmdSmlockGetStorage: function(obj){
        log.d(TAG, "cmdSmlockGetStorage()");
        cmdSend(obj.deviceId, SlpSmartlock.getStorage());
    },

    cmdSmlockGetUnlocktrace: function(obj){
        log.d(TAG, "cmdSmlockGetUnlocktrace()");
        cmdSend(obj.deviceId, SlpSmartlock.getUnlocktrace(obj.index));
    },

    cmdSmlockLogin: function(obj) {
        log.d(TAG, "cmdSmlockLogin()");
        smlockpwd = obj.pwd;
        cmdSend(obj.deviceId, SlpBlemaster.connect(obj.lockId));
    },

    cmdSmlockLogout: function(obj) {
        log.d(TAG, "cmdSmlockLogout()");
        cmdSend(obj.deviceId, SlpSmartlock.logout());
    },

    ackSmlockEvent: function(obj) {
        log.d(TAG, "ackSmlockEvent()");
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
    //来自通讯服务
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
    deviceService.send(deviceId, packet, function (obj) {
        if (0 != obj.errno) {
            listenner.onSmlockExceptionEvent({deviceId: deviceId, errno: 0x81});
        }
    });
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

//cmdSend("123456",Buffer.from([1,2,3,4,5,6]));
//api.cmdSmlockLogin({deviceId: '0x00000001', lockId: '000001', pwd: '123456'});
//var s = SlpSmartlock.login("123456");
//s = SlpBlemaster.connect("122334455667");
//var s = SlpSmartlock.getUnlocktrace(1);
//api.cmdSmlockLogin({deviceId: "SSSSSSSSSSSS", lockid: [1,2,3,4,5,6], pwd: [7,7,7,7,7,7]});
//receiverCallbk("123456789", Buffer.from([0x55, 0xd1, 0x01, 0x01, 0x01]));
//exports.cmdSend = cmdSend;
//exports.ackSmlock = ackSmlock;
//exports.ackBlemaster = ackBlemaster;
exports.api = api;