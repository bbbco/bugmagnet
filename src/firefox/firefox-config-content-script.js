/*global addon, document, BugMagnet*/
/*jshint moz:true*/

const ListenCustomEvent = function(name) {
	window.addEventListener(name, function(event){
		self.port.emit(name, event.detail);
	});
}

const SendCustomEvent = function(name, data) {
	'use strict';

	var cloned = cloneInto(data, document.defaultView);
	var event = document.createEvent('CustomEvent');
	event.initCustomEvent(name, true, true, cloned);
	document.documentElement.dispatchEvent(event);
}

ListenCustomEvent('initedPanel');
ListenCustomEvent('saveOptions');
ListenCustomEvent('loadOptions');
ListenCustomEvent('hidePanel');

self.port.on('show', SendCustomEvent('show'));
self.port.on('getOptions', function(data) {
	SendCustomEvent('getOptions', data);
});

