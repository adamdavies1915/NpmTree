const getLibraryDependencyTree = require('./index').getLibraryDependencyTree

const express = require('express')
const app = express()

app.listen(3000, () => {
  console.log('Server running on port 3000')
})

app.get('/npmlookup/:library/:version', async function (req, res) {
  const jsons = await getLibraryDependencyTree(req.params['library'], req.params['version'])
  res.json(jsons)
})

app.get('/npmlookup/:library/', async function (req, res) {
  const jsons = await getLibraryDependencyTree(req.params['library'], 'latest')
  res.json(jsons)
})
