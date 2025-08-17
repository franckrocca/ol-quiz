// Configuration du quiz ORA LIFE
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjyAjH9Nl6y2IeRWHi5Qrr6ftqVilH4T9RMPAdNXM_XYVuaN0WFzrPPYwVL8oOZR0W/exec';
const API_URL = '/api/calculate-score';

// État global
let currentStep = -1; // -1 = intro
let answers = {};
let selectedAnswers = {};
let hasShownMidPage = false;
let wowBreaksShown = { 1: false, 2: false, 3: false };

// Questions simplifiées B2C
const questions = [
    {
        id: 'age',
        type: 'single_image',
        title: 'Quel est ton âge ?',
        subtitle: 'Pour adapter tes recommandations',
        answers: [
            {
                value: '18-29',
                title: '18-29 ans',
                description: 'Génération digitale',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face'
            },
            {
                value: '30-39',
                title: '30-39 ans', 
                description: 'Force de l\'âge',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face'
            },
            {
                value: '40-49',
                title: '40-49 ans',
                description: 'Expérience & maturité',
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=400&fit=crop&crop=face'
            },
            {
                value: '50+',
                title: '50+ ans',
                description: 'Sagesse & accomplissement',
                image: 'https://images.unsplash.com/photo-1559548331-f9cb98001426?w=300&h=400&fit=crop&crop=face'
            }
        ]
    },
    {
        id: 'genre',
        type: 'single_text',
        title: 'Tu es ?',
        subtitle: 'Pour personnaliser ton protocole',
        answers: [
            { value: 'homme', title: 'Un homme', description: 'Protocole masculin' },
            { value: 'femme', title: 'Une femme', description: 'Protocole féminin' }
        ]
    },
    {
        id: 'energie',
        type: 'single_text',
        title: 'Comment te sens-tu au réveil ?',
        subtitle: 'Évalue ton niveau d\'énergie matinal',
        answers: [
            { value: 'plein_energie', title: 'Plein d\'énergie', description: 'Prêt à conquérir le monde' },
            { value: 'correct', title: 'Correct', description: 'Ça va, sans plus' },
            { value: 'fatigue', title: 'Fatigué', description: 'Besoin de café pour démarrer' },
            { value: 'epuise', title: 'Épuisé', description: 'Déjà fatigué avant de commencer' }
        ]
    },
    {
        id: 'assis',
        type: 'single_text',
        title: 'Combien d\'heures restes-tu assis par jour ?',
        subtitle: 'Bureau, voiture, canapé... tout compte',
        answers: [
            { value: '0-4', title: 'Moins de 4h', description: 'Très actif' },
            { value: '4-6', title: '4 à 6h', description: 'Plutôt actif' },
            { value: '6-8', title: '6 à 8h', description: 'Normal' },
            { value: '8-10', title: '8 à 10h', description: 'Sédentaire' },
            { value: '10+', title: 'Plus de 10h', description: 'Très sédentaire' }
        ]
    },
    {
        id: 'sommeil',
        type: 'single_text',
        title: 'Combien d\'heures dors-tu en moyenne ?',
        subtitle: 'Sommeil réel, pas le temps au lit',
        answers: [
            { value: '0-5', title: 'Moins de 5h', description: 'Privation sévère' },
            { value: '5-6', title: '5 à 6h', description: 'Insuffisant' },
            { value: '6-7', title: '6 à 7h', description: 'Limite' },
            { value: '7-8', title: '7 à 8h', description: 'Optimal' },
            { value: '8+', title: 'Plus de 8h', description: 'Récupération max' }
        ]
    },
    {
        id: 'stress',
        type: 'single_text',
        title: 'Ton niveau de stress quotidien ?',
        subtitle: 'En moyenne sur les derniers mois',
        answers: [
            { value: 'zen', title: 'Zen', description: 'Rarement stressé' },
            { value: 'gerable', title: 'Gérable', description: 'Stress ponctuel' },
            { value: 'eleve', title: 'Élevé', description: 'Souvent sous pression' },
            { value: 'chronique', title: 'Chronique', description: 'Constamment stressé' }
        ]
    },
    {
        id: 'sport',
        type: 'single_text',
        title: 'Combien de fois fais-tu du sport par semaine ?',
        subtitle: 'Minimum 30 minutes d\'activité',
        answers: [
            { value: '0', title: 'Jamais', description: 'Aucune activité' },
            { value: '1-2', title: '1 à 2 fois', description: 'Occasionnel' },
            { value: '3-4', title: '3 à 4 fois', description: 'Régulier' },
            { value: '5+', title: '5 fois ou plus', description: 'Très actif' }
        ]
    },
    {
        id: 'alimentation',
        type: 'single_text',
        title: 'Comment qualifierais-tu ton alimentation ?',
        subtitle: 'Sois honnête avec toi-même',
        answers: [
            { value: 'excellent', title: 'Excellente', description: 'Bio, équilibrée, variée' },
            { value: 'bonne', title: 'Bonne', description: 'Attention à ce que je mange' },
            { value: 'moyenne', title: 'Moyenne', description: 'Quelques écarts réguliers' },
            { value: 'mauvaise', title: 'À améliorer', description: 'Beaucoup de processed food' }
        ]
    },
    {
        id: 'motivation',
        type: 'multiple_text',
        title: 'Tes motivations pour transformer ta santé ?',
        subtitle: 'Choisis toutes les options pertinentes',
        answers: [
            { value: 'performance', title: 'Rester performant', description: 'Au top de mes capacités' },
            { value: 'enfants', title: 'Voir mes enfants/petits-enfants grandir', description: 'Être là pour eux' },
            { value: 'exemple', title: 'Être un exemple inspirant', description: 'Pour mes proches' },
            { value: 'vitalite', title: 'Retrouver ma vitalité d\'avant', description: 'Comme à 20 ans' },
            { value: 'longevite', title: 'Profiter de la vie longtemps', description: 'En bonne santé' },
            { value: 'projets', title: 'Réaliser mes rêves/projets', description: 'Avoir l\'énergie pour' }
        ]
    },
    {
        id: 'engagement',
        type: 'single_text',
        title: 'Prêt à investir 30 min/jour pour ta santé ?',
        subtitle: 'Pour appliquer ton protocole personnalisé',
        answers: [
            { value: 'oui_motive', title: 'OUI, très motivé !', description: 'Je veux changer maintenant' },
            { value: 'oui_essayer', title: 'Oui, je vais essayer', description: 'Je vais faire de mon mieux' },
            { value: 'peut_etre', title: 'Peut-être', description: 'Si c\'est simple' },
            { value: 'non', title: 'Non', description: 'Pas le temps actuellement' }
        ]
    }
];

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    initializeProgressBar();
    showCurrentStep();
});

