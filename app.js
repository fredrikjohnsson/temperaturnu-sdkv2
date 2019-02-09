'use strict';

const Homey = require('homey');
const fetch = require('node-fetch');
const parseString = require('xml2js').parseString;

const TemperatureToken = new Homey.FlowToken('Temperature', {
	type: 'number',
	title: 'Temperatur'
});

var Temperature;

const baseApiUrl = 'http://api.temperatur.nu/tnu_1.12.php';

let GetTemperatureAction = new Homey.FlowCardAction('get_temperature');
let temperature;

class TemperaturnuApp extends Homey.App {
	
	async onInit() {
		this.log('temperatur.nu app is running...');

		GetTemperatureAction
		.register()
		.registerRunListener((args, state) => {
			this.log('GetTemperatureAction flow card executed');
			this.UpdateDataFromApi(args.city_id, args.app_name);
			//let apiUrl = baseApiUrl + '?p=' + args.city_id + '&verbose&cli=' + args.app_name;
			//fetch(apiUrl)
			//	.then(res => res.text())
			//	.then(body => {
			//		this.log('XML fetched, parsing..')
			//		parseString(body, function(err, result) {
			//			temperature = result['rss']['channel'][0]['item'][0]['temp'][0];
			//		})
			//		this.log('Temperature: ' + temperature);
			//	})
			return Promise.resolve(true);
		});

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
		await TemperatureToken.setValue(Temperature.CurrentValue);
	};

	async UpdateDataFromApi(id, name) {
		this.log('UpdateFromApi start (' + id + ' / ' + name + ')');
		const apiResponse = await this.runFetchOperation(id, name);
		let temperature = await this.apiReturnTemperature(apiResponse);
		this.log('Temperature fetched from API: ' + temperature);
		return {
			CurrentValue: 0
		};
	}
	
	async runFetchOperation(id, name) {
		this.log('runFetchOperation start (' + id + ' / ' + name + ')');
		let apiUrl = baseApiUrl + '?p=' + id + '&verbose&cli=' + name;
		let apiResult;
		const response = await fetch(apiUrl)
			.then(res => res.text())
			.then(body => {
				apiResult = body
			});
		this.log('runFetchOperation complete');

		if (response.ok) {
			return await apiResult;
		}
		
		throw Error('Failed to get data from API: ${id} / ${name}, response code: ${response.status}');
	}

	async apiReturnTemperature(xml) {
		this.log('apiReturnTemperature start');
		await parseString(xml, function(err, result) {
			return result['rss']['channel'][0]['item'][0]['temp'][0];
		});
		this.log('apiReturnTemperature complete');
	}
	
}

module.exports = TemperaturnuApp;