#!/usr/bin/env node


// Almost-functional git tag renamer.
//
// USAGE: ./fixtag.js <package>
//    ...where package is a subdirectory under packages.
//
// This will rename the latest git tag <npmpackagename>@<version> to <npmpackagename>/<version> which looks cleaner in e.g. Sourcetree.
//
// TODO: Fails to push, which must be done manually

const { exec } = require('child_process');

const targetPackage = process.argv[process.argv.length - 1];
const { name, version } = require(`./packages/${targetPackage}/package.json`);

const oldTag = `${name}@${version}`;
const newTag = `${name.replace('react4xp', '_react4xp/react4xp').replace('_react4xp/react4xp-', '_react4xp/')}/${version}`;


const VERBOSE = true;

if (VERBOSE) console.log("Copy git tag:", oldTag, '->', newTag);

const getHandler = (label, callbackOnSuccess) =>  (error, stdout, stderr) => {
  if (error) {
    console.error(`ERROR (${label}): ${error}`);
  }
  if (VERBOSE && stdout) console.log(stdout);
  if (stderr) console.error(stderr);
  if (!error) {
    callbackOnSuccess();
  }
};

const getCommandRunner = (label, command, callbackOnSuccess) => () => {
  if (VERBOSE) {
    console.log(`

##############
${command}
  `);
  }

  exec(command, getHandler(label, callbackOnSuccess));
};

// Commands declared in reverse running order:
const pushTags = getCommandRunner('pushTags', 'git push --tags', ()=>{ console.log("Copied git tag:", oldTag, '->', newTag); });
//const pushDeletion = getCommandRunner('pushDeletion', `git push origin :ref/tags/${oldTag}`, pushTags);
//const deleteOld = getCommandRunner('deleteOld', `git tag -d ${oldTag}`, pushDeletion);
const tagNew = getCommandRunner('tagNew', `git tag ${newTag} ${oldTag}`, pushTags);

tagNew();
