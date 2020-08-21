
#HVORFOR npmInstaller react4xp, nashornpolyfills, buildcomponents underveis i lerna version?
#Bryter prosessen når det skjer før lvl1 publish!
#Del av dette bygget, eller lerna?


#Why? Lerna updates versions and dependents, but dependents need to update their package-lock AFTER their dependencies have been released with new versions.

# Build, npm-link and test the current state. DO NOT CLEAN this before publishing!
gradlew test

# Level 1: checks for/bumps the basic dependencies: regions and constants, marking all othe packages as "lernatmp" prereleases:
lerna version --conventional-commits --exact --no-push --include-merged-tags --no-changelog --conventional-prerelease=react4xp-build-components,react4xp-runtime-client,react4xp-runtime-externals,react4xp-runtime-nashornpolyfills,react4xp --preid lernatmp

#level 2:
# lerna version --conventional-commits --exact --no-push --include-merged-tags --no-changelog --conventional-prerelease=react4xp --preid lernatmp

# Remove lernatmp tags
git push --delete origin $(git tag -l "*lernatmp*") && git tag -d $(git tag -l "*lernatmp*")


# Traverse all changed package*.json files. For each that now has "lernatmp" in the version, revert the version line to before the last commit:

# First, lit all changed package*.json in the last commit
for f in $(git diff --name-only HEAD^ | grep -e "^packages[\/\\].*[\/\\]package.*\.json$"); do

  # From = lernatmp version, To = what that was in the previous commit
  to="$(git diff HEAD^ $f | grep -A 1 -B 1 -e "version.*lernatmp" | grep "\- *.version.:")"
  from="$(git diff HEAD^ $f | grep -A 1 -B 1 -e "version.*lernatmp" | grep "\+ *.version.:")"

  # Count matches in the package file $f. There should be exactly one.
  toc="$(echo $to | grep -e "version" -c)"
  frc="$(echo $from | grep -e "version" -c)"

  # Modify To an From, from git diff format to something usable in a search replace
  to=$(echo $to | sed 's/^\- *//g' | sed 's/\s*,\s*$//g')
  from=$(echo $from | sed 's/^\+ *//g' | sed 's/\s*,\s*$//g' | sed 's/\(.|-\)/\\\1/g')

  # If there is indeed exactly one, search and replace in the current file $f
  if [ $toc = "1" ] && [ $frc = "1" ]; then
    echo "Reverting: $f"
    echo "    $from"
    echo " -> $to"
    eval "sed -i -e 's/$from/$to/g' $f"
    echo ""
  fi
done

# For some reason, the prev script creates json-e files. Remove them.
rm packages/*/*.json-e

echo "First level of packages (regions and constants) is done. Now:"
echo "    1. Commit/push:"
echo "       git add . --all && git commit -m'Revert premature lernatmp version bumps, keep completed bumps in dependencies' && git push"
echo "    2. Publish this level to NPM:"
echo "       gradlew doPublish -Plvl=1"
echo "    3. Clean and rebuild the next level (let the last level, :packages:react4xp:npmInstall, fail)"
echo "       gradlew cleanNpm && gradlew npmInstall"
echo "    4. Commit/push the now updated package-locks:"
echo "       git add . --all && git commit -m'Update package-locks' && git push"
echo "    5. Move on to level 2 (the rest of the packages except react4xp)"
