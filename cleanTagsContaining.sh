#!/bin/bash
if [ $# -eq 0 ]; then
    echo "Targets a substring in all tags locally and remotely, and deletes mathcing tags."
    echo "No target tag substring provided."
    echo "Usage:"
    echo "    $0 <substringInTag>"
    exit 1
fi
echo "Tags matching '$1': git tag -l \"*$1*\""
git tag -l "*$1*"
for tag in $(git tag -l "*$1*"); do
  echo ""; echo "Deleting: $tag"
  git tag -d $tag
  git push --delete origin $tag
done
