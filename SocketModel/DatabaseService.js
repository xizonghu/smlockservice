const TAG = 'DatabaseService';

var log = require("./logcat");
var light_rpc = require('../RPC/index.js');
var port = 6668;
var rpc = new light_rpc();

function addLockInfo(lockInfo) {
    log.i(TAG, "addLockInfo(): %s", lockInfo);
    rpc.connect(port, 'localhost', function(remote, conn){
        remote.addLockInfo(lockInfo, function(){});
        conn.destroy();
        conn.end();
    });
}

function addLockOpenInfo(lockOpenInfo) {
    log.i(TAG, "addLockOpenInfo(): %s", lockOpenInfo);
    rpc.connect(port, 'localhost', function(remote, conn){
        remote.addLockOpenInfo(lockOpenInfo, function(){});
        conn.destroy();
        conn.end();
    });
}

function addLockInfo3(lockInfo) {
    log.i(TAG, lockInfo);
}

function addLockOpenInfo3(lockOpenInfo) {
    log.i(TAG, lockOpenInfo);
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

function addUnlock(deviceId, oUnlcokInfo) {
    var info = {"lock_id": deviceId,
        "lock_user_id1": oUnlcokInfo.user1Id,
        "lock_user_id2": oUnlcokInfo.user2Id,
        "lock_mode": oUnlcokInfo.typeUnlock,
        "open_time": new Date()
    };
    addLockOpenInfo(info);
}

exports.addDeviceId = addDeviceId;
exports.addBattery = addBattery;
exports.addStorage = addStorage;
exports.addUnlock = addUnlock;
