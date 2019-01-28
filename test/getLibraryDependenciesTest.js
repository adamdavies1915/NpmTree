const expect = require('chai').expect;
const nock = require('nock');

const getLibraryDependencies = require('../index').getLibraryDependencies;
const expressResponse = require('./expressResponse');

describe('Get User tests', () => {
  beforeEach(() => {
    nock('https://registry.npmjs.org')
      .get('/express/latest')
      .reply(200, expressResponse);
  });

  it('Get a list of dependencies for a libary', () => {
    return getLibraryDependencies('express', 'latest')
      .then(response => {
        //expect an object back
        expect(typeof response).to.equal('object');
    
        expect(response.accepts).to.equal('~1.3.5');
      });
  });
});