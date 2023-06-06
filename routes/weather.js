import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { getWeatherData, handleError } from '../utils.js';

dotenv.config('../.env');

var router = express.Router();
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const GEOCODE_GOOGLE_API_KEY = process.env.GEOCODE_GOOGLE_API_KEY;

router.get('/city/:city/:countyCode', async (req, res) => {
    const { city, countryCode } = req.params;
    try {
        const geoCodeResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${city},${countryCode}&key=${GEOCODE_GOOGLE_API_KEY}`);
        console.log(geoCodeResponse.data.results[0])
        const { lat, lng } = geoCodeResponse.data.results[0].geometry.location;

        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lng}&appid=${OPENWEATHERMAP_API_KEY}`);
        const data = response.data;
        res.json({
            success: true,
            message: 'Weather data fetched successfully',
            countryCode: data.sys.country,
            sunsetsAt: data.sys.sunset,
            sunrisesAt: data.sys.sunrise,
            city: data.name,
            lat: data.coord.lat,
            lon: data.coord.lon,
            data: getWeatherData(data),
        });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/postal/:postalCode/:countryCode', async (req, res) => {
    const { postalCode, countryCode } = req.params;
    try {
        const geoCodeResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode},${countryCode}&key=${GEOCODE_GOOGLE_API_KEY}`);
        const { lat, lng } = geoCodeResponse.data;

        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lng}&appid=${OPENWEATHERMAP_API_KEY}`);
        const data = response.data;
        console.log(data);
        res.json({
            success: true,
            message: 'Weather data fetched successfully',
            countryCode: data.sys.country,
            sunsetsAt: data.sys.sunset,
            sunrisesAt: data.sys.sunrise,
            city: data.name,
            lat: data.coord.lat,
            lon: data.coord.lon,
            data: getWeatherData(data),
        });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/coords/:lon/:lat', async (req, res) => {
    const { lon, lat } = req.params;
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}`);
        const data = response.data;
        res.json({
            success: true,
            message: 'Weather data fetched successfully',
            countryCode: data.sys.country,
            sunsetsAt: data.sys.sunset,
            sunrisesAt: data.sys.sunrise,
            city: data.name,
            lat: data.coord.lat,
            lon: data.coord.lon,
            data: getWeatherData(data),
        });
    } catch (error) {
        handleError(res, error);
    }
});

export default router;