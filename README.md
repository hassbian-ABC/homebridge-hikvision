homebridge-hikvision （带假反馈，只要是通过homekit控制，重启homebridge会保持之前的状态）

安装： npm install -g https://github.com/hassbian-ABC/homebridge-hikvision

把海康摄像头的预设位置在homekit里显示为开关

因为我只需要两个位置，背面和正面，背面向墙，表示不是监控状态，正面监控家里

支持海康小企鹅以及我不知道的设备，自己去试

你需要在摄像头设置两个预设位置

修改on.sh 和 off.sh

{

            "accessory": "hikvision",
            
            "name": "摄像头",
            
            "on": "/home/pi/homebridge-hikvision/on.sh",
            
            "off": "/home/pi/homebridge-hikvision/off.sh",
            
            "state": "cat /home/pi/homebridge-hikvision/script.flag",
            
            "on_value" : "0"
            
        }
        
    ]
路径自己修改成你的路径

这只是我自己玩的一个小玩意


homeassistant配置

只需要脚本，同样修改on.sh off.sh

switch:

  - platform: command_line

    switches:
  
      camera:
    
        command_on: "/home/pi/homebridge-hikvision/on.sh"
      
        command_off: "/home/pi/homebridge-hikvision/off.sh"
      
        command_state: "cat /home/pi/homebridge-hikvision/script.flag"
      
        value_template: '{{ value == "0" }}'
      
        friendly_name: camera
