const expect = require('chai').expect;
const nock = require('nock');

const getLibaryDependencyTree = require('../index').getLibaryDependencyTree;
const getLibaryDependencyBranches = require('../index').getLibaryDependencyBranches;
const requireResponse = require('./requireResponse');
const stdResponse = require('./stdResponse');
const sourceMapResponse = require('./source-mapResponse');
const uglifyJsResponse = require('./uglify-jsResponse');
const amdefineResponse = require('./amdefineResponse');
const optimistResponse = require('./optimistResponse');
const asyncResponse = require('./asyncResponse');
const wordwarpResponse = require('./wordwrapResponse');
const proxyaddrResponse = require('./proxy-addrResponse');
const forwardedResponse = require('./forwardedResponse');
const ipaddrjsResponse = require('./ipaddrjsResponse');


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
        .reply(200, uglifyJsResponse),
      nock('https://registry.npmjs.org')
        .get('/amdefine/0.0.4')
        .reply(200, amdefineResponse),
      nock('https://registry.npmjs.org')
        .get('/optimist/0.3.5')
        .reply(200, optimistResponse),
      nock('https://registry.npmjs.org')
        .get('/wordwrap/0.0.2')
        .reply(200, wordwarpResponse),
      nock('https://registry.npmjs.org')
        .get('/async/0.2.6')
        .reply(200, asyncResponse),
      nock('https://registry.npmjs.org')
        .get('/proxy-addr/2.0.4')
        .reply(200, proxyaddrResponse),
      nock('https://registry.npmjs.org')
        .get('/forwarded/0.1.2')
        .reply(200, forwardedResponse),
      nock('https://registry.npmjs.org')
        .get('/ipaddr.js/1.8.0')
        .reply(200, ipaddrjsResponse);
  });

  it('Get a list of dependencies for a libary recursive', async () => {
    response = await getLibaryDependencyBranches('amdefine', '0.0.4')
    expect(response).to.deep.equal([]);
  }),
    it('Get a list of dependencies for a libary recursive', async () => {
      response = await getLibaryDependencyBranches('optimist', '0.3.5')
      expect(response).to.deep.equal([{ name: "wordwrap", version: "0.0.2", dependencies: [] }]);
    }),
    it('Get a list of dependencies for a libary recursive', async () => {
      response = await getLibaryDependencyBranches('proxy-addr', '2.0.4')
      expect(response).to.deep.equal([
        { name: "forwarded", version: "0.1.2", dependencies: [] },
        { name: "ipaddr.js", version: "1.8.0", dependencies: [] }
      ]
      );
    });

  it('Get a dependency for a libary', async () => {
    tree = await getLibaryDependencyTree('require', 'latest')
    expect(tree.name).to.equal("require");
    console.log(tree)
    expect(tree).to.deep.equal(
      {
        'name': 'require', 'version': "latest", dependencies:
          [
            {
              name: "uglify-js", version: "2.3.0", dependencies:
                [
                  { name: "async", version: "0.2.6", dependencies: [] },
                  {
                    name: "source-map", version: "0.1.7", dependencies:
                      [
                        { name: 'amdefine', version: '0.0.4', dependencies: [] }
                      ]
                  },
                  {
                    name: "optimist", version: "0.3.5", dependencies:
                      [
                        { name: 'wordwrap', version: '0.0.2', dependencies: [] }
                      ]
                  }
                ]
            },
            { name: "std", version: "0.1.40", dependencies: [] }
          ]
      })
  });
});