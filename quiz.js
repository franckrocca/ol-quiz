// État global du quiz
let currentQuestion = 0;
let answers = {};
let multiSelectAnswers = {};
let userInfo = {};
let questions = [];
let wowBreaks = [];
let totalSteps = 0;

// Configuration API
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Quiz initialization...');
    await loadQuizData();
    window.startQuiz = startQuiz;
});

// Charger les données du quiz
async function loadQuizData() {
    try {
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
        
        // Calculer le nombre total d'étapes
        totalSteps = questions.length + wowBreaks.length + 2;
        
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        alert('Erreur de chargement du quiz. Veuillez rafraîchir la page.');
    }
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
    
    landingScreen.style.display = 'none';
    currentQuestion = 0;
    answers = {};
    multiSelectAnswers = {};
    showQuestion();
}

// Afficher une question
function showQuestion() {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    
    // Vérifier si c'est un WOW break
    const wowBreak = wowBreaks.find(w => w.position === currentQuestion);
    if (wowBreak) {
        showWowBreak(wowBreak);
        return;
    }
    
    // Afficher la question
    if (currentQuestion >= questions.length) {
        showEmailScreen();
        return;
    }
    
    let question = questions[currentQuestion];
    
    // LOGIQUE SPÉCIALE : Skip question hormones pour les hommes
    if (question.key === 'hormones' && answers.gender === 'Homme') {
        // Passer directement à la question suivante
        currentQuestion++;
        showQuestion();
        return;
    }
    
    container.style.display = 'block';
    container.innerHTML = renderQuestion(question);
    
    updateProgress();
    
    // Support clavier Enter pour validation
    setupKeyboardSupport(question);
}

// Support clavier
function setupKeyboardSupport(question) {
    document.removeEventListener('keypress', handleEnterKey);
    
    function handleEnterKey(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            
            if (question.type === 'input') {
                const input = document.getElementById('single-input');
                if (input && input.value.trim()) {
                    saveInputAndNext();
                }
            } else if (question.type === 'double-input') {
                const input1 = document.getElementById('double-input-1');
                const input2 = document.getElementById('double-input-2');
                if (input1 && input1.value && input2 && input2.value) {
                    saveDoubleInputAndNext();
                }
            } else if (question.type === 'multi') {
                const selected = multiSelectAnswers[question.key];
                if (selected && selected.length > 0) {
                    saveMultiSelectAndNext();
                }
            }
        }
    }
    
    document.addEventListener('keypress', handleEnterKey);
}

// Render question HTML
function renderQuestion(question) {
    let optionsHtml = '';
    
    if (question.type === 'single') {
        optionsHtml = `
            <div class="options-container">
                ${question.options.map((option, index) => `
                    <div class="option-card" 
                         onclick="selectAnswer('${option.replace(/'/g, "\\'")}')"
                         data-value="${option}"
                         data-index="${index}">
                        ${option}
                    </div>
                `).join('')}
            </div>
        `;
    } else if (question.type === 'multi') {
        if (!multiSelectAnswers[question.key]) {
            multiSelectAnswers[question.key] = [];
        }
        optionsHtml = `
            <div class="options-container multi-select">
                ${question.options.map((option, index) => `
                    <div class="option-card multi-select" 
                         data-value="${option}"
                         data-index="${index}"
                         onclick="toggleMultiSelect('${question.key}', '${option.replace(/'/g, "\\'")}')"
                         id="option-${question.key}-${index}">
                        ${option}
                    </div>
                `).join('')}
            </div>
            <button class="btn-secondary" onclick="saveMultiSelectAndNext()">
                Continuer →
            </button>
            ${question.key === 'objectives' ? '<p class="hint">Maximum 3 objectifs</p>' : ''}
        `;
    } else if (question.type === 'input') {
        const placeholder = question.placeholder || 'Ta réponse ici...';
        optionsHtml = `
            <div class="input-container">
                <input type="${question.inputType || 'text'}" 
                       id="single-input" 
                       placeholder="${placeholder}"
                       ${question.inputType === 'number' ? 'min="0" max="120"' : ''}>
                <button class="btn-secondary" onclick="saveInputAndNext()">
                    Continuer →
                </button>
            </div>
        `;
    } else if (question.type === 'double-input') {
        optionsHtml = `
            <div class="double-input-container">
                <div class="input-group">
                    <label>${question.label1}</label>
                    <input type="number" id="double-input-1" 
                           placeholder="${question.placeholder1}"
                           min="0" ${question.key === 'weight_height' ? 'max="300"' : ''}>
                </div>
                <div class="input-group">
                    <label>${question.label2}</label>
                    <input type="number" id="double-input-2" 
                           placeholder="${question.placeholder2}"
                           min="0" ${question.key === 'weight_height' ? 'max="250"' : ''}>
                </div>
                <div id="imc-display"></div>
                <button class="btn-secondary" onclick="saveDoubleInputAndNext()">
                    Continuer →
                </button>
            </div>
        `;
        
        // Auto-calcul IMC
        if (question.key === 'weight_height') {
            setTimeout(() => {
                const input1 = document.getElementById('double-input-1');
                const input2 = document.getElementById('double-input-2');
                if (input1 && input2) {
                    input1.addEventListener('input', calculateIMC);
                    input2.addEventListener('input', calculateIMC);
                }
            }, 100);
        }
    }
    
    return `
        <div class="card question-card">
            <div class="question-header">
                <button class="btn-back" onclick="previousQuestion()">←</button>
                <span class="question-number">Question ${currentQuestion + 1}/${questions.length}</span>
            </div>
            <h2 class="question-text">${question.text}</h2>
            ${question.subtitle ? `<p class="question-subtitle">${question.subtitle}</p>` : ''}
            ${optionsHtml}
        </div>
    `;
}

