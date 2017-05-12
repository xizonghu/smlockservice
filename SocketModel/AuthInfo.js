var log = require("./logcat");

const TAG = 'AuthInfo';

var AuthInfo = function(buffer) {
	this.id = buffer.slice(0, 12);
	log.d(TAG, "id = %s", this.id);
	return this.id;
}

exports.AuthInfo = AuthInfo;