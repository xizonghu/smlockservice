var Smartlock = function() {
}

Smartlock.TYPE_OPEN_DOOR = 0x01;
Smartlock.TYPE_GET_BATTERY = 0x07;
Smartlock.TYPE_GET_STORAGE = 0x08;
Smartlock.TYPE_GET_UNLOCKTRACE = 0x09;

Smartlock.process = function (slp, callback) {
    switch (slp.type) {
        case Smartlock.TYPE_OPEN_DOOR: {
            var errno = slp.data.readUInt8(0);
            if (callback.onOpenDoorEvent) callback.onOpenDoorEvent(errno);
            break;
        }
        case Smartlock.TYPE_GET_BATTERY: {
            var battery = slp.data.readUInt16BE(0);
            if (callback.onGetBatteryEvent) callback.onGetBatteryEvent(battery);
            break;
        }
        case Smartlock.TYPE_GET_STORAGE: {
            var valFP = slp.data.readUInt16BE(0);
            var valTEXT = slp.data.readUInt16BE(2);
            var valIC = slp.data.readUInt16BE(4);
            if (callback.onGetStorageEvent) callback.onGetStorageEvent(valFP, valTEXT, valIC);
            break;
        }
        case Smartlock.TYPE_GET_UNLOCKTRACE: {
            var unlocktrace = {
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
        default: {
            if (callback.onUndefinedEvent) callback.onUndefinedEvent(slp.data);
            break;
        }
    }
}

Smartlock.openDoor = function() {
    return Buffer.from([0x55, 0x1f, 0x01, 0x00]);
}

Smartlock.getBattery = function() {
    return Buffer.from([0x55, 0x1f, 0x07, 0x00]);
}

Smartlock.getStorage = function() {
    return Buffer.from([0x55, 0x1f, 0x08, 0x00]);
}

Smartlock.getUnlocktrace = function(index) {
    return Buffer.from([0x55, 0x1f, 0x09, 0x00, index]);
}

Smartlock.login = function(addr, callback)

exports.Smartlock = Smartlock;