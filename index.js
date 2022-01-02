const express = require('express')
const puppeteer = require('puppeteer')
const PORT = 55690

const app = express()

let getIncidence = async function () {
  try {
    const URL = 'https://corona.karlsruhe.de/'
    const browser = await puppetteer.launch({
      headless: true,
      args: ['--no-sandbox']
    })
    const page = await browser.newPage()
    let stadtkreis
    let landkreis

    await page.goto(URL)

    await page.setCacheEnabled(false)
    await page.reload({ waitUntil: 'networkidle2' })

    stadtkreis = await page.$x('/html/body/article/div[3]/div/div[2]/p[2]/strong')
    stadtkreis = stadtkreis.pop()
    stadtkreis = await stadtkreis.getProperty('innerText')

    landkreis = await page.$x('/html/body/article/div[3]/div/div[3]/p[2]/strong')
    landkreis = landkreis.pop()
    landkreis = await landkreis.getProperty('innerText')

    let result = {
      stadtkreis: stadtkreis,
      landkreis: landkreis
    }

    return result
  } catch (error) {
    console.log(error)
  }
}

app.get('/', (_, res) => {
  res.send({
    msg: 'Hello World'
  })
})

let incidence = getIncidence().then((result) => {
  const landkreisIncidence = Math.round(parseFloat(result.landkreis._remoteObject.value))

  const stadtkreisIncidence = Math.round(parseFloat(result.stadtkreis._remoteObject.value))

  app.get('/incidence', (req, res) => {
    res.send({
      stadtkreis: stadtkreisIncidence,
      landkreis: landkreisIncidence
    })
  })
})

app.listen(PORT, () => {
  console.log(`-> Server started on port ${PORT}`)
})
