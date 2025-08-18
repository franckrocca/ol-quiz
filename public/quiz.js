// État global
let currentScreen = 0;
let answers = {};
let multiSelectAnswers = {};
let userInfo = {};
const totalScreens = 41;

// Mapping complet des écrans
const screenMap = {
    0: 'screen-0',     // Landing
    1: 'screen-1',     // Genre
    2: 'screen-2',     // Age exact
    3: 'screen-3',     // Poids/Taille
    4: 'screen-4',     // Objectifs
    5: 'screen-5',     // Energie vs 3 ans
    6: 'screen-6',     // Dernière fois 100%
    7: 'screen-7',     // Blocage
    8: 'screen-8',     // Escalier
    9: 'screen-9',     // Heures assis
    10: 'screen-wow1', // WOW Break 1
    11: 'screen-10',   // Sommeil
    12: 'screen-11',   // Cycle/Libido
    13: 'screen-12',   // Crash
    14: 'screen-13',   // Poids vs idéal
    15: 'screen-14',   // Digestion
    16: 'screen-wow2', // WOW Break 2
    17: 'screen-15',   // Douleurs articulaires
    18: 'screen-16',   // Mémoire
    19: 'screen-17',   // Symptômes/Muscle
    20: 'screen-18',   // Récupération
    21: 'screen-19',   // Stress
    22: 'screen-20',   // Peau
    23: 'screen-21',   // Environnement
    24: 'screen-wow3', // WOW Break 3
    25: 'screen-22',   // Soleil
    26: 'screen-23',   // Nature
    27: 'screen-24',   // Qualité sommeil
    28: 'screen-25',   // Heure coucher
    29: 'screen-26',   // Écrans
    30: 'screen-27',   // Petit-déj
    31: 'screen-28',   // Hydratation
    32: 'screen-29',   // Alcool
    33: 'screen-wow4', // WOW Break 4
    34: 'screen-30',   // Activités physiques
    35: 'screen-31',   // Fréquence sport
    36: 'screen-32',   // Compléments
    37: 'screen-33',   // Tracking
    38: 'screen-34',   // Charge/Pression
    39: 'screen-35',   // Relations
    40: 'screen-36',   // Vacances
    41: 'screen-37',   // Projection 5 ans
    42: 'screen-wow5', // WOW Break 5
    43: 'screen-38',   // Plus grande peur
    44: 'screen-39',   // Motivation
    45: 'screen-40',   // Budget
    46: 'screen-41',   // Temps disponible
    47: 'screen-wow6', // WOW Break 6
    48: 'screen-email',
    49: 'screen-calculating',
    50: 'screen-results'
};

// Navigation
function goToNextScreen() {
    hideCurrentScreen();
    currentScreen++;
    showScreen(currentScreen);
    updateProgressBar();
    
    // Setup des questions conditionnelles
    if (screenMap[currentScreen] === 'screen-11') setupQ11();
    if (screenMap[currentScreen] === 'screen-17') setupQ17();
    if (screenMap[currentScreen] === 'screen-34') setupQ34();
}

function goToPrevScreen() {
    hideCurrentScreen();
    currentScreen--;
    showScreen(currentScreen);
    updateProgressBar();
}

function hideCurrentScreen() {
    const currentScreenId = screenMap[currentScreen];
    if (currentScreenId) {
        const element = document.getElementById(currentScreenId);
        if (element) {
            element.classList.remove('active');
        }
    }
}

function showScreen(screenNumber) {
    const screenId = screenMap[screenNumber];
    if (screenId) {
        const element = document.getElementById(screenId);
        if (element) {
            element.classList.add('active');
        }
    }
}

// Barre de progression améliorée
function updateProgressBar() {
    const actualStep = currentScreen > 47 ? 41 : currentScreen;
    const progress = (actualStep / totalScreens) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    
    // Texte dynamique au lieu du compteur
    const progressText = document.getElementById('progress-text');
    if (progress === 0) {
        progressText.textContent = "Prêt à commencer";
    } else if (progress < 25) {
        progressText.textContent = "Découverte de ton profil...";
    } else if (progress < 50) {
        progressText.textContent = "Analyse de tes habitudes...";
    } else if (progress < 75) {
        progressText.textContent = "Évaluation de ta santé...";
    } else if (progress < 100) {
        progressText.textContent = "Finalisation...";
    } else {
        progressText.textContent = "Analyse complète !";
    }
}

