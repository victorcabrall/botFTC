const Discord = require('discord.js')
const CronJob = require('cron').CronJob
const {db} =require("./db")
require("dotenv").config()

const { p, ticket } = require('./pupp')

const client = new Discord.Client()
let prefix = '!'

client.on("ready", async () => {
    console.log("Online")
    const cron = new CronJob("0 7-22/8 6-22 * *", ()=>{
        
    }, null, true, 'America/Sao_Paulo')
    // sendPdf();
    cron.start()
})

client.on('message', msg => {
    switch (msg.content.toLowerCase()) {
        case `${prefix}w`:
            
            msg.reply("Digite seu usuario da ftc ex'!user victor'").then(() => {
                client.once('message', msg => {
                    if (msg.content.length == 5) {
                        msg.reply("Nao pode ser vazio")
                    }
                    else if (msg.content.slice(0, 5).toLowerCase() === `${prefix}user`) {
                        const user = msg.content.slice(5, msg.content.length).trim()
                        setTimeout(() => {
                            msg.reply("Agora digite sua senha do potal da ftc ex'!pass 123456'").then(() => {
                                client.once('message', async msg => {
                                    if (msg.content.length == 5) {
                                        msg.channel.send("Nao pode ser vazio 1")
                                    }
                                    else if (msg.content.slice(0, 5).toLowerCase() == `${prefix}pass`) {
                                        msg.reply("Verificando...")
                                        const pass = msg.content.slice(5, msg.content.length).trim()
                                        const portalFTC = await p(true, user, pass)
                                        if (!portalFTC) {
                                            msg.reply("Dados incoreto")
                                        }
                                        else if (portalFTC.url != false) {
                                            const id = msg.author.id
                                            const userAlreadyExists =  await db.query("SELECT * FROM usersFtc WHERE username = $1",[user])
                                            if(userAlreadyExists.rows.length == 0){
                                                 db.query(`INSERT INTO usersFtc(username, pass, discord_id, nameftc) VALUES ($1, $2, $3, $4)`, [user, pass, id, portalFTC.studentName])
                                                msg.reply(`Verificamos e sua conta está correta aluno(a) ${portalFTC.studentName}`)
                                            }
                                            else{
                                                msg.reply(`Este usuario já existe`)
                                            }
                                           
                                        }
                                    }
                                })
                            })
                        }, 1000)
                    }
                })
            })
    }
})

async function sendPdf() {
    let idDiscord
    db.query(`SELECT * FROM usersFtc`, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            res.rows.map(async (data) => {
                idDiscord = data.discord_id
                await client.users.fetch(idDiscord).then(async msgUser => {
                    const not_exist = await ticket(data.username, data.pass)
                    if (!not_exist) {
                        msgUser.send(`Olá ${data.nameftc}, Como vocé pediu, aqui está seu boleto da sua faculdade`, {
                            files: [
                                `./boletos/boleto${data.username}.pdf`
                            ]
                        })
                    }
                })

            })
        }
    })
}



sendPdf()

client.login(process.env.TOKEN)