With this app you can report your outside temeprature to the Swedish site temperatur.nu, or get your favorite station as a device.

App settings
After installing the app, navigate to app settings and set an app name for temperatur.nu API. An app name is generated on first start, but this is possible to change. Without an app name, the app will not work.

Device settings
After a temperature device is created, go to app settings and then Advanced settings. A station ID is needed for the device to work, and the station ID is the last part of an URL without the html part. To obtain an station ID, navigate to temperatur.nu and click on a city of interest. Look at the URL in the address bar and remember the last part. For example, in the URL https://www.temperatur.nu/evenas.html, station ID is evenas.

Flow support
Triggers

At the moment there are two triggers available, The temperature has changed and The temperature is updated. The difference is that the first one only runs when the temperature value is changed, the second one runs every time a value is fetched from API.

Actions

One action flow card is available called Report temperature. Add the card to a flow and fill in your stations hash code and select a temperature token.

Acknowledgement
 - Many thanks to m.nu for sponsoring the reporting flow card.

ToDo
- Show timestamp of temperature value, this is available in the API

Known issues
- None at the moment