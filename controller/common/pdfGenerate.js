const puppeteer = require('puppeteer');
const ejs = require('ejs');
const moment = require('moment');
const fs = require('fs').promises;

async function generatePDF(html, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set content to the HTML provided
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Generate PDF from the HTML content
  await page.pdf({ 
    path: outputPath, 
    format: 'A4',
    printBackground: true 
  });

  await browser.close();
}

exports.main=async(data)=>{
  return new Promise(async(resolve, reject) => {
    
    try {
      // Read and compile the EJS template
      const templateContent = await fs.readFile('./controller/common/template.ejs', 'utf-8');
      const compiledTemplate = ejs.compile(templateContent);
  
      // Define dynamic data
      // Render the HTML template with dynamic data
      data.product_items=JSON.parse(data.product_items)
      const renderedHtml = compiledTemplate({data});
  
      // Output path for the generated PDF
      const outputPath = `./public/pdf/invoice_${moment(new Date()).format("YYYY-MM-DD_HHMMss")}.pdf`;
      const pathname=`pdf/invoice_${moment(new Date()).format("YYYY-MM-DD_HHMMss")}.pdf`
      console.log(outputPath)
      // Generate PDF using the HTML template with dynamic data
      await generatePDF(renderedHtml, outputPath);
      resolve(pathname)
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  })
}


