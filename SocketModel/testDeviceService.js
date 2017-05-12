var deviceService = require('./DeviceService');
var log = require("./logcat");

const TAG = 'testDeviceService';

deviceService.onReceiver(function(deviceId, data) {
    log.d(TAG, "onReceiver(%s): data = %s", deviceId, data.toString("hex"));
    deviceService.send(deviceId, data);
});

deviceService.onConnect(function(deviceId) {
    log.d(TAG, "onConnect(%s): device connect", deviceId);
});

deviceService.onDisconnet(function(deviceId) {
    log.d(TAG, "onDisconnet(%s): device disconnect", deviceId);
})