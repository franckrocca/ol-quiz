// ORA LIFE Quiz - Version complète avec 42 questions
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjyAjH9Nl6y2IeRWHi5Qrr6ftqVilH4T9RMPAdNXM_XYVuaN0WFzrPPYwVL8oOZR0W/exec';

// Variables globales
let currentScreen = 0;
let answers = {};
let multiSelectAnswers = {};

// Questions complètes
const allQuestions = [
    // Landing
    { type: 'landing' },
    // Q1: Genre
    { type: 'gender' },
    // Q2: Âge
    { type: 'age' },
    // Q3: Poids/Taille
    { type: 'weight_height' },
    // Q4: Objectifs
    { type: 'goals' },
    // Q5: Réveil
    {
        question: "Comment te sens-tu au réveil ?",
        key: 'wake_feeling',
        options: [
            "En pleine forme",
            "Correct après 10min",
            "Fatigué mais ça passe",
            "Épuisé même après café"
        ]
    },
    // Wow break 1
    { type: 'wow', stat: '73%', fact: 'des entrepreneurs dorment moins de 7h par nuit', source: 'Sleep Foundation 2023' },
    // Q6: Heures de sommeil
    {
        question: "Combien d'heures dors-tu en moyenne ?",
        key: 'sleep_hours',
        options: ["Moins de 6h", "6-7h", "7-8h", "Plus de 8h"]
    },
    // Q7: Qualité sommeil
    {
        question: "Qualité de ton sommeil ?",
        key: 'sleep_quality',
        options: ["Excellent", "Bon", "Moyen", "Mauvais"]
    },
    // Q8: Réveils nocturnes
    {
        question: "Réveils nocturnes ?",
        key: 'night_wakeups',
        options: ["Jamais", "1-2 fois", "3-4 fois", "Plus de 4 fois"]
    },
    // Q9: Énergie journée
    {
        question: "Première baisse d'énergie ?",
        key: 'energy_drop',
        options: ["Pas avant 18h", "Vers 15-16h", "Après déjeuner", "Dès le matin"]
    },
    // Q10: Sport
    {
        question: "Fréquence sportive ?",
        key: 'sport_frequency',
        options: ["Tous les jours", "3-5x/semaine", "1-2x/semaine", "Rarement"]
    },
    // Q11: Type sport
    {
        question: "Type d'activité principale ?",
        key: 'sport_type',
        multi: true,
        options: ["Cardio/Running", "Musculation", "Yoga/Pilates", "Sports collectifs", "Marche", "Natation"]
    },
    // Wow break 2
    { type: 'wow', stat: '10 000', fact: 'pas par jour réduisent de 28% le risque de mortalité', source: 'JAMA 2020' },
    // Q12: Pas quotidiens
    {
        question: "Nombre de pas par jour ?",
        key: 'daily_steps',
        options: ["Plus de 10000", "7000-10000", "5000-7000", "Moins de 5000"]
    },
    // Q13: Position travail
    {
        question: "Position de travail ?",
        key: 'work_position',
        options: ["Debout/Assis alterné", "Principalement debout", "Principalement assis", "Assis toute la journée"]
    },
    // Q14: Pauses
    {
        question: "Pauses actives dans la journée ?",
        key: 'active_breaks',
        options: ["Toutes les heures", "2-3 fois/jour", "Midi seulement", "Jamais"]
    },
    // Q15: Hydratation
    {
        question: "Verres d'eau par jour (hors café/thé) ?",
        key: 'water_intake',
        options: ["Plus de 8", "6-8", "4-6", "Moins de 4"]
    },
    // Q16: Café
    {
        question: "Consommation de café ?",
        key: 'coffee_intake',
        options: ["0-1 tasse", "2-3 tasses", "4-5 tasses", "Plus de 5"]
    },
    // Q17: Alcool
    {
        question: "Consommation d'alcool ?",
        key: 'alcohol_intake',
        options: ["Jamais", "1-2 verres/semaine", "3-5 verres/semaine", "Quotidien"]
    },
    // Wow break 3
    { type: 'wow', stat: '42%', fact: 'de risque cardiovasculaire en moins avec le régime méditerranéen', source: 'NEJM 2018' },
    // Q18: Alimentation
    {
        question: "Style alimentaire principal ?",
        key: 'diet_style',
        options: ["Méditerranéen", "Paléo/Keto", "Végétarien", "Standard"]
    },
    // Q19: Légumes
    {
        question: "Portions de légumes par jour ?",
        key: 'vegetables',
        options: ["Plus de 5", "3-5", "1-2", "Rarement"]
    },
    // Q20: Fast-food
    {
        question: "Fréquence fast-food/plats préparés ?",
        key: 'junk_food',
        options: ["Jamais", "1x/mois", "1x/semaine", "Plusieurs fois/semaine"]
    },
    // Q21: Jeûne
    {
        question: "Pratiques-tu le jeûne intermittent ?",
        key: 'fasting',
        options: ["16:8 quotidien", "Occasionnellement", "J'aimerais essayer", "Non"]
    },
    // Q22: Suppléments
    {
        question: "Prends-tu des compléments ?",
        key: 'supplements',
        multi: true,
        options: ["Vitamine D", "Oméga 3", "Magnésium", "Probiotiques", "Multivitamines", "Aucun"]
    },
    // Q23: Stress niveau
    {
        question: "Niveau de stress quotidien ?",
        key: 'stress_level',
        options: ["Très faible", "Gérable", "Élevé", "Très élevé"]
    },
    // Wow break 4
    { type: 'wow', stat: '8 ans', fact: "d'espérance de vie en plus avec la méditation régulière", source: 'Psychosomatic Medicine 2017' },
    // Q24: Méditation
    {
        question: "Pratiques-tu la méditation ?",
        key: 'meditation',
        options: ["Quotidiennement", "3-4x/semaine", "Occasionnellement", "Jamais"]
    },
    // Q25: Respiration
    {
        question: "Exercices de respiration ?",
        key: 'breathing',
        options: ["Plusieurs fois/jour", "1x/jour", "Parfois", "Jamais"]
    },
    // Q26: Temps écran
    {
        question: "Heures d'écran par jour ?",
        key: 'screen_time',
        options: ["Moins de 4h", "4-6h", "6-8h", "Plus de 8h"]
    },
    // Q27: Détox digitale
    {
        question: "Détox digitale le soir ?",
        key: 'digital_detox',
        options: ["2h avant sommeil", "1h avant", "30min avant", "Jusqu'au lit"]
    },
    // Q28: Relations sociales
    {
        question: "Qualité de tes relations ?",
        key: 'relationships',
        options: ["Excellentes", "Bonnes", "Moyennes", "Isolé"]
    },
    // Q29: Temps nature
    {
        question: "Temps en nature par semaine ?",
        key: 'nature_time',
        options: ["Plus de 3h", "1-3h", "30min-1h", "Rarement"]
    },
    // Wow break 5
    { type: 'wow', stat: '23%', fact: 'de risque de dépression en moins avec 2h de nature/semaine', source: 'Environment International 2019' },
    // Q30: Exposition soleil
    {
        question: "Exposition au soleil ?",
        key: 'sun_exposure',
        options: ["30min+ par jour", "15-30min", "Peu", "Très peu"]
    },
    // Q31: Douche froide
    {
        question: "Pratiques-tu la douche froide ?",
        key: 'cold_shower',
        options: ["Quotidiennement", "3-4x/semaine", "Parfois", "Jamais"]
    },
    // Q32: Sauna
    {
        question: "Utilises-tu le sauna ?",
        key: 'sauna',
        options: ["2-3x/semaine", "1x/semaine", "Occasionnellement", "Jamais"]
    },
    // Q33: Tracking santé
    {
        question: "Utilises-tu des outils de tracking ?",
        key: 'health_tracking',
        multi: true,
        options: ["Montre connectée", "Balance smart", "App sommeil", "App nutrition", "Aucun"]
    },
    // Q34: Check-up médical
    {
        question: "Dernier check-up complet ?",
        key: 'medical_checkup',
        options: ["Moins de 6 mois", "6-12 mois", "1-2 ans", "Plus de 2 ans"]
    },
    // Q35: Analyses sang
    {
        question: "Analyses de sang complètes ?",
        key: 'blood_tests',
        options: ["Tous les 6 mois", "1x/an", "Rarement", "Jamais"]
    },
    // Wow break 6
    { type: 'wow', stat: '15 ans', fact: "d'âge biologique en moins possible avec un protocole optimisé", source: 'Cell Metabolism 2023' },
    // Q36: Objectif principal
    {
        question: "Ton objectif #1 ?",
        key: 'main_goal',
        options: ["Performance max", "Longévité", "Bien-être", "Perte de poids"]
    },
    // Q37: Budget santé
    {
        question: "Budget mensuel santé/biohacking ?",
        key: 'health_budget',
        options: ["Plus de 500€", "200-500€", "50-200€", "Moins de 50€"]
    },
    // Q38: Temps disponible
    {
        question: "Temps pour ta santé par jour ?",
        key: 'time_available',
        options: ["Plus de 2h", "1-2h", "30min-1h", "Moins de 30min"]
    },
    // Q39: Motivation
    {
        question: "Ta motivation principale ?",
        key: 'motivation',
        options: ["Être un exemple", "Performer plus", "Vivre plus longtemps", "Me sentir mieux"]
    },
    // Q40: Habitudes difficiles
    {
        question: "Quelle habitude est la plus dure ?",
        key: 'hardest_habit',
        options: ["Sport régulier", "Alimentation saine", "Sommeil suffisant", "Gestion du stress"]
    },
    // Wow break final
    { type: 'wow', stat: '7%', fact: 'seulement de notre vieillissement est génétique, 93% dépend de nos choix', source: 'Nature Genetics 2018' },
    // Q41: Email
    { type: 'email' },
    // Q42: Calcul
    { type: 'calculating' },
    // Q43: Résultats
    { type: 'results' }
];

