# temperatur.nu
Adds support for temperature a device that gets data from [temperatur.nu](http://www.temperatur.nu).

### App settings
After installing the app, navigate to app settings and set an app name for temperatur.nu API. An app name is generated on first start, but this is possible to change. Without an app name, the app will not work.

### Device settings
After a temperature device is created, go to app settings and then Advanced settings. A station ID is needed for the device to work, and the station ID is the last part of an URL without the html part. To obtain an station ID, navigate to [temperatur.nu](http://www.temperatur.nu) and click on a city of interest. Look at the URL in the address bar and remember the last part. For example, in the URL https://www.temperatur.nu/evenas.html, station ID is evenas.

### Flow support
*Triggers*

At the moment only one trigger is available, *The temperature has changed*. In the future, *The temperature is updated* will be added to be able to trigger every five minutes, when the API is called.

### ToDo
- [ ] Add app icon
- [ ] Add *The temperature is updated* flow trigger
- [ ] Get temperature from API when station ID is changed

### Known issues
- After entering a station ID for a device, the value returned from API is NaN. After five minutes a good value is returned.

### Changelog
- v0.0.2: Rebuilt app to get data to a device
- v0.0.1: First version, getting values from API with a flow action card
