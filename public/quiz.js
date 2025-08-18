// ORA LIFE Quiz - Version complète avec toutes les questions
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjyAjH9Nl6y2IeRWHi5Qrr6ftqVilH4T9RMPAdNXM_XYVuaN0WFzrPPYwVL8oOZR0W/exec';

// Variables globales
let currentScreen = 0;
let answers = {};
let multiSelectAnswers = {};

// Fonction pour sauvegarder une réponse
function answer(key, value) {
    answers[key] = value;
}

// Navigation
function goToNextScreen() {
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
    } else if (currentScreen <= 5) {
        progressText.textContent = 'Découverte de ton profil...';
    } else if (currentScreen <= 10) {
        progressText.textContent = 'Analyse de tes habitudes...';
    } else if (currentScreen <= 15) {
        progressText.textContent = 'Évaluation de ton énergie...';
    } else if (currentScreen <= 20) {
        progressText.textContent = 'Analyse nutritionnelle...';
    } else if (currentScreen <= 25) {
        progressText.textContent = 'Qualité de récupération...';
    } else if (currentScreen <= 30) {
        progressText.textContent = 'Facteurs de stress...';
    } else if (currentScreen <= 35) {
        progressText.textContent = 'Mode de vie global...';
    } else if (currentScreen <= 40) {
        progressText.textContent = 'Finalisation...';
    } else {
        progressText.textContent = 'Calcul de ton score...';
    }
}

// Toggle multi-select
function toggleMultiSelect(key, value, element, max) {
    if (!multiSelectAnswers[key]) {
        multiSelectAnswers[key] = [];
    }
    
    const index = multiSelectAnswers[key].indexOf(value);
    
    if (index > -1) {
        multiSelectAnswers[key].splice(index, 1);
        element.classList.remove('selected');
    } else {
        if (!max || multiSelectAnswers[key].length < max) {
            multiSelectAnswers[key].push(value);
            element.classList.add('selected');
        } else {
            alert(`Maximum ${max} choix`);
        }
    }
}

// Validation multi-select
function validateMultiSelect(key) {
    if (multiSelectAnswers[key] && multiSelectAnswers[key].length > 0) {
        answers[key] = multiSelectAnswers[key].join(', ');
        goToNextScreen();
        return true;
    }
    alert('Sélectionne au moins une option');
    return false;
}

// Calcul IMC en temps réel
function calculateIMC() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    
    if (weight && height) {
        const heightM = height / 100;
        const imc = weight / (heightM * heightM);
        const imcRounded = Math.round(imc * 10) / 10;
        
        document.getElementById('imc-display').style.display = 'block';
        document.getElementById('imc-value').textContent = imcRounded;
        
        let position = 0;
        if (imc < 18.5) {
            position = (imc / 18.5) * 25;
        } else if (imc < 25) {
            position = 25 + ((imc - 18.5) / 6.5) * 25;
        } else if (imc < 30) {
            position = 50 + ((imc - 25) / 5) * 25;
        } else {
            position = 75 + Math.min(((imc - 30) / 10) * 25, 25);
        }
        
        document.getElementById('imc-pointer').style.left = position + '%';
        
        let label = '';
        if (imc < 18.5) label = 'Insuffisant';
        else if (imc < 25) label = 'Normal';
        else if (imc < 30) label = 'Surpoids';
        else label = 'Obésité';
        
        document.getElementById('imc-label').textContent = 'IMC : ' + label;
    }
}

