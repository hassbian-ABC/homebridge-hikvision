echo "OFF"
/usr/bin/curl -X PUT http://admin:adminDXPUCS@192.168.1.74/PTZCtrl/channels/1/presets/2/goto
echo "1" > /home/jiaxuan/Zhimifan/plugin/homebridge-hikvision/script.flag
