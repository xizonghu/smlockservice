var HashMap = require('./hashmap').HashMap;

var log = require("./logcat");
var net = require('net');

const TAG = 'socketModule';
var HOST = '127.0.0.1';
var PORT = 6666;

var mapSock = new HashMap();

net.createServer(function(sock) {
    log.d(TAG, 'CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sock.on('data', function(data) {
        log.d(TAG, "RECV [%s][%d][%s]", sock.remoteAddress, data.length, data.toString("hex"));
        sock.write('You said "' + data.toString("ascii") + '"');
    });
    sock.on('close', function(data) {
        log.d(TAG, 'CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });
}).listen(PORT, HOST);

log.d(TAG, 'Server listening on ' + HOST +':'+ PORT);