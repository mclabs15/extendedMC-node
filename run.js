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
noquotes = new RegExp('"','g');
String.prototype.noquotes = function() {
	return this.replace(noquotes,'');
}

stopServer = function(process) {
	process.kill('SIGINT');
}
sendCommand = function(process,cmd) {
	process.stdin.write(cmd + "\n");
}

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};



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


				parseCmd(cmd,command);
			}










		}



	}

}
parseCmd = function(cmd,full) {

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
var cm = cmd.substring(cmd.indexOf(args[2]));
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

	Vars[args[1]] = eval(cm);
	}
catch(e) {

}
break;
case "buildjsonblock":

sendCommand(prc,"/blockdata "+args[1]+" "+args[2]+" "+args[3]+" {ZZZZ:'<CMD>readjson "+args[4]+"</CMD>'}");

break;
case "buildjsonentity":

sendCommand(prc,"/entitydata "+args[1]+" {ZZZZ:'<CMD>readjson "+args[2]+"</CMD>'}");

break;
case "readjson":
var f2 = full.substring(full.indexOf("{"));
console.log(f2);
console.log("");
for(var i = 199; i >= 0; i--) {
	var regex = new RegExp(i.toString()+":", "g");
	f2 = f2.replace(regex,"");
}
f2 = f2.replace(/<CMD>/g,"");
f2 = f2.replace(/<\/CMD>/g,"");
//var newdata = "{" + cmd.slice(cmd.indexOf(",")+1,cmd.indexOf(",AAAA")) + "}";
var newdata = f2;
console.log(newdata);
try {
f2 = f2.replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9]+)(['"])?:/g, '$1"$3":');


var divchars = [":",",","[","{","}","]"];
var numchars = ["0","1","2","3","4","5","6","7","8","9","-"];
var letterchars = ["f","d","L","s","b","c"];
var nstart = 1;
var nend = 1;
var isnum = 0;
var innum = 0;
var quotes = [];
var qoff = 0;
for(var i = 0; i < f2.length - 1; i++) {
var sec = f2.substring(i,i+3);


var n0n = 0;
var n0d = 0;
var n1n = 0;
var n1l = 0;
var n2d = 0;
for(var j = 0; j < letterchars.length; j++) {
for(var k = 0; k < numchars.length; k++) {
for(var l = 0; l < divchars.length; l++) {
if(sec[0] == numchars[k]) {
n0n = 1;
}
if(sec[0] == divchars[l]) {
n0d = 1;
}
if(sec[1] == numchars[k]) {
n1n = 1;
}
if(sec[1] == letterchars[j]) {
n1l = 1;
}
if(sec[2] == divchars[l]) {
	n2d = 1;
}

}
}
}


if(n0n || n1n) {
	innum = 1;
}

if(n0d && n1n) {
	isnum = 1;
	nstart = i+1;
}
if(n0n && n1l && n2d) {
	isnum = 2;
	nend = i+2;
}
else isnum = 0;

if(isnum == 2 && innum) {
	quotes.push(nstart);
	quotes.push(nend);
	innum = 0;
}

}

console.log(quotes);
for(var i = 0; i < quotes.length; i++) {
	f2 = f2.splice(quotes[i]+qoff,0,'"');
	qoff++;
}


console.log("");
console.log("//"+f2+"//");
//eval('var json = new Object(' + json_string + ')');
//////////var p = JSON.parse(f2);
//delete p.ZZZZ;
Vars[args[1]] = JSON.parse(f2);
//THE d,f,L,c, ETC SUFFIXES MESS UP THE PARSING
console.log("success!");
}
catch(e) {
console.log("error: " + e);
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










