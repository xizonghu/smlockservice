const TAG = 'DatabaseService';

var log = require("../log/logcat");
var light_rpc = require('../rpc/index.js');
var ip = "localhost";
var port = 6668;
var rpc = new light_rpc();

//标记是调试还是上线
var PROJECT_RUN_MODE = "debug";//"online"; //"debug";

if (PROJECT_RUN_MODE == "online") {
    function addLockInfo(lockInfo) {
        log.i(TAG, "addLockInfo(): " + lockInfo);
        rpc.connect(port, ip, function (remote, conn) {
            remote.addLockInfo(lockInfo, function () {
            });
            conn.destroy();
            conn.end();
        });
    }

    function addLockOpenInfo(lockOpenInfo) {
        log.i(TAG, "addLockOpenInfo(): " +  lockOpenInfo);
        rpc.connect(port, ip, function (remote, conn) {
            remote.addLockOpenInfo(lockOpenInfo, function () {
            });
            conn.destroy();
            conn.end();
        });
    }

    function addLockUserInfo(lockUserInfo) {
        log.i(TAG, "addLockUserInfo():" + lockUserInfo);
        rpc.connect(port, ip, function (remote, conn) {
            remote.addLockUserInfo(lockUserInfo, function (error, result) {
                log.i(TAG, "addLockUserInfo():" + error + "|" + result);
            });
            conn.destroy();
            conn.end();
        });
    }
}
else if (PROJECT_RUN_MODE == "debug") {
    function addLockInfo(lockInfo) {
        log.i(TAG, "addLockInfo():" + lockInfo);
    }

    function addLockOpenInfo(lockOpenInfo) {
        log.i(TAG, "addLockOpenInfo():" + lockOpenInfo);
    }

    function addLockUserInfo(lockUserInfo) {
        log.i(TAG, "addLockUserInfo():" + lockUserInfo);
    }
}

function addDeviceId(deviceId) {
    var info = {"lock_id": deviceId};
    addLockInfo(info);
}

function addBattery(deviceId, bat) {
    var info = {"lock_id": deviceId,
        "electricity": bat.toString(10)
    };
    addLockInfo(info);
}

function addStorage(deviceId, sumPWD, sumFP, sumIC) {
    var info = {"lock_id": deviceId,
        "passwd_num": sumPWD.toString(10),
        "fingerprint_num": sumFP.toString(10),
        "ic_num": sumIC.toString(10)
    };
    addLockInfo(info);
}

function addVendor(deviceId) {
    var info = {"lock_id": deviceId};
    addLockUserInfo(info);
}

function addDeviceInfo(deviceId) {
    var info = {"lock_id": deviceId};
    addLockUserInfo(info);
}

function addUnlock(deviceId, oUnlcokInfo) {
    var info = {"lock_id": deviceId,
        "lock_user_id1": oUnlcokInfo.user1Id,
        "lock_user_id2": oUnlcokInfo.user2Id,
        "lock_mode": oUnlcokInfo.typeUnlock,
        "open_time": new Date()
    };
    addLockOpenInfo(info);
}

addStorage("abc",1,2,3);
exports.addDeviceId = addDeviceId;
exports.addBattery = addBattery;
exports.addStorage = addStorage;
exports.addUnlock = addUnlock;
exports.addVendor = addVendor;
exports.addDeviceInfo = addDeviceInfo;
