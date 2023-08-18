const mediaRouter = require('./media')

function routes(app) {
   app.use('/medias', mediaRouter)
   // app.use('/messages')
   // app.use('/settings')

   app.use('/', (req, res) => {
      res.send('This is home page')
   })
}

module.exports = routes
