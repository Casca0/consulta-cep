import "./style.scss";
import sunnyDay from "./images/sunny.svg";
import rainyDay from "./images/rainy.svg";
import cloudyDay from "./images/cloudy.svg";
import foggyDay from "./images/foggy.svg";

// Mudança de tema

const buttonToggleTheme = document.querySelector("#l-themeToggle");

let theme = "light";
const themes = {};

themes[theme] = document.querySelector("#theme");

async function loadTheme(newTheme) {
  console.log(`CHANGE THEME - ${newTheme}`);

  const themeElement = document.querySelector("#theme");

  if (themeElement) {
    themeElement.remove();
  }

  if (themes[newTheme]) {
    console.log(`THEME ALREADY LOADED - ${newTheme}`);

    document.head.appendChild(themes[newTheme]);

    return;
  }

  if (newTheme === "dark") {
    console.log(`LOADING THEME - ${newTheme}`);

    import(/* webpackChunkName: "dark" */ "./style.scss?dark").then(() => {
      themes[newTheme] = document.querySelector("#theme");

      console.log(`LOADED - ${newTheme}`);
    });
  }
}

buttonToggleTheme.onclick = () => {
  if (theme === "light") {
    theme = "dark";
  } else {
    theme = "light";
  }

  loadTheme(theme);
};

// Variavéis gerais

const form = document.querySelector("#l-form");

const errorBlock = document.querySelector("#l-error");

// CEP

const cepInfoBlock = document.querySelector("#l-cepInfo");
const cidade = document.querySelector("#l-city");
const uf = document.querySelector("#l-state");
const endereco = document.querySelector("#l-street");
const bairro = document.querySelector("#l-district");
const cep = document.querySelector("#l-postalCode");

// Clima

const climaInfoBlock = document.querySelector("#l-weatherBox");
const temperaturaAtual = document.querySelector("#l-temperature");
const temperaturaMin = document.querySelector("#l-temperatureMin");
const temperaturaMax = document.querySelector("#l-temperatureMax");
const humidade = document.querySelector("#l-humidity");
const climaImg = document.querySelector("#l-weatherIcon");
const descricao = document.querySelector("#l-weatherIconDescription");

// Função CEP

async function consultaCep(cep) {
  const cepFormatado = cep.replace(/\D/g, "");

  const validaCep = /^[0-9]{8}$/;

  if (validaCep.test(cepFormatado)) {
    const request = await fetch(
      `https://viacep.com.br/ws/${cepFormatado}/json/`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      });
    return request;
  } else {
    return 0;
  }
}

// Função Clima

async function consultaClima(cidade) {
  const APIKey = "d5f0ed0441a05792c3ecdd9f0330292d";

  const request = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${APIKey}&lang=pt_br`
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.cod === "404") {
        console.log("Erro ao puxar as informações de clima!");
        return 0;
      }

      return json;
    });

  return request;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputValue = form[0].value;

  const pesquisaCep = await consultaCep(inputValue);

  if (pesquisaCep.erro || pesquisaCep === 0) {
    form[0].value = "";

    errorBlock.style.display = "block";
    errorBlock.classList.add("fadeIn");

    setTimeout(() => {
      errorBlock.classList.remove("fadeIn");
      errorBlock.animate(
        [
          {
            opacity: 1,
            scale: 1,
          },
          {
            opacity: 0,
            scale: 0,
          },
        ],
        500
      ).onfinish = () => {
        errorBlock.style.display = "";
      };
    }, 3000);

    cepInfoBlock.style.display = "none";
    climaInfoBlock.style.display = "none";

    return;
  }

  form[0].value = "";

  cepInfoBlock.style.display = "block";
  cepInfoBlock.classList.add("fadeIn");

  cidade.innerHTML = `<strong>Cidade:</strong> ${pesquisaCep.localidade}`;
  uf.innerHTML = `<strong>UF:</strong> ${pesquisaCep.uf}`;
  endereco.innerHTML = `<strong>Logradouro:</strong> ${pesquisaCep.logradouro}`;
  bairro.innerHTML = `<strong>Bairro:</strong> ${pesquisaCep.bairro}`;
  cep.innerHTML = `<strong>CEP:</strong> ${pesquisaCep.cep}`;

  const climaInfo = await consultaClima(pesquisaCep.localidade);

  console.log(climaInfo);

  if (climaInfo == 0) {
    return;
  }

  climaInfoBlock.style.display = "block";
  climaInfoBlock.classList.add("fadeIn");

  switch (climaInfo.weather[0].main) {
    case "Clear":
      climaImg.src = `${sunnyDay}`;
      break;
    case "Rain":
      climaImg.src = `${rainyDay}`;
      break;
    case "Clouds":
      climaImg.src = `${cloudyDay}`;
      break;
    case "Haze":
      climaImg.src = `${foggyDay}`;
      break;
    default:
      climaImg.src = "";
  }

  temperaturaAtual.innerHTML = `<strong>Atual:</strong> ${parseInt(
    climaInfo.main.temp
  )} °C`;
  temperaturaMin.innerHTML = `<strong>Máxima:</strong> ${parseInt(
    climaInfo.main.temp_min
  )} °C`;
  temperaturaMax.innerHTML = `<strong>Mínima:</strong> ${parseInt(
    climaInfo.main.temp_max
  )} °C`;
  humidade.innerHTML = `<strong>Humidade:</strong> ${climaInfo.main.humidity}%`;
  descricao.innerHTML = `<strong>${
    climaInfo.weather[0].description.charAt(0).toUpperCase() +
    climaInfo.weather[0].description.slice(1)
  }</strong>`;
});
