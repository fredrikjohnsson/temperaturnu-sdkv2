'use strict';

const Homey = require('homey');
const fetch = require('node-fetch');
const parseString = require('xml2js').parseString;

const TemperatureToken = new Homey.FlowToken('Temperature', {
	type: 'number',
	title: 'Temperature'
});

const baseApiUrl = 'http://api.temperatur.nu/tnu_1.12.php';

var ApiData;

let GetTemperatureAction = new Homey.FlowCardAction('get_temperature');

class TemperaturnuApp extends Homey.App {
	
	async onInit() {
		this.log('temperatur.nu app is running...');

		GetTemperatureAction
			.register()
			.registerRunListener(async (args, state) => {
				this.log('GetTemperatureAction flow card executed');	
				ApiData = await this.UpdateDataFromApi(args.city_id, args.app_name);					
				//TODO: Next line will not be executed. Problem with ApiData object?
				this.log('ApiData temperature: ' + ApiData.Temperature);
				
				await this.UpdateTokens();
				return Promise.resolve(true);
			});

		await TemperatureToken.register();
	};

	async UpdateTokens() {
		console.log('Updating token');
		await TemperatureToken.setValue(ApiData.Temperature);
	};

	async UpdateDataFromApi(id, name) {
		this.log('UpdateFromApi start (' + id + ' / ' + name + ')');

		const apiResponse = await this.runFetchOperation(id, name);
		let temperature = await this.apiReturnTemperature(apiResponse);
		
		this.log('UpdateFromApi complete');

		return {
			Temperature: temperature
		};
	}
	
	async runFetchOperation(id, name) {
		this.log('runFetchOperation start (' + id + ' / ' + name + ')');
		let apiUrl = baseApiUrl + '?p=' + id + '&verbose&cli=' + name;
		
		const response = await fetch(apiUrl);

		this.log('runFetchOperation complete');

		if (response.ok) {
			this.log('runFetchOperation response is OK');
			return await response.text();
		}
		
		throw Error('Failed to get data from API: ${id} / ${name}, response code: ${response.status}');
	}

	async apiReturnTemperature(xml) {
		this.log('apiReturnTemperature start');

		await parseString(xml, function(err, result) {
			let temperature = result['rss']['channel'][0]['item'][0]['temp'][0];
		});

		this.log('apiReturnTemperature complete');

		return temperature;
	}
	
}

module.exports = TemperaturnuApp;