const express = require('express');
const morgan = require('morgan');
const request = require('request');

const config = require('./config')

const PORT = process.env.NODE_ENV || 8080;
const app = express();

app.use(morgan('common'))

app.get('/', (req, res) => {
  res.send('hello')
});

app.listen(PORT, () => {
  console.log('------------------------------------');
  console.log(`App has set up at :${PORT}`);
  console.log('------------------------------------');
});

app.get('/weather', (req, res) => {
  if (req.query) {
    let lat = req.query.lat, lon = req.query.lon;
    request.get({
      uri: 'http://api.openweathermap.org/data/2.5/forecast',
      json: true,
      qs: {
        APPID: config.appid,
        lat: lat,
        lon: lon,
        lang: 'zh_cn',
        units: 'metric'
      }
    }, (err, response, data) => {
      let handleData = {};
      handleData.city = {
        name: data.city.name,
        country: data.city.country
      }
      let currentWeather = data.list.filter(it=>(it.dt_txt.slice(11, 19) == '21:00:00'))[0];
      handleData.temperature = currentWeather.main.temp;
      handleData.description = {
        strName: currentWeather.weather[0].main,
        name: currentWeather.weather[0].description
      }
      handleData.currentWeather = [{
        type: 'clouds',
        num: currentWeather.clouds.all ? currentWeather.clouds.all : '',
        unit: '%'
      }, {
        type: 'wind',
        num: currentWeather.wind.speed ? currentWeather.wind.speed : '',
        unit: 'm/s'
      }, {
        type: 'rain',
        num: currentWeather.rain['3h'] ? (currentWeather.rain['3h']).toFixed(2) : '',
        unit: '3h'
      }]

      res.send(handleData)
    })

  }
})

let weatherList = [];
app.get('/temperature', (req, res) => {
  if (req.query) {
    request.get({
      uri: 'http://api.openweathermap.org/data/2.5/forecast',
      json: true,
      qs: {
        APPID: config.appid,
        lat: req.query.lat,
        lon: req.query.lon,
        lang: 'zh_cn',
        units: 'metric'
      }
    }, (err, response, data) => {
      let handleData = [];
      if (data.list && data.list.length > 0) {
        weatherList = data.list;
        data.list.forEach(function (item) {
          let time = item.dt_txt.slice(11, 19)
          if (time == '21:00:00') {

            handleData.push({
              date: item.dt_txt.slice(5, 10).replace(/-/, '/'),
              temperature: item.main.temp,
              weather: item.weather[0].main
            })
          }

        });
      }
      res.send(handleData)
    })
  }
})

app.get('/weatherDetail', (req, res) => {

  let detailData = 'null'
  if (req.query && weatherList) {
    let _detailData = weatherList.filter(it => (((it.dt_txt.slice(5, 10).replace(/-/, '/')) == req.query.date) && (it.dt_txt.slice(11, 19) == '21:00:00')))[0];
    detailData =
      [
        {
          type: '气温详情',
          content: [{
            key: '平均温度',
            value: _detailData.main.temp,
            unit: '℃'
          },
          {
            key: '最高温度',
            value: (_detailData.main.temp_max + 0.3).toFixed(2),
            unit: '℃'
          },
          {
            key: '最低温度',
            value: (_detailData.main.temp_min - 0.6).toFixed(2),
            unit: '℃'
          },
          {
            key: '气压',
            value: _detailData.main.pressure,
            unit: 'hPa'
          },
          {
            key: '海平面的平均气压',
            value: _detailData.main.sea_level,
            unit: 'hPa'
          },
          {
            key: '大地的平均气压',
            value: _detailData.main.grnd_level,
            unit: 'hPa'
          }, {
            key: '湿度',
            value: _detailData.main.humidity,
            unit: '%'
          }]
        }, {
          type: '天气描述',
          content: [{
            key: '描述',
            value: _detailData.weather[0].description,
            unit: ''
          }]
        }, {
          type: '云量',
          content: [{
            key: '云量',
            value: _detailData.clouds.all,
            unit: '%'
          }]
        }, {
          type: '风',
          content: [{
            key: '风速',
            value: _detailData.wind.speed,
            unit: 'm/s'
          }, {
            key: '风向',
            value: _detailData.wind.deg,
            unit: '°'
          }]
        }]


  }
  res.send(detailData);
})


app.get('/askRobot', (req, res) => {
  if (req.query) {
    let question = req.query.question ? req.query.question : '';
    request.get({
      uri: 'http://api.qingyunke.com/api.php',
      json: true,
      qs: {
        key: 'free',
        appid: 0,
        msg: question
      }
    }, (err, response, data) => {
      res.send(data)
    })
  }
})
