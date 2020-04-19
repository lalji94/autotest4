var express = require('express');
var router = express.Router();
var async = require('async');
const { OperationHelper } = require('apac');
var nodeTelegramBotApi = require("node-telegram-bot-api");
let request = require("request");
var config = require('../config/global');
var connection = require('../config/connection');
const BitlyClient = require('bitly').BitlyClient;
const bitly = new BitlyClient('6050528e1d5594c2b447fe6b403f047c5f8e5dd6');
var tall = require('tall').default;

const axios = require('axios');
var textVersion = require("textversionjs");
const cheerio = require('cheerio')
var _ = require('underscore');
const opHelper = new OperationHelper({
  'awsId': 'AKIAJLFL6KDKK2CQOM3A',
  'awsSecret': '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',
  'assocId': 'kudrati-21',
  'locale': 'IN'
});
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/telegram_post', function (req, res, next) {
  async.waterfall([
    function (nextCall) {
      var token = '1012069743:AAHAQ-sDOZQW0Qvh3iCrRfmgI2oDTe1Cqqk';  // <= replace with yours
      var chatId = '@testchannel0112'; // <= replace with yours

      var savings = req.query.regularprice - req.query.sellprice;
      var savEPERCENT = Math.round(100 * savings / req.query.regularprice);

      var html = '🛍 ' + req.query.title + '\n\n' +
        '🚫 <b>M.R.P. : </b> ₹ ' + req.query.regularprice + '\n' +
        '♨️ <b style="background-color:red;">PRICE : </b> ₹ ' + req.query.sellprice + '\n' +
        '💰 <b>SAVINGS : </b> ₹ ' + savings + ' (' + savEPERCENT + '%)\n' +
        '🔗 <a href=' + req.query.productlink.text + '>' + req.query.productlink + '</a>\n' +
        '🚚 FREE Delivery\n\n' +
        'More Deals - @OnlyLooterJunction\n' +
        '🌐Website - <a href=' + req.query.productlink.text + '>' + req.query.productlink + '</a>\n';

      console.log('html: ', html);

      var buttons = [
        [
          // { "text": "➡️ ➡️ 🛒 BUY HERE 🛒 ⬅️ ⬅️", "url": req.query.productlink }
          { "text": "➡️ ➡️ 🛒 CLICK HERE TO BUY 🛒 ⬅️ ⬅️", "url": req.query.productlink }
        ]
      ];
      if (html) {
        bot = new nodeTelegramBotApi(token, { polling: true });
        bot.sendPhoto(chatId, req.query.imageurl, {
          caption: html,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          "reply_markup": {
            "inline_keyboard": buttons
          }
        });
        nextCall(null, req.query);
      }

    },
  ], function (err, response) {
    if (err) {
      return res.send({
        status: err.code ? err.code : 400,
        message: (err && err.msg) || "someyhing went wrong"
      });
    }
    return res.send({
      status_code: 200,
      message: "telegrame post create sucessfully",
      data: response
    });
  })
});

router.get('/telegram', function (req, res, next) {
  async.waterfall([
    function (nextCall) {

      let requestHeaders1 = {
        "Content-Type": "application/json",
        "apikey": "4cac33db1c9140a8a9dfd6fa9f4c3510",
        //  "workspace": "07757180185b4e3da431e5f902b704c1"

      }

      let linkRequest1 = {
        destination: "https://www.amazon.in/Trost-Bluetooth-Ear-Compatible-Smartphone/dp/B07WTLWYYB?SubscriptionId=AKIAJLFL6KDKK2CQOM3A&tag=kudrati-21&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B07WTLWYYB",
        domain: { fullName: "link.bestshoppingdeal.in" },
        "id": "07757180185b4e3da431e5f902b704c1",
        // Content-Type: "application/json",
        // apikey: "4cac33db1c9140a8a9dfd6fa9f4c3510",
        //, slashtag: "A_NEW_SLASHTAG"
        title: "amzn"
      }

      request({
        uri: "https://api.rebrandly.com/v1/links",
        method: "POST",
        body: JSON.stringify(linkRequest1),
        headers: requestHeaders1
      }, (err, response, body) => {
        let link = JSON.parse(body);
        nextCall(null, link);

        console.log(`Long URL was ${link.destination}, short URL is ${link.shortUrl}`);
      })
    },
  ], function (err, response) {
    if (err) {
      return res.send({
        status: err.code ? err.code : 400,
        message: (err && err.msg) || "someyhing went wrong"
      });
    }
    return res.send({
      status_code: 200,
      message: "telegrame post create sucessfully",
      data: response
    });
  })
});

router.get('/telegram_posts', function (req, res, next) {
  async.waterfall([
    function (nextCall) {
      var token = '1012069743:AAHAQ-sDOZQW0Qvh3iCrRfmgI2oDTe1Cqqk';  // <= replace with yours
      var chatId = '@' + req.query.chanel; // <= replace with yours


      // var html = '🛍' + req.query.title + '\n\n' +
      //   '<b>Now  @' + req.query.sellprice + 'Rs.</b>\n' +
      //   '<i>(Regular Price:' + req.query.regularprice + 'Rs.)</i>\n' +
      //   '<a href='+req.query.productlink+'>'+req.query.productlink+'</a>\n';
      var savings = req.query.regularprice - req.query.sellprice;
      var savEPERCENT = Math.round(100 * savings / req.query.regularprice);

      var html = '🛍 ' + req.query.title + '\n\n' +
        '🚫 <b>M.R.P. : </b> ₹ ' + req.query.regularprice + '\n' +
        '♨️ <b style="background-color:red;">PRICE : </b> ₹ ' + req.query.sellprice + '\n' +
        '💰 <b>SAVINGS : </b> ₹ ' + savings + ' (' + savEPERCENT + '%)\n' +
        '🔗 <a href=' + req.query.productlink.text + '>' + req.query.productlink + '</a>\n' +
        '🚚 FREE Delivery\n\n' +
        // '👉 More Deals - <a href= @' + req.query.chanel + '> @' + req.query.chanel+'</a>\n'+
        // '👉 More Deals - @' + req.query.chanel;
        '👉 <a href="https://t.me/bestshoppingdeal00"> Join US for More Deals </a>\n';
      // +'\n'+
      // '🌐 Website - <a href=' + req.query.website.text + '>' + req.query.website + '</a>';


      // var html = 'Visko Tools 802 Home Tool Kit (3 Pieces)\n\n'+
      // '<b>Now  @ 116 Rs.</b>\n'+
      // '<i>(Regular Price: 216 Rs.)</i>\n'+
      // '<a href="https://amzn.to/2NCz4q0">https://amzn.to/2NCz4q0</a>\n';

      var buttons = [
        [
          // { "text": "➡️ ➡️ 🛒 BUY HERE 🛒 ⬅️ ⬅️", "url": req.query.productlink }
          { "text": "➡️ ➡️ 🛒 CLICK HERE TO BUY 🛒 ⬅️ ⬅️", "url": req.query.productlink }
        ]
      ];
      if (html) {
        bot = new nodeTelegramBotApi(token, { polling: true });
        bot.sendPhoto(chatId, req.query.imageurl, {
          caption: html,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          "reply_markup": {
            "inline_keyboard": buttons
          }
        });
        nextCall(null, req.query);
      }

    },
  ], function (err, response) {
    if (err) {
      return res.send({
        status: err.code ? err.code : 400,
        message: (err && err.msg) || "someyhing went wrong"
      });
    }
    return res.send({
      status_code: 200,
      message: "telegrame post create sucessfully",
      data: response
    });
  })
});

router.get('/telegram_postss', function (req, res, next) {
  async.waterfall([
    function (nextCall) {
      opHelper.execute('ItemSearch', {
        'SearchIndex': 'All',
        'Keywords': req.query.asin,
        // 'ASIN': 'B07W184FS2',
        'ItemPage': '1',
        'ResponseGroup': 'ItemAttributes,Offers,OfferFull,Reviews,SearchBins,SalesRank,Images,Tracks,OfferListings,PromotionSummary,PromotionalTag,EditorialReview,VariationOffers,Variations'
      }).then((response) => {
        let productUrl = response.result.ItemSearchResponse.Items.Item[0].DetailPageURL ? response.result.ItemSearchResponse.Items.Item[0].DetailPageURL : response.result.ItemSearchResponse.Items.MoreSearchResultsUrl;
        // let finalProductUrl = 'https://api.rebrandly.com/v1/links/new?Content-Type=application/json&apikey=4cac33db1c9140a8a9dfd6fa9f4c3510&destination=' + productUrl + '%2F&title=amzn&domain%5Bid%5D=07757180185b4e3da431e5f902b704c1&domain%5BfullName%5D=link.bestshoppingdeal.in';

        // console.log('response: ', response);
        // res.send(finalProductUrl)
        // debugger;
        // https://api.rebrandly.com/v1/links/
        // new?Content-Type=application/json&
        // apikey=4cac33db1c9140a8a9dfd6fa9f4c3510&destination=DESTINATION_LINK%2F
        // &title=amzn&domain%5Bid%5D=07757180185b4e3da431e5f902b704c1
        // &domain%5BfullName%5D=link.bestshoppingdeal.in

        nextCall(null, productUrl);
      }).catch((err) => {
        console.error("Something went wrong! ", err);
      })
    },
    function (body, nextCall) {


      let requestHeaders1 = {
        "Content-Type": "application/json",
        "apikey": "4cac33db1c9140a8a9dfd6fa9f4c3510",
        //  "workspace": "07757180185b4e3da431e5f902b704c1"

      }

      let linkRequest1 = {
        destination: body,
        domain: { fullName: "link.bestshoppingdeal.in" },
        "id": "07757180185b4e3da431e5f902b704c1",
        // Content-Type: "application/json",
        // apikey: "4cac33db1c9140a8a9dfd6fa9f4c3510",
        //, slashtag: "A_NEW_SLASHTAG"
        title: "amzn"
      }

      request({
        uri: "https://api.rebrandly.com/v1/links",
        method: "POST",
        body: JSON.stringify(linkRequest1),
        headers: requestHeaders1
      }, (err, response, body) => {
        let link = JSON.parse(body);
        // let postLink = link.shortUrl;
        // res.send(link.shortUrl);
        // debugger;
        nextCall(null, link.shortUrl);
      })

    },
    function (postLink, nextCall) {
      var token = '1012069743:AAHAQ-sDOZQW0Qvh3iCrRfmgI2oDTe1Cqqk';  // <= replace with yours
      var chatId = '@' + req.query.chanel; // <= replace with yours
      var savings = req.query.regularprice - req.query.sellprice;
      var savEPERCENT = Math.round(100 * savings / req.query.regularprice);

      var html = '🛍 ' + req.query.title + '\n\n' +
        '🚫 <b>M.R.P. : </b> ₹ ' + req.query.regularprice + '\n' +
        '♨️ <b style="background-color:red;">PRICE : </b> ₹ ' + req.query.sellprice + '\n' +
        '💰 <b>SAVINGS : </b> ₹ ' + savings + ' (' + savEPERCENT + '%)\n' +
        '🔗 <a href=' + postLink.text + '>' + postLink + '</a>\n' +
        // '🔗 <a href=' + postLink + '>' + postLink + '</a>\n' +
        '🚚 FREE Delivery\n\n' +
        // // '👉 More Deals - <a href= @' + req.query.chanel + '> @' + req.query.chanel+'</a>\n'+
        '👉 <a href="https://t.me/bestshoppingdeal00"> Join US for More Deals </a>\n';
      // '🌐 Website - <a href=' + req.query.website.text + '>' + req.query.website + '</a>';

      var buttons = [
        [
          { "text": "➡️ ➡️ 🛒 CLICK HERE TO BUY 🛒 ⬅️ ⬅️", "url": req.query.productlink }
        ]
      ];
      if (html) {
        bot = new nodeTelegramBotApi(token, { polling: true });
        bot.sendPhoto(chatId, req.query.imageurl, {
          caption: html,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          "reply_markup": {
            "inline_keyboard": buttons
          }
        });
        nextCall(null, req.query);
      }

    },
  ], function (err, response) {
    if (err) {
      return res.send({
        status: err.code ? err.code : 400,
        message: (err && err.msg) || "someyhing went wrong"
      });
    }
    return res.send({
      status_code: 200,
      message: "telegrame post create sucessfully",
      data: response
    });
  })
});