// Créer les segments de progression
function initializeProgressBar() {
    const container = document.getElementById('progressSegments');
    if (!container) return;
    
    // 12 segments : intro + 10 questions + contact
    for (let i = 0; i < 12; i++) {
        const segment = document.createElement('div');
        segment.className = 'progress-segment';
        segment.id = `segment-${i}`;
        container.appendChild(segment);
    }
}

// Mettre à jour la barre de progression
function updateProgressBar() {
    const segments = document.querySelectorAll('.progress-segment');
    
    segments.forEach((segment, index) => {
        segment.classList.remove('completed', 'active');
        
        if (currentStep === -1) {
            // Intro - aucun segment actif
        } else if (index < currentStep) {
            segment.classList.add('completed');
        } else if (index === currentStep) {
            segment.classList.add('active');
        }
    });
    
    // Mettre à jour le texte
    const progressText = document.getElementById('progressText');
    if (progressText) {
        if (currentStep === -1) {
            progressText.textContent = 'Prêt à commencer';
        } else if (currentStep >= 0 && currentStep < 10) {
            progressText.textContent = `Étape ${currentStep + 1}/12`;
        } else if (currentStep === 10) {
            progressText.textContent = 'Dernière étape';
        } else if (currentStep === 11) {
            progressText.textContent = 'Analyse en cours...';
        } else if (currentStep === 12) {
            progressText.textContent = 'Résultats';
        }
    }
}

