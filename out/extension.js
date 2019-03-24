"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
var fs = require('fs');
var file = "C:\\Users\\Lenovo\\hellocode\\out\\words.json";
//var file = "./words.json";
var WORDS = JSON.parse(fs.readFileSync(file));
var wordsum = 0;
for (var key in WORDS) {
    wordsum += WORDS[key];
}
function P(word, N = wordsum) {
    "Probability of `word`.";
    return WORDS[word] / N;
}
function correction(word) {
    "Most probable spelling correction for word.";
    var ans = "";
    var p = -1;
    var temp = candidates(word);
    for (var w in temp) {
        if (!(P(temp[w]) < p)) {
            ans = temp[w];
            p = P(w);
        }
    }
    return ans;
}
function candidates(word) {
    "Generate possible spelling corrections for word.";
    if (known([word]).length > 0) {
        return [word];
    }
    else if (known(edits1(word)).length > 0) {
        return known(edits1(word));
    }
    else if (known(edits2(word)).length > 0) {
        return known(edits2(word));
    }
    else {
        return [word];
    }
}
function known(words) {
    "The subset of `words` that appear in the dictionary of WORDS.";
    var set = [];
    for (var w in words) {
        if (words[w] in WORDS) {
            set.push(words[w]);
        }
    }
    return set;
}
function edits1(word) {
    "All edits that are one edit away from `word`.";
    var letters = 'abcdefghijklmnopqrstuvwxyz';
    var splits = [];
    var deletes = [];
    var transposes = [];
    var replaces = [];
    var inserts = [];
    for (var i = 0; i < word.length; i++) {
        splits.push([word.slice(0, i), word.slice(i)]);
    }
    for (var i = 0; i < splits.length; i++) {
        deletes.push(splits[i][0] + splits[i][1].slice(1));
    }
    for (var i = 0; i < splits.length; i++) {
        if (splits[i][1].length > 1) {
            transposes.push(splits[i][0] + splits[i][1][1] + splits[i][1][0] + splits[i][1].slice(2));
        }
    }
    for (var i = 0; i < splits.length; i++) {
        for (var c = 0; c < letters.length; c++) {
            replaces.push(splits[i][0] + letters[c] + splits[i][1].slice(1));
        }
    }
    for (var i = 0; i < splits.length; i++) {
        for (var c = 0; c < letters.length; c++) {
            inserts.push(splits[i][0] + letters[c] + splits[i][1]);
        }
    }
    return (deletes.concat(transposes).concat(replaces).concat(inserts));
}
function edits2(word) {
    "All edits that are two edits away from `word`.";
    var ans = [];
    var ed1 = edits1(word);
    for (var e1 in ed1) {
        var ed2 = edits1(ed1[e1]);
        for (var e2 in ed2) {
            ans.push(ed2[e2]);
        }
    }
    return ans;
}
function sentenceprocess(s) {
    var w = s.split(" ");
    var ans = "";
    for (var v in w) {
        if (w[v] !== "") {
            if (ans !== "") {
                ans += " ";
            }
            ans += correction(w[v]);
        }
        else {
            ans += " ";
        }
    }
    return ans;
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
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
        editor.edit(editBuilder => { editBuilder.replace(selection, sentenceprocess(text)); });
        vscode.window.showInformationMessage('Corrected result: ' + sentenceprocess(text));
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map