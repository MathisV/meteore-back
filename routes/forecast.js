import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { getForecastData, handleError } from '../utils.js';

dotenv.config('../.env');

var router = express.Router();
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;

router.get('/city/:city', async (req, res) => {
    const city = req.params.city;
    try {
        const geoCodeResponse = await axios.get(`https://geocode.xyz/${city}?auth=${GEOCODE_API_KEY}&json=1`);
        const { latt, longt } = geoCodeResponse.data;

        const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${latt}&lon=${longt}&appid=${OPENWEATHERMAP_API_KEY}`);
        const data = response.data;
        console.log(data);
        res.json({
            success: true,
            message: 'Weather forecast data fetched successfully',
            countryCode: data.city.country,
            city: data.city.name,
            lat: data.city.coord.lat,
            lon: data.city.coord.lon,
            data: getForecastData(data),
        });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/postal/:postalCode/:countryCode', async (req, res) => {
    const { postalCode, countryCode } = req.params;
    try {
        const geoCodeResponse = await axios.get(`https://geocode.xyz/${postalCode},${countryCode}?auth=${GEOCODE_API_KEY}&json=1`);
        const { latt, longt } = geoCodeResponse.data;

        const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${latt}&lon=${longt}&appid=${OPENWEATHERMAP_API_KEY}`);
        const data = response.data;
        res.json({
            success: true,
            message: 'Weather forecast data fetched successfully',
            countryCode: data.city.country,
            city: data.city.name,
            lat: data.city.coord.lat,
            lon: data.city.coord.lon,
            data: getForecastData(data),
        });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/coords/:lon/:lat', async (req, res) => {
    const { lon, lat } = req.params;
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}`);
        const data = response.data;
        res.json({
            success: true,
            message: 'Weather data fetched successfully',
            countryCode: data.city.country,
            city: data.city.name,
            lat: data.city.coord.lat,
            lon: data.city.coord.lon,
            data: getForecastData(data),
        });
    } catch (error) {
        handleError(res, error);
    }
});

export default router;