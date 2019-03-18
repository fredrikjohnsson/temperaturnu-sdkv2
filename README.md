# temperatur.nu
Adds support for temperature a device that gets data from [temperatur.nu](http://www.temperatur.nu).

### App settings
After installing the app, navigate to app settings and set an app name for temperatur.nu API. An app name is generated on first start, but this is possible to change. Without an app name, the app will not work.

### Device settings
After a temperature device is created, go to app settings and then Advanced settings. A station ID is needed for the device to work, and the station ID is the last part of an URL without the html part. To obtain an station ID, navigate to [temperatur.nu](http://www.temperatur.nu) and click on a city of interest. Look at the URL in the address bar and remember the last part. For example, in the URL https://www.temperatur.nu/evenas.html, station ID is evenas.

### Flow support
*Triggers*

At the moment there are two triggers available, *The temperature has changed* and *The temperature is updated*. The difference is that the first one only runs when the temperature value is changed, the second one runs every time a value is fetched from API.

### ToDo
- [ ] Show timestamp of temperature value, this is available in the API

### Known issues
- None at the moment

### Changelog
- **v1.0.2 (2019-03-18)**
  - Station ID no longer needs to be in lowercase
  - Temperature is now fetched directly when station ID changed
- **v1.0.1 (2019-03-18)**
  - 1.5.x compatibility fix
- **v1.0.0 (2019-03-17)**
  - First public version
- **v0.0.5**
  - Added app and device icon
- **v0.0.4**
  - Prepared for translation of the app
- **v0.0.3**
  - Added *The temperature is updated* flow trigger card
- **v0.0.2**
  - Rebuilt app to get data to a device
- **v0.0.1**
  - First version, getting values from API with a flow action card
