# temperatur.nu
With this app you can report your outside temeprature to the Swedish site [temperatur.nu](http://www.temperatur.nu), or get your favorite station as a device.

### App settings
After installing the app, navigate to app settings and set an app name for temperatur.nu API. An app name is generated on first start, but this is possible to change. Without an app name, the app will not work.

### Device settings
After a temperature device is created, go to app settings and then Advanced settings. A station ID is needed for the device to work, and the station ID is the last part of an URL without the html part. To obtain an station ID, navigate to [temperatur.nu](http://www.temperatur.nu) and click on a city of interest. Look at the URL in the address bar and remember the last part. For example, in the URL https://www.temperatur.nu/evenas.html, station ID is evenas.

### Flow support
*Triggers*

At the moment there are two triggers available, *The temperature has changed* and *The temperature is updated*. The difference is that the first one only runs when the temperature value is changed, the second one runs every time a value is fetched from API.

*Actions*

One action flow card is available called *Report temperature*. Add the card to a flow and fill in your stations hash code and select a temperature token.

### Acknowledgement
 - Many thanks to [m.nu](http://www.m.nu) for sponsoring the reporting flow card.

### ToDo
- [ ] Show timestamp of temperature value, this is available in the API

### Known issues
- None at the moment

### Changelog
- **v1.1.2 (2020-09-12)**
  - Updated node-fetch to v2.6.1
  - Code clean-up
- **v1.1.1 (2019-04-09)**
  - Bug fixed that make the app crash
- **v1.1.0 (2019-03-22)**
  - Added an action flow card that reports temperature to temperatur.nu
- **v1.0.2 (2019-03-18)**
  - Station ID no longer needs to be in lowercase
  - Temperature is now fetched directly when station ID changed
- **v1.0.1 (2019-03-18)**
  - 1.5.x compatibility fix
- **v1.0.0 (2019-03-17)**
  - First public version
