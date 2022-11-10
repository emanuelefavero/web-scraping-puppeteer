const puppeteer = require('puppeteer')

async function takeWebpageScreenshot() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Webpage to make screenshot of
  await page.goto('https://www.apple.com')

  await page.screenshot({ path: 'webpage-screenshot.png', fullPage: true })
  // await page.pdf({ path: 'webpage-screenshot.pdf', format: 'A4' })

  await browser.close()
}

takeWebpageScreenshot()
