$text = Get-Clipboard -TextFormatType Html
$regex = "<!--StartFragment--><div(.*?)>(.+?)(<\/div>)<!--EndFragment-->"
$text = "<code class=""codeblock"">$(([regex]($regex)).match($text).groups[2].value)</code>"

Set-Clipboard -value $text