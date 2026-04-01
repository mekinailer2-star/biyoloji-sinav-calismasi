const quizData = [
  {
    question: "Oksijensiz solunumda ETS'nin son elektron alıcısı aşağıdakilerden hangisi olabilir?",
    options: ["Nitrat", "Oksijen", "Klorofil", "Glikoz"],
    answer: 0,
    explanation: "Görsel notta oksijensiz solunum yapan bakterilerde ETS'nin son alıcısının nitrat olabildiği belirtiliyor."
  },
  {
    question: "Etil alkol fermantasyonunda pirüvik asitten önce hangi ara ürün oluşur?",
    options: ["Laktik asit", "Asetaldehit", "Asetil-CoA", "Nitrit"],
    answer: 1,
    explanation: "Pirüvik asitten bir CO₂ çıkar ve asetaldehit oluşur; sonra etil alkole dönüşür."
  },
  {
    question: "Laktik asit fermantasyonunda aşağıdakilerden hangisi doğrudur?",
    options: ["CO₂ oluşur", "Tek basamakta gerçekleşir", "Sadece bitkilerde görülür", "ETS zorunludur"],
    answer: 1,
    explanation: "Laktik asit fermantasyonu tek reaksiyon kademesinde gerçekleşir ve CO₂ üretilmez."
  },
  {
    question: "Oksijenli solunum neden daha fazla ATP üretir?",
    options: ["Sadece sitoplazmada olduğu için", "İnorganik bileşiklere kadar tam yıkım olduğu için", "Kloroplastta gerçekleştiği için", "CO₂ kullanmadığı için"],
    answer: 1,
    explanation: "Notta, yıkım inorganik bileşiklere kadar sürdüğü için daha çok ATP ve ısı açığa çıktığı yazıyor."
  },
  {
    question: "Nitrosomonas bakterileriyle ilişkilendirilen kavram hangisidir?",
    options: ["Fotosentez", "Denitrifikasyon", "Nitrifikasyon", "Fermentasyon"],
    answer: 2,
    explanation: "Nitrosomonas'ın oluşturduğu süreç, bitkilerin kullanabileceği nitratların oluştuğu nitrifikasyondur."
  },
  {
    question: "Kemosentezde sentez sırasında açığa çıkan oksijen neden dış ortama verilmez?",
    options: ["Karaciğerde depolandığı için", "Enerji üretiminde kullanıldığı için", "Yalnızca bitkiler kullandığı için", "ATP'yi parçaladığı için"],
    answer: 1,
    explanation: "Görselde bu oksijenin enerji üretmede kullanıldığı için dışarı verilmediği yazıyor."
  },
  {
    question: "Aşağıdakilerden hangisi laktik asit fermantasyonunun görüldüğü yerlerden biridir?",
    options: ["Maya mantarları", "Çizgili kaslar", "Yaprak hücreleri", "Kök emici tüyleri"],
    answer: 1,
    explanation: "Laktik asit fermantasyonu çizgili kaslarda, yoğurt bakterilerinde ve bazı diğer hücrelerde gerçekleşir."
  },
  {
    question: "Oksijenli solunumun dört evresinden biri hangisidir?",
    options: ["Nitrifikasyon", "Glikoliz", "Denitrifikasyon", "Fotoliz"],
    answer: 1,
    explanation: "Notta glikoliz, Krebs döngüsü, asetil-CoA oluşumu ve ETS dört evre olarak verilmiş."
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
const accordionItems = [...document.querySelectorAll(".accordion-item")];

let deferredPrompt = null;
let currentQuestion = 0;
let selectedAnswer = null;

const savedTheme = localStorage.getItem("theme") || "dark";
document.body.dataset.theme = savedTheme;
updateThemeLabel(savedTheme);

function updateThemeLabel(theme) {
  const isLight = theme === "light";
  themeIcon.textContent = isLight ? "☀" : "☾";
  themeColorMeta.setAttribute("content", isLight ? "#7c3aed" : "#7c3aed");
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

accordionItems.forEach((item) => {
  const trigger = item.querySelector(".accordion-trigger");
  trigger.addEventListener("click", () => {
    item.classList.toggle("is-open");
  });
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