// setInterval( function (req, res, next) {
//   async.waterfall([
  setInterval( function setup() {
      axios('https://t.me/s/IHDBroadcast')
        .then(response => {
          var html = response.data;
          var $ = cheerio.load(html);
          var matchObj = [];

          $('.tgme_widget_message_wrap').each((i, el) => {
            var linkss = $(el).find('.tgme_widget_message_footer').find('a').attr('href').split('/');
            var link = textVersion($(el).find('.tgme_widget_message_text').html());
            matchObj.push({ id: Number(linkss[4]), text_data: emmoji(link) })
          });

          function emmoji(string) {
            return string.replace(/\([^()]*\)/g, '').replace(/&apos;/g," '").replace(/&#x20B9;/g,' %E2%82%B9').replace(/&#x269C;/g,' %E2%9A%9C').replace(/&#x1F91D;/g,'%F0%9F%8E%B8').replace(/&amp;/g, " &").replace(/&gt;/g, " >").replace(/&lt;/g, " <").replace(/&quot;/g, "  ").replace(/&#x00A9;/g,'%C2%A9').replace(/&#x00AE;/g,'%C2%AE').replace(/&#x1F004;/g,'%F0%9F%80%84').replace(/&#x1F0CF;/g,'%F0%9F%83%8F').replace(/&#x1F170;/g,'%F0%9F%85%B0').replace(/&#x1F171;/g,'%F0%9F%85%B1').replace(/&#x1F17E;/g,'%F0%9F%85%BE').replace(/&#x1F17F;/g,'%F0%9F%85%BF').replace(/&#x1F18E;/g,'%F0%9F%86%8E').replace(/&#x1F191;/g,'%F0%9F%86%91').replace(/&#x1F192;/g,'%F0%9F%86%92').replace(/&#x1F193;/g,'%F0%9F%86%93').replace(/&#x1F194;/g,'%F0%9F%86%94').replace(/&#x1F195;/g,'%F0%9F%86%95').replace(/&#x1F196;/g,'%F0%9F%86%96').replace(/&#x1F197;/g,'%F0%9F%86%97').replace(/&#x1F198;/g,'%F0%9F%86%98').replace(/&#x1F199;/g,'%F0%9F%86%99').replace(/&#x1F19A;/g,'%F0%9F%86%9A').replace(/&#x1F201;/g,'%F0%9F%88%81').replace(/&#x1F202;/g,'%F0%9F%88%82').replace(/&#x1F21A;/g,'%F0%9F%88%9A').replace(/&#x1F22F;/g,'%F0%9F%88%AF').replace(/&#x1F232;/g,'%F0%9F%88%B2').replace(/&#x1F233;/g,'%F0%9F%88%B3').replace(/&#x1F234;/g,'%F0%9F%88%B4').replace(/&#x1F235;/g,'%F0%9F%88%B5').replace(/&#x1F236;/g,'%F0%9F%88%B6').replace(/&#x1F237;/g,'%F0%9F%88%B7').replace(/&#x1F238;/g,'%F0%9F%88%B8').replace(/&#x1F239;/g,'%F0%9F%88%B9').replace(/&#x1F23A;/g,'%F0%9F%88%BA').replace(/&#x1F250;/g,'%F0%9F%89%90').replace(/&#x1F251;/g,'%F0%9F%89%91').replace(/&#x1F300;/g,'%F0%9F%8C%80').replace(/&#x1F301;/g,'%F0%9F%8C%81').replace(/&#x1F302;/g,'%F0%9F%8C%82').replace(/&#x1F303;/g,'%F0%9F%8C%83').replace(/&#x1F304;/g,'%F0%9F%8C%84').replace(/&#x1F305;/g,'%F0%9F%8C%85').replace(/&#x1F306;/g,'%F0%9F%8C%86').replace(/&#x1F307;/g,'%F0%9F%8C%87').replace(/&#x1F308;/g,'%F0%9F%8C%88').replace(/&#x1F309;/g,'%F0%9F%8C%89').replace(/&#x1F30A;/g,'%F0%9F%8C%8A').replace(/&#x1F30B;/g,'%F0%9F%8C%8B').replace(/&#x1F30C;/g,'%F0%9F%8C%8C').replace(/&#x1F30D;/g,'%F0%9F%8C%8D').replace(/&#x1F30E;/g,'%F0%9F%8C%8E').replace(/&#x1F30F;/g,'%F0%9F%8C%8F').replace(/&#x1F310;/g,'%F0%9F%8C%90').replace(/&#x1F311;/g,'%F0%9F%8C%91').replace(/&#x1F312;/g,'%F0%9F%8C%92').replace(/&#x1F313;/g,'%F0%9F%8C%93').replace(/&#x1F314;/g,'%F0%9F%8C%94').replace(/&#x1F315;/g,'%F0%9F%8C%95').replace(/&#x1F316;/g,'%F0%9F%8C%96').replace(/&#x1F317;/g,'%F0%9F%8C%97').replace(/&#x1F318;/g,'%F0%9F%8C%98').replace(/&#x1F319;/g,'%F0%9F%8C%99').replace(/&#x1F31A;/g,'%F0%9F%8C%9A').replace(/&#x1F31B;/g,'%F0%9F%8C%9B').replace(/&#x1F31C;/g,'%F0%9F%8C%9C').replace(/&#x1F31D;/g,'%F0%9F%8C%9D').replace(/&#x1F31E;/g,'%F0%9F%8C%9E').replace(/&#x1F31F;/g,'%F0%9F%8C%9F').replace(/&#x1F320;/g,'%F0%9F%8C%A0').replace(/&#x1F330;/g,'%F0%9F%8C%B0').replace(/&#x1F331;/g,'%F0%9F%8C%B1').replace(/&#x1F332;/g,'%F0%9F%8C%B2').replace(/&#x1F333;/g,'%F0%9F%8C%B3').replace(/&#x1F334;/g,'%F0%9F%8C%B4').replace(/&#x1F335;/g,'%F0%9F%8C%B5').replace(/&#x1F337;/g,'%F0%9F%8C%B7').replace(/&#x1F338;/g,'%F0%9F%8C%B8').replace(/&#x1F339;/g,'%F0%9F%8C%B9').replace(/&#x1F33A;/g,'%F0%9F%8C%BA').replace(/&#x1F33B;/g,'%F0%9F%8C%BB').replace(/&#x1F33C;/g,'%F0%9F%8C%BC').replace(/&#x1F33D;/g,'%F0%9F%8C%BD').replace(/&#x1F33E;/g,'%F0%9F%8C%BE').replace(/&#x1F33F;/g,'%F0%9F%8C%BF').replace(/&#x1F340;/g,'%F0%9F%8D%80').replace(/&#x1F341;/g,'%F0%9F%8D%81').replace(/&#x1F342;/g,'%F0%9F%8D%82').replace(/&#x1F343;/g,'%F0%9F%8D%83').replace(/&#x1F344;/g,'%F0%9F%8D%84').replace(/&#x1F345;/g,'%F0%9F%8D%85').replace(/&#x1F346;/g,'%F0%9F%8D%86').replace(/&#x1F347;/g,'%F0%9F%8D%87').replace(/&#x1F348;/g,'%F0%9F%8D%88').replace(/&#x1F349;/g,'%F0%9F%8D%89').replace(/&#x1F34A;/g,'%F0%9F%8D%8A').replace(/&#x1F34B;/g,'%F0%9F%8D%8B').replace(/&#x1F34C;/g,'%F0%9F%8D%8C').replace(/&#x1F34D;/g,'%F0%9F%8D%8D').replace(/&#x1F34E;/g,'%F0%9F%8D%8E').replace(/&#x1F34F;/g,'%F0%9F%8D%8F').replace(/&#x1F350;/g,'%F0%9F%8D%90').replace(/&#x1F351;/g,'%F0%9F%8D%91').replace(/&#x1F352;/g,'%F0%9F%8D%92').replace(/&#x1F353;/g,'%F0%9F%8D%93').replace(/&#x1F354;/g,'%F0%9F%8D%94').replace(/&#x1F355;/g,'%F0%9F%8D%95').replace(/&#x1F356;/g,'%F0%9F%8D%96').replace(/&#x1F357;/g,'%F0%9F%8D%97').replace(/&#x1F358;/g,'%F0%9F%8D%98').replace(/&#x1F359;/g,'%F0%9F%8D%99').replace(/&#x1F35A;/g,'%F0%9F%8D%9A').replace(/&#x1F35B;/g,'%F0%9F%8D%9B').replace(/&#x1F35C;/g,'%F0%9F%8D%9C').replace(/&#x1F35D;/g,'%F0%9F%8D%9D').replace(/&#x1F35E;/g,'%F0%9F%8D%9E').replace(/&#x1F35F;/g,'%F0%9F%8D%9F').replace(/&#x1F360;/g,'%F0%9F%8D%A0').replace(/&#x1F361;/g,'%F0%9F%8D%A1').replace(/&#x1F362;/g,'%F0%9F%8D%A2').replace(/&#x1F363;/g,'%F0%9F%8D%A3').replace(/&#x1F364;/g,'%F0%9F%8D%A4').replace(/&#x1F365;/g,'%F0%9F%8D%A5').replace(/&#x1F366;/g,'%F0%9F%8D%A6').replace(/&#x1F367;/g,'%F0%9F%8D%A7').replace(/&#x1F368;/g,'%F0%9F%8D%A8').replace(/&#x1F369;/g,'%F0%9F%8D%A9').replace(/&#x1F36A;/g,'%F0%9F%8D%AA').replace(/&#x1F36B;/g,'%F0%9F%8D%AB').replace(/&#x1F36C;/g,'%F0%9F%8D%AC').replace(/&#x1F36D;/g,'%F0%9F%8D%AD').replace(/&#x1F36E;/g,'%F0%9F%8D%AE').replace(/&#x1F36F;/g,'%F0%9F%8D%AF').replace(/&#x1F370;/g,'%F0%9F%8D%B0').replace(/&#x1F371;/g,'%F0%9F%8D%B1').replace(/&#x1F372;/g,'%F0%9F%8D%B2').replace(/&#x1F373;/g,'%F0%9F%8D%B3').replace(/&#x1F374;/g,'%F0%9F%8D%B4').replace(/&#x1F375;/g,'%F0%9F%8D%B5').replace(/&#x1F376;/g,'%F0%9F%8D%B6').replace(/&#x1F377;/g,'%F0%9F%8D%B7').replace(/&#x1F378;/g,'%F0%9F%8D%B8').replace(/&#x1F379;/g,'%F0%9F%8D%B9').replace(/&#x1F37A;/g,'%F0%9F%8D%BA').replace(/&#x1F37B;/g,'%F0%9F%8D%BB').replace(/&#x1F37C;/g,'%F0%9F%8D%BC').replace(/&#x1F380;/g,'%F0%9F%8E%80').replace(/&#x1F381;/g,'%F0%9F%8E%81').replace(/&#x1F382;/g,'%F0%9F%8E%82').replace(/&#x1F383;/g,'%F0%9F%8E%83').replace(/&#x1F384;/g,'%F0%9F%8E%84').replace(/&#x1F385;/g,'%F0%9F%8E%85').replace(/&#x1F386;/g,'%F0%9F%8E%86').replace(/&#x1F387;/g,'%F0%9F%8E%87').replace(/&#x1F388;/g,'%F0%9F%8E%88').replace(/&#x1F389;/g,'%F0%9F%8E%89').replace(/&#x1F38A;/g,'%F0%9F%8E%8A').replace(/&#x1F38B;/g,'%F0%9F%8E%8B').replace(/&#x1F38C;/g,'%F0%9F%8E%8C').replace(/&#x1F38D;/g,'%F0%9F%8E%8D').replace(/&#x1F38E;/g,'%F0%9F%8E%8E').replace(/&#x1F38F;/g,'%F0%9F%8E%8F').replace(/&#x1F390;/g,'%F0%9F%8E%90').replace(/&#x1F391;/g,'%F0%9F%8E%91').replace(/&#x1F392;/g,'%F0%9F%8E%92').replace(/&#x1F393;/g,'%F0%9F%8E%93').replace(/&#x1F3A0;/g,'%F0%9F%8E%A0').replace(/&#x1F3A1;/g,'%F0%9F%8E%A1').replace(/&#x1F3A2;/g,'%F0%9F%8E%A2').replace(/&#x1F3A3;/g,'%F0%9F%8E%A3').replace(/&#x1F3A4;/g,'%F0%9F%8E%A4').replace(/&#x1F3A5;/g,'%F0%9F%8E%A5').replace(/&#x1F3A6;/g,'%F0%9F%8E%A6').replace(/&#x1F3A7;/g,'%F0%9F%8E%A7').replace(/&#x1F3A8;/g,'%F0%9F%8E%A8').replace(/&#x1F3A9;/g,'%F0%9F%8E%A9').replace(/&#x1F3AA;/g,'%F0%9F%8E%AA').replace(/&#x1F3AB;/g,'%F0%9F%8E%AB').replace(/&#x1F3AC;/g,'%F0%9F%8E%AC').replace(/&#x1F3AD;/g,'%F0%9F%8E%AD').replace(/&#x1F3AE;/g,'%F0%9F%8E%AE').replace(/&#x1F3AF;/g,'%F0%9F%8E%AF').replace(/&#x1F3B0;/g,'%F0%9F%8E%B0').replace(/&#x1F3B1;/g,'%F0%9F%8E%B1').replace(/&#x1F3B2;/g,'%F0%9F%8E%B2').replace(/&#x1F3B3;/g,'%F0%9F%8E%B3').replace(/&#x1F3B4;/g,'%F0%9F%8E%B4').replace(/&#x1F3B5;/g,'%F0%9F%8E%B5').replace(/&#x1F3B6;/g,'%F0%9F%8E%B6').replace(/&#x1F3B7;/g,'%F0%9F%8E%B7')
          .replace(/&#x1F3B8;/g,'%F0%9F%8E%B8').replace(/&#x1F3B9;/g,'%F0%9F%8E%B9').replace(/&#x1F3BA;/g,'%F0%9F%8E%BA').replace(/&#x1F3BB;/g,'%F0%9F%8E%BB').replace(/&#x1F3BC;/g,'%F0%9F%8E%BC').replace(/&#x1F3BD;/g,'%F0%9F%8E%BD').replace(/&#x1F3BE;/g,'%F0%9F%8E%BE').replace(/&#x1F3BF;/g,'%F0%9F%8E%BF').replace(/&#x1F3C0;/g,'%F0%9F%8F%80').replace(/&#x1F3C1;/g,'%F0%9F%8F%81').replace(/&#x1F3C2;/g,'%F0%9F%8F%82').replace(/&#x1F3C3;/g,'%F0%9F%8F%83').replace(/&#x1F3C4;/g,'%F0%9F%8F%84').replace(/&#x1F3C6;/g,'%F0%9F%8F%86').replace(/&#x1F3C7;/g,'%F0%9F%8F%87').replace(/&#x1F3C8;/g,'%F0%9F%8F%88').replace(/&#x1F3C9;/g,'%F0%9F%8F%89').replace(/&#x1F3CA;/g,'%F0%9F%8F%8A').replace(/&#x1F3E0;/g,'%F0%9F%8F%A0').replace(/&#x1F3E1;/g,'%F0%9F%8F%A1').replace(/&#x1F3E2;/g,'%F0%9F%8F%A2').replace(/&#x1F3E3;/g,'%F0%9F%8F%A3').replace(/&#x1F3E4;/g,'%F0%9F%8F%A4').replace(/&#x1F3E5;/g,'%F0%9F%8F%A5').replace(/&#x1F3E6;/g,'%F0%9F%8F%A6').replace(/&#x1F3E7;/g,'%F0%9F%8F%A7').replace(/&#x1F3E8;/g,'%F0%9F%8F%A8').replace(/&#x1F3E9;/g,'%F0%9F%8F%A9').replace(/&#x1F3EA;/g,'%F0%9F%8F%AA').replace(/&#x1F3EB;/g,'%F0%9F%8F%AB').replace(/&#x1F3EC;/g,'%F0%9F%8F%AC').replace(/&#x1F3ED;/g,'%F0%9F%8F%AD').replace(/&#x1F3EE;/g,'%F0%9F%8F%AE').replace(/&#x1F3EF;/g,'%F0%9F%8F%AF').replace(/&#x1F3F0;/g,'%F0%9F%8F%B0').replace(/&#x1F400;/g,'%F0%9F%90%80').replace(/&#x1F401;/g,'%F0%9F%90%81').replace(/&#x1F402;/g,'%F0%9F%90%82').replace(/&#x1F403;/g,'%F0%9F%90%83').replace(/&#x1F404;/g,'%F0%9F%90%84').replace(/&#x1F405;/g,'%F0%9F%90%85').replace(/&#x1F406;/g,'%F0%9F%90%86').replace(/&#x1F407;/g,'%F0%9F%90%87').replace(/&#x1F408;/g,'%F0%9F%90%88').replace(/&#x1F409;/g,'%F0%9F%90%89').replace(/&#x1F40A;/g,'%F0%9F%90%8A').replace(/&#x1F40B;/g,'%F0%9F%90%8B').replace(/&#x1F40C;/g,'%F0%9F%90%8C').replace(/&#x1F40D;/g,'%F0%9F%90%8D').replace(/&#x1F40E;/g,'%F0%9F%90%8E').replace(/&#x1F40F;/g,'%F0%9F%90%8F').replace(/&#x1F410;/g,'%F0%9F%90%90').replace(/&#x1F411;/g,'%F0%9F%90%91').replace(/&#x1F412;/g,'%F0%9F%90%92').replace(/&#x1F413;/g,'%F0%9F%90%93').replace(/&#x1F414;/g,'%F0%9F%90%94').replace(/&#x1F415;/g,'%F0%9F%90%95').replace(/&#x1F416;/g,'%F0%9F%90%96').replace(/&#x1F417;/g,'%F0%9F%90%97').replace(/&#x1F418;/g,'%F0%9F%90%98').replace(/&#x1F419;/g,'%F0%9F%90%99').replace(/&#x1F41A;/g,'%F0%9F%90%9A').replace(/&#x1F41B;/g,'%F0%9F%90%9B').replace(/&#x1F41C;/g,'%F0%9F%90%9C').replace(/&#x1F41D;/g,'%F0%9F%90%9D').replace(/&#x1F41E;/g,'%F0%9F%90%9E').replace(/&#x1F41F;/g,'%F0%9F%90%9F').replace(/&#x1F420;/g,'%F0%9F%90%A0').replace(/&#x1F421;/g,'%F0%9F%90%A1').replace(/&#x1F422;/g,'%F0%9F%90%A2').replace(/&#x1F423;/g,'%F0%9F%90%A3').replace(/&#x1F424;/g,'%F0%9F%90%A4').replace(/&#x1F425;/g,'%F0%9F%90%A5').replace(/&#x1F426;/g,'%F0%9F%90%A6').replace(/&#x1F427;/g,'%F0%9F%90%A7').replace(/&#x1F428;/g,'%F0%9F%90%A8').replace(/&#x1F429;/g,'%F0%9F%90%A9').replace(/&#x1F42A;/g,'%F0%9F%90%AA').replace(/&#x1F42B;/g,'%F0%9F%90%AB').replace(/&#x1F42C;/g,'%F0%9F%90%AC').replace(/&#x1F42D;/g,'%F0%9F%90%AD').replace(/&#x1F42E;/g,'%F0%9F%90%AE').replace(/&#x1F42F;/g,'%F0%9F%90%AF').replace(/&#x1F430;/g,'%F0%9F%90%B0').replace(/&#x1F431;/g,'%F0%9F%90%B1').replace(/&#x1F432;/g,'%F0%9F%90%B2').replace(/&#x1F433;/g,'%F0%9F%90%B3').replace(/&#x1F434;/g,'%F0%9F%90%B4').replace(/&#x1F435;/g,'%F0%9F%90%B5').replace(/&#x1F436;/g,'%F0%9F%90%B6').replace(/&#x1F437;/g,'%F0%9F%90%B7').replace(/&#x1F438;/g,'%F0%9F%90%B8').replace(/&#x1F439;/g,'%F0%9F%90%B9').replace(/&#x1F43A;/g,'%F0%9F%90%BA').replace(/&#x1F43B;/g,'%F0%9F%90%BB').replace(/&#x1F43C;/g,'%F0%9F%90%BC').replace(/&#x1F43D;/g,'%F0%9F%90%BD').replace(/&#x1F43E;/g,'%F0%9F%90%BE').replace(/&#x1F440;/g,'%F0%9F%91%80').replace(/&#x1F442;/g,'%F0%9F%91%82').replace(/&#x1F443;/g,'%F0%9F%91%83').replace(/&#x1F444;/g,'%F0%9F%91%84').replace(/&#x1F445;/g,'%F0%9F%91%85').replace(/&#x1F446;/g,'%F0%9F%91%86').replace(/&#x1F447;/g,'%F0%9F%91%87').replace(/&#x1F448;/g,'%F0%9F%91%88').replace(/&#x1F449;/g,'%F0%9F%91%89').replace(/&#x1F44A;/g,'%F0%9F%91%8A').replace(/&#x1F44B;/g,'%F0%9F%91%8B').replace(/&#x1F44C;/g,'%F0%9F%91%8C').replace(/&#x1F44D;/g,'%F0%9F%91%8D').replace(/&#x1F44E;/g,'%F0%9F%91%8E').replace(/&#x1F44F;/g,'%F0%9F%91%8F').replace(/&#x1F450;/g,'%F0%9F%91%90').replace(/&#x1F451;/g,'%F0%9F%91%91').replace(/&#x1F452;/g,'%F0%9F%91%92').replace(/&#x1F453;/g,'%F0%9F%91%93').replace(/&#x1F454;/g,'%F0%9F%91%94').replace(/&#x1F455;/g,'%F0%9F%91%95').replace(/&#x1F456;/g,'%F0%9F%91%96').replace(/&#x1F457;/g,'%F0%9F%91%97').replace(/&#x1F458;/g,'%F0%9F%91%98').replace(/&#x1F459;/g,'%F0%9F%91%99').replace(/&#x1F45A;/g,'%F0%9F%91%9A').replace(/&#x1F45B;/g,'%F0%9F%91%9B').replace(/&#x1F45C;/g,'%F0%9F%91%9C').replace(/&#x1F45D;/g,'%F0%9F%91%9D').replace(/&#x1F45E;/g,'%F0%9F%91%9E').replace(/&#x1F45F;/g,'%F0%9F%91%9F').replace(/&#x1F460;/g,'%F0%9F%91%A0').replace(/&#x1F461;/g,'%F0%9F%91%A1').replace(/&#x1F462;/g,'%F0%9F%91%A2').replace(/&#x1F463;/g,'%F0%9F%91%A3').replace(/&#x1F464;/g,'%F0%9F%91%A4').replace(/&#x1F465;/g,'%F0%9F%91%A5').replace(/&#x1F466;/g,'%F0%9F%91%A6').replace(/&#x1F467;/g,'%F0%9F%91%A7').replace(/&#x1F468;/g,'%F0%9F%91%A8').replace(/&#x1F469;/g,'%F0%9F%91%A9').replace(/&#x1F46A;/g,'%F0%9F%91%AA').replace(/&#x1F46B;/g,'%F0%9F%91%AB').replace(/&#x1F46C;/g,'%F0%9F%91%AC').replace(/&#x1F46D;/g,'%F0%9F%91%AD').replace(/&#x1F46E;/g,'%F0%9F%91%AE').replace(/&#x1F46F;/g,'%F0%9F%91%AF').replace(/&#x1F470;/g,'%F0%9F%91%B0').replace(/&#x1F471;/g,'%F0%9F%91%B1').replace(/&#x1F472;/g,'%F0%9F%91%B2').replace(/&#x1F473;/g,'%F0%9F%91%B3').replace(/&#x1F474;/g,'%F0%9F%91%B4').replace(/&#x1F475;/g,'%F0%9F%91%B5').replace(/&#x1F476;/g,'%F0%9F%91%B6').replace(/&#x1F477;/g,'%F0%9F%91%B7').replace(/&#x1F478;/g,'%F0%9F%91%B8').replace(/&#x1F479;/g,'%F0%9F%91%B9').replace(/&#x1F47A;/g,'%F0%9F%91%BA').replace(/&#x1F47B;/g,'%F0%9F%91%BB').replace(/&#x1F47C;/g,'%F0%9F%91%BC').replace(/&#x1F47D;/g,'%F0%9F%91%BD').replace(/&#x1F47E;/g,'%F0%9F%91%BE').replace(/&#x1F47F;/g,'%F0%9F%91%BF').replace(/&#x1F480;/g,'%F0%9F%92%80').replace(/&#x1F481;/g,'%F0%9F%92%81').replace(/&#x1F482;/g,'%F0%9F%92%82').replace(/&#x1F483;/g,'%F0%9F%92%83').replace(/&#x1F484;/g,'%F0%9F%92%84').replace(/&#x1F485;/g,'%F0%9F%92%85').replace(/&#x1F486;/g,'%F0%9F%92%86').replace(/&#x1F487;/g,'%F0%9F%92%87').replace(/&#x1F488;/g,'%F0%9F%92%88').replace(/&#x1F489;/g,'%F0%9F%92%89').replace(/&#x1F48A;/g,'%F0%9F%92%8A').replace(/&#x1F48B;/g,'%F0%9F%92%8B').replace(/&#x1F48C;/g,'%F0%9F%92%8C').replace(/&#x1F48D;/g,'%F0%9F%92%8D').replace(/&#x1F48E;/g,'%F0%9F%92%8E').replace(/&#x1F48F;/g,'%F0%9F%92%8F').replace(/&#x1F490;/g,'%F0%9F%92%90').replace(/&#x1F491;/g,'%F0%9F%92%91').replace(/&#x1F492;/g,'%F0%9F%92%92').replace(/&#x1F493;/g,'%F0%9F%92%93').replace(/&#x1F494;/g,'%F0%9F%92%94').replace(/&#x1F495;/g,'%F0%9F%92%95').replace(/&#x1F496;/g,'%F0%9F%92%96').replace(/&#x1F497;/g,'%F0%9F%92%97').replace(/&#x1F498;/g,'%F0%9F%92%98').replace(/&#x1F499;/g,'%F0%9F%92%99').replace(/&#x1F49A;/g,'%F0%9F%92%9A')
          .replace(/&#x1F49B;/g,'%F0%9F%92%9B').replace(/&#x1F49C;/g,'%F0%9F%92%9C').replace(/&#x1F49D;/g,'%F0%9F%92%9D').replace(/&#x1F49E;/g,'%F0%9F%92%9E').replace(/&#x1F49F;/g,'%F0%9F%92%9F').replace(/&#x1F4A0;/g,'%F0%9F%92%A0').replace(/&#x1F4A1;/g,'%F0%9F%92%A1').replace(/&#x1F4A2;/g,'%F0%9F%92%A2').replace(/&#x1F4A3;/g,'%F0%9F%92%A3').replace(/&#x1F4A4;/g,'%F0%9F%92%A4').replace(/&#x1F4A5;/g,'%F0%9F%92%A5').replace(/&#x1F4A6;/g,'%F0%9F%92%A6').replace(/&#x1F4A7;/g,'%F0%9F%92%A7').replace(/&#x1F4A8;/g,'%F0%9F%92%A8').replace(/&#x1F4A9;/g,'%F0%9F%92%A9').replace(/&#x1F4AA;/g,'%F0%9F%92%AA').replace(/&#x1F4AB;/g,'%F0%9F%92%AB').replace(/&#x1F4AC;/g,'%F0%9F%92%AC').replace(/&#x1F4AD;/g,'%F0%9F%92%AD').replace(/&#x1F4AE;/g,'%F0%9F%92%AE').replace(/&#x1F4AF;/g,'%F0%9F%92%AF').replace(/&#x1F4B0;/g,'%F0%9F%92%B0').replace(/&#x1F4B1;/g,'%F0%9F%92%B1').replace(/&#x1F4B2;/g,'%F0%9F%92%B2').replace(/&#x1F4B3;/g,'%F0%9F%92%B3').replace(/&#x1F4B4;/g,'%F0%9F%92%B4').replace(/&#x1F4B5;/g,'%F0%9F%92%B5').replace(/&#x1F4B6;/g,'%F0%9F%92%B6').replace(/&#x1F4B7;/g,'%F0%9F%92%B7').replace(/&#x1F4B8;/g,'%F0%9F%92%B8').replace(/&#x1F4B9;/g,'%F0%9F%92%B9').replace(/&#x1F4BA;/g,'%F0%9F%92%BA').replace(/&#x1F4BB;/g,'%F0%9F%92%BB').replace(/&#x1F4BC;/g,'%F0%9F%92%BC').replace(/&#x1F4BD;/g,'%F0%9F%92%BD').replace(/&#x1F4BE;/g,'%F0%9F%92%BE').replace(/&#x1F4BF;/g,'%F0%9F%92%BF').replace(/&#x1F4C0;/g,'%F0%9F%93%80').replace(/&#x1F4C1;/g,'%F0%9F%93%81').replace(/&#x1F4C2;/g,'%F0%9F%93%82').replace(/&#x1F4C3;/g,'%F0%9F%93%83').replace(/&#x1F4C4;/g,'%F0%9F%93%84').replace(/&#x1F4C5;/g,'%F0%9F%93%85').replace(/&#x1F4C6;/g,'%F0%9F%93%86').replace(/&#x1F4C7;/g,'%F0%9F%93%87').replace(/&#x1F4C8;/g,'%F0%9F%93%88').replace(/&#x1F4C9;/g,'%F0%9F%93%89').replace(/&#x1F4CA;/g,'%F0%9F%93%8A').replace(/&#x1F4CB;/g,'%F0%9F%93%8B').replace(/&#x1F4CC;/g,'%F0%9F%93%8C').replace(/&#x1F4CD;/g,'%F0%9F%93%8D').replace(/&#x1F4CE;/g,'%F0%9F%93%8E').replace(/&#x1F4CF;/g,'%F0%9F%93%8F').replace(/&#x1F4D0;/g,'%F0%9F%93%90').replace(/&#x1F4D1;/g,'%F0%9F%93%91').replace(/&#x1F4D2;/g,'%F0%9F%93%92').replace(/&#x1F4D3;/g,'%F0%9F%93%93').replace(/&#x1F4D4;/g,'%F0%9F%93%94').replace(/&#x1F4D5;/g,'%F0%9F%93%95').replace(/&#x1F4D6;/g,'%F0%9F%93%96').replace(/&#x1F4D7;/g,'%F0%9F%93%97').replace(/&#x1F4D8;/g,'%F0%9F%93%98').replace(/&#x1F4D9;/g,'%F0%9F%93%99').replace(/&#x1F4DA;/g,'%F0%9F%93%9A').replace(/&#x1F4DB;/g,'%F0%9F%93%9B').replace(/&#x1F4DC;/g,'%F0%9F%93%9C').replace(/&#x1F4DD;/g,'%F0%9F%93%9D').replace(/&#x1F4DE;/g,'%F0%9F%93%9E').replace(/&#x1F4DF;/g,'%F0%9F%93%9F').replace(/&#x1F4E0;/g,'%F0%9F%93%A0').replace(/&#x1F4E1;/g,'%F0%9F%93%A1').replace(/&#x1F4E2;/g,'%F0%9F%93%A2').replace(/&#x1F4E3;/g,'%F0%9F%93%A3').replace(/&#x1F4E4;/g,'%F0%9F%93%A4').replace(/&#x1F4E5;/g,'%F0%9F%93%A5').replace(/&#x1F4E6;/g,'%F0%9F%93%A6').replace(/&#x1F4E7;/g,'%F0%9F%93%A7').replace(/&#x1F4E8;/g,'%F0%9F%93%A8').replace(/&#x1F4E9;/g,'%F0%9F%93%A9').replace(/&#x1F4EA;/g,'%F0%9F%93%AA').replace(/&#x1F4EB;/g,'%F0%9F%93%AB').replace(/&#x1F4EC;/g,'%F0%9F%93%AC').replace(/&#x1F4ED;/g,'%F0%9F%93%AD').replace(/&#x1F4EE;/g,'%F0%9F%93%AE').replace(/&#x1F4EF;/g,'%F0%9F%93%AF').replace(/&#x1F4F0;/g,'%F0%9F%93%B0').replace(/&#x1F4F1;/g,'%F0%9F%93%B1').replace(/&#x1F4F2;/g,'%F0%9F%93%B2').replace(/&#x1F4F3;/g,'%F0%9F%93%B3').replace(/&#x1F4F4;/g,'%F0%9F%93%B4').replace(/&#x1F4F5;/g,'%F0%9F%93%B5').replace(/&#x1F4F6;/g,'%F0%9F%93%B6').replace(/&#x1F4F7;/g,'%F0%9F%93%B7').replace(/&#x1F4F9;/g,'%F0%9F%93%B9').replace(/&#x1F4FA;/g,'%F0%9F%93%BA').replace(/&#x1F4FB;/g,'%F0%9F%93%BB').replace(/&#x1F4FC;/g,'%F0%9F%93%BC').replace(/&#x1F500;/g,'%F0%9F%94%80').replace(/&#x1F501;/g,'%F0%9F%94%81').replace(/&#x1F502;/g,'%F0%9F%94%82').replace(/&#x1F503;/g,'%F0%9F%94%83').replace(/&#x1F504;/g,'%F0%9F%94%84').replace(/&#x1F505;/g,'%F0%9F%94%85').replace(/&#x1F506;/g,'%F0%9F%94%86').replace(/&#x1F507;/g,'%F0%9F%94%87').replace(/&#x1F509;/g,'%F0%9F%94%89').replace(/&#x1F50A;/g,'%F0%9F%94%8A').replace(/&#x1F50B;/g,'%F0%9F%94%8B').replace(/&#x1F50C;/g,'%F0%9F%94%8C').replace(/&#x1F50D;/g,'%F0%9F%94%8D').replace(/&#x1F50E;/g,'%F0%9F%94%8E').replace(/&#x1F50F;/g,'%F0%9F%94%8F').replace(/&#x1F510;/g,'%F0%9F%94%90').replace(/&#x1F511;/g,'%F0%9F%94%91').replace(/&#x1F512;/g,'%F0%9F%94%92').replace(/&#x1F513;/g,'%F0%9F%94%93').replace(/&#x1F514;/g,'%F0%9F%94%94').replace(/&#x1F515;/g,'%F0%9F%94%95').replace(/&#x1F516;/g,'%F0%9F%94%96').replace(/&#x1F517;/g,'%F0%9F%94%97').replace(/&#x1F518;/g,'%F0%9F%94%98').replace(/&#x1F519;/g,'%F0%9F%94%99').replace(/&#x1F51A;/g,'%F0%9F%94%9A').replace(/&#x1F51B;/g,'%F0%9F%94%9B').replace(/&#x1F51C;/g,'%F0%9F%94%9C').replace(/&#x1F51D;/g,'%F0%9F%94%9D').replace(/&#x1F51E;/g,'%F0%9F%94%9E').replace(/&#x1F51F;/g,'%F0%9F%94%9F').replace(/&#x1F520;/g,'%F0%9F%94%A0').replace(/&#x1F521;/g,'%F0%9F%94%A1').replace(/&#x1F522;/g,'%F0%9F%94%A2').replace(/&#x1F523;/g,'%F0%9F%94%A3').replace(/&#x1F524;/g,'%F0%9F%94%A4').replace(/&#x1F525;/g,'%F0%9F%94%A5').replace(/&#x1F526;/g,'%F0%9F%94%A6').replace(/&#x1F527;/g,'%F0%9F%94%A7').replace(/&#x1F528;/g,'%F0%9F%94%A8').replace(/&#x1F529;/g,'%F0%9F%94%A9').replace(/&#x1F52A;/g,'%F0%9F%94%AA').replace(/&#x1F52B;/g,'%F0%9F%94%AB').replace(/&#x1F52C;/g,'%F0%9F%94%AC').replace(/&#x1F52D;/g,'%F0%9F%94%AD').replace(/&#x1F52E;/g,'%F0%9F%94%AE').replace(/&#x1F52F;/g,'%F0%9F%94%AF').replace(/&#x1F530;/g,'%F0%9F%94%B0').replace(/&#x1F531;/g,'%F0%9F%94%B1').replace(/&#x1F532;/g,'%F0%9F%94%B2').replace(/&#x1F533;/g,'%F0%9F%94%B3').replace(/&#x1F534;/g,'%F0%9F%94%B4').replace(/&#x1F535;/g,'%F0%9F%94%B5').replace(/&#x1F536;/g,'%F0%9F%94%B6').replace(/&#x1F537;/g,'%F0%9F%94%B7').replace(/&#x1F538;/g,'%F0%9F%94%B8').replace(/&#x1F539;/g,'%F0%9F%94%B9').replace(/&#x1F53A;/g,'%F0%9F%94%BA').replace(/&#x1F53B;/g,'%F0%9F%94%BB').replace(/&#x1F53C;/g,'%F0%9F%94%BC').replace(/&#x1F53D;/g,'%F0%9F%94%BD').replace(/&#x1F550;/g,'%F0%9F%95%90').replace(/&#x1F551;/g,'%F0%9F%95%91').replace(/&#x1F552;/g,'%F0%9F%95%92').replace(/&#x1F553;/g,'%F0%9F%95%93').replace(/&#x1F554;/g,'%F0%9F%95%94').replace(/&#x1F555;/g,'%F0%9F%95%95').replace(/&#x1F556;/g,'%F0%9F%95%96').replace(/&#x1F557;/g,'%F0%9F%95%97').replace(/&#x1F558;/g,'%F0%9F%95%98').replace(/&#x1F559;/g,'%F0%9F%95%99').replace(/&#x1F55A;/g,'%F0%9F%95%9A').replace(/&#x1F55B;/g,'%F0%9F%95%9B').replace(/&#x1F55C;/g,'%F0%9F%95%9C').replace(/&#x1F55D;/g,'%F0%9F%95%9D').replace(/&#x1F55E;/g,'%F0%9F%95%9E').replace(/&#x1F55F;/g,'%F0%9F%95%9F').replace(/&#x1F560;/g,'%F0%9F%95%A0').replace(/&#x1F561;/g,'%F0%9F%95%A1').replace(/&#x1F562;/g,'%F0%9F%95%A2').replace(/&#x1F563;/g,'%F0%9F%95%A3').replace(/&#x1F564;/g,'%F0%9F%95%A4').replace(/&#x1F565;/g,'%F0%9F%95%A5').replace(/&#x1F566;/g,'%F0%9F%95%A6').replace(/&#x1F567;/g,'%F0%9F%95%A7').replace(/&#x1F5FB;/g,'%F0%9F%97%BB').replace(/&#x1F5FC;/g,'%F0%9F%97%BC').replace(/&#x1F5FD;/g,'%F0%9F%97%BD').replace(/&#x1F5FE;/g,'%F0%9F%97%BE').replace(/&#x1F5FF;/g,'%F0%9F%97%BF').replace(/&#x1F600;/g,'%F0%9F%98%80')
          .replace(/&#x1F601;/g,'%F0%9F%98%81').replace(/&#x1F602;/g,'%F0%9F%98%82').replace(/&#x1F603;/g,'%F0%9F%98%83').replace(/&#x1F604;/g,'%F0%9F%98%84').replace(/&#x1F605;/g,'%F0%9F%98%85').replace(/&#x1F606;/g,'%F0%9F%98%86').replace(/&#x1F607;/g,'%F0%9F%98%87').replace(/&#x1F608;/g,'%F0%9F%98%88').replace(/&#x1F609;/g,'%F0%9F%98%89').replace(/&#x1F60A;/g,'%F0%9F%98%8A').replace(/&#x1F60B;/g,'%F0%9F%98%8B').replace(/&#x1F60C;/g,'%F0%9F%98%8C').replace(/&#x1F60D;/g,'%F0%9F%98%8D').replace(/&#x1F60E;/g,'%F0%9F%98%8E').replace(/&#x1F60F;/g,'%F0%9F%98%8F').replace(/&#x1F610;/g,'%F0%9F%98%90').replace(/&#x1F611;/g,'%F0%9F%98%91').replace(/&#x1F612;/g,'%F0%9F%98%92').replace(/&#x1F613;/g,'%F0%9F%98%93').replace(/&#x1F614;/g,'%F0%9F%98%94').replace(/&#x1F615;/g,'%F0%9F%98%95').replace(/&#x1F616;/g,'%F0%9F%98%96').replace(/&#x1F617;/g,'%F0%9F%98%97').replace(/&#x1F618;/g,'%F0%9F%98%98').replace(/&#x1F619;/g,'%F0%9F%98%99').replace(/&#x1F61A;/g,'%F0%9F%98%9A').replace(/&#x1F61B;/g,'%F0%9F%98%9B').replace(/&#x1F61C;/g,'%F0%9F%98%9C').replace(/&#x1F61D;/g,'%F0%9F%98%9D').replace(/&#x1F61E;/g,'%F0%9F%98%9E').replace(/&#x1F61F;/g,'%F0%9F%98%9F').replace(/&#x1F620;/g,'%F0%9F%98%A0').replace(/&#x1F621;/g,'%F0%9F%98%A1').replace(/&#x1F622;/g,'%F0%9F%98%A2').replace(/&#x1F623;/g,'%F0%9F%98%A3').replace(/&#x1F624;/g,'%F0%9F%98%A4').replace(/&#x1F625;/g,'%F0%9F%98%A5').replace(/&#x1F626;/g,'%F0%9F%98%A6').replace(/&#x1F627;/g,'%F0%9F%98%A7').replace(/&#x1F628;/g,'%F0%9F%98%A8').replace(/&#x1F629;/g,'%F0%9F%98%A9').replace(/&#x1F62A;/g,'%F0%9F%98%AA').replace(/&#x1F62B;/g,'%F0%9F%98%AB').replace(/&#x1F62C;/g,'%F0%9F%98%AC').replace(/&#x1F62D;/g,'%F0%9F%98%AD').replace(/&#x1F62E;/g,'%F0%9F%98%AE').replace(/&#x1F62F;/g,'%F0%9F%98%AF').replace(/&#x1F630;/g,'%F0%9F%98%B0').replace(/&#x1F631;/g,'%F0%9F%98%B1').replace(/&#x1F632;/g,'%F0%9F%98%B2').replace(/&#x1F633;/g,'%F0%9F%98%B3').replace(/&#x1F634;/g,'%F0%9F%98%B4').replace(/&#x1F635;/g,'%F0%9F%98%B5').replace(/&#x1F636;/g,'%F0%9F%98%B6').replace(/&#x1F637;/g,'%F0%9F%98%B7').replace(/&#x1F638;/g,'%F0%9F%98%B8').replace(/&#x1F639;/g,'%F0%9F%98%B9').replace(/&#x1F63A;/g,'%F0%9F%98%BA').replace(/&#x1F63B;/g,'%F0%9F%98%BB').replace(/&#x1F63C;/g,'%F0%9F%98%BC').replace(/&#x1F63D;/g,'%F0%9F%98%BD').replace(/&#x1F63E;/g,'%F0%9F%98%BE').replace(/&#x1F63F;/g,'%F0%9F%98%BF').replace(/&#x1F640;/g,'%F0%9F%99%80').replace(/&#x1F645;/g,'%F0%9F%99%85').replace(/&#x1F646;/g,'%F0%9F%99%86').replace(/&#x1F647;/g,'%F0%9F%99%87').replace(/&#x1F648;/g,'%F0%9F%99%88').replace(/&#x1F649;/g,'%F0%9F%99%89').replace(/&#x1F64A;/g,'%F0%9F%99%8A').replace(/&#x1F64B;/g,'%F0%9F%99%8B').replace(/&#x1F64C;/g,'%F0%9F%99%8C').replace(/&#x1F64D;/g,'%F0%9F%99%8D').replace(/&#x1F64E;/g,'%F0%9F%99%8E').replace(/&#x1F64F;/g,'%F0%9F%99%8F').replace(/&#x1F680;/g,'%F0%9F%9A%80').replace(/&#x1F681;/g,'%F0%9F%9A%81').replace(/&#x1F682;/g,'%F0%9F%9A%82').replace(/&#x1F683;/g,'%F0%9F%9A%83').replace(/&#x1F684;/g,'%F0%9F%9A%84').replace(/&#x1F685;/g,'%F0%9F%9A%85').replace(/&#x1F686;/g,'%F0%9F%9A%86').replace(/&#x1F687;/g,'%F0%9F%9A%87').replace(/&#x1F688;/g,'%F0%9F%9A%88').replace(/&#x1F689;/g,'%F0%9F%9A%89').replace(/&#x1F68A;/g,'%F0%9F%9A%8A').replace(/&#x1F68C;/g,'%F0%9F%9A%8C').replace(/&#x1F68D;/g,'%F0%9F%9A%8D').replace(/&#x1F68E;/g,'%F0%9F%9A%8E').replace(/&#x1F68F;/g,'%F0%9F%9A%8F').replace(/&#x1F690;/g,'%F0%9F%9A%90').replace(/&#x1F691;/g,'%F0%9F%9A%91').replace(/&#x1F692;/g,'%F0%9F%9A%92').replace(/&#x1F693;/g,'%F0%9F%9A%93').replace(/&#x1F694;/g,'%F0%9F%9A%94').replace(/&#x1F695;/g,'%F0%9F%9A%95').replace(/&#x1F696;/g,'%F0%9F%9A%96').replace(/&#x1F697;/g,'%F0%9F%9A%97').replace(/&#x1F698;/g,'%F0%9F%9A%98').replace(/&#x1F699;/g,'%F0%9F%9A%99').replace(/&#x1F69A;/g,'%F0%9F%9A%9A').replace(/&#x1F69B;/g,'%F0%9F%9A%9B').replace(/&#x1F69C;/g,'%F0%9F%9A%9C').replace(/&#x1F69D;/g,'%F0%9F%9A%9D').replace(/&#x1F69E;/g,'%F0%9F%9A%9E').replace(/&#x1F69F;/g,'%F0%9F%9A%9F').replace(/&#x1F6A0;/g,'%F0%9F%9A%A0').replace(/&#x1F6A1;/g,'%F0%9F%9A%A1').replace(/&#x1F6A2;/g,'%F0%9F%9A%A2').replace(/&#x1F6A3;/g,'%F0%9F%9A%A3').replace(/&#x1F6A4;/g,'%F0%9F%9A%A4').replace(/&#x1F6A5;/g,'%F0%9F%9A%A5').replace(/&#x1F6A6;/g,'%F0%9F%9A%A6').replace(/&#x1F6A7;/g,'%F0%9F%9A%A7').replace(/&#x1F6A8;/g,'%F0%9F%9A%A8').replace(/&#x1F6A9;/g,'%F0%9F%9A%A9').replace(/&#x1F6AA;/g,'%F0%9F%9A%AA').replace(/&#x1F6AB;/g,'%F0%9F%9A%AB').replace(/&#x1F6AC;/g,'%F0%9F%9A%AC').replace(/&#x1F6AD;/g,'%F0%9F%9A%AD').replace(/&#x1F6AE;/g,'%F0%9F%9A%AE').replace(/&#x1F6AF;/g,'%F0%9F%9A%AF').replace(/&#x1F6B0;/g,'%F0%9F%9A%B0').replace(/&#x1F6B1;/g,'%F0%9F%9A%B1').replace(/&#x1F6B2;/g,'%F0%9F%9A%B2').replace(/&#x1F6B3;/g,'%F0%9F%9A%B3').replace(/&#x1F6B4;/g,'%F0%9F%9A%B4').replace(/&#x1F6B5;/g,'%F0%9F%9A%B5').replace(/&#x1F6B6;/g,'%F0%9F%9A%B6').replace(/&#x1F6B7;/g,'%F0%9F%9A%B7').replace(/&#x1F6B8;/g,'%F0%9F%9A%B8').replace(/&#x1F6B9;/g,'%F0%9F%9A%B9').replace(/&#x1F6BA;/g,'%F0%9F%9A%BA').replace(/&#x1F6BB;/g,'%F0%9F%9A%BB').replace(/&#x1F6BC;/g,'%F0%9F%9A%BC').replace(/&#x1F6BD;/g,'%F0%9F%9A%BD').replace(/&#x1F6BE;/g,'%F0%9F%9A%BE').replace(/&#x1F6BF;/g,'%F0%9F%9A%BF').replace(/&#x1F6C0;/g,'%F0%9F%9B%80').replace(/&#x1F6C1;/g,'%F0%9F%9B%81').replace(/&#x1F6C2;/g,'%F0%9F%9B%82').replace(/&#x1F6C3;/g,'%F0%9F%9B%83').replace(/&#x1F6C4;/g,'%F0%9F%9B%84').replace(/&#x1F6C5;/g,'%F0%9F%9B%85').replace(/&#x203C;/g,'%E2%80%BC').replace(/&#x2049;/g,'%E2%81%89').replace(/&#x2122;/g,'%E2%84%A2').replace(/&#x2139;/g,'%E2%84%B9').replace(/&#x2194;/g,'%E2%86%94').replace(/&#x2195;/g,'%E2%86%95').replace(/&#x2196;/g,'%E2%86%96').replace(/&#x2197;/g,'%E2%86%97').replace(/&#x2198;/g,'%E2%86%98').replace(/&#x2199;/g,'%E2%86%99').replace(/&#x21A9;/g,'%E2%86%A9').replace(/&#x21AA;/g,'%E2%86%AA').replace(/&#x231A;/g,'%E2%8C%9A').replace(/&#x231B;/g,'%E2%8C%9B').replace(/&#x23000000000;/g,'%E2%8F%A9').replace(/&#x23EA;/g,'%E2%8F%AA').replace(/&#x23EB;/g,'%E2%8F%AB').replace(/&#x23EC;/g,'%E2%8F%AC').replace(/&#x23F0;/g,'%E2%8F%B0').replace(/&#x23F3;/g,'%E2%8F%B3').replace(/&#x24C2;/g,'%E2%93%82').replace(/&#x25AA;/g,'%E2%96%AA').replace(/&#x25AB;/g,'%E2%96%AB').replace(/&#x25B6;/g,'%E2%96%B6').replace(/&#x25C0;/g,'%E2%97%80').replace(/&#x25FB;/g,'%E2%97%BB').replace(/&#x25FC;/g,'%E2%97%BC').replace(/&#x25FD;/g,'%E2%97%BD').replace(/&#x25FE;/g,'%E2%97%BE').replace(/&#x2600;/g,'%E2%98%80').replace(/&#x2601;/g,'%E2%98%81').replace(/&#x260E;/g,'%E2%98%8E').replace(/&#x2611;/g,'%E2%98%91').replace(/&#x2614;/g,'%E2%98%94').replace(/&#x2615;/g,'%E2%98%95').replace(/&#x261D;/g,'%E2%98%9D').replace(/&#x263A;/g,'%E2%98%BA').replace(/&#x2648;/g,'%E2%99%88').replace(/&#x2649;/g,'%E2%99%89').replace(/&#x264A;/g,'%E2%99%8A').replace(/&#x264B;/g,'%E2%99%8B').replace(/&#x264C;/g,'%E2%99%8C').replace(/&#x264D;/g,'%E2%99%8D').replace(/&#x264E;/g,'%E2%99%8E').replace(/&#x264F;/g,'%E2%99%8F').replace(/&#x2650;/g,'%E2%99%90').replace(/&#x2651;/g,'%E2%99%91').replace(/&#x2652;/g,'%E2%99%92').replace(/&#x2653;/g,'%E2%99%93')
          .replace(/&#x2660;/g,'%E2%99%A0').replace(/&#x2663;/g,'%E2%99%A3').replace(/&#x2665;/g,'%E2%99%A5').replace(/&#x2666;/g,'%E2%99%A6').replace(/&#x2668;/g,'%E2%99%A8').replace(/&#x267B;/g,'%E2%99%BB').replace(/&#x267F;/g,'%E2%99%BF').replace(/&#x2693;/g,'%E2%9A%93').replace(/&#x26A0;/g,'%E2%9A%A0').replace(/&#x26A1;/g,'%E2%9A%A1').replace(/&#x26AA;/g,'%E2%9A%AA').replace(/&#x26AB;/g,'%E2%9A%AB').replace(/&#x26BD;/g,'%E2%9A%BD').replace(/&#x26BE;/g,'%E2%9A%BE').replace(/&#x26C4;/g,'%E2%9B%84').replace(/&#x26C5;/g,'%E2%9B%85').replace(/&#x26CE;/g,'%E2%9B%8E').replace(/&#x26D4;/g,'%E2%9B%94').replace(/&#x26EA;/g,'%E2%9B%AA').replace(/&#x26F2;/g,'%E2%9B%B2').replace(/&#x26F3;/g,'%E2%9B%B3').replace(/&#x26F5;/g,'%E2%9B%B5').replace(/&#x26FA;/g,'%E2%9B%BA').replace(/&#x26FD;/g,'%E2%9B%BD').replace(/&#x2702;/g,'%E2%9C%82').replace(/&#x2705;/g,'%E2%9C%85').replace(/&#x2708;/g,'%E2%9C%88').replace(/&#x2709;/g,'%E2%9C%89').replace(/&#x270A;/g,'%E2%9C%8A').replace(/&#x270B;/g,'%E2%9C%8B').replace(/&#x270C;/g,'%E2%9C%8C').replace(/&#x270F;/g,'%E2%9C%8F').replace(/&#x2712;/g,'%E2%9C%92').replace(/&#x2714;/g,'%E2%9C%94').replace(/&#x2716;/g,'%E2%9C%96').replace(/&#x2728;/g,'%E2%9C%A8').replace(/&#x2733;/g,'%E2%9C%B3').replace(/&#x2734;/g,'%E2%9C%B4').replace(/&#x2744;/g,'%E2%9D%84').replace(/&#x2747;/g,'%E2%9D%87').replace(/&#x274C;/g,'%E2%9D%8C').replace(/&#x274E;/g,'%E2%9D%8E').replace(/&#x2753;/g,'%E2%9D%93').replace(/&#x2754;/g,'%E2%9D%94').replace(/&#x2755;/g,'%E2%9D%95').replace(/&#x2757;/g,'%E2%9D%97').replace(/&#x2764;/g,'%E2%9D%A4').replace(/&#x2795;/g,'%E2%9E%95').replace(/&#x2796;/g,'%E2%9E%96').replace(/&#x2797;/g,'%E2%9E%97').replace(/&#x27A1;/g,'%E2%9E%A1').replace(/&#x27B0;/g,'%E2%9E%B0').replace(/&#x2934;/g,'%E2%A4%B4').replace(/&#x2935;/g,'%E2%A4%B5').replace(/&#x2B05;/g,'%E2%AC%85').replace(/&#x2B06;/g,'%E2%AC%86').replace(/&#x2B07;/g,'%E2%AC%87').replace(/&#x2B1B;/g,'%E2%AC%9B').replace(/&#x2B1C;/g,'%E2%AC%9C').replace(/&#x2B50;/g,'%E2%AD%90').replace(/&#x2B55;/g,'%E2%AD%95').replace(/&#x3030;/g,'%E3%80%B0').replace(/&#x303D;/g,'%E3%80%BD').replace(/&#x3297;/g,'%E3%8A%97').replace(/&#x3299;/g,'%E3%8A%99')
          }
          let last_insert_id = _.last(matchObj);

          let sql = 'SELECT COUNT(*) as cnt FROM post_telegram WHERE post_telegram.post_id =' + last_insert_id.id;
          connection.query(sql, function (err, rides) {
            if (err) {
          setup();
              console.log('err: ', err);
            }
            else if (rides[0].cnt == 0) {
             posttele (rides[0].cnt, last_insert_id.id, matchObj);
            } else {
              // nextCall(null, bodyss);
            }
          })
        }).catch(function (error) {
          setup();
          console.log(error);
        })
    }, 15000)
    
    function posttele (bodyss, lastInsertId, lastArrayData) {
        let sqls = "SELECT post_id FROM post_telegram  ORDER BY id DESC LIMIT 1";
        connection.query(sqls, function (err, rides) {
          if (err) {
            console.log('err: ', err);
          setup();
          }
          for (let i = 0; i < lastInsertId - rides[0].post_id; i++) {
            let nextId = rides[0].post_id + i + 1;
            let userExists = lastArrayData.filter(user => user.id == nextId);
            // if (userExists.length > 0) {
              if (userExists.length > 0 && userExists[0].text_data != 'null\n') {
              
             let final =[];
             let array = userExists[0].text_data.split("\n");
              for (let j = 0; j < array.length; j++) {
                if(array[j].match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g)){
                  let xzhxzh;
                    if(array[j].match(/amazon.in/g)){
                     xzhxzh = array[j].replace(/[[\]]/g,'').replace(/ /g, '@')
                    }else{
                    xzhxzh = array[j]
                    }
                  let urls = xzhxzh.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g)
                     tall(urls[0], {
                      method: 'HEAD',
                      maxRedirect: 5
                    }).then(function(unshortenedUrl){ 
                    if(unshortenedUrl.match(/amazon.in/g)){
                      let tagnot;
                      if(unshortenedUrl.match(/earnkaro/g)){
                        let finalLink =unshortenedUrl.split('dl=');
                        // for (let h = 0; h < finalLink.length; h++) {
                        //     if(finalLink[h].match(/^tag/g)){
                        //     finalLink[h] = 'tag=kudrats-21'
                        //   }
                        // }
                         if(urlencode(finalLink[1]).match(/[?]/g)){
                          tagnot= urlencode(finalLink[1]).concat('&tag=kudrats-21');
                        }else{
                          tagnot= urlencode(finalLink[1]).concat('?tag=kudrats-21');
                        }
                         function urlencode(str) {
                          return str.replace(/%21/g,'!').replace(/%20/g,' ').replace(/%22/g,'"').replace(/%26/g,'&')
                            .replace(/%27/g,'\'').replace(/%3A/g,':').replace(/%2F/g,'/').replace(/%3D/g,'=')
                            .replace(/%28/g,'(').replace(/%3F/g,'?').replace(/%29/g,')').replace(/%2A/g,'*')
                            .replace(/%20/g, '+');
                        }

                        } else if(unshortenedUrl.match(/tag/g)){
                    let finalLink =unshortenedUrl.split('&');
                    for (let h = 0; h < finalLink.length; h++) {
                        if(finalLink[h].match(/^tag/g)){
                        finalLink[h] = 'tag=kudrats-21'
                      }
                    }
                     tagnot= finalLink.join('&').replace(/@/g, '');
                    }else{
                     tagnot= unshortenedUrl.replace(/@/g, '').concat('&tag=kudrats-21');
                    }
                   example(tagnot);
                        async function example(dddd) {
                          let response =await bitly.shorten(dddd);
                        final[j] = array[j].replace("["+urls[0].replace(/@/g, ' ').trim()+"]",response.link).replace(/.#x...../g,' %E2%99%A8 ').concat("\n").replace(/&/g, 'and').replace(/;/g, ' ');
                        console.log('final[j]2: ', final[j]);
                      }
                    }else{
                      tall(unshortenedUrl, {
                        method: 'HEAD',
                        maxRedirect: 5
                      }).then(function(unshortenedUrl){ 
                    // if(unshortenedUrl.match(/amazon.in/g) && unshortenedUrl.match(/tag/g)){
                    //   console.log("----ui");
                    //   let finalLink =unshortenedUrl.split('&');
                    //   for (let h = 0; h < finalLink.length; h++) {
                    //     if(finalLink[h].match(/^tag/g)){
                    //       finalLink[h] = 'tag=kudrats-21'
                    //     }
                    //   }
                      if(unshortenedUrl.match(/amazon.in/g)){
                        let tagnot;
                        if(unshortenedUrl.match(/tag/g)){
                      let finalLink =unshortenedUrl.split('&');
                      for (let h = 0; h < finalLink.length; h++) {
                          if(finalLink[h].match(/^tag/g)){
                          finalLink[h] = 'tag=kudrats-21'
                        }
                      }
                       tagnot= finalLink.join('&').replace(/@/g, '');
                      }else{
                       tagnot= unshortenedUrl.replace(/@/g, '').concat('&tag=kudrats-21');
                      }
                     example(tagnot);
                          async function example(dddd) {
                            let response =await bitly.shorten(dddd);
                          final[j] = array[j].replace("["+urls[0].replace(/@/g, ' ').trim()+"]",response.link).replace(/.#x...../g,' %E2%99%A8 ').concat("\n").replace(/&/g, 'and').replace(/;/g, ' ');
                          console.log('final[j]2: ', final[j]);
                        }
                      }else{
                        // let finalLink =unshortenedUrl.split('?');
                        // final[j] = array[j].replace("["+urls[0].replace(/@/g, ' ').trim()+"]",finalLink[0]).replace(/.#x...../g,' %E2%99%A8 ').replace(/&/g, 'and').replace(/;/g, ' ');
                  final[j] = ' ';
                      }
                    })
                    .catch(function(err){ console.error('AAAW 👻', err)})
                    }
                      })
                      .catch(function(err){ console.error('AAAW 👻', err)})
                }else{
                  final[j] = array[j].replace(/&#xA0;/g,' ').replace(/.#x...../g,' %E2%99%A8 ').replace(/[[\]]/g,'').replace(/&/g, 'and').replace(/;/g, ' ').replace(/#/g, '').replace(/^\s+|\s+$|\s+(?=\s)/g, '');
                }
              }
              setTimeout(()=>{
                let finalAmazon = final.join('\n');
              if(finalAmazon.match(/amzn.to/g)){
                let insertFeild = [rides[0].post_id + i, finalAmazon]
                let sqlss = "INSERT INTO post_telegram (post_id,data) VALUES (" + nextId + "," + JSON.stringify(finalAmazon) + ")";
                connection.query(sqlss, [insertFeild], function (err, rides) {
                  if (err) {
                    setup();
                    console.log('err: ', err);
                  }
                })
                var token = '1012069743:AAHAQ-sDOZQW0Qvh3iCrRfmgI2oDTe1Cqqk';  // <= replace with yours
                var chatId = '@testchannel0112'; // <= replace with yours
                // bot = new nodeTelegramBotApi(token);
                // bot.sendMessage(chatId, userExists[0].text_data)
                var apijj = 'https://api.telegram.org/bot777630419:AAGu5PbnSJ_yhnSjqrf_8t-2tHMqZUJDS08/sendMessage?chat_id=@testchannel0112&text='+finalAmazon;
                request({
                  uri: apijj
                }, (err, response) => {
                  if(err){
                    setup();
                  }
                  // console.log('body: ', response);
                  // nextCall(null, body);
                })
            }
              },Math.ceil(array.length/5)*3500);
            }
          }
          // nextCall(null, "recorded");
        })
    }

//   ], function (err, response) {
//     if (err) {
//       return res.send({
//         status: err.code ? err.code : 400,
//         message: (err && err.msg) || "someyhing went wrong"
//       });
//     }
//     return res.send({
//       status_code: 200,
//       message: "telegrame post create sucessfully",
//       data: response
//     });
//   })
// },7000)

// router.get('/allinoneapp', function (req, res, next) {
//   async.waterfall([
//     function (nextCall) {
//       values =   [
//         [
//            "NOLOGO",
//            "https://www.flipkart.com/",
//            "https://ad.admitad.com/g/rb1qie435be86622ac64a80d05f527/",
//            "Flipkart",
//            "FALSE",
//            "flipkart"
//         ],
//         [
//            "NOLOGO",
//            "https://www.amazon.in/",
//            "https://amzn.to/2Rb4vsU",
//            "Amazon",
//            "TRUE",
//            "amazon"
//         ],
//         [
//            "NOLOGO",
//            "https://www.tatacliq.com/",
//            "https://www.tatacliq.com/",
//            "Tatacliq",
//            "FALSE",
//            "tatacliq"
//         ],
//         [
//            "NOLOGO",
//            "https://m.shopclues.com/",
//            "https://linksredirect.com/?cid=76950&subid=kudrati&source=linkkit&url=https%3A%2F%2Fwww.shopclues.com%2F",
//            "Shopclues",
//            "TRUE",
//            "shopclues"
//         ],
//         [
//            "NOLOGO",
//            "https://m.snapdeal.com/",
//            "https://m.snapdeal.com/",
//            "Snapdeal",
//            "FALSE",
//            "snapdeal"
//         ],
//         [
//            "NOLOGO",
//            "https://paytmmall.com/",
//            "https://linksredirect.com/?cid=76950&subid=kudrati&source=linkkit&url=https%3A%2F%2Fpaytm.com",
//            "Paytm",
//            "TRUE",
//            "paytm"
//         ],
//         [
//            "NOLOGO",
//            "https://www.myntra.com/",
//            "https://ad.admitad.com/g/s56leml8cke86622ac6423d5247706/",
//            "Myntra",
//            "TRUE",
//            "myntra"
//         ],
//         [
//            "NOLOGO",
//            "https://www.nnnow.com/",
//            "https://ad.admitad.com/g/f6dgh64z7ue86622ac64f448324775/",
//            "Nnnow",
//            "TRUE",
//            "nnnow"
//         ],
//         [
//            "NOLOGO",
//            "https://www.olx.in/",
//            "https://www.olx.in/",
//            "Olx",
//            "FALSE",
//            "olx"
//         ],
//         [
//            "NOLOGO",
//            "https://m.clubfactory.com/home",
//            "https://m.clubfactory.com/home",
//            "Clubfactory",
//            "FALSE",
//            "clubfactory"
//         ],
//         [
//            "NOLOGO",
//            "https://www.limeroad.com/",
//            "https://ad.admitad.com/g/6muhc4mlrfe86622ac6476041b2588/",
//            "Limeroad",
//            "TRUE",
//            "limeroad"
//         ],
//         [
//            "NOLOGO",
//            "https://m.aliexpress.com/",
//            "https://alitems.com/g/5mdimmknwte86622ac64cd43c39a51/",
//            "Aliexpress",
//            "TRUE",
//            "aliexpress"
//         ],
//         [
//            "NOLOGO",
//            "https://www.nykaa.com/",
//            "https://ad.admitad.com/g/cgt1wohd8de86622ac644c3f6c5f95/",
//            "Nykaa",
//            "TRUE",
//            "nykaa"
//         ],
//         [
//            "NOLOGO",
//            "https://grofers.com/",
//            "https://grofers.com/",
//            "Groffers",
//            "FALSE",
//            "groffers"
//         ],
//         [
//            "NOLOGO",
//            "https://www.wish.com/?&hide_login_modal=true",
//            "https://www.wish.com/?&hide_login_modal=true",
//            "Wish",
//            "FALSE",
//            "wish"
//         ],
//         [
//            "NOLOGO",
//            "https://m.shein.in/?ref=www&rep=dir&ret=m",
//            "https://m.shein.in/?ref=www&rep=dir&ret=m",
//            "Shein",
//            "FALSE",
//            "shein"
//         ],
//         [
//            "NOLOGO",
//            "https://www.bigbasket.com/",
//            "https://ad.admitad.com/g/gob3zzel35e86622ac641051f25b5d/",
//            "Bigbasket",
//            "FALSE",
//            "bigbasket"
//         ],
//         [
//            "NOLOGO",
//            "https://www.ajio.com/",
//            "https://ad.admitad.com/g/gobb106sd9e86622ac64a663530cb9/",
//            "Ajio",
//            "TRUE",
//            "ajio"
//         ],
//         [
//            "NOLOGO",
//            "https://www.firstcry.com/m/",
//            "https://ad.admitad.com/g/s04yc4g9rye86622ac6462ee748b0a/",
//            "Firstcry",
//            "TRUE",
//            "firstcry"
//         ],
//         [
//            "NOLOGO",
//            "https://www.bewakoof.com/",
//            "https://www.bewakoof.com/",
//            "Bewkoof",
//            "FALSE",
//            "bewkoof"
//         ],
//         [
//            "NOLOGO",
//            "https://www.ebay.com/",
//            "https://www.ebay.com/",
//            "Ebay",
//            "FALSE",
//            "ebay"
//         ],
//         [
//            "NOLOGO",
//            "https://elanic.in/",
//            "https://elanic.in/",
//            "Elanic",
//            "FALSE",
//            "elanic"
//         ],
//         [
//            "NOLOGO",
//            "https://www.craftsvilla.com/",
//            "https://www.craftsvilla.com/",
//            "Craftsvilla",
//            "FALSE",
//            "craftsvilla"
//         ],
//         [
//            "NOLOGO",
//            "https://www.purplle.com/",
//            "https://www.purplle.com/",
//            "Puplle",
//            "FALSE",
//            "puplle"
//         ],
//         [
//            "NOLOGO",
//            "https://m.romwe.co.in/",
//            "https://m.romwe.co.in/",
//            "Romwe",
//            "FALSE",
//            "romwe"
//         ],
//         [
//            "NOLOGO",
//            "https://m.banggood.in/",
//            "https://ad.admitad.com/g/e8f129b05ee86622ac646213826a88/",
//            "Banggood",
//            "TRUE",
//            "banggood"
//         ],
//         [
//            "NOLOGO",
//            "https://www.fynd.com/",
//            "https://www.fynd.com/",
//            "Fynd",
//            "FALSE",
//            "fynd"
//         ],
//         [
//            "NOLOGO",
//            "https://www.hopscotch.in/",
//            "https://www.hopscotch.in/",
//            "Hopscotch",
//            "FALSE",
//            "hopscotch"
//         ],
//         [
//            "NOLOGO",
//            "https://www.quikr.com/",
//            "https://www.quikr.com/",
//            "Quikr",
//            "FALSE",
//            "quikr"
//         ],
//         [
//            "NOLOGO",
//            "https://www.zivame.com/",
//            "https://ad.admitad.com/g/t2nm6m1kgce86622ac645f08f4c55f/",
//            "Zivame",
//            "TRUE",
//            "zivame"
//         ],
//         [
//            "NOLOGO",
//            "https://m.facebook.com/",
//            "https://m.facebook.com/",
//            "Facebook",
//            "FALSE",
//            "facebook"
//         ],
//         [
//            "NOLOGO",
//            "https://qzone.qq.com/",
//            "https://qzone.qq.com/",
//            "Qzone",
//            "FALSE",
//            "qzone"
//         ],
//         [
//            "NOLOGO",
//            "https://www.tiktok.com/trending/",
//            "https://www.tiktok.com/trending/",
//            "Tiktok",
//            "FALSE",
//            "tiktok"
//         ],
//         [
//            "NOLOGO",
//            "https://m.vk.com/",
//            "https://m.vk.com/",
//            "Vkontakte",
//            "FALSE",
//            "vkontakte"
//         ],
//         [
//            "NOLOGO",
//            "https://gab.com/",
//            "https://gab.com/",
//            "Gab",
//            "FALSE",
//            "gab"
//         ],
//         [
//            "NOLOGO",
//            "https://mobile.twitter.com/login",
//            "https://mobile.twitter.com/login",
//            "Twitter",
//            "FALSE",
//            "twitter"
//         ],
//         [
//            "NOLOGO",
//            "https://www.linkedin.com/login",
//            "https://www.linkedin.com/login",
//            "Linkedin",
//            "FALSE",
//            "linkedin"
//         ],
//         [
//            "NOLOGO",
//            "https://myspace.com/",
//            "https://myspace.com/",
//            "Myspace",
//            "FALSE",
//            "myspace"
//         ],
//         [
//            "NOLOGO",
//            "https://sharechat.com/",
//            "https://sharechat.com/",
//            "Sharechat",
//            "FALSE",
//            "sharechat"
//         ],
//         [
//            "NOLOGO",
//            "https://www.instagram.com/?hl=en",
//            "https://www.instagram.com/?hl=en",
//            "Instagram",
//            "FALSE",
//            "instagram"
//         ],
//         [
//            "NOLOGO",
//            "https://www.snapchat.com/",
//            "https://www.snapchat.com/",
//            "Snapchat",
//            "FALSE",
//            "snapchat"
//         ],
//         [
//            "NOLOGO",
//            "https://www.youtube.com/",
//            "https://www.youtube.com/",
//            "Youtube",
//            "FALSE",
//            "youtube"
//         ],
//         [
//            "NOLOGO",
//            "https://vine.co/",
//            "https://vine.co/",
//            "Vine",
//            "FALSE",
//            "vine"
//         ],
//         [
//            "NOLOGO",
//            "https://www.funnyordie.com/",
//            "https://www.funnyordie.com/",
//            "Funnyordie",
//            "FALSE",
//            "funnyordie"
//         ],
//         [
//            "NOLOGO",
//            "https://weheartit.com/",
//            "https://weheartit.com/",
//            "Weheartit",
//            "FALSE",
//            "weheartit"
//         ],
//         [
//            "NOLOGO",
//            "https://www.flickr.com/",
//            "https://www.flickr.com/",
//            "Flickr",
//            "FALSE",
//            "flickr"
//         ],
//         [
//            "NOLOGO",
//            "https://www.dailymotion.com/",
//            "https://www.dailymotion.com/",
//            "Dailymotion",
//            "FALSE",
//            "dailymotion"
//         ],
//         [
//            "NOLOGO",
//            "https://www.reverbnation.com/",
//            "https://www.reverbnation.com/",
//            "Reverbnation",
//            "FALSE",
//            "reverbnation"
//         ],
//         [
//            "NOLOGO",
//            "https://www.google.com/intl/en-GB/gmail/about/#",
//            "https://www.google.com/intl/en-GB/gmail/about/#",
//            "Gmail",
//            "FALSE",
//            "gmail"
//         ],
//         [
//            "NOLOGO",
//            "https://accounts.zoho.in/signin",
//            "https://accounts.zoho.in/signin",
//            "Zohoo",
//            "FALSE",
//            "zohoo"
//         ],
//         [
//            "NOLOGO",
//            "https://login.aol.com/",
//            "https://login.aol.com/",
//            "Aol",
//            "FALSE",
//            "aol"
//         ],
//         [
//            "NOLOGO",
//            "https://login.live.com/login.srf",
//            "https://login.live.com/login.srf",
//            "Outlook",
//            "FALSE",
//            "outlook"
//         ],
//         [
//            "NOLOGO",
//            "https://login.yahoo.com/",
//            "https://login.yahoo.com/",
//            "Yahoo",
//            "FALSE",
//            "yahoo"
//         ],
//         [
//            "NOLOGO",
//            "https://line.me/en/",
//            "https://line.me/en/",
//            "Line",
//            "FALSE",
//            "line"
//         ],
//         [
//            "NOLOGO",
//            "http://m.tagged.com/login",
//            "http://m.tagged.com/login",
//            "Tagged",
//            "FALSE",
//            "tagged"
//         ],
//         [
//            "NOLOGO",
//            "https://www.skout.com/login",
//            "https://www.skout.com/login",
//            "Skout",
//            "FALSE",
//            "skout"
//         ],
//         [
//            "NOLOGO",
//            "https://www.twoo.com/#login",
//            "https://www.twoo.com/#login",
//            "Twoo",
//            "FALSE",
//            "twoo"
//         ],
//         [
//            "NOLOGO",
//            "https://medium.com/",
//            "https://medium.com/",
//            "Medium",
//            "FALSE",
//            "medium"
//         ],
//         [
//            "NOLOGO",
//            "https://www.myheritage.com/",
//            "https://www.myheritage.com/",
//            "Myheritage",
//            "FALSE",
//            "myheritage"
//         ],
//         [
//            "NOLOGO",
//            "https://www.care2.com/",
//            "https://www.care2.com/",
//            "Care2",
//            "FALSE",
//            "care2"
//         ],
//         [
//            "NOLOGO",
//            "https://the-dots.com/account/login",
//            "https://the-dots.com/account/login",
//            "Thedots",
//            "FALSE",
//            "thedots"
//         ],
//         [
//            "NOLOGO",
//            "https://login.xing.com/",
//            "https://login.xing.com/",
//            "Xing",
//            "FALSE",
//            "xing"
//         ],
//         [
//            "NOLOGO",
//            "https://digg.com/welcome",
//            "https://digg.com/welcome",
//            "Digg",
//            "FALSE",
//            "digg"
//         ],
//         [
//            "NOLOGO",
//            "https://www.google.com/intl/en-GB/gmail/about/#",
//            "https://www.google.com/intl/en-GB/gmail/about/#",
//            "Tout",
//            "FALSE",
//            "tout"
//         ],
//         [
//            "NOLOGO",
//            "https://www.reddit.com/login",
//            "https://www.reddit.com/login",
//            "Reddit",
//            "FALSE",
//            "reddit"
//         ],
//         [
//            "NOLOGO",
//            "https://hubpages.com/signin/",
//            "https://hubpages.com/signin/",
//            "Hubpages",
//            "FALSE",
//            "hubpages"
//         ],
//         [
//            "NOLOGO",
//            "https://www.google.com/intl/en-GB/gmail/about/#",
//            "https://www.google.com/intl/en-GB/gmail/about/#",
//            "Afterschool",
//            "FALSE",
//            "afterschool"
//         ],
//         [
//            "NOLOGO",
//            "https://www.flixster.com/",
//            "https://www.flixster.com/",
//            "Flixster",
//            "FALSE",
//            "flixster"
//         ],
//         [
//            "NOLOGO",
//            "https://www.skyrock.mobi/",
//            "https://www.skyrock.mobi/",
//            "Skyrock",
//            "FALSE",
//            "skyrock"
//         ],
//         [
//            "NOLOGO",
//            "https://www.cafemom.com/",
//            "https://www.cafemom.com/",
//            "Cafemom",
//            "FALSE",
//            "cafemom"
//         ],
//         [
//            "NOLOGO",
//            "https://global.nextdoor.com/",
//            "https://global.nextdoor.com/",
//            "Nextdoor",
//            "FALSE",
//            "nextdoor"
//         ],
//         [
//            "NOLOGO",
//            "https://www.meetup.com/",
//            "https://www.meetup.com/",
//            "Meetup",
//            "FALSE",
//            "meetup"
//         ],
//         [
//            "NOLOGO",
//            "https://www.cellufun.com/games.asp",
//            "https://www.cellufun.com/games.asp",
//            "Cellufun",
//            "FALSE",
//            "cellufun"
//         ],
//         [
//            "NOLOGO",
//            "https://www.classmates.com/",
//            "https://www.classmates.com/",
//            "Classmates",
//            "FALSE",
//            "classmates"
//         ],
//         [
//            "NOLOGO",
//            "https://www.girlsaskguys.com/",
//            "https://www.girlsaskguys.com/",
//            "Gag",
//            "FALSE",
//            "gag"
//         ],
//         [
//            "NOLOGO",
//            "https://www.quora.com/",
//            "https://www.quora.com/",
//            "Quora",
//            "FALSE",
//            "quora"
//         ],
//         [
//            "NOLOGO",
//            "https://stackoverflow.com/users/login",
//            "https://stackoverflow.com/users/login",
//            "Stackoverflow",
//            "FALSE",
//            "stackoverflow"
//         ],
//         [
//            "NOLOGO",
//            "https://www.gaia.com/",
//            "https://www.gaia.com/",
//            "Gaia",
//            "FALSE",
//            "gaia"
//         ],
//         [
//            "NOLOGO",
//            "https://www.warriorforum.com/",
//            "https://www.warriorforum.com/",
//            "Warriorforum",
//            "FALSE",
//            "warriorforum"
//         ],
//         [
//            "NOLOGO",
//            "https://androidforums.com/",
//            "https://androidforums.com/",
//            "Androidforum",
//            "FALSE",
//            "androidforum"
//         ],
//         [
//            "NOLOGO",
//            "https://www.digitalpoint.com/",
//            "https://www.digitalpoint.com/",
//            "Digital",
//            "FALSE",
//            "digital"
//         ],
//         [
//            "NOLOGO",
//            "https://www.livejournal.com/",
//            "https://www.livejournal.com/",
//            "Livejournal",
//            "FALSE",
//            "livejournal"
//         ],
//         [
//            "NOLOGO",
//            "https://www.metafilter.com/",
//            "https://www.metafilter.com/",
//            "Metafilter",
//            "FALSE",
//            "metafilter"
//         ],
//         [
//            "NOLOGO",
//            "https://i.fluther.com/",
//            "https://i.fluther.com/",
//            "Fluther",
//            "FALSE",
//            "fluther"
//         ],
//         [
//            "NOLOGO",
//            "https://www.pinterest.com/login/",
//            "https://www.pinterest.com/login/",
//            "Pinterest",
//            "FALSE",
//            "pinterest"
//         ],
//         [
//            "NOLOGO",
//            "https://www.tumblr.com/",
//            "https://www.tumblr.com/",
//            "Tumblr",
//            "FALSE",
//            "tumblr"
//         ],
//         [
//            "NOLOGO",
//            "https://www.stumbleupon.com/",
//            "https://www.stumbleupon.com/",
//            "Stumbleupon",
//            "FALSE",
//            "stumbleupon"
//         ],
//         [
//            "NOLOGO",
//            "https://www.google.com/intl/en-GB/gmail/about/#",
//            "https://www.google.com/intl/en-GB/gmail/about/#",
//            "Delicious",
//            "FALSE",
//            "delicious"
//         ],
//         [
//            "NOLOGO",
//            "https://www.houzz.in/",
//            "https://www.houzz.in/",
//            "Houzz",
//            "FALSE",
//            "houzz"
//         ],
//         [
//            "NOLOGO",
//            "http://whisper.sh/",
//            "http://whisper.sh/",
//            "Whisper",
//            "FALSE",
//            "whisper"
//         ],
//         [
//            "NOLOGO",
//            "https://amp.flipboard.com/",
//            "https://amp.flipboard.com/",
//            "Flipboard",
//            "FALSE",
//            "flipboard"
//         ],
//         [
//            "NOLOGO",
//            "https://www.flickr.com/",
//            "https://www.flickr.com/",
//            "Flickr",
//            "FALSE",
//            "flickr"
//         ],
//         [
//            "NOLOGO",
//            "https://hubpages.com/",
//            "https://hubpages.com/",
//            "Hubpages",
//            "FALSE",
//            "hubpages"
//         ],
//         [
//            "NOLOGO",
//            "https://paytm.com/",
//            "https://paytm.com/",
//            "Paytmwallet",
//            "FALSE",
//            "paytmwallet"
//         ],
//         [
//            "NOLOGO",
//            "https://m.mobikwik.com/",
//            "https://m.mobikwik.com/",
//            "Mobikwik",
//            "FALSE",
//            "mobikwik"
//         ],
//         [
//            "NOLOGO",
//            "https://www.freecharge.in/",
//            "https://www.freecharge.in/",
//            "Freecharge",
//            "FALSE",
//            "freecharge"
//         ],
//         [
//            "NOLOGO",
//            "https://www.jio.com/en-in/apps/my-jio",
//            "https://www.jio.com/en-in/apps/my-jio",
//            "Myjio",
//            "FALSE",
//            "myjio"
//         ],
//         [
//            "NOLOGO",
//            "https://www.airtel.in/s/selfcare?normalLogin",
//            "https://www.airtel.in/s/selfcare?normalLogin",
//            "Myairtel",
//            "FALSE",
//            "myairtel"
//         ],
//         [
//            "NOLOGO",
//            "https://m.justrechargeit.com/",
//            "https://m.justrechargeit.com/",
//            "Justrecharge",
//            "FALSE",
//            "justrecharge"
//         ],
//         [
//            "NOLOGO",
//            "https://www.amazon.in/gp/sva/dashboard",
//            "https://amzn.to/2XjCBz5",
//            "Amazonpay",
//            "TRUE",
//            "amazonpay"
//         ],
//         [
//            "NOLOGO",
//            "https://discover.vodafone.in/myvodafone-app",
//            "https://discover.vodafone.in/myvodafone-app",
//            "Vodafone",
//            "FALSE",
//            "vodafone"
//         ],
//         [
//            "NOLOGO",
//            "https://www.oxigenwallet.com/",
//            "https://www.oxigenwallet.com/",
//            "Oxigen",
//            "FALSE",
//            "oxigen"
//         ],
//         [
//            "NOLOGO",
//            "https://www.ideacellular.com/my-idea-app",
//            "https://www.ideacellular.com/my-idea-app",
//            "Ideamoney",
//            "FALSE",
//            "ideamoney"
//         ],
//         [
//            "NOLOGO",
//            "https://onboarding.payumoney.com/app/account",
//            "https://onboarding.payumoney.com/app/account",
//            "Payumoney",
//            "FALSE",
//            "payumoney"
//         ],
//         [
//            "NOLOGO",
//            "https://www.olamoney.com/",
//            "https://www.olamoney.com/",
//            "Olamoney",
//            "FALSE",
//            "olamoney"
//         ],
//         [
//            "NOLOGO",
//            "https://www.bsnl.co.in/",
//            "https://www.bsnl.co.in/",
//            "Bsnl",
//            "FALSE",
//            "bsnl"
//         ],
//         [
//            "NOLOGO",
//            "https://www.airtel.in/digital-tv",
//            "https://www.airtel.in/digital-tv",
//            "Airteldigitaltv",
//            "FALSE",
//            "airteldigitaltv"
//         ],
//         [
//            "NOLOGO",
//            "https://www.dishtv.in/",
//            "https://www.dishtv.in/",
//            "Dishtv",
//            "FALSE",
//            "dishtv"
//         ],
//         [
//            "NOLOGO",
//            "https://www.d2h.com/",
//            "https://www.d2h.com/",
//            "Videocondtwoh",
//            "FALSE",
//            "videocondtwoh"
//         ],
//         [
//            "NOLOGO",
//            "https://www.tatasky.com/wps/portal",
//            "https://www.tatasky.com/wps/portal",
//            "Tatasky",
//            "FALSE",
//            "tatasky"
//         ],
//         [
//            "NOLOGO",
//            "https://www.sundirect.in/",
//            "https://www.sundirect.in/",
//            "Sundirect",
//            "FALSE",
//            "sundirect"
//         ],
//         [
//            "NOLOGO",
//            "https://www.swiggy.com/",
//            "https://www.swiggy.com/",
//            "Swiggy",
//            "FALSE",
//            "swiggy"
//         ],
//         [
//            "NOLOGO",
//            "https://www.zomato.com/ncr",
//            "https://www.zomato.com/ncr",
//            "Zomato",
//            "FALSE",
//            "zomato"
//         ],
//         [
//            "NOLOGO",
//            "http://www.foodpanda.in/",
//            "http://www.foodpanda.in/",
//            "Foodpanda",
//            "FALSE",
//            "foodpanda"
//         ],
//         [
//            "NOLOGO",
//            "https://m.dominos.co.in/menu?categoryId=2",
//            "https://m.dominos.co.in/menu?categoryId=2",
//            "Dominos",
//            "FALSE",
//            "dominos"
//         ],
//         [
//            "NOLOGO",
//            "https://www.pizzahut.co.in/",
//            "https://ad.admitad.com/g/ih45tqwxl5e86622ac64170aa892f2/",
//            "Pizzahut",
//            "TRUE",
//            "pizzahut"
//         ],
//         [
//            "NOLOGO",
//            "https://order.faasos.io/",
//            "https://ad.admitad.com/g/nknpm3sq5ce86622ac64264a89c4b2/",
//            "Faasos",
//            "FALSE",
//            "faasos"
//         ],
//         [
//            "NOLOGO",
//            "https://online.kfc.co.in/home",
//            "https://online.kfc.co.in/home",
//            "Kfc",
//            "FALSE",
//            "kfc"
//         ],
//         [
//            "NOLOGO",
//            "https://www.mcdelivery.co.in/order/burgers-wraps",
//            "https://ad.admitad.com/g/amg5q1j3lge86622ac640e6a7d725a/",
//            "Mcd",
//            "TRUE",
//            "mcd"
//         ],
//         [
//            "NOLOGO",
//            "https://www.ubereats.com/in",
//            "https://www.ubereats.com/in",
//            "Ubereats",
//            "FALSE",
//            "ubereats"
//         ],
//         [
//            "NOLOGO",
//            "https://www.behrouzbiryani.com/",
//            "https://ad.admitad.com/g/vcx4e8eeq9e86622ac648649ecd430/",
//            "Behrouz",
//            "FALSE",
//            "behrouz"
//         ],
//         [
//            "NOLOGO",
//            "https://www.swiggy.com/",
//            "https://www.swiggy.com/",
//            "Tastykhana",
//            "FALSE",
//            "tastykhana"
//         ],
//         [
//            "NOLOGO",
//            "https://www.just-eat.com/",
//            "https://www.just-eat.com/",
//            "Justeat",
//            "FALSE",
//            "justeat"
//         ],
//         [
//            "NOLOGO",
//            "https://www.swiggy.com/",
//            "https://www.swiggy.com/",
//            "Foodmingo",
//            "FALSE",
//            "foodmingo"
//         ],
//         [
//            "NOLOGO",
//            "https://www.foodchow.com/",
//            "https://www.foodchow.com/",
//            "Foodchow",
//            "FALSE",
//            "foodchow"
//         ],
//         [
//            "NOLOGO",
//            "https://www.chefkraft.com/",
//            "https://www.chefkraft.com/",
//            "Chefkraft",
//            "FALSE",
//            "chefkraft"
//         ],
//         [
//            "NOLOGO",
//            "https://www.freshmenu.com/",
//            "https://www.freshmenu.com/",
//            "Freshmenu",
//            "FALSE",
//            "freshmenu"
//         ],
//         [
//            "NOLOGO",
//            "https://brekkie.in/",
//            "https://brekkie.in/",
//            "Brekkie",
//            "FALSE",
//            "brekkie"
//         ],
//         [
//            "NOLOGO",
//            "https://www.swiggy.com/",
//            "https://www.swiggy.com/",
//            "Fortyeighteast",
//            "FALSE",
//            "fortyeighteast"
//         ],
//         [
//            "NOLOGO",
//            "http://m.readybowl.com/load_screen1.html",
//            "http://m.readybowl.com/load_screen1.html",
//            "Readybowl",
//            "FALSE",
//            "readybowl"
//         ],
//         [
//            "NOLOGO",
//            "https://www.masalabox.com/",
//            "https://www.masalabox.com/",
//            "Masalabox",
//            "FALSE",
//            "masalabox"
//         ],
//         [
//            "NOLOGO",
//            "https://box8.in/",
//            "https://box8.in/",
//            "Boxeight",
//            "FALSE",
//            "boxeight"
//         ],
//         [
//            "NOLOGO",
//            "https://www.swiggy.com/",
//            "https://www.swiggy.com/",
//            "Entree",
//            "FALSE",
//            "entree"
//         ],
//         [
//            "NOLOGO",
//            "https://www.caloriecare.com/",
//            "https://www.caloriecare.com/",
//            "Caloriecare",
//            "FALSE",
//            "caloriecare"
//         ],
//         [
//            "NOLOGO",
//            "http://www.ichef.in/cgi-sys/defaultwebpage.cgi",
//            "http://www.ichef.in/cgi-sys/defaultwebpage.cgi",
//            "Ichef",
//            "FALSE",
//            "ichef"
//         ],
//         [
//            "NOLOGO",
//            "https://www.pizzaexpress.com/",
//            "https://www.pizzaexpress.com/",
//            "Pizzaexpress",
//            "FALSE",
//            "pizzaexpress"
//         ],
//         [
//            "NOLOGO",
//            "https://burgundybox.in/products/served",
//            "https://burgundybox.in/products/served",
//            "Burgundybox",
//            "FALSE",
//            "burgundybox"
//         ],
//         [
//            "NOLOGO",
//            "https://m.holachef.com/",
//            "https://m.holachef.com/",
//            "Holachef",
//            "FALSE",
//            "holachef"
//         ],
//         [
//            "NOLOGO",
//            "https://www.foodcloud.in/",
//            "https://www.foodcloud.in/",
//            "Foodcloud",
//            "FALSE",
//            "foodcloud"
//         ],
//         [
//            "NOLOGO",
//            "http://www.frsh.com/#/",
//            "http://www.frsh.com/#/",
//            "Frsh",
//            "FALSE",
//            "frsh"
//         ],
//         [
//            "NOLOGO",
//            "https://www.swiggy.com/",
//            "https://www.swiggy.com/",
//            "Tpot",
//            "FALSE",
//            "tpot"
//         ],
//         [
//            "NOLOGO",
//            "https://www.makemytrip.com/",
//            "https://ad.admitad.com/g/uu693psu23e86622ac649814d2cd5d/",
//            "Makemytrip",
//            "TRUE",
//            "makemytrip"
//         ],
//         [
//            "NOLOGO",
//            "https://www.yatra.com/",
//            "https://www.yatra.com/",
//            "Yatra",
//            "FALSE",
//            "yatra"
//         ],
//         [
//            "NOLOGO",
//            "https://www.cleartrip.com/",
//            "https://ad.admitad.com/g/vbnovi30pqe86622ac64ed464edc45/",
//            "Cleartrip",
//            "TRUE",
//            "cleartrip"
//         ],
//         [
//            "NOLOGO",
//            "https://www.goibibo.com/",
//            "https://www.goibibo.com/",
//            "Goibibo",
//            "FALSE",
//            "goibibo"
//         ],
//         [
//            "NOLOGO",
//            "https://www.expedia.co.in/",
//            "https://linksredirect.com/?cid=76950&subid=kudrati&source=linkkit&url=https%3A%2F%2Fwww.expedia.co.in%2F",
//            "Expedia",
//            "FALSE",
//            "expedia"
//         ],
//         [
//            "NOLOGO",
//            "https://www.oyorooms.com/",
//            "https://ad.admitad.com/g/nmi7b62c7ye86622ac64053aa7676c/",
//            "Oyo",
//            "TRUE",
//            "oyo"
//         ],
//         [
//            "NOLOGO",
//            "https://www.thomascook.in/",
//            "https://www.thomascook.in/",
//            "Thomascook",
//            "FALSE",
//            "thomascook"
//         ],
//         [
//            "NOLOGO",
//            "https://in.musafir.com/",
//            "https://in.musafir.com/",
//            "Musafir",
//            "FALSE",
//            "musafir"
//         ],
//         [
//            "NOLOGO",
//            "https://www.travelguru.com/",
//            "https://www.travelguru.com/",
//            "Travelguru",
//            "FALSE",
//            "travelguru"
//         ],
//         [
//            "NOLOGO",
//            "https://www.ixigo.com/",
//            "https://www.ixigo.com/",
//            "Ixigo",
//            "FALSE",
//            "ixigo"
//         ],
//         [
//            "NOLOGO",
//            "https://www.tripadvisor.in/",
//            "https://www.tripadvisor.in/",
//            "Tripadvisor",
//            "FALSE",
//            "tripadvisor"
//         ],
//         [
//            "NOLOGO",
//            "https://www.booking.com/",
//            "https://www.booking.com/",
//            "Booking",
//            "FALSE",
//            "booking"
//         ],
//         [
//            "NOLOGO",
//            "https://in.hotels.com/",
//            "https://in.hotels.com/",
//            "Hotels",
//            "FALSE",
//            "hotels"
//         ],
//         [
//            "NOLOGO",
//            "https://www.agoda.com/en-in/?cid=1844104",
//            "https://linksredirect.com/?cid=76950&subid=kudrati&source=linkkit&url=https%3A%2F%2Fwww.agoda.com%2F",
//            "Agoda",
//            "TRUE",
//            "agoda"
//         ],
//         [
//            "NOLOGO",
//            "https://www.easemytrip.com/",
//            "https://www.easemytrip.com/",
//            "Easemytrip",
//            "FALSE",
//            "easemytrip"
//         ],
//         [
//            "NOLOGO",
//            "https://m.redbus.in/",
//            "https://m.redbus.in/",
//            "Redbus",
//            "FALSE",
//            "redbus"
//         ],
//         [
//            "NOLOGO",
//            "https://www.coxandkings.com/",
//            "https://www.coxandkings.com/",
//            "Coxandkings",
//            "FALSE",
//            "coxandkings"
//         ],
//         [
//            "NOLOGO",
//            "https://www.sotc.in/",
//            "https://www.sotc.in/",
//            "Sotc",
//            "FALSE",
//            "sotc"
//         ],
//         [
//            "NOLOGO",
//            "https://www.jetairways.com/",
//            "https://www.jetairways.com/",
//            "Jetairways",
//            "FALSE",
//            "jetairways"
//         ],
//         [
//            "NOLOGO",
//            "https://www.airasia.com/en/gb",
//            "https://linksredirect.com/?cid=76950&subid=kudrati&source=linkkit&url=https%3A%2F%2Fwww.airasia.com%2Fen%2Fgb",
//            "Airasia",
//            "FALSE",
//            "airasia"
//         ],
//         [
//            "NOLOGO",
//            "https://www.irctc.co.in/nget/",
//            "https://www.irctc.co.in/nget/",
//            "Irctc",
//            "FALSE",
//            "irctc"
//         ],
//         [
//            "NOLOGO",
//            "https://www.trivago.in/",
//            "https://www.trivago.in/",
//            "Trivago",
//            "FALSE",
//            "trivago"
//         ],
//         [
//            "NOLOGO",
//            "paytm.com",
//            "https://linksredirect.com/?cid=76950&subid=kudrati&source=linkkit&url=https%3A%2F%2Fpaytm.com",
//            "Paytm",
//            "FALSE",
//            "paytm"
//         ],
//         [
//            "NOLOGO",
//            "https://www.abhibus.com/mobile/",
//            "https://www.abhibus.com/mobile/",
//            "Abhibus",
//            "FALSE",
//            "abhibus"
//         ],
//         [
//            "NOLOGO",
//            "https://m.ticketnew.com/",
//            "https://m.ticketnew.com/",
//            "Ticketnew",
//            "FALSE",
//            "ticketnew"
//         ],
//         [
//            "NOLOGO",
//            "https://www.mybustickets.in/",
//            "https://www.mybustickets.in/",
//            "Mybustickets",
//            "FALSE",
//            "mybustickets"
//         ],
//         [
//            "NOLOGO",
//            "https://busindia.com/",
//            "https://busindia.com/",
//            "Busindia",
//            "FALSE",
//            "busindia"
//         ],
//         [
//            "NOLOGO",
//            "https://www.hotstar.com/in",
//            "https://www.hotstar.com/in",
//            "Hotstar",
//            "FALSE",
//            "hotstar"
//         ],
//         [
//            "NOLOGO",
//            "https://www.netflix.com/in/login",
//            "https://www.netflix.com/in/login",
//            "Netflix",
//            "FALSE",
//            "netflix"
//         ],
//         [
//            "NOLOGO",
//            "https://www.primevideo.com/",
//            "https://www.primevideo.com/",
//            "Amazonprime",
//            "FALSE",
//            "amazonprime"
//         ],
//         [
//            "NOLOGO",
//            "https://www.jiocinema.com/",
//            "https://www.jiocinema.com/",
//            "Jiocinema",
//            "FALSE",
//            "jiocinema"
//         ],
//         [
//            "NOLOGO",
//            "https://hooq.tv/in",
//            "https://hooq.tv/in",
//            "Hooq",
//            "FALSE",
//            "hooq"
//         ],
//         [
//            "NOLOGO",
//            "https://www.voot.com/",
//            "https://www.voot.com/",
//            "Voot",
//            "FALSE",
//            "voot"
//         ],
//         [
//            "NOLOGO",
//            "https://www.sonyliv.com/",
//            "https://www.sonyliv.com/",
//            "Sonyliv",
//            "FALSE",
//            "sonyliv"
//         ],
//         [
//            "NOLOGO",
//            "https://erosnow.com/",
//            "https://erosnow.com/",
//            "Erosnow",
//            "FALSE",
//            "erosnow"
//         ],
//         [
//            "NOLOGO",
//            "https://www.zee5.com/",
//            "https://www.zee5.com/",
//            "Zeefive",
//            "FALSE",
//            "zeefive"
//         ],
//         [
//            "NOLOGO",
//            "https://www.altbalaji.com/",
//            "https://linksredirect.com/?cid=76950&subid=kudrati&source=linkkit&url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.balaji.alt",
//            "Altbalaji",
//            "FALSE",
//            "altbalaji"
//         ],
//         [
//            "NOLOGO",
//            "https://tvfplay.com/",
//            "https://tvfplay.com/",
//            "Tvfplay",
//            "FALSE",
//            "tvfplay"
//         ],
//         [
//            "NOLOGO",
//            "https://www.hungama.com/",
//            "https://ad.admitad.com/g/suh022kmjee86622ac64f9a6e9f0ba/",
//            "Hungama",
//            "TRUE",
//            "hungama"
//         ],
//         [
//            "NOLOGO",
//            "https://spuul.com/",
//            "https://spuul.com/",
//            "Spuul",
//            "FALSE",
//            "spuul"
//         ],
//         [
//            "NOLOGO",
//            "https://www.dailymotion.com/",
//            "https://www.dailymotion.com/",
//            "Dailymotion",
//            "FALSE",
//            "dailymotion"
//         ],
//         [
//            "NOLOGO",
//            "https://www.yupptv.com/",
//            "https://www.yupptv.com/",
//            "Yupptv",
//            "FALSE",
//            "yupptv"
//         ]
//       ]
//     let sqlss = "INSERT INTO all_in_one (storeIcon,sNLink,sALink,storeN,isAffiliated,storeID) VALUES ?";
//               console.log('sqlss: ', sqlss);
//               connection.query(sqlss,[values], function (err, rides) {
//                 if (err) {
//                   return nextCall({
//                     "message": "something went wrong",
//                   });
//                 }
//         nextCall(null,rides);
//               })
//     },
//   ], function (err, response) {
//     if (err) {
//       return res.send({
//         status: err.code ? err.code : 400,
//         message: (err && err.msg) || "someyhing went wrong"
//       });
//     }
//     return res.send({
//       status_code: 200,
//       message: "telegrame post create sucessfully",
//       data: response
//     });
//   })
// });

router.get('/allinoneapp', function (req, res, next) {
  async.waterfall([
    function (nextCall) {
    let sqlss = "SELECT * FROM all_in_one ";
      console.log('sqlss: ', sqlss);
      connection.query(sqlss, function (err, rides) {
        if (err) {
          return nextCall({
            "message": "something went wrong",
          });
        }
      nextCall(null,rides);
      })
    },
  ], function (err, response) {
    if (err) {
      return res.send({
        status: err.code ? err.code : 400,
        message: (err && err.msg) || "someyhing went wrong"
      });
    }
    return res.send({
      data: response
    });
  })
});




// router.get('/whatsapp_posts', function (req, res, next) {
//   async.waterfall([
//     function (nextCall) {
//       console.log('req.param: ', req.query);

//       if(req.query.apiKey && req.query.productId){
//         config.apiKey = req.query.apiKey;
//         config.productId = req.query.productId;
//         let requestHeaders1 = {
//           "Content-Type": "application/json",
//           "accept": "application/json",
//           "x-maytapi-key": config.apiKey
//         }
//         request({
//           uri: "https://api.maytapi.com/api/" + config.productId + "/listPhones",
//           method: "GET",
//           // body: JSON.stringify(linkRequest1),
//           headers: requestHeaders1
//         }, (err, response, body) => {
//           let link = JSON.parse(body);
//           config.phoneId = req.query.phoneId;
//           nextCall(null, link);
//         })
//       }else{
//         nextCall(null, "demo");
//       }

//     },function (bodyss,nextCall) {
//       let arrayGroupNumber =[
//         {
//           "name": "Amazon Offer Alert - 1🛍🛒🔥",
//           "id": "916353594230-1570365608@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 2🛍🛒🔥",
//           "id": "916353594230-1570379159@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 3🛍🛒🔥",
//           "id": "916353594230-1570969831@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 4🛍🛒🔥",
//           "id": "916353594230-1570971252@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -5🛍🛒🔥",
//           "id": "916353594230-1571493437@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 6🛍🛒🔥",
//           "id": "916353594230-1571491746@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 7🛍🛒🔥",
//           "id": "916353594230-1571491944@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 8🛍🛒🔥",
//           "id": "916353594230-1571493106@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 9🛍🛒🔥",
//           "id": "916353594230-1571493284@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -10🛍🛒🔥",
//           "id": "916353594230-1574959445@g.us"
//         }
//       ]

//       for(let i =0 ; i < arrayGroupNumber.length ; i++){
//       let requestHeaders1 = {
//         "Content-Type": "application/json",
//         "accept": "application/json",
//         "x-maytapi-key": config.apiKey
//       }

//       let linkRequest1 = {
//         "to_number": arrayGroupNumber[i].id,
//         "type": "text",
//         "message": '🛍 ' +decodeURI(encodeURI(req.query.message))
//       }

//       request({
//         uri: "https://api.maytapi.com/api/" + config.productId + "/"+ config.phoneId+"/sendMessage",
//         method: "POST",
//         body: JSON.stringify(linkRequest1),
//         headers: requestHeaders1
//       }, (err, response, body) => {
//         let link = JSON.parse(body);
//       })
//     }
//     nextCall(null,bodyss);
//     },
//   ], function (err, response) {
//     if (err) {
//       return res.send({
//         status: err.code ? err.code : 400,
//         message: (err && err.msg) || "someyhing went wrong"
//       });
//     }
//     return res.send({
//       status_code: 200,
//       message: "telegrame post create sucessfully",
//       data: response
//     });
//   })
// });

// router.get('/whatsapp_posts', function (req, res, next) {
//   async.waterfall([
//     function (nextCall) {
//       let arrayGroupNumber = [
//         {
//           "name": "Amazon Offer Alert - 1🛍🛒🔥",
//           "id": "916353594230-1570365608@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 2🛍🛒🔥",
//           "id": "916353594230-1570379159@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 3🛍🛒🔥",
//           "id": "916353594230-1570969831@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 4🛍🛒🔥",
//           "id": "916353594230-1570971252@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -5🛍🛒🔥",
//           "id": "916353594230-1571493437@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 6🛍🛒🔥",
//           "id": "916353594230-1571491746@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 7🛍🛒🔥",
//           "id": "916353594230-1571491944@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 8🛍🛒🔥",
//           "id": "916353594230-1571493106@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 9🛍🛒🔥",
//           "id": "916353594230-1571493284@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -10🛍🛒🔥",
//           "id": "916353594230-1574959445@g.us"
//         }
//       ]

//       const months = ["🛍 ", "🛒 ", "🔥 ", "💰 ", "🛍️ ", "🤑 ", "🏷️ ", "💳 ", "🎟️ "];
//       const randomMonth = months[Math.floor(Math.random() * months.length)];


//       for (let i = 0; i < arrayGroupNumber.length; i++) {
//         let requestHeaders1 = {
//           "Content-Type": "application/json",
//           "accept": "application/json",
//           "x-maytapi-key": req.query.apiKey
//         }

//         let linkRequest1 = {
//           "to_number": arrayGroupNumber[i].id,
//           "type": "text",
//           "message": randomMonth + decodeURI(encodeURI(req.query.message))
//         }

//         request({
//           uri: "https://api.maytapi.com/api/" + req.query.productId + "/" + req.query.phoneId + "/sendMessage",
//           method: "POST",
//           body: JSON.stringify(linkRequest1),
//           headers: requestHeaders1
//         }, (err, response, body) => {
//           let link = JSON.parse(body);
//         })
//       }
//       nextCall(null, "demo");
//     },
//   ], function (err, response) {
//     if (err) {
//       return res.send({
//         status: err.code ? err.code : 400,
//         message: (err && err.msg) || "someyhing went wrong"
//       });
//     }
//     return res.send({
//       status_code: 200,
//       message: "telegrame post create sucessfully",
//       data: response
//     });
//   })
// });

// router.get('/whatsapp_posts', function (req, res, next) {
//   async.waterfall([
//     function (nextCall) {
//       let arrayGroupNumber = [
//         {
//           "name": "Amazon Offer Alert - 1🛍🛒🔥",
//           "id": "916353594230-1570365608@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 2🛍🛒🔥",
//           "id": "916353594230-1570379159@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 3🛍🛒🔥",
//           "id": "916353594230-1570969831@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 4🛍🛒🔥",
//           "id": "916353594230-1570971252@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -5🛍🛒🔥",
//           "id": "916353594230-1571493437@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 6🛍🛒🔥",
//           "id": "916353594230-1571491746@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 7🛍🛒🔥",
//           "id": "916353594230-1571491944@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 8🛍🛒🔥",
//           "id": "916353594230-1571493106@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 9🛍🛒🔥",
//           "id": "916353594230-1571493284@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -10🛍🛒🔥",
//           "id": "916353594230-1574959445@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 11🛍🛒🔥",
//           "id": "916353594230-1574959195@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 12🛍🛒🔥",
//           "id": "918160515625-1584094851@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 13🛍🛒🔥",
//           "id": "916353594230-1584971104@g.us"
//         }
//       ]

//       const months = ["🛍 ", "🛒 ", "🔥 ", "💰 ", "🛍️ ", "🤑 ", "🏷️ ", "💳 ", "🎟️ ","📦 ","😍 ","🕯 ","🍂 ","🎌 ","👑 ","🎊 ","🐦 ","⛄ "];
//       const randomMonth = months[Math.floor(Math.random() * months.length)];


//       // for (let i = 0; i < arrayGroupNumber.length; i++) {
//         var ggff = req.query.message;
//         if(ggff != 'null' && ggff != 'undefined' ){
//         let requestHeaders1 = {
//           "Content-Type": "application/json",
//           "accept": "application/json",
//           "x-maytapi-key": req.query.apiKey
//         }

//         let linkRequest1 = {
//           // "to_number": arrayGroupNumber[i].id,
//           "to_number": '919163549116-1560880019@g.us',
//           "type": "text",
//           "message": randomMonth + req.query.message
//         }

//         request({
//           uri: "https://api.maytapi.com/api/" + req.query.productId + "/" + req.query.phoneId + "/sendMessage",
//           method: "POST",
//           body: JSON.stringify(linkRequest1),
//           headers: requestHeaders1
//         }, (err, response, body) => {
//           let link = JSON.parse(body);
//         })
//       }
//     // }
//       nextCall(null, "demo");
//     },function (bodyss,nextCall) {
//     let arrayGroupNumber = [
//       {
//         "name": "Amazon Offer Alert - 14🛍🛒🔥",
//         "id": "916353594230-1584971346@g.us"
//       },
//       {
//         "name": "Amazon Offer Alert -15🛍🛒🔥",
//         "id": "916353594230-1584971429@g.us"
//       },
//       {
//         "name": "Amazon Offer Alert - 16🛍🛒🔥",
//         "id": "916353594230-1584971505@g.us"
//       },
//       {
//         "name": "Amazon Offer Alert - 17🛍🛒🔥",
//         "id": "916353594230-1584971569@g.us"
//       },
//       {
//         "name": "Amazon Offer Alert - 18🛍🛒🔥",
//         "id": "916353594230-1584971645@g.us"
//       },
//       {
//         "name": "Amazon Offer Alert - 19🛍🛒🔥",
//         "id": "916353594230-1584971700@g.us"
//       },
//       {
//         "name": "Amazon Offer Alert -20🛍🛒🔥",
//         "id": "916353594230-1584971760@g.us"
//       },
//       {
//         "name": "Amazon Offer Alert - 21🛍🛒🔥",
//         "id": "916353594230-1585500064@g.us"
//       },
//       {
//         "name": "Amazon Offer Alert - 22🛍🛒🔥",
//         "id": "916353594230-1585500152@g.us"
//       },
//       {
//         "name": "Amazon Offer Alert - 23🛍🛒🔥",
//         "id": "916353594230-1585500294@g.us"
//       },
//       {
//         "name": "Amazon Offer Alert - 24🛍🛒🔥",
//         "id": "916353594230-1585500401@g.us"
//       },
//       {
//         "name": "Amazon Offer Alert -25🛍🛒🔥",
//         "id": "916353594230-1585500459@g.us"
//       },
//       {
//         "name": "Amazon Offer Alert - 26🛍🛒🔥",
//         "id": "916353594230-1585500516@g.us"
//       }
//     ]

//     const months = ["🛍 ", "🛒 ", "🔥 ", "💰 ", "🛍️ ", "🤑 ", "🏷️ ", "💳 ", "🎟️ ","📦 ","😍 ","🕯 ","🍂 ","🎌 ","👑 ","🎊 ","🐦 ","⛄ "];
//     const randomMonth = months[Math.floor(Math.random() * months.length)];


//     // for (let i = 0; i < arrayGroupNumber.length; i++) {
//       var ggff = req.query.message;
//       if(ggff != 'null' && ggff != 'undefined' ){
//       let requestHeaders1 = {
//         "Content-Type": "application/json",
//         "accept": "application/json",
//         "x-maytapi-key": req.query.apiKey
//       }

//       let linkRequest1 = {
//         "to_number": '918886899206-1511623557@g.us',
//         // "to_number": arrayGroupNumber[i].id,
//         "type": "text",
//         "message": randomMonth + req.query.message
//       }

//       request({
//         uri: "https://api.maytapi.com/api/" + req.query.productId + "/" + req.query.phoneId + "/sendMessage",
//         method: "POST",
//         body: JSON.stringify(linkRequest1),
//         headers: requestHeaders1
//       }, (err, response, body) => {
//         let link = JSON.parse(body);
//       })
//     }
//   // }
//     nextCall(null, "demo2");
// },function (bodyss,nextCall) {
//   let arrayGroupNumber = [
//     {
//       "name": "Amazon Offer Alert - 27🛍🛒🔥",
//       "id": "916353594230-1585500571@g.us"
//     },
//     {
//       "name": "Amazon Offer Alert - 28🛍🛒🔥",
//       "id": "916353594230-1585500621@g.us"
//     },
//     {
//       "name": "Amazon Offer Alert - 29🛍🛒🔥",
//       "id": "916353594230-1585500662@g.us"
//     },
//     {
//       "name": "Amazon Offer Alert -30🛍🛒🔥",
//       "id": "916353594230-1585500710@g.us"
//     },
//     {
//       "name": "Amazon Offer Alert - 31🛍🛒🔥",
//       "id": "916353594230-1585500765@g.us"
//     },
//     {
//       "name": "Amazon Offer Alert - 32🛍🛒🔥",
//       "id": "916353594230-1585500810@g.us"
//     },
//     {
//       "name": "Amazon Offer Alert - 33🛍🛒🔥",
//       "id": "916353594230-1585500852@g.us"
//     },
//     {
//       "name": "Amazon Offer Alert - 34🛍🛒🔥",
//       "id": "916353594230-1585500904@g.us"
//     },
//     {
//       "name": "Amazon Offer Alert -35🛍🛒🔥",
//       "id": "916353594230-1585500963@g.us"
//     },
//     {
//       "name": "Amazon Offer Alert - 36🛍🛒🔥",
//       "id": "916353594230-1585501019@g.us"
//     },
//     {
//       "name": "Amazon Offer Alert - 37🛍🛒🔥",
//       "id": "916353594230-1585501066@g.us"
//     },
//     {
//       "name": "Amazon Offer Alert - 38🛍🛒🔥",
//       "id": "916353594230-1585501108@g.us"
//     },
//     {
//       "name": "Amazon Offer Alert - 39🛍🛒🔥",
//       "id": "916353594230-1585501191@g.us"
//     },
//     {
//       "name": "Amazon Offer Alert -40🛍🛒🔥",
//       "id": "916353594230-1585501240@g.us"
//     }
//   ]

//   const months = ["🛍 ", "🛒 ", "🔥 ", "💰 ", "🛍️ ", "🤑 ", "🏷️ ", "💳 ", "🎟️ ","📦 ","😍 ","🕯 ","🍂 ","🎌 ","👑 ","🎊 ","🐦 ","⛄ "];
//   const randomMonth = months[Math.floor(Math.random() * months.length)];


//   // for (let i = 0; i < arrayGroupNumber.length; i++) {
//     var ggff = req.query.message;
//     if(ggff != 'null' && ggff != 'undefined' ){
//     let requestHeaders1 = {
//       "Content-Type": "application/json",
//       "accept": "application/json",
//       "x-maytapi-key": req.query.apiKey
//     }

//     let linkRequest1 = {
//       "to_number": '919721888056-1468588050@g.us',
//       // "to_number": arrayGroupNumber[i].id,
//       "type": "text",
//       "message": randomMonth + req.query.message
//     }

//     request({
//       uri: "https://api.maytapi.com/api/" + req.query.productId + "/" + req.query.phoneId + "/sendMessage",
//       method: "POST",
//       body: JSON.stringify(linkRequest1),
//       headers: requestHeaders1
//     }, (err, response, body) => {
//       let link = JSON.parse(body);
//     })
//   }
//   // }
//   nextCall(null, "demo3");
// },
//   ], function (err, response) {
//     if (err) {
//       return res.send({
//         status: err.code ? err.code : 400,
//         message: (err && err.msg) || "someyhing went wrong"
//       });
//     }
//     return res.send({
//       status_code: 200,
//       message: "telegrame post create sucessfully",
//       data: response
//     });
//   })
// });




router.get('/whatsapp_posts', function (req, res, next) {
  async.parallel({
    task : function (nextCall) {
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
        },
        {
          "name": "Amazon Offer Alert - 13🛍🛒🔥",
          "id": "916353594230-1584971104@g.us"
        }
      ]

      const months = ["🛍 ", "🛒 ", "🔥 ", "💰 ", "🛍️ ", "🤑 ", "🏷️ ", "💳 ", "🎟️ ","📦 ","😍 ","🕯 ","🍂 ","🎌 ","👑 ","🎊 ","🐦 ","⛄ "];
      const randomMonth = months[Math.floor(Math.random() * months.length)];


      // for (let i = 0; i < arrayGroupNumber.length; i++) {
        var ggff = req.query.message;
        if(ggff != 'null' && ggff != 'undefined' ){
        let requestHeaders1 = {
          "Content-Type": "application/json",
          "accept": "application/json",
          "x-maytapi-key": req.query.apiKey
        }

        let linkRequest1 = {
          // "to_number": arrayGroupNumber[i].id,
          "to_number": '919163549116-1560880019@g.us',
          "type": "text",
          "message": randomMonth + req.query.message
        }

        request({
          uri: "https://api.maytapi.com/api/" + req.query.productId + "/" + req.query.phoneId + "/sendMessage",
          method: "POST",
          body: JSON.stringify(linkRequest1),
          headers: requestHeaders1
        }, (err, response, body) => {
          let link = JSON.parse(body);
        })
      }
    // }
      nextCall(null, "demo");
    },
    task1 :function (nextCall) {
    let arrayGroupNumber = [
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
      },
      {
        "name": "Amazon Offer Alert -25🛍🛒🔥",
        "id": "916353594230-1585500459@g.us"
      },
      {
        "name": "Amazon Offer Alert - 26🛍🛒🔥",
        "id": "916353594230-1585500516@g.us"
      }
    ]

    const months = ["🛍 ", "🛒 ", "🔥 ", "💰 ", "🛍️ ", "🤑 ", "🏷️ ", "💳 ", "🎟️ ","📦 ","😍 ","🕯 ","🍂 ","🎌 ","👑 ","🎊 ","🐦 ","⛄ "];
    const randomMonth = months[Math.floor(Math.random() * months.length)];


    // for (let i = 0; i < arrayGroupNumber.length; i++) {
      var ggff = req.query.message;
      if(ggff != 'null' && ggff != 'undefined' ){
      let requestHeaders1 = {
        "Content-Type": "application/json",
        "accept": "application/json",
        "x-maytapi-key": req.query.apiKey
      }

      let linkRequest1 = {
        "to_number": '918886899206-1511623557@g.us',
        // "to_number": arrayGroupNumber[i].id,
        "type": "text",
        "message": randomMonth + req.query.message
      }

      request({
        uri: "https://api.maytapi.com/api/" + req.query.productId + "/" + req.query.phoneId + "/sendMessage",
        method: "POST",
        body: JSON.stringify(linkRequest1),
        headers: requestHeaders1
      }, (err, response, body) => {
        let link = JSON.parse(body);
      })
    }
  // }
    nextCall(null, "demo2");
    },
    task2 :function (nextCall) {
  let arrayGroupNumber = [
    {
      "name": "Amazon Offer Alert - 27🛍🛒🔥",
      "id": "916353594230-1585500571@g.us"
    },
    {
      "name": "Amazon Offer Alert - 28🛍🛒🔥",
      "id": "916353594230-1585500621@g.us"
    },
    {
      "name": "Amazon Offer Alert - 29🛍🛒🔥",
      "id": "916353594230-1585500662@g.us"
    },
    {
      "name": "Amazon Offer Alert -30🛍🛒🔥",
      "id": "916353594230-1585500710@g.us"
    },
    {
      "name": "Amazon Offer Alert - 31🛍🛒🔥",
      "id": "916353594230-1585500765@g.us"
    },
    {
      "name": "Amazon Offer Alert - 32🛍🛒🔥",
      "id": "916353594230-1585500810@g.us"
    },
    {
      "name": "Amazon Offer Alert - 33🛍🛒🔥",
      "id": "916353594230-1585500852@g.us"
    },
    {
      "name": "Amazon Offer Alert - 34🛍🛒🔥",
      "id": "916353594230-1585500904@g.us"
    },
    {
      "name": "Amazon Offer Alert -35🛍🛒🔥",
      "id": "916353594230-1585500963@g.us"
    },
    {
      "name": "Amazon Offer Alert - 36🛍🛒🔥",
      "id": "916353594230-1585501019@g.us"
    },
    {
      "name": "Amazon Offer Alert - 37🛍🛒🔥",
      "id": "916353594230-1585501066@g.us"
    },
    {
      "name": "Amazon Offer Alert - 38🛍🛒🔥",
      "id": "916353594230-1585501108@g.us"
    },
    {
      "name": "Amazon Offer Alert - 39🛍🛒🔥",
      "id": "916353594230-1585501191@g.us"
    },
    {
      "name": "Amazon Offer Alert -40🛍🛒🔥",
      "id": "916353594230-1585501240@g.us"
    }
  ]

  const months = ["🛍 ", "🛒 ", "🔥 ", "💰 ", "🛍️ ", "🤑 ", "🏷️ ", "💳 ", "🎟️ ","📦 ","😍 ","🕯 ","🍂 ","🎌 ","👑 ","🎊 ","🐦 ","⛄ "];
  const randomMonth = months[Math.floor(Math.random() * months.length)];


  // for (let i = 0; i < arrayGroupNumber.length; i++) {
    var ggff = req.query.message;
    if(ggff != 'null' && ggff != 'undefined' ){
    let requestHeaders1 = {
      "Content-Type": "application/json",
      "accept": "application/json",
      "x-maytapi-key": req.query.apiKey
    }

    let linkRequest1 = {
      "to_number": '919721888056-1468588050@g.us',
      // "to_number": arrayGroupNumber[i].id,
      "type": "text",
      "message": randomMonth + req.query.message
    }

    request({
      uri: "https://api.maytapi.com/api/" + req.query.productId + "/" + req.query.phoneId + "/sendMessage",
      method: "POST",
      body: JSON.stringify(linkRequest1),
      headers: requestHeaders1
    }, (err, response, body) => {
      let link = JSON.parse(body);
    })
  }
  // }
  nextCall(null, "demo3");
    },
}, function (err, response) {
    if (err) {
      return res.send({
        status: err.code ? err.code : 400,
        message: (err && err.msg) || "someyhing went wrong"
      });
    }
    return res.send({
      status_code: 200,
      message: "telegrame post create sucessfully",
      data: response
    });
  })
});
// router.get('/whatsapp_posts', function (req, res, next) {
//   async.waterfall([
//     function (nextCall) {
//       let arrayGroupNumber = [
//         {
//           "name": "Amazon Offer Alert - 1🛍🛒🔥",
//           "id": "916353594230-1570365608@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 2🛍🛒🔥",
//           "id": "916353594230-1570379159@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 3🛍🛒🔥",
//           "id": "916353594230-1570969831@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 4🛍🛒🔥",
//           "id": "916353594230-1570971252@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -5🛍🛒🔥",
//           "id": "916353594230-1571493437@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 6🛍🛒🔥",
//           "id": "916353594230-1571491746@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 7🛍🛒🔥",
//           "id": "916353594230-1571491944@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 8🛍🛒🔥",
//           "id": "916353594230-1571493106@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 9🛍🛒🔥",
//           "id": "916353594230-1571493284@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert -10🛍🛒🔥",
//           "id": "916353594230-1574959445@g.us"
//         }
//       ]

//       const months = ["🛍 ", "🛒 ", "🔥 ", "💰 ", "🛍️ ", "🤑 ", "🏷️ ", "💳 ", "🎟️ "];
//       const randomMonth = months[Math.floor(Math.random() * months.length)];


//       for (let i = 0; i < arrayGroupNumber.length; i++) {
//         let requestHeaders1 = {
//           "Content-Type": "application/json",
//           "accept": "application/json",
//         }

//         let linkRequest1 = {
//             "chatId": arrayGroupNumber[i].id,
//             "body": randomMonth + decodeURI(encodeURI(req.query.message))
//         }

//         request({
//           uri: "https://api.chat-api.com/instance109074/sendMessage?token=0xh48oclbsfv3zu3&_ga=2.130264071.962361358.1584778333-1227591583.1584778333",
//           method: "POST",
//           body: JSON.stringify(linkRequest1),
//           headers: requestHeaders1
//         }, (err, response, body) => {
//           let link = JSON.parse(body);
//         })
//       }
//       nextCall(null, "demo");
//     },
//   ], function (err, response) {
//     if (err) {
//       return res.send({
//         status: err.code ? err.code : 400,
//         message: (err && err.msg) || "someyhing went wrong"
//       });
//     }
//     return res.send({
//       status_code: 200,
//       message: "telegrame post create sucessfully",
//       data: response
//     });
//   })
// });

// router.get('/whatsapp_posts', function (req, res, next) {
//   async.waterfall([
//     function (nextCall) {
//       console.log('req.param: ', req.query);

//       if(req.query.apiKey && req.query.productId){
//         config.apiKey = req.query.apiKey;
//         config.productId = req.query.productId;
//         let requestHeaders1 = {
//           "Content-Type": "application/json",
//           "accept": "application/json",
//           "x-maytapi-key": config.apiKey
//         }
//         request({
//           uri: "https://api.maytapi.com/api/" + config.productId + "/listPhones",
//           method: "GET",
//           // body: JSON.stringify(linkRequest1),
//           headers: requestHeaders1
//         }, (err, response, body) => {
//           let link = JSON.parse(body);
//           config.phoneId = req.query.phoneId;
//           nextCall(null, link);
//         })
//       }else{
//         nextCall(null, "demo");
//       }

//     },function (bodyss,nextCall) {
//       let arrayGroupNumber =[
//         {
//           "name": "Amazon Offer Alert - 1🛍🛒🔥",
//           "id": "919163549116-1560880019@g.us"
//         },
//         {
//           "name": "Amazon Offer Alert - 2🛍🛒🔥",
//           "id": "918238154616-1498903589@g.us"
//         }
//       ]

//       for(let i =0 ; i < arrayGroupNumber.length ; i++){
//       let requestHeaders1 = {
//         "Content-Type": "application/json",
//         "accept": "application/json",
//         "x-maytapi-key": config.apiKey
//       }

//       let ggff = req.query.message;
//       if(ggff != 'null' && ggff != 'undefined' ){
//       let linkRequest1 = {
//         "to_number": arrayGroupNumber[i].id,
//         "type": "text",
//         "message": ggff
//       }

//       request({
//         uri: "https://api.maytapi.com/api/" + config.productId + "/"+ config.phoneId+"/sendMessage",
//         method: "POST",
//         body: JSON.stringify(linkRequest1),
//         headers: requestHeaders1
//       }, (err, response, body) => {
//         let link = JSON.parse(body);
//         // nextCall(null, bodyss);
//       })
//     }
//     }
//     nextCall(null, bodyss);

//     },
//   ], function (err, response) {
//     if (err) {
//       return res.send({
//         status: err.code ? err.code : 400,
//         message: (err && err.msg) || "someyhing went wrong"
//       });
//     }
//     return res.send({
//       status_code: 200,
//       message: "telegrame post create sucessfully",
//       data: response
//     });
//   })
// });
module.exports = router;



