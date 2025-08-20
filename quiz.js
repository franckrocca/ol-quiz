// État global du quiz
let currentQuestion = 0;
let answers = {};
let multiSelectAnswers = {};
let userInfo = {};
let questions = [];
let wowBreaks = [];
let totalSteps = 0;

// Configuration API - Mode fallback si API non disponible
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';
const USE_LOCAL_DATA = false; // Mettre à true pour tester sans API

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Quiz initialization...');
    await loadQuizData();
    
    // Rendre la fonction startQuiz accessible globalement
    window.startQuiz = startQuiz;
});

// Charger les données du quiz
async function loadQuizData() {
    try {
        if (USE_LOCAL_DATA) {
            // Mode local pour test
            loadLocalData();
        } else {
            // Charger depuis l'API
            console.log('Loading from API:', API_BASE + '/questions');
            const response = await fetch(`${API_BASE}/questions`);
            
            if (!response.ok) {
                throw new Error('API response not OK: ' + response.status);
            }
            
            const data = await response.json();
            questions = data.questions || [];
            wowBreaks = data.wowBreaks || [];
            
            console.log('Loaded questions:', questions.length);
            console.log('Loaded WOW breaks:', wowBreaks.length);
        }
        
        // Calculer le nombre total d'étapes
        totalSteps = questions.length + wowBreaks.length + 2;
        
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        // Fallback sur données locales si API échoue
        console.log('Falling back to local data...');
        loadLocalData();
    }
}

// Données locales de fallback (minimum pour tester)
function loadLocalData() {
    questions = [
        {
            id: 1,
            key: 'gender',
            text: 'Tu es ?',
            type: 'single',
            options: ['Homme', 'Femme']
        },
        {
            id: 2,
            key: 'age',
            text: 'Quel est ton âge exact ?',
            type: 'input',
            inputType: 'number',
            placeholder: 'Ex: 42'
        }
    ];
    
    wowBreaks = [
        {
            id: 'wow1',
            position: 3,
            icon: '🧬',
            title: 'TEST WOW BREAK',
            mainStat: 'Test en cours...'
        }
    ];
    
    totalSteps = questions.length + wowBreaks.length + 2;
    console.log('Local data loaded');
}

// Démarrer le quiz
function startQuiz() {
    console.log('Starting quiz...');
    const landingScreen = document.getElementById('screen-landing');
    
    if (!landingScreen) {
        console.error('Landing screen not found!');
        return;
    }
    
    if (questions.length === 0) {
        alert('Le quiz n\'est pas encore chargé. Veuillez rafraîchir la page.');
        return;
    }
    
    landingScreen.classList.remove('active');
    landingScreen.style.display = 'none';
    
    currentQuestion = 0;
    showQuestion();
    updateProgress();
}

// Afficher une question
function showQuestion() {
    const container = document.getElementById('quiz-container');
    
    if (!container) {
        console.error('Quiz container not found!');
        return;
    }
    
    if (currentQuestion >= questions.length) {
        showEmailScreen();
        return;
    }
    
    const question = questions[currentQuestion];
    
    // Gérer les questions conditionnelles
    if (question.conditional) {
        const conditionKey = Object.keys(question.conditional)[0];
        const conditionValue = question.conditional[conditionKey];
        if (answers[conditionKey] !== conditionValue) {
            currentQuestion++;
            showQuestion();
            return;
        }
    }
    
    // Vérifier les WOW breaks
    const wowBreak = wowBreaks.find(w => w.position === currentQuestion + 1);
    if (wowBreak) {
        showWowBreak(wowBreak);
        return;
    }
    
    // Créer le HTML de la question
    let html = `
        <div class="screen active" style="display: block;">
            <div class="card">
                <h2 class="question-text">${question.text}</h2>
    `;
    
    if (question.subtitle) {
        html += `<p class="question-subtitle">${question.subtitle}</p>`;
    }
    
    // Gérer les types de questions
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
    
    if (currentQuestion > 0) {
        html += `<button class="btn-back" onclick="previousQuestion()">← Retour</button>`;
    }
    
    html += `</div></div>`;
    
    container.innerHTML = html;
    container.style.display = 'block';
    
    // Setup pour multi-select
    if (question.type === 'multi-select') {
        setTimeout(() => setupMultiSelectListeners(question.key, question.maxChoices), 100);
    }
    
    // Setup pour IMC
    if (question.showIMC) {
        setTimeout(() => setupIMCCalculation(), 100);
    }
}

