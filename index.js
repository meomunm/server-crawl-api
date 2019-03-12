//import thu vien
const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

const damMyURL = 'http://www.nettruyen.com/tim-truyen/dam-my';

async function getStoriesFromURL(url) {
  var browser = await puppeteer.launch();
  var page = await browser.newPage();
  await page.goto(url);

  const storySrcSet = await page.evaluate(() => {
    let storyLinks = Array.from(document.querySelectorAll('.item .image > a > img'));

    let articles = storyLinks.map(link => ({
      src: link.getAttribute('src'),
      alt: link.getAttribute('alt')
    }));

    return articles;
  });

  console.log(storySrcSet);
  return storySrcSet;
}

//nhan api nhung ko respon ket qua, promise pending

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index');
});

app.get('/api', function (req, res) {
  res.json({ 'message': 'hello world' });
});

app.get('/api/getListStories', function (req, res) {
  const articles = getStoriesFromURL(damMyURL);

  articles.then(function (result) {
    console.log('-> JSON: \n' + result);
    res.json({result});
    // result.forEach(function (object, index) {
    //   console.log('index: ' + index);
    //   console.log('src: ' + object.src);
    //   console.log('alt: ' + object.alt);
    //   res.json({object});
    // });
  });
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});