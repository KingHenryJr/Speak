window.SpeechRecognition =
  window.webkitSpeechRecognition || window.SpeechRecognition;

const recognition = new SpeechRecognition();
const icon = document.querySelector("i.fa.fa-microphone");
const sound = document.querySelector(".sound");
const synth = window.speechSynthesis;

let paragraph = document.createElement("p");
let container = document.querySelector(".text-box");

container.appendChild(paragraph);

icon.addEventListener("click", () => {
  sound.play();
  dictate();
});

const dictate = () => {
  recognition.start();
  recognition.onresult = event => {
    const speechToText = event.results[0][0].transcript;

    paragraph.textContent = `Q: ${speechToText}`;

    if (event.results[0].isFinal) {
      if (speechToText.includes("what is the time")) {
        speak(getTime);
      }

      if (speechToText.includes("what is the date")) {
        speak(getDate);
      }

      if (speechToText.includes("what's the weather in")) {
        getTheWeather(speechToText);
      }

      if (speechToText.includes("who's the best girlfriend ever")) {
        speak(getGina);
      }

      if (speechToText.includes("who's got the best butt ever")) {
        speak(getGinaButt);
      }
    }
  };
};

const getTime = () => {
  const time = new Date(Date.now());
  return `the time is ${time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  })}`;
};

const getDate = () => {
  const time = new Date(Date.now());
  return `Today's day is ${time.toLocaleDateString()}`;
};

const getGina = () => {
  return `Gina Stees is the best girlfriend Ever!`;
};

const getGinaButt = () => {
  return `Gina Stees has the best butt Ever!`;
};

const getTheWeather = speech => {
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${
      speech.split(" ")[5]
    }&appid=58b6f7c78582bffab3936dac99c31b25&units=metric`
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(weather) {
      if (weather.cod === "404") {
        utterThis = new SpeechSynthesisUtterance(
          `I aint got no weather for ${speech.split(" ")[5]}`
        );
        synth.speak(utterThis);
        return;
      }
      utterThis = new SpeechSynthesisUtterance(
        `the weather in ${weather.name} is mostly ${
          weather.weather[0].description
        } at ${weather.main.temp} degrees Celcius`
      );
      synth.speak(utterThis);
    });
};

const speak = action => {
  utterThis = new SpeechSynthesisUtterance(action());
  synth.speak(utterThis);
};
