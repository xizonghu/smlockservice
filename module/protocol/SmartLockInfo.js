var log = require("../log/logcat");

var SmartLockInfo = function(buffer) {
	const TAG = "SmartLockInfo";
	if (3 > buffer.length) {
		this.typePacket = SmartLockInfo.TYPE_UNDEFINED;
		return;
	}

	this.direct = buffer.readUInt8(0);
	this.typePacket = buffer.readUInt8(1);  //buffer.slice(1, 2);
	this.sizePacket = buffer.readUInt8(2);  //buffer.slice(2, 3);
	this.packet = buffer.slice(3, buffer.length);
	this.data;
	log.d(TAG, "type = %d, packet = %s", this.typePacket.toString(16), this.packet.toString("hex"));
	switch(this.typePacket) {
		case SmartLockInfo.TYPE_INFO_UNLOCK:
			this.data = new UnlockInfo(this.packet);
			break;
		case SmartLockInfo.TYPE_INFO_BATTERY:
			this.data = new BatteryInfo(this.packet);
			break;
		case SmartLockInfo.TYPE_INFO_STORAGE:
			this.data = new StorageInfo(this.packet);
			break;
		case SmartLockInfo.TYPE_INFO_VENDOR:
			this.data = new VendorInfo(this.packet);
			break;
		default:
			this.typePacket = SmartLockInfo.TYPE_UNDEFINED;
	}

	this.toString = function () {
		return "direct = " + this.direct
				+ ", typePacket = " + this.typePacket
				+ ", sizePacket = " + this.sizePacket
				+ ", packet = " + this.packet.toString("hex");
	}
}

//封包
SmartLockInfo.pack = function (direct, typePacket, sizePacket, packet) {
	var buffer = Buffer.alloc(3 + sizePacket);
	buffer.fill(direct, 0, 1);
	buffer.fill(typePacket, 1, 2);
	buffer.fill(sizePacket, 2, 3);
	buffer.fill(packet, 3, 3 + sizePacket);
	return buffer;
}

//解包
SmartLockInfo.unpack = function (info) {
	return new SmartLockInfo(info);
}

SmartLockInfo.DIRECT_SERVER_TO_CLIENT = 0x01;
SmartLockInfo.DIRECT_CLIENT_TO_SERVER = 0x02;

SmartLockInfo.TYPE_CMD_UNLOCK = 0x01;
SmartLockInfo.TYPE_INFO_UNLOCK = 0x81;
SmartLockInfo.TYPE_INFO_BATTERY = 0x82;
SmartLockInfo.TYPE_INFO_STORAGE = 0x83;
SmartLockInfo.TYPE_INFO_VENDOR = 0x84;
SmartLockInfo.TYPE_INFO_HEARTBEAT = 0xff;
SmartLockInfo.TYPE_UNDEFINED = 0x1ff;

var UnlockCmd = function (pwd) {
	var buffer = Buffer.alloc(6);
	buffer.fill(pwd);
	return buffer;
}

var UnlockInfo = function (buffer) {
	const TAG = "UnlockInfo";
	this.id = buffer.readUInt8(0);  //buffer.slice(0, 1);
	this.time = buffer.slice(1, 7);
	this.user1Id = buffer.readUInt8(7);  //buffer.slice(8, 9);
	this.user2Id = buffer.readUInt8(8);  //buffer.slice(9, 10);
	this.typeUnlock = buffer.readUInt8(9);  //buffer.slice(10,11);
	log.d(TAG, "packet = %s", buffer.toString("hex"));
	return {"id":this.id, "time":this.time, "user1Id":this.user1Id, "user2Id":this.user2Id, "typeUnlock":this.typeUnlock};
}

var BatteryInfo = function (buffer) {
	this.battery = buffer.readUInt16BE(0);  //buffer.slice(0, 2);
	//return {"battery":this.battery};
}

var StorageInfo = function (buffer) {
	this.valFP = buffer.readUInt16BE(0);  //buffer.slice(0, 2);
	this.valTEXT = buffer.readUInt16BE(2);  //buffer.slice(2, 4);
	this.valIC = buffer.readUInt16BE(4);  //buffer.slice(4, 6);
	//return {"FP":this.valFP, "TEXT":this.valTEXT, "IC":this.valIC};
}

var VendorInfo = function (buffer) {

}

exports.SmartLockInfo = SmartLockInfo;
exports.UnlockCmd = UnlockCmd;