# extendedMC-node
A NodeJS application which parses the console output of a minecraft server and inputs new commands.

## Setup

This will work with Minecraft version 1.9 and up.

1. Download your [minecraft server.jar](https://minecraft.net/en/download/server) and place it in the directory. If you don't have nodeJS and npm, you will need to [install them](https://nodejs.org/en/).

2. Rename the server jar to "server.jar".

3. Open a terminal and navigate to your directory.

    
        cd yourdirectory

4. To run the server initially, use

        node run.js

5. A Minecraft server console should open up. If it doesn't close on its own, close it, and agree to the Minecraft server EULA found in "eula.txt".
6. use

        node run.js

a second time. Once the server console has finished generating files and loaded the spawn area, enter

        stop

into the minecraft server console. Edit "server.properties" with your preferences. Make sure "enable-command-block" = "true".

##Running

Your extended server should now be set up. You can now run it either by entering

        node run.js
        
in a console set to your server directory, or running "run.bat".

##Commands

(Note: these commands are very incomplete, and are unfinished. They may change at any time.)

###Syntax

The program will parse custom commands in the minecraft console which are wrapped with <CMD> and </CMD>. It will not accept a command from a player using it in a chat message, in order to prevent it from being exploited. However, one way to trigger a custom command via chat is to type

        /say <CMD>your command here</CMD>