// Afficher l'étape actuelle
function showCurrentStep() {
    // Masquer tous les éléments
    document.querySelectorAll('.value-page, .question-container, .wow-break, .loading, .results-container').forEach(el => {
        el.classList.remove('active');
    });
    
    updateProgressBar();
    
    if (currentStep === -1) {
        // Intro
        document.getElementById('introPage').classList.add('active');
    } else if (currentStep >= 0 && currentStep < 10) {
        // Questions + Wow breaks intercalés
        showQuestion(currentStep);
        
        // Wow breaks après certaines questions
        if (currentStep === 3 && !wowBreaksShown[1]) {
            setTimeout(() => showWowBreak(1), 100);
        } else if (currentStep === 5 && !hasShownMidPage) {
            setTimeout(() => showMidPage(), 100);
        } else if (currentStep === 6 && !wowBreaksShown[2]) {
            setTimeout(() => showWowBreak(2), 100);
        } else if (currentStep === 8 && !wowBreaksShown[3]) {
            setTimeout(() => showWowBreak(3), 100);
        }
    } else if (currentStep === 10) {
        // Contact form
        document.getElementById('contactForm').classList.add('active');
    } else if (currentStep === 11) {
        // Loading
        showLoading();
    } else if (currentStep === 12) {
        // Results
        showResults();
    }
}

// Afficher une question
function showQuestion(index) {
    const question = questions[index];
    if (!question) return;
    
    let existingContainer = document.getElementById(`question-${index}`);
    
    if (!existingContainer) {
        const container = document.createElement('div');
        container.className = 'question-container';
        container.id = `question-${index}`;
        
        let answersHTML = '';
        
        if (question.type === 'single_image') {
            answersHTML = '<div class="answers-grid-images">';
            question.answers.forEach(answer => {
                const isSelected = selectedAnswers[question.id] === answer.value;
                answersHTML += `
                    <div class="answer-card ${isSelected ? 'selected' : ''}" 
                         data-value="${answer.value}" 
                         onclick="selectAnswer('${question.id}', '${answer.value}', ${index})">
                        <img src="${answer.image}" alt="${answer.title}" class="answer-image">
                        <div class="answer-content">
                            <div class="answer-title">${answer.title}</div>
                            <div class="answer-description">${answer.description}</div>
                        </div>
                    </div>
                `;
            });
            answersHTML += '</div>';
        } else if (question.type === 'single_text') {
            answersHTML = '<div class="answers-grid-text">';
            question.answers.forEach(answer => {
                const isSelected = selectedAnswers[question.id] === answer.value;
                answersHTML += `
                    <div class="answer-option-text ${isSelected ? 'selected' : ''}" 
                         data-value="${answer.value}" 
                         onclick="selectAnswer('${question.id}', '${answer.value}', ${index})">
                        <div class="checkbox"></div>
                        <div class="answer-text-content">
                            <div class="answer-text-title">${answer.title}</div>
                            <div class="answer-text-description">${answer.description}</div>
                        </div>
                    </div>
                `;
            });
            answersHTML += '</div>';
        } else if (question.type === 'multiple_text') {
            answersHTML = '<div class="multiple-choice-indicator">✓ Plusieurs choix possibles</div>';
            answersHTML += '<div class="answers-grid-text">';
            question.answers.forEach(answer => {
                const isSelected = selectedAnswers[question.id] && selectedAnswers[question.id].includes(answer.value);
                answersHTML += `
                    <div class="answer-option-text ${isSelected ? 'selected' : ''}" 
                         data-value="${answer.value}" 
                         onclick="selectMultipleAnswer('${question.id}', '${answer.value}', ${index})">
                        <div class="checkbox"></div>
                        <div class="answer-text-content">
                            <div class="answer-text-title">${answer.title}</div>
                            <div class="answer-text-description">${answer.description}</div>
                        </div>
                    </div>
                `;
            });
            answersHTML += '</div>';
        }
        
        container.innerHTML = `
            <div class="question-header">
                <div class="question-number">Question ${index + 1}/10</div>
                <h2 class="question-title">${question.title}</h2>
                <p class="question-subtitle">${question.subtitle}</p>
            </div>
            ${answersHTML}
            <div class="navigation">
                ${index > 0 ? '<button class="btn btn-secondary" onclick="previousStep()">← Retour</button>' : ''}
                ${question.type === 'multiple_text' ? 
                    '<button class="btn btn-primary" onclick="validateMultiple(\'' + question.id + '\', ' + index + ')">Valider →</button>' : 
                    ''}
            </div>
        `;
        
        document.getElementById('questionsContainer').appendChild(container);
    }
    
    document.getElementById(`question-${index}`).classList.add('active');
    
    // Restaurer les sélections pour questions multiples
    if (question.type === 'multiple_text' && selectedAnswers[question.id]) {
        const container = document.getElementById(`question-${index}`);
        selectedAnswers[question.id].forEach(value => {
            const element = container.querySelector(`[data-value="${value}"]`);
            if (element) element.classList.add('selected');
        });
    }
}

