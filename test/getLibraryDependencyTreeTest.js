const expect = require('chai').expect
const nock = require('nock')

const getLibraryDependencyTree = require('../index').getLibraryDependencyTree
const libraryDependenciesRecursiveLookup = require('../index').libraryDependenciesRecursiveLookup
const requireResponse = require('./mockedResponses/requireResponse')
const stdResponse = require('./mockedResponses/stdResponse')
const sourceMapResponse = require('./mockedResponses/source-mapResponse')
const uglifyJsResponse = require('./mockedResponses/uglify-jsResponse')
const amdefineResponse = require('./mockedResponses/amdefineResponse')
const optimistResponse = require('./mockedResponses/optimistResponse')
const asyncResponse = require('./mockedResponses/asyncResponse')
const wordwarpResponse = require('./mockedResponses/wordwrapResponse')
const proxyaddrResponse = require('./mockedResponses/proxy-addrResponse')
const forwardedResponse = require('./mockedResponses/forwardedResponse')
const ipaddrjsResponse = require('./mockedResponses/ipaddrjsResponse')

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
      .reply(200, ipaddrjsResponse)
  })

  it('dependency recursive lookup when no dependencies', async () => {
    response = await libraryDependenciesRecursiveLookup('amdefine', '0.0.4')
    expect(response).to.deep.equal([])
  }),
  it('dependency recursive lookup when one dependency', async () => {
    response = await libraryDependenciesRecursiveLookup('optimist', '0.3.5')
    expect(response).to.deep.equal([{ name: 'wordwrap', version: '0.0.2', dependencies: [] }])
  }),
  it('dependency recursive lookup when two dependencies', async () => {
    response = await libraryDependenciesRecursiveLookup('proxy-addr', '2.0.4')
    expect(response).to.deep.equal([
      { name: 'forwarded', version: '0.1.2', dependencies: [] },
      { name: 'ipaddr.js', version: '1.8.0', dependencies: [] }
    ]
    )
  })

  it('Get a dependency for a libary', async () => {
    const tree = await getLibraryDependencyTree('require', 'latest')
    expect(tree.name).to.equal('require')
    expect(tree).to.deep.equal(
      {
        'name': 'require',
        'version': 'latest',
        dependencies:
          [
            {
              name: 'uglify-js',
              version: '2.3.0',
              dependencies:
                [
                  { name: 'async', version: '0.2.6', dependencies: [] },
                  {
                    name: 'source-map',
                    version: '0.1.7',
                    dependencies:
                      [
                        { name: 'amdefine', version: '0.0.4', dependencies: [] }
                      ]
                  },
                  {
                    name: 'optimist',
                    version: '0.3.5',
                    dependencies:
                      [
                        { name: 'wordwrap', version: '0.0.2', dependencies: [] }
                      ]
                  }
                ]
            },
            { name: 'std', version: '0.1.40', dependencies: [] }
          ]
      })
  })
})
