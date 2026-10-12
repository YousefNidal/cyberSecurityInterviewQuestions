
const https = require('https');
const q = encodeURIComponent('Hello world, this is a test.');
https.get('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q=' + q, (res) => {
  let data = '';
  res.on('data', c => data+=c);
  res.on('end', () => console.log(data));
});