// Sélectionner une réponse simple
function selectAnswer(questionId, value, questionIndex) {
    answers[questionId] = value;
    selectedAnswers[questionId] = value;
    
    // Mettre à jour l'UI
    const container = document.getElementById(`question-${questionIndex}`);
    container.querySelectorAll('.answer-card, .answer-option-text').forEach(el => {
        el.classList.remove('selected');
    });
    container.querySelector(`[data-value="${value}"]`).classList.add('selected');
    
    // Passer à la question suivante après un délai
    setTimeout(() => {
        nextStep();
    }, 300);
}

// Sélectionner une réponse multiple
function selectMultipleAnswer(questionId, value, questionIndex) {
    if (!selectedAnswers[questionId]) {
        selectedAnswers[questionId] = [];
    }
    
    const index = selectedAnswers[questionId].indexOf(value);
    if (index > -1) {
        selectedAnswers[questionId].splice(index, 1);
    } else {
        selectedAnswers[questionId].push(value);
    }
    
    // Mettre à jour l'UI
    const element = document.querySelector(`#question-${questionIndex} [data-value="${value}"]`);
    element.classList.toggle('selected');
}

// Valider les réponses multiples
function validateMultiple(questionId, questionIndex) {
    if (!selectedAnswers[questionId] || selectedAnswers[questionId].length === 0) {
        alert('Merci de sélectionner au moins une option');
        return;
    }
    
    answers[questionId] = selectedAnswers[questionId].join(',');
    nextStep();
}

// Fonctions de navigation
function startQuiz() {
    currentStep = 0;
    showCurrentStep();
}

function nextStep() {
    if (currentStep < 10) {
        currentStep++;
        showCurrentStep();
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        showCurrentStep();
    }
}

// Wow breaks
function showWowBreak(number) {
    wowBreaksShown[number] = true;
    document.querySelectorAll('.question-container').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById(`wowBreak${number}`).classList.add('active');
}

function continueFromWow(number) {
    document.getElementById(`wowBreak${number}`).classList.remove('active');
    showCurrentStep();
}

function showMidPage() {
    hasShownMidPage = true;
    document.querySelectorAll('.question-container').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById('midPage').classList.add('active');
}

function continueMidQuiz() {
    document.getElementById('midPage').classList.remove('active');
    showCurrentStep();
}

// Soumettre le formulaire
async function submitForm() {
    const prenom = document.getElementById('prenom').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    
    if (!prenom || !email) {
        alert('Merci de remplir tous les champs obligatoires');
        return;
    }
    
    answers.prenom = prenom;
    answers.email = email;
    answers.mobile = mobile;
    
    currentStep = 11;
    showCurrentStep();
}

// Loading avec animations
function showLoading() {
    document.getElementById('loading').classList.add('active');
    
    setTimeout(() => {
        document.getElementById('step1').classList.add('completed');
    }, 1000);
    
    setTimeout(() => {
        document.getElementById('step2').classList.add('completed');
    }, 2000);
    
    setTimeout(() => {
        document.getElementById('step3').classList.add('completed');
    }, 3000);
    
    setTimeout(() => {
        calculateAndSendResults();
    }, 4000);
}

