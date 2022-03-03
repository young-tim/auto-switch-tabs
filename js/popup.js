// 引入backgrou.js
var bg = chrome.extension.getBackgroundPage();


(function () {
	var switchTimeObj = document.getElementById("switchTimeBox");
	var activateBtnObj = document.getElementById("activateBtn");

	switchTimeObj.value = bg.switchTime;
	activateBtnObj.value = bg.isActivate ? "已启用" : "已禁用";

	// 监听输入框内容变化
	switchTimeObj.onchange = function () {
		var val = this.value;
		val = Math.floor(this.value);
		if (val < 5) {
			val = 5;
		}else if(val > 9999) {
			val = 9999;
		};

		switchTimeObj.value = val;

		bg.setStorageData("switchTimeStorage", val);
		bg.updateTempData();
	};

	// 监听启用按钮点击事件
	activateBtnObj.onclick = function () {
		bg.isActivate = !bg.isActivate;

		bg.setStorageData("isActivateStorage", bg.isActivate);
		bg.updateTempData();
		activateBtnObj.value = bg.isActivate ? "已启用" : "已禁用";
	};

}());


