'use strict';

const Homey = require('homey');

let devices = [];

class TemperatureDriver extends Homey.Driver {
	
	onInit() {
		this.log('TemperatureDriver has been inited');
		devices = this.getDevices();
	}

	onPair(socket) {
		this.log('[onPair] start');
		const t = this;

		let myData;
		
		socket.on('log', function(msg, callback) {
			t.log('[onPair] [log] ' + msg);
		});

		socket.on('start', function(data, callback) {
			myData = data;
			t.log('[onPair] [start] ' + data);
		});

		socket.on('list_devices', function(data, callback) {
			t.log('[onPair] [list_devies] Start')
			if (devices.length == 0) {
				let device = {
					name: 'Temperature',
					data: {
						id: guid(),
					}
				}
				devices.push(device);
				callback(null, devices);
			}
		});
	}
	
}

module.exports = TemperatureDriver;

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}