// Calcul et envoi des résultats
async function calculateAndSendResults() {
    let biologicalAge = 0;
    let realAge = 43;
    
    // Déterminer l'âge réel
    if (answers.age === '18-29') realAge = 25;
    else if (answers.age === '30-39') realAge = 35;
    else if (answers.age === '40-49') realAge = 45;
    else if (answers.age === '50+') realAge = 55;
    
    biologicalAge = realAge;
    
    // Calculs basés sur les réponses
    if (answers.assis === '8-10') biologicalAge += 1.5;
    else if (answers.assis === '10+') biologicalAge += 2;
    else if (answers.assis === '0-4') biologicalAge -= 1;
    
    if (answers.sommeil === '0-5') biologicalAge += 2;
    else if (answers.sommeil === '5-6') biologicalAge += 1.5;
    else if (answers.sommeil === '6-7') biologicalAge += 0.5;
    else if (answers.sommeil === '7-8') biologicalAge -= 0.5;
    
    if (answers.stress === 'chronique') biologicalAge += 1.5;
    else if (answers.stress === 'eleve') biologicalAge += 1;
    else if (answers.stress === 'zen') biologicalAge -= 0.5;
    
    if (answers.sport === '0') biologicalAge += 1.5;
    else if (answers.sport === '3-4') biologicalAge -= 0.5;
    else if (answers.sport === '5+') biologicalAge -= 1;
    
    if (answers.alimentation === 'mauvaise') biologicalAge += 1.5;
    else if (answers.alimentation === 'moyenne') biologicalAge += 0.5;
    else if (answers.alimentation === 'bonne') biologicalAge -= 0.5;
    else if (answers.alimentation === 'excellent') biologicalAge -= 1;
    
    biologicalAge = Math.round(biologicalAge);
    
    answers.realAge = realAge;
    answers.biologicalAge = biologicalAge;
    answers.ageDifference = biologicalAge - realAge;
    answers.timestamp = new Date().toISOString();
    
    // Envoyer à Google Sheets
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answers)
        });
    } catch (error) {
        console.error('Erreur envoi:', error);
    }
    
    // Envoyer à l'API pour calcul du score
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answers })
        });
        
        if (response.ok) {
            const result = await response.json();
            answers.score = result.score;
        }
    } catch (error) {
        console.error('Erreur API:', error);
    }
    
    currentStep = 12;
    showCurrentStep();
}

// Afficher les résultats
function showResults() {
    const realAge = answers.realAge || 43;
    const biologicalAge = answers.biologicalAge || 48;
    const ageDiff = biologicalAge - realAge;
    
    document.getElementById('realAge').textContent = realAge;
    document.getElementById('bioAge').textContent = biologicalAge + ' ans';
    
    const ageWarning = document.getElementById('ageWarning');
    const ageDiffText = document.getElementById('ageDiffText');
    
    if (ageDiff > 0) {
        document.getElementById('bioAge').style.color = '#ff6b6b';
        ageWarning.innerHTML = '⚠️ Tu vieillis trop vite';
        ageDiffText.innerHTML = `Ton corps a <strong>${ageDiff} ans</strong> d'avance sur ton âge réel`;
        updateAgingFactors(ageDiff);
    } else if (ageDiff < 0) {
        document.getElementById('bioAge').style.color = '#00ff88';
        ageWarning.innerHTML = '✨ Bravo, tu rajeunis !';
        ageDiffText.innerHTML = `Ton corps a <strong>${Math.abs(ageDiff)} ans</strong> de moins que ton âge réel`;
        updatePositiveFactors();
    } else {
        document.getElementById('bioAge').style.color = '#00ffff';
        ageWarning.innerHTML = '👍 Âge biologique normal';
        ageDiffText.innerHTML = `Ton corps correspond à ton âge réel`;
    }
    
    updateRecoveryPotential(ageDiff);
    document.getElementById('results').classList.add('active');
}

