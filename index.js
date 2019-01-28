const axios = require('axios');

module.exports = {
  getLibraryDependencies(libaryName, version) {
    return axios
      .get(`https://registry.npmjs.org/${libaryName}/${version}`)
      .then(res => res.data.dependencies)
      .catch(error => console.log(error));
  },
  getLibaryDependencyTree(libaryName, version) {
    return {}
  }
}  