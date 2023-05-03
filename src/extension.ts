// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function generateFunctionComment(editor: vscode.TextEditor) {
	const position = editor.selection.active;
	let lineNumber = position.line;

	while (lineNumber >= 0) {
		const line = editor.document.lineAt(lineNumber).text.trim();

		if (line.startsWith('func ')) {
			const match = line.match(/^func (\w+)/);
			if (match) {
				const functionName = match[1];
				const indent = /^\s*/.exec(line) ![0]; // extract whitespace from the beginning of the line
				const comment = `/**\n${indent} * Func: ${functionName} is for ...\n${indent} * \n${indent} * @author GoCommnets \n${indent} *\n${indent} * @params ...\n${indent} * @return\n${indent} */\n`;
				editor.edit((editBuilder) => {
					editBuilder.insert(new vscode.Position(lineNumber, 0), comment + '\n');
				});
			} else {
				vscode.window.showInformationMessage('Error: Failed to extract function name from line.');
			}
			return;
		}

		lineNumber--;
	}

	vscode.window.showInformationMessage('No function declaration found above the cursor position.');
}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.generateComment', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const fileName = editor.document.fileName;
		if (!fileName.endsWith('.go')) {
			vscode.window.showInformationMessage('Comments are only supported for .go files.');
			return;
		}

		generateFunctionComment(editor);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}