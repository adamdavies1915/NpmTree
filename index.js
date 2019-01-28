const axios = require('axios');
const TreeModel = require('tree-model');

module.exports = {
  getLibraryDependencies(libaryName, version) {
    return axios
      .get(`https://registry.npmjs.org/${libaryName}/${version}`)
      .then(res => res.data.dependencies)
      .catch(error => console.log(error));
  },
  getLibaryDependencyTree(libaryName, version) {
    tree = new TreeModel();
    return tree.parse({'name': libaryName, 'version': version});
  }
};  