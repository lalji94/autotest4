var express = require('express');
var router = express.Router();
var async = require('async');
const { OperationHelper } = require('apac');
var nodeTelegramBotApi = require("node-telegram-bot-api");
let request = require("request");
var config = require('../config/global');
var connection = require('../config/connection');
const BitlyClient = require('bitly').BitlyClient;
// const bitly = new BitlyClient('063ceb9ef467fcc7a41f1f8d7ca3bc3962b15292');
var tall = require('tall').default;
const htmlToText = require('html-to-text');
const axios = require('axios');
var textVersion = require("textversionjs");
const cheerio = require('cheerio')
var _ = require('underscore');
const unshort = require('url-unshorten');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// function postImageWidth(post_link,token) {
// function postImageWidth(post_link,token,amzn_data,storeId,finalAmznData,telegroup) {
function postImageWidth(post_link,token,amzn_data,storeId,finalAmznData,telegroup,teleFlag,wattsflag,finalIdList) {

  axios(post_link)
  // axios('https://www.amazon.in/dp/B07DJD1RTM')
      .then(response => {
          var html = response.data;
          var $ = cheerio.load(html);
          var matchObj = [];
          var siteheading = $('#productTitle').text().trim();
          var siteheadidsdng = $('.imgTagWrapper').find('img').attr('data-old-hires');
          var sitestrckprice = $('.priceBlockStrikePriceString').text().trim();
          console.log('sitestrckprice: ', sitestrckprice);
          var sitestrckpricessds = $('#priceblock_ourprice').text().trim();
          console.log('sitestrckpricessds: ', sitestrckpricessds);
          var savepercent = $('.priceBlockSavingsString').text().replace(/\s\s+/g, '');
          console.log('savepercent: ', savepercent);
          // var savepercent = $('.priceBlockSavingsString').text().replace(/\s\s+/g, '').replace(/\([^()]*\)/g, '');
          var savepercentage = $('.priceBlockSavingsString').text().match(/\(([^)]+)\)/);
          console.log('savepercentage: ', savepercentage);
          var siteTitle = $('.priceBlockDealPriceString').text().replace(/\s\s+/g, '');
          console.log('siteTitle: ', siteTitle);
          var avilabilty = $('#availability').find('span').text().trim();
          console.log('avilabilty: ', avilabilty);
          let sqlss = "INSERT INTO post_telegram (post_id,data) VALUES (" + storeId + ",'demo')";
          connection.query(sqlss, function (err, rides) {
            if (err) {
            console.log('err: ', err);
            }else{
//           if((teleFlag == '1' && wattsflag == '1') || (teleFlag == '1' && wattsflag == '0' ) || (teleFlag == '0' && wattsflag == '1' ) ){
//                 whatsapp_posts1(finalAmznData, finalIdList[0].apiKey,finalIdList[0].phoneId,finalIdList[0].productId);
//                 whatsapp_posts2(finalAmznData, finalIdList[1].apiKey,finalIdList[1].phoneId,finalIdList[1].productId);
		    if((teleFlag == '1' && wattsflag == '1')  || (teleFlag == '0' && wattsflag == '1' ) ){
                whatsapp_posts1(finalAmznData, finalIdList[0].apiKey,finalIdList[0].phoneId,finalIdList[0].productId);
                whatsapp_posts2(finalAmznData, finalIdList[1].apiKey,finalIdList[1].phoneId,finalIdList[1].productId);
              }
              if(teleFlag == '1' ){
          if(siteheadidsdng && siteheading && sitestrckprice && sitestrckpricessds && savepercent ){
              telePost(token,siteheadidsdng,siteheading,sitestrckprice,sitestrckpricessds,savepercent,post_link,avilabilty)
              telePostgujarat(token,siteheadidsdng,siteheading,sitestrckprice,sitestrckpricessds,savepercent,post_link,avilabilty)
              for (let l = 0; l < telegroup.length; l++) {
                teleAutoPostChannel(finalAmznData,telegroup[l].groupname,amzn_data);
            }
            } else if(siteheadidsdng && siteheading && sitestrckpricessds && avilabilty ){
              telePosted(token,siteheadidsdng,siteheading,sitestrckpricessds,post_link,avilabilty)
              telePostedgujarat(token,siteheadidsdng,siteheading,sitestrckpricessds,post_link,avilabilty)
              for (let l = 0; l < telegroup.length; l++) {
                teleAutoPostChannel(finalAmznData,telegroup[l].groupname,amzn_data);
            }
            }else{
            for (let l = 0; l < telegroup.length; l++) {
                teleAutoPostChannel(finalAmznData,telegroup[l].groupname,amzn_data);
            }
            teleAutoPostChannel(finalAmznData,"@bestshoppingdl",token);
            teleAutoPostChannel(finalAmznData,"@bestshoppingdeal00",token);
          }
// 	 }else{
//           console.log('---4');
        }
        }
      })
    })
      .catch(err =>{ 
        let sqlss = "INSERT INTO post_telegram (post_id,data) VALUES (" + storeId + ",'demo')";
        connection.query(sqlss, function (err, rides) {
          if (err) {
          console.log('err: ', err);
          }else{
// 	   if((teleFlag == '1' && wattsflag == '1') || (teleFlag == '1' && wattsflag == '0' ) || (teleFlag == '0' && wattsflag == '1' ) ){
//       whatsapp_posts1(finalAmznData, finalIdList[0].apiKey,finalIdList[0].phoneId,finalIdList[0].productId);
//       whatsapp_posts2(finalAmznData, finalIdList[1].apiKey,finalIdList[1].phoneId,finalIdList[1].productId);
        if((teleFlag == '1' && wattsflag == '1')  || (teleFlag == '0' && wattsflag == '1' ) ){
	whatsapp_posts1(finalAmznData, finalIdList[0].apiKey,finalIdList[0].phoneId,finalIdList[0].productId);
	whatsapp_posts2(finalAmznData, finalIdList[1].apiKey,finalIdList[1].phoneId,finalIdList[1].productId);
      }
      if(teleFlag == '1' ){
        for (let l = 0; l < telegroup.length; l++) {
          teleAutoPostChannel(finalAmznData,telegroup[l].groupname,amzn_data);
        }
        teleAutoPostChannel(finalAmznData,"@bestshoppingdl",token);
        teleAutoPostChannel(finalAmznData,"@bestshoppingdeal00",token);
//       }else{
//         console.log('---4');
      }
      }
    })
      });
    }
    function telePostgujarat (token,post_img,post_title,post_regularPrice,post_sellPrice,savepercent,post_link,avilabilty) {
      var chatId = '@bestshoppingdl'; // <= replace with yours
      // var savings = post_regularPrice - post_sellPrice;
      // var savEPERCENT = Math.round(100 * savings / post_regularPrice);

      var html = '🛍 ' + post_title + '\n\n' +
        '🔗 <a href="' + post_link + '">' + post_link + '</a>\n' +
        '♨️ <b style="background-color:red;">PRICE : </b> ' + post_sellPrice + '\n' +
        '🚫 <b>M.R.P. : </b> ' + post_regularPrice + '\n' +
        '💰 <b>SAVINGS : </b> ' + savepercent + '\n' +
        '🙋 <b>AVAILABILITY : </b> <i> ' + avilabilty + '</i>\n' +
        '🚚 FREE Delivery\n\n' +
        // '👉 More Deals - <a href= @' + req.query.chanel + '> @' + req.query.chanel+'</a>\n'+
        // '👉 More Deals - @' + req.query.chanel;
        '👉 <a href="https://t.me/bestshoppingdl"> Join US for More Deals </a>\n';
      // +'\n'+
      // '🌐 Website - <a href=' + req.query.website.text + '>' + req.query.website + '</a>';
      var buttons = [
        [
          { "text": "➡️ ➡️ 🛒 CLICK HERE TO BUY 🛒 ⬅️ ⬅️", "url": post_link }
        ]
      ];
      console.log('html: ', html);
      if (html) {
        bot = new nodeTelegramBotApi(token);
        bot.sendPhoto(chatId, post_img, {
          caption: html,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          "reply_markup": {
            "inline_keyboard": buttons
          }
        });
      }
    }

    function telePostedgujarat (token,post_img,post_title,post_sellPrice,post_link,avilabilty) {
      var chatId = '@bestshoppingdl'; // <= replace with yours

      // var savings = post_regularPrice - post_sellPrice;
      // var savEPERCENT = Math.round(100 * savings / post_regularPrice);

      var html = '🛍 ' + post_title + '\n\n' +
        '🔗 <a href="' + post_link + '">' + post_link + '</a>\n' +
        '♨️ <b style="background-color:red;">PRICE : </b> ' + post_sellPrice + '\n' +
        '🙋 <b>AVAILABILITY : </b> <i> ' + avilabilty + '</i>\n' +
        '🚚 FREE Delivery\n\n' +
        // '👉 More Deals - <a href= @' + req.query.chanel + '> @' + req.query.chanel+'</a>\n'+
        // '👉 More Deals - @' + req.query.chanel;
        '👉 <a href="https://t.me/bestshoppingdl"> Join US for More Deals </a>\n';
      // +'\n'+
      // '🌐 Website - <a href=' + req.query.website.text + '>' + req.query.website + '</a>';
      var buttons = [
        [
          { "text": "➡️ ➡️ 🛒 CLICK HERE TO BUY 🛒 ⬅️ ⬅️", "url": post_link }
        ]
      ];
      console.log('html: ', html);

      if (html) {
        bot = new nodeTelegramBotApi(token);
        bot.sendPhoto(chatId, post_img, {
          caption: html,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          "reply_markup": {
            "inline_keyboard": buttons
          }
        });
      }
    }
 

    function telePost (token,post_img,post_title,post_regularPrice,post_sellPrice,savepercent,post_link,avilabilty) {
      var chatId = '@bestshoppingdeal00'; // <= replace with yours
      // var savings = post_regularPrice - post_sellPrice;
      // var savEPERCENT = Math.round(100 * savings / post_regularPrice);

      var html = '🛍 ' + post_title + '\n\n' +
        '🔗 <a href="' + post_link + '">' + post_link + '</a>\n' +
        '♨️ <b style="background-color:red;">PRICE : </b> ' + post_sellPrice + '\n' +
        '🚫 <b>M.R.P. : </b> ' + post_regularPrice + '\n' +
        '💰 <b>SAVINGS : </b> ' + savepercent + '\n' +
        '🙋 <b>AVAILABILITY : </b> <i> ' + avilabilty + '</i>\n' +
        '🚚 FREE Delivery\n\n' +
        // '👉 More Deals - <a href= @' + req.query.chanel + '> @' + req.query.chanel+'</a>\n'+
        // '👉 More Deals - @' + req.query.chanel;
        '👉 <a href="https://t.me/bestshoppingdeal00"> Join US for More Deals </a>\n';
      // +'\n'+
      // '🌐 Website - <a href=' + req.query.website.text + '>' + req.query.website + '</a>';
      var buttons = [
        [
          { "text": "➡️ ➡️ 🛒 CLICK HERE TO BUY 🛒 ⬅️ ⬅️", "url": post_link }
        ]
      ];
      console.log('html: ', html);
      if (html) {
        bot = new nodeTelegramBotApi(token);
        bot.sendPhoto(chatId, post_img, {
          caption: html,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          "reply_markup": {
            "inline_keyboard": buttons
          }
        });
      }
    }

    function telePosted (token,post_img,post_title,post_sellPrice,post_link,avilabilty) {
      var chatId = '@bestshoppingdeal00'; // <= replace with yours

      // var savings = post_regularPrice - post_sellPrice;
      // var savEPERCENT = Math.round(100 * savings / post_regularPrice);

      var html = '🛍 ' + post_title + '\n\n' +
        '🔗 <a href="' + post_link + '">' + post_link + '</a>\n' +
        '♨️ <b style="background-color:red;">PRICE : </b> ' + post_sellPrice + '\n' +
        '🙋 <b>AVAILABILITY : </b> <i> ' + avilabilty + '</i>\n' +
        '🚚 FREE Delivery\n\n' +
        // '👉 More Deals - <a href= @' + req.query.chanel + '> @' + req.query.chanel+'</a>\n'+
        // '👉 More Deals - @' + req.query.chanel;
        '👉 <a href="https://t.me/bestshoppingdeal00"> Join US for More Deals </a>\n';
      // +'\n'+
      // '🌐 Website - <a href=' + req.query.website.text + '>' + req.query.website + '</a>';
      var buttons = [
        [
          { "text": "➡️ ➡️ 🛒 CLICK HERE TO BUY 🛒 ⬅️ ⬅️", "url": post_link }
        ]
      ];
      console.log('html: ', html);

      if (html) {
        bot = new nodeTelegramBotApi(token);
        bot.sendPhoto(chatId, post_img, {
          caption: html,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          "reply_markup": {
            "inline_keyboard": buttons
          }
        });
      }
    }
 
