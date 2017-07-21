var log = require("../log/logcat");

const TAG = 'DeviceInfo';

//var head;
//var addr;
//var type;
//var typePacket;
//var packet;

var DeviceInfo = function(buffer) {
	this.head = buffer.slice(0, DeviceInfo.SIZE_HEAD);
	this.addr = buffer.slice(10, 12);
	this.typeDevice = buffer.slice(12, 13);
	this.typePacket = buffer.readUInt8(13);  //buffer.slice(13, 14);
	this.packet = buffer.slice(DeviceInfo.SIZE_HEAD, buffer.length);
	log.d(TAG, "DeviceInfo: packet = %s", this.packet.toString("hex"));
	this.getPacket = function() {
		return this.packet;
	}

	this.toString = function() {
		return "head = " + this.head.toString("hex")
			+ ", addr = " + this.addr.toString("hex")
			+ ", typeDevice = " + this.typeDevice.toString("hex")
			+ ", typePacket = " + this.typePacket.toString("hex")
			+ ", packet = " + this.packet.toString("hex");
	}
}

//定义类方法(类的静态方法，可直接通过类名访问)
DeviceInfo.packet = function (info, packet) {
	var buffer = Buffer.alloc(info.head.length + packet.length);
	buffer.fill(info.head, 0);
	buffer.fill(DeviceInfo.LINK_RESPONSE, 3, 4);
	buffer.fill(DeviceInfo.TYPE_DATA, 13, 14);
	buffer.fill(packet, info.head.length);

	//更新
	var sizePacket = info.head.length + packet.length - DeviceInfo.SIZE_SYNC - DeviceInfo.SIZE_CRC16;
	buffer.writeUInt8(sizePacket, DeviceInfo.OFFSET_SYNC);
	var crc16 = jsCRC16(buffer.slice(DeviceInfo.OFFSET_TYPE));
	buffer.writeUInt16LE(crc16, DeviceInfo.OFFSET_CRC16);
	return buffer;
	//return info.head + packet;
};

//定义类的静态字段
DeviceInfo.LINK_REQUEST = 0x27;
DeviceInfo.LINK_RESPONSE = 0x28;
DeviceInfo.TYPE_AUTH = 0xff;
DeviceInfo.TYPE_DATA = 0x25;

DeviceInfo.SIZE_HEAD = 14;
DeviceInfo.SIZE_SYNC = 1;
DeviceInfo.SIZE_CRC16 = 2;

DeviceInfo.OFFSET_SYNC = 0;
DeviceInfo.OFFSET_CRC16 = 1;
DeviceInfo.OFFSET_TYPE = 3;

function jsCRC16(buff){
	var len = buff.length;
	var ret = 0xFFFF;
	var genpoly = 0xA001;
	var index = 0;

	for (var pos = 0; pos < len; pos++){
		ret = ret ^ buff[pos];
		for(index = 0;index < 8;index++){
			if(ret & 0x0001){
				ret = (ret >> 1) ^ genpoly;
			}else{
				ret = ret >> 1;
			}
		}
	}
	return ret;
}

exports.DeviceInfo = DeviceInfo;