// Validation âge
function validateAge() {
    const age = document.getElementById('age-exact').value;
    if (!age || age < 18 || age > 100) {
        alert('Merci d\'entrer un âge valide (18-100 ans)');
        return false;
    }
    answers.age_exact = parseInt(age);
    return true;
}

// Validation poids/taille
function validateWeightHeight() {
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    
    if (!weight || !height) {
        alert('Merci de remplir ton poids et ta taille');
        return false;
    }
    
    answers.weight = parseFloat(weight);
    answers.height = parseFloat(height);
    answers.bmi = calculateBMIValue();
    
    return true;
}

// Calcul IMC
function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    
    if (weight && height) {
        const heightInM = height / 100;
        const bmi = weight / (heightInM * heightInM);
        
        document.getElementById('bmi-display').style.display = 'block';
        document.getElementById('bmi-value').textContent = bmi.toFixed(1);
        
        let interpretation = '';
        let color = '';
        let position = 0;
        
        if (bmi < 18.5) {
            interpretation = 'Insuffisance pondérale';
            color = '#3498db';
            position = (bmi / 18.5) * 25;
        } else if (bmi < 25) {
            interpretation = 'Poids normal ✅';
            color = '#2ecc71';
            position = 25 + ((bmi - 18.5) / 6.5) * 25;
        } else if (bmi < 30) {
            interpretation = 'Surpoids';
            color = '#f1c40f';
            position = 50 + ((bmi - 25) / 5) * 25;
        } else {
            interpretation = 'Obésité';
            color = '#e74c3c';
            position = Math.min(75 + ((bmi - 30) / 10) * 25, 100);
        }
        
        document.getElementById('bmi-interpretation').innerHTML = interpretation;
        document.getElementById('bmi-interpretation').style.backgroundColor = color;
        document.getElementById('bmi-interpretation').style.color = 'white';
        document.getElementById('bmi-interpretation').style.padding = '10px';
        document.getElementById('bmi-interpretation').style.borderRadius = '8px';
        document.getElementById('bmi-marker').style.left = position + '%';
    }
}

function calculateBMIValue() {
    const weight = parseFloat(answers.weight);
    const height = parseFloat(answers.height);
    if (weight && height) {
        const heightInM = height / 100;
        return weight / (heightInM * heightInM);
    }
    return 0;
}

// Enregistrer les réponses
function answer(key, value) {
    answers[key] = value;
    console.log('Réponse:', key, '=', value);
}

// Multi-select handling
function toggleMultiSelect(category, value, element, maxSelections = null) {
    if (!multiSelectAnswers[category]) {
        multiSelectAnswers[category] = [];
    }
    
    const index = multiSelectAnswers[category].indexOf(value);
    
    // Si c'est "Aucun" ou similaire, désélectionner tout le reste
    if (value.includes('Aucun') || value === 'Aucune activité') {
        // Désélectionner tous les autres
        document.querySelectorAll(`#${category}-options .option`).forEach(opt => {
            opt.classList.remove('selected');
        });
        multiSelectAnswers[category] = [value];
        element.classList.add('selected');
        return;
    }
    
    // Si un autre est sélectionné, enlever "Aucun"
    const noneIndex = multiSelectAnswers[category].findIndex(v => 
        v.includes('Aucun') || v === 'Aucune activité'
    );
    if (noneIndex > -1) {
        multiSelectAnswers[category].splice(noneIndex, 1);
        document.querySelectorAll(`#${category}-options .option`).forEach(opt => {
            if (opt.textContent.includes('Aucun') || opt.textContent.includes('Aucune activité')) {
                opt.classList.remove('selected');
            }
        });
    }
    
    if (index > -1) {
        // Déselectionner
        multiSelectAnswers[category].splice(index, 1);
        element.classList.remove('selected');
    } else {
        // Vérifier le maximum
        if (maxSelections && multiSelectAnswers[category].length >= maxSelections) {
            alert(`Tu peux choisir maximum ${maxSelections} options`);
            return;
        }
        // Sélectionner
        multiSelectAnswers[category].push(value);
        element.classList.add('selected');
    }
}

function validateMultiSelect(category) {
    if (!multiSelectAnswers[category] || multiSelectAnswers[category].length === 0) {
        alert('Merci de choisir au moins une option');
        return false;
    }
    answers[category] = multiSelectAnswers[category];
    return true;
}

