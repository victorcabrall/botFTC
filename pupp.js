const puppeteer = require('puppeteer')
const download = require('download-pdf')
async function ticket(user, pass) {
    const browser = await puppeteer.launch({
        headless: false,
    })
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0)
    return await page.goto(`https://aluno.uniftc.edu.br/#/login`).then(async () => {
        await page.type('input[type="text"]', user)
        await page.type('input[type="password"]', pass)
        await page.keyboard.press('Enter')
        await page.waitForTimeout(4000)
        await page.evaluate(() => {
            const elementMoney = document.querySelector('.fa-money')
            elementMoney.click()

        })
        await page.click('span[class="ng-tns-c13-14"]')
        await page.keyboard.down('Tab')
        await page.keyboard.press('ArrowDown')
        await page.waitForTimeout(2000)
        await page.click('button[type="submit"]')
        await page.waitForTimeout(2000)
        const exist = await page.evaluate(()=>{
            let el = document.querySelector("i[ptooltip='Visualizar Boleto']")
            if(!el){
                browser.close()
                return ''
            }
            el.click()
        })
        if(exist == ''){
            return exist
        }
        await page.waitForTimeout(5000)
        let pageList = await browser.pages();
        let newPage = pageList[2].url()
        
        download(newPage, {
            filename: `boleto${user}.pdf`,
            directory: "./boletos"
        }, (err) => {
            browser.close()
            if (err) {
                console.log(err)
            }
        })
        
    })
}
async function p(element = false, user, pass) {
    const browser = await puppeteer.launch({
        headless: false,
    })

    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0)
    return await page.goto(`https://aluno.uniftc.edu.br/#/login`).then(async () => {
        await page.type('input[type="text"]', user)
        await page.type('input[type="password"]', pass)
        await page.keyboard.press('Enter')
        await page.waitForTimeout(4000)
        const url = page.url()
        if (url != "https://aluno.uniftc.edu.br/#/login") {
            await page.evaluate(() => {
                const elementMoney = document.querySelector('.fa-money')
                elementMoney.click()
            })
            await page.click('span[class="ng-tns-c13-15"]')
            await page.keyboard.down('Tab')
            await page.keyboard.press('ArrowDown')
            await page.waitForTimeout(2000)
            const studentName = await page.evaluate(() => {
                const studentName = document.querySelectorAll(".ui-inputtext")

                return studentName[2].value
            })
            if (element) {
                browser.close()
                return {
                    url,
                    studentName
                }
            }
            await page.click('button[type="submit"]')
            await page.waitForTimeout(4000)
            await page.evaluate(() => {
                let con = 0
                const form = document.querySelectorAll('.ng-star-inserted >.centralizar')
                for (let cont = 3; cont < form.length - 3; cont = cont + 7) {
                    let valor = form[cont].innerText.split(/[A-Za-z/$]/)
                    valor = valor.join(" ")
                    if (valor > 0) {
                        const form2 = document.querySelectorAll('.pi-credit-card')
                        form2[con].click()
                    }
                    con++
                }
            })
        }
        else {
            browser.close()
        }
    })
}

module.exports = { p, ticket }








