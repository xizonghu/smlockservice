var DeviceInfo = require('./DeviceInfo').DeviceInfo;
var HashMap = require('./HashMap').HashMap;
var log = require("./logcat");

const TAG = 'testHashMap';

var buffer1 = new Buffer.from("182e0b27120808020903c55906250807020901020611031c0c2238", "hex");
var buffer2 = new Buffer.from("xizonghu");
var buffer3 = new Buffer.from("wanyingying");

var map = new HashMap();

map.set("buf1", buffer1);
//map.set("buf2", buffer2);
map.set("buf3", buffer3);

if(map.get("buf2") == null) {
    log.d(TAG, "buf2 null");
} else {
    log.d(TAG, "buf2 %s", map.get("buf2"));
}

map.remove(map.search(buffer2));

log.d(TAG, "buf2 %s", map.get("buf2"));