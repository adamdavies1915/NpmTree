const axios = require('axios');
const TreeModel = require('tree-model');

module.exports = {
  getLibraryDependencies(libaryName) {
    return axios
      .get(`https://registry.npmjs.org/${libaryName}/latest`)
      .then(res => res.data.dependencies)
      .catch(error => console.log(error));
  },
  getLibaryDependencyTree(libaryName) {
    tree = new TreeModel();
    return tree.parse({name: libaryName});
  }
};  