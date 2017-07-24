var SlpSmartlock = function() {
}

SlpSmartlock.TYPE_OPEN_DOOR = 0x01;
SlpSmartlock.TYPE_GET_BATTERY = 0x07;
SlpSmartlock.TYPE_GET_STORAGE = 0x08;
SlpSmartlock.TYPE_GET_UNLOCKTRACE = 0x09;
SlpSmartlock.TYPE_LOGIN = 0x80;
SlpSmartlock.TYPE_LOGOUT = 0x81;


SlpSmartlock.process = function (deviceId, slp, callback) {
    switch (slp.type) {
        case SlpSmartlock.TYPE_OPEN_DOOR: {
            var errno = slp.data.readUInt8(0);
            if (callback.onOpenDoorEvent) callback.onOpenDoorEvent({deviceId: deviceId, errno: errno});
            break;
        }
        case SlpSmartlock.TYPE_GET_BATTERY: {
            var battery = slp.data.readUInt8(0);
            if (callback.onGetBatteryEvent) callback.onGetBatteryEvent({deviceId: deviceId, battery: battery});
            break;
        }
        case SlpSmartlock.TYPE_GET_STORAGE: {
            var fp = slp.data.readUInt16BE(0);
            var ch = slp.data.readUInt16BE(2);
            var ic = slp.data.readUInt16BE(4);
            if (callback.onGetStorageEvent) callback.onGetStorageEvent({deviceId: deviceId, fp: fp, ch: ch, ic: ic});
            break;
        }
        case SlpSmartlock.TYPE_GET_UNLOCKTRACE: {
            var unlocktrace = {
                deviceId: deviceId,
                index: slp.data.readUInt8(0),
                userid: slp.data.readUInt16BE(1),
                year: slp.data.readUInt8(2),
                month: slp.data.readUInt8(3),
                day: slp.data.readUInt8(4),
                hour: slp.data.readUInt8(5),
                minute: slp.data.readUInt8(6),
                second: slp.data.readUInt8(7),
            };
            if (callback.onGetUnlocktraceEvent) callback.onGetUnlocktraceEvent(unlocktrace);
            break;
        }
        case SlpSmartlock.TYPE_LOGIN: {
            var errno = slp.data.readUInt8(0);
            if (callback.onLoginEvent) callback.onLoginEvent({deviceId: deviceId, errno: errno});
            break;
        }
        case SlpSmartlock.TYPE_LOGOUT: {
            var errno = slp.data.readUInt8(0);
            if (callback.onLogoutEvent) callback.onLogoutEvent({deviceId: deviceId, errno: errno});
            break;
        }
        default: {
            if (callback.onUndefinedEvent) callback.onUndefinedEvent(slp.data);
            break;
        }
    }
}

SlpSmartlock.login = function(pwd) {
    var buf1 = Buffer.from([0x55, 0x1f, 0x80, 0x06]);
    //var buf2 = Buffer.from(pwd);
    var buf2 = Buffer.from(pwd, "ascii");
    var buf = Buffer.concat([buf1, buf2], buf1.length + buf2.length);
    return buf;
}

SlpSmartlock.logout = function() {
    return Buffer.from([0x55, 0x1f, 0x81, 0x00]);
}

SlpSmartlock.openDoor = function() {
    return Buffer.from([0x55, 0x1f, 0x01, 0x00]);
}

SlpSmartlock.getBattery = function() {
    return Buffer.from([0x55, 0x1f, 0x07, 0x00]);
}

SlpSmartlock.getStorage = function() {
    return Buffer.from([0x55, 0x1f, 0x08, 0x00]);
}

SlpSmartlock.getUnlocktrace = function(index) {
    var arr = Buffer.alloc(1);
    arr[0] = index;
    var buf1 = Buffer.from([0x55, 0x1f, 0x09, 0x01]);
    var buf2 = Buffer.from(arr);
    var buf = Buffer.concat([buf1, buf2], buf1.length + buf2.length);
    return buf;
}

exports.SlpSmartlock = SlpSmartlock;