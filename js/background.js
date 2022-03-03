// ************* 变量 ************
// 切换标签时间（秒）
var switchTime = 30;
// 启用状态
var isActivate = true;
// 按钮状态文字
var badgeText = "";
// 切换标签页定时器
var _autoSwitchT = window.setInterval(intervalChange, 100);


// ************* 函数方法 ************
function newDate() {
	var d = new Date();
	return d.toLocaleString();
};

function setStorageData(k,v) {
	// 保存数据
	switch (k) {
		case "switchTimeStorage":
			chrome.storage.sync.set({"switchTimeStorage": v}, function() {
				console.log(k, ' 已设置为: ', v);
			});
		case "isActivateStorage":
			chrome.storage.sync.set({"isActivateStorage": v}, function() {
				console.log(k, ' 已设置为: ', v);
			});
	};

	intervalChange();
};

function updateTempData() {
	console.log("updateTempData");
	// 读取数据，第一个参数是指定要读取的key以及设置默认值
	chrome.storage.sync.get({"switchTimeStorage": switchTime, "isActivateStorage": isActivate}, function(items) {
		if (items.hasOwnProperty("switchTimeStorage")) {
			switchTime = items.switchTimeStorage;
		}else{
			setStorageData("switchTimeStorage", switchTime);
		};

		if (items.hasOwnProperty("isActivateStorage")) {
			isActivate = items.isActivateStorage;
		}else{
			setStorageData("isActivateStorage", isActivate);
		};

		// 更改图标上的文字；
		badgeText = isActivate ? "ON" : "OFF";
		chrome.browserAction.setBadgeText({text: badgeText});
	});
};

function showNextTab() {
	console.log("切换时间：", newDate());
	// 获取当前窗口全部标签信息
	chrome.tabs.query({currentWindow:true}, function (tabs) {
		// console.log(tabs);
		// 获取当前激活的标签信息
		chrome.tabs.query({active:true, currentWindow:true}, function(currentTab) {
			// console.log("currentTab: -------------");
			// console.log(currentTab);
			if ( currentTab.length == 0 || currentTab[0].url.indexOf("chrome://extensions/")  != -1 ) {
				console.log('Error：未识别到当前标签页信息或者正在浏览扩展程序页');
			}else{
				var showIndex = 0;
				if (currentTab[0].index +1 < tabs.length) {
					showIndex = currentTab[0].index + 1;
				}else{
					showIndex = 0;
				};
				// 选中显示下一个标签，假如是最后一个标签，则显示第一个
				chrome.tabs.highlight({tabs: [showIndex]}, function(info){
					console.log(info);
				});
			};	
		});
	});
};


function intervalChange(){
	if (isActivate) {
		showNextTab();
	};
    window.clearInterval(_autoSwitchT);
    _autoSwitchT = window.setInterval(intervalChange, switchTime * 1000);
};

// ************* 监听事件 ************
// 监听扩展安装或更新
 chrome.runtime.onInstalled.addListener(function(){
	 updateTempData();
 }); 

// 监听Chrome启动
chrome.runtime.onStartup.addListener(function(){
	updateTempData();
	// sendMessageToPopup();
});

// 浏览器标签页高亮显示时
// chrome.tabs.onHighlighted.addListener();

// 浏览器标签页创建时
// chrome.tabs.onCreated.addListener(function(){

// });


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// console.log('收到来自content-script的消息：');
	// console.log(request, sender, sendResponse);
	// sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
});
