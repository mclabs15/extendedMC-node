# extendedMC-node
A NodeJS application which parses the console output of a minecraft server and inputs new commands.

##DISCLAIMER:
USE AT YOUR OWN RISK. Due to the nature of how this program interacts with a Minecraft server, it may be possible for a player on your server to run malicious code through nodeJS on your computer. I am not responsible for any damages caused directly or indirectly by the usage of this program.

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

Note: for non-player entities with a CustomName tag, savedata, loaddata, and phead are unnecessary to obtain a skull with that name. Instead, use the buildjsonentity command to create a variable, which can be used with a repeat/give command.

###repeat
Usage: repeat [count] [command]

This command will repeat the specified command for as many times as specified.
The string "[i]" will be replaced with the current iteration of the loop (0-indexed).
There can also be math operations in the command to be run, wrapped in \<MATH> and \</MATH>. Math operations use javascript math functions, so "sin()" can be used with "Math.sin()". Math brackets can be used to return non-math values as well, and can be used with strings and other functions. Math brackets can currently be used in the commands:

* repeat
* setvar
* (more soon probably)

Example:

        <CMD>repeat 100 execute @p ~ ~ ~ summon ArmorStand ~<MATH>Math.sin([i]*Math.PI*2/100)*10</MATH> ~ ~<MATH>Math.cos([i]*Math.PI*2/100)*10</MATH> {NoGravity:1,CustomName:ring}</CMD>

The above command will spawn 100 armorstands in a ring around the player with a radius of ~10 blocks.


###Variables

Variables can be created of any JS data type (int, floating point, string, array, object, etc) with certain commands. These can be modified and used in commands. Variables can be accessed in \<MATH> brackets with "Vars.VARIABLENAME".

###buildjsonentity
Usage: buildjsonentity [selector] [var]

This command will create a JSON object variable containing the NBT data of an entity selected with [selector]. This variable will be named by the [var] argument.

Example:
        
        <CMD>buildjsonentity @e[type=Pig,c=1] pigdata</CMD>
        //creates a variable called 'pigdata' with the NBT of the nearest pig entity

###buildjsonblock
Usage: buildjsonblock [x] [y] [z] [var]

Works like buildjsonentity, but saves the tile entity NBT of the specified block coordinates.

###setvar
Usage: setvar [var] [value]

Sets the value of variable [var] to [value], or creates the variable and assigns the value if it does not exist. \<MATH> brackets can be optionally used in the place of [value].

Examples:

        <CMD>setvar test1 "blah"</CMD> //creates var test1, and gives it the string value "blah".
        <CMD>setvar count 1</CMD> //creates var count, and gives it the int value 1.
        <CMD>setvar count <MATH>Math.cos(Vars.count)</MATH></CMD> //sets the variable count to the cosine(rad) of itself.

###Using variables in commands

        <CMD>repeat 1 give PLAYER <MATH>Vars.itemname</MATH></CMD> //gives PLAYER one item with an id equal to the string stored in the variable "itemname".

        <CMD>repeat 1 entitydata @e[type=Pig] <MATH>JSON.stringify(Vars.pigdata).noquotes()</MATH></CMD> //sets all pigs' NBT to the NBT stored in the pigdata variable. The stringify function turns it into a string, and noquotes is a custom function to remove some quotation marks that cause errors.

        <CMD>repeat 1 entitydata @e[type=Pig] {CustomName:<MATH>JSON.stringify(Vars.pigdata.CustomName).noquotes()</MATH>}</CMD> //sets all pigs' NBT to the CustomName tag of the pigdata json variable.