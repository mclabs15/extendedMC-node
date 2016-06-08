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

The program will parse custom commands in the minecraft console which are wrapped with \<CMD> and \</CMD>. It will not accept a command from a player using it in a chat message, in order to prevent it from being exploited. However, one way to trigger a custom command via chat is to type

        /say <CMD>your command here</CMD>

Any text that is printed to the console which contains \<CMD> and then \</CMD> will be parsed and checked for validity.

The problem with using /say for all custom commands is that it creates chat spam. To use them in command blocks, you will want to set the gamerule logAdminCommands to false, and set gamerule sendCommandFeedback to false. Next, you need to embed the custom command in another command which can print an output to the console.

To run custom commands with command blocks, one can trigger blocks in a chain sequence. begin the chain with 

        /gamerule logAdminCommands true

and end the chain by setting the gamerule back to false.

In the middle, you'll need to use a /blockdata command to embed a custom one. This requires a tile entity to act as an "anchor block".

Create an anchor block by placing a chest, empty command block, etc, at your desired coordinates. (make sure the coordinates are within the spawn chunks). For example, 

        /setblock 0 0 0 chest

will create an anchor chest at 0 0 0.

Once the anchor block is created, a blockdata command can be used to activate custom commands. In between the two /gamerule blocks, try the following command in the middle.

        /blockdata 0 0 0 {customcommand:"<CMD>repeat 10 say this is the <MATH>[i]+1</MATH>th time!</CMD>"}

Triggering the chain should output:

        this is the 1th time!
        this is the 2th time!
        this is the 3th time!
        this is the 4th time!
        this is the 5th time!
        this is the 6th time!
        this is the 7th time!
        this is the 8th time!
        this is the 9th time!
        this is the 10th time!

###savedata
Usage: savedata [X] [Y] [Z] [selector]

The savedata command will obtain the name and UUID of the entity specified with the selector. This command requires an anchor sign block to save the data to. Place a sign block somewhere, and use its coordinates as the xyz parameters. (this is required because JSON selectors cannot be outputted directly to the console.)

####(Note: the selector will run from the coordinates of the sign)

Example:

        <CMD>savedata 23 106 49 @e[c=1]</CMD>

###loaddata
Usage: loaddata [X] [Y] [Z]

This command will save the data saved with savedata to variables on the server. Use the same XYZ coordinates as the savedata sign.

###phead
Usage: phead [selector]

This command will create a player skull with its SkullOwner tag set to the name saved to the server via loaddata. This skull will be given to the player(s) spacified.

Example:
  
        <CMD>phead Steve</CMD>

###repeat
Usage: repeat [count] [command]

This command will repeat the specified command for as many times as specified.
The string "[i]" will be replaced with the current iteration of the loop (0-indexed).
There can also be math operations in the command to be run, wrapped in \<MATH> and \</MATH>. Math operations use javascript math functions, so "sin()" can be used with "Math.sin()".

Example:

        <CMD>repeat 100 execute @p ~ ~ ~ summon ArmorStand ~<MATH>Math.sin([i]*Math.PI*2/100)*10</MATH> ~ ~<MATH>Math.cos([i]*Math.PI*2/100)*10</MATH> {NoGravity:1,CustomName:ring}</CMD>

The above command will spawn 100 armorstands in a ring around the player with a radius of ~10 blocks.