const MediaModel = require('../models/MediaModel')
const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      // Check the file type and set the destination directory accordingly
      if (file.mimetype.startsWith('image/')) {
         cb(null, 'public/images/')
      } else if (file.mimetype.startsWith('video/')) {
         cb(null, 'public/videos/')
      } else {
         cb(new Error('Invalid file type.'))
      }
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
   },
})

const upload = multer({ storage })

class MediaController {
   // [GET: /medias
   getMedia = async function (req, res) {
      console.log('getMedia')

      try {
         const data = await MediaModel.find()

         res.status(200).json(data)
      } catch (err) {
         res.status(500).json({ message: err.message })
      }
   }

   // [POST]: /medias/upload
   uploadMedia = async function (req, res) {
      console.log('uploadMedia')

      upload.array('files')(req, res, async err => {
         try {
            if (err) {
               throw new Error(err.message)
            }

            const uploadedFiles = req.files.map((file, index) => {
               // console.log('file: ', file)
               // console.log('title', req.body.title)
               // console.log('desc', req.body.desc)
               return {
                  title: req.files.length > 1 ? req.body.title[index] : req.body.title,
                  desc: req.files.length > 1 ? req.body.desc[index] : req.body.desc,
                  type: file.mimetype.startsWith('image/')
                     ? 'image'
                     : file.mimetype.startsWith('video/')
                     ? 'video'
                     : 'undefined',
                  size: file.size,
                  path: file.path.replace('public\\', '').replace(/\\/g, '/'),
               }
            })

            const savedFiles = await MediaModel.create(uploadedFiles)
            console.log(savedFiles)

            res.status(200).json({
               message: 'Files uploaded and saved to the database successfully.',
               files: savedFiles,
            })
         } catch (err) {
            res.status(400).json({ message: err.message })
         }
      })
   }

   // [PATCH]: /medias/edit/:id
   editMedia = async function (req, res) {
      console.log('editMedia')
      const { id } = req.params
      console.log(req.body)

      try {
         const mediaEdited = await MediaModel.findByIdAndUpdate(id, { $set: req.body }, { new: true })

         res.status(200).json(mediaEdited)
      } catch (err) {
         res.status(500).json({ message: err.message })
      }
   }

   // [DELETE]: /medias/delete/:id
   deleteMedia = async function (req, res) {
      console.log('deleteMedia')
      const { id } = req.params

      try {
         const deleteMedia = await MediaModel.findByIdAndDelete(id)
         if (!deleteMedia) {
            return res.status(404).json({ message: 'Media not found' })
         }

         console.log('deleteMedia: ', deleteMedia)
         fs.unlinkSync(`./public/${deleteMedia.path}`)

         res.status(200).json(deleteMedia)
      } catch (err) {
         res.status(500).json({ message: err.message })
      }
   }
}

module.exports = new MediaController()
