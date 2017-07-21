var log = require("./module/log/logcat");

const TAG = 'DeviceTransceiverListenner';

var SlpBlemasterCallbk = {
    onDiscoveryEvent: function(size) {
        log.i(TAG, "size = %d", size);
    },

    onListEvent: function(index, addr) {
        ;
    },

    onConnectEvent: function(errno) {
        ;
    },

    onDisconnectEvent: function(errno) {
        ;
    },

    onUndefinedEvent: function(data) {
        log.e(TAG, "onUndefinedEvent");
    }
}

var SlpSmlockCallbk = {
}

exports.SlpBlemasterCallbk = SlpBlemasterCallbk;