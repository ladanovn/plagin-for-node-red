# Installation instructions
### 1. Upgrading node-red. Min version 0.19   
   [more: https://nodered.org/docs/getting-started/upgrading.html](https://nodered.org/docs/getting-started/upgrading.html)
### 2. Install the plugin via npm   
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  From ~/.node-red run  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  `sudo npm install <path to plagin folder>`.  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  For example,  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  `sudo npm install ../node-red-plagins/device`
### 3. Configuration setting.js  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Briefly,   
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Change the file __setting.js__ in ~/.node-red by adding to it   
   ```
      contextStorage: {
        default: {
         module:"localfilesystem"
        }
      }
      
   ```    
   
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; __or__  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Use setting.js this plagin. Then  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `node-red -s <path to setting.js by this plagin>`   
   
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [more: https://nodered.org/docs/configuration](https://nodered.org/docs/configuration)
      
   
