var Service;
var Characteristic;

var sys = require('sys');
    exec = require('child_process').exec;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-hikvision', 'hikvision', hikvisionAccessory);
}



function hikvisionAccessory(log, config) {
  this.log = log;
  this.service = 'Switch';
  this.name = config['name'];
  this.onCommand = config['on'];
  this.stateCommand = config['state'] || false;
  this.offCommand = config['off'];
  this.onValue = config['on_value'] || "true";
  if (!this.fileState) {
    this.onValue = this.onValue.trim().toLowerCase();
  }
}
hikvisionAccessory.prototype.getState = function(callback) {
  var accessory = this;
  var command = accessory['stateCommand'];
  var stdout = "none";  
  if (this.stateCommand) {
    exec(command, function (error, stdout, stderr) {
      var cleanOut=stdout.trim().toLowerCase();
      accessory.log('State of ' + accessory.name + ' is: ' + cleanOut);
      callback(null, cleanOut == accessory.onValue);
    });
  }
  else {
      accessory.log('Must set config value for fileState or state.');
  }
}

hikvisionAccessory.prototype.setState = function(powerOn, callback) {
  var accessory = this;
  var state = powerOn ? 'on' : 'off';
  var prop = state + 'Command';
  var command = accessory[prop];
  
  exec(command);
  callback(null);
}

hikvisionAccessory.prototype.getServices = function() {
  var informationService = new Service.AccessoryInformation();
  var switchService = new Service.Switch(this.name);

  informationService
  .setCharacteristic(Characteristic.Manufacturer, 'Hikvision')
  .setCharacteristic(Characteristic.Model, 'hikvision Q1')
  .setCharacteristic(Characteristic.SerialNumber, '2CV3Q21FD');

  var characteristic = switchService.getCharacteristic(Characteristic.On)
  .on('set', this.setState.bind(this));

  if (this.stateCommand) {
    characteristic.on('get', this.getState.bind(this))
  };

  return [switchService];
}
