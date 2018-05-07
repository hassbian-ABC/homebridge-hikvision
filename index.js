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
  this.name = config['name'];
  this.onCommand = config['on'];
  this.stateCommand = config['state'] || false;
  this.offCommand = config['off'];
  this.onValue = config['on_value'] || "true";
  
  this.service = 'Switch';
  
}
  
hikvisionAccessory.prototype = {

  getState: function(callback) {
    var that = this;
    var command = that['stateCommand'];
    var stdout = "none";  
      exec(command, function (error, stdout, stderr) {
        var Value=stdout.trim().toLowerCase();
        that.log('海康 ' + that.name + ' is: ' + Value);
        callback(null, Value == that.onValue);
    });
  },

  setState: function(powerOn, callback) {
    var that = this;
    var state = powerOn ? 'on' : 'off';
    var prop = state + 'Command';
    var command = that[prop];
  
    exec(command);
    callback(null);
  }
}

hikvisionAccessory.prototype.getServices = function() {
  var informationService = new Service.AccessoryInformation();
  var switchService = new Service.Switch(this.name);

  informationService
  .setCharacteristic(Characteristic.Manufacturer, 'Hikvision')
  .setCharacteristic(Characteristic.Model, 'hikvision Q1')
  .setCharacteristic(Characteristic.SerialNumber, '2CV3Q21FD');

  var characteristic = switchService.getCharacteristic(Characteristic.On)
  .on('set', this.setState.bind(this))
  .on('get', this.getState.bind(this));


  return [switchService];
}
