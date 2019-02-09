'use strict';

const Homey = require('homey');
const fetch = require('node-fetch');
const parseString = require('xml2js').parseString;

const TemperatureToken = new Homey.FlowToken('Temperature', {
	type: 'number',
	title: 'Temperature'
});

const baseApiUrl = 'http://api.temperatur.nu/tnu_1.12.php';

let GetTemperatureAction = new Homey.FlowCardAction('get_temperature');

var ApiData;

class TemperaturnuApp extends Homey.App {
	
	async onInit() {
		this.log('temperatur.nu app is running...');

		GetTemperatureAction
			.register()
			.registerRunListener(async (args, state) => {
				this.log('GetTemperatureAction flow card executed');

				ApiData = await this.UpdateDataFromApi(args.city_id, args.app_name);
				let temperature = ApiData.Temperature;
						
				this.log('ApiData temperature: ' + ApiData.Temperature);

				await this.UpdateToken();

				return Promise.resolve(true);
			});

		await TemperatureToken.register();
	};

	async GetData() {
		try {
			console.log('Async GetData start');
			Temperature = await this.UpdateDataFromApi();
			console.log('Async GetData complete');
		} catch(e) {
			console.error('Error in GetData: ' + e);
		}
	};

	async UpdateToken() {
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
			this.log('Response is OK');
			return await response.text();
		}
		
		throw Error('Failed to get data from API: ${id} / ${name}, response code: ${response.status}');
	}

	async apiReturnTemperature(xml) {
		this.log('apiReturnTemperature start');

		await parseString(xml, function(err, result) {
			temperature = result['rss']['channel'][0]['item'][0]['temp'][0];
		});

		this.log('apiReturnTemperature complete');

		return temperature;
	}
	
}

module.exports = TemperaturnuApp;