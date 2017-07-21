const LOGCAT_A_ENABLE = true;
const LOGCAT_E_ENABLE = true;
const LOGCAT_W_ENABLE = true;
const LOGCAT_I_ENABLE = true;
const LOGCAT_D_ENABLE = false;
const LOGCAT_V_ENABLE = false;

function getTime() {
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();

	if (hours >= 1 && hours <= 9) {
		hours = "0" + hours;
	}
	if (minutes >= 0 && minutes <= 9) {
		minutes = "0" + minutes;
	}
	if (seconds >= 0 && seconds <= 9) {
		seconds = "0" + seconds;
	}

	return hours + ":" + minutes + ":" + seconds;
}

function def(level, TAG, format, ...args) {
	//console.log("[" + level + "] [" + TAG + "] ", args);

	console.log("[" + getTime() + "] [" + level + "] [" + TAG + "] " + format, ...args);
}

function a(TAG, format, ...args) {
	if (false == LOGCAT_A_ENABLE) return;
	def("A", TAG, format, ...args);
}

function e(TAG, format, ...args) {
	if (false == LOGCAT_E_ENABLE) return;
	def("E", TAG, format, ...args);
}

function w(TAG, format, ...args) {
	if (false == LOGCAT_W_ENABLE) return;
	def("W", TAG, format, ...args);
}

function i(TAG, format, ...args) {
	if (false == LOGCAT_I_ENABLE) return;
	def("I", TAG, format, ...args);
}

function d(TAG, format, ...args) {
	if (false == LOGCAT_D_ENABLE) return;
	def("D", TAG, format, ...args);
}

function v(TAG, format, ...args) {
	if (false == LOGCAT_V_ENABLE) return;
	def("V", TAG, format, ...args);
}

exports.a = a;
exports.e = e;
exports.w = w;
exports.i = i;
exports.d = d;
exports.v = w;