// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

var fs = require('fs');
//var file = "C:\\Users\\Lenovo\\hellocode\\out\\words.json";
var file = "./words.json";
var WORDS = JSON.parse(fs.readFileSync( file));

var wordsum = 0;
for (var key in WORDS){wordsum += WORDS[key];}

function P(word:any, N=wordsum){
	"Probability of `word`."
	return WORDS[word] / N;
}

function correction(word:any){
	"Most probable spelling correction for word."
	var ans = "";
	var p = -1;
	var temp = candidates(word);
	console.log("1" in temp);
	for (var w in temp){if (P(temp[w])>p){console.log(temp[w]);ans = temp[w]; p=P(w);}}
	return ans;
}

function candidates(word:any){
	"Generate possible spelling corrections for word."
	console.log(word);
	if (known([word]).length>0){return [word];}
	else if(known(edits1(word)).length>0){return known(edits1(word));}
	else if(known(edits2(word)).length>0){return known(edits2(word));}
	else{return [word];}
}

function known(words:any){
	"The subset of `words` that appear in the dictionary of WORDS."
	var set = [];
	for (var w in words){
		if (words[w] in WORDS){set.push(words[w]);}
	}
	return set;
}

function edits1(word:any){
	"All edits that are one edit away from `word`."
	var letters = 'abcdefghijklmnopqrstuvwxyz';
	var splits = [];
	var deletes = [];
	var transposes = [];
	var replaces = [];
	var inserts = [];
	for (var i=0;i<word.length;i++){splits.push([word.slice(0,i), word.slice(i)]);}
	for (var i=0;i<splits.length;i++){deletes.push(splits[i][0] + splits[i][1].slice(1));}
	for (var i=0;i<splits.length;i++){
		if (splits[i][1].length>1){
			transposes.push(splits[i][0]+splits[i][1][1]+splits[i][1][0]+splits[i][1].slice(2));
		}
	}
	for (var i=0;i<splits.length;i++){
		for (var c=0;c<letters.length;c++){
			replaces.push(splits[i][0]+letters[c]+splits[i][1].slice(1));
		}
	}
	for (var i=0;i<splits.length;i++){
		for (var c=0;c<letters.length;c++){
			inserts.push(splits[i][0]+letters[c]+splits[i][1]);
		}
	}
	return (deletes.concat(transposes).concat(replaces).concat(inserts));
}

function edits2(word:any){
	"All edits that are two edits away from `word`."
	var ans = [];
	for (var e1 in edits1(word)){
		for (var e2 in edits1(e1)){
			ans.push(e2);
		}
	}
	return ans;
}

function sentenceprocess(s:any){
	var w = s.split(" ");
	var ans = "";
	for (var v in w)
	{
		if (w[v] !== ""){
			if (ans !==""){ans += " ";}
			ans += correction(w[v]);
		}
		else{ans += " ";}
	}
	return ans;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code p only be executed once when your extension is activated
		console.log('Congratulations, your extension "hellocode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
	var editor = vscode.window.activeTextEditor;
	if (!editor) {
		return; 
	} 
	var selection = editor.selection;
	var text = editor.document.getText(selection);
	editor.edit(editBuilder => {editBuilder.replace(selection, sentenceprocess(text))});
	vscode.window.showInformationMessage('Corrected result: ' + sentenceprocess(text));
	});
	console.log(vscode.workspace.workspaceFolders);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
