// État global du quiz
let currentQuestion = 0;
let answers = {};
let multiSelectAnswers = {};
let userInfo = {};
let questions = [];
let wowBreaks = [];
let totalSteps = 0;

// Configuration API
const API_BASE = '/api';

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', async () => {
    await loadQuizData();
});

// Charger les données du quiz
async function loadQuizData() {
    try {
        // Charger les questions
        const questionsResponse = await fetch(`${API_BASE}/questions`);
        const questionsData = await questionsResponse.json();
        questions = questionsData.questions;
        
        // Charger les WOW breaks
        const wowResponse = await fetch(`${API_BASE}/wow-breaks`);
        const wowData = await wowResponse.json();
        wowBreaks = wowData.wowBreaks;
        
        // Calculer le nombre total d'étapes
        totalSteps = questions.length + wowBreaks.length + 2; // +2 pour email et résultats
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        alert('Erreur lors du chargement du quiz. Veuillez rafraîchir la page.');
    }
}

// Démarrer le quiz
function startQuiz() {
    document.getElementById('screen-landing').classList.remove('active');
    currentQuestion = 0;
    showQuestion();
    updateProgress();
}

// Afficher une question
function showQuestion() {
    const container = document.getElementById('quiz-container');
    const question = questions[currentQuestion];
    
    // Vérifier si c'est le moment d'afficher un WOW break
    const wowBreak = wowBreaks.find(w => w.position === currentQuestion + 1);
    if (wowBreak) {
        showWowBreak(wowBreak);
        return;
    }
    
    // Créer le HTML de la question
    let html = `
        <div class="screen active">
            <div class="card">
                <h2 class="question-text">${question.text}</h2>
    `;
    
    if (question.subtitle) {
        html += `<p class="question-subtitle">${question.subtitle}</p>`;
    }
    
    // Gérer les différents types de questions
    switch (question.type) {
        case 'visual':
            html += createVisualOptions(question);
            break;
        case 'input':
            html += createInputField(question);
            break;
        case 'double-input':
            html += createDoubleInput(question);
            break;
        case 'multi-select':
            html += createMultiSelect(question);
            break;
        default:
            html += createSingleOptions(question);
    }
    
    // Ajouter le bouton retour si pas première question
    if (currentQuestion > 0) {
        html += `<button class="btn-back" onclick="previousQuestion()">← Retour</button>`;
    }
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Restaurer les sélections pour multi-select
    if (question.type === 'multi-select' && multiSelectAnswers[question.key]) {
        multiSelectAnswers[question.key].forEach(value => {
            const option = document.querySelector(`[data-value="${value}"]`);
            if (option) option.classList.add('selected');
        });
        updateMultiSelectCount(question.key, question.maxChoices);
    }
}

