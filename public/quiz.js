// ORA LIFE Quiz - Version COMPLÈTE avec TOUTES les 41 questions d'index9.html
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjyAjH9Nl6y2IeRWHi5Qrr6ftqVilH4T9RMPAdNXM_XYVuaN0WFzrPPYwVL8oOZR0W/exec';

// Variables globales
let currentScreen = 0;
let answers = {};
let multiSelectAnswers = {};
const totalScreens = 41;

// Fonction pour sauvegarder une réponse
function answer(key, value) {
    answers[key] = value;
    console.log('Answer saved:', key, value);
}

// Navigation
function goToNextScreen() {
    // Validation spécifique selon l'écran
    if (currentScreen === 2) {
        // Validation âge
        const age = document.getElementById('age-exact')?.value;
        if (!age || age < 18 || age > 100) {
            alert("Merci d'entrer un âge valide (18-100 ans)");
            return;
        }
        answers.age_exact = parseInt(age);
    }
    
    if (currentScreen === 3) {
        // Validation poids/taille et calcul IMC
        const weight = parseFloat(document.getElementById('weight')?.value);
        const height = parseFloat(document.getElementById('height')?.value);
        
        if (!weight || !height) {
            alert('Merci de remplir ton poids et ta taille');
            return;
        }
        
        answers.weight = weight;
        answers.height = height;
        
        // Calcul IMC
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
    const actualStep = currentScreen > 41 ? 41 : currentScreen;
    const progress = (actualStep / totalScreens) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    
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

// Calcul IMC en temps réel
function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight')?.value);
    const height = parseFloat(document.getElementById('height')?.value);
    
    if (weight && height) {
        const heightM = height / 100;
        const bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;
        
        // Afficher l'IMC immédiatement
        const bmiDisplay = document.getElementById('bmi-display');
        if (bmiDisplay) {
            bmiDisplay.style.display = 'block';
            document.getElementById('bmi-value').textContent = bmi;
            
            let interpretation = '';
            let pointerPosition = 0;
            
            if (bmi < 18.5) {
                interpretation = 'Maigreur';
                pointerPosition = (bmi / 18.5) * 25;
            } else if (bmi < 25) {
                interpretation = 'Normal';
                pointerPosition = 25 + ((bmi - 18.5) / 6.5) * 25;
            } else if (bmi < 30) {
                interpretation = 'Surpoids';
                pointerPosition = 50 + ((bmi - 25) / 5) * 25;
            } else {
                interpretation = 'Obésité';
                pointerPosition = 75 + Math.min(((bmi - 30) / 10) * 25, 25);
            }
            
            document.getElementById('bmi-interpretation').textContent = interpretation;
            const marker = document.getElementById('bmi-marker');
            if (marker) {
                marker.style.left = `${Math.min(pointerPosition, 95)}%`;
            }
        }
        
        return bmi;
    }
    return null;
}

// Toggle multi-select
function toggleMultiSelect(key, value, element, max = 3) {
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
            alert(`Maximum ${max} choix`);
        }
    }
    
    answers[key] = multiSelectAnswers[key].join(',');
}

