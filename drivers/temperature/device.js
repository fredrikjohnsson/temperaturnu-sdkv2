'use strict';

const Homey = require('homey');
const fetch = require('node-fetch');
const parseString = require('xml2js').parseString;

class TemperatureDevice extends Homey.Device {
	
	onInit() {
		this.log('TemperatureDevice has been inited');
		
		const POLL_INTERVAL = 300000;	// 5 minutes

		this.pollTemperature();
		this._pollTemperature = setInterval(this.pollTemperature.bind(this), POLL_INTERVAL);
	}

	onAdded(){
		this.log('Device added');
	}

	onDelete() {
		this.log('Device deleted');
	}

	async pollTemperature() {
		this.log('pollTemperature start');

		const stationId = this.getSetting('stationid');
		const appName = Homey.ManagerSettings.get('appname');

		if (appName != null && (stationId != undefined && stationId != null)) {
			this.log('pollTemperature: All settings OK');
			const baseUrl = 'http://api.temperatur.nu/tnu_1.12.php';
			const url = baseUrl + '?p=' + stationId + '&verbose&cli=' + appName;
			
			const response = await fetch(url);
			
			if (!response.ok) {
				return Promise.resolve(false);
			}

			const xml = await response.text();
			
			let temperature;
			parseString(xml, function(err, result) {
				let title = result.rss.channel[0].item[0].title[0];
				if (title.substr(0, 14) != 'Please Upgrade!') {
					temperature = parseFloat(result.rss.channel[0].item[0].temp[0]);
				}
			});
			
			if (!temperature) {
				this.log('pollTemperature: Temperature not set, returning false');
				return Promise.resolve(false);
			}

			this.log('pollTemperature: ' + temperature);
			this.setCapabilityValue('measure_temperature', temperature);

			return Promise.resolve();
		}
	}
	
}

module.exports = TemperatureDevice;