// setInterval( function (req, res, next) {
//   async.waterfall([
  setInterval( function setup() {
console.log("vijay");
    }, 15000)
    
    function urlencode(str) {
      return str.replace(/%21/g,'!').replace(/%22/g,'"').replace(/pr%26/g,'pr?').replace(/%26/g,'&')
        .replace(/%27/g,'\'').replace(/%3A/g,':').replace(/%2F/g,'/').replace(/%3D/g,'=')
        .replace(/%28/g,'(').replace(/%3F/g,'?').replace(/%29/g,')').replace(/%2A/g,'*')
        .replace(/%20/g, '+');
    }
    function urldecode(str) {
      return str.replace(/&/g,'%26').replace(/=/g,'%3D').replace(/[?]/g,'%3F').replace(/[+]/g,'%2B').replace(/[[]/g,'%5B').replace(/[]]/g,'%5D');
    }
    function conurlencode(str) {
      return str.replace(/%21/g,'!').replace(/%22/g,'"').replace(/%26/g,'&')
        .replace(/%27/g,'\'').replace(/%3A/g,':').replace(/%2F/g,'/').replace(/%3D/g,'=')
        .replace(/%28/g,'(').replace(/%3F/g,'?').replace(/%29/g,')').replace(/%2A/g,'*')
        .replace(/%20/g, '+');
    }

    function posttele (bodyss, lastInsertId, lastArrayData) {
      let sqlsss = "SELECT * FROM post_flags";
        connection.query(sqlsss, function (err, flagData) {
          if (err) {
            console.log('err: ', err);
          }
        let ListflagData = flagData[0];
        let bitly = new BitlyClient(ListflagData.current_bitly);
        let sqls = "SELECT post_id FROM post_telegram ORDER BY id DESC LIMIT 1";
        connection.query(sqls, function (err, rides) {
          if (err) {
            console.log('err: ', err);
          }
          for (let i = 0; i < lastInsertId - rides[0].post_id; i++) {
            let nextId = rides[0].post_id + i + 1;
            let userExists = lastArrayData.filter(user => user.id == nextId);
              if (userExists.length > 0 && userExists[0].text_data != 'null\n') {
             let final =[];
             let array = userExists[0].text_data.split("\n");
             if(userExists[0].text_data.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,!&\/\/=]+)/g)){ 
             let array_length = userExists[0].text_data.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#!?,&\/\/=]+)/g).length;
              for (let j = 0; j < array.length; j++) {
                if(array[j].match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,!&\/\/=]+)/g)){
                  let xzhxzh;
                    if(array[j].match(/amazon.in/g)){
                     xzhxzh = array[j].replace(/[[\]]/g,'').replace(/ /g, '@')
                    }else{
                    xzhxzh = array[j]
                    }
                  let urls = xzhxzh.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,!&\/\/=]+)/g)
                     unshort(urls[0]).then(function(unshortenedUrls){ 
                        let unshortenedUrl = unshortenedUrls.unshorten.replace(/&amp;/g,'&');
                      console.log('unshortenedUrlsssssss: ', unshortenedUrl);
                    if(unshortenedUrl.match(/amazon.in/g)){
                      let tagnot;
                      if(unshortenedUrl.match(/earnkaro/g)){
                        let finalLink =unshortenedUrl.split('dl=');
                          if(conurlencode(finalLink[1]).match(/[?]/g)){
                          tagnot= conurlencode(finalLink[1]).concat('&tag='+ListflagData.org_post_tag).replace(/&&/g, '&').replace(/(\?&)/g, '?').replace(/&&&/g, '&').replace(/([\/][\?])/g, '?').replace(/([\?][\/])/g, '?');
                        }else{
                          tagnot= conurlencode(finalLink[1]).concat('?tag='+ListflagData.org_post_tag).replace(/&&/g, '&').replace(/(\?&)/g, '?').replace(/&&&/g, '&').replace(/([\/][\?])/g, '?').replace(/([\?][\/])/g, '?');
                        }
                      }else if(unshortenedUrl.match(/paisawapas/g)){
                          let finalLink =unshortenedUrl.split('url=');
                            if(conurlencode(finalLink[1]).match(/[?]/g)){
                            tagnot= conurlencode(finalLink[1]).concat('&tag='+ListflagData.org_post_tag).replace(/&&/g, '&').replace(/(\?&)/g, '?').replace(/&&&/g, '&').replace(/([\/][\?])/g, '?').replace(/([\?][\/])/g, '?');
                          }else{
                            tagnot= conurlencode(finalLink[1]).concat('?tag='+ListflagData.org_post_tag).replace(/&&/g, '&').replace(/(\?&)/g, '?').replace(/&&&/g, '&').replace(/([\/][\?])/g, '?').replace(/([\?][\/])/g, '?');
                          }
                      }else{
                    if(conurlencode(unshortenedUrl).match(/[?]/g)){
                      let finalLink =conurlencode(unshortenedUrl).split('&');
                      console.log('finalLink: ', finalLink);
                      for (let h = 0; h < finalLink.length; h++) {
                        if(finalLink[h].match(/[?]/g)){
                          if(finalLink[h].match(/tag/g)){
                            let finalLinkssd =finalLink[h].split('?');
                            finalLink[h] = finalLinkssd[0].concat('?')
                          }else if(finalLink[h].match(/ascsubtag/g)){
                            let finalLinkssd =finalLink[h].split('?');
                            finalLink[h] = finalLinkssd[0].concat('?')
                          } else if(finalLink[h].match(/ascsub/g)){
                            let finalLinkssd =finalLink[h].split('?');
                            finalLink[h] = finalLinkssd[0].concat('?')
                          }else if(finalLink[h].match(/keywords/g)){
                            let finalLinkssdd =finalLink[h].split('?');
                            finalLink[h] = finalLinkssdd[0].concat('?')
                          }
                        }else if(finalLink[h].match(/^ascsubtag/g)){
                          finalLink[h] = "";
                        }else if(finalLink[h].match(/^tag/g)){
                          finalLink[h] = ""
                        }else if(finalLink[h].match(/^ascsub/g)){
                          finalLink[h] = ""
                        }else if(finalLink[h].match(/^keywords/g)){
                          finalLink[h] = ""
                         }else if(finalLink[h].match(/^k/g)){
                          finalLink[h] = ""
                        }
                      }
                     
                    let tagnots= finalLink.join('&').replace(/@/g, '').replace(/&&/g, '&').replace(/([\?][\/])/g, '?').replace(/(\?&)/g, '?').replace(/&&&/g, '&').replace(/([\/][\?])/g, '?');
                    let tagnotRep= tagnots.replace(/[\?]/g,'?tag='+ListflagData.org_post_tag+'&').replace(/&&/g, '&').replace(/([\?][\/])/g, '?').replace(/(\?&)/g, '?').replace(/&&&/g, '&').replace(/([\/][\?])/g, '?');
                     if(tagnotRep.charAt(tagnotRep.length-1) == '&'){
                      tagnot= tagnotRep.slice(0, -1);
                     }else{
                      tagnot= tagnotRep;
                     }
                    }else{
                     tagnot= unshortenedUrl.replace(/@/g, '').concat('?tag='+ListflagData.org_post_tag).replace(/&&/g, '&').replace(/(\?&)/g, '?').replace(/&&&/g, '&');
                    }
                  }
                  if(ListflagData.bitlyFlag == "True"){ 
                   example(tagnot.replace(/&demoyou/g, ''));
                  }else{
                    exampless(tagnot.replace(/&demoyou/g, ''));
                  }
				 // async function example(dddd) {
					//let response =await bitly.shorten(dddd);
				 // final[j] = array[j].replace(urls[0].replace(/@/g, ' ').trim(),response.link).replace(/.#x...../g,' %E2%99%A8 ').replace(/&/g, //'and').replace(/;/g, ' ');
				//	}
					
					 async function example(dddd) {
                    let response = await bitly
                    .shorten(dddd)
                    .then(function(result) {
                      return result;
                    })
                    .catch(function(error) {
                     let responses ={"link":dddd};
                     return responses;
                    });
                        final[j] = array[j].replace(urls[0].replace(/@/g, ' ').trim(),response.link);
                        
                      }
                    function exampless(dddd) {  
                    final[j] = array[j].replace(urls[0].replace(/@/g, ' ').trim(),dddd);
                    }
                  
						  }else if(unshortenedUrl.match(/flipkart.com/g) || unshortenedUrl.match(/puma.com/g) ||unshortenedUrl.match(/unacademy.com/g) ||unshortenedUrl.match(/coolwinks.com/g) ||unshortenedUrl.match(/orra.co.in/g) ||unshortenedUrl.match(/360totalsecurity.com/g) ||unshortenedUrl.match(/maxbupa.com/g) ||unshortenedUrl.match(/religarehealthinsurance.com/g) ||unshortenedUrl.match(/fnp.com/g) ||unshortenedUrl.match(/healthxp.in/g) ||unshortenedUrl.match(/bigrock.in/g) ||unshortenedUrl.match(/igp.com/g) ||unshortenedUrl.match(/letyshops.com/g) ||unshortenedUrl.match(/spartanpoker.com/g) ||unshortenedUrl.match(/adda52.com/g) ||unshortenedUrl.match(/balaji/g) ||unshortenedUrl.match(/eduonix.com/g) ||unshortenedUrl.match(/paytmmall.com/g) ||unshortenedUrl.match(/testbook.com/g) ||unshortenedUrl.match(/mamaearth.in/g) ||unshortenedUrl.match(/wonderchef.com/g) ||unshortenedUrl.match(/zee5/g) ||unshortenedUrl.match(/beardo.in/g) ||unshortenedUrl.match(/oneplus.in/g) ||unshortenedUrl.match(/1mg.com/g) ||unshortenedUrl.match(/udemy.com/g) ||unshortenedUrl.match(/hometown.in/g) ||unshortenedUrl.match(/magzter.com/g) ||unshortenedUrl.match(/asics.com/g) ||unshortenedUrl.match(/asics.com/g) ||unshortenedUrl.match(/ajio.com/g) ||unshortenedUrl.match(/timesprime.com/g)||unshortenedUrl.match(/themomsco.com/g) ||unshortenedUrl.match(/akbartravels.com/g) ||unshortenedUrl.match(/aliexpress.com/g) ||unshortenedUrl.match(/banggood.in/g) ||unshortenedUrl.match(/bata.in/g) ||unshortenedUrl.match(/behrouzbiryani.com/g) ||unshortenedUrl.match(/biba.in/g) ||unshortenedUrl.match(/bigbasket.com/g) ||unshortenedUrl.match(/brandfactoryonline.com/g) ||unshortenedUrl.match(/chumbak.com/g) ||unshortenedUrl.match(/cleartrip.com/g) ||unshortenedUrl.match(/clovia.com/g) ||unshortenedUrl.match(/croma.com/g) ||unshortenedUrl.match(/decathlon.in/g) ||unshortenedUrl.match(/dominos.co.in/g) ||unshortenedUrl.match(/etihad.com/g) ||unshortenedUrl.match(/faasos.io/g) ||unshortenedUrl.match(/fabhotels.com/g) ||unshortenedUrl.match(/firstcry.com/g) ||unshortenedUrl.match(/fossil.com/g) ||unshortenedUrl.match(/harmanaudio.in/g) ||unshortenedUrl.match(/hungama.com/g) ||unshortenedUrl.match(/insider.in/g) ||unshortenedUrl.match(/jockeyindia.com/g) ||unshortenedUrl.match(/kalkifashion.com/g) ||unshortenedUrl.match(/lenskart.com/g) ||unshortenedUrl.match(/lifestylestores.com/g) ||unshortenedUrl.match(/limeroad.com/g) ||unshortenedUrl.match(/manyavar.com/g) ||unshortenedUrl.match(/mcdonaldsindia.com/g) ||unshortenedUrl.match(/medlife.com/g) ||unshortenedUrl.match(/microsoft.com/g) ||unshortenedUrl.match(/mivi.in/g) ||unshortenedUrl.match(/makemytrip.com/g) ||unshortenedUrl.match(/myntra.com/g) ||unshortenedUrl.match(/nnnow.com/g) ||unshortenedUrl.match(/nykaafashion.com/g) ||unshortenedUrl.match(/oyorooms.com/g) ||unshortenedUrl.match(/pepperfry.com/g) ||unshortenedUrl.match(/pizzahut.co.in/g) ||unshortenedUrl.match(/puma.com/g) ||unshortenedUrl.match(/qatarairways.com/g) ||unshortenedUrl.match(/rentomojo.com/g) ||unshortenedUrl.match(/samsung.com/g) ||unshortenedUrl.match(/singaporeair.com/g) ||unshortenedUrl.match(/sochstore.com/g) ||unshortenedUrl.match(/tanishq.co.in/g) ||unshortenedUrl.match(/themancompany.com/g) ||unshortenedUrl.match(/zivame.com/g) ||unshortenedUrl.match(/zoomcar.com/g) ){
                   
                      let sqlssnet = "SELECT * FROM diff_net_posts WHERE active_flag ='TRUE'";
                      connection.query(sqlssnet, function (err, flagsData) {
                        if (err) {
                          console.log('err: ', err);
                        setup();
                        }
                        let ListflagDatass = flagsData;
                      let tagnot;
                      let quelink;
	              let quelinkRL;
                          if(unshortenedUrl.match(/earnkaro/g)){
                            let finalLink =unshortenedUrl.split('dl=');
                            quelink = finalLink[1];
                          for (let k = 0; k < ListflagDatass.length; k++) {
                            if(urlencode(finalLink[1]).match(ListflagDatass[k].domain_url)){
                              tagnot= ListflagDatass[k].Landing_Page.concat("?subid="+ListflagData.admitad_post_tag+"&ulp=").concat(urldecode(finalLink[1]));
                            }
                          }
                          }else{
                            quelink = unshortenedUrl;
                           let quelinkRL = unshortenedUrl.replace(/(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)/,'');
						              if(quelinkRL.match(/^flipkart.com/g) ||quelinkRL.match(/^banggood.com/g) || quelinkRL.match(/^puma.com/g) ||quelinkRL.match(/^unacademy.com/g) ||quelinkRL.match(/^coolwinks.com/g) ||quelinkRL.match(/^orra.co.in/g) ||quelinkRL.match(/^360totalsecurity.com/g) ||quelinkRL.match(/^maxbupa.com/g) ||quelinkRL.match(/^religarehealthinsurance.com/g) ||quelinkRL.match(/^fnp.com/g) ||quelinkRL.match(/^healthxp.in/g) ||quelinkRL.match(/^bigrock.in/g) ||quelinkRL.match(/^igp.com/g) ||quelinkRL.match(/^letyshops.com/g) ||quelinkRL.match(/^spartanpoker.com/g) ||quelinkRL.match(/^adda52.com/g) ||quelinkRL.match(/^balaji/g) ||quelinkRL.match(/^eduonix.com/g) ||quelinkRL.match(/^paytmmall.com/g) ||quelinkRL.match(/^testbook.com/g) ||quelinkRL.match(/^mamaearth.in/g) ||quelinkRL.match(/^wonderchef.com/g) ||quelinkRL.match(/^zee5/g) ||quelinkRL.match(/^beardo.in/g) ||quelinkRL.match(/^oneplus.in/g) ||quelinkRL.match(/^1mg.com/g) ||quelinkRL.match(/^udemy.com/g) ||quelinkRL.match(/^hometown.in/g) ||quelinkRL.match(/^magzter.com/g) ||quelinkRL.match(/^asics.com/g) ||quelinkRL.match(/^asics.com/g) ||quelinkRL.match(/^ajio.com/g) ||quelinkRL.match(/^timesprime.com/g)||quelinkRL.match(/^themomsco.com/g) ||quelinkRL.match(/^akbartravels.com/g) ||quelinkRL.match(/^aliexpress.com/g) ||quelinkRL.match(/^banggood.in/g) ||quelinkRL.match(/^bata.in/g) ||quelinkRL.match(/^behrouzbiryani.com/g) ||quelinkRL.match(/^biba.in/g) ||quelinkRL.match(/^bigbasket.com/g) ||quelinkRL.match(/^brandfactoryonline.com/g) ||quelinkRL.match(/^chumbak.com/g) ||quelinkRL.match(/^cleartrip.com/g) ||quelinkRL.match(/^clovia.com/g) ||quelinkRL.match(/^croma.com/g) ||quelinkRL.match(/^decathlon.in/g) ||quelinkRL.match(/^dominos.co.in/g) ||quelinkRL.match(/^etihad.com/g) ||quelinkRL.match(/^faasos.io/g) ||quelinkRL.match(/^fabhotels.com/g) ||quelinkRL.match(/^firstcry.com/g) ||quelinkRL.match(/^fossil.com/g) ||quelinkRL.match(/^harmanaudio.in/g) ||quelinkRL.match(/^hungama.com/g) ||quelinkRL.match(/^insider.in/g) ||quelinkRL.match(/^jockeyindia.com/g) ||quelinkRL.match(/^kalkifashion.com/g) ||quelinkRL.match(/^lenskart.com/g) ||quelinkRL.match(/^lifestylestores.com/g) ||quelinkRL.match(/^limeroad.com/g) ||quelinkRL.match(/^manyavar.com/g) ||quelinkRL.match(/^mcdonaldsindia.com/g) ||quelinkRL.match(/^medlife.com/g) ||quelinkRL.match(/^microsoft.com/g) ||quelinkRL.match(/^mivi.in/g) ||quelinkRL.match(/^makemytrip.com/g) ||quelinkRL.match(/^myntra.com/g) ||quelinkRL.match(/^nnnow.com/g) ||quelinkRL.match(/^nykaafashion.com/g) ||quelinkRL.match(/^oyorooms.com/g) ||quelinkRL.match(/^pepperfry.com/g) ||quelinkRL.match(/^pizzahut.co.in/g) ||quelinkRL.match(/^puma.com/g) ||quelinkRL.match(/^qatarairways.com/g) ||quelinkRL.match(/^rentomojo.com/g) ||quelinkRL.match(/^samsung.com/g) ||quelinkRL.match(/^singaporeair.com/g) ||quelinkRL.match(/^sochstore.com/g) ||quelinkRL.match(/^tanishq.co.in/g) ||quelinkRL.match(/^themancompany.com/g) ||quelinkRL.match(/^zivame.com/g) ||quelinkRL.match(/^zoomcar.com/g) ){
                            if(quelinkRL.match(/^flipkart.com/g)){
                              tagnot= undefined;
                            }else{
                            for (let t = 0; t < ListflagDatass.length; t++) {
                              if(urlencode(unshortenedUrl).match(ListflagDatass[t].domain_url)){
                                // tagnot= ListflagDatass[t].Landing_Page.concat("?subid="+ListflagData.admitad_post_tag+"&ulp=").concat(urlencode(unshortenedUrl));
                                tagnot= ListflagDatass[t].Landing_Page.concat("?subid="+ListflagData.admitad_post_tag+"&ulp=").concat(urldecode(unshortenedUrl));
                              }
                            }
                          }
                          }else{
                            if(urlencode(unshortenedUrl).match('dl=')){
                              let finalLink33 =urlencode(unshortenedUrl).split('dl=');
                              quelink = finalLink33[1];
                            }else if(urlencode(unshortenedUrl).match('url=')){
                              let finalLink44 =urlencode(unshortenedUrl).split('url=');
                              quelink = finalLink44[1];
                            } 
                            for (let t = 0; t < ListflagDatass.length; t++) {
                              if(urlencode(quelink).match(ListflagDatass[t].domain_url)){
                                tagnot= ListflagDatass[t].Landing_Page.concat("?subid="+ListflagData.admitad_post_tag+"&ulp=").concat(urldecode(quelink));
                              }
                            }
                          }
                          }
                      if(tagnot != undefined){
					   if(ListflagData.bitlyFlag == "True"){ 
						  if(tagnot.match(/flipkart.com/g)){
							example3(tagnot.replace(/%25/g,'%'));
						  }else{
							example1(tagnot.replace(/%25/g,'%'));
						  }
						  }else{
							example2(tagnot.replace(/%25/g,'%'));
						  }
                       }else{
                        if(urlencode(quelink).match(/flipkart.com/g)){
                          if(ListflagData.flipkart_server == 'dirflipkart'){
                            console.log('ListflagData.kudart_token: ', ListflagData.flipkart_server );

                          let tagnotFlipkart;
                          if(quelink.match(/www.flipkart.com/g)){
                            tagnotFlipkart = conurlencode(quelink).replace(/www.flipkart.com/g, 'dl.flipkart.com/dl');
                          }else{
                            tagnotFlipkart = conurlencode(quelink);
                          }
                          if(tagnotFlipkart.match(/[?]/g)){
                          let finalLink =tagnotFlipkart.split('&');
                          console.log('finalLink: ', finalLink);
                          for (let h = 0; h < finalLink.length; h++) {
                            if(finalLink[h].match(/[?]/g)){
                              if(finalLink[h].match(/affid/g)){
                                let finalLinkssd =finalLink[h].split('?');
                                finalLink[h] = finalLinkssd[0].concat('?')
                              }else if(finalLink[h].match(/affExtParam1/g)){
                                let finalLinkssd =finalLink[h].split('?');
                                finalLink[h] = finalLinkssd[0].concat('?')
                              } else if(finalLink[h].match(/affExtParam2/g)){
                                let finalLinkssd =finalLink[h].split('?');
                                finalLink[h] = finalLinkssd[0].concat('?')
                              }
                            }else if(finalLink[h].match(/^affExtParam1/g)){
                              finalLink[h] = "";
                            }else if(finalLink[h].match(/^affExtParam2/g)){
                              finalLink[h] = ""
                            }else if(finalLink[h].match(/^affid/g)){
                              finalLink[h] = ""
                             }else if(finalLink[h].match(/^param/g)){
                                  finalLink[h] = ""
                                }
                          }
                          var dateObj = new Date();
                          var month = dateObj.getUTCMonth() + 1; //months from 1-12
                          var day = dateObj.getUTCDate();
                          var year = dateObj.getUTCFullYear();
                          var hour = dateObj.getHours();
                          var minu = dateObj.getMinutes();
                          let ren = Math.random().toString(36).substring(7);
                        let tagnots= finalLink.join('&').replace(/@/g, '').replace(/&&/g, '&').replace(/(\?&)/g, '?').replace(/&&&/g, '&');
                        tagnot= tagnots.concat('&affid='+ListflagData.flipkart_tag).replace(/(\?&)/g, '?').replace(/&&/g, '&');
//                         tagnot= tagnots.concat('&affid='+ListflagData.flipkart_tag).concat('&affExtParam1='+month+day+year+'cl'+hour+minu+ren).concat('&affExtParam2=FK_Kudrat').replace(/(\?&)/g, '?').replace(/&&/g, '&');
                          console.log('tagnot: ', tagnot);
                        }else{
                          var dateObj = new Date();
                                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                                var day = dateObj.getUTCDate();
                                var year = dateObj.getUTCFullYear();
                                var hour = dateObj.getHours();
                                var minu = dateObj.getMinutes();
                                let ren = Math.random().toString(36).substring(7);
                          tagnot= tagnotFlipkart.concat('?affid='+ListflagData.flipkart_tag);
//                           tagnot= tagnotFlipkart.concat('?affid='+ListflagData.flipkart_tag).concat('&affExtParam1='+month+day+year+'cl'+hour+minu+ren).concat('&affExtParam2=FK_Kudrat');
                        }
        
                        if(ListflagData.bitlyFlag == "True"){ 
                          example1(tagnot.replace(/%25/g,'%'));
                      }else{
                        if(tagnot.match(/flipkart.com/g)){
                          example4(tagnot.replace(/%25/g,'%'));
                        }else{
                          example2(tagnot.replace(/%25/g,'%'));
                        }
                      }
                        }else if(ListflagData.flipkart_server == 'quelink'){
                          let finalLink =urlencode(quelink).split('&');
                          for (let h = 0; h < finalLink.length; h++) {
                            if(finalLink[h].match(/^affid/g)){
                              finalLink[h] = 'demoyou'
                            }else if(finalLink[h].match(/^affExtParam1/g)){
                              finalLink[h] = 'demoyou'
                             }else if(finalLink[h].match(/^param/g)){
                                  finalLink[h] = 'demoyou'
                                }
                          }
                        let sstarget= finalLink.join('&').replace(/&demoyou/g, '');
                          tagnot= ("https://linksredirect.com/?cid=76950&subid=kudrat_cl&source=linkkit&url=").concat(encodeURIComponent(sstarget));
                           if(ListflagData.bitlyFlag == "True"){ 
                            example1(tagnot.replace(/%25/g,'%'));
                        }else{
                          if(tagnot.match(/flipkart.com/g)){
                            example4(tagnot.replace(/%25/g,'%'));
                          }else{
                            example2(tagnot.replace(/%25/g,'%'));
                          }
                        }
                        }else if(ListflagData.flipkart_server == 'inrdeal'){
                          let finalLink =urlencode(quelink).split('&');
                          for (let h = 0; h < finalLink.length; h++) {
                            if(finalLink[h].match(/^affid/g)){
                              finalLink[h] = 'demoyou'
                            }else if(finalLink[h].match(/^affExtParam1/g)){
                              finalLink[h] = 'demoyou'
                             }else if(finalLink[h].match(/^param/g)){
                                  finalLink[h] = 'demoyou'
                                }
                          }
                        let sstarget= finalLink.join('&').replace(/&demoyou/g, '');
                          tagnot= ("https://inr.deals/track?id=jig616926125&src=merchant-detail-backend&campaign=cps&url=").concat(encodeURIComponent(sstarget));
                           if(ListflagData.bitlyFlag == "True"){ 
                            example1(tagnot.replace(/%25/g,'%'));
                        }else{
                          if(tagnot.match(/flipkart.com/g)){
                            example4(tagnot.replace(/%25/g,'%'));
                          }else{
                            example2(tagnot.replace(/%25/g,'%'));
                          }
                        }
                        }
                      }
                    }

                      async function example1(dddd) {
                        let response =await bitly.shorten(dddd);
                      final[j] = array[j].replace(urls[0].replace(/@/g, ' ').trim(),response.link).replace(/.#x...../g,' %E2%99%A8 ').replace(/&/g, 'and').replace(/;/g, ' ');
                    }
                    async function example3(dddd) {
                      let response = await bitly
                      .shorten(dddd)
                      .then(function(result) {
                        return result;
                      })
                      .catch(function(error) {
                       let jjjh =  unshort(dddd).then(function(unshortenedUrls){ 
                         let responses;
                         if(unshortenedUrls.unshorten.match(/www.flipkart.com/g)){
                         responses ={"link":unshortenedUrls.unshorten.replace(/www.flipkart.com/g, 'dl.flipkart.com/dl')};
                          }else{
                         responses ={"link":unshortenedUrls.unshorten};
                          }
                         return responses;
                      })
                      .catch(function(err){ return err;})
                      return jjjh;
  
                      });
                        final[j] = array[j].replace(urls[0].replace(/@/g, ' ').trim(),response.link);
                      }
                       function example4(dddd) {
                         console.log('dddd: ', dddd);
                         let response =  unshort(dddd).then(function(unshortenedUrls){ 
                           console.log('unshortenedUrls: ', unshortenedUrls);
                           let responses;
                           if(unshortenedUrls.unshorten.match(/www.flipkart.com/g)){
                           responses ={"link":unshortenedUrls.unshorten.replace(/www.flipkart.com/g, 'dl.flipkart.com/dl')};
                            }else{
                           responses ={"link":unshortenedUrls.unshorten};
                            }
                          final[j] = array[j].replace(urls[0].replace(/@/g, ' ').trim(),responses.link);
                        })
                        .catch(function(err){ return err;})
                        }

                        function example2(dddd) {
                          let response =  unshort(dddd).then(function(unshortenedUrls){ 
                           final[j] = array[j].replace(urls[0].replace(/@/g, ' ').trim(),unshortenedUrls.unshorten);
                         })
                         .catch(function(err){ return err;})
                         }
                  })
                    }else{
                      unshort(unshortenedUrl).then(function(unshortenedUrls){ 
                        let unshortenedUrl = unshortenedUrls.unshorten.replace(/&amp;/g,'&');
                      if(unshortenedUrl.match(/amazon.in/g)){
					 let tagnot;
                    if(unshortenedUrl.match(/[?]/g)){
                      let finalLink =unshortenedUrl.split('&');
                      console.log('finalLink: ', finalLink);
                      for (let h = 0; h < finalLink.length; h++) {
                        if(finalLink[h].match(/[?]/g)){
                          if(finalLink[h].match(/tag/g)){
                            let finalLinkssd =finalLink[h].split('?');
                            finalLink[h] = finalLinkssd[0].concat('?')
                          }else if(finalLink[h].match(/ascsubtag/g)){
                            let finalLinkssd =finalLink[h].split('?');
                            finalLink[h] = finalLinkssd[0].concat('?')
                          } else if(finalLink[h].match(/ascsub/g)){
                            let finalLinkssd =finalLink[h].split('?');
                            finalLink[h] = finalLinkssd[0].concat('?')
                          }else if(finalLink[h].match(/keywords/g)){
                            let finalLinkssdd =finalLink[h].split('?');
                            finalLink[h] = finalLinkssdd[0].concat('?')
                          }
                        }else if(finalLink[h].match(/^ascsubtag/g)){
                          finalLink[h] = "";
                        }else if(finalLink[h].match(/^tag/g)){
                          finalLink[h] = ""
                        }else if(finalLink[h].match(/^ascsub/g)){
                          finalLink[h] = ""
                        }else if(finalLink[h].match(/^keywords/g)){
                          finalLink[h] = ""
                        }
                      }
                     
                    let tagnots= finalLink.join('&').replace(/@/g, '').replace(/&&/g, '&').replace(/([\?][\/])/g, '?').replace(/(\?&)/g, '?').replace(/&&&/g, '&').replace(/([\/][\?])/g, '?').replace(/([\?][\/])/g, '?');
                    let tagnotRep= tagnots.replace(/[\?]/g,'?tag='+ListflagData.org_post_tag+'&').replace(/&&/g, '&').replace(/([\?][\/])/g, '?').replace(/(\?&)/g, '?').replace(/&&&/g, '&').replace(/([\/][\?])/g, '?').replace(/([\?][\/])/g, '?');
                     if(tagnotRep.charAt(tagnotRep.length-1) == '&'){
                      tagnot= tagnotRep.slice(0, -1);
                     }else{
                      tagnot= tagnotRep;
                     }
                    }else{
                     tagnot= unshortenedUrl.replace(/@/g, '').concat('?tag='+ListflagData.org_post_tag).replace(/&&/g, '&').replace(/(\?&)/g, '?').replace(/&&&/g, '&').replace(/([\/][\?])/g, '?').replace(/([\?][\/])/g, '?');
                    }
                   example(tagnot.replace(/&demoyou/g, ''));
                   if(ListflagData.bitlyFlag == "True"){ 
                    example6(tagnot.replace(/&demoyou/g, ''));
                   }else{
                     example7(tagnot.replace(/&demoyou/g, ''));
                   }
                     async function example6(dddd) {
                    let response = await bitly
                    .shorten(dddd)
                    .then(function(result) {
                      return result;
                    })
                    .catch(function(error) {
                     let responses ={"link":dddd};
                     return responses;
                    });
                        final[j] = array[j].replace(urls[0].replace(/@/g, ' ').trim(),response.link);
                        
                      }
                     function example7(dddd) {  
                     final[j] = array[j].replace(urls[0].replace(/@/g, ' ').trim(),dddd);
                   }  
						
						
                      }else{
                        final[j] = ' ';
                      }
                    })
                    .catch(function(err){ console.error('AAAW 👻', err)})
                    }
                      })
                      .catch(function(err){ console.error('AAAW 👻', err)})
                }else{
//                final[j] = array[j].replace(/[?]q=%23/g,'#').replace(/frcp/g,'').replace(/FRCP/g,'').replace(/cashkaro/g,'Deal').replace(/Cashkaro/g,'Deal').replace(/@I/g,'').replace(/@i/g,'').replace(/@S/g,'').replace(/@s/g,'').replace(/@f/g,'').replace(/@F/g,'').replace(/(t.me[\/])/g,'').replace(/IHD/g,'').replace(/t.me/g,'').replace(/@frcp_deals/g,' ').replace(/@IHDBROADCAST/g,' ').replace(/@IHDBroadcast/g,' ').replace(/IHDBROADCAST/g,' ').replace(/@stg003/g,' ').replace(/stg/g,'Best_shopping').replace(/ihd/g,' ').replace(/&#xA0;/g,' ').replace(/.#x...../g,' %E2%99%A8 ').replace(/[[\]]/g,'').replace(/&/g, 'and').replace(/;/g,'').replace(/^\s+|\s+$|\s+(?=\s)/g, '');
	        final[j] = array[j].replace(/[?]q=%23/g,'#').replace(/frcp/g,'').replace(/Amazon gift voucher/g,'https://amzn.to/3afr8VB - Amazon gift voucher').replace(/FRCP/g,'').replace(/ihddeals.com/g,'bestshoppingdeal.in').replace(/@Ihd56bot/g,'@asktodealadmin_bot').replace(/cashkaro/g,'Deal').replace(/Cashkaro/g,'Deal').replace(/@I/g,'').replace(/@i/g,'').replace(/@S/g,'').replace(/@s/g,'').replace(/@f/g,'').replace(/@F/g,'').replace(/(t.me[\/])/g,'').replace(/IHD/g,'').replace(/t.me/g,'').replace(/@frcp_deals/g,' ').replace(/@IHDBROADCAST/g,' ').replace(/@IHDBroadcast/g,' ').replace(/IHDBROADCAST/g,' ').replace(/@stg003/g,' ').replace(/stg/g,'Best_shopping').replace(/ihd/g,' ').replace(/&#xA0;/g,' ').replace(/.#x...../g,' %E2%99%A8 ').replace(/[[\]]/g,'').replace(/&/g, 'and').replace(/;/g,'').replace(/^\s+|\s+$|\s+(?=\s)/g, '');
		}
              }
              if(array_length == 1){
				  
                setTimeout(()=>{
                      let finalAmazon = final.join('\n');
                let getUrlPost =  finalAmazon.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g);
              let finalIdListed = JSON.parse(ListflagData.array_data).user;
             let finalPostList = JSON.parse(ListflagData.amzn_tele_value).telenogroup;
              if(finalAmazon.match(/amzn.to/g)){
//               postImageWidth(getUrlPost[0],ListflagData.bestshopping_token,ListflagData.kudart_token,nextId,finalAmazon,finalPostList);
		 postImageWidth(getUrlPost[0],ListflagData.bestshopping_token,ListflagData.kudart_token,nextId,finalAmazon,finalPostList,ListflagData.ihd_tele_flag,ListflagData.ihd_watts_flag,finalIdListed);
              }else{
         
              let finalAmazon = final.join('\n');
            if(finalAmazon.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g)){
              let finalIdList = JSON.parse(ListflagData.array_data).user;
              let finalPostList;
             if(finalAmazon.match(/amzn.to/g)){
              finalPostList = JSON.parse(ListflagData.amzn_tele_value).telenogroup;
             }else{
              finalPostList = JSON.parse(ListflagData.tele_values).telenogroup;
             }
              console.log('finalPostList: ', finalPostList);
              console.log('finalPostList: ', finalPostList.length);
              let insertFeild = [rides[0].post_id + i, JSON.stringify(finalAmazon.replace(/[^0-9a-zA-Zㄱ-힣+×÷=%♤♡☆♧)(*&^/~#@!-:;,?`_|<>{}¥£€$◇■□●○•°※¤《》¡¿₩\[\]\"\' \\]/g ,""))]
              let sqlss = "INSERT INTO post_telegram (post_id,data) VALUES (" + nextId + "," + JSON.stringify(finalAmazon.replace(/[^0-9a-zA-Zㄱ-힣+×÷=%♤♡☆♧)(*&^/~#@!-:;,?`_|<>{}¥£€$◇■□●○•°※¤《》¡¿₩\[\]\"\' \\]/g ,"")) + ")";
              connection.query(sqlss, [insertFeild], function (err, rides) {
                if (err) {
                  console.log('err: ', err);
                }else{
              if(ListflagData.ihd_tele_flag == '0' && ListflagData.ihd_watts_flag == '0' ){
                console.log('---0');
              }else if(ListflagData.ihd_tele_flag == '1' && ListflagData.ihd_watts_flag == '1' ){
                for (let l = 0; l < finalPostList.length; l++) {
                  // if(finalPostList[l].groupflag == '0'){
                    teleAutoPostChannel(finalAmazon,finalPostList[l].groupname,ListflagData.kudart_token);
                    // teleAutoPost(finalAmazon);
                  // }
                }
                whatsapp_posts1(finalAmazon, finalIdList[0].apiKey,finalIdList[0].phoneId,finalIdList[0].productId);
                whatsapp_posts2(finalAmazon, finalIdList[1].apiKey,finalIdList[1].phoneId,finalIdList[1].productId);
              }else if(ListflagData.ihd_tele_flag == '1' && ListflagData.ihd_watts_flag == '0' ){
                for (let l = 0; l < finalPostList.length; l++) {
                  // if(finalPostList[l].groupflag == '0'){
                    teleAutoPostChannel(finalAmazon,finalPostList[l].groupname,ListflagData.kudart_token);
                    // teleAutoPost(finalAmazon);
                  // }
                }
              }else if(ListflagData.ihd_tele_flag == '0' && ListflagData.ihd_watts_flag == '1' ){
                whatsapp_posts1(finalAmazon, finalIdList[0].apiKey,finalIdList[0].phoneId,finalIdList[0].productId);
                whatsapp_posts2(finalAmazon, finalIdList[1].apiKey,finalIdList[1].phoneId,finalIdList[1].productId);
              }else{
                console.log('---4');
              }
            }
          })
          }


              }
               },Math.ceil(array.length/5)*3500);
             
              } else{
              setTimeout(()=>{
                let finalAmazon = final.join('\n');
              if(finalAmazon.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g)){
                let finalIdList = JSON.parse(ListflagData.array_data).user;
                let finalPostList;
               if(finalAmazon.match(/amzn.to/g)){
                finalPostList = JSON.parse(ListflagData.amzn_tele_value).telenogroup;
               }else{
                finalPostList = JSON.parse(ListflagData.tele_values).telenogroup;
               }
                console.log('finalPostList: ', finalPostList);
                console.log('finalPostList: ', finalPostList.length);
                let insertFeild = [rides[0].post_id + i, JSON.stringify(finalAmazon.replace(/[^0-9a-zA-Zㄱ-힣+×÷=%♤♡☆♧)(*&^/~#@!-:;,?`_|<>{}¥£€$◇■□●○•°※¤《》¡¿₩\[\]\"\' \\]/g ,""))]
                let sqlss = "INSERT INTO post_telegram (post_id,data) VALUES (" + nextId + "," + JSON.stringify(finalAmazon.replace(/[^0-9a-zA-Zㄱ-힣+×÷=%♤♡☆♧)(*&^/~#@!-:;,?`_|<>{}¥£€$◇■□●○•°※¤《》¡¿₩\[\]\"\' \\]/g ,"")) + ")";
                connection.query(sqlss, [insertFeild], function (err, rides) {
                  if (err) {
                    console.log('err: ', err);
                  }else{
                if(ListflagData.ihd_tele_flag == '0' && ListflagData.ihd_watts_flag == '0' ){
                  console.log('---0');
                }else if(ListflagData.ihd_tele_flag == '1' && ListflagData.ihd_watts_flag == '1' ){
                  for (let l = 0; l < finalPostList.length; l++) {
                    // if(finalPostList[l].groupflag == '0'){
                      teleAutoPostChannel(finalAmazon,finalPostList[l].groupname,ListflagData.kudart_token);
                      // teleAutoPost(finalAmazon);
                    // }
                  }
	          	if(finalAmazon.match(/amzn.to/g)){
                  teleAutoPostChannel(finalAmazon,"@bestshoppingdl",ListflagData.kudart_token);
                  teleAutoPostChannel(finalAmazon,"@bestshoppingdeal00",ListflagData.kudart_token);
               }
                  whatsapp_posts1(finalAmazon, finalIdList[0].apiKey,finalIdList[0].phoneId,finalIdList[0].productId);
                  whatsapp_posts2(finalAmazon, finalIdList[1].apiKey,finalIdList[1].phoneId,finalIdList[1].productId);
                }else if(ListflagData.ihd_tele_flag == '1' && ListflagData.ihd_watts_flag == '0' ){
                  for (let l = 0; l < finalPostList.length; l++) {
                    // if(finalPostList[l].groupflag == '0'){
                      teleAutoPostChannel(finalAmazon,finalPostList[l].groupname,ListflagData.kudart_token);
                      // teleAutoPost(finalAmazon);
                    // }
                  }
		           if(finalAmazon.match(/amzn.to/g)){
                  teleAutoPostChannel(finalAmazon,"@bestshoppingdl",ListflagData.kudart_token);
                  teleAutoPostChannel(finalAmazon,"@bestshoppingdeal00",ListflagData.kudart_token);
               }
                }else if(ListflagData.ihd_tele_flag == '0' && ListflagData.ihd_watts_flag == '1' ){
                  whatsapp_posts1(finalAmazon, finalIdList[0].apiKey,finalIdList[0].phoneId,finalIdList[0].productId);
                  whatsapp_posts2(finalAmazon, finalIdList[1].apiKey,finalIdList[1].phoneId,finalIdList[1].productId);
                }else{
                  console.log('---4');
                }
              }
            })
            }
              },Math.ceil(array.length/5)*3500);
            }
            }else{
              let sqlss = "INSERT INTO post_telegram (post_id,data) VALUES (" + nextId + ",'demo')";
              connection.query(sqlss, function (err, rides) {
                if (err) {
                console.log('err: ', err);
                }
              })
            }
          }
          }
        })
      })
    }

function teleAutoPostChannel(finalAmazon,chanelName,token){
    var chatId = chanelName; // <= replace with yours
    bot = new nodeTelegramBotApi(token);
    bot.sendMessage(chatId, finalAmazon,{
      disable_web_page_preview: true
    })
}


router.post('/getAllInOneData', function (req, res) {
  var response = {
    "recordsTotal": 0,
    "recordsFiltered": 0,
    "data": []
  };
  async.waterfall([
    function (nextCall) {
      var sql = "Select count(*) as TotalCount from ??";
      connection.query(sql, ['post_telegram'], function (err, rides) {
        if (err) {
          console.log('11');
          return nextCall({
            "message": "something went wrong",
          });
        }
        response.recordsTotal = rides[0].TotalCount;
        response.recordsFiltered = rides[0].TotalCount
        nextCall(null, rides[0].TotalCount);
      })
    }, function (counts, nextCall) {
      startNum = parseInt(req.body.start) || 0;
      LimitNum = parseInt(req.body.length) || 10;
      var query = "Select * from ?? ORDER BY id DESC limit ? OFFSET ?";
      connection.query(query, ["post_telegram", LimitNum, startNum], function (err, ridess) {
        if (err) {
          return nextCall({
            "message": "something went wrong",
          });
        } else if (ridess.length > 0) {
          let final =[];
           for (let j = 0; j < ridess.length; j++) {
            final.push({id:j+1,watts_data:urlencodedd(ridess[j].data)})
           }
          response.data = final;
          nextCall();
        } else {
          return nextCall({
            "message": "something went wrong",
          });
        }
      })
    }
  ], function (err) {
    if (err) {
      return res.send({
        status: err.code ? err.code : 400,
        message: (err && err.msg) || "someyhing went wrong"
      });
    }
    return res.send(response);
  });
});

function urlencodedd(str) {
  return str.replace(/%E2%82%B9/g,' ₹').replace(/%E2%9A%9C/g,' ⚜').replace(/%F0%9F%8E%B8/g,' 🤝').replace(/%F0%9F%82%A0/g,' 🂠').replace(/%F0%9F%82%A1/g,' 🂡').replace(/%F0%9F%82%A2/g,' 🂢').replace(/%F0%9F%82%A3/g,' 🂣').replace(/%F0%9F%82%A4/g,' 🂤').replace(/%F0%9F%82%A5/g,' 🂥').replace(/%F0%9F%82%A6/g,' 🂦').replace(/%F0%9F%82%A7/g,' 🂧').replace(/%F0%9F%82%A8/g,' 🂨').replace(/%F0%9F%82%A9/g,' 🂩').replace(/%F0%9F%82%AA/g,' 🂪').replace(/%F0%9F%82%AB/g,' 🂫').replace(/%F0%9F%82%AC/g,' 🂬').replace(/%F0%9F%82%AD/g,' 🂭').replace(/%F0%9F%82%AE/g,' 🂮').replace(/%F0%9F%82%B1/g,' 🂱').replace(/%F0%9F%82%B2/g,' 🂲').replace(/%F0%9F%82%B3/g,' 🂳').replace(/%F0%9F%82%B4/g,' 🂴').replace(/%F0%9F%82%B5/g,' 🂵').replace(/%F0%9F%82%B6/g,' 🂶').replace(/%F0%9F%82%B7/g,' 🂷').replace(/%F0%9F%82%B8/g,' 🂸').replace(/%F0%9F%82%B9/g,' 🂹').replace(/%F0%9F%82%BA/g,' 🂺').replace(/%F0%9F%82%BB/g,' 🂻').replace(/%F0%9F%82%BC/g,' 🂼').replace(/%F0%9F%82%BD/g,' 🂽').replace(/%F0%9F%82%BE/g,' 🂾').replace(/%F0%9F%83%81/g,' 🃁').replace(/%F0%9F%83%82/g,' 🃂').replace(/%F0%9F%83%83/g,' 🃃').replace(/%F0%9F%83%84/g,' 🃄').replace(/%F0%9F%83%85/g,' 🃅').replace(/%F0%9F%83%86/g,' 🃆').replace(/%F0%9F%83%87/g,' 🃇').replace(/%F0%9F%83%88/g,' 🃈').replace(/%F0%9F%83%89/g,' 🃉').replace(/%F0%9F%83%8A/g,' 🃊').replace(/%F0%9F%83%8B/g,' 🃋').replace(/%F0%9F%83%8C/g,' 🃌').replace(/%F0%9F%83%8D/g,' 🃍').replace(/%F0%9F%83%8E/g,' 🃎').replace(/%F0%9F%83%8F/g,' 🃏').replace(/%F0%9F%83%91/g,' 🃑').replace(/%F0%9F%83%92/g,' 🃒').replace(/%F0%9F%83%93/g,' 🃓').replace(/%F0%9F%83%94/g,' 🃔').replace(/%F0%9F%83%95/g,' 🃕').replace(/%F0%9F%83%96/g,' 🃖').replace(/%F0%9F%83%97/g,' 🃗')
  .replace(/%F0%9F%83%98/g,' 🃘').replace(/%F0%9F%83%99/g,' 🃙').replace(/%F0%9F%83%9A/g,' 🃚').replace(/%F0%9F%83%9B/g,' 🃛').replace(/%F0%9F%83%9C/g,' 🃜').replace(/%F0%9F%83%9D/g,' 🃝').replace(/%F0%9F%83%9E/g,' 🃞').replace(/%F0%9F%83%9F/g,' 🃟').replace(/%F0%9F%8C%80/g,' 🌀').replace(/%F0%9F%8C%81/g,' 🌁').replace(/%F0%9F%8C%82/g,' 🌂').replace(/%F0%9F%8C%83/g,' 🌃').replace(/%F0%9F%8C%84/g,' 🌄').replace(/%F0%9F%8C%85/g,' 🌅').replace(/%F0%9F%8C%86/g,' 🌆').replace(/%F0%9F%8C%87/g,' 🌇').replace(/%F0%9F%8C%88/g,' 🌈').replace(/%F0%9F%8C%89/g,' 🌉').replace(/%F0%9F%8C%8A/g,' 🌊').replace(/%F0%9F%8C%8B/g,' 🌋').replace(/%F0%9F%8C%8C/g,' 🌌').replace(/%F0%9F%8C%8D/g,' 🌍').replace(/%F0%9F%8C%8E/g,' 🌎').replace(/%F0%9F%8C%8F/g,' 🌏').replace(/%F0%9F%8C%90/g,' 🌐').replace(/%F0%9F%8C%91/g,' 🌑').replace(/%F0%9F%8C%92/g,' 🌒').replace(/%F0%9F%8C%93/g,' 🌓').replace(/%F0%9F%8C%94/g,' 🌔').replace(/%F0%9F%8C%95/g,' 🌕').replace(/%F0%9F%8C%96/g,' 🌖').replace(/%F0%9F%8C%97/g,' 🌗').replace(/%F0%9F%8C%98/g,' 🌘').replace(/%F0%9F%8C%99/g,' 🌙').replace(/%F0%9F%8C%9A/g,' 🌚').replace(/%F0%9F%8C%9B/g,' 🌛').replace(/%F0%9F%8C%9C/g,' 🌜').replace(/%F0%9F%8C%9D/g,' 🌝').replace(/%F0%9F%8C%9E/g,' 🌞').replace(/%F0%9F%8C%9F/g,' 🌟').replace(/%F0%9F%8C%A0/g,' 🌠').replace(/%F0%9F%8C%B0/g,' 🌰').replace(/%F0%9F%8C%B1/g,' 🌱').replace(/%F0%9F%8C%B2/g,' 🌲').replace(/%F0%9F%8C%B3/g,' 🌳').replace(/%F0%9F%8C%B4/g,' 🌴').replace(/%F0%9F%8C%B5/g,' 🌵').replace(/%F0%9F%8C%B7/g,' 🌷').replace(/%F0%9F%8C%B8/g,' 🌸').replace(/%F0%9F%8C%B9/g,' 🌹')
  .replace(/%F0%9F%8C%BA/g,' 🌺').replace(/%F0%9F%8C%BB/g,' 🌻').replace(/%F0%9F%8C%BC/g,' 🌼').replace(/%F0%9F%8C%BD/g,' 🌽').replace(/%F0%9F%8C%BE/g,' 🌾').replace(/%F0%9F%8C%BF/g,' 🌿').replace(/%F0%9F%8D%80/g,' 🍀').replace(/%F0%9F%8D%81/g,' 🍁').replace(/%F0%9F%8D%82/g,' 🍂').replace(/%F0%9F%8D%83/g,' 🍃').replace(/%F0%9F%8D%84/g,' 🍄').replace(/%F0%9F%8D%85/g,' 🍅').replace(/%F0%9F%8D%86/g,' 🍆').replace(/%F0%9F%8D%87/g,' 🍇').replace(/%F0%9F%8D%88/g,' 🍈').replace(/%F0%9F%8D%89/g,' 🍉').replace(/%F0%9F%8D%8A/g,' 🍊').replace(/%F0%9F%8D%8B/g,' 🍋').replace(/%F0%9F%8D%8C/g,' 🍌').replace(/%F0%9F%8D%8D/g,' 🍍').replace(/%F0%9F%8D%8E/g,' 🍎').replace(/%F0%9F%8D%8F/g,' 🍏').replace(/%F0%9F%8D%90/g,' 🍐').replace(/%F0%9F%8D%91/g,' 🍑').replace(/%F0%9F%8D%92/g,' 🍒').replace(/%F0%9F%8D%93/g,' 🍓').replace(/%F0%9F%8D%94/g,' 🍔').replace(/%F0%9F%8D%95/g,' 🍕').replace(/%F0%9F%8D%96/g,' 🍖').replace(/%F0%9F%8D%97/g,' 🍗').replace(/%F0%9F%8D%98/g,' 🍘').replace(/%F0%9F%8D%99/g,' 🍙').replace(/%F0%9F%8D%9A/g,' 🍚').replace(/%F0%9F%8D%9B/g,' 🍛').replace(/%F0%9F%8D%9C/g,' 🍜').replace(/%F0%9F%8D%9D/g,' 🍝').replace(/%F0%9F%8D%9E/g,' 🍞').replace(/%F0%9F%8D%9F/g,' 🍟').replace(/%F0%9F%8D%A0/g,' 🍠').replace(/%F0%9F%8D%A1/g,' 🍡').replace(/%F0%9F%8D%A2/g,' 🍢').replace(/%F0%9F%8D%A3/g,' 🍣').replace(/%F0%9F%8D%A4/g,' 🍤').replace(/%F0%9F%8D%A5/g,' 🍥').replace(/%F0%9F%8D%A6/g,' 🍦').replace(/%F0%9F%8D%A7/g,' 🍧').replace(/%F0%9F%8D%A8/g,' 🍨').replace(/%F0%9F%8D%A9/g,' 🍩').replace(/%F0%9F%8D%AA/g,' 🍪').replace(/%F0%9F%8D%AB/g,' 🍫')
  .replace(/%F0%9F%8D%AC/g,' 🍬').replace(/%F0%9F%8D%AD/g,' 🍭').replace(/%F0%9F%8D%AE/g,' 🍮').replace(/%F0%9F%8D%AF/g,' 🍯').replace(/%F0%9F%8D%B0/g,' 🍰').replace(/%F0%9F%8D%B1/g,' 🍱').replace(/%F0%9F%8D%B2/g,' 🍲').replace(/%F0%9F%8D%B3/g,' 🍳').replace(/%F0%9F%8D%B4/g,' 🍴').replace(/%F0%9F%8D%B5/g,' 🍵').replace(/%F0%9F%8D%B6/g,' 🍶').replace(/%F0%9F%8D%B7/g,' 🍷').replace(/%F0%9F%8D%B8/g,' 🍸').replace(/%F0%9F%8D%B9/g,' 🍹').replace(/%F0%9F%8D%BA/g,' 🍺').replace(/%F0%9F%8D%BB/g,' 🍻').replace(/%F0%9F%8D%BC/g,' 🍼').replace(/%F0%9F%8E%80/g,' 🎀').replace(/%F0%9F%8E%81/g,' 🎁').replace(/%F0%9F%8E%82/g,' 🎂').replace(/%F0%9F%8E%83/g,' 🎃').replace(/%F0%9F%8E%84/g,' 🎄').replace(/%F0%9F%8E%85/g,' 🎅').replace(/%F0%9F%8E%86/g,' 🎆').replace(/%F0%9F%8E%87/g,' 🎇').replace(/%F0%9F%8E%88/g,' 🎈').replace(/%F0%9F%8E%89/g,' 🎉').replace(/%F0%9F%8E%8A/g,' 🎊').replace(/%F0%9F%8E%8B/g,' 🎋').replace(/%F0%9F%8E%8C/g,' 🎌').replace(/%F0%9F%8E%8D/g,' 🎍').replace(/%F0%9F%8E%8E/g,' 🎎').replace(/%F0%9F%8E%8F/g,' 🎏').replace(/%F0%9F%8E%90/g,' 🎐').replace(/%F0%9F%8E%91/g,' 🎑').replace(/%F0%9F%8E%92/g,' 🎒').replace(/%F0%9F%8E%93/g,' 🎓').replace(/%F0%9F%8E%A0/g,' 🎠').replace(/%F0%9F%8E%A1/g,' 🎡').replace(/%F0%9F%8E%A2/g,' 🎢').replace(/%F0%9F%8E%A3/g,' 🎣').replace(/%F0%9F%8E%A4/g,' 🎤').replace(/%F0%9F%8E%A5/g,' 🎥').replace(/%F0%9F%8E%A6/g,' 🎦').replace(/%F0%9F%8E%A7/g,' 🎧').replace(/%F0%9F%8E%A8/g,' 🎨').replace(/%F0%9F%8E%A9/g,' 🎩').replace(/%F0%9F%8E%AA/g,' 🎪').replace(/%F0%9F%8E%AB/g,' 🎫').replace(/%F0%9F%8E%AC/g,' 🎬').replace(/%F0%9F%8E%AD/g,' 🎭')
  .replace(/%F0%9F%8E%AE/g,' 🎮').replace(/%F0%9F%8E%AF/g,' 🎯').replace(/%F0%9F%8E%B0/g,' 🎰').replace(/%F0%9F%8E%B1/g,' 🎱').replace(/%F0%9F%8E%B2/g,' 🎲').replace(/%F0%9F%8E%B3/g,' 🎳').replace(/%F0%9F%8E%B4/g,' 🎴').replace(/%F0%9F%8E%B5/g,' 🎵').replace(/%F0%9F%8E%B6/g,' 🎶').replace(/%F0%9F%8E%B7/g,' 🎷').replace(/%F0%9F%8E%B8/g,' 🎸').replace(/%F0%9F%8E%B9/g,' 🎹').replace(/%F0%9F%8E%BA/g,' 🎺').replace(/%F0%9F%8E%BB/g,' 🎻').replace(/%F0%9F%8E%BC/g,' 🎼').replace(/%F0%9F%8E%BD/g,' 🎽').replace(/%F0%9F%8E%BE/g,' 🎾').replace(/%F0%9F%8E%BF/g,' 🎿').replace(/%F0%9F%8F%80/g,' 🏀').replace(/%F0%9F%8F%81/g,' 🏁').replace(/%F0%9F%8F%82/g,' 🏂').replace(/%F0%9F%8F%83/g,' 🏃').replace(/%F0%9F%8F%84/g,' 🏄').replace(/%F0%9F%8F%86/g,' 🏆').replace(/%F0%9F%8F%87/g,' 🏇').replace(/%F0%9F%8F%88/g,' 🏈').replace(/%F0%9F%8F%89/g,' 🏉').replace(/%F0%9F%8F%8A/g,' 🏊').replace(/%F0%9F%8F%A0/g,' 🏠').replace(/%F0%9F%8F%A1/g,' 🏡').replace(/%F0%9F%8F%A2/g,' 🏢').replace(/%F0%9F%8F%A3/g,' 🏣').replace(/%F0%9F%8F%A4/g,' 🏤').replace(/%F0%9F%8F%A5/g,' 🏥').replace(/%F0%9F%8F%A6/g,' 🏦').replace(/%F0%9F%8F%A7/g,' 🏧').replace(/%F0%9F%8F%A8/g,' 🏨').replace(/%F0%9F%8F%A9/g,' 🏩').replace(/%F0%9F%8F%AA/g,' 🏪').replace(/%F0%9F%8F%AB/g,' 🏫').replace(/%F0%9F%8F%AC/g,' 🏬').replace(/%F0%9F%8F%AD/g,' 🏭').replace(/%F0%9F%8F%AE/g,' 🏮').replace(/%F0%9F%8F%AF/g,' 🏯').replace(/%F0%9F%8F%B0/g,' 🏰').replace(/%F0%9F%90%80/g,' 🐀').replace(/%F0%9F%90%81/g,' 🐁').replace(/%F0%9F%90%82/g,' 🐂').replace(/%F0%9F%90%83/g,' 🐃').replace(/%F0%9F%90%84/g,' 🐄').replace(/%F0%9F%90%85/g,' 🐅')
  .replace(/%F0%9F%90%86/g,' 🐆').replace(/%F0%9F%90%87/g,' 🐇').replace(/%F0%9F%90%88/g,' 🐈').replace(/%F0%9F%90%89/g,' 🐉').replace(/%F0%9F%90%8A/g,' 🐊').replace(/%F0%9F%90%8B/g,' 🐋').replace(/%F0%9F%90%8C/g,' 🐌').replace(/%F0%9F%90%8D/g,' 🐍').replace(/%F0%9F%90%8E/g,' 🐎').replace(/%F0%9F%90%8F/g,' 🐏').replace(/%F0%9F%90%90/g,' 🐐').replace(/%F0%9F%90%91/g,' 🐑').replace(/%F0%9F%90%92/g,' 🐒').replace(/%F0%9F%90%93/g,' 🐓').replace(/%F0%9F%90%94/g,' 🐔').replace(/%F0%9F%90%95/g,' 🐕').replace(/%F0%9F%90%96/g,' 🐖').replace(/%F0%9F%90%97/g,' 🐗').replace(/%F0%9F%90%98/g,' 🐘').replace(/%F0%9F%90%99/g,' 🐙').replace(/%F0%9F%90%9A/g,' 🐚').replace(/%F0%9F%90%9B/g,' 🐛').replace(/%F0%9F%90%9C/g,' 🐜').replace(/%F0%9F%90%9D/g,' 🐝').replace(/%F0%9F%90%9E/g,' 🐞').replace(/%F0%9F%90%9F/g,' 🐟').replace(/%F0%9F%90%A0/g,' 🐠').replace(/%F0%9F%90%A1/g,' 🐡').replace(/%F0%9F%90%A2/g,' 🐢').replace(/%F0%9F%90%A3/g,' 🐣').replace(/%F0%9F%90%A4/g,' 🐤').replace(/%F0%9F%90%A5/g,' 🐥').replace(/%F0%9F%90%A6/g,' 🐦').replace(/%F0%9F%90%A7/g,' 🐧').replace(/%F0%9F%90%A8/g,' 🐨').replace(/%F0%9F%90%A9/g,' 🐩').replace(/%F0%9F%90%AA/g,' 🐪').replace(/%F0%9F%90%AB/g,' 🐫').replace(/%F0%9F%90%AC/g,' 🐬').replace(/%F0%9F%90%AD/g,' 🐭').replace(/%F0%9F%90%AE/g,' 🐮').replace(/%F0%9F%90%AF/g,' 🐯').replace(/%F0%9F%90%B0/g,' 🐰').replace(/%F0%9F%90%B1/g,' 🐱').replace(/%F0%9F%90%B2/g,' 🐲').replace(/%F0%9F%90%B3/g,' 🐳').replace(/%F0%9F%90%B4/g,' 🐴').replace(/%F0%9F%90%B5/g,' 🐵').replace(/%F0%9F%90%B6/g,' 🐶').replace(/%F0%9F%90%B7/g,' 🐷').replace(/%F0%9F%90%B8/g,' 🐸')
  .replace(/%F0%9F%90%B9/g,' 🐹').replace(/%F0%9F%90%BA/g,' 🐺').replace(/%F0%9F%90%BB/g,' 🐻').replace(/%F0%9F%90%BC/g,' 🐼').replace(/%F0%9F%90%BD/g,' 🐽').replace(/%F0%9F%90%BE/g,' 🐾').replace(/%F0%9F%91%80/g,' 👀').replace(/%F0%9F%91%82/g,' 👂').replace(/%F0%9F%91%83/g,' 👃').replace(/%F0%9F%91%84/g,' 👄').replace(/%F0%9F%91%85/g,' 👅').replace(/%F0%9F%91%86/g,' 👆').replace(/%F0%9F%91%87/g,' 👇').replace(/%F0%9F%91%88/g,' 👈').replace(/%F0%9F%91%89/g,' 👉').replace(/%F0%9F%91%8A/g,' 👊').replace(/%F0%9F%91%8B/g,' 👋').replace(/%F0%9F%91%8C/g,' 👌').replace(/%F0%9F%91%8D/g,' 👍').replace(/%F0%9F%91%8E/g,' 👎').replace(/%F0%9F%91%8F/g,' 👏').replace(/%F0%9F%91%90/g,' 👐').replace(/%F0%9F%91%91/g,' 👑').replace(/%F0%9F%91%92/g,' 👒').replace(/%F0%9F%91%93/g,' 👓').replace(/%F0%9F%91%94/g,' 👔').replace(/%F0%9F%91%95/g,' 👕').replace(/%F0%9F%91%96/g,' 👖').replace(/%F0%9F%91%97/g,' 👗').replace(/%F0%9F%91%98/g,' 👘').replace(/%F0%9F%91%99/g,' 👙').replace(/%F0%9F%91%9A/g,' 👚').replace(/%F0%9F%91%9B/g,' 👛').replace(/%F0%9F%91%9C/g,' 👜').replace(/%F0%9F%91%9D/g,' 👝').replace(/%F0%9F%91%9E/g,' 👞').replace(/%F0%9F%91%9F/g,' 👟').replace(/%F0%9F%91%A0/g,' 👠').replace(/%F0%9F%91%A1/g,' 👡').replace(/%F0%9F%91%A2/g,' 👢').replace(/%F0%9F%91%A3/g,' 👣').replace(/%F0%9F%91%A4/g,' 👤').replace(/%F0%9F%91%A5/g,' 👥').replace(/%F0%9F%91%A6/g,' 👦').replace(/%F0%9F%91%A7/g,' 👧').replace(/%F0%9F%91%A8/g,' 👨').replace(/%F0%9F%91%A9/g,' 👩').replace(/%F0%9F%91%AA/g,' 👪').replace(/%F0%9F%91%AB/g,' 👫').replace(/%F0%9F%91%AC/g,' 👬').replace(/%F0%9F%91%AD/g,' 👭')
  .replace(/%F0%9F%91%AE/g,' 👮').replace(/%F0%9F%91%AF/g,' 👯').replace(/%F0%9F%91%B0/g,' 👰').replace(/%F0%9F%91%B1/g,' 👱').replace(/%F0%9F%91%B2/g,' 👲').replace(/%F0%9F%91%B3/g,' 👳').replace(/%F0%9F%91%B4/g,' 👴').replace(/%F0%9F%91%B5/g,' 👵').replace(/%F0%9F%91%B6/g,' 👶').replace(/%F0%9F%91%B7/g,' 👷').replace(/%F0%9F%91%B8/g,' 👸').replace(/%F0%9F%91%B9/g,' 👹').replace(/%F0%9F%91%BA/g,' 👺').replace(/%F0%9F%91%BB/g,' 👻').replace(/%F0%9F%91%BC/g,' 👼').replace(/%F0%9F%91%BD/g,' 👽').replace(/%F0%9F%91%BE/g,' 👾').replace(/%F0%9F%91%BF/g,' 👿').replace(/%F0%9F%92%80/g,' 💀').replace(/%F0%9F%92%81/g,' 💁').replace(/%F0%9F%92%82/g,' 💂').replace(/%F0%9F%92%83/g,' 💃').replace(/%F0%9F%92%84/g,' 💄').replace(/%F0%9F%92%85/g,' 💅').replace(/%F0%9F%92%86/g,' 💆').replace(/%F0%9F%92%87/g,' 💇').replace(/%F0%9F%92%88/g,' 💈').replace(/%F0%9F%92%89/g,' 💉').replace(/%F0%9F%92%8A/g,' 💊').replace(/%F0%9F%92%8B/g,' 💋').replace(/%F0%9F%92%8C/g,' 💌').replace(/%F0%9F%92%8D/g,' 💍').replace(/%F0%9F%92%8E/g,' 💎').replace(/%F0%9F%92%8F/g,' 💏').replace(/%F0%9F%92%90/g,' 💐').replace(/%F0%9F%92%91/g,' 💑').replace(/%F0%9F%92%92/g,' 💒').replace(/%F0%9F%92%93/g,' 💓').replace(/%F0%9F%92%94/g,' 💔').replace(/%F0%9F%92%95/g,' 💕').replace(/%F0%9F%92%96/g,' 💖').replace(/%F0%9F%92%97/g,' 💗').replace(/%F0%9F%92%98/g,' 💘').replace(/%F0%9F%92%99/g,' 💙').replace(/%F0%9F%92%9A/g,' 💚').replace(/%F0%9F%92%9B/g,' 💛').replace(/%F0%9F%92%9C/g,' 💜').replace(/%F0%9F%92%9D/g,' 💝').replace(/%F0%9F%92%9E/g,' 💞').replace(/%F0%9F%92%9F/g,' 💟').replace(/%F0%9F%92%A0/g,' 💠')
  .replace(/%F0%9F%92%A1/g,' 💡').replace(/%F0%9F%92%A2/g,' 💢').replace(/%F0%9F%92%A3/g,' 💣').replace(/%F0%9F%92%A4/g,' 💤').replace(/%F0%9F%92%A5/g,' 💥').replace(/%F0%9F%92%A6/g,' 💦').replace(/%F0%9F%92%A7/g,' 💧').replace(/%F0%9F%92%A8/g,' 💨').replace(/%F0%9F%92%A9/g,' 💩').replace(/%F0%9F%92%AA/g,' 💪').replace(/%F0%9F%92%AB/g,' 💫').replace(/%F0%9F%92%AC/g,' 💬').replace(/%F0%9F%92%AD/g,' 💭').replace(/%F0%9F%92%AE/g,' 💮').replace(/%F0%9F%92%AF/g,' 💯').replace(/%F0%9F%92%B0/g,' 💰').replace(/%F0%9F%92%B1/g,' 💱').replace(/%F0%9F%92%B2/g,' 💲').replace(/%F0%9F%92%B3/g,' 💳').replace(/%F0%9F%92%B4/g,' 💴').replace(/%F0%9F%92%B5/g,' 💵').replace(/%F0%9F%92%B6/g,' 💶').replace(/%F0%9F%92%B7/g,' 💷').replace(/%F0%9F%92%B8/g,' 💸').replace(/%F0%9F%92%B9/g,' 💹').replace(/%F0%9F%92%BA/g,' 💺').replace(/%F0%9F%92%BB/g,' 💻').replace(/%F0%9F%92%BC/g,' 💼').replace(/%F0%9F%92%BD/g,' 💽').replace(/%F0%9F%92%BE/g,' 💾').replace(/%F0%9F%92%BF/g,' 💿').replace(/%F0%9F%93%80/g,' 📀').replace(/%F0%9F%93%81/g,' 📁').replace(/%F0%9F%93%82/g,' 📂').replace(/%F0%9F%93%83/g,' 📃').replace(/%F0%9F%93%84/g,' 📄').replace(/%F0%9F%93%85/g,' 📅').replace(/%F0%9F%93%86/g,' 📆').replace(/%F0%9F%93%87/g,' 📇').replace(/%F0%9F%93%88/g,' 📈').replace(/%F0%9F%93%89/g,' 📉').replace(/%F0%9F%93%8A/g,' 📊').replace(/%F0%9F%93%8B/g,' 📋').replace(/%F0%9F%93%8C/g,' 📌').replace(/%F0%9F%93%8D/g,' 📍').replace(/%F0%9F%93%8E/g,' 📎').replace(/%F0%9F%93%8F/g,' 📏').replace(/%F0%9F%93%90/g,' 📐').replace(/%F0%9F%93%91/g,' 📑').replace(/%F0%9F%93%92/g,' 📒').replace(/%F0%9F%93%93/g,' 📓')
  .replace(/%F0%9F%93%94/g,' 📔').replace(/%F0%9F%93%95/g,' 📕').replace(/%F0%9F%93%96/g,' 📖').replace(/%F0%9F%93%97/g,' 📗').replace(/%F0%9F%93%98/g,' 📘').replace(/%F0%9F%93%99/g,' 📙').replace(/%F0%9F%93%9A/g,' 📚').replace(/%F0%9F%93%9B/g,' 📛').replace(/%F0%9F%93%9C/g,' 📜').replace(/%F0%9F%93%9D/g,' 📝').replace(/%F0%9F%93%9E/g,' 📞').replace(/%F0%9F%93%9F/g,' 📟').replace(/%F0%9F%93%A0/g,' 📠').replace(/%F0%9F%93%A1/g,' 📡').replace(/%F0%9F%93%A2/g,' 📢').replace(/%F0%9F%93%A3/g,' 📣').replace(/%F0%9F%93%A4/g,' 📤').replace(/%F0%9F%93%A5/g,' 📥').replace(/%F0%9F%93%A6/g,' 📦').replace(/%F0%9F%93%A7/g,' 📧').replace(/%F0%9F%93%A8/g,' 📨').replace(/%F0%9F%93%A9/g,' 📩').replace(/%F0%9F%93%AA/g,' 📪').replace(/%F0%9F%93%AB/g,' 📫').replace(/%F0%9F%93%AC/g,' 📬').replace(/%F0%9F%93%AD/g,' 📭').replace(/%F0%9F%93%AE/g,' 📮').replace(/%F0%9F%93%AF/g,' 📯').replace(/%F0%9F%93%B0/g,' 📰').replace(/%F0%9F%93%B1/g,' 📱').replace(/%F0%9F%93%B2/g,' 📲').replace(/%F0%9F%93%B3/g,' 📳').replace(/%F0%9F%93%B4/g,' 📴').replace(/%F0%9F%93%B5/g,' 📵').replace(/%F0%9F%93%B6/g,' 📶').replace(/%F0%9F%93%B7/g,' 📷').replace(/%F0%9F%93%B9/g,' 📹').replace(/%F0%9F%93%BA/g,' 📺').replace(/%F0%9F%93%BB/g,' 📻').replace(/%F0%9F%93%BC/g,' 📼').replace(/%F0%9F%94%80/g,' 🔀').replace(/%F0%9F%94%81/g,' 🔁').replace(/%F0%9F%94%82/g,' 🔂').replace(/%F0%9F%94%83/g,' 🔃').replace(/%F0%9F%94%84/g,' 🔄').replace(/%F0%9F%94%85/g,' 🔅').replace(/%F0%9F%94%86/g,' 🔆').replace(/%F0%9F%94%87/g,' 🔇').replace(/%F0%9F%94%88/g,' 🔈').replace(/%F0%9F%94%89/g,' 🔉').replace(/%F0%9F%94%8A/g,' 🔊')
  .replace(/%F0%9F%94%8B/g,' 🔋').replace(/%F0%9F%94%8C/g,' 🔌').replace(/%F0%9F%94%8D/g,' 🔍').replace(/%F0%9F%94%8E/g,' 🔎').replace(/%F0%9F%94%8F/g,' 🔏').replace(/%F0%9F%94%90/g,' 🔐').replace(/%F0%9F%94%91/g,' 🔑').replace(/%F0%9F%94%92/g,' 🔒').replace(/%F0%9F%94%93/g,' 🔓').replace(/%F0%9F%94%94/g,' 🔔').replace(/%F0%9F%94%95/g,' 🔕').replace(/%F0%9F%94%96/g,' 🔖').replace(/%F0%9F%94%97/g,' 🔗').replace(/%F0%9F%94%98/g,' 🔘').replace(/%F0%9F%94%99/g,' 🔙').replace(/%F0%9F%94%9A/g,' 🔚').replace(/%F0%9F%94%9B/g,' 🔛').replace(/%F0%9F%94%9C/g,' 🔜').replace(/%F0%9F%94%9D/g,' 🔝').replace(/%F0%9F%94%9E/g,' 🔞').replace(/%F0%9F%94%9F/g,' 🔟').replace(/%F0%9F%94%A0/g,' 🔠').replace(/%F0%9F%94%A1/g,' 🔡').replace(/%F0%9F%94%A2/g,' 🔢').replace(/%F0%9F%94%A3/g,' 🔣').replace(/%F0%9F%94%A4/g,' 🔤').replace(/%F0%9F%94%A5/g,' 🔥').replace(/%F0%9F%94%A6/g,' 🔦').replace(/%F0%9F%94%A7/g,' 🔧').replace(/%F0%9F%94%A8/g,' 🔨').replace(/%F0%9F%94%A9/g,' 🔩').replace(/%F0%9F%94%AA/g,' 🔪').replace(/%F0%9F%94%AB/g,' 🔫').replace(/%F0%9F%94%AC/g,' 🔬').replace(/%F0%9F%94%AD/g,' 🔭').replace(/%F0%9F%94%AE/g,' 🔮').replace(/%F0%9F%94%AF/g,' 🔯').replace(/%F0%9F%94%B0/g,' 🔰').replace(/%F0%9F%94%B1/g,' 🔱').replace(/%F0%9F%94%B2/g,' 🔲').replace(/%F0%9F%94%B3/g,' 🔳').replace(/%F0%9F%94%B4/g,' 🔴').replace(/%F0%9F%94%B5/g,' 🔵').replace(/%F0%9F%94%B6/g,' 🔶').replace(/%F0%9F%94%B7/g,' 🔷').replace(/%F0%9F%94%B8/g,' 🔸').replace(/%F0%9F%94%B9/g,' 🔹').replace(/%F0%9F%94%BA/g,' 🔺').replace(/%F0%9F%94%BB/g,' 🔻').replace(/%F0%9F%94%BC/g,' 🔼').replace(/%F0%9F%94%BD/g,' 🔽')
  .replace(/%F0%9F%95%80/g,' 🕀').replace(/%F0%9F%95%81/g,' 🕁').replace(/%F0%9F%95%82/g,' 🕂').replace(/%F0%9F%95%83/g,' 🕃').replace(/%F0%9F%95%90/g,' 🕐').replace(/%F0%9F%95%91/g,' 🕑').replace(/%F0%9F%95%92/g,' 🕒').replace(/%F0%9F%95%93/g,' 🕓').replace(/%F0%9F%95%94/g,' 🕔').replace(/%F0%9F%95%95/g,' 🕕').replace(/%F0%9F%95%96/g,' 🕖').replace(/%F0%9F%95%97/g,' 🕗').replace(/%F0%9F%95%98/g,' 🕘').replace(/%F0%9F%95%99/g,' 🕙').replace(/%F0%9F%95%9A/g,' 🕚').replace(/%F0%9F%95%9B/g,' 🕛').replace(/%F0%9F%95%9C/g,' 🕜').replace(/%F0%9F%95%9D/g,' 🕝').replace(/%F0%9F%95%9E/g,' 🕞').replace(/%F0%9F%95%9F/g,' 🕟').replace(/%F0%9F%95%A0/g,' 🕠').replace(/%F0%9F%95%A1/g,' 🕡').replace(/%F0%9F%95%A2/g,' 🕢').replace(/%F0%9F%95%A3/g,' 🕣').replace(/%F0%9F%95%A4/g,' 🕤').replace(/%F0%9F%95%A5/g,' 🕥').replace(/%F0%9F%95%A6/g,' 🕦').replace(/%F0%9F%95%A7/g,' 🕧').replace(/%F0%9F%97%BB/g,' 🗻').replace(/%F0%9F%97%BC/g,' 🗼').replace(/%F0%9F%97%BD/g,' 🗽').replace(/%F0%9F%97%BE/g,' 🗾').replace(/%F0%9F%97%BF/g,' 🗿').replace(/%E2%9C%81/g,' ✁').replace(/%E2%9C%82/g,' ✂').replace(/%E2%9C%83/g,' ✃').replace(/%E2%9C%84/g,' ✄').replace(/%E2%9C%85/g,' ✅').replace(/%E2%9C%86/g,' ✆').replace(/%E2%9C%87/g,' ✇').replace(/%E2%9C%88/g,' ✈').replace(/%E2%9C%89/g,' ✉').replace(/%E2%9C%8A/g,' ✊').replace(/%E2%9C%8B/g,' ✋').replace(/%E2%9C%8C/g,' ✌').replace(/%E2%9C%8D/g,' ✍').replace(/%E2%9C%8E/g,' ✎').replace(/%E2%9C%8F/g,' ✏').replace(/%E2%9C%90/g,' ✐').replace(/%E2%9C%91/g,' ✑').replace(/%E2%9C%92/g,' ✒').replace(/%E2%9C%93/g,' ✓').replace(/%E2%9C%94/g,' ✔').replace(/%E2%9C%95/g,' ✕')
  .replace(/%E2%9C%96/g,' ✖').replace(/%E2%9C%97/g,' ✗').replace(/%E2%9C%98/g,' ✘').replace(/%E2%9C%99/g,' ✙').replace(/%E2%9C%9A/g,' ✚').replace(/%E2%9C%9B/g,' ✛').replace(/%E2%9C%9C/g,' ✜').replace(/%E2%9C%9D/g,' ✝').replace(/%E2%9C%9E/g,' ✞').replace(/%E2%9C%9F/g,' ✟').replace(/%E2%9C%A0/g,' ✠').replace(/%E2%9C%A1/g,' ✡').replace(/%E2%9C%A2/g,' ✢').replace(/%E2%9C%A3/g,' ✣').replace(/%E2%9C%A4/g,' ✤').replace(/%E2%9C%A5/g,' ✥').replace(/%E2%9C%A6/g,' ✦').replace(/%E2%9C%A7/g,' ✧').replace(/%E2%9C%A8/g,' ✨').replace(/%E2%9C%A9/g,' ✩').replace(/%E2%9C%AA/g,' ✪').replace(/%E2%9C%AB/g,' ✫').replace(/%E2%9C%AC/g,' ✬').replace(/%E2%9C%AD/g,' ✭').replace(/%E2%9C%AE/g,' ✮').replace(/%E2%9C%AF/g,' ✯').replace(/%E2%9C%B0/g,' ✰').replace(/%E2%9C%B1/g,' ✱').replace(/%E2%9C%B2/g,' ✲').replace(/%E2%9C%B3/g,' ✳').replace(/%E2%9C%B4/g,' ✴').replace(/%E2%9C%B5/g,' ✵').replace(/%E2%9C%B6/g,' ✶').replace(/%E2%9C%B7/g,' ✷').replace(/%E2%9C%B8/g,' ✸').replace(/%E2%9C%B9/g,' ✹').replace(/%E2%9C%BA/g,' ✺').replace(/%E2%9C%BB/g,' ✻').replace(/%E2%9C%BC/g,' ✼').replace(/%E2%9C%BD/g,' ✽').replace(/%E2%9C%BE/g,' ✾').replace(/%E2%9C%BF/g,' ✿').replace(/%E2%9D%80/g,' ❀').replace(/%E2%9D%81/g,' ❁').replace(/%E2%9D%82/g,' ❂').replace(/%E2%9D%83/g,' ❃').replace(/%E2%9D%84/g,' ❄').replace(/%E2%9D%85/g,' ❅').replace(/%E2%9D%86/g,' ❆').replace(/%E2%9D%87/g,' ❇').replace(/%E2%9D%88/g,' ❈').replace(/%E2%9D%89/g,' ❉').replace(/%E2%9D%8A/g,' ❊').replace(/%E2%9D%8B/g,' ❋').replace(/%E2%9D%8C/g,' ❌').replace(/%E2%9D%8D/g,' ❍').replace(/%E2%9D%8E/g,' ❎').replace(/%E2%9D%8F/g,' ❏').replace(/%E2%9D%90/g,' ❐').replace(/%E2%9D%91/g,' ❑')
  .replace(/%E2%9D%92/g,' ❒').replace(/%E2%9D%93/g,' ❓').replace(/%E2%9D%94/g,' ❔').replace(/%E2%9D%95/g,' ❕').replace(/%E2%9D%96/g,' ❖').replace(/%E2%9D%97/g,' ❗').replace(/%E2%9D%98/g,' ❘').replace(/%E2%9D%99/g,' ❙').replace(/%E2%9D%9A/g,' ❚').replace(/%E2%9D%9B/g,' ❛').replace(/%E2%9D%9C/g,' ❜').replace(/%E2%9D%9D/g,' ❝').replace(/%E2%9D%9E/g,' ❞').replace(/%E2%9D%9F/g,' ❟').replace(/%E2%9D%A0/g,' ❠').replace(/%E2%9D%A1/g,' ❡').replace(/%E2%9D%A2/g,' ❢').replace(/%E2%9D%A3/g,' ❣').replace(/%E2%9D%A4/g,' ❤').replace(/%E2%9D%A5/g,' ❥').replace(/%E2%9D%A6/g,' ❦').replace(/%E2%9D%A7/g,' ❧').replace(/%E2%9D%A8/g,' ❨').replace(/%E2%9D%A9/g,' ❩').replace(/%E2%9D%AA/g,' ❪').replace(/%E2%9D%AB/g,' ❫').replace(/%E2%9D%AC/g,' ❬').replace(/%E2%9D%AD/g,' ❭').replace(/%E2%9D%AE/g,' ❮').replace(/%E2%9D%AF/g,' ❯').replace(/%E2%9D%B0/g,' ❰').replace(/%E2%9D%B1/g,' ❱').replace(/%E2%9D%B2/g,' ❲').replace(/%E2%9D%B3/g,' ❳').replace(/%E2%9D%B4/g,' ❴').replace(/%E2%9D%B5/g,' ❵').replace(/%E2%9D%B6/g,' ❶').replace(/%E2%9D%B7/g,' ❷').replace(/%E2%9D%B8/g,' ❸').replace(/%E2%9D%B9/g,' ❹').replace(/%E2%9D%BA/g,' ❺').replace(/%E2%9D%BB/g,' ❻').replace(/%E2%9D%BC/g,' ❼').replace(/%E2%9D%BD/g,' ❽').replace(/%E2%9D%BE/g,' ❾').replace(/%E2%9D%BF/g,' ❿').replace(/%E2%9E%80/g,' ➀').replace(/%E2%9E%81/g,' ➁').replace(/%E2%9E%82/g,' ➂').replace(/%E2%9E%83/g,' ➃').replace(/%E2%9E%84/g,' ➄').replace(/%E2%9E%85/g,' ➅').replace(/%E2%9E%86/g,' ➆').replace(/%E2%9E%87/g,' ➇').replace(/%E2%9E%88/g,' ➈').replace(/%E2%9E%89/g,' ➉').replace(/%E2%9E%8A/g,' ➊').replace(/%E2%9E%8B/g,' ➋').replace(/%E2%9E%8C/g,' ➌').replace(/%E2%9E%8D/g,' ➍').replace(/%E2%9E%8E/g,' ➎')
  .replace(/%E2%9E%8F/g,' ➏').replace(/%E2%9E%90/g,' ➐').replace(/%E2%9E%91/g,' ➑').replace(/%E2%9E%92/g,' ➒').replace(/%E2%9E%93/g,' ➓').replace(/%E2%9E%94/g,' ➔').replace(/%E2%9E%98/g,' ➘').replace(/%E2%9E%99/g,' ➙').replace(/%E2%9E%9A/g,' ➚').replace(/%E2%9E%9B/g,' ➛').replace(/%E2%9E%9C/g,' ➜').replace(/%E2%9E%9D/g,' ➝').replace(/%E2%9E%9E/g,' ➞').replace(/%E2%9E%9F/g,' ➟').replace(/%E2%9E%A0/g,' ➠').replace(/%E2%9E%A1/g,' ➡').replace(/%E2%9E%A2/g,' ➢').replace(/%E2%9E%A3/g,' ➣').replace(/%E2%9E%A4/g,' ➤').replace(/%E2%9E%A5/g,' ➥').replace(/%E2%9E%A6/g,' ➦').replace(/%E2%9E%A7/g,' ➧').replace(/%E2%9E%A8/g,' ➨').replace(/%E2%9E%A9/g,' ➩').replace(/%E2%9E%AA/g,' ➪').replace(/%E2%9E%AB/g,' ➫').replace(/%E2%9E%AC/g,' ➬').replace(/%E2%9E%AD/g,' ➭').replace(/%E2%9E%AE/g,' ➮').replace(/%E2%9E%AF/g,' ➯').replace(/%E2%9E%B0/g,' ➰').replace(/%E2%9E%B1/g,' ➱').replace(/%E2%9E%B2/g,' ➲').replace(/%E2%9E%B3/g,' ➳').replace(/%E2%9E%B4/g,' ➴').replace(/%E2%9E%B5/g,' ➵').replace(/%E2%9E%B6/g,' ➶').replace(/%E2%9E%B7/g,' ➷').replace(/%E2%9E%B8/g,' ➸').replace(/%E2%9E%B9/g,' ➹').replace(/%E2%9E%BA/g,' ➺').replace(/%E2%9E%BB/g,' ➻').replace(/%E2%9E%BC/g,' ➼').replace(/%E2%9E%BD/g,' ➽').replace(/%E2%9E%BE/g,' ➾').replace(/%E2%9E%BF/g,' ➿').replace(/%E2%98%80/g,' ☀').replace(/%E2%98%81/g,' ☁').replace(/%E2%98%82/g,' ☂').replace(/%E2%98%83/g,' ☃').replace(/%E2%98%84/g,' ☄').replace(/%E2%98%85/g,' ★').replace(/%E2%98%86/g,' ☆').replace(/%E2%98%87/g,' ☇').replace(/%E2%98%88/g,' ☈').replace(/%E2%98%89/g,' ☉').replace(/%E2%98%8A/g,' ☊').replace(/%E2%98%8B/g,' ☋').replace(/%E2%98%8C/g,' ☌').replace(/%E2%98%8D/g,' ☍')
  .replace(/%E2%98%8E/g,' ☎').replace(/%E2%98%8F/g,' ☏').replace(/%E2%98%90/g,' ☐').replace(/%E2%98%91/g,' ☑').replace(/%E2%98%92/g,' ☒').replace(/%E2%98%93/g,' ☓').replace(/%E2%98%94/g,' ☔').replace(/%E2%98%95/g,' ☕').replace(/%E2%98%96/g,' ☖').replace(/%E2%98%97/g,' ☗').replace(/%E2%98%98/g,' ☘').replace(/%E2%98%99/g,' ☙').replace(/%E2%98%9A/g,' ☚').replace(/%E2%98%9B/g,' ☛').replace(/%E2%98%9C/g,' ☜').replace(/%E2%98%9D/g,' ☝').replace(/%E2%98%9E/g,' ☞').replace(/%E2%98%9F/g,' ☟').replace(/%E2%98%A0/g,' ☠').replace(/%E2%98%A1/g,' ☡').replace(/%E2%98%A2/g,' ☢').replace(/%E2%98%A3/g,' ☣').replace(/%E2%98%A4/g,' ☤').replace(/%E2%98%A5/g,' ☥').replace(/%E2%98%A6/g,' ☦').replace(/%E2%98%A7/g,' ☧').replace(/%E2%98%A8/g,' ☨').replace(/%E2%98%A9/g,' ☩').replace(/%E2%98%AA/g,' ☪').replace(/%E2%98%AB/g,' ☫').replace(/%E2%98%AC/g,' ☬').replace(/%E2%98%AD/g,' ☭').replace(/%E2%98%AE/g,' ☮').replace(/%E2%98%AF/g,' ☯').replace(/%E2%98%B0/g,' ☰').replace(/%E2%98%B1/g,' ☱').replace(/%E2%98%B2/g,' ☲').replace(/%E2%98%B3/g,' ☳').replace(/%E2%98%B4/g,' ☴').replace(/%E2%98%B5/g,' ☵').replace(/%E2%98%B6/g,' ☶').replace(/%E2%98%B7/g,' ☷').replace(/%E2%98%B8/g,' ☸').replace(/%E2%98%B9/g,' ☹').replace(/%E2%98%BA/g,' ☺').replace(/%E2%98%BB/g,' ☻').replace(/%E2%98%BC/g,' ☼').replace(/%E2%98%BD/g,' ☽').replace(/%E2%98%BE/g,' ☾').replace(/%E2%98%BF/g,' ☿').replace(/%E2%99%80/g,' ♀').replace(/%E2%99%81/g,' ♁').replace(/%E2%99%82/g,' ♂').replace(/%E2%99%83/g,' ♃').replace(/%E2%99%84/g,' ♄').replace(/%E2%99%85/g,' ♅').replace(/%E2%99%86/g,' ♆').replace(/%E2%99%87/g,' ♇').replace(/%E2%99%88/g,' ♈').replace(/%E2%99%89/g,' ♉').replace(/%E2%99%8A/g,' ♊')
  .replace(/%E2%99%8B/g,' ♋').replace(/%E2%99%8C/g,' ♌').replace(/%E2%99%8D/g,' ♍').replace(/%E2%99%8E/g,' ♎').replace(/%E2%99%8F/g,' ♏').replace(/%E2%99%90/g,' ♐').replace(/%E2%99%91/g,' ♑').replace(/%E2%99%92/g,' ♒').replace(/%E2%99%93/g,' ♓').replace(/%E2%99%94/g,' ♔').replace(/%E2%99%95/g,' ♕').replace(/%E2%99%96/g,' ♖').replace(/%E2%99%97/g,' ♗').replace(/%E2%99%98/g,' ♘').replace(/%E2%99%99/g,' ♙').replace(/%E2%99%9A/g,' ♚').replace(/%E2%99%9B/g,' ♛').replace(/%E2%99%9C/g,' ♜').replace(/%E2%99%9D/g,' ♝').replace(/%E2%99%9E/g,' ♞').replace(/%E2%99%9F/g,' ♟').replace(/%E2%99%A0/g,' ♠').replace(/%E2%99%A1/g,' ♡').replace(/%E2%99%A2/g,' ♢').replace(/%E2%99%A3/g,' ♣').replace(/%E2%99%A4/g,' ♤').replace(/%E2%99%A5/g,' ♥').replace(/%E2%99%A6/g,' ♦').replace(/%E2%99%A7/g,' ♧').replace(/%E2%99%A8/g,' ♨').replace(/%E2%99%A9/g,' ♩').replace(/%E2%99%AA/g,' ♪').replace(/%E2%99%AB/g,' ♫').replace(/%E2%99%AC/g,' ♬').replace(/%E2%99%AD/g,' ♭').replace(/%E2%99%AE/g,' ♮').replace(/%E2%99%AF/g,' ♯').replace(/%E2%99%B0/g,' ♰').replace(/%E2%99%B1/g,' ♱').replace(/%E2%99%B2/g,' ♲').replace(/%E2%99%B3/g,' ♳').replace(/%E2%99%B4/g,' ♴').replace(/%E2%99%B5/g,' ♵').replace(/%E2%99%B6/g,' ♶').replace(/%E2%99%B7/g,' ♷').replace(/%E2%99%B8/g,' ♸').replace(/%E2%99%B9/g,' ♹').replace(/%E2%99%BA/g,' ♺').replace(/%E2%99%BB/g,' ♻').replace(/%E2%99%BC/g,' ♼').replace(/%E2%99%BD/g,' ♽').replace(/%E2%99%BE/g,' ♾').replace(/%E2%99%BF/g,' ♿').replace(/%E2%9A%80/g,' ⚀').replace(/%E2%9A%81/g,' ⚁').replace(/%E2%9A%82/g,' ⚂').replace(/%E2%9A%83/g,' ⚃').replace(/%E2%9A%84/g,' ⚄').replace(/%E2%9A%85/g,' ⚅').replace(/%E2%9A%86/g,' ⚆').replace(/%E2%9A%87/g,' ⚇')
  .replace(/%E2%9A%88/g,' ⚈').replace(/%E2%9A%89/g,' ⚉').replace(/%E2%9A%8A/g,' ⚊').replace(/%E2%9A%8B/g,' ⚋').replace(/%E2%9A%8C/g,' ⚌').replace(/%E2%9A%8D/g,' ⚍').replace(/%E2%9A%8E/g,' ⚎').replace(/%E2%9A%8F/g,' ⚏').replace(/%E2%9A%90/g,' ⚐').replace(/%E2%9A%91/g,' ⚑').replace(/%E2%9A%92/g,' ⚒').replace(/%E2%9A%93/g,' ⚓').replace(/%E2%9A%94/g,' ⚔').replace(/%E2%9A%95/g,' ⚕').replace(/%E2%9A%96/g,' ⚖').replace(/%E2%9A%97/g,' ⚗').replace(/%E2%9A%98/g,' ⚘').replace(/%E2%9A%99/g,' ⚙').replace(/%E2%9A%9A/g,' ⚚').replace(/%E2%9A%9B/g,' ⚛').replace(/%E2%9A%9C/g,' ⚜').replace(/%E2%9A%9D/g,' ⚝').replace(/%E2%9A%9E/g,' ⚞').replace(/%E2%9A%9F/g,' ⚟').replace(/%E2%9A%A0/g,' ⚠').replace(/%E2%9A%A1/g,' ⚡').replace(/%E2%9A%A2/g,' ⚢').replace(/%E2%9A%A3/g,' ⚣').replace(/%E2%9A%A4/g,' ⚤').replace(/%E2%9A%A5/g,' ⚥').replace(/%E2%9A%A6/g,' ⚦').replace(/%E2%9A%A7/g,' ⚧').replace(/%E2%9A%A8/g,' ⚨').replace(/%E2%9A%A9/g,' ⚩').replace(/%E2%9A%AA/g,' ⚪').replace(/%E2%9A%AB/g,' ⚫').replace(/%E2%9A%AC/g,' ⚬').replace(/%E2%9A%AD/g,' ⚭').replace(/%E2%9A%AE/g,' ⚮').replace(/%E2%9A%AF/g,' ⚯').replace(/%E2%9A%B0/g,' ⚰').replace(/%E2%9A%B1/g,' ⚱').replace(/%E2%9A%B2/g,' ⚲').replace(/%E2%9A%B3/g,' ⚳').replace(/%E2%9A%B4/g,' ⚴').replace(/%E2%9A%B5/g,' ⚵').replace(/%E2%9A%B6/g,' ⚶').replace(/%E2%9A%B7/g,' ⚷').replace(/%E2%9A%B8/g,' ⚸').replace(/%E2%9A%B9/g,' ⚹').replace(/%E2%9A%BA/g,' ⚺').replace(/%E2%9A%BB/g,' ⚻').replace(/%E2%9A%BC/g,' ⚼').replace(/%E2%9A%BD/g,' ⚽').replace(/%E2%9A%BE/g,' ⚾').replace(/%E2%9A%BF/g,' ⚿').replace(/%E2%9B%80/g,' ⛀').replace(/%E2%9B%81/g,' ⛁').replace(/%E2%9B%82/g,' ⛂').replace(/%E2%9B%83/g,' ⛃').replace(/%E2%9B%84/g,' ⛄')
  .replace(/%E2%9B%85/g,' ⛅').replace(/%E2%9B%86/g,' ⛆').replace(/%E2%9B%87/g,' ⛇').replace(/%E2%9B%88/g,' ⛈').replace(/%E2%9B%89/g,' ⛉').replace(/%E2%9B%8A/g,' ⛊').replace(/%E2%9B%8B/g,' ⛋').replace(/%E2%9B%8C/g,' ⛌').replace(/%E2%9B%8D/g,' ⛍').replace(/%E2%9B%8E/g,' ⛎').replace(/%E2%9B%8F/g,' ⛏').replace(/%E2%9B%90/g,' ⛐').replace(/%E2%9B%91/g,' ⛑').replace(/%E2%9B%92/g,' ⛒').replace(/%E2%9B%93/g,' ⛓').replace(/%E2%9B%94/g,' ⛔').replace(/%E2%9B%95/g,' ⛕').replace(/%E2%9B%96/g,' ⛖').replace(/%E2%9B%97/g,' ⛗').replace(/%E2%9B%98/g,' ⛘').replace(/%E2%9B%99/g,' ⛙').replace(/%E2%9B%9A/g,' ⛚').replace(/%E2%9B%9B/g,' ⛛').replace(/%E2%9B%9C/g,' ⛜').replace(/%E2%9B%9D/g,' ⛝').replace(/%E2%9B%9E/g,' ⛞').replace(/%E2%9B%9F/g,' ⛟').replace(/%E2%9B%A0/g,' ⛠').replace(/%E2%9B%A1/g,' ⛡').replace(/%E2%9B%A2/g,' ⛢').replace(/%E2%9B%A3/g,' ⛣').replace(/%E2%9B%A4/g,' ⛤').replace(/%E2%9B%A5/g,' ⛥').replace(/%E2%9B%A6/g,' ⛦').replace(/%E2%9B%A7/g,' ⛧').replace(/%E2%9B%A8/g,' ⛨').replace(/%E2%9B%A9/g,' ⛩').replace(/%E2%9B%AA/g,' ⛪').replace(/%E2%9B%AB/g,' ⛫').replace(/%E2%9B%AC/g,' ⛬').replace(/%E2%9B%AD/g,' ⛭').replace(/%E2%9B%AE/g,' ⛮').replace(/%E2%9B%AF/g,' ⛯').replace(/%E2%9B%B0/g,' ⛰').replace(/%E2%9B%B1/g,' ⛱').replace(/%E2%9B%B2/g,' ⛲').replace(/%E2%9B%B3/g,' ⛳').replace(/%E2%9B%B4/g,' ⛴').replace(/%E2%9B%B5/g,' ⛵').replace(/%E2%9B%B6/g,' ⛶').replace(/%E2%9B%B7/g,' ⛷').replace(/%E2%9B%B8/g,' ⛸').replace(/%E2%9B%B9/g,' ⛹').replace(/%E2%9B%BA/g,' ⛺').replace(/%E2%9B%BB/g,' ⛻').replace(/%E2%9B%BC/g,' ⛼').replace(/%E2%9B%BD/g,' ⛽').replace(/%E2%9B%BE/g,' ⛾').replace(/%E2%9B%BF/g,' ⛿').replace(/%F0%9F%9A%80/g,' 🚀')
  .replace(/%F0%9F%9A%81/g,' 🚁').replace(/%F0%9F%9A%82/g,' 🚂').replace(/%F0%9F%9A%83/g,' 🚃').replace(/%F0%9F%9A%84/g,' 🚄').replace(/%F0%9F%9A%85/g,' 🚅').replace(/%F0%9F%9A%86/g,' 🚆').replace(/%F0%9F%9A%87/g,' 🚇').replace(/%F0%9F%9A%88/g,' 🚈').replace(/%F0%9F%9A%89/g,' 🚉').replace(/%F0%9F%9A%8A/g,' 🚊').replace(/%F0%9F%9A%8B/g,' 🚋').replace(/%F0%9F%9A%8C/g,' 🚌').replace(/%F0%9F%9A%8D/g,' 🚍').replace(/%F0%9F%9A%8E/g,' 🚎').replace(/%F0%9F%9A%8F/g,' 🚏').replace(/%F0%9F%9A%90/g,' 🚐').replace(/%F0%9F%9A%91/g,' 🚑').replace(/%F0%9F%9A%92/g,' 🚒').replace(/%F0%9F%9A%93/g,' 🚓').replace(/%F0%9F%9A%94/g,' 🚔').replace(/%F0%9F%9A%95/g,' 🚕').replace(/%F0%9F%9A%96/g,' 🚖').replace(/%F0%9F%9A%97/g,' 🚗').replace(/%F0%9F%9A%98/g,' 🚘').replace(/%F0%9F%9A%99/g,' 🚙').replace(/%F0%9F%9A%9A/g,' 🚚').replace(/%F0%9F%9A%9B/g,' 🚛').replace(/%F0%9F%9A%9C/g,' 🚜').replace(/%F0%9F%9A%9D/g,' 🚝').replace(/%F0%9F%9A%9E/g,' 🚞').replace(/%F0%9F%9A%9F/g,' 🚟').replace(/%F0%9F%9A%A0/g,' 🚠').replace(/%F0%9F%9A%A1/g,' 🚡').replace(/%F0%9F%9A%A2/g,' 🚢').replace(/%F0%9F%9A%A3/g,' 🚣').replace(/%F0%9F%9A%A4/g,' 🚤').replace(/%F0%9F%9A%A5/g,' 🚥').replace(/%F0%9F%9A%A6/g,' 🚦').replace(/%F0%9F%9A%A7/g,' 🚧').replace(/%F0%9F%9A%A8/g,' 🚨').replace(/%F0%9F%9A%A9/g,' 🚩').replace(/%F0%9F%9A%AA/g,' 🚪').replace(/%F0%9F%9A%AB/g,' 🚫').replace(/%F0%9F%9A%AC/g,' 🚬').replace(/%F0%9F%9A%AD/g,' 🚭').replace(/%F0%9F%9A%AE/g,' 🚮').replace(/%F0%9F%9A%AF/g,' 🚯').replace(/%F0%9F%9A%B0/g,' 🚰').replace(/%F0%9F%9A%B1/g,' 🚱').replace(/%F0%9F%9A%B2/g,' 🚲').replace(/%F0%9F%9A%B3/g,' 🚳').replace(/%F0%9F%9A%B4/g,' 🚴').replace(/%F0%9F%9A%B5/g,' 🚵')
  .replace(/%F0%9F%9A%B6/g,' 🚶').replace(/%F0%9F%9A%B7/g,' 🚷').replace(/%F0%9F%9A%B8/g,' 🚸').replace(/%F0%9F%9A%B9/g,' 🚹').replace(/%F0%9F%9A%BA/g,' 🚺').replace(/%F0%9F%9A%BB/g,' 🚻').replace(/%F0%9F%9A%BC/g,' 🚼').replace(/%F0%9F%9A%BD/g,' 🚽').replace(/%F0%9F%9A%BE/g,' 🚾').replace(/%F0%9F%9A%BF/g,' 🚿').replace(/%F0%9F%9B%80/g,' 🛀').replace(/%F0%9F%9B%81/g,' 🛁').replace(/%F0%9F%9B%82/g,' 🛂').replace(/%F0%9F%9B%83/g,' 🛃').replace(/%F0%9F%9B%84/g,' 🛄').replace(/%F0%9F%9B%85/g,' 🛅').replace(/%F0%9F%98%80/g,' 😀').replace(/%F0%9F%98%81/g,' 😁').replace(/%F0%9F%98%82/g,' 😂').replace(/%F0%9F%98%83/g,' 😃').replace(/%F0%9F%98%84/g,' 😄').replace(/%F0%9F%98%85/g,' 😅').replace(/%F0%9F%98%86/g,' 😆').replace(/%F0%9F%98%87/g,' 😇').replace(/%F0%9F%98%88/g,' 😈').replace(/%F0%9F%98%89/g,' 😉').replace(/%F0%9F%98%8A/g,' 😊').replace(/%F0%9F%98%8B/g,' 😋').replace(/%F0%9F%98%8C/g,' 😌').replace(/%F0%9F%98%8D/g,' 😍').replace(/%F0%9F%98%8E/g,' 😎').replace(/%F0%9F%98%8F/g,' 😏').replace(/%F0%9F%98%90/g,' 😐').replace(/%F0%9F%98%91/g,' 😑').replace(/%F0%9F%98%92/g,' 😒').replace(/%F0%9F%98%93/g,' 😓').replace(/%F0%9F%98%94/g,' 😔').replace(/%F0%9F%98%95/g,' 😕').replace(/%F0%9F%98%96/g,' 😖').replace(/%F0%9F%98%97/g,' 😗').replace(/%F0%9F%98%98/g,' 😘').replace(/%F0%9F%98%99/g,' 😙').replace(/%F0%9F%98%9A/g,' 😚').replace(/%F0%9F%98%9B/g,' 😛').replace(/%F0%9F%98%9C/g,' 😜').replace(/%F0%9F%98%9D/g,' 😝').replace(/%F0%9F%98%9E/g,' 😞').replace(/%F0%9F%98%9F/g,' 😟').replace(/%F0%9F%98%A0/g,' 😠').replace(/%F0%9F%98%A1/g,' 😡').replace(/%F0%9F%98%A2/g,' 😢').replace(/%F0%9F%98%A3/g,' 😣').replace(/%F0%9F%98%A4/g,' 😤').replace(/%F0%9F%98%A5/g,' 😥')
  .replace(/%F0%9F%98%A6/g,' 😦').replace(/%F0%9F%98%A7/g,' 😧').replace(/%F0%9F%98%A8/g,' 😨').replace(/%F0%9F%98%A9/g,' 😩').replace(/%F0%9F%98%AA/g,' 😪').replace(/%F0%9F%98%AB/g,' 😫').replace(/%F0%9F%98%AC/g,' 😬').replace(/%F0%9F%98%AD/g,' 😭').replace(/%F0%9F%98%AE/g,' 😮').replace(/%F0%9F%98%AF/g,' 😯').replace(/%F0%9F%98%B0/g,' 😰').replace(/%F0%9F%98%B1/g,' 😱').replace(/%F0%9F%98%B2/g,' 😲').replace(/%F0%9F%98%B3/g,' 😳').replace(/%F0%9F%98%B4/g,' 😴').replace(/%F0%9F%98%B5/g,' 😵').replace(/%F0%9F%98%B6/g,' 😶').replace(/%F0%9F%98%B7/g,' 😷').replace(/%F0%9F%98%B8/g,' 😸').replace(/%F0%9F%98%B9/g,' 😹').replace(/%F0%9F%98%BA/g,' 😺').replace(/%F0%9F%98%BB/g,' 😻').replace(/%F0%9F%98%BC/g,' 😼').replace(/%F0%9F%98%BD/g,' 😽').replace(/%F0%9F%98%BE/g,' 😾').replace(/%F0%9F%98%BF/g,' 😿').replace(/%F0%9F%99%80/g,' 🙀').replace(/%F0%9F%99%85/g,' 🙅').replace(/%F0%9F%99%86/g,' 🙆').replace(/%F0%9F%99%87/g,' 🙇').replace(/%F0%9F%99%88/g,' 🙈').replace(/%F0%9F%99%89/g,' 🙉').replace(/%F0%9F%99%8A/g,' 🙊').replace(/%F0%9F%99%8B/g,' 🙋').replace(/%F0%9F%99%8C/g,' 🙌').replace(/%F0%9F%99%8D/g,' 🙍').replace(/%F0%9F%99%8E/g,' 🙎').replace(/%F0%9F%99%8F/g,' 🙏').replace(/%E2%96%A0/g,' ■').replace(/%E2%96%A1/g,' □').replace(/%E2%96%A2/g,' ▢').replace(/%E2%96%A3/g,' ▣').replace(/%E2%96%A4/g,' ▤').replace(/%E2%96%A5/g,' ▥').replace(/%E2%96%A6/g,' ▦').replace(/%E2%96%A7/g,' ▧').replace(/%E2%96%A8/g,' ▨').replace(/%E2%96%A9/g,' ▩').replace(/%E2%96%AA/g,' ▪').replace(/%E2%96%AB/g,' ▫').replace(/%E2%96%AC/g,' ▬').replace(/%E2%96%AD/g,' ▭').replace(/%E2%96%AE/g,' ▮').replace(/%E2%96%AF/g,' ▯').replace(/%E2%96%B0/g,' ▰').replace(/%E2%96%B1/g,' ▱').replace(/%E2%96%B2/g,' ▲')
  .replace(/%E2%96%B3/g,' △').replace(/%E2%96%B4/g,' ▴').replace(/%E2%96%B5/g,' ▵').replace(/%E2%96%B6/g,' ▶').replace(/%E2%96%B7/g,' ▷').replace(/%E2%96%B8/g,' ▸').replace(/%E2%96%B9/g,' ▹').replace(/%E2%96%BA/g,' ►').replace(/%E2%96%BB/g,' ▻').replace(/%E2%96%BC/g,' ▼').replace(/%E2%96%BD/g,' ▽').replace(/%E2%96%BE/g,' ▾').replace(/%E2%96%BF/g,' ▿').replace(/%E2%97%80/g,' ◀').replace(/%E2%97%81/g,' ◁').replace(/%E2%97%82/g,' ◂').replace(/%E2%97%83/g,' ◃').replace(/%E2%97%84/g,' ◄').replace(/%E2%97%85/g,' ◅').replace(/%E2%97%86/g,' ◆').replace(/%E2%97%87/g,' ◇').replace(/%E2%97%88/g,' ◈').replace(/%E2%97%89/g,' ◉').replace(/%E2%97%8A/g,' ◊').replace(/%E2%97%8B/g,' ○').replace(/%E2%97%8C/g,' ◌').replace(/%E2%97%8D/g,' ◍').replace(/%E2%97%8E/g,' ◎').replace(/%E2%97%8F/g,' ●').replace(/%E2%97%90/g,' ◐').replace(/%E2%97%91/g,' ◑').replace(/%E2%97%92/g,' ◒').replace(/%E2%97%93/g,' ◓').replace(/%E2%97%94/g,' ◔').replace(/%E2%97%95/g,' ◕').replace(/%E2%97%96/g,' ◖').replace(/%E2%97%97/g,' ◗').replace(/%E2%97%98/g,' ◘').replace(/%E2%97%99/g,' ◙').replace(/%E2%97%9A/g,' ◚').replace(/%E2%97%9B/g,' ◛').replace(/%E2%97%9C/g,' ◜').replace(/%E2%97%9D/g,' ◝').replace(/%E2%97%9E/g,' ◞').replace(/%E2%97%9F/g,' ◟').replace(/%E2%97%A0/g,' ◠').replace(/%E2%97%A1/g,' ◡').replace(/%E2%97%A2/g,' ◢').replace(/%E2%97%A3/g,' ◣').replace(/%E2%97%A4/g,' ◤').replace(/%E2%97%A5/g,' ◥').replace(/%E2%97%A6/g,' ◦').replace(/%E2%97%A7/g,' ◧').replace(/%E2%97%A8/g,' ◨').replace(/%E2%97%A9/g,' ◩').replace(/%E2%97%AA/g,' ◪').replace(/%E2%97%AB/g,' ◫').replace(/%E2%97%AC/g,' ◬').replace(/%E2%97%AD/g,' ◭').replace(/%E2%97%AE/g,' ◮').replace(/%E2%97%AF/g,' ◯').replace(/%E2%97%B0/g,' ◰').replace(/%E2%97%B1/g,' ◱')
  .replace(/%E2%97%B2/g,' ◲').replace(/%E2%97%B3/g,' ◳').replace(/%E2%97%B4/g,' ◴').replace(/%E2%97%B5/g,' ◵').replace(/%E2%97%B6/g,' ◶').replace(/%E2%97%B7/g,' ◷').replace(/%E2%97%B8/g,' ◸').replace(/%E2%97%B9/g,' ◹').replace(/%E2%97%BA/g,' ◺').replace(/%E2%97%BB/g,' ◻').replace(/%E2%97%BC/g,' ◼').replace(/%E2%97%BD/g,' ◽').replace(/%E2%97%BE/g,' ◾').replace(/%E2%97%BF/g,' ◿')
  }

function whatsapp_posts1(AmazonMsg,Amznapi,Amznphoneid,Amznprodid){
	console.log("yes working");
	console.log("yes working1",AmazonMsg);
	console.log("yes working1",Amznapi);
	console.log("yes working3",Amznphoneid);
	console.log("yes working4",Amznprodid);
      let arrayGroupNumber = [
        {
          "name": "Amazon Offer Alert - 1🛍🛒🔥",
          "id": "916353594230-1570365608@g.us"
        },
        {
          "name": "Amazon Offer Alert - 2🛍🛒🔥",
          "id": "916353594230-1570379159@g.us"
        },
        {
          "name": "Amazon Offer Alert - 3🛍🛒🔥",
          "id": "916353594230-1570969831@g.us"
        },
        {
          "name": "Amazon Offer Alert - 4🛍🛒🔥",
          "id": "916353594230-1570971252@g.us"
        },
        {
          "name": "Amazon Offer Alert -5🛍🛒🔥",
          "id": "916353594230-1571493437@g.us"
        },
        {
          "name": "Amazon Offer Alert - 6🛍🛒🔥",
          "id": "916353594230-1571491746@g.us"
        },
        {
          "name": "Amazon Offer Alert - 7🛍🛒🔥",
          "id": "916353594230-1571491944@g.us"
        },
        {
          "name": "Amazon Offer Alert - 8🛍🛒🔥",
          "id": "916353594230-1571493106@g.us"
        },
        {
          "name": "Amazon Offer Alert - 9🛍🛒🔥",
          "id": "916353594230-1571493284@g.us"
        },
        {
          "name": "Amazon Offer Alert -10🛍🛒🔥",
          "id": "916353594230-1574959445@g.us"
        },
        {
          "name": "Amazon Offer Alert - 11🛍🛒🔥",
          "id": "916353594230-1574959195@g.us"
        },
        {
          "name": "Amazon Offer Alert - 12🛍🛒🔥",
          "id": "918160515625-1584094851@g.us"
        }
      ]
      // let arrayGroupNumber =[
      //           {
      //             "name": "Amazon Offer Alert - 1🛍🛒🔥",
      //             "id": "919163549116-1560880019@g.us"
      //           },
      //           {
      //             "name": "Amazon Offer Alert - 2🛍🛒🔥",
      //             "id": "918238154616-1498903589@g.us"
      //           }
      //         ]
      const months = ["🛍 ", "🛒 ", "🔥 ", "💰 ", "🛍️ ", "🤑 ", "🏷️ ", "💳 ", "🎟️ ","📦 ","😍 ","🕯 ","🍂 ","🎌 ","👑 ","🎊 ","🐦 ","⛄ "];
      const randomMonth = months[Math.floor(Math.random() * months.length)];
     
      for (let i = 0; i < arrayGroupNumber.length; i++) {
        var ggff = urlencodedd(AmazonMsg);
        if(ggff != 'null' && ggff != 'undefined' ){
        let requestHeaders1 = {
          "Content-Type": "application/json",
          "accept": "application/json",
          "x-maytapi-key": Amznapi
        }

        let linkRequest1 = {
          "to_number": arrayGroupNumber[i].id,
          "type": "text",
          "message": randomMonth + ggff
        }
        request({
          uri: "https://api.maytapi.com/api/" + Amznprodid + "/" + Amznphoneid + "/sendMessage",
          method: "POST",
          body: JSON.stringify(linkRequest1),
          headers: requestHeaders1
        }, (err, response, body) => {
          let link = JSON.parse(body);
        })
      }
    }
  }

function whatsapp_posts2(AmazonMsg,Amznapi,Amznphoneid,Amznprodid){
    let arrayGroupNumber = [
      {
        "name": "Amazon Offer Alert - 13🛍🛒🔥",
        "id": "916353594230-1584971104@g.us"
      },
      {
        "name": "Amazon Offer Alert - 14🛍🛒🔥",
        "id": "916353594230-1584971346@g.us"
      },
      {
        "name": "Amazon Offer Alert -15🛍🛒🔥",
        "id": "916353594230-1584971429@g.us"
      },
      {
        "name": "Amazon Offer Alert - 16🛍🛒🔥",
        "id": "916353594230-1584971505@g.us"
      },
      {
        "name": "Amazon Offer Alert - 17🛍🛒🔥",
        "id": "916353594230-1584971569@g.us"
      },
      {
        "name": "Amazon Offer Alert - 18🛍🛒🔥",
        "id": "916353594230-1584971645@g.us"
      },
      {
        "name": "Amazon Offer Alert - 19🛍🛒🔥",
        "id": "916353594230-1584971700@g.us"
      },
      {
        "name": "Amazon Offer Alert -20🛍🛒🔥",
        "id": "916353594230-1584971760@g.us"
      },
      {
        "name": "Amazon Offer Alert - 21🛍🛒🔥",
        "id": "916353594230-1585500064@g.us"
      },
      {
        "name": "Amazon Offer Alert - 22🛍🛒🔥",
        "id": "916353594230-1585500152@g.us"
      },
      {
        "name": "Amazon Offer Alert - 23🛍🛒🔥",
        "id": "916353594230-1585500294@g.us"
      },
      {
        "name": "Amazon Offer Alert - 24🛍🛒🔥",
        "id": "916353594230-1585500401@g.us"
      }
      ]
      const months = ["🛍 ", "🛒 ", "🔥 ", "💰 ", "🛍️ ", "🤑 ", "🏷️ ", "💳 ", "🎟️ ","📦 ","😍 ","🕯 ","🍂 ","🎌 ","👑 ","🎊 ","🐦 ","⛄ "];
      const randomMonth = months[Math.floor(Math.random() * months.length)];


      for (let i = 0; i < arrayGroupNumber.length; i++) {
        var ggff = urlencodedd(AmazonMsg);

        if(ggff != 'null' && ggff != 'undefined' ){
        let requestHeaders1 = {
          "Content-Type": "application/json",
          "accept": "application/json",
          "x-maytapi-key": Amznapi
        }

        let linkRequest1 = {
          "to_number": arrayGroupNumber[i].id,
          "type": "text",
          "message": randomMonth + ggff
        }
        request({
          uri: "https://api.maytapi.com/api/" + Amznprodid + "/" + Amznphoneid + "/sendMessage",
          method: "POST",
          body: JSON.stringify(linkRequest1),
          headers: requestHeaders1
        }, (err, response, body) => {
          let link = JSON.parse(body);
        })
      }
    }
  }
module.exports = router;



