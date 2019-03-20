cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordovarduino.Serial",
    "file": "plugins/cordovarduino/www/serial.js",
    "pluginId": "cordovarduino",
    "clobbers": [
      "window.serial"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "cordovarduino": "0.0.10"
};
// BOTTOM OF METADATA
});