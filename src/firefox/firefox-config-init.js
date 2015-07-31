/*global addon, document, BugMagnet*/
/*jshint moz:true*/
const FirefoxConfigInterface = function () {
	'use strict';

	this.saveOptions = function (additionalMenus) {
		SendMessageToAddon('saveOptions', additionalMenus);
	};

	this.loadOptions = function (callback) {
		var options = null;
		window.addEventListener('getOptions', function(e) {
			options = e.detail;
			callback(options);
		}, false);
		SendMessageToAddon('loadOptions');
	};

	this.closeWindow = function () {
		SendMessageToAddon('hidePanel', null);
	};

};

const SendMessageToAddon = function(name, data) {
	'use strict';

	var event = document.createEvent('CustomEvent');
	event.initCustomEvent(name, true, true, data);
	document.documentElement.dispatchEvent(event);

};

document.addEventListener('DOMContentLoaded', function () {
	'use strict';
	SendMessageToAddon('initedPanel', document.getElementById('main'));
	BugMagnet.initConfigWidget(document.getElementById('main'), new FirefoxConfigInterface());
}, false);
