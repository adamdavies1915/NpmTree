const expect = require('chai').expect;
const nock = require('nock');

const getLibraryDependenciesFromNpm = require('../index').getLibraryDependenciesFromNpm;
const sourceMapResponse = require('./source-mapResponse');

describe('Get User tests', () => {
  beforeEach(() => {
    nock('https://registry.npmjs.org')
      .get('/source-map/latest')
      .reply(200, sourceMapResponse);
  });

  it('Get a list of dependencies for a library', () => {
    return getLibraryDependenciesFromNpm('source-map', 'latest')
      .then(response => {
        expect(response).to.deep.equal([{ name: "amdefine", version: "0.0.4" }]);
      });
  })
});