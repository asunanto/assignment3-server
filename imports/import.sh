ls -1 *.json | while read jsonfile; do mongoimport -d assignment-3 -c ${jsonfile%.*} --file $jsonfile --jsonArray; done
