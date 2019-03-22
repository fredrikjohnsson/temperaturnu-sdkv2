'use strict';

const Homey = require('homey');
const http = require('http');

class TemperaturnuApp extends Homey.App {

	async onInit() {
		this.log('temperatur.nu app is running...');

		// Action flow card - report temperature
		let reportTemperatureAction = new Homey.FlowCardAction('report_temperature');
		reportTemperatureAction
		  .register()
		  .registerRunListener(( args, state) => {
		    this.log('[reportTemperatureAction] Activated with hash: ' + args['hash'] + ' and temperature: ' + args['temperature']);

				const t = this;
				let url = 'http://www.temperatur.nu/rapportera.php?hash=' + args['hash'] + '&t=' + args['temperature'];

				http.get(url, (res) => {
					t.log('[reportTemperatureAction] Response recieved')
					var body = '';
					res.on('data', (data) => {
						body += data;
					});
					res.on('end', () => {
						if (body.substring(0, 2) == 'ok')
							t.log('[reportTemperatureAction] Response is OK');
						else
							t.log('[reportTemperatureAction] Response is not OK');
					});
				}).on('error', (err) => {
					t.log('[reportTemperatureAction] Error: ' + err.message);
				});

				this.log('[reportTemperatureAction] Result is: ' + result);
		    return Promise.resolve(true);
		  });

		if (!Homey.ManagerSettings.get('appname')) {
			// App name is not set, generate a name
			const appName = 'HomeyApp' + (Math.floor(Math.random() * 90000) + 10000);
			Homey.ManagerSettings.set('appname', appName);
			this.log('App name ' + appName + ' generated');
		}
	}
}

module.exports = TemperaturnuApp;
