var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const nytime_key = 'xiZ7gKTpIMZOhWIoTEYhYWGGV2S3VVAJ'
const guardian_key = '0b2a4b89-5aab-4f29-9679-9047b215cbad'
const Guardian_str = 'Guardian'
const NYTimes_str = 'NYTimes'
const home_str = 'home'
SOURCE = Guardian_str
const fetch = require('node-fetch')

// http://localhost:3001/source
router.get('/source',function(req, res, next) {
  ret = {source:SOURCE}
  ret = JSON.stringify(ret)
  res.send(ret)
})

router.post('/source/:sourceId', function(req, res, next) {
  let source = req.params.sourceId
  // console.log(source)
  SOURCE = source
})

// http:localhost:3001/news/Guardian/home
// http:localhost:3001/news/Guardian/world
// http:localhost:3001/news/NYTimes/home
// http:localhost:3001/news/NYTimes/world
// https://content.guardianapis.com/search?api-key=0b2a4b89-5aab-4f29-9679-9047b215cbad&section=(world|sport|business|technology|politics)&show-blocks=all
// https://content.guardianapis.com/world?api-key=0b2a4b89-5aab-4f29-9679-9047b215cbad&show-blocks=all
const guardian_news_base = 'https://content.guardianapis.com' 
const guardian_news_params = 'show-blocks=all&api-key='+guardian_key
const nytimes_news_base = 'https://api.nytimes.com/svc/topstories/v2/'
const nytimes_news_params = 'api-key=' + nytime_key
router.get('/news/:source/:section', function(req, res, next) {
  let source = req.params.source
  let section = req.params.section
  let request_url = null
  if(source===Guardian_str){
    if(section===home_str) {
      request_url = guardian_news_base+'/search?section=(world|sport|business|technology|politics)&'+guardian_news_params
    }
    else {
      request_url = guardian_news_base+'/'+section+'?'+guardian_news_params
    }
  }
  else {
    request_url = nytimes_news_base + section + '.json?' + nytimes_news_params
  }
  // console.log(request_url)
  fetch(request_url)
  .then(result=>result.json())
  .then(result=>res.json(result))
})

// http://localhost:3001/detail?source=Guardian&id=sport/2020/mar/31/rugby-australia-agm-financial-crisis
// http://localhost:3001/detail?source=NYTimes&id=https://www.nytimes.com/2020/03/29/world/coronavirus-live-news-updates.html
// https://content.guardianapis.com/sport/2020/mar/31/rugby-australia-agm-financial-crisis?api-key=0b2a4b89-5aab-4f29-9679-9047b215cbad&show-blocks=all
// https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("https://www.nytimes.com/2020/03/29/world/coronavirus-live-news-updates.html")&api-key=xiZ7gKTpIMZOhWIoTEYhYWGGV2S3VVAJ
const guardian_detail_base = 'https://content.guardianapis.com/'
const guardian_detail_params = guardian_news_params
const nytimes_detail_base = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'
const nytimes_detail_params = nytimes_news_params
router.get('/detail', function(req, res, next) {
  let source = req.query.source
  let id = req.query.id
  let request_url = null
  if(source==Guardian_str) {
    request_url = guardian_detail_base + id +'?' + guardian_detail_params
  }
  else {
    request_url = nytimes_detail_base + '?' + nytimes_detail_params + '&fq=web_url:(\"' + id + '\")'
  }
  // console.log(request_url)
  fetch(request_url)
  .then(result=>result.json())
  .then(result=>res.json(result))
})

// http://localhost:3001/search/coronavirus
// https://content.guardianapis.com/search?q=coronavirus&api-key=0b2a4b89-5aab-4f29-9679-9047b215cbad&show-blocks=all
const guardian_search_base = guardian_news_base + '/search'
const guardian_search_params = guardian_news_params
router.get('/search/:keyword', function(req, res, next) {
  let keyword = req.params.keyword
  let request_url = guardian_search_base + '?' + guardian_search_params + '&q=' + keyword
  // console.log(request_url)
  fetch(request_url)
  .then(result=>result.json())
  .then(result=>res.json(result))
})

// HW9

// https://content.guardianapis.com/search?order-by=newest&show-fields=starRating,headline,thumbnail,short-url&api-key=0b2a4b89-5aab-4f29-9679-9047b215cbad
// http://localhost:3001/latestNews
const guardian_latest_base = guardian_search_base
const guardian_latest_params = "order-by=newest&show-fields=starRating,headline,thumbnail,short-url&api-key=" + guardian_key
router.get('/latestNews', function (req, res, next) {
  let request_url = guardian_latest_base + "?" + guardian_latest_params;
  fetch(request_url)
  .then(result=>result.json())
  .then(result=>res.json(result))
})

// http://localhost:3001/trending/coronavirus
// http://100.68.76.31:3001/trending/coronavirus
const googleTrends = require("google-trends-api")
const startTime = new Date(2019,5,1)
router.get('/trending/:keyword', function(req, res, next) {
  let keyword = req.params.keyword
  googleTrends.interestOverTime({keyword:keyword, startTime:startTime})
  .then(result => {
      result = JSON.parse(result)
      res.json(result)
  })
})

module.exports = router;