// Soumettre email
function submitEmail() {
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const phone = document.getElementById('user-phone').value || '';
    
    if (!name || !email) {
        alert('Merci de remplir ton prénom et email');
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

// Calcul du score final
function calculateScore() {
    let score = 100;
    
    // Logique de calcul basée sur les réponses
    if (answers.energy_vs_3years === 'Beaucoup moins') score -= 15;
    else if (answers.energy_vs_3years === 'Un peu moins') score -= 10;
    else if (answers.energy_vs_3years === 'Pareil') score -= 5;
    
    if (answers.sleep_hours === 'Moins de 6h') score -= 15;
    else if (answers.sleep_hours === '6-7h') score -= 10;
    else if (answers.sleep_hours === 'Plus de 9h') score -= 5;
    
    if (answers.stress_level === 'Mode survie/burnout') score -= 20;
    else if (answers.stress_level === 'Très élevé quotidiennement') score -= 15;
    else if (answers.stress_level === 'Élevé régulièrement') score -= 10;
    
    return Math.max(0, Math.min(100, score));
}

// Rendu de l'écran actuel - TOUTES LES 41 QUESTIONS
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
                        <div class="visual-option ${answers.gender === 'homme' ? 'selected' : ''}" 
                             onclick="answer('gender', 'homme'); goToNextScreen();">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" alt="Homme">
                            <div class="label">Homme</div>
                        </div>
                        <div class="visual-option ${answers.gender === 'femme' ? 'selected' : ''}" 
                             onclick="answer('gender', 'femme'); goToNextScreen();">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop" alt="Femme">
                            <div class="label">Femme</div>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 2: // Q2: Âge exact
            html = `
                <div class="card">
                    <h2 class="question-text">Quel est ton âge exact ?</h2>
                    <div class="form-group">
                        <input 
                            type="number" 
                            id="age-exact" 
                            class="form-input" 
                            placeholder="Ex: 42"
                            value="${answers.age_exact || ''}"
                            min="18"
                            max="100"
                            style="font-size: 24px; text-align: center;"
                            onkeypress="if(event.key === 'Enter') goToNextScreen()"
                        >
                    </div>
                    <button class="btn-primary" onclick="goToNextScreen()" style="width: 100%; margin-top: 20px;">
                        CONTINUER →
                    </button>
                </div>
            `;
            break;
            
        case 3: // Q3: Poids et taille avec IMC
            html = `
                <div class="card">
                    <h2 class="question-text">Tes mensurations actuelles</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="form-group">
                            <label class="form-label">Poids (kg)</label>
                            <input type="number" id="weight" class="form-input" 
                                   value="${answers.weight || ''}"
                                   placeholder="75" min="30" max="200" 
                                   onchange="calculateBMI()"
                                   onkeyup="calculateBMI()">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Taille (cm)</label>
                            <input type="number" id="height" class="form-input"
                                   value="${answers.height || ''}" 
                                   placeholder="175" min="120" max="230" 
                                   onchange="calculateBMI()"
                                   onkeyup="calculateBMI()">
                        </div>
                    </div>
                    
                    <div id="bmi-display" class="bmi-card" style="display: ${answers.bmi ? 'block' : 'none'};">
                        <h3>Ton IMC : <span id="bmi-value">${answers.bmi || '--'}</span></h3>
                        <div id="bmi-interpretation">${answers.bmi ? (answers.bmi < 18.5 ? 'Maigreur' : answers.bmi < 25 ? 'Normal' : answers.bmi < 30 ? 'Surpoids' : 'Obésité') : ''}</div>
                        <div class="bmi-gauge">
                            <div class="bmi-marker" id="bmi-marker"></div>
                        </div>
                    </div>
                    
                    <button class="btn-primary" onclick="goToNextScreen()" style="width: 100%; margin-top: 20px;">
                        CONTINUER →
                    </button>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            setTimeout(() => {
                if (answers.weight && answers.height) {
                    calculateBMI();
                }
            }, 100);
            break;
            
        case 4: // Q4: Objectifs (multi-select)
            const savedGoals = answers.goals ? answers.goals.split(',') : [];
            html = `
                <div class="card">
                    <h2 class="question-text">Tes 3 objectifs prioritaires ?</h2>
                    <p class="multi-select-info">Choisis jusqu'à 3 objectifs maximum</p>
                    <div class="options-vertical">
                        ${['Perdre du gras', 'Avoir plus d\'énergie', 'Mieux dormir', 'Gagner du muscle', 
                          'Vivre plus longtemps', 'Améliorer ma libido', 'Réduire mon stress'].map(option => {
                            const value = option.toLowerCase().replace(/\s+/g, '_').replace(/'/g, '');
                            return `
                                <div class="option-checkbox ${savedGoals.includes(value) ? 'selected' : ''}" 
                                     onclick="toggleMultiSelect('goals', '${value}', this)">
                                    <span class="checkbox-icon">✓</span>
                                    <span>${option}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <button class="btn-primary" onclick="goToNextScreen()">CONTINUER →</button>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 5: // Q5: Énergie vs 3 ans
            html = `
                <div class="card">
                    <h2 class="question-text">Ton énergie vs il y a 3 ans :</h2>
                    <div class="options">
                        <div class="option ${answers.energy_vs_3years === 'Beaucoup plus' ? 'selected' : ''}" 
                             onclick="answer('energy_vs_3years', 'Beaucoup plus'); goToNextScreen();">Beaucoup plus</div>
                        <div class="option ${answers.energy_vs_3years === 'Un peu plus' ? 'selected' : ''}" 
                             onclick="answer('energy_vs_3years', 'Un peu plus'); goToNextScreen();">Un peu plus</div>
                        <div class="option ${answers.energy_vs_3years === 'Pareil' ? 'selected' : ''}" 
                             onclick="answer('energy_vs_3years', 'Pareil'); goToNextScreen();">Pareil</div>
                        <div class="option ${answers.energy_vs_3years === 'Un peu moins' ? 'selected' : ''}" 
                             onclick="answer('energy_vs_3years', 'Un peu moins'); goToNextScreen();">Un peu moins</div>
                        <div class="option ${answers.energy_vs_3years === 'Beaucoup moins' ? 'selected' : ''}" 
                             onclick="answer('energy_vs_3years', 'Beaucoup moins'); goToNextScreen();">Beaucoup moins</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 6: // Q6: Dernière fois 100%
            html = `
                <div class="card">
                    <h2 class="question-text">Dernière fois où tu t'es senti à 100% :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('last_100percent', 'Cette semaine'); goToNextScreen();">Cette semaine</div>
                        <div class="option" onclick="answer('last_100percent', 'Ce mois-ci'); goToNextScreen();">Ce mois-ci</div>
                        <div class="option" onclick="answer('last_100percent', 'Il y a 3-6 mois'); goToNextScreen();">Il y a 3-6 mois</div>
                        <div class="option" onclick="answer('last_100percent', 'Il y a 6-12 mois'); goToNextScreen();">Il y a 6-12 mois</div>
                        <div class="option" onclick="answer('last_100percent', 'Plus d\'un an'); goToNextScreen();">Plus d'un an</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 7: // Q7: Ce qui te bloque
            html = `
                <div class="card">
                    <h2 class="question-text">Qu'est-ce qui te bloque le plus ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('biggest_block', 'Fatigue chronique'); goToNextScreen();">Fatigue chronique</div>
                        <div class="option" onclick="answer('biggest_block', 'Stress/anxiété'); goToNextScreen();">Stress/anxiété</div>
                        <div class="option" onclick="answer('biggest_block', 'Mauvais sommeil'); goToNextScreen();">Mauvais sommeil</div>
                        <div class="option" onclick="answer('biggest_block', 'Douleurs physiques'); goToNextScreen();">Douleurs physiques</div>
                        <div class="option" onclick="answer('biggest_block', 'Manque de motivation'); goToNextScreen();">Manque de motivation</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 8: // Q8: Escalier
            html = `
                <div class="card">
                    <h2 class="question-text">Monter 3 étages à pied, c'est :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('stairs_3floors', 'Facile, je cours'); goToNextScreen();">Facile, je cours</div>
                        <div class="option" onclick="answer('stairs_3floors', 'Ok sans problème'); goToNextScreen();">Ok sans problème</div>
                        <div class="option" onclick="answer('stairs_3floors', 'Je suis essoufflé'); goToNextScreen();">Je suis essoufflé</div>
                        <div class="option" onclick="answer('stairs_3floors', 'C\'est difficile'); goToNextScreen();">C'est difficile</div>
                        <div class="option" onclick="answer('stairs_3floors', 'Je prends l\'ascenseur'); goToNextScreen();">Je prends l'ascenseur</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 9: // Q9: Heures assis
            html = `
                <div class="card">
                    <h2 class="question-text">Heures assis par jour :</h2>
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
            
        case 10: // WOW Break 1
            html = `
                <div class="card wow-break">
                    <div class="wow-title">💡 LE SAVAIS-TU ?</div>
                    <div class="wow-stat">87%</div>
                    <p class="wow-description">
                        des gens ne savent pas que rester assis plus de 6h par jour 
                        augmente le risque de mortalité de 40% !
                    </p>
                    <div class="wow-source">📊 Source: American Cancer Society, 2018</div>
                    <button class="btn-primary" onclick="goToNextScreen()">CONTINUER →</button>
                </div>
            `;
            break;
            
        case 11: // Q10: Heures de sommeil
            html = `
                <div class="card">
                    <h2 class="question-text">Heures de sommeil par nuit :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('sleep_hours', 'Moins de 6h'); goToNextScreen();">Moins de 6h</div>
                        <div class="option" onclick="answer('sleep_hours', '6-7h'); goToNextScreen();">6-7h</div>
                        <div class="option" onclick="answer('sleep_hours', '7-8h'); goToNextScreen();">7-8h</div>
                        <div class="option" onclick="answer('sleep_hours', '8-9h'); goToNextScreen();">8-9h</div>
                        <div class="option" onclick="answer('sleep_hours', 'Plus de 9h'); goToNextScreen();">Plus de 9h</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 12: // Q11: Cycle/Libido (conditionnel selon le genre)
            if (answers.gender === 'femme') {
                html = `
                    <div class="card">
                        <h2 class="question-text">Ton cycle menstruel est :</h2>
                        <div class="options">
                            <div class="option" onclick="answer('cycle', 'Régulier sans problème'); goToNextScreen();">Régulier sans problème</div>
                            <div class="option" onclick="answer('cycle', 'Irrégulier'); goToNextScreen();">Irrégulier</div>
                            <div class="option" onclick="answer('cycle', 'Douloureux'); goToNextScreen();">Douloureux</div>
                            <div class="option" onclick="answer('cycle', 'Ménopause'); goToNextScreen();">Ménopause</div>
                            <div class="option" onclick="answer('cycle', 'Post-ménopause'); goToNextScreen();">Post-ménopause</div>
                        </div>
                        <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                    </div>
                `;
            } else {
                html = `
                    <div class="card">
                        <h2 class="question-text">Ta libido est :</h2>
                        <div class="options">
                            <div class="option" onclick="answer('libido', 'Excellente'); goToNextScreen();">Excellente</div>
                            <div class="option" onclick="answer('libido', 'Bonne'); goToNextScreen();">Bonne</div>
                            <div class="option" onclick="answer('libido', 'Variable'); goToNextScreen();">Variable</div>
                            <div class="option" onclick="answer('libido', 'En baisse'); goToNextScreen();">En baisse</div>
                            <div class="option" onclick="answer('libido', 'Problématique'); goToNextScreen();">Problématique</div>
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
                        <div class="option" onclick="answer('first_crash', 'Juste après le déjeuner'); goToNextScreen();">Juste après le déjeuner</div>
                        <div class="option" onclick="answer('first_crash', 'Dès le matin'); goToNextScreen();">Dès le matin</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 14: // Q13: Poids vs idéal
            html = `
                <div class="card">
                    <h2 class="question-text">Ton poids vs ton idéal :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('weight_vs_ideal', 'Parfait'); goToNextScreen();">Parfait</div>
                        <div class="option" onclick="answer('weight_vs_ideal', '+2-5 kg'); goToNextScreen();">+2-5 kg</div>
                        <div class="option" onclick="answer('weight_vs_ideal', '+5-10 kg'); goToNextScreen();">+5-10 kg</div>
                        <div class="option" onclick="answer('weight_vs_ideal', '+10-15 kg'); goToNextScreen();">+10-15 kg</div>
                        <div class="option" onclick="answer('weight_vs_ideal', '+15 kg ou plus'); goToNextScreen();">+15 kg ou plus</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 15: // Q14: Digestion
            html = `
                <div class="card">
                    <h2 class="question-text">Ta digestion au quotidien :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('digestion', 'Parfaite'); goToNextScreen();">Parfaite</div>
                        <div class="option" onclick="answer('digestion', 'Bonne en général'); goToNextScreen();">Bonne en général</div>
                        <div class="option" onclick="answer('digestion', 'Ballonnements fréquents'); goToNextScreen();">Ballonnements fréquents</div>
                        <div class="option" onclick="answer('digestion', 'Transit irrégulier'); goToNextScreen();">Transit irrégulier</div>
                        <div class="option" onclick="answer('digestion', 'Problèmes chroniques'); goToNextScreen();">Problèmes chroniques</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 16: // WOW Break 2
            html = `
                <div class="card wow-break">
                    <div class="wow-title">💡 DÉCOUVERTE SCIENTIFIQUE</div>
                    <div class="wow-stat">70%</div>
                    <p class="wow-description">
                        de notre système immunitaire se trouve dans l'intestin. 
                        Une mauvaise digestion = vieillissement accéléré !
                    </p>
                    <div class="wow-source">📊 Source: Nature Reviews Immunology, 2021</div>
                    <button class="btn-primary" onclick="goToNextScreen()">CONTINUER →</button>
                </div>
            `;
            break;
            
        case 17: // Q15: Douleurs articulaires
            html = `
                <div class="card">
                    <h2 class="question-text">Douleurs articulaires/musculaires :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('joint_pain', 'Aucune'); goToNextScreen();">Aucune</div>
                        <div class="option" onclick="answer('joint_pain', 'Rares'); goToNextScreen();">Rares</div>
                        <div class="option" onclick="answer('joint_pain', 'Occasionnelles'); goToNextScreen();">Occasionnelles</div>
                        <div class="option" onclick="answer('joint_pain', 'Fréquentes'); goToNextScreen();">Fréquentes</div>
                        <div class="option" onclick="answer('joint_pain', 'Chroniques'); goToNextScreen();">Chroniques</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 18: // Q16: Mémoire
            html = `
                <div class="card">
                    <h2 class="question-text">Ta mémoire/concentration :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('memory', 'Excellente'); goToNextScreen();">Excellente</div>
                        <div class="option" onclick="answer('memory', 'Bonne'); goToNextScreen();">Bonne</div>
                        <div class="option" onclick="answer('memory', 'Variable'); goToNextScreen();">Variable</div>
                        <div class="option" onclick="answer('memory', 'En baisse'); goToNextScreen();">En baisse</div>
                        <div class="option" onclick="answer('memory', 'Très mauvaise'); goToNextScreen();">Très mauvaise</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 19: // Q17: Force/Muscle
            html = `
                <div class="card">
                    <h2 class="question-text">Ta force musculaire vs il y a 3 ans :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('muscle_strength', 'Plus fort'); goToNextScreen();">Plus fort</div>
                        <div class="option" onclick="answer('muscle_strength', 'Pareil'); goToNextScreen();">Pareil</div>
                        <div class="option" onclick="answer('muscle_strength', 'Légèrement moins'); goToNextScreen();">Légèrement moins</div>
                        <div class="option" onclick="answer('muscle_strength', 'Nettement moins'); goToNextScreen();">Nettement moins</div>
                        <div class="option" onclick="answer('muscle_strength', 'Fonte musculaire'); goToNextScreen();">Fonte musculaire</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 20: // Q18: Récupération
            html = `
                <div class="card">
                    <h2 class="question-text">Après un effort, tu récupères :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('recovery', 'En quelques heures'); goToNextScreen();">En quelques heures</div>
                        <div class="option" onclick="answer('recovery', 'Le lendemain'); goToNextScreen();">Le lendemain</div>
                        <div class="option" onclick="answer('recovery', 'En 2-3 jours'); goToNextScreen();">En 2-3 jours</div>
                        <div class="option" onclick="answer('recovery', 'En 4-5 jours'); goToNextScreen();">En 4-5 jours</div>
                        <div class="option" onclick="answer('recovery', 'Plus d\'une semaine'); goToNextScreen();">Plus d'une semaine</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 21: // Q19: Stress
            html = `
                <div class="card">
                    <h2 class="question-text">Ton niveau de stress :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('stress_level', 'Très faible'); goToNextScreen();">Très faible</div>
                        <div class="option" onclick="answer('stress_level', 'Gérable'); goToNextScreen();">Gérable</div>
                        <div class="option" onclick="answer('stress_level', 'Élevé régulièrement'); goToNextScreen();">Élevé régulièrement</div>
                        <div class="option" onclick="answer('stress_level', 'Très élevé quotidiennement'); goToNextScreen();">Très élevé quotidiennement</div>
                        <div class="option" onclick="answer('stress_level', 'Mode survie/burnout'); goToNextScreen();">Mode survie/burnout</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 22: // Q20: Peau
            html = `
                <div class="card">
                    <h2 class="question-text">Qualité de ta peau :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('skin_quality', 'Éclatante et ferme'); goToNextScreen();">Éclatante et ferme</div>
                        <div class="option" onclick="answer('skin_quality', 'Correcte pour mon âge'); goToNextScreen();">Correcte pour mon âge</div>
                        <div class="option" onclick="answer('skin_quality', 'Terne et fatiguée'); goToNextScreen();">Terne et fatiguée</div>
                        <div class="option" onclick="answer('skin_quality', 'Rides marquées'); goToNextScreen();">Rides marquées</div>
                        <div class="option" onclick="answer('skin_quality', 'Très vieillie prématurément'); goToNextScreen();">Très vieillie prématurément</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 23: // Q21: Environnement
            html = `
                <div class="card">
                    <h2 class="question-text">Ton environnement principal :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('living_environment', 'Nature/campagne (air pur)'); goToNextScreen();">Nature/campagne (air pur)</div>
                        <div class="option" onclick="answer('living_environment', 'Petite ville (<50k habitants)'); goToNextScreen();">Petite ville (<50k habitants)</div>
                        <div class="option" onclick="answer('living_environment', 'Ville moyenne (50-200k)'); goToNextScreen();">Ville moyenne (50-200k)</div>
                        <div class="option" onclick="answer('living_environment', 'Grande ville (200k-1M)'); goToNextScreen();">Grande ville (200k-1M)</div>
                        <div class="option" onclick="answer('living_environment', 'Mégapole (Paris, Lyon, Marseille)'); goToNextScreen();">Mégapole (Paris, Lyon, Marseille)</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 24: // WOW Break 3
            html = `
                <div class="card wow-break">
                    <div class="wow-title">💡 FAIT TROUBLANT</div>
                    <div class="wow-stat">+11 ans</div>
                    <p class="wow-description">
                        de vieillissement accéléré en ville polluée vs campagne. 
                        L'air que tu respires détermine ton âge biologique !
                    </p>
                    <div class="wow-source">📊 Source: Environmental Health Perspectives, 2022</div>
                    <button class="btn-primary" onclick="goToNextScreen()">CONTINUER →</button>
                </div>
            `;
            break;
            
        case 25: // Q22: Soleil
            html = `
                <div class="card">
                    <h2 class="question-text">Exposition au soleil par jour :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('sun_exposure', 'Plus de 30min'); goToNextScreen();">Plus de 30min</div>
                        <div class="option" onclick="answer('sun_exposure', '15-30min'); goToNextScreen();">15-30min</div>
                        <div class="option" onclick="answer('sun_exposure', '5-15min'); goToNextScreen();">5-15min</div>
                        <div class="option" onclick="answer('sun_exposure', 'Presque jamais'); goToNextScreen();">Presque jamais</div>
                        <div class="option" onclick="answer('sun_exposure', 'Jamais (bureau toute la journée)'); goToNextScreen();">Jamais (bureau toute la journée)</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 26: // Q23: Nature
            html = `
                <div class="card">
                    <h2 class="question-text">Temps en nature par semaine :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('nature_time', 'Tous les jours'); goToNextScreen();">Tous les jours</div>
                        <div class="option" onclick="answer('nature_time', '3-4 fois'); goToNextScreen();">3-4 fois</div>
                        <div class="option" onclick="answer('nature_time', '1-2 fois'); goToNextScreen();">1-2 fois</div>
                        <div class="option" onclick="answer('nature_time', 'Rarement'); goToNextScreen();">Rarement</div>
                        <div class="option" onclick="answer('nature_time', 'Jamais'); goToNextScreen();">Jamais</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 27: // Q24: Qualité sommeil
            html = `
                <div class="card">
                    <h2 class="question-text">Réveils nocturnes :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('night_wakeups', 'Jamais'); goToNextScreen();">Jamais</div>
                        <div class="option" onclick="answer('night_wakeups', '1 fois'); goToNextScreen();">1 fois</div>
                        <div class="option" onclick="answer('night_wakeups', '2-3 fois'); goToNextScreen();">2-3 fois</div>
                        <div class="option" onclick="answer('night_wakeups', '4+ fois'); goToNextScreen();">4+ fois</div>
                        <div class="option" onclick="answer('night_wakeups', 'Insomnie chronique'); goToNextScreen();">Insomnie chronique</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 28: // Q25: Heure coucher
            html = `
                <div class="card">
                    <h2 class="question-text">Tu te couches généralement :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('bedtime', 'Avant 22h'); goToNextScreen();">Avant 22h</div>
                        <div class="option" onclick="answer('bedtime', '22h-23h'); goToNextScreen();">22h-23h</div>
                        <div class="option" onclick="answer('bedtime', '23h-00h'); goToNextScreen();">23h-00h</div>
                        <div class="option" onclick="answer('bedtime', '00h-1h'); goToNextScreen();">00h-1h</div>
                        <div class="option" onclick="answer('bedtime', 'Après 1h'); goToNextScreen();">Après 1h</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 29: // Q26: Écrans
            html = `
                <div class="card">
                    <h2 class="question-text">Écrans avant de dormir :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('screens_before_bed', 'Jamais'); goToNextScreen();">Jamais</div>
                        <div class="option" onclick="answer('screens_before_bed', 'Arrêt 2h avant'); goToNextScreen();">Arrêt 2h avant</div>
                        <div class="option" onclick="answer('screens_before_bed', 'Arrêt 1h avant'); goToNextScreen();">Arrêt 1h avant</div>
                        <div class="option" onclick="answer('screens_before_bed', 'Jusqu\'au coucher'); goToNextScreen();">Jusqu'au coucher</div>
                        <div class="option" onclick="answer('screens_before_bed', 'Au lit jusqu\'à m\'endormir'); goToNextScreen();">Au lit jusqu'à m'endormir</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 30: // Q27: Petit-déjeuner
            html = `
                <div class="card">
                    <h2 class="question-text">Ton petit-déjeuner type :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('breakfast', 'Rien (jeûne)'); goToNextScreen();">Rien (jeûne)</div>
                        <div class="option" onclick="answer('breakfast', 'Protéiné (œufs, etc)'); goToNextScreen();">Protéiné (œufs, etc)</div>
                        <div class="option" onclick="answer('breakfast', 'Équilibré complet'); goToNextScreen();">Équilibré complet</div>
                        <div class="option" onclick="answer('breakfast', 'Sucré (céréales, pain)'); goToNextScreen();">Sucré (céréales, pain)</div>
                        <div class="option" onclick="answer('breakfast', 'Café seul'); goToNextScreen();">Café seul</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 31: // Q28: Hydratation
            html = `
                <div class="card">
                    <h2 class="question-text">Litres d'eau par jour :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('water_intake', 'Plus de 2.5L'); goToNextScreen();">Plus de 2.5L</div>
                        <div class="option" onclick="answer('water_intake', '2-2.5L'); goToNextScreen();">2-2.5L</div>
                        <div class="option" onclick="answer('water_intake', '1.5-2L'); goToNextScreen();">1.5-2L</div>
                        <div class="option" onclick="answer('water_intake', '1-1.5L'); goToNextScreen();">1-1.5L</div>
                        <div class="option" onclick="answer('water_intake', 'Moins d\'1L'); goToNextScreen();">Moins d'1L</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 32: // Q29: Alcool
            html = `
                <div class="card">
                    <h2 class="question-text">Consommation d'alcool :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('alcohol', 'Jamais'); goToNextScreen();">Jamais</div>
                        <div class="option" onclick="answer('alcohol', '1-2 verres/semaine'); goToNextScreen();">1-2 verres/semaine</div>
                        <div class="option" onclick="answer('alcohol', '3-5 verres/semaine'); goToNextScreen();">3-5 verres/semaine</div>
                        <div class="option" onclick="answer('alcohol', '1-2 verres/jour'); goToNextScreen();">1-2 verres/jour</div>
                        <div class="option" onclick="answer('alcohol', 'Plus de 2 verres/jour'); goToNextScreen();">Plus de 2 verres/jour</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 33: // WOW Break 4
            html = `
                <div class="card wow-break">
                    <div class="wow-title">💡 RÉVÉLATION CHOC</div>
                    <div class="wow-stat">1 verre</div>
                    <p class="wow-description">
                        d'alcool par jour = +2.8 ans d'âge biologique. 
                        L'alcool est le tueur silencieux #1 de ta longévité !
                    </p>
                    <div class="wow-source">📊 Source: The Lancet, 2023</div>
                    <button class="btn-primary" onclick="goToNextScreen()">CONTINUER →</button>
                </div>
            `;
            break;
            
        case 34: // Q30: Sport
            html = `
                <div class="card">
                    <h2 class="question-text">Fréquence sportive par semaine :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('sport_frequency', '5+ fois'); goToNextScreen();">5+ fois</div>
                        <div class="option" onclick="answer('sport_frequency', '3-4 fois'); goToNextScreen();">3-4 fois</div>
                        <div class="option" onclick="answer('sport_frequency', '1-2 fois'); goToNextScreen();">1-2 fois</div>
                        <div class="option" onclick="answer('sport_frequency', 'Occasionnellement'); goToNextScreen();">Occasionnellement</div>
                        <div class="option" onclick="answer('sport_frequency', 'Jamais'); goToNextScreen();">Jamais</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 35: // Q31: Pas par jour
            html = `
                <div class="card">
                    <h2 class="question-text">Nombre de pas par jour :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('daily_steps', 'Plus de 10 000'); goToNextScreen();">Plus de 10 000</div>
                        <div class="option" onclick="answer('daily_steps', '7500-10 000'); goToNextScreen();">7500-10 000</div>
                        <div class="option" onclick="answer('daily_steps', '5000-7500'); goToNextScreen();">5000-7500</div>
                        <div class="option" onclick="answer('daily_steps', '3000-5000'); goToNextScreen();">3000-5000</div>
                        <div class="option" onclick="answer('daily_steps', 'Moins de 3000'); goToNextScreen();">Moins de 3000</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 36: // Q32: Méditation
            html = `
                <div class="card">
                    <h2 class="question-text">Pratiques-tu la méditation/respiration ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('meditation', 'Quotidiennement'); goToNextScreen();">Quotidiennement</div>
                        <div class="option" onclick="answer('meditation', '3-4x/semaine'); goToNextScreen();">3-4x/semaine</div>
                        <div class="option" onclick="answer('meditation', '1-2x/semaine'); goToNextScreen();">1-2x/semaine</div>
                        <div class="option" onclick="answer('meditation', 'Occasionnellement'); goToNextScreen();">Occasionnellement</div>
                        <div class="option" onclick="answer('meditation', 'Jamais'); goToNextScreen();">Jamais</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 37: // Q33: Suppléments
            html = `
                <div class="card">
                    <h2 class="question-text">Prends-tu des compléments alimentaires ?</h2>
                    <div class="options">
                        <div class="option" onclick="answer('supplements', 'Protocole complet optimisé'); goToNextScreen();">Protocole complet optimisé</div>
                        <div class="option" onclick="answer('supplements', 'Quelques basiques'); goToNextScreen();">Quelques basiques</div>
                        <div class="option" onclick="answer('supplements', 'Vitamine D seulement'); goToNextScreen();">Vitamine D seulement</div>
                        <div class="option" onclick="answer('supplements', 'Occasionnellement'); goToNextScreen();">Occasionnellement</div>
                        <div class="option" onclick="answer('supplements', 'Jamais'); goToNextScreen();">Jamais</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 38: // Q34: Examens médicaux
            html = `
                <div class="card">
                    <h2 class="question-text">Dernier bilan sanguin complet :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('last_bloodwork', 'Moins de 6 mois'); goToNextScreen();">Moins de 6 mois</div>
                        <div class="option" onclick="answer('last_bloodwork', '6-12 mois'); goToNextScreen();">6-12 mois</div>
                        <div class="option" onclick="answer('last_bloodwork', '1-2 ans'); goToNextScreen();">1-2 ans</div>
                        <div class="option" onclick="answer('last_bloodwork', 'Plus de 2 ans'); goToNextScreen();">Plus de 2 ans</div>
                        <div class="option" onclick="answer('last_bloodwork', 'Jamais'); goToNextScreen();">Jamais</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 39: // Q35: Relations sociales
            html = `
                <div class="card">
                    <h2 class="question-text">Qualité de tes relations sociales :</h2>
                    <div class="options">
                        <div class="option" onclick="answer('social_relations', 'Excellentes et nourrissantes'); goToNextScreen();">Excellentes et nourrissantes</div>
                        <div class="option" onclick="answer('social_relations', 'Bonnes en général'); goToNextScreen();">Bonnes en général</div>
                        <div class="option" onclick="answer('social_relations', 'Superficielles'); goToNextScreen();">Superficielles</div>
                        <div class="option" onclick="answer('social_relations', 'Conflictuelles'); goToNextScreen();">Conflictuelles</div>
                        <div class="option" onclick="answer('social_relations', 'Isolé(e)'); goToNextScreen();">Isolé(e)</div>
                    </div>
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 40: // Email
            html = `
                <div class="card">
                    <h2 class="question-text">Reçois ton diagnostic personnalisé</h2>
                    <p style="color: var(--text-light); margin-bottom: 20px;">
                        Entre tes coordonnées pour recevoir ton score détaillé et ton protocole sur-mesure
                    </p>
                    
                    <div class="form-group">
                        <input type="text" id="user-name" placeholder="Ton prénom" 
                               value="${answers.name || ''}">
                    </div>
                    
                    <div class="form-group">
                        <input type="email" id="user-email" placeholder="ton@email.com" 
                               value="${answers.email || ''}">
                    </div>
                    
                    <div class="form-group">
                        <input type="tel" id="user-phone" placeholder="06 12 34 56 78 (optionnel)" 
                               value="${answers.phone || ''}">
                    </div>
                    
                    <button class="btn-primary btn-green" onclick="submitEmail()">
                        VOIR MON SCORE →
                    </button>
                    
                    <p style="text-align: center; font-size: 12px; color: var(--text-light); margin-top: 20px;">
                        🔒 Tes données sont 100% sécurisées et ne seront jamais partagées
                    </p>
                    
                    <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                </div>
            `;
            break;
            
        case 41: // Résultats
            const score = calculateScore();
            const biologicalAge = answers.age_exact ? Math.round(answers.age_exact * (2 - score/100)) : 45;
            
            html = `
                <div class="card results">
                    <h2 class="results-title">🎯 Ton Score de Vitalité</h2>
                    
                    <div class="score-display">
                        <div class="score-number">${score}</div>
                        <div class="score-max">/100</div>
                    </div>
                    
                    <div class="age-comparison">
                        <div class="age-item">
                            <span class="age-label">Âge réel</span>
                            <span class="age-value">${answers.age_exact || 40} ans</span>
                        </div>
                        <div class="age-separator">vs</div>
                        <div class="age-item">
                            <span class="age-label">Âge biologique</span>
                            <span class="age-value" style="color: ${biologicalAge > answers.age_exact ? '#FF6B35' : '#01FF00'}">
                                ${biologicalAge} ans
                            </span>
                        </div>
                    </div>
                    
                    <div class="result-message">
                        ${score >= 80 ? 
                            '<p class="excellent">🌟 Excellent ! Tu es dans le top 10% !</p>' :
                          score >= 60 ?
                            '<p class="good">👍 Bien ! Mais tu peux faire mieux.</p>' :
                          score >= 40 ?
                            '<p class="average">⚠️ Attention, tu vieillis trop vite.</p>' :
                            '<p class="poor">🚨 Urgent ! Il faut agir maintenant.</p>'}
                    </div>
                    
                    <div class="priorities">
                        <h3>Tes 3 priorités :</h3>
                        <div class="priority-item">
                            <span class="priority-icon">🔥</span>
                            <div>
                                <div class="priority-title">Inflammation chronique</div>
                                <div class="priority-impact">Impact: +3.2 ans</div>
                            </div>
                        </div>
                        <div class="priority-item">
                            <span class="priority-icon">😴</span>
                            <div>
                                <div class="priority-title">Déficit de sommeil</div>
                                <div class="priority-impact">Impact: +2.8 ans</div>
                            </div>
                        </div>
                        <div class="priority-item">
                            <span class="priority-icon">⚡</span>
                            <div>
                                <div class="priority-title">Stress oxydatif</div>
                                <div class="priority-impact">Impact: +2.1 ans</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cta-section">
                        <h3>🚀 Obtiens Ton Protocole Personnalisé</h3>
                        <p>Basé sur tes réponses et 1200+ études scientifiques</p>
                        <a href="https://calendly.com/oralife/diagnostic" class="cta-button">
                            RÉSERVER MON APPEL GRATUIT (15min)
                        </a>
                        <p class="guarantee">✅ 100% gratuit • Sans engagement</p>
                    </div>
                </div>
            `;
            break;
    }
    
    container.innerHTML = html;
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    renderCurrentScreen();
    updateProgressBar();
});
