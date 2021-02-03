clipboard=$(osascript -e 'the clipboard as «class HTML»' |   perl -ne 'print chr foreach unpack("C*",pack("H*",substr($_,11,-3)))')
[[ $clipboard =~ (<meta charset=\'utf-8\'>)(<div)(.*)(<\/div>) ]]
echo '<code'${BASH_REMATCH[3]}'</code>' | pbcopy