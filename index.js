const axios = require('axios')

function processDependenciesFromNpm (dependencies) {
  const dependencyList = []
  if (dependencies == null) {
    return dependencyList
  }
  return Object.keys(dependencies).map(name => ({
    name: name,
    version: dependencies[name]
      .replace('~', '') // strip to get an actual version number
      .replace('>', '')
      .replace('=', '')
  }));
}

async function getLibraryDependenciesFromNpm (libraryName, version) {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${libraryName}/${version}`);
    return processDependenciesFromNpm(response.data.dependencies)
  } catch (error) {
    console.error(error)
  }
}

async function libraryDependenciesRecursiveLookup (libraryName, version) {
  const unprocessedDependencies = await getLibraryDependenciesFromNpm(libraryName, version)
  const processedDependencies = await Promise.all(unprocessedDependencies.map(async (item) => {
    const dependencies = await libraryDependenciesRecursiveLookup(item.name, item.version);
    return { 'name': item.name, 'version': item.version, 'dependencies': dependencies };
  }))
  return processedDependencies
}

async function getLibraryDependencyTree (libraryName, version) {
  try {
    const lookup = await libraryDependenciesRecursiveLookup(libraryName, version);
    const tree = { name: libraryName, version: version, dependencies: lookup }
    return tree
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getLibraryDependenciesFromNpm,
  getLibraryDependencyTree,
  libraryDependenciesRecursiveLookup
}
