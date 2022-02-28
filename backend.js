const express = require("express");
const app = express();
const axios = require("axios");

const fs = require('fs');

app.listen(8080, () => console.log("Server running on port 8080"));

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/kayttoliittyma.html");
});

const api = "https://helsinki-openapi.nuuka.cloud/api/v1.0/EnergyData/Daily/ListByProperty?Record=LocationName&SearchString=1000%20Hakaniemen%20kauppahalli&ReportingGroup=Electricity&StartTime=2019-01-01&EndTime=2019-12-31";

app.get("/data", (req, res) => {
  axios.get(api)
    .then(response => {
      const rawData = response.data;
      const parsittuData = toCsv(rawData);
      const aikaleima = dateFunction();
      fs.writeFile(aikaleima + ".csv", parsittuData, err => {
        if (err) {
          console.log(err);
        } 
      });
      const kuukausittainen = muutakuukausittaiseksi(rawData);
      res.json(kuukausittainen);
    })
});

const toCsv = (data) => {
  const otsikot = ["Timestamp, Value"];
  const rivit = [];
  data.forEach(obj => {
    rivit.push(`${obj.timestamp}, ${obj.value}`);
  })
  return otsikot.concat(rivit).join("\n");
}

const dateFunction = () => {
  let aika = Date.now();
  let dObj = new Date(aika);
  let aikaleima = dObj.getFullYear() + "-" + dObj.getMonth() + "-" + dObj.getDate() + "-" + dObj.getHours() + "-" + dObj.getMinutes() + "-" +dObj.getSeconds();

  return aikaleima
}

const muutakuukausittaiseksi = (data) => {
  const kuukaudet = [[],[],[],[],[],[],[],[],[],[],[],[]];
  data.forEach(obj => {
    const tempDate = obj.timestamp[5] + obj.timestamp[6];
    kuukaudet[tempDate -1].push(obj.value);
  });
  return kuukaudet;
}