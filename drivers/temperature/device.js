'use strict';

const Homey = require('homey');
const fetch = require('node-fetch');
const parseString = require('xml2js').parseString;
const crypto = require('crypto');

const baseUrl = 'api.temperatur.nu/tnu_1.15.php';
const appName = Homey.ManagerSettings.get('appname');

class TemperatureDevice extends Homey.Device {
	
	async onInit() {
		this.log('TemperatureDevice has been inited');
		
		const POLL_INTERVAL = 300000;	// 5 minutes

		this.fetchTemperature();
		this._fetchTemperature = setInterval(this.fetchTemperature.bind(this), POLL_INTERVAL);
	}

	onAdded(){
		this.log('Device added');
	}

	onDelete() {
		this.log('Device deleted');
	}

	async onSettings(oldSettingsObj, newSettingsObj, changedKeysArr) {
		if (changedKeysArr == 'stationid') {
			this.log('Settings changed for station ID from ' + oldSettingsObj.stationid + ' to ' + newSettingsObj.stationid) + '. Fetching temperature for new station.';
			this.fetchTemperature();
		}
	}

	async fetchData(stationId, appName) {
		this.log('fetchData start');
		this.log('stationid: ' + stationId );
		if (appName != null && stationId != null) {
			this.log('fetchData: All settings OK');
			const url = 'http://' + baseUrl + '?p=' + stationId + '&verbose&cli=' + appName;
			const signedUrl = url + '&sign=' + this.createHash(url);
			this.log('SIGNED URL: ' + signedUrl);

			const response = await fetch(url);

			if (!response.ok) {
				this.log('fetchData: Response not OK from API, no data returned');
				return null
			}

			const xml = await response.text();
			
			let title;
			parseString(xml, function(err, result) {
				title = result.rss.channel[0].item[0].title[0];
			});

			if (title.substr(0, 14) != 'Please Upgrade!') {
				return xml;
			} else {
				return null;
			}
		} else {
			this.log('Settings not OK');
			return null;
		}
	}

	async createHash(text) {
		return crypto.createHash('md5').update(text).digest('base64');
	}

	async fetchTemperature() {
		const stationId = this.getSetting('stationid');
		const xml = await this.fetchData(stationId, appName);
		const value = await this.xmlValue(xml, 'temp');
		this.saveTemperature(parseFloat(value));
	}

	async saveTemperature(temperature) {
		this.log('saveTemperature start');

		const varType = typeof(temperature);
		if (varType != 'number' || isNaN(temperature)) {
			this.log('saveTemperature: Variable is not of type number or temperature is NaN');
			return Promise.resolve(false);
		}
		
		this.log('saveTemperature: Setting temperature to ' + temperature);
		this.setCapabilityValue('measure_temperature', temperature);

		return Promise.resolve(true);
	}

	async xmlValue(xml, propertyName) {
		if (xml != null) {
			let output;
			parseString(xml, function(err, result) {
				output = result.rss.channel[0].item[0][propertyName][0];
			});
			return output;
		} else {
			return null;
		}
	}

	// async pollTemperatureOld() {
	// 	this.log('pollTemperature start');

	// 	const stationId = this.getSetting('stationid');
	// 	const appName = Homey.ManagerSettings.get('appname');

	// 	if (appName != null && (stationId != undefined && stationId != null)) {
	// 		this.log('pollTemperature: All settings OK');
	// 		const baseUrl = 'http://api.temperatur.nu/tnu_1.12.php';
	// 		const url = baseUrl + '?p=' + stationId + '&verbose&cli=' + appName;
			
	// 		const response = await fetch(url);
			
	// 		if (!response.ok) {
	// 			this.log('pollTempterature: Response not OK from API, returning false');
	// 			return Promise.resolve(false);
	// 		}

	// 		const xml = await response.text();
			
	// 		let temperature;
	// 		parseString(xml, function(err, result) {
	// 			let title = result.rss.channel[0].item[0].title[0];
	// 			if (title.substr(0, 14) != 'Please Upgrade!') {
	// 				temperature = parseFloat(result.rss.channel[0].item[0].temp[0]);
	// 			}
	// 		});
			
	// 		if (!temperature) {
	// 			this.log('pollTemperature: Temperature not set, returning false');
	// 			return Promise.resolve(false);
	// 		}

	// 		this.log('pollTemperature: ' + temperature);
	// 		this.setCapabilityValue('measure_temperature', temperature);

	// 		return Promise.resolve();
	// 	}
	// }
	
}

module.exports = TemperatureDevice;