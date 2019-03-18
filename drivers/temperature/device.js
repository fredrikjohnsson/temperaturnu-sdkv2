'use strict';

const Homey = require('homey');
const fetch = require('node-fetch');
const parseString = require('xml2js').parseString;
const crypto = require('crypto');

const baseUrl = 'api.temperatur.nu/tnu_1.15.php';

class TemperatureDevice extends Homey.Device {

	async onInit() {
		this.log('TemperatureDevice has been inited');

		const POLL_INTERVAL = 300000;	// 5 minutes

		// Fetch temperature
		this.fetchTemperature();

		// Set to fetch temperature at an interval
		this._fetchTemperature = setInterval(this.fetchTemperature.bind(this), POLL_INTERVAL);

		// Temperature updated trigger
		this._temperatureUpdatedTrigger = this.getDriver().temperatureUpdatedTrigger;
	}

	onAdded(){
		this.log('Device added');
	}

	onDelete() {
		this.log('Device deleted');
	}

	async onSettings(oldSettingsObj, newSettingsObj, changedKeysArr) {
		// Check if stationid settings is changed
		if (changedKeysArr == 'stationid') {
			this.log('Settings changed for station ID from ' + oldSettingsObj.stationid + ' to ' + newSettingsObj.stationid) + '. Fetching temperature for new station.';

			// Trigger a temperature fetch
			this.fetchTemperature(newSettingsObj.stationid);
		}
	}

	async fetchData(stationId, appName) {
		this.log('[fetchData] Start');

		if (appName != null && stationId != null) {
			this.log('[fetchData] All settings OK');

			stationId = stationId.toLowerCase();

			// Build URL without http://, prepare for md5 hash
			const url = baseUrl + '?p=' + stationId + '&verbose&cli=' + appName;

			// Create a signed URL with client key
			const hash = await this.createHash(url + '+' + Homey.env.CLIENT_KEY);
			const signedUrl = 'http://' + url + '&sign=' + hash;

			// Make API call
			let response;
			if (Homey.env.CLIENT_KEY != '') {
				this.log('[fetchData] Fetching data using signed URL')
				response = await fetch(signedUrl);
			} else {
				this.log('[fetchData] Fetching data using unsigned URL')
				response = await fetch('http://' + url);
			}

			// Take care of not ok responses
			if (!response.ok) {
				this.log('[fetchData] Response not OK from API, no data returned');
				return null
			}

			const xml = await response.text();

			// Check if maximum calls have been reached
			let title;
			parseString(xml, function(err, result) {
				title = result.rss.channel[0].item[0].title[0];
			});

			// Return XML if not max API calls have been reached
			if (title.substr(0, 14) != 'Please Upgrade!') {
				return xml;
			} else {
				return null;
			}
		} else {
			this.log('[fetchData] Settings not OK');
			return null;
		}
	}

	async createHash(text) {
		return await crypto.createHash('md5').update(text).digest('base64');
	}

	async fetchTemperature(forcedStationId = '') {
		// Get app name
		const appName = Homey.ManagerSettings.get('appname');

		// Get station ID
		let stationId;
		if (forcedStationId) {
			stationId = forcedStationId;
		} else {
			stationId = this.getSetting('stationid');
		}

		// Fetch XML with lowercase station ID
		const xml = await this.fetchData(stationId.toLowerCase(), appName);

		// Extract value from XML
		const value = await this.xmlValue(xml, 'temp');

		// Save temperature
		await this.saveTemperature(parseFloat(value));
	}

	async saveTemperature(temperature) {
		this.log('[saveTemperature] Start');

		const varType = typeof(temperature);
		if (varType != 'number' || isNaN(temperature)) {
			this.log('[saveTemperature] Variable is not of type number or temperature is NaN');
			return Promise.resolve(false);
		}

		this.log('[saveTemperature] Setting temperature to ' + temperature);
		this.setCapabilityValue('measure_temperature', temperature);
		this._temperatureUpdatedTrigger.trigger(this, null, this.device_data);

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
}

module.exports = TemperatureDevice;
