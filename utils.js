export const getWeatherData = (data) => ({
    temperature: data.main.temp,
    pressure: data.main.pressure,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
});

export const getForecastData = (data) => data.list.map(item => ({
    date: item.dt_txt,
    temperature: item.main.temp,
    pressure: item.main.pressure,
    humidity: item.main.humidity,
    windSpeed: item.wind.speed,
    description: item.weather[0].description,
}));

export const handleError = (res, error) => {
    console.log(error.message);
    res.status(500).json({
        success: false,
        message: 'Error fetching weather data',
        error: error.message,
    });
}