// Créer options visuelles
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

// Créer champ input
function createInputField(question) {
    return `
        <div class="input-single">
            <input 
                type="${question.inputType || 'text'}" 
                class="input-field" 
                id="${question.key}"
                placeholder="${question.placeholder}"
                onkeypress="if(event.key === 'Enter') saveInputAndNext('${question.key}')"
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
        <div id="imc-display" class="imc-display"></div>
        <button class="btn-primary" onclick="saveDoubleInputAndNext('${question.key}')">
            Continuer →
        </button>
    `;
    return html;
}

// Créer multi-select
function createMultiSelect(question) {
    const maxChoices = question.maxChoices || 999;
    let html = `
        <div class="multi-select-info">
            Sélectionné: <span class="multi-select-count" id="count-${question.key}">0</span>
            ${question.maxChoices ? ' / ' + question.maxChoices : ''}
        </div>
        <div class="options-grid">
    `;
    
    question.options.forEach((option, index) => {
        html += `
            <div class="option multi-option" 
                 data-value="${option}"
                 data-key="${question.key}"
                 id="option-${question.key}-${index}">
                <span class="checkbox-icon">☐</span>
                <span class="option-text">${option}</span>
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

// Créer options simples - CORRIGÉ pour le bug des apostrophes
function createSingleOptions(question) {
    let html = '<div class="options">';
    question.options.forEach((option, index) => {
        // Utiliser l'index au lieu de passer la valeur directement pour éviter les problèmes d'apostrophes
        html += `
            <div class="option" onclick="selectAnswerByIndex('${question.key}', ${index})">
                ${option}
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// Nouvelle fonction pour sélectionner par index
function selectAnswerByIndex(key, index) {
    const question = questions[currentQuestion];
    if (question && question.options && question.options[index] !== undefined) {
        answers[key] = question.options[index];
        nextQuestion();
    }
}

// Afficher WOW break
function showWowBreak(wowBreak) {
    const container = document.getElementById('quiz-container');
    
    let html = `
        <div class="screen active" style="display: block;">
            <div class="card wow-break">
                <div class="wow-header">
                    <div class="wow-icon">${wowBreak.icon}</div>
                    <h2 class="wow-title">${wowBreak.title}</h2>
                </div>
                
                <div class="wow-content">
    `;
    
    if (wowBreak.badge) {
        html += `<span class="study-badge">${wowBreak.badge}</span>`;
    }
    
    // Traitement spécial pour le WOW 7% / 93%
    if (wowBreak.id === 'wow6' && wowBreak.mainStat.includes('7%')) {
        html += `
            <div class="wow-percentage-display">
                <div class="percentage-block">
                    <div class="percentage-number" style="color: #FF4444;">7%</div>
                    <div class="percentage-label">Génétique</div>
                </div>
                <div style="font-size: 40px; color: #E5E5E7;">|</div>
                <div class="percentage-block">
                    <div class="percentage-number" style="color: #01FF00;">93%</div>
                    <div class="percentage-label">Tes choix</div>
                </div>
            </div>
        `;
    } else if (wowBreak.mainStat) {
        html += `<div class="wow-stat">${wowBreak.mainStat}</div>`;
    }
    
    if (wowBreak.highlight) {
        html += `<p class="wow-highlight">${wowBreak.highlight}</p>`;
    }
    
    if (wowBreak.stats && wowBreak.stats.length > 0) {
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
    
    if (wowBreak.comparison) {
        html += `<div class="wow-comparison">${wowBreak.comparison}</div>`;
    }
    
    if (wowBreak.solution) {
        html += `<p style="text-align: center; font-weight: 700; color: var(--accent-green); margin: 20px 0; font-size: 16px;">
            ${wowBreak.solution}
        </p>`;
    }
    
    if (wowBreak.source) {
        html += `
            <div class="wow-source">
                📚 Source : ${wowBreak.source}
            </div>
        `;
    }
    
    html += `
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
    if (input && input.value.trim()) {
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
        if (!field || !field.value.trim()) {
            allFilled = false;
        } else {
            values[input.key] = field.value.trim();
        }
    });
    
    if (allFilled) {
        Object.assign(answers, values);
        
        // Calculer IMC si poids/taille
        if (values.weight && values.height) {
            const imc = (values.weight / Math.pow(values.height / 100, 2)).toFixed(1);
            answers.imc = imc;
        }
        
        nextQuestion();
    } else {
        alert('Veuillez remplir tous les champs');
    }
}

// Setup multi-select listeners
function setupMultiSelectListeners(key, maxChoices) {
    const options = document.querySelectorAll(`[data-key="${key}"]`);
    
    options.forEach(option => {
        option.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const value = this.getAttribute('data-value');
            
            if (!multiSelectAnswers[key]) {
                multiSelectAnswers[key] = [];
            }
            
            const index = multiSelectAnswers[key].indexOf(value);
            const checkbox = this.querySelector('.checkbox-icon');
            
            if (value === 'Aucune activité' || value === 'Aucun') {
                if (index === -1) {
                    multiSelectAnswers[key] = [value];
                    options.forEach(opt => {
                        opt.classList.remove('selected');
                        const cb = opt.querySelector('.checkbox-icon');
                        if (cb) cb.textContent = '☐';
                    });
                    this.classList.add('selected');
                    checkbox.textContent = '☑';
                } else {
                    multiSelectAnswers[key] = [];
                    this.classList.remove('selected');
                    checkbox.textContent = '☐';
                }
            } else {
                // Désélectionner "Aucun" si présent
                const aucunOptions = ['Aucune activité', 'Aucun'];
                aucunOptions.forEach(aucunValue => {
                    const aucunIndex = multiSelectAnswers[key].indexOf(aucunValue);
                    if (aucunIndex > -1) {
                        multiSelectAnswers[key].splice(aucunIndex, 1);
                        const aucunOpt = document.querySelector(`[data-value="${aucunValue}"]`);
                        if (aucunOpt) {
                            aucunOpt.classList.remove('selected');
                            const cb = aucunOpt.querySelector('.checkbox-icon');
                            if (cb) cb.textContent = '☐';
                        }
                    }
                });
                
                if (index > -1) {
                    multiSelectAnswers[key].splice(index, 1);
                    this.classList.remove('selected');
                    checkbox.textContent = '☐';
                } else {
                    if (maxChoices && multiSelectAnswers[key].length >= maxChoices) {
                        alert(`Maximum ${maxChoices} choix`);
                        return;
                    }
                    multiSelectAnswers[key].push(value);
                    this.classList.add('selected');
                    checkbox.textContent = '☑';
                }
            }
            
            updateMultiSelectCount(key, maxChoices);
        };
    });
}

// Mettre à jour compteur multi-select
function updateMultiSelectCount(key, maxChoices) {
    const count = multiSelectAnswers[key] ? multiSelectAnswers[key].length : 0;
    const countElement = document.getElementById(`count-${key}`);
    if (countElement) {
        countElement.textContent = count;
    }
}

// Sauvegarder multi-select et continuer
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

// Setup calcul IMC - AMÉLIORÉ
function setupIMCCalculation() {
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    
    if (!weightInput || !heightInput) return;
    
    const calculateIMC = () => {
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        
        if (weight && height) {
            const imc = (weight / Math.pow(height / 100, 2)).toFixed(1);
            
            let imcDisplay = document.getElementById('imc-display');
            if (!imcDisplay) {
                imcDisplay = document.createElement('div');
                imcDisplay.id = 'imc-display';
                imcDisplay.className = 'imc-display';
                const button = document.querySelector('.btn-primary');
                button.parentElement.insertBefore(imcDisplay, button);
            }
            
            let imcColor = '#00CC00'; // Vert plus foncé pour meilleur contraste
            let imcText = 'Poids normal ✓';
            
            if (imc < 18.5) {
                imcColor = '#FF8C00'; // Orange plus foncé
                imcText = 'Insuffisance pondérale';
            } else if (imc >= 25 && imc < 30) {
                imcColor = '#FF8C00';
                imcText = 'Surpoids';
            } else if (imc >= 30) {
                imcColor = '#FF4444';
                imcText = 'Obésité';
            }
            
            const indicatorPosition = Math.min(Math.max((imc - 15) * 4, 0), 100);
            
            imcDisplay.innerHTML = `
                <div class="imc-container">
                    <div class="imc-header">
                        <span class="imc-label">Ton IMC :</span>
                        <span class="imc-value">${imc}</span>
                    </div>
                    <div class="imc-bar-container">
                        <div class="imc-indicator" style="left: ${indicatorPosition}%;">
                            <div class="imc-arrow"></div>
                        </div>
                    </div>
                    <div class="imc-status">
                        <span class="imc-status-text" style="color: ${imcColor};">${imcText}</span>
                    </div>
                </div>
            `;
            
            answers.imc = imc;
        }
    };
    
    weightInput.addEventListener('input', calculateIMC);
    heightInput.addEventListener('input', calculateIMC);
}

// Mettre à jour la progression
function updateProgress(complete = false) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progress-text');
    
    if (!progressBar || !progressText) return;
    
    if (complete) {
        progressBar.style.width = '100%';
        progressText.textContent = 'Analyse complète !';
    } else {
        const progress = ((currentQuestion + 1) / totalSteps) * 100;
        progressBar.style.width = progress + '%';
        
        // Messages motivants
        const messages = [
            'C\'est parti !',
            'Excellent début !',
            'Tu progresses bien !',
            'Continue comme ça !',
            'Déjà la moitié !',
            'Tu y es presque !',
            'Plus que quelques questions...',
            'Dernière ligne droite !',
            'Presque terminé !'
        ];
        
        const messageIndex = Math.min(Math.floor((currentQuestion / questions.length) * messages.length), messages.length - 1);
        progressText.textContent = messages[messageIndex];
    }
}

// Afficher écran email
function showEmailScreen() {
    const container = document.getElementById('quiz-container');
    if (container) container.style.display = 'none';
    
    const emailScreen = document.getElementById('screen-email');
    if (emailScreen) {
        emailScreen.classList.add('active');
        emailScreen.style.display = 'block';
    }
}

// Soumettre email
async function submitEmail(event) {
    event.preventDefault();
    
    // Validation de la checkbox
    const consentCheckbox = document.getElementById('consent');
    if (!consentCheckbox.checked) {
        alert('Veuillez accepter de recevoir votre score et les conseils personnalisés pour continuer.');
        return;
    }
    
    userInfo = {
        firstname: document.getElementById('firstname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };
    
    // Afficher écran de chargement
    document.getElementById('screen-email').style.display = 'none';
    const loadingScreen = document.getElementById('screen-loading');
    if (loadingScreen) {
        loadingScreen.classList.add('active');
        loadingScreen.style.display = 'block';
    }
    
    // Messages de chargement
    const loadingMessages = [
        'Calcul de ton âge biologique...',
        'Analyse de tes facteurs de risque...',
        'Génération de ton protocole personnalisé...',
        'Finalisation de ton score...'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        if (messageIndex < loadingMessages.length) {
            const loadingText = document.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = loadingMessages[messageIndex];
            }
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
        
        clearInterval(messageInterval);
        
        setTimeout(() => {
            showResults(result);
        }, 1500);
        
    } catch (error) {
        console.error('Erreur lors du calcul:', error);
        clearInterval(messageInterval);
        
        // Résultat par défaut si erreur
        const defaultResult = {
            score: 65,
            biologicalAge: parseInt(answers.age || 40) + 5,
            chronologicalAge: parseInt(answers.age || 40),
            risk: {
                level: 'Modéré',
                color: '#FFA500',
                trend: 'Vieillissement normal'
            },
            projections: [
                '⚠️ Amélioration nécessaire',
                '💡 Potentiel d\'optimisation important',
                '🚀 Objectif : Gagner 5-10 ans'
            ]
        };
        
        showResults(defaultResult);
    }
}

// Afficher les résultats
function showResults(result) {
    const loadingScreen = document.getElementById('screen-loading');
    if (loadingScreen) loadingScreen.style.display = 'none';
    
    const resultsScreen = document.getElementById('screen-results');
    if (resultsScreen) {
        resultsScreen.classList.add('active');
        resultsScreen.style.display = 'block';
    }
    
    // Animer le score
    animateScore(result.score);
    
    // Afficher les âges
    const chronoAge = document.getElementById('chronoAge');
    const bioAge = document.getElementById('bioAge');
    if (chronoAge) chronoAge.textContent = result.chronologicalAge + ' ans';
    if (bioAge) bioAge.textContent = result.biologicalAge + ' ans';
    
    // Afficher le message d'âge
    const ageMessage = document.getElementById('ageMessage');
    if (ageMessage && result.ageMessage) {
        ageMessage.textContent = result.ageMessage;
        ageMessage.style.display = 'block';
    }
    
    // Afficher le risque
    const riskElement = document.getElementById('riskLevel');
    if (riskElement) {
        riskElement.textContent = result.risk.level;
        riskElement.style.color = result.risk.color;
    }
    
    const trendElement = document.getElementById('trend');
    if (trendElement) trendElement.textContent = result.risk.trend;
    
    // Afficher les projections
    const futureRisksList = document.getElementById('futureRisks');
    if (futureRisksList) {
        futureRisksList.innerHTML = '';
        result.projections.forEach(risk => {
            const li = document.createElement('li');
            li.innerHTML = risk;
            if (risk.includes('🚨') || risk.includes('🆘')) {
                li.style.color = '#FF4444';
            } else if (risk.includes('⚠️')) {
                li.style.color = '#FFA500';
            } else if (risk.includes('✅') || risk.includes('🌟')) {
                li.style.color = '#00CC00';
            } else if (risk.includes('💡') || risk.includes('🚀')) {
                li.style.color = '#000324';
            }
            futureRisksList.appendChild(li);
        });
    }
    
    // Afficher l'email
    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement) userEmailElement.textContent = userInfo.email;
    
    updateProgress(true);
}

// Animer le score
function animateScore(targetScore) {
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreProgress = document.getElementById('scoreProgress');
    
    if (!scoreNumber || !scoreProgress) return;
    
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
        
        const offset = circumference - (currentScore / 100) * circumference;
        scoreProgress.style.strokeDashoffset = offset;
        
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

// Réserver un appel
function bookCall() {
    window.open('https://calendly.com/oralife/consultation', '_blank');
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'book_call', {
            'event_category': 'engagement',
            'event_label': 'quiz_result'
        });
    }
}

// Exposer TOUTES les fonctions globalement
window.startQuiz = startQuiz;
window.selectAnswer = selectAnswer;
window.selectAnswerByIndex = selectAnswerByIndex;
window.saveInputAndNext = saveInputAndNext;
window.saveDoubleInputAndNext = saveDoubleInputAndNext;
window.saveMultiSelectAndNext = saveMultiSelectAndNext;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.submitEmail = submitEmail;
window.bookCall = bookCall;

console.log('Quiz.js loaded successfully');