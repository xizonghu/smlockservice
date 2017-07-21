var SLP = function(buffer) {
    this.sync = buffer.readUInt8(0);
    this.link = buffer.readUInt8(1);
    this.type = buffer.readUInt8(2);
    this.len = buffer.readUInt8(3);
    this.data = buffer.slice(4, buffer.length);
}

SLP.SYNC = 0x55;

SLP.LINK_SERVER_TO_BLEMASTER = 0x1d;
SLP.LINK_SERVER_TO_SMLOCK = 0x1f;
SLP.LINK_BLEMASTER_TO_SEVER = 0xd1;
SLP.LINK_SMLOCK_TO_SERVER = 0xf1;

SLP.TYPE_BLEMASTER_DISCOVERY = 0x01;
SLP.TYPE_BLEMASTER_LIST = 0x05;
SLP.TYPE_BLEMASTER_CONNECT = 0x03;
SLP.TYPE_BLEMASTER_DISCONNECT = 0x04;
SLP.TYPE_BLEMASTER_REBOOT = 0x7e;

SLP.toBytes = function(link, type, data) {
    var buffer = Buffer.alloc(4 + data.length);
    buffer.fill(SLP.SYNC, 0, 1);
    buffer.fill(link, 1, 2);
    buffer.fill(type, 2, 3);
    buffer.fill(data.length, 3, 4);
    buffer.fill(data, 4, 4 + data.length);
    return buffer;
}

SLP.toObject = function(b) {
    return new SLP(b);
}

exports.SLP = SLP;