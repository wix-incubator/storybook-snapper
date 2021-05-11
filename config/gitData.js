const { execSync } = require('child_process');

function getGitData () {
  const [, orgNameAndProjectName] = execSync('git config --get remote.origin.url').toString().split(':'); // e.g. git@github.com:wix-incubator/storybook-snapper.git
  const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().replace('\n', ''); // e.g. myBranch\n

  const [orgName, projectNameWithSuffix] = orgNameAndProjectName.split('/');
  const [projectName] = projectNameWithSuffix.split('.git');

  return {
    orgName,
    projectName,
    branchName
  }
}

module.exports = { getGitData };