// Fonction pour sauvegarder une réponse
function answer(key, value) {
    answers[key] = value;
    console.log('Answer saved:', key, value);
}

// Navigation
function goToNextScreen() {
    // Validation pour l'âge
    if (currentScreen === 2) {
        const age = document.getElementById('age')?.value;
        if (!age) {
            alert('Merci de renseigner ton âge');
            return;
        }
        answers.age = age;
    }
    
    // Validation pour poids/taille - calcul IMC direct
    if (currentScreen === 3) {
        const weight = parseFloat(document.getElementById('weight')?.value);
        const height = parseFloat(document.getElementById('height')?.value);
        
        if (!weight || !height) {
            alert('Merci de remplir ton poids et ta taille');
            return;
        }
        
        answers.weight = weight;
        answers.height = height;
        const heightM = height / 100;
        answers.bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;
    }
    
    currentScreen++;
    updateProgressBar();
    renderCurrentScreen();
}

function goToPrevScreen() {
    if (currentScreen > 0) {
        currentScreen--;
        updateProgressBar();
        renderCurrentScreen();
    }
}

// Mise à jour de la barre de progression
function updateProgressBar() {
    const totalScreens = 43;
    const progress = (currentScreen / totalScreens) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    
    // Mise à jour du texte de progression
    const progressText = document.getElementById('progress-text');
    if (currentScreen === 0) {
        progressText.textContent = 'Prêt à commencer';
    } else if (currentScreen <= 10) {
        progressText.textContent = 'Découverte de ton profil...';
    } else if (currentScreen <= 20) {
        progressText.textContent = 'Analyse de tes habitudes...';
    } else if (currentScreen <= 30) {
        progressText.textContent = 'Évaluation de ton énergie...';
    } else if (currentScreen <= 40) {
        progressText.textContent = 'Finalisation...';
    } else {
        progressText.textContent = 'Calcul de ton score...';
    }
}