// Créer les options visuelles
function createVisualOptions(question) {
    let html = '<div class="visual-options">';
    question.options.forEach(option => {
        html += `
            <div class="visual-option" onclick="selectAnswer('${question.key}', '${option.value}')">
                <img src="${option.image}" alt="${option.label}">
                <div class="label">${option.label}</div>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// Créer un champ input
function createInputField(question) {
    return `
        <div class="input-single">
            <input 
                type="${question.inputType || 'text'}" 
                class="input-field" 
                id="${question.key}"
                placeholder="${question.placeholder}"
                onkeypress="handleInputKeypress(event, '${question.key}')"
            >
        </div>
        <button class="btn-primary" onclick="saveInputAndNext('${question.key}')">
            Continuer →
        </button>
    `;
}

// Créer double input
function createDoubleInput(question) {
    let html = '<div class="input-group">';
    question.inputs.forEach(input => {
        html += `
            <div class="input-wrapper">
                <label class="input-label">${input.placeholder}</label>
                <input 
                    type="${input.type || 'text'}" 
                    class="input-field" 
                    id="${input.key}"
                    placeholder="${input.placeholder}"
                >
            </div>
        `;
    });
    html += `</div>
        <button class="btn-primary" onclick="saveDoubleInputAndNext('${question.key}')">
            Continuer →
        </button>
    `;
    return html;
}

// Créer multi-select
function createMultiSelect(question) {
    let html = `
        <div class="multi-select-info">
            Sélectionné: <span class="multi-select-count" id="count-${question.key}">0</span> / ${question.maxChoices || 3}
        </div>
        <div class="options-grid">
    `;
    
    question.options.forEach(option => {
        html += `
            <div class="option" 
                 data-value="${option}" 
                 onclick="toggleMultiSelect('${question.key}', '${option}', ${question.maxChoices || 3})">
                ${option}
            </div>
        `;
    });
    
    html += `</div>
        <button class="btn-primary" onclick="saveMultiSelectAndNext('${question.key}')">
            Continuer →
        </button>
    `;
    return html;
}

// Créer options simples
function createSingleOptions(question) {
    let html = '<div class="options">';
    question.options.forEach(option => {
        html += `
            <div class="option" onclick="selectAnswer('${question.key}', '${option}')">
                ${option}
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// Afficher un WOW break
function showWowBreak(wowBreak) {
    const container = document.getElementById('quiz-container');
    
    let html = `
        <div class="screen active">
            <div class="card wow-break">
                <div class="wow-header">
                    <div class="wow-icon">${wowBreak.icon}</div>
                    <h2 class="wow-title">${wowBreak.title}</h2>
                </div>
                
                <div class="wow-content">
                    <span class="study-badge">📊 ${wowBreak.badge}</span>
                    
                    <div class="wow-stat">${wowBreak.mainStat}</div>
    `;
    
    if (wowBreak.highlight) {
        html += `<p class="wow-highlight">${wowBreak.highlight}</p>`;
    }
    
    if (wowBreak.stats) {
        html += '<div class="wow-stats"><ul>';
        wowBreak.stats.forEach(stat => {
            html += `<li>${stat}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (wowBreak.boostMethods) {
        html += '<div class="wow-stats"><ul>';
        wowBreak.boostMethods.forEach(method => {
            html += `<li>${method}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (wowBreak.benefits) {
        html += '<div class="wow-stats"><ul>';
        wowBreak.benefits.forEach(benefit => {
            html += `<li>${benefit}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (wowBreak.reasons) {
        html += '<div class="wow-stats"><ul>';
        wowBreak.reasons.forEach(reason => {
            html += `<li>${reason}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (wowBreak.possibilities) {
        html += '<div class="wow-stats"><ul>';
        wowBreak.possibilities.forEach(possibility => {
            html += `<li>${possibility}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (wowBreak.breakdown) {
        html += `<p class="wow-highlight">${wowBreak.breakdown}</p>`;
    }
    
    if (wowBreak.comparison) {
        html += `<div class="wow-comparison">${wowBreak.comparison}</div>`;
    }
    
    if (wowBreak.solution) {
        html += `<p style="text-align: center; font-weight: 600; color: var(--accent-green); margin: 20px 0;">
            ${wowBreak.solution}
        </p>`;
    }
    
    html += `
                    <div class="wow-source">
                        Source : ${wowBreak.source}
                    </div>
                </div>
                
                <button class="btn-primary btn-green" onclick="nextQuestion()">
                    ${wowBreak.id === 'wow6' ? 'DÉCOUVRIR MON SCORE →' : 'CONTINUER →'}
                </button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Sélectionner une réponse
function selectAnswer(key, value) {
    answers[key] = value;
    nextQuestion();
}

// Sauvegarder input et continuer
function saveInputAndNext(key) {
    const input = document.getElementById(key);
    if (input.value.trim()) {
        answers[key] = input.value.trim();
        nextQuestion();
    } else {
        alert('Veuillez remplir le champ');
    }
}

// Sauvegarder double input
function saveDoubleInputAndNext(key) {
    const question = questions[currentQuestion];
    let allFilled = true;
    const values = {};
    
    question.inputs.forEach(input => {
        const field = document.getElementById(input.key);
        if (!field.value.trim()) {
            allFilled = false;
        } else {
            values[input.key] = field.value.trim();
        }
    });
    
    if (allFilled) {
        Object.assign(answers, values);
        
        // Calculer l'IMC si c'est poids/taille
        if (values.weight && values.height) {
            const imc = (values.weight / Math.pow(values.height / 100, 2)).toFixed(1);
            answers.imc = imc;
        }
        
        nextQuestion();
    } else {
        alert('Veuillez remplir tous les champs');
    }
}

// Toggle multi-select
function toggleMultiSelect(key, value, maxChoices) {
    const option = event.target;
    
    if (!multiSelectAnswers[key]) {
        multiSelectAnswers[key] = [];
    }
    
    const index = multiSelectAnswers[key].indexOf(value);
    
    if (index > -1) {
        multiSelectAnswers[key].splice(index, 1);
        option.classList.remove('selected');
    } else {
        if (multiSelectAnswers[key].length < maxChoices) {
            multiSelectAnswers[key].push(value);
            option.classList.add('selected');
        } else {
            alert(`Maximum ${maxChoices} choix`);
            return;
        }
    }
    
    updateMultiSelectCount(key, maxChoices);
}

// Mettre à jour le compteur multi-select
function updateMultiSelectCount(key, maxChoices) {
    const count = multiSelectAnswers[key] ? multiSelectAnswers[key].length : 0;
    const countElement = document.getElementById(`count-${key}`);
    if (countElement) {
        countElement.textContent = count;
    }
}

// Sauvegarder multi-select
function saveMultiSelectAndNext(key) {
    if (multiSelectAnswers[key] && multiSelectAnswers[key].length > 0) {
        answers[key] = multiSelectAnswers[key];
        nextQuestion();
    } else {
        alert('Veuillez sélectionner au moins une option');
    }
}

// Question suivante
function nextQuestion() {
    currentQuestion++;
    updateProgress();
    
    if (currentQuestion >= questions.length) {
        showEmailScreen();
    } else {
        showQuestion();
    }
}

// Question précédente
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        updateProgress();
        showQuestion();
    }
}

// Gérer Enter sur input
function handleInputKeypress(event, key) {
    if (event.key === 'Enter') {
        saveInputAndNext(key);
    }
}

// Afficher l'écran email
function showEmailScreen() {
    document.getElementById('quiz-container').innerHTML = '';
    document.getElementById('screen-email').classList.add('active');
}

// Soumettre email
async function submitEmail(event) {
    event.preventDefault();
    
    userInfo = {
        firstname: document.getElementById('firstname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };
    
    // Afficher l'écran de chargement
    document.getElementById('screen-email').classList.remove('active');
    document.getElementById('screen-loading').classList.add('active');
    
    // Simuler le chargement avec messages
    const loadingMessages = [
        'Calcul de ton âge biologique...',
        'Analyse de tes facteurs de risque...',
        'Génération de ton protocole personnalisé...',
        'Finalisation de ton score...'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        if (messageIndex < loadingMessages.length) {
            document.querySelector('.loading-text').textContent = loadingMessages[messageIndex];
            messageIndex++;
        }
    }, 1000);
    
    // Calculer le score
    try {
        const response = await fetch(`${API_BASE}/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                answers,
                userInfo
            })
        });
        
        const result = await response.json();
        
        // Arrêter les messages de chargement
        clearInterval(messageInterval);
        
        // Attendre un peu pour l'effet
        setTimeout(() => {
            showResults(result);
        }, 1500);
        
    } catch (error) {
        console.error('Erreur lors du calcul:', error);
        alert('Erreur lors du calcul du score. Veuillez réessayer.');
    }
}

// Afficher les résultats
function showResults(result) {
    document.getElementById('screen-loading').classList.remove('active');
    document.getElementById('screen-results').classList.add('active');
    
    // Animer le score
    animateScore(result.score);
    
    // Afficher les âges
    document.getElementById('chronoAge').textContent = result.chronologicalAge + ' ans';
    document.getElementById('bioAge').textContent = result.biologicalAge + ' ans';
    
    // Afficher le risque
    const riskElement = document.getElementById('riskLevel');
    riskElement.textContent = result.risk.level;
    riskElement.style.color = result.risk.color;
    
    document.getElementById('trend').textContent = result.risk.trend;
    
    // Afficher les projections
    const futureRisksList = document.getElementById('futureRisks');
    futureRisksList.innerHTML = '';
    result.projections.forEach(risk => {
        const li = document.createElement('li');
        li.innerHTML = risk;
        if (risk.includes('🚨')) {
            li.style.color = '#FF4444';
        } else if (risk.includes('⚠️')) {
            li.style.color = '#FFA500';
        } else if (risk.includes('✅') || risk.includes('🌟')) {
            li.style.color = '#00CC00';
        }
        futureRisksList.appendChild(li);
    });
    
    // Afficher l'email
    document.getElementById('userEmail').textContent = userInfo.email;
    
    // Mettre à jour la progression
    updateProgress(true);
}

// Animer le score
function animateScore(targetScore) {
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreProgress = document.getElementById('scoreProgress');
    
    let currentScore = 0;
    const increment = targetScore / 50;
    const circumference = 2 * Math.PI * 110;
    
    const interval = setInterval(() => {
        currentScore += increment;
        
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(interval);
        }
        
        scoreNumber.textContent = Math.round(currentScore);
        
        // Animer le cercle
        const offset = circumference - (currentScore / 100) * circumference;
        scoreProgress.style.strokeDashoffset = offset;
        
        // Changer la couleur selon le score
        if (currentScore < 40) {
            scoreProgress.style.stroke = '#FF4444';
        } else if (currentScore < 60) {
            scoreProgress.style.stroke = '#FFA500';
        } else if (currentScore < 80) {
            scoreProgress.style.stroke = '#01FF00';
        } else {
            scoreProgress.style.stroke = '#00CC00';
        }
    }, 30);
}

// Mettre à jour la progression
function updateProgress(complete = false) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progress-text');
    
    if (complete) {
        progressBar.style.width = '100%';
        progressText.textContent = 'Analyse complète !';
    } else {
        const progress = ((currentQuestion + 1) / totalSteps) * 100;
        progressBar.style.width = progress + '%';
        
        if (currentQuestion === 0) {
            progressText.textContent = 'Prêt à commencer';
        } else if (currentQuestion < 10) {
            progressText.textContent = `Question ${currentQuestion} / ${questions.length}`;
        } else if (currentQuestion < 20) {
            progressText.textContent = 'Continue, tu progresses bien !';
        } else if (currentQuestion < 30) {
            progressText.textContent = 'Plus que quelques questions...';
        } else {
            progressText.textContent = 'Dernières questions !';
        }
    }
}

// Réserver un appel
function bookCall() {
    // Remplace par ton lien Calendly
    window.open('https://calendly.com/oralife/consultation', '_blank');
    
    // Tracking (si Google Analytics installé)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'book_call', {
            'event_category': 'engagement',
            'event_label': 'quiz_result'
        });
    }
}
