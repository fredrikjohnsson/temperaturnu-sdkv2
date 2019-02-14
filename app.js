'use strict';

const Homey = require('homey');

class TemperaturnuApp extends Homey.App {
	
	async onInit() {
		this.log('temperatur.nu app is running...');

		if (!Homey.ManagerSettings.get('appname')) {
			// App name is not set, generate a name
			const appName = 'HomeyApp' + Math.floor(Math.random() * 90000) + 10000;
			Homey.ManagerSettings.set('appname', appName);
			this.log('App name ' + appName + 'generated');
		}
	}
}

module.exports = TemperaturnuApp;