const quizData = [
  {
    question: "Organik moleküllere fosfat eklenmesine ne ad verilir?",
    options: ["Defosforilasyon", "Fosforilasyon", "Denitrifikasyon", "Fotoliz"],
    answer: 1,
    explanation: "Fosfat eklenmesi fosforilasyon, koparılması defosforilasyondur."
  },
  {
    question: "ATP parçalandığında hangi olay gerçekleşir?",
    options: ["Fosforilasyon", "Defosforilasyon", "Nitrifikasyon", "Kalvin döngüsü"],
    answer: 1,
    explanation: "ATP'nin yıkımı defosforilasyon olayıdır."
  },
  {
    question: "Engelmann deneyine göre fotosentezin en hızlı olduğu ışıklar hangileridir?",
    options: ["Yeşil ve sarı", "Turuncu ve yeşil", "Kırmızı ve mor", "Mavi ve yeşil"],
    answer: 2,
    explanation: "Bakteri kolonileri kırmızı ve mor ışık bölgelerinde daha fazla birikmiştir."
  },
  {
    question: "Işığa bağımlı tepkimelerde aşağıdakilerden hangisi sentezlenir?",
    options: ["Yalnız glikoz", "ATP ve NADPH", "Yalnız laktik asit", "Nitrat ve nitrit"],
    answer: 1,
    explanation: "Işıklı evrede ATP ve NADPH sentezlenir."
  },
  {
    question: "Işıktan bağımsız tepkimeler kloroplastın neresinde gerçekleşir?",
    options: ["Grana", "Tilakoit lümeni", "Stroma", "Mitokondri matriksi"],
    answer: 2,
    explanation: "Kalvin döngüsü stromada gerçekleşir."
  },
  {
    question: "Atmosfere verilen O₂'nin temel kaynağı hangisidir?",
    options: ["Karbondioksit", "Glikoz", "Su", "ATP"],
    answer: 2,
    explanation: "İzotop deneyleri, atmosferik oksijenin sudan geldiğini göstermiştir."
  },
  {
    question: "Kalvin döngüsünde karbondioksit kullanılarak oluşan 3 karbonlu temel ürün hangisidir?",
    options: ["Pirüvat", "PGAL", "Asetaldehit", "Laktat"],
    answer: 1,
    explanation: "ATP ve NADPH kullanılarak PGAL molekülleri üretilir."
  },
  {
    question: "Kemosentez yapan canlılar enerji kaynağı olarak neyi kullanır?",
    options: ["Işık enerjisini", "İnorganik maddelerin oksitlenmesiyle elde edilen kimyasal enerjiyi", "Yalnız glikozu", "Yalnız oksijeni"],
    answer: 1,
    explanation: "Kemosentezde ışık yerine kimyasal enerji kullanılır."
  },
  {
    question: "Nitrosomonas bakterileri hangi kavramla doğrudan ilişkilidir?",
    options: ["Fermantasyon", "Nitrifikasyon", "Kalvin döngüsü", "Fotoliz"],
    answer: 1,
    explanation: "Nitrosomonas azotlu bileşikleri oksitleyerek nitrifikasyona katkı sağlar."
  },
  {
    question: "Oksijensiz solunum ile fermantasyon arasındaki temel fark nedir?",
    options: ["Fermantasyonda ETS çalışır", "Oksijensiz solunumda ETS çalışır", "İkisi de mitokondride olur", "İkisi de oksijen kullanır"],
    answer: 1,
    explanation: "Oksijensiz solunumda ETS bulunur; fermantasyonda bulunmaz."
  },
  {
    question: "Laktik asit fermantasyonu aşağıdakilerden hangisinde görülebilir?",
    options: ["Çizgili kaslar", "Kloroplast", "Nitrobacter", "Tilakoit zar"],
    answer: 0,
    explanation: "Laktik asit fermantasyonu çizgili kaslarda ve bazı bakterilerde görülür."
  },
  {
    question: "Oksijenli solunum neden daha fazla ATP üretir?",
    options: ["Çünkü yalnız sitoplazmada gerçekleşir", "Çünkü organik madde tam yıkıma uğrar", "Çünkü ışık kullanılır", "Çünkü CO₂ tüketilir"],
    answer: 1,
    explanation: "İnorganik bileşiklere kadar tam yıkım olduğu için daha çok ATP açığa çıkar."
  }
];

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.querySelector(".theme-toggle__icon");
const installButton = document.getElementById("installButton");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const checklistInputs = [...document.querySelectorAll("[data-check-item]")];
const checklistStatus = document.getElementById("checklistStatus");
const questionCounter = document.getElementById("questionCounter");
const quizProgress = document.getElementById("quizProgress");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestionButton = document.getElementById("nextQuestionButton");
const restartQuizButton = document.getElementById("restartQuizButton");

let deferredPrompt = null;
let currentQuestion = 0;
let selectedAnswer = null;

const savedTheme = localStorage.getItem("theme") || "dark";
document.body.dataset.theme = savedTheme;
updateThemeLabel(savedTheme);

function updateThemeLabel(theme) {
  const isLight = theme === "light";
  themeIcon.textContent = isLight ? "☀" : "☾";
  themeColorMeta.setAttribute("content", isLight ? "#eef2ff" : "#7c3aed");
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
  document.body.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
  updateThemeLabel(nextTheme);
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  installButton.hidden = true;
  deferredPrompt = null;
});

function renderQuestion() {
  const item = quizData[currentQuestion];
  questionCounter.textContent = `${currentQuestion + 1} / ${quizData.length}`;
  quizProgress.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;
  quizQuestion.textContent = item.question;
  quizFeedback.textContent = "";
  selectedAnswer = null;
  quizOptions.innerHTML = "";

  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index));
    quizOptions.appendChild(button);
  });
}

function selectAnswer(index) {
  if (selectedAnswer !== null) return;
  selectedAnswer = index;
  const item = quizData[currentQuestion];
  const buttons = [...document.querySelectorAll(".quiz-option")];

  buttons.forEach((button, buttonIndex) => {
    if (buttonIndex === item.answer) {
      button.classList.add("is-correct");
    } else if (buttonIndex === index) {
      button.classList.add("is-wrong");
    }
  });

  quizFeedback.textContent = index === item.answer
    ? `Doğru. ${item.explanation}`
    : `Yanlış. ${item.explanation}`;
}

nextQuestionButton.addEventListener("click", () => {
  currentQuestion = (currentQuestion + 1) % quizData.length;
  renderQuestion();
});

restartQuizButton.addEventListener("click", () => {
  currentQuestion = 0;
  renderQuestion();
});

function updateChecklist() {
  const completed = checklistInputs.filter((input) => input.checked).length;
  checklistStatus.textContent = `${completed} / ${checklistInputs.length} tamamlandı`;
  localStorage.setItem(
    "studyChecklist",
    JSON.stringify(checklistInputs.map((input) => input.checked))
  );
}

const savedChecklist = JSON.parse(localStorage.getItem("studyChecklist") || "[]");
checklistInputs.forEach((input, index) => {
  input.checked = Boolean(savedChecklist[index]);
  input.addEventListener("change", updateChecklist);
});

updateChecklist();
renderQuestion();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}