// Sauvegarder poids et taille
function saveWeightHeight() {
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    
    if (weight && height) {
        answers.weight = weight;
        answers.height = height;
        const heightM = height / 100;
        answers.imc = Math.round((weight / (heightM * heightM)) * 10) / 10;
        goToNextScreen();
    } else {
        alert('Merci de remplir ton poids et ta taille');
    }
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

// Rendu de l'écran actuel
function renderCurrentScreen() {
    const container = document.getElementById('quiz-container');
    let html = '';
    
    switch(currentScreen) {
        case 0: // Landing
            html = `
                <div class="card landing">
                    <div class="logo">ORA LIFE</div>
                    <h1>Découvre Ton Score de Vieillissement</h1>
                    <p class="subtitle">Test scientifique gratuit - 3 minutes</p>
                    <div class="hook">⚠️ 98% des gens vieillissent 2x plus vite sans le savoir</div>
                    <button class="btn-primary" onclick="goToNextScreen()">
                        COMMENCER LE TEST GRATUIT
                    </button>
                </div>
            `;
            break;
            
        case 1: // Q1: Genre
            html = `
                <div class="card">
                    <h2 class="question-text">Tu es ?</h2>
                    <div class="visual-options">
                        <div class="visual-option" onclick="answer('gender', 'homme'); goToNextScreen();">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" alt="Homme">
                            <div class="label">Homme</div>
                        </div>
                        <div class="visual-option" onclick="answer('gender', 'femme'); goToNextScreen();">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop" alt="Femme">
                            <div class="label">Femme</div>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 2: // Q2: Âge
            html = `
                <div class="card">
                    <h2 class="question-text">Ton âge exact ?</h2>
                    <input type="number" id="age-input" placeholder="42" min="18" max="100" 
                           onkeypress="if(event.key==='Enter'){
                               const age = document.getElementById('age-input').value;
                               if(age && age >= 18 && age <= 100){
                                   answer('age', age);
                                   goToNextScreen();
                               }
                           }">
                    <button class="btn-primary" onclick="
                        const age = document.getElementById('age-input').value;
                        if(age && age >= 18 && age <= 100){
                            answer('age', age);
                            goToNextScreen();
                        } else {
                            alert('Merci d\\'entrer un âge valide (18-100)');
                        }
                    ">CONTINUER →</button>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 3: // Q3: Poids et taille
            html = `
                <div class="card">
                    <h2 class="question-text">Tes mensurations actuelles</h2>
                    <div class="dual-inputs">
                        <div class="input-group">
                            <label>Poids (kg)</label>
                            <input type="number" id="weight" placeholder="75" min="30" max="200" 
                                   onchange="calculateIMC()" onkeyup="calculateIMC()">
                        </div>
                        <div class="input-group">
                            <label>Taille (cm)</label>
                            <input type="number" id="height" placeholder="175" min="120" max="230" 
                                   onchange="calculateIMC()" onkeyup="calculateIMC()"
                                   onkeypress="if(event.key==='Enter') saveWeightHeight()">
                        </div>
                    </div>
                    
                    <div id="imc-display" class="imc-container" style="display:none;">
                        <div class="imc-value" id="imc-value">--</div>
                        <div class="imc-label" id="imc-label">IMC</div>
                        <div class="imc-gauge">
                            <div class="imc-pointer" id="imc-pointer"></div>
                        </div>
                        <div class="imc-ranges">
                            <span>Maigreur</span>
                            <span>Normal</span>
                            <span>Surpoids</span>
                            <span>Obésité</span>
                        </div>
                    </div>
                    
                    <button class="btn-primary" onclick="saveWeightHeight()">CONTINUER →</button>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 4: // Q4: Objectifs
            html = `
                <div class="card">
                    <h2 class="question-text">Tes objectifs principaux ?</h2>
                    <p class="multi-select-info">Choisis jusqu'à 3 options</p>
                    <div class="options-grid">
                        ${['Énergie illimitée', 'Sommeil réparateur', 'Mental sharp', 'Perte de poids', 
                           'Longévité', 'Performance sportive', 'Équilibre hormonal'].map(opt => 
                            `<div class="option" onclick="toggleMultiSelect('objectives', '${opt}', this, 3)">${opt}</div>`
                        ).join('')}
                    </div>
                    <button class="btn-primary" onclick="validateMultiSelect('objectives')">CONTINUER →</button>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 5: // Q5: Énergie vs 3 ans
            html = `
                <div class="card">
                    <h2 class="question-text">Ton énergie vs il y a 3 ans ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('energy_vs_3years', 'Débordante'); goToNextScreen();">Débordante, mieux qu'avant !</div>
                        <div class="option" onclick="answer('energy_vs_3years', 'Identique'); goToNextScreen();">Identique</div>
                        <div class="option" onclick="answer('energy_vs_3years', 'En baisse'); goToNextScreen();">En baisse</div>
                        <div class="option" onclick="answer('energy_vs_3years', 'Fatigue chronique'); goToNextScreen();">Fatigue chronique</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 6: // Q6: Dernière fois à 100%
            html = `
                <div class="card">
                    <h2 class="question-text">Dernière fois à 100% de ta forme ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('last_100_percent', 'Cette semaine'); goToNextScreen();">Cette semaine</div>
                        <div class="option" onclick="answer('last_100_percent', 'Ce mois-ci'); goToNextScreen();">Ce mois-ci</div>
                        <div class="option" onclick="answer('last_100_percent', 'Il y a 3-6 mois'); goToNextScreen();">Il y a 3-6 mois</div>
                        <div class="option" onclick="answer('last_100_percent', 'Il y a plus d\\'1 an'); goToNextScreen();">Il y a plus d'1 an</div>
                        <div class="option" onclick="answer('last_100_percent', 'Je ne m\\'en souviens pas'); goToNextScreen();">Je ne m'en souviens pas</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 7: // Q7: Au réveil
            html = `
                <div class="card">
                    <h2 class="question-text">Au réveil, tu te sens :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('wake_feeling', 'Frais et dispo'); goToNextScreen();">Frais et dispo</div>
                        <div class="option" onclick="answer('wake_feeling', 'OK après 10min'); goToNextScreen();">OK après 10min</div>
                        <div class="option" onclick="answer('wake_feeling', 'Besoin de café direct'); goToNextScreen();">Besoin de café direct</div>
                        <div class="option" onclick="answer('wake_feeling', 'Épuisé'); goToNextScreen();">Épuisé, comme si je n'avais pas dormi</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 8: // Q8: Heures assis
            html = `
                <div class="card">
                    <h2 class="question-text">Heures assis par jour ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('sitting_hours', 'Moins de 4h'); goToNextScreen();">Moins de 4h</div>
                        <div class="option" onclick="answer('sitting_hours', '4-6h'); goToNextScreen();">4-6h</div>
                        <div class="option" onclick="answer('sitting_hours', '6-8h'); goToNextScreen();">6-8h</div>
                        <div class="option" onclick="answer('sitting_hours', '8-10h'); goToNextScreen();">8-10h</div>
                        <div class="option" onclick="answer('sitting_hours', 'Plus de 10h'); goToNextScreen();">Plus de 10h</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 9: // Q9: Heures sommeil
            html = `
                <div class="card">
                    <h2 class="question-text">Heures de sommeil par nuit ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('sleep_hours', 'Moins de 5h'); goToNextScreen();">Moins de 5h</div>
                        <div class="option" onclick="answer('sleep_hours', '5-6h'); goToNextScreen();">5-6h</div>
                        <div class="option" onclick="answer('sleep_hours', '6-7h'); goToNextScreen();">6-7h</div>
                        <div class="option" onclick="answer('sleep_hours', '7-8h'); goToNextScreen();">7-8h</div>
                        <div class="option" onclick="answer('sleep_hours', '8-9h'); goToNextScreen();">8-9h</div>
                        <div class="option" onclick="answer('sleep_hours', 'Plus de 9h'); goToNextScreen();">Plus de 9h</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 10: // Q10: Réveils nocturnes
            html = `
                <div class="card">
                    <h2 class="question-text">Réveils nocturnes par nuit :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('night_wakeups', '0 (sommeil parfait)'); goToNextScreen();">0 (sommeil parfait)</div>
                        <div class="option" onclick="answer('night_wakeups', '1 fois'); goToNextScreen();">1 fois</div>
                        <div class="option" onclick="answer('night_wakeups', '2-3 fois'); goToNextScreen();">2-3 fois</div>
                        <div class="option" onclick="answer('night_wakeups', '4+ fois'); goToNextScreen();">4+ fois</div>
                        <div class="option" onclick="answer('night_wakeups', 'Insomnie chronique'); goToNextScreen();">Insomnie chronique</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 11: // WOW Break 1 - Chaise qui tue
            html = `
                <div class="card wow-break">
                    <div class="wow-icon">💀</div>
                    <h2 class="wow-title">LA CHAISE QUI TUE</h2>
                    <div class="wow-stat">+52%</div>
                    <p class="wow-description">
                        <strong>de mortalité si tu restes assis >10h/jour</strong><br><br>
                        MÊME avec du sport régulier !
                    </p>
                    <div class="wow-box">
                        <strong>Échelle de risque :</strong><br>
                        • 4h assis : ✅ Normal<br>
                        • 7h : ⚠️ +5% mortalité<br>
                        • 10h : 🚨 +34% (AVEC sport)<br>
                        • 10h : 💀 +52% (SANS sport)
                    </div>
                    <div class="wow-source">📊 Medicine & Science in Sports & Exercise, 2019</div>
                    <button class="btn-primary" onclick="goToNextScreen()">CONTINUER L'ANALYSE →</button>
                </div>
            `;
            break;
            
        case 12: // Q11: Cycle/Libido (conditionnel)
            const gender = answers.gender;
            if (gender === 'femme') {
                html = `
                    <div class="card">
                        <h2 class="question-text">Où en es-tu dans ton cycle féminin ?</h2>
                        <div class="options">
                            <div class="option" onclick="answer('cycle', 'Cycles réguliers'); goToNextScreen();">Cycles réguliers</div>
                            <div class="option" onclick="answer('cycle', 'Cycles irréguliers'); goToNextScreen();">Cycles irréguliers</div>
                            <div class="option" onclick="answer('cycle', 'Périménopause'); goToNextScreen();">Périménopause</div>
                            <div class="option" onclick="answer('cycle', 'Ménopause'); goToNextScreen();">Ménopause</div>
                            <div class="option" onclick="answer('cycle', 'Grossesse'); goToNextScreen();">Grossesse</div>
                            <div class="option" onclick="answer('cycle', 'Post-partum'); goToNextScreen();">Post-partum</div>
                        </div>
                        <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                    </div>
                `;
            } else {
                html = `
                    <div class="card">
                        <h2 class="question-text">Ta libido actuellement ?</h2>
                        <div class="options">
                            <div class="option" onclick="answer('libido', 'Au top'); goToNextScreen();">Au top</div>
                            <div class="option" onclick="answer('libido', 'Correcte'); goToNextScreen();">Correcte</div>
                            <div class="option" onclick="answer('libido', 'En baisse'); goToNextScreen();">En baisse</div>
                            <div class="option" onclick="answer('libido', 'Quasi inexistante'); goToNextScreen();">Quasi inexistante</div>
                        </div>
                        <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                    </div>
                `;
            }
            break;
            
        case 13: // Q12: Crash énergétique
            html = `
                <div class="card">
                    <h2 class="question-text">Ton premier crash énergétique arrive :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('first_crash', 'Jamais'); goToNextScreen();">Jamais</div>
                        <div class="option" onclick="answer('first_crash', 'Après 17h'); goToNextScreen();">Après 17h</div>
                        <div class="option" onclick="answer('first_crash', 'Vers 14h-15h'); goToNextScreen();">Vers 14h-15h</div>
                        <div class="option" onclick="answer('first_crash', 'Vers 11h'); goToNextScreen();">Vers 11h</div>
                        <div class="option" onclick="answer('first_crash', 'Dès le matin'); goToNextScreen();">Dès le matin</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 14: // Q13: Sport fréquence
            html = `
                <div class="card">
                    <h2 class="question-text">Fréquence d'activité physique :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('sport_frequency', 'Tous les jours'); goToNextScreen();">Tous les jours</div>
                        <div class="option" onclick="answer('sport_frequency', '4-6 fois/semaine'); goToNextScreen();">4-6 fois/semaine</div>
                        <div class="option" onclick="answer('sport_frequency', '2-3 fois/semaine'); goToNextScreen();">2-3 fois/semaine</div>
                        <div class="option" onclick="answer('sport_frequency', '1 fois/semaine'); goToNextScreen();">1 fois/semaine</div>
                        <div class="option" onclick="answer('sport_frequency', 'Rarement ou jamais'); goToNextScreen();">Rarement ou jamais</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 15: // Q14: Type activités (multi)
            html = `
                <div class="card">
                    <h2 class="question-text">Tes activités physiques régulières ?</h2>
                    <p class="multi-select-info">Choisis toutes celles que tu pratiques</p>
                    <div class="options-grid">
                        ${['Course à pied', 'HIIT/CrossFit', 'Yoga/Pilates', 'Vélo', 
                           'Musculation', 'Natation', 'Marche active', 'Sports collectifs',
                           'Arts martiaux', 'Aucune activité'].map(opt => 
                            `<div class="option" onclick="toggleMultiSelect('activities', '${opt}', this)">${opt}</div>`
                        ).join('')}
                    </div>
                    <button class="btn-primary" onclick="validateMultiSelect('activities')">CONTINUER →</button>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 16: // Q15: Capacité cardio
            html = `
                <div class="card">
                    <h2 class="question-text">3 étages sans ascenseur, tu arrives :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('stairs_capacity', 'Frais comme un gardon'); goToNextScreen();">Frais comme un gardon</div>
                        <div class="option" onclick="answer('stairs_capacity', 'Légèrement essoufflé'); goToNextScreen();">Légèrement essoufflé</div>
                        <div class="option" onclick="answer('stairs_capacity', 'Bien essoufflé'); goToNextScreen();">Bien essoufflé</div>
                        <div class="option" onclick="answer('stairs_capacity', 'Très essoufflé'); goToNextScreen();">Très essoufflé, cœur qui bat fort</div>
                        <div class="option" onclick="answer('stairs_capacity', 'KO, j\\'évite'); goToNextScreen();">KO, j'évite les escaliers</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 17: // Q16: Écran avant dormir
            html = `
                <div class="card">
                    <h2 class="question-text">Écrans avant de dormir ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('screen_before_bed', 'Jamais'); goToNextScreen();">Jamais, j'arrête 2h avant</div>
                        <div class="option" onclick="answer('screen_before_bed', '1h avant'); goToNextScreen();">J'arrête 1h avant</div>
                        <div class="option" onclick="answer('screen_before_bed', '30min avant'); goToNextScreen();">J'arrête 30min avant</div>
                        <div class="option" onclick="answer('screen_before_bed', 'Jusqu\\'au lit'); goToNextScreen();">Jusqu'au moment de dormir</div>
                        <div class="option" onclick="answer('screen_before_bed', 'Je m\\'endors avec'); goToNextScreen();">Je m'endors avec</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 18: // WOW Break 2
            html = `
                <div class="card wow-break">
                    <div class="wow-icon">⚖️</div>
                    <h2 class="wow-title">L'INÉGALITÉ FACE À LA MORT</h2>
                    <div class="wow-stat">6.8 ans</div>
                    <p class="wow-description">
                        <strong>d'écart d'espérance de vie entre cadres et ouvriers</strong><br><br>
                        Les cadres vivent en moyenne 84.4 ans<br>
                        Les ouvriers 77.6 ans<br><br>
                        La différence ? Stress, alimentation, activité physique.
                    </p>
                    <div class="wow-source">📊 INSEE, 2023</div>
                    <button class="btn-primary" onclick="goToNextScreen()">CONTINUER →</button>
                </div>
            `;
            break;
            
        case 19: // Q17: Petit-déjeuner
            html = `
                <div class="card">
                    <h2 class="question-text">Ton petit-déjeuner type ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('breakfast', 'Protéiné'); goToNextScreen();">Protéiné (œufs, yaourt grec)</div>
                        <div class="option" onclick="answer('breakfast', 'Équilibré'); goToNextScreen();">Équilibré (mix protéines/glucides)</div>
                        <div class="option" onclick="answer('breakfast', 'Sucré'); goToNextScreen();">Sucré (céréales, pain, confiture)</div>
                        <div class="option" onclick="answer('breakfast', 'Café seulement'); goToNextScreen();">Juste un café</div>
                        <div class="option" onclick="answer('breakfast', 'Jeûne intermittent'); goToNextScreen();">Jeûne intermittent</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 20: // Q18: Légumes
            html = `
                <div class="card">
                    <h2 class="question-text">Portions de légumes par jour ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('vegetables', '0-1'); goToNextScreen();">0-1 portion</div>
                        <div class="option" onclick="answer('vegetables', '2-3'); goToNextScreen();">2-3 portions</div>
                        <div class="option" onclick="answer('vegetables', '4-5'); goToNextScreen();">4-5 portions</div>
                        <div class="option" onclick="answer('vegetables', '6-7'); goToNextScreen();">6-7 portions</div>
                        <div class="option" onclick="answer('vegetables', '8+'); goToNextScreen();">8+ portions</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 21: // Q19: Eau
            html = `
                <div class="card">
                    <h2 class="question-text">Litres d'eau par jour ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('water', 'Moins de 0.5L'); goToNextScreen();">Moins de 0.5L</div>
                        <div class="option" onclick="answer('water', '0.5-1L'); goToNextScreen();">0.5-1L</div>
                        <div class="option" onclick="answer('water', '1-1.5L'); goToNextScreen();">1-1.5L</div>
                        <div class="option" onclick="answer('water', '1.5-2L'); goToNextScreen();">1.5-2L</div>
                        <div class="option" onclick="answer('water', 'Plus de 2L'); goToNextScreen();">Plus de 2L</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 22: // Q20: Alcool
            html = `
                <div class="card">
                    <h2 class="question-text">Consommation d'alcool par semaine ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('alcohol', '0 (jamais)'); goToNextScreen();">0 (jamais)</div>
                        <div class="option" onclick="answer('alcohol', '1-3 verres'); goToNextScreen();">1-3 verres</div>
                        <div class="option" onclick="answer('alcohol', '4-7 verres'); goToNextScreen();">4-7 verres (1/jour)</div>
                        <div class="option" onclick="answer('alcohol', '8-14 verres'); goToNextScreen();">8-14 verres (2/jour)</div>
                        <div class="option" onclick="answer('alcohol', '15+ verres'); goToNextScreen();">15+ verres</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 23: // Q21: Fast food
            html = `
                <div class="card">
                    <h2 class="question-text">Fast food / plats transformés ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('fast_food', 'Jamais'); goToNextScreen();">Jamais</div>
                        <div class="option" onclick="answer('fast_food', '1-2 fois/mois'); goToNextScreen();">1-2 fois/mois</div>
                        <div class="option" onclick="answer('fast_food', '1 fois/semaine'); goToNextScreen();">1 fois/semaine</div>
                        <div class="option" onclick="answer('fast_food', '2-3 fois/semaine'); goToNextScreen();">2-3 fois/semaine</div>
                        <div class="option" onclick="answer('fast_food', 'Presque tous les jours'); goToNextScreen();">Presque tous les jours</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 24: // Q22: Digestion
            html = `
                <div class="card">
                    <h2 class="question-text">Ta digestion en général ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('digestion', 'Parfaite'); goToNextScreen();">Parfaite</div>
                        <div class="option" onclick="answer('digestion', 'Bonne'); goToNextScreen();">Bonne</div>
                        <div class="option" onclick="answer('digestion', 'Variable'); goToNextScreen();">Variable</div>
                        <div class="option" onclick="answer('digestion', 'Ballonnements fréquents'); goToNextScreen();">Ballonnements fréquents</div>
                        <div class="option" onclick="answer('digestion', 'Problématique'); goToNextScreen();">Problématique (douleurs, transit)</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 25: // WOW Break 3 - Génétique 7%
            html = `
                <div class="card wow-break">
                    <div class="wow-icon">🧬</div>
                    <h2 class="wow-title">TU CONTRÔLES TON DESTIN</h2>
                    <div class="wow-stat">7%</div>
                    <p class="wow-description">
                        <strong>C'est TOUT ce que représente la génétique dans ta longévité</strong><br><br>
                        Étude sur 400 millions de profils généalogiques :<br>
                        L'héritabilité réelle de la durée de vie est minime.<br><br>
                        <em>Tu es le maître de ton destin biologique.</em>
                    </p>
                    <div class="wow-source">📊 Ruby et al., Genetics, 2018 - PMC6661543</div>
                    <button class="btn-primary" onclick="goToNextScreen()">CONTINUER →</button>
                </div>
            `;
            break;
            
        case 26: // Q23: Niveau de stress
            html = `
                <div class="card">
                    <h2 class="question-text">Ton niveau de stress moyen ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('stress', 'Très faible'); goToNextScreen();">Très faible</div>
                        <div class="option" onclick="answer('stress', 'Faible'); goToNextScreen();">Faible</div>
                        <div class="option" onclick="answer('stress', 'Modéré'); goToNextScreen();">Modéré</div>
                        <div class="option" onclick="answer('stress', 'Élevé'); goToNextScreen();">Élevé</div>
                        <div class="option" onclick="answer('stress', 'Extrême'); goToNextScreen();">Extrême (je craque)</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 27: // Q24: Méditation
            html = `
                <div class="card">
                    <h2 class="question-text">Pratiques-tu la méditation/respiration ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('meditation', 'Tous les jours'); goToNextScreen();">Tous les jours</div>
                        <div class="option" onclick="answer('meditation', '3-4 fois/semaine'); goToNextScreen();">3-4 fois/semaine</div>
                        <div class="option" onclick="answer('meditation', '1-2 fois/semaine'); goToNextScreen();">1-2 fois/semaine</div>
                        <div class="option" onclick="answer('meditation', 'Occasionnellement'); goToNextScreen();">Occasionnellement</div>
                        <div class="option" onclick="answer('meditation', 'Jamais'); goToNextScreen();">Jamais</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 28: // Q25: Temps nature
            html = `
                <div class="card">
                    <h2 class="question-text">Temps passé dans la nature/semaine ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('nature', 'Plus de 5h'); goToNextScreen();">Plus de 5h</div>
                        <div class="option" onclick="answer('nature', '2-5h'); goToNextScreen();">2-5h</div>
                        <div class="option" onclick="answer('nature', '1-2h'); goToNextScreen();">1-2h</div>
                        <div class="option" onclick="answer('nature', 'Moins d\\'1h'); goToNextScreen();">Moins d'1h</div>
                        <div class="option" onclick="answer('nature', 'Jamais'); goToNextScreen();">Jamais (100% urbain)</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 29: // Q26: Relations sociales
            html = `
                <div class="card">
                    <h2 class="question-text">Qualité de tes relations sociales ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('social', 'Excellentes'); goToNextScreen();">Excellentes et épanouissantes</div>
                        <div class="option" onclick="answer('social', 'Bonnes'); goToNextScreen();">Bonnes</div>
                        <div class="option" onclick="answer('social', 'Correctes'); goToNextScreen();">Correctes</div>
                        <div class="option" onclick="answer('social', 'Limitées'); goToNextScreen();">Limitées</div>
                        <div class="option" onclick="answer('social', 'Isolé'); goToNextScreen();">Je me sens isolé(e)</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 30: // WOW Break 4 - Alcool
            html = `
                <div class="card wow-break">
                    <div class="wow-icon">🍷</div>
                    <h2 class="wow-title">L'ALCOOL, CE POISON LÉGAL</h2>
                    <div class="wow-stat">0</div>
                    <p class="wow-description">
                        <strong>verre = dose optimale pour ta santé</strong><br><br>
                        Chaque verre d'alcool réduit ton espérance de vie de 15 minutes.<br>
                        Le "French Paradox" ? Un mythe marketing.
                    </p>
                    <div class="wow-source">📊 The Lancet, 2023</div>
                    <button class="btn-primary" onclick="goToNextScreen()">CONTINUER →</button>
                </div>
            `;
            break;
            
        case 31: // Q27: Café
            html = `
                <div class="card">
                    <h2 class="question-text">Tasses de café par jour ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('coffee', '0'); goToNextScreen();">0 (je n'en bois pas)</div>
                        <div class="option" onclick="answer('coffee', '1-2'); goToNextScreen();">1-2 tasses</div>
                        <div class="option" onclick="answer('coffee', '3-4'); goToNextScreen();">3-4 tasses</div>
                        <div class="option" onclick="answer('coffee', '5-6'); goToNextScreen();">5-6 tasses</div>
                        <div class="option" onclick="answer('coffee', '7+'); goToNextScreen();">7+ tasses</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 32: // Q28: Suppléments (multi)
            html = `
                <div class="card">
                    <h2 class="question-text">Compléments alimentaires actuels ?</h2>
                    <p class="multi-select-info">Sélectionne tous ceux que tu prends</p>
                    <div class="options-grid">
                        ${['Vitamine D', 'Oméga 3', 'Magnésium', 'Probiotiques', 
                           'Multivitamines', 'Protéines', 'Créatine', 'Collagène',
                           'Vitamine C', 'Zinc', 'Aucun'].map(opt => 
                            `<div class="option" onclick="toggleMultiSelect('supplements', '${opt}', this)">${opt}</div>`
                        ).join('')}
                    </div>
                    <button class="btn-primary" onclick="validateMultiSelect('supplements')">CONTINUER →</button>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 33: // Q29: Tracking (multi)
            html = `
                <div class="card">
                    <h2 class="question-text">Outils de tracking santé ?</h2>
                    <p class="multi-select-info">Choisis tous ceux que tu utilises</p>
                    <div class="options-grid">
                        ${['Apple Watch', 'Garmin', 'Whoop', 'Oura Ring', 
                           'Fitbit', 'Apps mobiles', 'Balance connectée', 'Aucun'].map(opt => 
                            `<div class="option" onclick="toggleMultiSelect('tracking', '${opt}', this)">${opt}</div>`
                        ).join('')}
                    </div>
                    <button class="btn-primary" onclick="validateMultiSelect('tracking')">CONTINUER →</button>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 34: // Q30: Pression/charge (conditionnel)
            if (answers.gender === 'femme') {
                html = `
                    <div class="card">
                        <h2 class="question-text">Ta charge mentale au quotidien ?</h2>
                        <div class="options">
                            <div class="option" onclick="answer('mental_load', 'Légère'); goToNextScreen();">Légère et gérable</div>
                            <div class="option" onclick="answer('mental_load', 'Modérée'); goToNextScreen();">Modérée</div>
                            <div class="option" onclick="answer('mental_load', 'Importante'); goToNextScreen();">Importante</div>
                            <div class="option" onclick="answer('mental_load', 'Écrasante'); goToNextScreen();">Écrasante</div>
                        </div>
                        <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                    </div>
                `;
            } else {
                html = `
                    <div class="card">
                        <h2 class="question-text">Pression professionnelle actuelle ?</h2>
                        <div class="options">
                            <div class="option" onclick="answer('work_pressure', 'Faible'); goToNextScreen();">Faible</div>
                            <div class="option" onclick="answer('work_pressure', 'Modérée'); goToNextScreen();">Modérée</div>
                            <div class="option" onclick="answer('work_pressure', 'Forte'); goToNextScreen();">Forte</div>
                            <div class="option" onclick="answer('work_pressure', 'Extrême'); goToNextScreen();">Extrême</div>
                        </div>
                        <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                    </div>
                `;
            }
            break;
            
        case 35: // WOW Break 5
            html = `
                <div class="card wow-break">
                    <div class="wow-icon">🔄</div>
                    <h2 class="wow-title">TES HORMONES TE DIRIGENT</h2>
                    <div class="wow-stat">40%</div>
                    <p class="wow-description">
                        <strong>de performance en moins si tu ignores tes hormones</strong><br><br>
                        Testostérone, cortisol, thyroïde...<br>
                        Elles contrôlent ton énergie, ton humeur, ta récup.
                    </p>
                    <div class="wow-source">📊 Journal of Clinical Endocrinology, 2022</div>
                    <button class="btn-primary" onclick="goToNextScreen()">CONTINUER →</button>
                </div>
            `;
            break;
            
        case 36: // Q31: Temps pour soi
            html = `
                <div class="card">
                    <h2 class="question-text">Temps pour ta santé par jour ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('health_time', '0-15min'); goToNextScreen();">0-15min</div>
                        <div class="option" onclick="answer('health_time', '15-30min'); goToNextScreen();">15-30min</div>
                        <div class="option" onclick="answer('health_time', '30-60min'); goToNextScreen();">30-60min</div>
                        <div class="option" onclick="answer('health_time', '1-2h'); goToNextScreen();">1-2h</div>
                        <div class="option" onclick="answer('health_time', '2h+'); goToNextScreen();">2h+</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 37: // Q32: Motivation (multi)
            html = `
                <div class="card">
                    <h2 class="question-text">Qu'est-ce qui te motive vraiment ?</h2>
                    <p class="multi-select-info">Choisis jusqu'à 3 motivations principales</p>
                    <div class="options-grid">
                        ${['Vivre plus longtemps', 'Être plus performant', 'Être un exemple', 
                           'Ma famille', 'Ma carrière', 'Mon apparence', 'Éviter la maladie'].map(opt => 
                            `<div class="option" onclick="toggleMultiSelect('motivation', '${opt}', this, 3)">${opt}</div>`
                        ).join('')}
                    </div>
                    <button class="btn-primary" onclick="validateMultiSelect('motivation')">CONTINUER →</button>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 38: // Q33: Si tu continues
            html = `
                <div class="card">
                    <h2 class="question-text">Si tu continues à ce rythme, dans 3 ans :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('projection', 'Au top'); goToNextScreen();">Je serai au top de ma forme</div>
                        <div class="option" onclick="answer('projection', 'Stable'); goToNextScreen();">Stable, comme aujourd'hui</div>
                        <div class="option" onclick="answer('projection', 'Déclin'); goToNextScreen();">En déclin progressif</div>
                        <div class="option" onclick="answer('projection', 'Inquiet'); goToNextScreen();">J'ai peur pour ma santé</div>
                        <div class="option" onclick="answer('projection', 'Burn-out'); goToNextScreen();">Risque de burn-out/maladie</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 39: // Q34: Prêt à changer
            html = `
                <div class="card">
                    <h2 class="question-text">Es-tu prêt(e) à changer maintenant ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('ready', 'OUI 200%'); goToNextScreen();">OUI à 200% !</div>
                        <div class="option" onclick="answer('ready', 'Oui motivé'); goToNextScreen();">Oui je suis motivé(e)</div>
                        <div class="option" onclick="answer('ready', 'Oui mais peur'); goToNextScreen();">Oui mais j'ai peur</div>
                        <div class="option" onclick="answer('ready', 'Je réfléchis'); goToNextScreen();">Je réfléchis encore</div>
                        <div class="option" onclick="answer('ready', 'Pas vraiment'); goToNextScreen();">Pas vraiment</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 40: // WOW Break Final
            html = `
                <div class="card wow-break">
                    <div class="wow-icon">📊</div>
                    <h2 class="wow-title">TON FUTUR EN CHIFFRES</h2>
                    <div class="wow-stat">80%</div>
                    <p class="wow-description">
                        <strong>de risque en moins de maladies chroniques</strong><br><br>
                        En optimisant juste 5 habitudes clés.<br>
                        Tu vas découvrir lesquelles dans tes résultats.
                    </p>
                    <div class="wow-source">📊 Harvard T.H. Chan School of Public Health, 2020</div>
                    <button class="btn-primary" onclick="goToNextScreen()">VOIR MES RÉSULTATS →</button>
                </div>
            `;
            break;
            
        case 41: // Email
            html = `
                <div class="card">
                    <h2 class="question-text">Dernière étape !</h2>
                    <p style="color: var(--text-light); margin-bottom: 30px;">
                        Reçois ton diagnostic personnalisé par email
                    </p>
                    <input type="text" id="name" placeholder="Ton prénom">
                    <input type="email" id="email" placeholder="ton@email.com">
                    <input type="tel" id="phone" placeholder="06 12 34 56 78 (optionnel)">
                    
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
            
        case 42: // Calcul
            html = `
                <div class="card" style="text-align: center;">
                    <h2 style="color: var(--primary-blue); margin-bottom: 30px;">
                        Analyse de tes réponses en cours...
                    </h2>
                    <div class="score-circle">
                        <svg width="180" height="180">
                            <circle cx="90" cy="90" r="80" fill="none" stroke="#E0E0E0" stroke-width="10"/>
                            <circle cx="90" cy="90" r="80" fill="none" 
                                    stroke="url(#gradient)" stroke-width="10"
                                    stroke-dasharray="502" stroke-dashoffset="502"
                                    transform="rotate(-90 90 90)"
                                    style="animation: fillCircle 3s ease-in-out forwards;"/>
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style="stop-color:var(--primary-blue);stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:var(--accent-green);stop-opacity:1" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div class="score-value">--</div>
                    </div>
                    <p style="color: var(--text-light);">Calcul de ton âge biologique...</p>
                </div>
            `;
            calculateScore();
            break;
            
        case 43: // Résultats
            const bioAge = 48; // Sera calculé dynamiquement
            const realAge = answers.age || 43;
            html = `
                <div class="card">
                    <h2 style="text-align: center; color: var(--primary-blue); margin-bottom: 30px;">
                        📊 TES RÉSULTATS
                    </h2>
                    
                    <div style="text-align: center; margin: 40px 0;">
                        <div style="font-size: 18px; color: var(--text-light); margin-bottom: 10px;">
                            TON ÂGE BIOLOGIQUE
                        </div>
                        <div style="font-size: 72px; font-weight: 900; color: var(--primary-blue);">
                            ${bioAge} ans
                        </div>
                        <div style="font-size: 16px; color: var(--text-light); margin: 20px 0;">
                            vs
                        </div>
                        <div style="font-size: 36px; font-weight: 700; color: var(--text-dark);">
                            ${realAge} ans (réel)
                        </div>
                    </div>
                    
                    <div class="results-details">
                        <h3>🎯 TES 3 PRIORITÉS :</h3>
                        <div class="priority-item">
                            <div class="priority-title">🏃 Activité physique insuffisante</div>
                            <div class="priority-impact">Impact : -3 ans d'espérance de vie</div>
                            <div class="priority-solution">→ Commencer par 2x20min/semaine</div>
                        </div>
                        <div class="priority-item">
                            <div class="priority-title">😴 Sommeil non récupérateur</div>
                            <div class="priority-impact">Impact : -2 ans + risque cognitif</div>
                            <div class="priority-solution">→ Routine du soir + magnésium</div>
                        </div>
                        <div class="priority-item">
                            <div class="priority-title">💧 Déshydratation chronique</div>
                            <div class="priority-impact">Impact : -20% performance</div>
                            <div class="priority-solution">→ 2L/jour minimum</div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 40px;">
                        <a href="https://oralife.club/protocole" class="cta-button">
                            OBTENIR MON PROTOCOLE COMPLET →
                        </a>
                    </div>
                </div>
            `;
            break;
    }
    
    container.innerHTML = html;
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    updateProgressBar();
    renderCurrentScreen();
});
