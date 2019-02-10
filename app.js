'use strict';

const Homey = require('homey');
const fetch = require('node-fetch');
const parseString = require('xml2js').parseString;

const TemperatureToken = new Homey.FlowToken('Temperature', {
	type: 'number',
	title: 'Temperature'
});

const TimestampToken = new Homey.FlowToken('Timestamp', {
	type: 'string',
	title: 'Timestamp'
});

const Settings = Homey.ManagerSettings;

const baseApiUrl = 'http://api.temperatur.nu/tnu_1.12.php';

var ApiData;

let GetDataAction = new Homey.FlowCardAction('get_temperature');

class TemperaturnuApp extends Homey.App {
	
	async onInit() {
		this.log('temperatur.nu app is running...');

		this.log(Settings.get('appname'));

		GetDataAction
			.register()
			.registerRunListener(async (args, state) => {
				this.log('GetDataAction flow card executed');	
				
				ApiData = await this.UpdateDataFromApi(args.city_id, Settings.get('appname'));					
				
				this.log('ApiData temperature: ' + ApiData.Temperature);
				this.log('ApiData timestamp: ' + ApiData.Timestamp);
				
				await this.UpdateTokens();
				return Promise.resolve(true);
			});

		await TemperatureToken.register();
		await TimestampToken.register();
	};

	async UpdateTokens() {
		this.log('UpdatingTokens start');
		await TemperatureToken.setValue(ApiData.Temperature);
		await TimestampToken.setValue(ApiData.Timestamp);
		this.log('UpdateingTokens complete')
	};

	async UpdateDataFromApi(id, name) {
		this.log('UpdateFromApi start (' + id + ' / ' + name + ')');

		let apiResponse = await this.runFetchOperation(id, name);
		let temperature = await this.apiReturnValue(apiResponse, 'temp');
		let timestamp = await this.apiReturnValue(apiResponse, 'lastUpdate');
		this.log('UpdateFromApi temperature: ' + temperature);
		this.log('UpdateFromApi timestamp: ' + timestamp);
		this.log('UpdateFromApi complete');

		return {
			Temperature: temperature,
			Timestamp: timestamp
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

	apiReturnValue(xml, property) {
		this.log('apiReturnValue start');

		let output;
		parseString(xml, function(err, result) {
			output = result.rss.channel[0].item[0][property][0];
		});

		this.log('apiReturnValue complete with result: ' + output);

		return output;
	}
	
}

module.exports = TemperaturnuApp;