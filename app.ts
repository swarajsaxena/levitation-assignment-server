import path from 'path'
import { mongoose } from './utils/mongooseConfig'

const express = require('express')
const exphbs = require('express-handlebars')
const cors = require('cors')
export const app = express()
const port = process.env.PORT || 3001

app.engine('hbs', exphbs.engine())
app.use(cors())
app.use(express.json())
app.get('/', (req: any, res: any) => res.json({ message: 'ok' }))

const auth = require('./routes/auth.route')
const generateInvoice = require('./routes/generateInvoice.route')

app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')))
app.use('/api', auth)
app.use('/api', generateInvoice)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
  console.log('Connecting DB ...')
  mongoose
    .connect(
      'mongodb+srv://swarajsaxena:swarajsaxena240900@cluster0.ofvzbvq.mongodb.net/?retryWrites=true&w=majority'
    )
    .then(() => console.log('DB Connected !!'))
})
