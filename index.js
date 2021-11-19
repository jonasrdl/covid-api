const express = require('express')
const puppeteer = require('puppeteer')
const PORT = 55690

const app = express()

let getIncidence = async function(xpath) {
    try {
        const URL = 'https://corona.karlsruhe.de/'
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        let spanElement;

        await page.goto(URL)

        spanElement = await page.$x(xpath)
        spanElement = spanElement.pop()
        spanElement = await spanElement.getProperty('innerText')
        
        return spanElement = await spanElement.jsonValue().then(spanElement => {
            return spanElement
        })
    } catch (error) {
        console.log(error)
    }
}

app.get('/', (_, res) => {
    res.send({
        msg: 'Hello World'
    })
})

let landkreis = getIncidence('/html/body/article/div[3]/div/div[3]/p[2]/strong').then(function(result) {
    app.get('/incidence/landkreis', (_, res) => {
        res.send({
            incidence: result
        })
    })
})

let stadtkreis = getIncidence('/html/body/article/div[3]/div/div[2]/p[2]/strong').then(function(result) {
    app.get('/incidence/stadtkreis', (_, res) => {
        res.send({
            incidence: result
        })
    })
})

app.listen(PORT, () => {
    console.log(`-> Server started on port ${PORT}`)
})