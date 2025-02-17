async function getLocationByCEP() {
    const cep = document.getElementById('cep-input').value.trim();

    if (!cep) {
        alert("Digite um CEP válido!");
        return;
    }

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.erro) {
            alert("CEP não encontrado!");
            return;
        }

        // Exibir detalhes da localização
        document.getElementById('rua').textContent = `📍 Rua: ${data.logradouro || '--'}`;
        document.getElementById('bairro').textContent = `🏘️ Bairro: ${data.bairro || '--'}`;
        document.getElementById('cidade').textContent = `🏙️ Cidade: ${data.localidade || '--'}`;
        document.getElementById('estado').textContent = `🌎 Estado: ${data.uf || '--'}`;

        // Preencher automaticamente o campo de cidade para a previsão do tempo
        document.getElementById('city-input').value = data.localidade;
    } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
        alert("Erro ao buscar o CEP. Tente novamente.");
    }
}

async function getWeather() {
    const city = document.getElementById('city-input').value.trim();

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

        const descricaoTraduzida = traduzirDescricao(data.description);
        document.getElementById('temperature').textContent = `🌡 Temperatura: ${data.temperature}`;
        document.getElementById('wind').textContent = `💨 Vento: ${data.wind}`;
        document.getElementById('description').textContent = `📌 Clima: ${descricaoTraduzida}`;

        fmMudarTema(descricaoTraduzida);
        changeBackground(data.description);

        let forecastHTML = "<h3>Previsão para os próximos dias:</h3>";
        data.forecast.slice(0, 3).forEach((day, index) => { 
            const temperaturaTraduzida = traduzirTemperatura(day.temperature);
            forecastHTML += `
                <div class="forecast-item">
                    <h4>Dia ${index + 1}</h4>
                    <p>🌡 ${temperaturaTraduzida}</p>
                    <p>💨 Vento: ${day.wind}</p>
                    <p>🌧 Chance de chuva: ${day.precipitation || 'N/A'}</p>
                </div>
            `;
        });

        document.getElementById('forecast-container').innerHTML = forecastHTML;
    } catch (error) {
        console.error('Erro ao obter a previsão do tempo:', error);
        alert("Erro ao obter a previsão do tempo. Tente novamente.");
    }
}

function traduzirDescricao(descricao) {
    const traducoes = {
        "light snow": "neve leve",
        "mist": "névoa",
        "partly cloudy": "parcialmente nublado",
        "sunny": "ensolarado",
        "light rain": "chuva leve",
        "cloudy": "nublado",
        "rain": "chuva",
        "storm": "tempestade",
        "clear": "céu limpo",
        "snow": "neve",
        "fog": "névoa",
        "thunderstorm": "trovoada",
        "overcast": "nublado",
        "drizzle": "garoa"
    };

    return traducoes[descricao.toLowerCase()] || descricao;
}

function traduzirTemperatura(temperatura) {
    if (temperatura.includes("°C") || temperatura.includes("°F")) {
        return temperatura;
    }
    return `${temperatura} °C`;
}

function fmMudarTema(descricao) {
    const icone = document.getElementById("icone");

    if (descricao.includes("parcialmente nublado")) {
        icone.className = "bi bi-cloud-sun";
    } else if (descricao.includes("ensolarado") || descricao.includes("céu limpo")) {
        icone.className = "bi bi-sun";
    } else if (descricao.includes("chuva leve") || descricao.includes("garoa")) {
        icone.className = "bi bi-cloud-rain";
    } else if (descricao.includes("neve leve") || descricao.includes("neve")) {
        icone.className = "bi bi-snow";
    } else if (descricao.includes("névoa") || descricao.includes("nublado")) {
        icone.className = "bi bi-cloud-fog";
    } else if (descricao.includes("tempestade") || descricao.includes("trovoada")) {
        icone.className = "bi bi-cloud-lightning-rain";
    } else {
        icone.className = "bi bi-cloud";
    }
}

function changeBackground(description) {
    let body = document.body;

    if (description.toLowerCase().includes("sunny") || description.toLowerCase().includes("clear")) {
        body.style.background = "linear-gradient(135deg, #FFD700, #FF8C00)";
    } else if (description.toLowerCase().includes("cloudy") || description.toLowerCase().includes("overcast")) {
        body.style.background = "linear-gradient(135deg, #B0C4DE, #778899)";
    } else if (description.toLowerCase().includes("rain") || description.toLowerCase().includes("drizzle")) {
        body.style.background = "linear-gradient(135deg, #2F4F4F, #4682B4)";
    } else if (description.toLowerCase().includes("storm") || description.toLowerCase().includes("thunderstorm")) {
        body.style.background = "linear-gradient(135deg, #4B0082, #000000)";
    } else if (description.toLowerCase().includes("snow") || description.toLowerCase().includes("mist")) {
        body.style.background = "linear-gradient(135deg, #F0F8FF, #B0E0E6)";
    } else {
        body.style.background = "linear-gradient(135deg, #FFFFFF, #F0F0F0)";
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.onscroll = function() {
    const backToTopButton = document.getElementById("back-to-top");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
};