// Calculer IMC automatiquement (STYLE COMME INDEX9)
function calculateIMC() {
    const weightInput = document.getElementById('double-input-1');
    const heightInput = document.getElementById('double-input-2');
    const imcDisplay = document.getElementById('imc-display');
    
    if (!weightInput || !heightInput || !imcDisplay) return;
    
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);
    
    if (weight > 0 && height > 0) {
        const imc = (weight / Math.pow(height / 100, 2)).toFixed(1);
        let imcStatus = '';
        let imcStatusColor = '';
        let imcPosition = 0;
        
        if (imc < 18.5) {
            imcStatus = 'Insuffisant';
            imcStatusColor = '#3498db';
            imcPosition = (imc / 18.5) * 18.5;
        } else if (imc < 25) {
            imcStatus = 'Poids normal ✓';
            imcStatusColor = '#01FF00';
            imcPosition = 18.5 + ((imc - 18.5) / 6.5) * 31.5;
        } else if (imc < 30) {
            imcStatus = 'Surpoids';
            imcStatusColor = '#FFA500';
            imcPosition = 50 + ((imc - 25) / 5) * 25;
        } else {
            imcStatus = 'Obésité';
            imcStatusColor = '#FF4444';
            imcPosition = 75 + Math.min((imc - 30) / 10 * 25, 25);
        }
        
        // Style exactement comme index9
        imcDisplay.innerHTML = `
            <div class="imc-card">
                <div class="imc-header">
                    <span>Ton IMC :</span>
                    <span class="imc-value">${imc}</span>
                </div>
                <div class="imc-bar-container">
                    <div class="imc-bar"></div>
                    <div class="imc-indicator" style="left: ${imcPosition}%;"></div>
                </div>
                <div class="imc-status" style="color: ${imcStatusColor};">
                    ${imcStatus}
                </div>
            </div>
        `;
        
        answers.imc = imc;
    }
}

// Sélectionner une réponse (FIX pour première option)
function selectAnswer(value) {
    const question = questions[currentQuestion];
    
    // FIX : Utiliser data-index pour identifier la première option
    const optionCards = document.querySelectorAll('.option-card');
    const clickedCard = event ? event.target : optionCards[0];
    
    // Stocker la réponse
    answers[question.key] = value;
    
    // Mettre à jour l'UI
    optionCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    if (clickedCard) {
        clickedCard.classList.add('selected');
    }
    
    // Passer à la question suivante
    setTimeout(() => {
        nextQuestion();
    }, 300);
}

// Toggle multi-select (FIX pour première option)
function toggleMultiSelect(key, value) {
    if (!multiSelectAnswers[key]) {
        multiSelectAnswers[key] = [];
    }
    
    const clickedCard = event.target;
    const index = multiSelectAnswers[key].indexOf(value);
    
    if (index > -1) {
        multiSelectAnswers[key].splice(index, 1);
        clickedCard.classList.remove('selected');
    } else {
        // Limite selon la question
        const maxSelections = key === 'objectives' ? 3 : 10;
        if (multiSelectAnswers[key].length < maxSelections) {
            multiSelectAnswers[key].push(value);
            clickedCard.classList.add('selected');
        } else if (key === 'objectives') {
            alert('Maximum 3 objectifs prioritaires');
        }
    }
}

// Sauvegarder input simple
function saveInputAndNext() {
    const input = document.getElementById('single-input');
    if (!input || !input.value.trim()) {
        alert('Merci de remplir le champ');
        return;
    }
    
    const question = questions[currentQuestion];
    answers[question.key] = input.value.trim();
    nextQuestion();
}

