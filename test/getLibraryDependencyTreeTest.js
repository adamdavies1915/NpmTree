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
      .get('/std/latest')
      .reply(200, stdResponse),
      nock('https://registry.npmjs.org')
      .get('/source-map/latest')
      .reply(200, sourceMapResponse),
      nock('https://registry.npmjs.org')
      .get('/uglify-js/latest')
      .reply(200, uglifyJsResponse),
      nock('https://registry.npmjs.org')
      .get('/commander/latest')
      .reply(200, commanderResponse);
  });

  it('Get a dependency for a libary', () => {
    tree = getLibaryDependencyTree('require', 'latest')
    expect(typeof tree).to.equal('object');
    first = tree.first(a => true);
    expect(first.model.name).to.equal('require');
    expect(first.model.version).to.equal('latest');
  });
});