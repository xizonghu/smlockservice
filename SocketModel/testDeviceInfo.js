var DeviceInfo = require('./DeviceInfo').DeviceInfo;
var SmartLockInfo = require('./SmartLockInfo').SmartLockInfo;
var log = require("./logcat");

const TAG = 'testDeviceInfo';

var buffer = new Buffer.from("182e0b27120808020903c559062502020901020611031c0c2238", "hex");
var device = new DeviceInfo(buffer);
var smlock = SmartLockInfo.unpacket(device.getPacket());

log.d(TAG, smlock.toString("json"));

function add(a, b) {
    return a + b;
}
var buf1 = Buffer.from("xizong");
var buf2 = Buffer.from("hu");
var buf = add(buf1, buf2);
log.d(TAG, buf);
