var SlpBlemaster = function() {
}

SlpBlemaster.TYPE_DISCOVERY = 0x01;
SlpBlemaster.TYPE_LIST = 0x05;
SlpBlemaster.TYPE_CONNECT = 0x03;
SlpBlemaster.TYPE_DISCONNECT = 0x04;
SlpBlemaster.TYPE_REBOOT = 0x7e;

SlpBlemaster.process = function (deviceId, slp, callback) {
    switch (slp.type) {
        case SlpBlemaster.TYPE_DISCOVERY: {
            var size = slp.data.readUInt8(0);
            if (callback.onDiscoveryEvent) callback.onDiscoveryEvent(size);
            break;
        }
        case SlpBlemaster.TYPE_LIST: {
            var index = slp.data.readUInt8(0);
            var addr = slp.data.slice(1, 7);
            if (callback.onListEvent) callback.onListEvent(index, addr);
            break;
        }
        case SlpBlemaster.TYPE_CONNECT: {
            var errno = slp.data.readUInt8(0);
            if (callback.onConnectEvent) callback.onConnectEvent({deviceId: deviceId, errno: errno});
            break;
        }
        case SlpBlemaster.TYPE_DISCONNECT: {
            var errno = slp.data.readUInt8(0);
            if (callback.onDisconnectEvent) callback.onDisconnectEvent({deviceId: deviceId, errno: errno});
            break;
        }
        default: {
            if (callback.onUndefinedEvent) callback.onUndefinedEvent(slp.data);
            break;
        }
    }
}

SlpBlemaster.discovery = function() {
    return Buffer.from([0x55, 0x1d, 0x01, 0x00]);
}

SlpBlemaster.connect = function(addr) {
    var buf1 = Buffer.from([0x55, 0x1d, 0x03, 0x06]);
    //var buf2 = Buffer.from(addr, "hex");
    var buf2 = Buffer.from(addr, "ascii");
    var buf = Buffer.concat([buf1, buf2], buf1.length + buf2.length);
    return buf;
}

SlpBlemaster.disconncet = function() {
    return Buffer.from([0x55, 0x1d, 0x04, 0x00]);
}

SlpBlemaster.list = function() {
    return Buffer.from([0x55, 0x1d, 0x05, 0x00]);
}

SlpBlemaster.reboot = function() {
    return Buffer.from([0x55, 0x1d, 0x7e, 0x00]);
}

exports.SlpBlemaster = SlpBlemaster;