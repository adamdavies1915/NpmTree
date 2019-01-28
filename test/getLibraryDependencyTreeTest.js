const expect = require('chai').expect;
const nock = require('nock');

const getLibaryDependencyTree = require('../index').getLibaryDependencyTree;
const requireResponse = require('./requireResponse');
const stdResponse = require('./stdResponse');
const sourceMapResponse = require('./source-mapResponse');
const uglifyJsResponse = require('./uglify-jsResponse');
const commanderResponse = require('./commanderResponse');


describe('Get dependency tree tests', () => {
  beforeEach(() => {
    nock('https://registry.npmjs.org')
      .get('/require/latest')
      .reply(200, requireResponse),
      nock('https://registry.npmjs.org')
        .get('/std/0.1.40')
        .reply(200, stdResponse),
      nock('https://registry.npmjs.org')
        .get('/source-map/0.1.7')
        .reply(200, sourceMapResponse),
      nock('https://registry.npmjs.org')
        .get('/uglify-js/2.3.0')
        .reply(200, uglifyJsResponse);
  });

  it('Get a dependency for a libary', () => {
    tree = getLibaryDependencyTree('require', 'latest')
    expect(tree.name).to.equal("require")
    expect(tree.version).to.equal("2.4.20")
    expect(tree).to.deep.equal(
      {
        'name': 'require', 'version': "2.4.20", dependencies:
          [{
            name: "uglify-js", version: "2.3.0", dependencies:
              [{ name: "async", version: "0.2.6", dependencies: [] }
                , {
                name: "source-map", version: "0.1.7", dependencies: [
                  { name: 'amdefine', version: '1.0.1', dependencies: [] }]
              }
                , {
                name: "optimist", version: "0.3.5", dependencies: [
                  { name: 'wordwrap', version: '0.0.3', dependencies: [] }]
              }]
          },
          { name: "std", version: "0.1.40", dependencies: [] }
          ]
      })
  });
});