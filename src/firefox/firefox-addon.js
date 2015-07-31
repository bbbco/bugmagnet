/*global exports, require, BugMagnet, FirefoxMenuBuilder*/
exports.main = function (options, callbacks) {
	'use strict';

	var config,
		menuBuilder = new FirefoxMenuBuilder(),
		rootMenu = menuBuilder.rootMenu('Bug Magnet'),
		processConfig = function () {
			BugMagnet.processConfigText(config, menuBuilder, rootMenu);
		},
		loadConfigFromInternalFile = function (callback) {
			config = require('sdk/self').data.load('config.json');
			processConfig();
			callback();
		},
		loadAdditionalMenus = function (additionalMenus) {
			if (additionalMenus && Array.isArray(additionalMenus) && additionalMenus.length) {
				additionalMenus.forEach(function (configItem) {
					var object = {};
					object[configItem.name] = configItem.config;
					BugMagnet.processMenuObject(object, menuBuilder, rootMenu);
				});
			}
		},
		loadConfigFromLocalSettings = function (callback) {
			var ss = require('sdk/simple-storage'),
				items = ss.storage.bugMagnetConfig || [];
			loadAdditionalMenus(items);
			callback();
		},
		addGenericMenus = function () {
			menuBuilder.separator(rootMenu);
			menuBuilder.configMenuItem('Configure BugMagnet', rootMenu, configWindow);
		},
		configWindow = function () {
			var ss = require('sdk/simple-storage'),
				data = require('sdk/self').data,
				tabs = require('sdk/tabs'),
				tab = null,
				win = require('sdk/window/utils').openDialog( {
					features: Object.keys({
						chrome: true,
						centerscreen: true,
						resizable: true,
						scrollbars: true,
						width: 850,
						height: 650
					}).join(),
					name: 'BugMagnet Config'
				});
			win.addEventListener('load', function() {
			  if(tab == null){
			  tab = tabs.open({
			  	url: data.url('options.html'),
				inNewWindow: false,
				onReady: function (tab) {
					console.log('Dialog ready called');
					var worker = tab.attach({
						contentScriptFile: data.url('config-content-script.js')
					});
					console.log("Attached JS");
					// Save BugMagnet options to simple storage
					worker.port.on('saveOptions', function (options) {
						console.log("Save options!");
						ss.storage.bugMagnetConfig = options;
						rootMenu.destroy();
						rootMenu = menuBuilder.rootMenu('Bug Magnet');
						processConfig();
						loadAdditionalMenus(options);
						addGenericMenus();
					});

					// Send BugMagnet options
					worker.port.on('loadOptions', function () {
						console.log("Load options");
						worker.port.emit('getOptions', ss.storage.bugMagnetConfig);
					});

					worker.port.on('initedPanel', function(domNode) {
						console.log('Initializing panel widget' + domNode);
					});
					// Trigger custom "show" event message to options.js when panel is displayed
					worker.port.emit('show');

					worker.port.on('hidePanel', function () {
						console.log("Destroy panel!");
						win.close();
					});

				}
				});
			  }
			});
		}

	loadConfigFromInternalFile(function () {
		loadConfigFromLocalSettings(addGenericMenus);
	});

	// If you run cfx with --static-args='{"quitWhenDone":true}' this program
	// will automatically quit Firefox when it's done.
	if (options.staticArgs.quitWhenDone) {
		callbacks.quit();
	}

};


