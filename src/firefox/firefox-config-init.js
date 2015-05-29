/*global exports, require*/
/*jshint moz:true*/
const FirefoxConfigInterface = function () {
	'use strict';
};

FirefoxConfigInterface.prototype.saveOptions = function (additionalMenus) {
	'use strict';
	addon.port.emit("saveOptions", additionalMenus);
};

FirefoxConfigInterface.prototype.loadOptions = function (callback) {
	'use strict';
	callback(addon.port.emit("loadOptions"));
};

addon.port.on("show", function onShow() {
	'use strict';
	BugMagnet.initConfigWidget(document.getElementById('main'), new FirefoxConfigInterface());
});