// Questions conditionnelles
function setupQ11() {
    const gender = answers['gender'];
    const q11Text = document.getElementById('q11-text');
    const q11Options = document.getElementById('q11-options');
    
    q11Options.innerHTML = '';
    
    if (gender === 'femme') {
        q11Text.textContent = "Où en es-tu dans ton cycle féminin ?";
        const options = [
            "Cycle régulier parfait",
            "Cycle irrégulier",
            "Péri-ménopause",
            "Ménopause",
            "Post-ménopause"
        ];
        
        options.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = opt;
            div.onclick = () => {
                answer('female_cycle', opt);
                goToNextScreen();
            };
            q11Options.appendChild(div);
        });
    } else {
        q11Text.textContent = "Ta libido actuellement :";
        const options = [
            "Au top comme à 20 ans",
            "Correcte",
            "En baisse notable",
            "Très diminuée",
            "Problématique"
        ];
        
        options.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = opt;
            div.onclick = () => {
                answer('libido', opt);
                goToNextScreen();
            };
            q11Options.appendChild(div);
        });
    }
}

function setupQ17() {
    const gender = answers['gender'];
    const q17Text = document.getElementById('q17-text');
    const q17Options = document.getElementById('q17-options');
    
    q17Options.innerHTML = '';
    
    if (gender === 'femme') {
        q17Text.textContent = "Symptômes hormonaux :";
        const options = [
            "Aucun",
            "Bouffées de chaleur occasionnelles",
            "Sautes d'humeur fréquentes",
            "Multiples symptômes gênants",
            "Impact majeur sur ma vie"
        ];
        
        options.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = opt;
            div.onclick = () => {
                answer('hormonal_symptoms', opt);
                goToNextScreen();
            };
            q17Options.appendChild(div);
        });
    } else {
        q17Text.textContent = "Masse musculaire vs il y a 5 ans :";
        const options = [
            "Identique ou mieux",
            "-10% environ",
            "-20% environ",
            "-30% environ",
            "Fonte musculaire importante"
        ];
        
        options.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = opt;
            div.onclick = () => {
                answer('muscle_mass', opt);
                goToNextScreen();
            };
            q17Options.appendChild(div);
        });
    }
}

function setupQ34() {
    const gender = answers['gender'];
    const q34Text = document.getElementById('q34-text');
    const q34Options = document.getElementById('q34-options');
    
    q34Options.innerHTML = '';
    
    if (gender === 'femme') {
        q34Text.textContent = "Charge mentale quotidienne :";
        const options = [
            "Légère et gérable",
            "Normale",
            "Importante",
            "Très lourde",
            "Écrasante"
        ];
        
        options.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = opt;
            div.onclick = () => {
                answer('mental_load', opt);
                goToNextScreen();
            };
            q34Options.appendChild(div);
        });
    } else {
        q34Text.textContent = "Pression professionnelle/financière :";
        const options = [
            "Très faible",
            "Gérable",
            "Importante",
            "Très forte",
            "Insoutenable"
        ];
        
        options.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = opt;
            div.onclick = () => {
                answer('professional_pressure', opt);
                goToNextScreen();
            };
            q34Options.appendChild(div);
        });
    }
}

