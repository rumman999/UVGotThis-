import axios from "axios";
import express from "express";
import csvtojson from "csvtojson";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const apiUrl = "https://api.openuv.io/api/v1/";
const apiKey = process.env.OPENUV_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3000;

const app = express();

let found = false;

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

let jsonArray = [];
const csvFilePath = path.join(__dirname, "public", "data", "worldcities.csv");

const loadCSVData = async () => {
  try {
    jsonArray = await csvtojson().fromFile(csvFilePath);
    console.log("City database loaded successfully");
  } catch (error) {
    console.error("Error loading CSV:", error);
  }
};

loadCSVData();

app.get("/", (req, res) => {
  found = false;
  res.render("index.ejs", { cities: jsonArray, search: found });

});

app.post("/submit", async (req, res) => {
  const cityName = req.body.city;
  const city = jsonArray.find(
    (c) => c.city.toLowerCase() === cityName.toLowerCase()
  );

  const latitude = city.lat;
  const longitude = city.lng;
  found = true;

  try {
    const result = await axios.get(
      apiUrl + "uv?lat=" + latitude + "&lng=" + longitude,
      {
        headers: {
          "x-access-token": apiKey,
        },
      }
    );
    const uvIndex = result.data.result.uv;

    res.render("index.ejs", { city: cityName, search: found, UV: uvIndex });
  } catch (error) {
    console.error("Error:", error);
  }
});

app.get("/cities", (req, res) => {
  res.json(jsonArray);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

