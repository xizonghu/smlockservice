var log = require("./logcat");

const TAG = 'Device';

var Device = function(info, sock) {
	this.info = info;
	this.sock = sock;
}

exports.Device = Device;