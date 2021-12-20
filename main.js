const { Telegraf } = require("telegraf");
const bot = new Telegraf("5039510031:AAGTM6Y4nUhfv0QuSvUCJBvogKTH3LWPE94");

var ws = require("ws");
const _ = require("lodash");
var LiveApi = require("binary-live-api").LiveApi;
var api = new LiveApi({ websocket: ws, appId: 29672 });
let balance;
async function main() {
  await api.authorize("rp92CXvQrz2Biuh");
  // await api.authorize("uTk9Uv8c7czH6jz");
  api.subscribeToBalance();
  api.events.on("balance", (res) => {
    let tbalance = res.balance;
    balance = tbalance.balance;
    console.log(tbalance);
  });
}

// bot.start((ctx) => {
//   ctx.reply("Welcome");
//   console.log(ctx);
// });

// bot.help((ctx) => {
//   ctx.reply("Help!");
// });

// bot.settings((ctx) => {
//   ctx.reply("Settings!");
// });

//todo: ============== VPS states by commands
// function mydate(){
//     let fecha = Date.now();
//   var sec_num = parseInt(fecha, 10)
//   var hours   = Math.floor(sec_num / 3600)
//   var minutes = Math.floor(sec_num / 60) % 60
//   var seconds = sec_num % 60

//   return [hours,minutes,seconds].map(v => v < 10 ? "0" + v : v).filter((v,i) => v !== "00" || i > 0).join(":");
// }
function lahora() {
  let hoy = new Date();
  //let hora = hoy.getHours()+":"+hoy.getMinutes()+":" +hoy.getSeconds();
  let hora = hoy.toLocaleTimeString();
  return hora;
}

let vpstates = [0, 1, 2]; //libre, en uso, en mantenimiento
let vpState = vpstates[0];
let infoState = ".";

let userUsing = null;
let Usermanage = null;
let balanceInit = null;
let balanceEnd = null;

let usertradeInit = false;
let traderList = [0,0,0,0,0,0,0];

bot.command("usevps", (ctx) => {
  //ctx.reply("recibido! 👏👏");
  //! aqui guardas el usuario, la hora, el saldo de la cuenta....

  // userUsing = ctx.from.username;
  if (vpState == vpstates[0]) {
    //dice que el vps esta libre :============ activando el use
    vpState = vpstates[1];
    userUsing = ctx.from.username;
    balanceInit = balance;
    ctx.reply("Recibido! 👏👏");
    usertradeInit = true;
    traderList[0] = ` @${userUsing} = Operando!`;
  } else if (vpState == vpstates[1]) {
    ctx.reply(`El VPS esta en uso por: @${userUsing} 👏👏`);
  } else if (vpState == vpstates[2]) {
    ctx.reply(`El VPS esta en mantenimiento por: @${Usermanage} 👏👏`);
  }
});

bot.command("managevps", (ctx) => {
  if (vpState == vpstates[0]) {
    ctx.reply(`mantenimiento Activado :)`);
    Usermanage = ctx.from.username;
    vpState = vpstates[2];
  } else if (vpState == vpstates[1]) {
    ctx.reply(`@${userUsing} esta usando el VPS`);
  } else if (vpState == vpstates[2]) {
    ctx.reply(`@${ctx.from.username} el VPS ya esta en mantenimiento 👍`);
  }
});
bot.command("freevps", (ctx) => {
  balanceEnd = balance;
  // aqui comparamos si el usuario que activo use es el mismo, si no mostrar que no lo activaste tu :)
  if (ctx.from.username != userUsing) {
    infoState = `@${userUsing} esta usando el vps  😁`;

    //crear otro if para que pueda ser liberado si esta en mantenimiemto
    //por los admins
  }

  if (vpState == vpstates[1]) {
    if (ctx.from.username == userUsing) {
      //guardar informacion del balance, tiempo, usuario que operó = true
      vpState = vpstates[0];
      infoState = `Vps Liberado!!
  profit/loss: ${eval(balanceEnd - balanceInit)}$
  balance actual: ${balance}$
  Sesion Finalizada por: @${userUsing} 
  `;
      if ((usertradeInit = true)) {
        traderList[0] = ` @${userUsing} = Completado 👍 -- Profit: ${eval(balanceEnd - balanceInit)}$`;
      }
    } else {
      infoState = `@${ctx.from.username}, solo el que esta usando el vps puede liberarlo 👍`;
    }
  } else if (vpState == vpstates[0]) {
    infoState = `el VPS ya esta libre`;
  } else if (vpState == vpstates[2]) {
    if (ctx.from.username == Usermanage) {
      vpState = vpstates[0];
      infoState = `Mantenimiento finalizado,VPS Listo! 👍`;
    } else {
      infoState = `@${ctx.from.username} solo el que esta realizando el mantenimiento, puede liberarlo 👍`;
    }
  }
  ctx.reply(infoState);
});

// DATA para el informe de estado:
function estado() {
  let text;
  if (vpState == vpstates[0]) {
    text = "Libre";
  } else if (vpState == vpstates[1]) {
    text = "En Uso";
  }
  if (vpState == vpstates[2]) {
    text = "En Mantenimiento";
  }
  return text;
}
function useormanage() {
  let userm;
  if (vpState == vpstates[0]) {
    userm = "Ninguno";
  } else if (vpState == vpstates[1]) {
    userm = `@${userUsing}`;
  }
  if (vpState == vpstates[2]) {
    userm = `@${Usermanage}`;
  }
  return userm;
}

bot.command("estado", (ctx) => {
  infoState = `
   Estado vps: ${estado()} 
 Usuario: ${useormanage()} 
 Hora: ${lahora()}
 balance actual: ${balance}$`;
  ctx.reply(vpState);
  ctx.reply(infoState);
});

bot.command("saldo", (ctx) => {
  ctx.reply(`Saldo actual: ${balance}$`);
});

bot.command("traders", (ctx) => { 
  ctx.reply(`
  @Carlos0576----------=
  @casadsrobos---------=
  @maguiver102---------=
  @Ccarballo687--------=
  @JSantamaria1970-----=
  @Fallaox-------------=
  ${traderList[0]}
  
  `);
 


});
// const inlineButtons = () => {
//   const inlineLinks = [
//     {
//       title: 'Google',
//       link: 'https://www.google.com/',
//     },
//     {
//       title: 'DuckDuckGo.com',
//       link: 'https://www.duckduckgo.com/',
//     },
//   ];

//   const buttonLinks = inlineLinks.map(({ title, link }) =>
//     Markup.markdown().urlButton(title, link),
//   );

//   return Extra.markup(m => m.inlineKeyboard(buttonLinks, { columns: 1 }));
// };

bot.command("a",(ctx) =>{
//ctx.reply(, )
//ctx.replyWithHTML("<h1>title</h1>");
 
// ctx.replyWithHTML(
//   "<b>show_inline</b>",
//   Extra.HTML().markup(m =>
//       m.inlineKeyboard([
//           m.callbackButton("Single", "single"),
//           m.callbackButton("Range", "range")
//       ])
//   )
// );


 
  

 });

//todo: ==================================
//bot.hears('computer',(ctx) =>ctx.reply("hola compu"));

bot.hears("hola", (ctx) => ctx.reply("Hola!! 👏 "));

// bot.on('text',(ctx)=>{
//     ctx.reply("alguien esta escribiendo");
// });

//bot.on("sticker", (ctx) => ctx.reply("👍"));
main().then(console.log).catch(console.error);
bot.launch();
