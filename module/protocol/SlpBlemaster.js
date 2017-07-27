var SmartLockException = require('./ExceptionErrno').SmartLockException;
var SlpBlemaster = function() {
}

SlpBlemaster.TYPE_DISCOVERY = 0x01;
SlpBlemaster.TYPE_LIST = 0x05;
SlpBlemaster.TYPE_CONNECT = 0x03;
SlpBlemaster.TYPE_DISCONNECT = 0x04;
SlpBlemaster.TYPE_REBOOT = 0x7e;
SlpBlemaster.TYPE_EXCEPTION = 0xfe;


SlpBlemaster.ERRNO_CONNECT_ALREADY = 0x02;
SlpBlemaster.ERRNO_DISCONNECT_ALREADY = 0x00;
SlpBlemaster.ERRNO_REJECT_DATA = -4;

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
            var errno = slp.data.readInt8(0);
            if (SlpBlemaster.ERRNO_CONNECT_ALREADY == errno) {
                callback.onSmlockExceptionEvent({deviceId: deviceId, errno: SmartLockException.ERRNO_CONNECT_ALREADY});
                break;
            }
            if (callback.onConnectEvent) callback.onConnectEvent({deviceId: deviceId, errno: errno});
            break;
        }
        case SlpBlemaster.TYPE_DISCONNECT: {
            var errno = slp.data.readInt8(0);
            if (SlpBlemaster.ERRNO_DISCONNECT_ALREADY == errno) {
                callback.onSmlockExceptionEvent({deviceId: deviceId, errno: SmartLockException.ERRNO_DISCONNECT_ALREADY});
                break;
            }
            if (callback.onDisconnectEvent) callback.onDisconnectEvent({deviceId: deviceId, errno: 0});
            break;
        }
        case SlpBlemaster.TYPE_EXCEPTION: {
            var errno = slp.data.readInt8(0);
            if (SlpBlemaster.ERRNO_REJECT_DATA == errno) {
                callback.onSmlockExceptionEvent({deviceId: deviceId, errno: SmartLockException.ERRNO_NOT_CONNECTED});
                break;
            }
            callback.onSmlockExceptionEvent({deviceId: deviceId, errno: 0});
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
    var buf2 = Buffer.from(addr.replace(/:/g,""), "hex");
    buf2 = abc2cba(buf2);
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

function abc2cba(buf) {
    var len = buf.length;
    var buf2 = Buffer.alloc(len);
    for(i = 0; i < len; i++) {
        buf2[len - 1 - i] = buf[i];
    }
    return buf2;
}
exports.SlpBlemaster = SlpBlemaster;