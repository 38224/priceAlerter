//const axios = require('axios') 
//var sqlite3 = require('sqlite3').verbose()
//var db = new sqlite3.Database('db/database')
const cheerio = require('cheerio')
const fetch = require("node-fetch")


async function main() {

  let prod = "gtx"

  let res = [],itemList = [],itemName = [],priceList = [], amount = 5, days= 30

  for( var i = 1 ; i <=amount ;i++){
    res[i] = await req('https://www.kuantokusta.pt/search?q='+prod+'&pag=' + i) // pags + pags * 34 = 2 + 2*34 = 70
    const $ = cheerio.load(res[i].toString());
    $(".product-pid").each(function () {
      itemList.push($(this).attr('data-pid'))
     })
     $(".product-item-name").each(function () {
      itemName.push($(this).attr('title'))
     })
     
  }

  listvalues = [] 
  for( var i = 0 ; i <itemList.length ;i++){
    priceList[i] = await reqJSON('https://www.kuantokusta.pt/product/ajax/'+itemList[i]+'?ndays=' + days)
    for (const property in priceList[i].series[1].data) {
      listvalues.push({y : priceList[i].series[1].data[property].y,
        m : priceList[i].series[1].data[property].m,
        d : priceList[i].series[1].data[property].d,
        value : priceList[i].series[1].data[property].value})
    }
  }

  for( var i = 0 ; i <itemName.length ;i++){
    let prodDays = days*(i+1)
    let toEvaluateDay = listvalues[prodDays-2].value

    for(var j = 0; j < 5 ; j++){
      if(listvalues[prodDays-2-j].value == null || listvalues[prodDays-2-j].value == listvalues[prodDays-1].value){
      //console.log(listvalues[prodDays-2-j].value + "|" + listvalues[prodDays-1].value )
      }else{
        toEvaluateDay = listvalues[prodDays-2-j].value
        break;
      }
    }
    if(toEvaluateDay != null && listvalues[prodDays-1].value != null && toEvaluateDay > listvalues[prodDays-1].value){
      let disc = 100-(listvalues[prodDays-1].value*100)/toEvaluateDay
      switch(Math.floor(disc/5)) {
        case 0:
          console.log("0-"+ itemName[i] + ", value was: " + toEvaluateDay + " and now is:" + listvalues[prodDays-1].value + " ( < 5% desc)")
          break;
        case 1:
          console.log("1-"+ itemName[i] + ", value was: " + toEvaluateDay + " and now is:" + listvalues[prodDays-1].value+ " ( < 10% desc)")
          break;
        case 2:
            console.log("2-"+ itemName[i] + ", value was: " + toEvaluateDay + " and now is:" + listvalues[prodDays-1].value+ " ( < 15% desc)")
          break;
        case 3:
            console.log("3-"+ itemName[i] + ", value was: " + toEvaluateDay + " and now is:" + listvalues[prodDays-1].value+ " ( < 20% desc)")
          break; 
        case 4:
            console.log("4-"+ itemName[i] + ", value was: " + toEvaluateDay + " and now is:" + listvalues[prodDays-1].value+ " ( < 25% desc)")
          break; 
        default:
          console.log("!!!!!!!!!ALERT!!!!!!!!!!!!   - "+itemName[i] + ", value was: " + toEvaluateDay + " and now is:" + listvalues[prodDays-1].value)
          break;
      } 
    }
  }
}

const delay = ms => new Promise(r => setTimeout(r, ms));

async function req(req) {
  await delay(Math.floor(Math.random() * 3)+20);
  const response = await fetch(req, { 
    credentials: 'omit'
  }).then((response)=>{
    
    console.log("GET " + req + "---"+response.status)
    return response.text();
  }).catch(err=>{
    console.log(err);
  })
  return response
}
async function reqJSON(req) {
  await delay(Math.floor(Math.random() * 3)+20);
  const response = await fetch(req, { 
    credentials: 'omit'
  }).then((response)=>{
    console.log("GET " + req + "---"+response.status)
    return response.json();
  }).catch(err=>{
    console.log(err);
  })
  return response
}

main().catch(console.error)
/*
let pID = 'p-1-762470' 
let data2 'https://www.kuantokusta.pt/product/ajax/p-1-762470?ndays=90')
*/
  /*
  db.serialize(function() { 
    db.run("DROP TABLE DataInfo");
    db.run("CREATE TABLE DataInfo (name TEXT, year TEXT, month TEXT, day TEXT, value INT)")
    var stmt = db.prepare("INSERT INTO DataInfo VALUES (?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?),(?,?,?,?,?)")
    for( var i = 0 ; i <itemName.length ;i++){
      for( var j = 0+ (30*i) ; j <days * (i+1) ;j+=5){
        console.log("Running...index:" + j + "product:" + itemName[i] + "..." + i + "|" + j + "|"+listvalues.length)
        stmt.run(
          itemName[i],listvalues[j].y,listvalues[j].m,listvalues[j].d,listvalues[j].value,
          itemName[i],listvalues[j+1].y,listvalues[j+1].m,listvalues[j+1].d,listvalues[j+1].value,
          itemName[i],listvalues[j+2].y,listvalues[j+2].m,listvalues[j+2].d,listvalues[j+2].value,
          itemName[i],listvalues[j+3].y,listvalues[j+3].m,listvalues[j+3].d,listvalues[j+3].value,
          itemName[i],listvalues[j+4].y,listvalues[j+4].m,listvalues[j+4].d,listvalues[j+4].value,
          );
      }
    }
    stmt.finalize();
  });
  db.close();
  */
  