// Toggle multi-select avec fix du double-clic
function toggleMultiSelect(key, value, element, max = 3) {
    // Empêcher la propagation pour éviter le double-clic
    event.stopPropagation();
    
    if (!multiSelectAnswers[key]) {
        multiSelectAnswers[key] = [];
    }
    
    const index = multiSelectAnswers[key].indexOf(value);
    
    if (index > -1) {
        multiSelectAnswers[key].splice(index, 1);
        element.classList.remove('selected');
    } else {
        if (multiSelectAnswers[key].length < max) {
            multiSelectAnswers[key].push(value);
            element.classList.add('selected');
        } else {
            alert(`Tu peux choisir maximum ${max} options`);
        }
    }
    
    answers[key] = multiSelectAnswers[key].join(',');
}

// Soumettre email
function submitEmail() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value || '';
    
    if (!name || !email) {
        alert('Merci de remplir tous les champs obligatoires');
        return;
    }
    
    answers.name = name;
    answers.email = email;
    answers.phone = phone;
    
    sendToGoogleSheets();
    goToNextScreen();
}

// Envoi Google Sheets
function sendToGoogleSheets() {
    const formData = new FormData();
    
    Object.keys(answers).forEach(key => {
        formData.append(key, answers[key]);
    });
    
    formData.append('timestamp', new Date().toISOString());
    
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
    }).catch(error => console.error('Erreur:', error));
}

// Calcul du score
function calculateScore() {
    setTimeout(() => {
        currentScreen = 43;
        renderCurrentScreen();
    }, 3000);
}

// Fonction pour obtenir le statut IMC
function getIMCStatus(bmi) {
    if (bmi < 18.5) return "Maigreur";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Surpoids";
    return "Obésité";
}