// Soumission email
async function submitEmail() {
    const firstname = document.getElementById('firstname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const consent = document.getElementById('consent').checked;
    
    if (!firstname || !email || !phone || !consent) {
        alert('Merci de remplir tous les champs et d\'accepter les conditions');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Merci d\'entrer un email valide');
        return;
    }
    
    if (!validatePhone(phone)) {
        alert('Merci d\'entrer un numéro de téléphone valide');
        return;
    }
    
    userInfo.firstname = firstname;
    userInfo.email = email;
    userInfo.phone = phone;
    
    // Passer à l'écran de calcul
    hideCurrentScreen();
    currentScreen = 49;
    showScreen(currentScreen);
    
    // Lancer l'animation de calcul
    startCalculation();
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Animation de calcul
function startCalculation() {
    // Animer les étapes
    setTimeout(() => {
        document.getElementById('step1').style.opacity = '1';
    }, 500);
    
    setTimeout(() => {
        document.getElementById('step2').style.opacity = '1';
    }, 1500);
    
    setTimeout(() => {
        document.getElementById('step3').style.opacity = '1';
    }, 2500);
    
    // Calculer et afficher le score
    setTimeout(() => {
        calculateAndShowResults();
    }, 3500);
}

// Afficher les résultats
async function calculateAndShowResults() {
    try {
        // Préparer les données pour l'API
        const formData = {
            ...answers,
            ...userInfo,
            objectives: answers.objectives || [],
            activities: answers.activities || [],
            tracking: answers.tracking || [],
            motivations: answers.motivations || []
        };
        
        // Appeler l'API pour calculer le score
        const response = await fetch('/api/calculate-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        // Passer à l'écran des résultats
        hideCurrentScreen();
        currentScreen = 50;
        showScreen(currentScreen);
        
        // Afficher les résultats
        setTimeout(() => {
            animateScore(result.score);
            displayInterpretation(result.score, result.level);
            displayDetailedAnalysis(result);
            displayScientificRisks(result);
        }, 500);
        
        // Afficher l'email
        document.getElementById('userEmail').textContent = userInfo.email;
        
        // Envoyer les données à Google Sheets
        sendToGoogleSheet(result);
        
    } catch (error) {
        console.error('Erreur calcul:', error);
        // Fallback en cas d'erreur
        calculateLocalResults();
    }
}

// Calcul local en cas d'erreur API
function calculateLocalResults() {
    const score = 75; // Score par défaut
    
    hideCurrentScreen();
    currentScreen = 50;
    showScreen(currentScreen);
    
    setTimeout(() => {
        animateScore(score);
        displayInterpretation(score);
        displayBasicAnalysis();
    }, 500);
    
    document.getElementById('userEmail').textContent = userInfo.email;
}

function animateScore(finalScore) {
    const scoreElement = document.getElementById('finalScore');
    const circle = document.getElementById('scoreCircle');
    
    // Animation du cercle
    const circumference = 502;
    const offset = circumference - (finalScore / 100) * circumference;
    circle.style.transition = 'stroke-dashoffset 2s ease-out';
    circle.style.strokeDashoffset = offset;
    
    // Animation du nombre
    let currentScore = 0;
    const increment = finalScore / 50;
    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= finalScore) {
            currentScore = finalScore;
            clearInterval(timer);
        }
        scoreElement.textContent = Math.round(currentScore);
    }, 40);
}