// Sauvegarder double input
function saveDoubleInputAndNext() {
    const input1 = document.getElementById('double-input-1');
    const input2 = document.getElementById('double-input-2');
    
    if (!input1 || !input2 || !input1.value || !input2.value) {
        alert('Merci de remplir les deux champs');
        return;
    }
    
    const question = questions[currentQuestion];
    
    if (question.key === 'weight_height') {
        answers.weight = parseFloat(input1.value);
        answers.height = parseFloat(input2.value);
        // L'IMC est déjà calculé et stocké par calculateIMC()
    } else {
        answers[`${question.key}_1`] = input1.value;
        answers[`${question.key}_2`] = input2.value;
    }
    
    nextQuestion();
}

// Sauvegarder multi-select
function saveMultiSelectAndNext() {
    const question = questions[currentQuestion];
    const selected = multiSelectAnswers[question.key];
    
    if (!selected || selected.length === 0) {
        alert('Merci de sélectionner au moins une option');
        return;
    }
    
    answers[question.key] = selected;
    nextQuestion();
}

// Question suivante
function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

// Question précédente
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        // Si on retourne avant la question hormones et qu'on est un homme
        if (questions[currentQuestion].key === 'hormones' && answers.gender === 'Homme') {
            currentQuestion--;
        }
        showQuestion();
    }
}

