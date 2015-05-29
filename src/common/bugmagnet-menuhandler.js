/*global document*/
BugMagnet.processMenuObject = function (configObject, menuBuilder, parentMenu) {
	'use strict';
	var getTitle = function (key) {
			if (configObject instanceof Array) {
				return configObject[key];
			}
			return key;
		};
	if (!configObject) {
		return;
	}
	Object.keys(configObject).forEach(function (key) {
		var	value = configObject[key],
				title = getTitle(key),
				result;
		if (typeof (value) === 'string' || (typeof (value) === 'object' && value.hasOwnProperty('_type'))) {
			menuBuilder.menuItem(title, parentMenu, value);
		} else if (typeof (value) === 'object') {
			result = menuBuilder.subMenu(title, parentMenu);
			BugMagnet.processMenuObject(value, menuBuilder, result);
		}
	});
};
BugMagnet.processConfigText = function (configText, menuBuilder, rootMenu) {
	'use strict';
	var config = JSON.parse(configText);
	rootMenu = rootMenu || menuBuilder.rootMenu('Bug Magnet');
	BugMagnet.processMenuObject(config, menuBuilder, rootMenu);
	return rootMenu;
};