// Rendu de l'écran actuel
function renderCurrentScreen() {
    const container = document.getElementById('quiz-container');
    const question = allQuestions[currentScreen];
    let html = '';
    
    if (!question) {
        console.error('Question not found for screen:', currentScreen);
        return;
    }
    
    switch(question.type) {
        case 'landing':
            html = `
                <div class="card landing">
                    <div class="logo">ORA<span class="logo-accent">LIFE</span></div>
                    <h1>Découvre Ton Score de Vieillissement</h1>
                    <p class="subtitle">Test scientifique gratuit - 3 minutes</p>
                    <div class="hook">⚠️ 98% des gens vieillissent 2x plus vite sans le savoir</div>
                    <button class="btn-primary" onclick="goToNextScreen()">
                        COMMENCER LE TEST GRATUIT
                    </button>
                </div>
            `;
            break;
            
        case 'gender':
            html = `
                <div class="card">
                    <h2 class="question-text">Tu es ?</h2>
                    <div class="visual-options">
                        <div class="visual-option ${answers.gender === 'homme' ? 'selected' : ''}" 
                             onclick="answer('gender', 'homme'); goToNextScreen();">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop" alt="Homme">
                            <div class="label">Homme</div>
                        </div>
                        <div class="visual-option ${answers.gender === 'femme' ? 'selected' : ''}" 
                             onclick="answer('gender', 'femme'); goToNextScreen();">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop" alt="Femme">
                            <div class="label">Femme</div>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'age':
            html = `
                <div class="card">
                    <h2 class="question-text">Ton âge exact ?</h2>
                    <input type="number" id="age" placeholder="42" min="18" max="100" 
                           value="${answers.age || ''}"
                           onkeypress="if(event.key === 'Enter') goToNextScreen()">
                    <button class="btn-primary" onclick="goToNextScreen()">
                        CONTINUER →
                    </button>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 'weight_height':
            const bmi = answers.bmi;
            const showIMC = bmi !== undefined;
            
            html = `
                <div class="card">
                    <h2 class="question-text">Ton poids et ta taille ?</h2>
                    <div class="dual-inputs">
                        <div class="input-group">
                            <label>Poids (kg)</label>
                            <input type="number" id="weight" placeholder="75" min="40" max="200" 
                                   value="${answers.weight || ''}"
                                   onkeypress="if(event.key === 'Tab' && document.getElementById('height').value) goToNextScreen()">
                        </div>
                        <div class="input-group">
                            <label>Taille (cm)</label>
                            <input type="number" id="height" placeholder="175" min="140" max="220"
                                   value="${answers.height || ''}"
                                   onkeypress="if(event.key === 'Enter') goToNextScreen()">
                        </div>
                    </div>
                    ${showIMC ? `
                        <div class="imc-container">
                            <div class="imc-value">${bmi}</div>
                            <div class="imc-label">IMC - ${getIMCStatus(bmi)}</div>
                            <div class="imc-gauge">
                                <div class="imc-pointer" style="left: ${((bmi - 16) * 100 / 24)}%"></div>
                            </div>
                            <div class="imc-ranges">
                                <span>Maigreur</span>
                                <span>Normal</span>
                                <span>Surpoids</span>
                                <span>Obésité</span>
                            </div>
                        </div>
                    ` : ''}
                    <button class="btn-primary" onclick="goToNextScreen()">CONTINUER →</button>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 'goals':
            const savedGoals = answers.goals ? answers.goals.split(',') : [];
            html = `
                <div class="card">
                    <h2 class="question-text">Tes objectifs principaux ?</h2>
                    <p class="multi-select-info">Choisis jusqu'à 3 options</p>
                    <div class="options-vertical">
                        ${['Énergie illimitée', 'Sommeil réparateur', 'Mental sharp', 'Perte de poids', 
                          'Longévité', 'Performance sportive', 'Équilibre hormonal'].map(option => `
                            <div class="option-checkbox ${savedGoals.includes(option.toLowerCase().replace(/\s+/g, '_')) ? 'selected' : ''}" 
                                 onclick="toggleMultiSelect('goals', '${option.toLowerCase().replace(/\s+/g, '_')}', this)">
                                <span class="checkbox-icon">✓</span>
                                <span>${option}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn-primary" onclick="goToNextScreen()">CONTINUER →</button>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 'wow':
            html = `
                <div class="card wow-break">
                    <div class="wow-title">💡 DÉCOUVERTE SCIENTIFIQUE</div>
                    <div class="wow-stat">${question.stat}</div>
                    <p class="wow-description">${question.fact}</p>
                    <div class="wow-source">📊 ${question.source}</div>
                    <button class="btn-primary" onclick="goToNextScreen()">CONTINUER →</button>
                </div>
            `;
            break;
            
        case 'email':
            html = `
                <div class="card">
                    <h2 class="question-text">Dernière étape !</h2>
                    <p style="color: var(--text-light); margin-bottom: 30px;">
                        Reçois ton diagnostic personnalisé par email
                    </p>
                    <input type="text" id="name" placeholder="Ton prénom" value="${answers.name || ''}">
                    <input type="email" id="email" placeholder="ton@email.com" value="${answers.email || ''}">
                    <input type="tel" id="phone" placeholder="06 12 34 56 78 (optionnel)" value="${answers.phone || ''}">
                    
                    <button class="btn-primary btn-green" onclick="submitEmail()">
                        VOIR MON SCORE →
                    </button>
                    
                    <p style="text-align: center; font-size: 12px; color: var(--text-light); margin-top: 20px;">
                        🔒 Données 100% sécurisées • Serveurs en France
                    </p>
                    
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 'calculating':
            html = `
                <div class="card calculating">
                    <div class="spinner"></div>
                    <h2>Analyse en cours...</h2>
                    <p>Calcul de ton âge biologique basé sur 1200+ études</p>
                </div>
            `;
            calculateScore();
            break;
            
        case 'results':
            const biologicalAge = answers.age ? Math.round(parseInt(answers.age) * 1.15) : 48;
            html = `
                <div class="card results">
                    <h2>Ton Âge Biologique</h2>
                    <div class="score-display">${biologicalAge} ans</div>
                    <p class="score-label">vs ${answers.age || 42} ans (âge réel)</p>
                    
                    <div class="comparison">
                        <p>Tu vieillis <strong>15% plus vite</strong> que la normale</p>
                    </div>
                    
                    <div class="result-details">
                        <h3>Top 3 priorités identifiées :</h3>
                        <div class="priority-item">
                            <div class="priority-title">🔥 Inflammation chronique</div>
                            <div class="priority-impact">Impact: +3.2 ans</div>
                            <div class="priority-solution">Solution: Protocole anti-inflammatoire personnalisé</div>
                        </div>
                        <div class="priority-item">
                            <div class="priority-title">😴 Déficit de récupération</div>
                            <div class="priority-impact">Impact: +2.8 ans</div>
                            <div class="priority-solution">Solution: Optimisation du sommeil profond</div>
                        </div>
                        <div class="priority-item">
                            <div class="priority-title">⚡ Stress oxydatif</div>
                            <div class="priority-impact">Impact: +2.1 ans</div>
                            <div class="priority-solution">Solution: Stack antioxydant ciblé</div>
                        </div>
                    </div>
                    
                    <div class="cta-section">
                        <h3 class="cta-title">Obtiens Ton Protocole Personnalisé</h3>
                        <p>Basé sur tes réponses et validé par 1200+ études</p>
                        <a href="https://calendly.com/oralife/diagnostic" class="cta-button">
                            RÉSERVER MON APPEL GRATUIT
                        </a>
                    </div>
                </div>
            `;
            break;
            
        default:
            // Questions standard
            if (question.multi) {
                const savedValues = answers[question.key] ? answers[question.key].split(',') : [];
                html = `
                    <div class="card">
                        <h2 class="question-text">${question.question}</h2>
                        <p class="multi-select-info">Choisis jusqu'à 3 options</p>
                        <div class="options-vertical">
                            ${question.options.map(option => `
                                <div class="option-checkbox ${savedValues.includes(option.toLowerCase().replace(/\s+/g, '_')) ? 'selected' : ''}" 
                                     onclick="toggleMultiSelect('${question.key}', '${option.toLowerCase().replace(/\s+/g, '_')}', this)">
                                    <span class="checkbox-icon">✓</span>
                                    <span>${option}</span>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn-primary" onclick="goToNextScreen()">CONTINUER →</button>
                        <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                    </div>
                `;
            } else {
                html = `
                    <div class="card">
                        <h2 class="question-text">${question.question}</h2>
                        <div class="options">
                            ${question.options.map(option => `
                                <div class="option ${answers[question.key] === option ? 'selected' : ''}" 
                                     onclick="answer('${question.key}', '${option}'); goToNextScreen();">
                                    ${option}
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                    </div>
                `;
            }
    }
    
    container.innerHTML = html;
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    renderCurrentScreen();
    updateProgressBar();
});
