var HashMap = require('./HashMap').HashMap;
var log = require("./logcat");
var net = require('net');
var DeviceInfo = require("./DeviceInfo").DeviceInfo;
var Device = require("./Device").Device;
var SmartLockInfo = require("./SmartLockInfo");
var AuthInfo = require("./AuthInfo").AuthInfo;

const TAG = 'DeviceService';

//var HOST = "127.0.0.1";  //"192.168.123.1";//'127.0.0.1';
var PORT = 6666;

var mapSockClient = new HashMap();
var mapDeviceInfo = new HashMap();

var bufRecv = Buffer.alloc(500);
var evtReceiver, evtConnect, evtDisconnect;

function send(deviceId, b) {
    var sock = mapSockClient.get(deviceId);
    if(sock == null) {
        return {"succ": -1, "msg": "device " + deviceId + "offline"};
    }

    var data = DeviceInfo.packet(mapDeviceInfo.get(deviceId), b);
    log.i(TAG, ">>> [%s]", data.toString("hex"));
    sock.write(data);
    return {"succ": 0, "msg": "ok"};
}

function onConnect(callback) {
    if (callback && typeof(callback) === "function") {
        evtConnect = callback;
    }
}

function onReceiver(callback) {
    if (callback && typeof(callback) === "function") {
        evtReceiver = callback;
    }
}

function onDisconnect(callback) {
    if (callback && typeof(callback) === "function") {
        evtDisconnect = callback;
    }
}

net.createServer(function(sockClient) {
    log.i(TAG, 'CONNECTED: ' + sockClient.remoteAddress + ':' + sockClient.remotePort);
    sockClient.on('data', function(data) {
        //log.d(TAG, "RECV [%s][%d][%s]", sockClient.remoteAddress, data.length, data.toString("hex"));
        log.i(TAG, "<<< [%s]", data.toString("hex"));

        var deviceInfo = new DeviceInfo(data);
        var deviceId = mapSockClient.search(sockClient);

        //处理授权包
        if (deviceInfo.typePacket == DeviceInfo.TYPE_AUTH) {
            if(null == deviceId) {
                deviceId = new AuthInfo(deviceInfo.getPacket()).toString();
                mapSockClient.set(deviceId, sockClient);
                mapDeviceInfo.set(deviceId, deviceInfo);
                evtConnect(deviceId);
            }
        }
        //处理其他数据包
        else if (null != deviceId) {
            evtReceiver(deviceId, deviceInfo.getPacket());
        }
        //send(deviceId, deviceInfo.getPacket());
    });
    sockClient.on('close', function(data) {
        log.i(TAG, 'CLOSED: ' + sockClient.remoteAddress + ' ' + sockClient.remotePort);
        var deviceId = mapSockClient.search(sockClient);
        if(deviceId) {
            mapSockClient.remove(deviceId);
            mapDeviceInfo.remove(deviceId);
            evtDisconnect(deviceId);
        }
    });
}).listen(PORT);

log.i(TAG, "SmartLock Device Service listen at port %d", PORT);

//exports.startService =
//events
exports.onReceiver = onReceiver;
exports.onConnect = onConnect;
exports.onDisconnet = onDisconnect;

//function
exports.send = send;