function displayInterpretation(score, level = null) {
    const interpretationDiv = document.getElementById('scoreInterpretation');
    
    if (!level) {
        // Déterminer le niveau localement si pas fourni
        if (score >= 80) level = { level: 5, label: "OPTIMAL", color: "#00CC00", emoji: "🌟", description: "Performance biologique maximale" };
        else if (score >= 65) level = { level: 4, label: "BON", color: "#8BC34A", emoji: "✅", description: "Santé préservée, optimisation possible" };
        else if (score >= 50) level = { level: 3, label: "MOYEN", color: "#FFA500", emoji: "⚠️", description: "Signaux d'alerte, action recommandée" };
        else if (score >= 35) level = { level: 2, label: "FAIBLE", color: "#FF6600", emoji: "🚨", description: "Vieillissement accéléré détecté" };
        else level = { level: 1, label: "CRITIQUE", color: "#FF0000", emoji: "🆘", description: "Urgence santé, intervention nécessaire" };
    }
    
    interpretationDiv.innerHTML = `
        <div style="text-align: center;">
            <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0;">
                ${[1,2,3,4,5].map(i => `
                    <div style="
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: ${i <= level.level ? level.color : '#E0E0E0'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        color: white;
                        box-shadow: ${i <= level.level ? '0 2px 10px rgba(0,0,0,0.2)' : 'none'};
                    ">${i}</div>
                `).join('')}
            </div>
            <h2 style="color: ${level.color}; margin: 15px 0;">
                ${level.emoji} Niveau ${level.level}/5 : ${level.label}
            </h2>
            <p style="font-size: 16px; color: #666;">
                ${level.description}
            </p>
        </div>
    `;
}

function displayDetailedAnalysis(result) {
    const detailedDiv = document.getElementById('detailedResults');
    const urgentDiv = document.getElementById('urgentPoints');
    const strengthDiv = document.getElementById('strengthPoints');
    
    if (result.ageAnalysis) {
        detailedDiv.innerHTML = `
            <p><strong>Âge chronologique :</strong> ${result.ageAnalysis.chrono} ans</p>
            <p><strong>Estimation âge biologique :</strong> 
                <span style="color: ${result.ageAnalysis.difference > 0 ? '#FF4444' : '#00CC00'}; font-weight: bold;">
                    ${result.ageAnalysis.bio} ans (${result.ageAnalysis.difference > 0 ? '+' : ''}${result.ageAnalysis.difference} ans)
                </span>
            </p>
            <p style="font-size: 12px; color: #666; margin-top: 5px;">
                <em>* Basé sur tes réponses et les corrélations épidémiologiques</em>
            </p>
            <p><strong>Interprétation :</strong> ${result.ageAnalysis.interpretation}</p>
            <p><strong>IMC :</strong> ${result.bmi ? result.bmi.toFixed(1) : 'N/A'}</p>
        `;
    }
    
    if (result.urgentPoints && result.urgentPoints.length > 0) {
        urgentDiv.innerHTML = result.urgentPoints.map(item => `<p style="margin: 10px 0;">• ${item}</p>`).join('');
    } else {
        urgentDiv.innerHTML = '<p style="margin: 10px 0;">• Continue sur cette voie positive</p>';
    }
    
    if (result.strengthPoints && result.strengthPoints.length > 0) {
        strengthDiv.innerHTML = result.strengthPoints.map(item => `<p style="margin: 10px 0;">• ${item}</p>`).join('');
    } else {
        strengthDiv.innerHTML = '<p style="margin: 10px 0;">• Potentiel d\'amélioration identifié</p>';
    }
}

function displayBasicAnalysis() {
    const detailedDiv = document.getElementById('detailedResults');
    const urgentDiv = document.getElementById('urgentPoints');
    const strengthDiv = document.getElementById('strengthPoints');
    
    detailedDiv.innerHTML = `
        <p><strong>Analyse en cours de traitement...</strong></p>
        <p>Tes résultats détaillés ont été envoyés par email.</p>
    `;
    
    urgentDiv.innerHTML = '<p style="margin: 10px 0;">• Analyse complète disponible par email</p>';
    strengthDiv.innerHTML = '<p style="margin: 10px 0;">• Potentiel d\'optimisation identifié</p>';
}

function displayScientificRisks(result) {
    const riskStat = document.getElementById('risk-stat');
    const riskText = document.getElementById('risk-text');
    const futureRisks = document.getElementById('future-risks');
    
    if (result.riskAnalysis) {
        riskStat.textContent = result.riskAnalysis.level;
        riskStat.style.color = result.riskAnalysis.color;
        riskText.innerHTML = result.riskAnalysis.text;
        futureRisks.innerHTML = result.riskAnalysis.futureRisks.map(risk => `<li>${risk}</li>`).join('');
    } else {
        // Valeurs par défaut
        riskStat.textContent = 'En analyse';
        riskText.innerHTML = 'Résultats détaillés envoyés par email';
        futureRisks.innerHTML = '<li>✅ Protocole personnalisé disponible</li>';
    }
}

// Envoi vers Google Sheets
async function sendToGoogleSheet(result) {
    const formData = {
        timestamp: new Date().toISOString(),
        firstname: userInfo.firstname,
        email: userInfo.email,
        phone: userInfo.phone,
        score: result.score,
        age_exact: answers.age_exact,
        gender: answers.gender,
        weight: answers.weight,
        height: answers.height,
        bmi: calculateBMIValue().toFixed(1),
        // Toutes les réponses
        ...answers,
        // Multi-select sous forme de string
        objectives: (answers.objectives || []).join(', '),
        activities: (answers.activities || []).join(', '),
        tracking: (answers.tracking || []).join(', '),
        motivations: (answers.motivations || []).join(', ')
    };
    
    // TODO: Remplacer par ton URL Google Apps Script
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjyAjH9Nl6y2IeRWHi5Qrr6ftqVilH4T9RMPAdNXM_XYVuaN0WFzrPPYwVL8oOZR0W/exec';
    
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        console.log('Données envoyées avec succès');
    } catch (error) {
        console.error('Erreur envoi:', error);
    }
}

// Réservation d'appel
function bookCall() {
    // Option 1: Calendly (remplace par ton lien)
    window.open('https://calendly.com/oralife/consultation', '_blank');
    
    // Option 2: Tracking Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'book_call', {
            'event_category': 'engagement',
            'event_label': 'quiz_result',
            'score': document.getElementById('finalScore').textContent
        });
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    updateProgressBar();
});
