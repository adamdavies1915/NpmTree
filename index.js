const axios = require('axios');
const TreeModel = require('TreeModel');

module.exports = {
  getLibraryDependencies(libaryName) {
    return axios
      .get(`https://registry.npmjs.org/${libaryName}/latest`)
      .then(res => res.data.dependencies)
      .catch(error => console.log(error));
  }
};