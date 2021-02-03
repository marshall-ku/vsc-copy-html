import * as vscode from "vscode";
import { exec, spawn } from "child_process";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        "vsc-copy-html.copyFormattedHtml",
        async () => {
            var osvar = process.platform;

            if (osvar === "darwin") {
                exec(
                    `clipboard=$(osascript -e 'the clipboard as «class HTML»' |   perl -ne 'print chr foreach unpack("C*",pack("H*",substr($_,11,-3)))')
                    [[ $clipboard =~ (<meta charset=\'utf-8\'>)(<div)(.*)(<\/div>) ]]
                    echo '<code'\${BASH_REMATCH[3]}'</code>' | pbcopy`,
                    { shell: "powershell.exe" },
                    (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                    }
                );
            } else if (osvar === "win32") {
                exec(
                    `$text = Get-Clipboard -TextFormatType Html;$regex = "<!--StartFragment--><div(.*?)>(.+?)(<\/div>)<!--EndFragment-->";$text = "<code class=""codeblock"">$(([regex]($regex)).match($text).groups[2].value)</code>";Set-Clipboard -value $text`,
                    { shell: "powershell.exe" },
                    (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                    }
                );
            }
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
