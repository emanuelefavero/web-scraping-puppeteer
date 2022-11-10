const fs = require('fs')
const puppeteer = require('puppeteer')

// TIP: Be patient when running this function, it could take a while

async function takeWebpageScreenshot() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Webpage to scrape content from
  await page.goto('https://www.traversymedia.com')

  // Get all the html content
  // const html = await page.content()

  // Access the DOM (and get the title of the page)
  const title = await page.evaluate(() => document.title)

  // Get only the text in the body of the html
  const text = await page.evaluate(() => document.body.innerText)

  // Get all the links on the page (from the href reference in each a tag) and store them in an array
  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a'), (e) => e.href)
  )

  // Get specific elements related to the specific website you are scraping
  // TIP: You need to open the webpage in the browser,  inspect the dev tools and see the structure of the html to spot the elements you want to get
  const coursesArrayFrom = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#courses .card'), (e) => ({
      title: e.querySelector('.card-body h3').innerText,
      level: e.querySelector('.card-body .level').innerText,
      url: e.querySelector('.card-footer a').href,
      promo: e.querySelector('.card-footer .promo-code .promo').innerText,
    }))
  )

  // Do the same thing but without the Array.from() method
  // NOTE: This way allows to also omit the querySelectorAll() method (Since we are looping with map())
  const courses = await page.$$eval('#courses .card', (elements) =>
    elements.map((e) =>
      // NOTE: Since we are returning an object, we need to wrap it in parenthesis (if not it will be considered a normal function block of code)
      ({
        title: e.querySelector('.card-body h3').innerText,
        level: e.querySelector('.card-body .level').innerText,
        url: e.querySelector('.card-footer a').href,
        promo: e.querySelector('.card-footer .promo-code .promo').innerText,
      })
    )
  )

  console.log(courses)

  // Save data to a json file
  fs.writeFile('courses.json', JSON.stringify(courses), (err) => {
    if (err) throw err
    console.log('Data written to file')
  })

  await browser.close()
}

takeWebpageScreenshot()
