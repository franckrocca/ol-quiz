// ORA LIFE Quiz - Version basée sur index9.html
(function() {
    'use strict';
    
    // Configuration
    const TOTAL_QUESTIONS = 42;
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjyAjH9Nl6y2IeRWHi5Qrr6ftqVilH4T9RMPAdNXM_XYVuaN0WFzrPPYwVL8oOZR0W/exec';
    
    // État global  
    let currentScreen = 0;
    let answers = {};
    let multiSelectAnswers = {};
    
    // Initialisation
    function init() {
        renderScreen();
        updateProgressBar();
    }
    
    // Rendu des écrans
    function renderScreen() {
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
                
            case 1: // Genre
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
                
            case 2: // Âge
                html = `
                    <div class="card">
                        <h2 class="question-text">Ton âge exact ?</h2>
                        <input type="number" id="age-input" placeholder="42" min="18" max="100">
                        <button class="btn-primary" onclick="saveAge()">CONTINUER →</button>
                        <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                    </div>
                `;
                break;
                
            case 3: // Poids et taille
                html = `
                    <div class="card">
                        <h2 class="question-text">Ton poids et ta taille ?</h2>
                        <div class="dual-inputs">
                            <div class="input-group">
                                <label>Poids (kg)</label>
                                <input type="number" id="weight-input" placeholder="75" min="30" max="200" onchange="calculateIMC()">
                            </div>
                            <div class="input-group">
                                <label>Taille (cm)</label>
                                <input type="number" id="height-input" placeholder="175" min="120" max="230" onchange="calculateIMC()">
                            </div>
                        </div>
                        <div id="imc-display" class="imc-display" style="display:none;">
                            <div class="imc-value" id="imc-value">--</div>
                            <div class="imc-label" id="imc-label">IMC</div>
                            <div class="imc-scale">
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
                
            case 4: // Objectifs (multi-select)
                html = `
                    <div class="card">
                        <h2 class="question-text">Tes objectifs principaux ?</h2>
                        <p style="color: var(--text-light); margin-bottom: 20px;">Choisis jusqu'à 3 options</p>
                        <div class="options">
                            <div class="option" onclick="toggleMultiSelect('objectives', 'Énergie illimitée', this, 3)">Énergie illimitée toute la journée</div>
                            <div class="option" onclick="toggleMultiSelect('objectives', 'Sommeil réparateur', this, 3)">Sommeil réparateur profond</div>
                            <div class="option" onclick="toggleMultiSelect('objectives', 'Mental sharp', this, 3)">Mental sharp & focus laser</div>
                            <div class="option" onclick="toggleMultiSelect('objectives', 'Perte de poids', this, 3)">Perte de poids durable</div>
                            <div class="option" onclick="toggleMultiSelect('objectives', 'Longévité', this, 3)">Longévité & anti-âge</div>
                            <div class="option" onclick="toggleMultiSelect('objectives', 'Performance sportive', this, 3)">Performance sportive</div>
                            <div class="option" onclick="toggleMultiSelect('objectives', 'Équilibre hormonal', this, 3)">Équilibre hormonal</div>
                        </div>
                        <button class="btn-primary" onclick="if(validateMultiSelect('objectives')) goToNextScreen();">CONTINUER →</button>
                        <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                    </div>
                `;
                break;
                
            // Continuer avec les autres questions...
            // Je vais ajouter les WOW breaks aux bons endroits
            
            case 10: // WOW Break 1 - La Chaise qui Tue
                html = `
                    <div class="card wow-break">
                        <div class="wow-icon">💀</div>
                        <h2 class="wow-title">LA CHAISE QUI TUE</h2>
                        <div class="wow-stat">+52%</div>
                        <p class="wow-description">
                            <strong>de mortalité si tu restes assis >10h/jour</strong><br><br>
                            MÊME avec du sport régulier !<br>
                            Sans sport : +52% de mortalité
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
                
            case 24: // WOW Break 3 - Génétique 7%
                html = `
                    <div class="card wow-break">
                        <div class="wow-icon">🧬</div>
                        <h2 class="wow-title">TU CONTRÔLES TON DESTIN</h2>
                        <div class="wow-stat">7%</div>
                        <p class="wow-description">
                            <strong>C'est TOUT ce que représente la génétique dans ta longévité</strong><br><br>
                            Étude sur 400 millions de profils généalogiques :<br>
                            L'héritabilité réelle de la durée de vie est minime.<br>
                            <em>Tu es le maître de ton destin biologique.</em>
                        </p>
                        <div class="wow-source">📊 Ruby et al., Genetics, 2018 - PMC6661543</div>
                        <button class="btn-primary" onclick="goToNextScreen()">CONTINUER →</button>
                    </div>
                `;
                break;
                
            case 41: // Email form
                html = `
                    <div class="card">
                        <h2 class="question-text">Dernière étape !</h2>
                        <p style="color: var(--text-light); margin-bottom: 30px;">
                            Reçois ton diagnostic personnalisé par email
                        </p>
                        <input type="text" id="name-input" placeholder="Ton prénom">
                        <input type="email" id="email-input" placeholder="ton@email.com">
                        <input type="tel" id="phone-input" placeholder="06 12 34 56 78 (optionnel)">
                        
                        <div style="margin: 20px 0;">
                            <label style="display: flex; align-items: flex-start; gap: 10px;">
                                <input type="checkbox" id="consent" checked style="margin-top: 5px;">
                                <span style="font-size: 13px; color: var(--text-light);">
                                    J'accepte de recevoir mon score détaillé par email et les conseils OraLife
                                    <br><small style="opacity: 0.8;">Désinscription 1 clic • Jamais de spam • RGPD</small>
                                </span>
                            </label>
                        </div>
                        
                        <button class="btn-primary btn-green" onclick="submitEmail()">VOIR MON SCORE →</button>
                        <p style="text-align: center; font-size: 12px; color: var(--text-light); margin-top: 20px;">
                            🔒 Données 100% sécurisées
                        </p>
                        <button class="btn-back" onclick="goToPrevScreen()">← Retour</button>
                    </div>
                `;
                break;
                
            case 42: // Calculating
                html = `
                    <div class="card" style="text-align: center;">
                        <h2 style="color: var(--primary-blue); margin-bottom: 30px;">
                            Analyse de tes réponses en cours...
                        </h2>
                        <div class="score-circle">
                            <svg width="180" height="180">
                                <circle cx="90" cy="90" r="80" fill="none" stroke="#E0E0E0" stroke-width="10"/>
                                <circle cx="90" cy="90" r="80" fill="none" stroke="url(#gradient)" 
                                        stroke-width="10" stroke-dasharray="502" stroke-dashoffset="502"
                                        transform="rotate(-90 90 90)" style="animation: fillCircle 3s ease-in-out forwards;"/>
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
                // Lancer le calcul après affichage
                setTimeout(calculateAndShowResults, 3000);
                break;
                
            case 43: // Results
                html = renderResults();
                break;
                
            default:
                // Autres questions standards
                html = renderStandardQuestion();
        }
        
        container.innerHTML = html;
    }
    
    // Fonctions helpers
    function answer(key, value) {
        answers[key] = value;
    }
    
    function saveAge() {
        const age = document.getElementById('age-input').value;
        if (age && age >= 18 && age <= 100) {
            answers.age = age;
            goToNextScreen();
        } else {
            alert('Merci d\'entrer un âge valide (18-100)');
        }
    }
    
    function saveWeightHeight() {
        const weight = document.getElementById('weight-input').value;
        const height = document.getElementById('height-input').value;
        if (weight && height) {
            answers.weight = weight;
            answers.height = height;
            goToNextScreen();
        } else {
            alert('Merci de remplir ton poids et ta taille');
        }
    }
    
    function calculateIMC() {
        const weight = parseFloat(document.getElementById('weight-input').value);
        const height = parseFloat(document.getElementById('height-input').value);
        
        if (weight && height) {
            const heightM = height / 100;
            const imc = weight / (heightM * heightM);
            
            document.getElementById('imc-display').style.display = 'block';
            document.getElementById('imc-value').textContent = imc.toFixed(1);
            
            let label = '';
            if (imc < 18.5) label = 'Maigreur';
            else if (imc < 25) label = 'Normal';
            else if (imc < 30) label = 'Surpoids';
            else label = 'Obésité';
            
            document.getElementById('imc-label').textContent = 'IMC : ' + label;
        }
    }
    
    function toggleMultiSelect(key, value, element, max) {
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
    }
    
    function validateMultiSelect(key) {
        if (multiSelectAnswers[key] && multiSelectAnswers[key].length > 0) {
            answers[key] = multiSelectAnswers[key].join(', ');
            return true;
        }
        alert('Sélectionne au moins une option');
        return false;
    }
    
    function submitEmail() {
        const name = document.getElementById('name-input').value;
        const email = document.getElementById('email-input').value;
        const phone = document.getElementById('phone-input').value;
        const consent = document.getElementById('consent').checked;
        
        if (!name || !email) {
            alert('Merci de remplir ton prénom et email');
            return;
        }
        
        if (!consent) {
            alert('Merci d\'accepter de recevoir tes résultats');
            return;
        }
        
        answers.name = name;
        answers.email = email;
        answers.phone = phone;
        
        // Envoyer à Google Sheets
        sendToGoogleSheets();
        
        goToNextScreen();
    }
    
    function sendToGoogleSheets() {
        const formData = new FormData();
        
        // Ajouter toutes les réponses
        Object.keys(answers).forEach(key => {
            formData.append(key, answers[key]);
        });
        
        // Ajouter timestamp
        formData.append('timestamp', new Date().toISOString());
        
        // Envoyer
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData
        }).catch(error => console.error('Erreur envoi:', error));
    }
    
    function calculateAndShowResults() {
        // Appel API pour calculer le score
        fetch('/api/calculate-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers: answers })
        })
        .then(response => response.json())
        .then(data => {
            answers.score = data.score;
            answers.biologicalAge = data.biologicalAge;
            answers.priorities = data.priorities;
            currentScreen = 43;
            renderScreen();
        })
        .catch(error => {
            // Fallback calcul local
            const score = calculateLocalScore();
            answers.score = score;
            answers.biologicalAge = parseInt(answers.age) + Math.round((100 - score) / 10) - 5;
            currentScreen = 43;
            renderScreen();
        });
    }
    
    function calculateLocalScore() {
        // Calcul simplifié local
        let score = 50; // Base
        
        // Ajustements basés sur les réponses
        if (answers.sport_frequency === '5+ fois') score += 15;
        else if (answers.sport_frequency === '3-4 fois') score += 10;
        else if (answers.sport_frequency === 'Jamais') score -= 15;
        
        if (answers.sleep_quality === 'Excellente') score += 10;
        else if (answers.sleep_quality === 'Très mauvaise') score -= 10;
        
        if (answers.alcohol === '0 (jamais)') score += 10;
        else if (answers.alcohol === '15+ verres') score -= 15;
        
        return Math.max(0, Math.min(100, score));
    }
    
    function renderResults() {
        const score = answers.score || 65;
        const bioAge = answers.biologicalAge || parseInt(answers.age);
        const ageDiff = bioAge - parseInt(answers.age);
        
        return `
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
                        ${answers.age} ans (réel)
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
    }
    
    function goToNextScreen() {
        currentScreen++;
        renderScreen();
        updateProgressBar();
    }
    
    function goToPrevScreen() {
        if (currentScreen > 0) {
            currentScreen--;
            renderScreen();
            updateProgressBar();
        }
    }
    
    function updateProgressBar() {
        const progress = (currentScreen / 43) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
        
        // Update progress text
        if (currentScreen === 0) {
            document.getElementById('progress-text').textContent = 'Prêt à commencer';
        } else if (currentScreen <= 14) {
            document.getElementById('progress-text').textContent = `Question ${currentScreen} sur 42`;
        } else if (currentScreen <= 28) {
            document.getElementById('progress-text').textContent = 'Analyse de tes habitudes...';
            document.getElementById('check1').classList.add('active');
        } else if (currentScreen <= 41) {
            document.getElementById('progress-text').textContent = 'Presque terminé...';
            document.getElementById('check2').classList.add('active');
        } else {
            document.getElementById('progress-text').textContent = 'Calcul de ton score...';
            document.getElementById('check3').classList.add('active');
        }
    }
    
    // Rendre les fonctions globales
    window.answer = answer;
    window.saveAge = saveAge;
    window.saveWeightHeight = saveWeightHeight;
    window.calculateIMC = calculateIMC;
    window.toggleMultiSelect = toggleMultiSelect;
    window.validateMultiSelect = validateMultiSelect;
    window.submitEmail = submitEmail;
    window.goToNextScreen = goToNextScreen;
    window.goToPrevScreen = goToPrevScreen;
    
    // Initialisation au chargement
    document.addEventListener('DOMContentLoaded', init);
})();
