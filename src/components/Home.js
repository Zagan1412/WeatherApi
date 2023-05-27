import React, { useState } from 'react';
import { Input, Button, Card, Layout, Typography, Space, Row, Col } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

const API_KEY = '34c3f3df8a89471dbd463858232705';

function WeatherApp() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = async () => {
    setError(null);
    setWeatherData(null);
    setForecastData(null);
    const currentResponse = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
    if (currentResponse.ok) {
      const currentData = await currentResponse.json();
      setWeatherData(currentData);
    } else {
      setError('Invalid city name. Please try again.');
      return;
    }
    const forecastResponse = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`);
    if (forecastResponse.ok) {
      const forecastData = await forecastResponse.json();
      setForecastData(forecastData);
    }
  };

  return (
    <Layout>
      <Header>
        <Title level={2} style={{ color: 'white' }}>Web Weather Information Display</Title>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: '20px' }}>
        <Space direction="vertical" size="middle">
          <Input style={{ width: '300px' }} placeholder="Enter city name" onChange={handleCityChange} />
          <Button onClick={handleSearch}>Search</Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Row gutter={16}>
            <Col span={7}>
              <Card title="Current Weather">
                {weatherData && (
                  <>
                    <p>Location: {weatherData.location.name}, {weatherData.location.country}</p>
                    <p>Localtime: {weatherData.location.localtime}</p>
                    <p>Temperature (°C): {weatherData.current.temp_c}°C</p>
                    <p>Temperature (°F): {weatherData.current.temp_f}°F</p>
                    <p>Humidity: {weatherData.current.humidity}%</p>
                    <p>Condition: {weatherData.current.condition.text}</p>
                    <img src={weatherData.current.condition.icon} alt={weatherData.current.condition.text} />
                  </>
                )}
              </Card>
            </Col>
            <Col span={17}>
              <Card title="3-Day Forecast">
                {forecastData && (
                  <>
                    <Row gutter={32}>
                      {forecastData.forecast.forecastday.map((day) => (
                        <Col key={day.date} span={8}>
                          <h3>{day.date}</h3>
                          <p>Condition: {day.day.condition.text}</p>
                          <img src={day.day.condition.icon} alt={day.day.condition.text} />
                          <p>Max Temperature: {day.day.maxtemp_c}°C</p>
                          <p>Min Temperature: {day.day.mintemp_c}°C</p>
                        </Col>
                      ))}
                    </Row>
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </Space>
      </Content>
    </Layout>
  );
}

export default WeatherApp;
