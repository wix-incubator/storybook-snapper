const { execSync } = require('child_process');

function getGitData = () => {
  const [, orgNameAndProjectName] = execSync('git config --get remote.origin.url').toString().split(':');
  const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString();

  const [orgName, projectNameWithSuffix] = orgNameAndProjectName.split('/');
  const [projectName] = projectNameWithSuffix.split('.git');

  return {
    orgName,
    projectName,
    branchName
  }
}


module.exports = { getGitData };
