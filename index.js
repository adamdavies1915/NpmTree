const axios = require('axios');

function process(dependencies) {
  dependancyList = []
  if (dependencies == null) {
    return dependancyList;
  }
  Object.keys(dependencies).forEach(name => {
    dependancyList.push({ 'name': name, 'version': dependencies[name].replace('~', '').replace('>', '').replace('=', '') })
  });
  return dependancyList
}


async function getLibraryDependencies(libaryName, version) {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${libaryName}/${version}`);
    return process(response.data.dependencies)
  } catch (error) {
    console.error(error);
  }
}

async function getLibaryDependencyBranches(libaryName, version) {
  unprocessedDependencies = await getLibraryDependencies(libaryName, version)
  if (unprocessedDependencies.length == 0) {
    return []
  }

  var processedDependancies = await Promise.all(unprocessedDependencies.map(async (item) => {
    dependencies = await getLibaryDependencyBranches(item.name, item.version);
    if (dependencies == null) {
      dependencies = []
    }
    return { 'name': item.name, 'version': item.version, 'dependencies': dependencies };
  }));
  return processedDependancies;
}

async function getLibaryDependencyTree(libaryName, version) {
  try {
    lookup = await getLibaryDependencyBranches(libaryName, version);
    {
      tree = { name: libaryName, version: version, dependencies: lookup }
    }
    return tree
  } catch (error) {
    console.error(error);
  }

}

module.exports = {
  getLibraryDependencies,
  getLibaryDependencyTree,
  getLibaryDependencyBranches
}  