// Afficher WOW break (PLUS COMPACT)
function showWowBreak(wowBreak) {
    const container = document.getElementById('quiz-container');
    
    // Classe spéciale pour le WOW destiny
    const isDestinyWow = wowBreak.title && wowBreak.title.includes('CONTRÔLES');
    const wowClass = isDestinyWow ? 'wow-card destiny-wow' : 'wow-card';
    
    // Contenu spécial pour "Ta chaise te tue"
    let specialContent = '';
    if (wowBreak.title === 'TA CHAISE TE TUE') {
        specialContent = `
            <div class="chair-stats">
                <div class="stat-row">
                    <span>4h assis</span>
                    <span class="stat-ok">✓ Risque minimal</span>
                </div>
                <div class="stat-row">
                    <span>7h assis</span>
                    <span class="stat-warning">+5% mortalité</span>
                </div>
                <div class="stat-row warning">
                    <span>10h assis (avec sport)</span>
                    <span class="stat-danger">+34% mortalité</span>
                </div>
                <div class="stat-row danger">
                    <span>10h assis (sans sport)</span>
                    <span class="stat-danger">+52% mortalité</span>
                </div>
            </div>
            <div class="solution-teaser">
                <strong>Solution :</strong> Pause active toutes les heures
            </div>
        `;
    }
    
    // Contenu spécial pour "Tu contrôles ton destin"
    if (isDestinyWow) {
        specialContent = `
            <div class="genetics-visual">
                <div class="genetics-stat">
                    <span class="percentage small">7%</span>
                    <span>Génétique</span>
                </div>
                <div class="genetics-stat">
                    <span class="percentage large">93%</span>
                    <span>Tes choix</span>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = `
        <div class="card ${wowClass}">
            <div class="wow-icon">${wowBreak.icon}</div>
            <h2 class="wow-title">${wowBreak.title}</h2>
            <div class="wow-main-stat">${wowBreak.mainStat}</div>
            ${specialContent}
            ${wowBreak.subStats && !specialContent ? `
                <div class="wow-sub-stats">
                    ${wowBreak.subStats.map(stat => `
                        <div class="sub-stat">${stat}</div>
                    `).join('')}
                </div>
            ` : ''}
            <div class="wow-source">
                📚 Source : ${wowBreak.source}
            </div>
            <button class="btn-primary wow-continue" onclick="nextQuestion()">
                CONTINUER →
            </button>
        </div>
    `;
    
    updateProgress();
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
        
        // Messages motivants variés
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
        
        const messageIndex = Math.min(
            Math.floor((currentQuestion / questions.length) * messages.length), 
            messages.length - 1
        );
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
    
    // Gérer la validation du formulaire
    const form = document.getElementById('emailForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            const consent = document.getElementById('consent');
            const errorDiv = document.getElementById('consent-error');
            
            if (!consent.checked) {
                e.preventDefault();
                if (errorDiv) {
                    errorDiv.style.display = 'block';
                    errorDiv.textContent = 'Veuillez accepter pour recevoir vos résultats'; // FRANÇAIS
                }
                return false;
            }
            
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        });
    }
}

// Soumettre email
async function submitEmail(event) {
    event.preventDefault();
    
    // Vérifier la checkbox
    const consent = document.getElementById('consent');
    const errorDiv = document.getElementById('consent-error');
    
    if (!consent.checked) {
        if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Veuillez accepter pour recevoir vos résultats'; // FRANÇAIS
        }
        return false;
    }
    
    userInfo = {
        firstname: document.getElementById('firstname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || ''
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
        
        // Résultat par défaut avec bon calcul
        const defaultResult = calculateDefaultScore();
        showResults(defaultResult);
    }
}

// Calculer le score par défaut (si API fail)
function calculateDefaultScore() {
    // Utiliser la même logique que api/calculate.js
    let score = 50; // Base
    
    // Ajustements selon les réponses critiques
    if (answers.sleep_quality === 'Excellent (7-9h, profond)') score += 10;
    if (answers.exercise_frequency === '5-7 fois/semaine') score += 10;
    if (answers.nutrition_quality === 'Optimale (bio, variée, équilibrée)') score += 10;
    if (answers.stress_level === 'Très faible (zen)') score += 10;
    if (answers.alcohol_consumption === 'Jamais') score += 5;
    
    // IMC optimal
    if (answers.imc && answers.imc >= 20 && answers.imc <= 25) score += 10;
    
    // Age penalty
    const age = parseInt(answers.age) || 40;
    if (age > 50) score -= 10;
    if (age > 60) score -= 10;
    
    // S'assurer que le score est entre 0 et 100
    score = Math.max(0, Math.min(100, score));
    
    return {
        score,
        biologicalAge: age + Math.round((100 - score) * 0.3),
        chronologicalAge: age,
        interpretation: score >= 80 ? 'EXCELLENT - Profil optimal' : 
                       score >= 65 ? 'BON - Santé préservée' :
                       score >= 50 ? 'MOYEN - Optimisation nécessaire' :
                       'ALERTE - Changements urgents',
        risk: {
            level: score >= 80 ? 'Très faible' : score >= 65 ? 'Faible' : 'Modéré',
            color: score >= 80 ? '#00CC00' : score >= 65 ? '#01FF00' : '#FFA500',
            trend: score >= 80 ? 'Vieillissement optimal' : 'Vieillissement normal'
        },
        priorities: [
            { key: 'sleep', label: 'Sommeil', percentage: 75 },
            { key: 'exercise', label: 'Activité physique', percentage: 65 },
            { key: 'nutrition', label: 'Nutrition', percentage: 80 }
        ],
        projections: score >= 80 ? [
            '🌟 Excellence biologique maintenue',
            '🌟 Protection maximale contre le vieillissement',
            '🌟 Espérance de vie : +10-15 ans'
        ] : [
            '⚠️ Amélioration nécessaire',
            '💡 Potentiel non exploité : 5-10 ans',
            '🚀 Objectif : Passer en zone verte'
        ]
    };
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
    
    // Interprétation
    const interpretation = document.getElementById('interpretation');
    if (interpretation) {
        interpretation.innerHTML = `
            <h3>${result.interpretation}</h3>
        `;
    }
    
    // Niveau de risque
    const riskLevel = document.getElementById('riskLevel');
    if (riskLevel && result.risk) {
        riskLevel.innerHTML = `
            <div class="risk-indicator" style="background: ${result.risk.color}20; border-left: 4px solid ${result.risk.color};">
                <strong>Niveau de risque :</strong> ${result.risk.level}<br>
                <small>${result.risk.trend}</small>
            </div>
        `;
    }
    
    // Priorités
    const priorities = document.getElementById('priorities');
    if (priorities && result.priorities) {
        priorities.innerHTML = result.priorities.map(p => `
            <div class="priority-item">
                <span class="priority-label">${p.label}</span>
                <div class="priority-bar">
                    <div class="priority-progress" style="width: ${p.percentage}%; background: ${p.percentage < 50 ? '#FF4444' : '#01FF00'};"></div>
                </div>
                <span class="priority-value">${p.percentage}%</span>
            </div>
        `).join('');
    }
    
    // Projections
    const projections = document.getElementById('projections');
    if (projections && result.projections) {
        projections.innerHTML = result.projections.map(p => `
            <div class="projection-item">${p}</div>
        `).join('');
    }
    
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
        
        // Couleur selon le score
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

// Exposer les fonctions globalement
window.startQuiz = startQuiz;
window.selectAnswer = selectAnswer;
window.toggleMultiSelect = toggleMultiSelect;
window.saveInputAndNext = saveInputAndNext;
window.saveDoubleInputAndNext = saveDoubleInputAndNext;
window.saveMultiSelectAndNext = saveMultiSelectAndNext;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.submitEmail = submitEmail;
window.bookCall = bookCall;

console.log('Quiz.js loaded successfully');
