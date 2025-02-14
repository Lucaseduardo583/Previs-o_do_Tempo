async function getWeather() {
    let city = document.getElementById('city-input').value.trim();

    if (!city) {
        alert("Digite o nome de uma cidade!");
        return;
    }

    const url = `https://goweather.herokuapp.com/weather/${city}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.temperature) {
            alert("Cidade não encontrada!");
            return;
        }

        document.getElementById('temperature').textContent = `🌡 Temperatura: ${data.temperature}`;
        document.getElementById('wind').textContent = `💨 Vento: ${data.wind}`;
        document.getElementById('description').textContent = `📌 Clima: ${data.description}`;

        let forecastHTML = "<h3>Previsão para os próximos dias:</h3>";
        data.forecast.forEach((day, index) => {
            forecastHTML += `
                <div class="forecast-item">
                    <h4>Dia ${index + 1}</h4>
                    <p>🌡 ${day.temperature}</p>
                    <p>💨 Vento: ${day.wind}</p>
                </div>
            `;
        });

        document.getElementById('forecast-container').innerHTML = forecastHTML;
    } catch (error) {
        console.error('Erro ao obter a previsão do tempo:', error);
    }
}
