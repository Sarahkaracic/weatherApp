const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

//start

//end
//api for current weather
app.get('/weather/current', (req, res) => {
  const query = req.query.location;
  const apiKey = 'b2097857696e8f8de348d379cd776d8b';

  if (!query) {
    return res.status(400).send('Please provide a location.');
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;

  const request = https.get(url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        res.json({
          location: query,
          temperature: temp,
          weather_condition: description
        });
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while parsing weather data.');
      }
    });
  });

  request.on('error', (error) => {
    console.error(error);
    res.status(500).send('An error occurred while making the API request.');
  });
});
//api for forecast
app.get('/weather/forecast', (req, res) => {
  const query = req.query.location;
  const apiKey = 'b2097857696e8f8de348d379cd776d8b';

  if (!query) {
    return res.status(400).send('Please provide a location.');
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=metric`;

  const request = https.get(url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const forecastData = JSON.parse(data);
        const forecast = forecastData.list.map(item => ({
          datetime: item.dt_txt,
          temperature: item.main.temp,
          weather_condition: item.weather[0].description
        }));

        res.json({
          location: query,
          forecast: forecast
        });
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while parsing forecast data.');
      }
    });
  });

  request.on('error', (error) => {
    console.error(error);
    res.status(500).send('An error occurred while making the API request.');
  });
});
//api for forecast but with additional duration
app.get('/weather/forecast/:location/:days', (req, res) => {
  const location = req.params.location;
  const days = parseInt(req.params.days);
  const apiKey = 'b2097857696e8f8de348d379cd776d8b';

  if (!location || !days) {
    return res.status(400).send('Please provide a location and a valid number of days.');
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

  const request = https.get(url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const forecastData = JSON.parse(data);
        const forecast = forecastData.list
          .filter((item, index) => index < days * 8)
          .map(item => ({
            datetime: item.dt_txt,
            temperature: item.main.temp,
            weather_condition: item.weather[0].description
          }));

        res.json({
          location: location,
          forecast: forecast
        });
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while parsing forecast data.');
      }
    });
  });

  request.on('error', (error) => {
    console.error(error);
    res.status(500).send('An error occurred while making the API request.');
  });
});

app.listen(3000, () => console.log("Our server is running at port 3000"));