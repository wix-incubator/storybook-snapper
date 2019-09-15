const findPkg = require('find-pkg');
const { execSync } = require('child_process');
const merge = require('lodash/merge');
const { DATA_READY_HOOK } = require('../src/hooks');

const PULL_REQUEST_PARENT_HASH_INDEX = 2;
const HEAD_HASH_INDEX = 0;

function getHeadHash() {
  return execSync('git rev-parse --verify HEAD').toString();
}

function getParentsHashArray() {
  const headCommitHash = getHeadHash();
  return execSync(`git rev-list --parents -n 1 ${headCommitHash}`)
    .toString()
    .split(' ');
}

function getPRHeadHash() {
  const parentsHashArr = getParentsHashArray();
  const isPullRequest = parentsHashArr.length === 3;
  const parentHashIndex = isPullRequest
    ? PULL_REQUEST_PARENT_HASH_INDEX
    : HEAD_HASH_INDEX;
  return parentsHashArr[parentHashIndex].trim();
}

function getBatchId() {
  return getPRHeadHash();
}

function getAppName() {
  const packageFile = require(findPkg.sync('.'));
  return packageFile.name;
}

module.exports = ({config}) => merge({
  apiKey: process.env.EYES_API_KEY,
  batchId: getBatchId(),
  batchName: getAppName(),
  exitcode: true,
  waitBeforeScreenshots: `[${DATA_READY_HOOK}="true"]`,
}, config);
