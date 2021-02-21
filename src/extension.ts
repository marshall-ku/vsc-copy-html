import * as vscode from "vscode";
import { exec } from "child_process";

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        "vsc-copy-html.copyFormattedHtml",
        async () => {
            const { platform } = process;

            if (platform === "win32") {
                // Windows
                exec(
                    `$text = Get-Clipboard -TextFormatType Html;$regex = "<!--StartFragment--><div(.*?)>(.+?)(<\/div>)<!--EndFragment-->";$text = "<code class=""vscode"">$(([regex]($regex)).match($text).groups[2].value)</code>";Set-Clipboard -value $text`,
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
                    }
                );
            } else if (platform === "darwin") {
                // MacOS
                exec(
                    `echo $(osascript -e 'the clipboard as «class HTML»' |   perl -ne 'print chr foreach unpack("C*",pack("H*",substr($_,11,-3)))')`,
                    { shell: "bash" },
                    (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }

                        const codeBlock = /<div.*?>(.*)<\/div>/;
                        const match = stdout.match(codeBlock);

                        if (!match) {
                            return;
                        }

                        const code = `<code class="vscode">${match[1]}</code>`;

                        exec(`echo '${code}' | pbcopy`);
                    }
                );
            }
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
