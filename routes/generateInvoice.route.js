const express = require('express')
const path = require('path')
const fs = require('fs')
const handlebars = require('handlebars')
const puppeteer = require('puppeteer')
const { v4: uuidV4 } = require('uuid')
const router = express.Router()

// Function to render Handlebars template
function renderHandlebarsTemplate(data) {
  // Load the Handlebars template file and render it with data
  // Replace 'your-template-file.hbs' with the actual file path
  const template = fs.readFileSync('./routes/pdf_template.hbs', 'utf-8')

  const compiledTemplate = handlebars.compile(template)
  return compiledTemplate(data)
}

router.post('/generate-invoice', async (req, res) => {
  const { products } = req.body

  // Calculate product-wise totals
  const pro = products.map(
    (item) => ({
      productName: `Product ${item.name}`,
      quantity: item.quantity,
      rate: item.price,
      total: `INR ${item.quantity * item.price}`,
    })
  )

  // Calculate total amount
  const totalAmount = pro.reduce(
    (total, product) =>
      total + Number(product.rate || 0) * Number(product.quantity || 0),
    0
  )

  // Calculate grand total with tax (assuming 18% tax)
  const taxPercentage = 18
  const grandTotal = `INR ${totalAmount + totalAmount * 0.18}`

  // Current date
  const currentDate = new Date()
  const validityDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1
    }/${currentDate.getFullYear()}`

  // Terms and Conditions
  const termsAndConditions = 'Your terms and conditions here...'

  // Resulting data
  const templateData = {
    products: pro,
    totalAmount: 'INR ' + totalAmount,
    tax: `${taxPercentage}%`,
    grandTotal,
    validityDate,
    termsAndConditions,
    id: uuidV4(),
  }

  try {
    const browser = await puppeteer.launch({ headless: 'new', args: [ '--no-sandbox' ] })
    const page = await browser.newPage()

    // Render the Handlebars template with the provided data
    await page.setContent(renderHandlebarsTemplate(templateData))

    // Generate PDF
    const pdfBuffer = await page.pdf()

    const name = templateData.id + '_invoice.pdf'
    const dir = __dirname.split('\\')
    dir.pop()
    const pdfFilePath = path.join(dir.join('\\'), 'pdfs', name)

    fs.writeFileSync(pdfFilePath, pdfBuffer)

    res.status(200).json({ success: true, fileName: name })

    // Close the browser
    await browser.close()
  } catch (error) {
    console.error('Error generating PDF:', error)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router
