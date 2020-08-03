const { response } = require('express')
const express = require('express')
const shortid = require('shortid')

const server = express()

let hubs = []

// Create
// Read
// Update
// Delete

server.use(express.json()) // every server request will be parsed as a JSON object

// GET
server.get('/', (req, res) => {
  res.json({ hello: 'world' })
})

// Create
server.post('/api/hubs', (req, res) => {
  const hubInfo = req.body
  hubInfo.id = shortid.generate()
  hubs.push(hubInfo)
  response.status(201).json(hubInfo)
})

// Read
server.get('/api/hubs', (req, res) => {
  res.json(hubs)
})

// Update - change object
server.patch('/api/hubs/:id', (req, res) => {
  const { id } = req.params
  const changes = req.body
  let found = hubs.find((hub) => hub.id === id)
  if (found) {
    Object.assign(found, changes)
    res.status(200).json(found)
  } else {
    res.status(404).json({ message: 'hub id not found' })
  }
})

// Update - replace object
server.put('/api/hubs/:id', (req, res) => {
  const { id } = req.params
  const changes = req.body
  changes.id = id // since entire object is being replaced, have to re-add the id to keep the same id

  try {
    let index = hubs.findIndex((hub) => hub.id === id)
    if (index !== -1) {
      hubs[index] = changes
      res.status(200).json(hubs[index])
    } else {
      res.status(404).json({ message: 'hub id not found' })
    }
  } catch (err) {
    res.status(500).json({ message: 'error: ', err })
  }
})

// Delete
server.delete('/api/hubs/:id', (req, res) => {
  const { id } = req.params
  const deleted = hubs.find((hub) => hub.id === id)
  if (deleted) {
    hubs = hubs.filter((hub) => hub.id !== id)
    res.status(200).json(deleted)
  } else {
    res.status(404).json({ message: 'hub not found' })
  }
})

const PORT = 5000
server.listen(PORT, () => {
  console.log('listening on localhost: ', PORT)
})