// Mettre à jour les facteurs de vieillissement
function updateAgingFactors(ageDiff) {
    const container = document.getElementById('agingFactors');
    let factors = [];
    
    if (answers.assis === '8-10' || answers.assis === '10+') {
        factors.push({
            icon: '🪑',
            name: 'Trop assis',
            desc: 'Inflammation chronique',
            impact: '-2 ans'
        });
    }
    
    if (answers.sommeil === '0-5' || answers.sommeil === '5-6') {
        factors.push({
            icon: '😴',
            name: 'Mal dormi',
            desc: 'Récupération insuffisante',
            impact: '-2 ans'
        });
    }
    
    if (answers.stress === 'chronique' || answers.stress === 'eleve') {
        factors.push({
            icon: '🔥',
            name: 'Trop stressé',
            desc: 'Oxydation cellulaire',
            impact: '-1 an'
        });
    }
    
    // Limiter à 3 facteurs
    factors = factors.slice(0, 3);
    while (factors.length < 3) {
        factors.push({
            icon: '⚠️',
            name: 'Habitudes à revoir',
            desc: 'Optimisation possible',
            impact: '-1 an'
        });
    }
    
    let html = '<h3 class="factors-title">3 COUPABLES IDENTIFIÉS</h3>';
    factors.forEach(factor => {
        html += `
            <div class="factor-item">
                <div class="factor-info">
                    <div class="factor-name">${factor.icon} ${factor.name}</div>
                    <div class="factor-description">${factor.desc}</div>
                </div>
                <div class="factor-impact">${factor.impact}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Facteurs positifs
function updatePositiveFactors() {
    const container = document.getElementById('agingFactors');
    let factors = [];
    
    if (answers.sport === '3-4' || answers.sport === '5+') {
        factors.push({
            icon: '💪',
            name: 'Très actif',
            desc: 'Excellent cardio',
            impact: '+2 ans'
        });
    }
    
    if (answers.sommeil === '7-8' || answers.sommeil === '8+') {
        factors.push({
            icon: '😴',
            name: 'Sommeil optimal',
            desc: 'Récupération maximale',
            impact: '+1.5 ans'
        });
    }
    
    if (answers.alimentation === 'excellent' || answers.alimentation === 'bonne') {
        factors.push({
            icon: '🥗',
            name: 'Alimentation saine',
            desc: 'Anti-inflammatoire',
            impact: '+1.5 ans'
        });
    }
    
    factors = factors.slice(0, 3);
    while (factors.length < 3) {
        factors.push({
            icon: '✨',
            name: 'Bonne habitude',
            desc: 'Continue comme ça',
            impact: '+1 an'
        });
    }
    
    let html = '<h3 class="factors-title">TES 3 POINTS FORTS</h3>';
    factors.forEach(factor => {
        html += `
            <div class="factor-item positive">
                <div class="factor-info">
                    <div class="factor-name">${factor.icon} ${factor.name}</div>
                    <div class="factor-description">${factor.desc}</div>
                </div>
                <div class="factor-impact positive">${factor.impact}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Potentiel de récupération
function updateRecoveryPotential(ageDiff) {
    const container = document.getElementById('recoveryPotential');
    
    if (ageDiff > 0) {
        const potential = Math.round(ageDiff + 3);
        container.innerHTML = `
            <h3 class="recovery-title">✨ MAIS TU PEUX RÉCUPÉRER</h3>
            <div class="recovery-stat">CES ${ageDiff} ANS PERDUS</div>
            <p class="recovery-description">
                + EN GAGNER ${3} DE PLUS<br><br>
                Les bonnes habitudes peuvent te faire gagner<br>
                <strong>${potential} ans de vie en pleine forme</strong>
            </p>
        `;
    } else if (ageDiff < 0) {
        const potential = Math.abs(ageDiff) + 5;
        container.innerHTML = `
            <h3 class="recovery-title">🚀 TU PEUX ALLER ENCORE PLUS LOIN</h3>
            <div class="recovery-stat">+${potential} ANS</div>
            <p class="recovery-description">
                Tu es déjà sur la bonne voie !<br><br>
                Avec quelques optimisations,<br>
                <strong>tu peux gagner ${potential} ans de vie en pleine forme</strong>
            </p>
        `;
    } else {
        container.innerHTML = `
            <h3 class="recovery-title">✨ TON POTENTIEL D'OPTIMISATION</h3>
            <div class="recovery-stat">+8 ANS</div>
            <p class="recovery-description">
                Tu es dans la moyenne, mais tu peux faire mieux !<br><br>
                Les bonnes habitudes peuvent te faire gagner<br>
                <strong>8 ans de vie en pleine forme</strong>
            </p>
        `;
    }
}

// Obtenir le protocole
function getProtocol() {
    window.open('https://oralife.club/protocole', '_blank');
    return false;
}
