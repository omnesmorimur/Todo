import { useState, useEffect, useRef } from 'react';
import Button2 from '@/shared/ui/Button';
import styles from './Weather.module.scss';

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [weatherCity, setWeatherCity] = useState('Москва');
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState('');
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [dailyForecast, setDailyForecast] = useState([]);
    const [activeTab, setActiveTab] = useState('hourly');
    
    const suggestionsRef = useRef(null);
    const weatherInputRef = useRef(null);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowCitySuggestions(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getWeatherIcon = (code) => {
        if (code === 0) return '☀️';
        if (code === 1 || code === 2) return '⛅';
        if (code === 3) return '☁️';
        if (code >= 45 && code <= 48) return '🌫️';
        if (code >= 51 && code <= 55) return '🌧️';
        if (code >= 61 && code <= 65) return '🌧️';
        if (code >= 71 && code <= 77) return '❄️';
        if (code >= 80 && code <= 82) return '🌦️';
        if (code >= 95 && code <= 99) return '⛈️';
        return '🌡️';
    };

    const getWeatherDescription = (code) => {
        if (code === 0) return 'Ясно';
        if (code === 1 || code === 2) return 'Малооблачно';
        if (code === 3) return 'Облачно';
        if (code >= 45 && code <= 48) return 'Туман';
        if (code >= 51 && code <= 55) return 'Морось';
        if (code >= 61 && code <= 65) return 'Дождь';
        if (code >= 71 && code <= 77) return 'Снег';
        if (code >= 80 && code <= 82) return 'Ливень';
        if (code >= 95 && code <= 99) return 'Гроза';
        return 'Облачно';
    };

    const getWeatherData = async (lat, lon, cityName) => {
        try {
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7&past_days=1`;
            const weatherRes = await fetch(weatherUrl);
            
            if (!weatherRes.ok) {
                throw new Error(`HTTP error! status: ${weatherRes.status}`);
            }
            
            const weatherData = await weatherRes.json();

            if (weatherData.current_weather) {
                setWeather({
                    city: cityName,
                    temp: Math.round(weatherData.current_weather.temperature),
                    wind: weatherData.current_weather.windspeed,
                    code: weatherData.current_weather.weathercode,
                    description: getWeatherDescription(weatherData.current_weather.weathercode)
                });

                const hourly = weatherData.hourly;
                const now = new Date();
                const currentHour = now.getHours();

                const hourlyData = [];
                const startHour = currentHour - 3;

                for (let i = 0; i < 27; i++) {
                    let hourIndex = startHour + i;
                    if (hourIndex >= 0 && hourIndex < hourly.time.length) {
                        let timeLabel = '';
                        const hourValue = new Date(hourly.time[hourIndex]).getHours();

                        if (hourIndex < currentHour) {
                            timeLabel = `${hourValue}:00`;
                        } else if (hourIndex === currentHour) {
                            timeLabel = 'Сейчас';
                        } else {
                            timeLabel = `${hourValue}:00`;
                        }

                        hourlyData.push({
                            time: timeLabel,
                            hour: hourValue,
                            temp: Math.round(hourly.temperature_2m[hourIndex]),
                            code: hourly.weathercode[hourIndex],
                            isPast: hourIndex < currentHour,
                            isCurrent: hourIndex === currentHour
                        });
                    }
                }
                setHourlyForecast(hourlyData);

                const daily = weatherData.daily;
                const dailyData = [];
                for (let i = 0; i < daily.time.length; i++) {
                    dailyData.push({
                        day: new Date(daily.time[i]).toLocaleDateString('ru-RU', { weekday: 'short' }),
                        maxTemp: Math.round(daily.temperature_2m_max[i]),
                        minTemp: Math.round(daily.temperature_2m_min[i]),
                        code: daily.weathercode[i]
                    });
                }
                setDailyForecast(dailyData);

                localStorage.setItem('lastWeatherCity', cityName);
                return true;
            } else {
                setWeatherError('Не удалось получить погоду');
                return false;
            }
        } catch (error) {
            console.error('Ошибка получения погоды по координатам:', error);
            setWeatherError('Ошибка получения данных');
            return false;
        }
    };

    const fetchWeather = async (city) => {
        if (!city?.trim()) {
            setWeatherLoading(false);
            return;
        }

        setWeatherLoading(true);
        setWeather(null);
        setWeatherError('');
        setShowCitySuggestions(false);
        setHourlyForecast([]);
        setDailyForecast([]);

        try {
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=ru`;
            const geoRes = await fetch(geoUrl);
            
            if (!geoRes.ok) {
                throw new Error(`Geocoding API error! status: ${geoRes.status}`);
            }
            
            const geoData = await geoRes.json();

            if (geoData.results && geoData.results.length > 0) {
                // Ищем точное совпадение или первый результат
                let bestMatch = geoData.results[0];
                const lowerCity = city.toLowerCase();
                
                for (const result of geoData.results) {
                    if (result.name.toLowerCase() === lowerCity) {
                        bestMatch = result;
                        break;
                    }
                }
                
                const { latitude, longitude, name } = bestMatch;
                console.log('Найден город:', name, 'Координаты:', latitude, longitude);
                
                // Обновляем название города в инпуте
                setWeatherCity(name);
                
                // Получаем погоду
                const success = await getWeatherData(latitude, longitude, name);
                
                if (!success) {
                    setWeatherError(`Не удалось загрузить погоду для города "${name}"`);
                }
            } else {
                console.log('Город не найден:', city);
                setWeatherError(`Город "${city}" не найден. Попробуйте написать на русском или английском языке.`);
                setWeatherCity(city); // Возвращаем исходное название
            }
        } catch (error) {
            console.error('Ошибка получения погоды:', error);
            setWeatherError('Ошибка соединения. Проверьте интернет и попробуйте снова.');
        } finally {
            setWeatherLoading(false);
        }
    };

    const searchCity = async (query) => {
        if (!query?.trim() || query.length < 2) {
            setCitySuggestions([]);
            setShowCitySuggestions(false);
            return;
        }

        try {
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=ru`;
            const geoRes = await fetch(geoUrl);
            const geoData = await geoRes.json();

            if (geoData.results && geoData.results.length > 0) {
                // Убираем дубликаты по названию города
                const uniqueCities = [];
                const seen = new Set();
                for (const city of geoData.results) {
                    if (!seen.has(city.name)) {
                        seen.add(city.name);
                        uniqueCities.push(city.name);
                    }
                }
                setCitySuggestions(uniqueCities.slice(0, 5));
                setShowCitySuggestions(true);
            } else {
                setCitySuggestions([]);
                setShowCitySuggestions(false);
            }
        } catch (error) {
            console.error('Ошибка поиска города:', error);
            setCitySuggestions([]);
            setShowCitySuggestions(false);
        }
    };

    const selectCity = (cityName) => {
        console.log('Выбран город из подсказок:', cityName);
        setShowCitySuggestions(false);
        setCitySuggestions([]);
        setWeatherCity(cityName);
        fetchWeather(cityName);
    };

    useEffect(() => {
        const savedCity = localStorage.getItem('lastWeatherCity');
        if (savedCity) {
            setWeatherCity(savedCity);
            fetchWeather(savedCity);
        } else {
            fetchWeather(weatherCity);
        }
    }, []);

    return (
        <div className={styles.weatherWrapper}>
            <h3 className={styles.weatherTitle}>Погода</h3>
            <div className={styles.weatherSearch}>
                <div className={styles.searchContainer} ref={searchContainerRef}>
                    <input
                        ref={weatherInputRef}
                        type="text"
                        value={weatherCity}
                        onChange={(e) => {
                            const value = e.target.value;
                            setWeatherCity(value);
                            searchCity(value);
                        }}
                        onFocus={() => {
                            if (weatherCity.length >= 2 && citySuggestions.length === 0) {
                                searchCity(weatherCity);
                            }
                        }}
                        placeholder="Город (на русском или английском)"
                        className={styles.weatherInput}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                fetchWeather(weatherCity);
                            }
                        }}
                    />
                    {showCitySuggestions && citySuggestions.length > 0 && (
                        <ul className={styles.citySuggestions} ref={suggestionsRef}>
                            {citySuggestions.map((suggestion, idx) => (
                                <li 
                                    key={idx} 
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        selectCity(suggestion);
                                    }}
                                >
                                    📍 {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <Button2 variant="secondary" size="small" onClick={() => fetchWeather(weatherCity)}>
                    Найти
                </Button2>
            </div>

            {weatherLoading ? (
                <div className={styles.weatherLoading}>Загрузка погоды для города "{weatherCity}"...</div>
            ) : weather ? (
                <>
                    <div className={styles.weatherCurrent}>
                        <div className={styles.weatherMain}>
                            <span className={styles.weatherIcon}>{getWeatherIcon(weather.code)}</span>
                            <div className={styles.weatherTempMain}>
                                <span className={styles.weatherTemp}>{weather.temp}°C</span>
                                <span className={styles.weatherDesc}>{weather.description}</span>
                            </div>
                        </div>
                        <div className={styles.weatherDetails}>
                            <div className={styles.weatherCity}>{weather.city}</div>
                            <div className={styles.weatherWind}>Ветер: {weather.wind} м/с</div>
                        </div>
                    </div>

                    <div className={styles.weatherTabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'hourly' ? styles.active : ''}`}
                            onClick={() => setActiveTab('hourly')}
                        >
                            Почасовой
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'daily' ? styles.active : ''}`}
                            onClick={() => setActiveTab('daily')}
                        >
                            7 дней
                        </button>
                    </div>

                    {activeTab === 'hourly' && hourlyForecast.length > 0 && (
                        <div className={styles.hourlyForecast}>
                            {hourlyForecast.map((hour, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.hourlyItem} ${hour.isPast ? styles.pastHour : ''} ${hour.isCurrent ? styles.currentHour : ''}`}
                                >
                                    <div className={styles.hourlyTime}>{hour.time}</div>
                                    <div className={styles.hourlyIcon}>{getWeatherIcon(hour.code)}</div>
                                    <div className={styles.hourlyTemp}>{hour.temp}°</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'daily' && dailyForecast.length > 0 && (
                        <div className={styles.dailyForecast}>
                            {dailyForecast.map((day, idx) => (
                                <div key={idx} className={styles.dailyItem}>
                                    <div className={styles.dailyDay}>{day.day}</div>
                                    <div className={styles.dailyIcon}>{getWeatherIcon(day.code)}</div>
                                    <div className={styles.dailyTemp}>
                                        <span className={styles.dailyMax}>{day.maxTemp}°</span>
                                        <span className={styles.dailyMin}>{day.minTemp}°</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.weatherError}>
                    {weatherError || 'Введите название города'}
                </div>
            )}
        </div>
    );
};

export default Weather;