const express = require('express')
const router = express.Router()
const MediaController = require('../app/controllers/MediaController')

router.get('/', MediaController.getMedia)
router.post('/upload', MediaController.uploadMedia)
router.patch('/edit/:id', MediaController.editMedia)
router.delete('/delete/:id', MediaController.deleteMedia)

module.exports = router
