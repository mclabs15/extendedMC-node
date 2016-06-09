var spawn = require('child_process').spawn;
running = false;



prc = spawn('java',  ['-Xmx1024M', '-Xms1024M', '-jar', './server.jar'],{
			detached:true,
});
running = true;

		//noinspection JSUnresolvedFunction
prc.stdout.setEncoding('utf8');
prc.stdout.on('data', function (data) {
		    var str = data.toString()
		    var lines = str.split(/(\r?\n)/g);
		    var op = lines.join("");
		    parseText(lines);

});

prc.on('close', function (code) {
		    console.log('process exit code ' + code);
		    running = false;
});


entityName = "";
entityId = "";

blockNBT = "";

Vars = {};


stopServer = function(process) {
	process.kill('SIGINT');
}
sendCommand = function(process,cmd) {
	process.stdin.write(cmd + "\n");
}





////////////////////////////////////////





weightRandom = function(data) {
var i = 0;
var sum1 = 0;
var sum2 = 0;
for(var j = 0; j < data.length; j++) {
	sum1 += data[j].weight;
}
var rand = Math.random()*sum1;
for(var j = 0; j < data.length; j++) {
	sum2 += data[j].weight;
	if(rand <= sum2) return data[j].data;

}
};


///////////////////


parseText = function(lines) {
lines.reverse();
	for(var i = 0; i < lines.length; i++) {
		//console.log(line);
		var line = lines[i];



		var logIndex = line.indexOf("]: ")
		//console.log(line);
		if(logIndex != -1) {
			var command = line.substring(33);
			command = command.replace(/\\u003c/g,"<");
			command = command.replace(/\\u003e/g,">");
			var player = command.indexOf("<");
			var start = command.indexOf("<CMD>");
			var end = command.indexOf("</CMD>");
			if(start != -1 && end != -1 && player != 0 && start+5 != end) {
				var cmd = command.substring(start+5,end);


				parseCmd(cmd);
			}










		}



	}

}
parseCmd = function(cmd) {

var args = cmd.split(" ");
console.log("CUSTOM: " + cmd);

switch(args[0]) {
case "party":
sendCommand(prc,"/execute @a ~ ~ ~ summon Pig");
break;

case "uuid":
if(cmd.indexOf('id:\\\\"') != -1) {
var ui = cmd.indexOf('id:\\\\"');
var pid = cmd.substring(ui+6,ui+6+36);
//console.log(pid);
var pi = cmd.indexOf('name:\\\\"');
var pname = cmd.substring(pi+8);
pname = pname.substring(0,pname.indexOf("\\\\\""));
//console.log(pname);

entityId = pid;
entityName = pname;
}
break;
case "phead":
//phead [player]
console.log("fired");
sendCommand(prc,"/give "+args[1]+" skull 1 3 {SkullOwner:"+entityName+"}");
break;
case "setvar":
try {
	Vars[args[1]] = eval(args[2]);
	}
catch(e) {

}
break;
case "savedata":
//savedata [X] [y] [z] selector
sendCommand(prc,"/blockdata "+args[1]+" "+args[2]+" "+args[3]+" {Text1:\"[\\\"\\\",{\\\"text\\\":\\\"<\/CMD>\\\"}]\",Text2:\"[\\\"\\\",{\\\"selector\\\":\\\""+args[4]+"\\\"}]\",Text3:\"[\\\"\\\",{\\\"text\\\":\\\"<CMD>uuid \\\"}]\"}")
break;
case "loaddata":
//loaddata [x] [y] [z]
sendCommand(prc,"/blockdata "+args[1]+" "+args[2]+" "+args[3]+" {arbitrary:1}");

break;
case "getnbt":
//getnbt [x] [y] [z]
sendCommand(prc,"/blockdata "+args[1]+" "+args[2]+" "+args[3]+" {AAAA:'</CMD>',ZZZZ:'<CMD> readnbt'}");
break;
case "readnbt":

var newdata = "{" + cmd.slice(cmd.indexOf(",")+1,cmd.indexOf(",AAAA")) + "}";
console.log(newdata);
blockNBT = newdata;
break;
case "replacenbt":
//replacenbt [find] [replace]
var regex = new RegExp(args[0], "g");
blockNBT = blockNBT.replace(regex,args[1])
break;
case "setnbt":
//setnbt [x] [y] [z]
sendCommand(prc,"/blockdata "+args[1]+" "+args[2]+" "+args[3]+ blockNBT);
break;
case "repeat":
//repeat [count] [command]

if(!isNaN(parseInt(args[1]))) {
	
	var send = cmd.substring(cmd.indexOf(args[2]));
	for(var i = 0; i < parseInt(args[1]); i++) {
		var cm = send.replace(/\[i\]/g,i);
		

		while(cm.indexOf("<MATH>") != -1) {
			mo = {};
			var ms = "";
			var mi = cm.indexOf("<MATH>") + 6;
			if(cm.indexOf("</MATH>")) {
				ms = cm.substring(mi,cm.indexOf("</MATH>"));
				ms = ms.replace(/;/g,"");
				
				var domath = function(m) {
					return eval(m);
				}
				try{
					eval('mo.val = domath(ms)');
				}
				catch(e) {
					mo.val = 0;
				}
				ms = mo.val;
				console.log(ms);
				//cm = cm.slice(mi,cm.indexOf("</MATH>"));
				cm = cm.slice(0,mi) + cm.slice(cm.indexOf("</MATH>"),cm.length);

				cm = cm.replace("<MATH>",ms);
				cm = cm.replace("</MATH>","");
				console.log(cm);
			}
			else {
				cm = cm.replace("<MATH>","");
			}
		}




		sendCommand(prc,cm);
	}
}

break;



}


}










