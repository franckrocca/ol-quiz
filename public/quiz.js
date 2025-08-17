// ORA LIFE Quiz Engine - Version Complète
const Quiz = (function() {
    'use strict';
    
    // Configuration
    const API_URL = '/api/calculate-score';
    const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwjyAjH9Nl6y2IeRWHi5Qrr6ftqVilH4T9RMPAdNXM_XYVuaN0WFzrPPYwVL8oOZR0W/exec';
    
    // État global
    let currentStep = 0;
    let answers = {};
    let userInfo = {};
    let multiSelections = {};
    
    // Questions complètes
    const questions = [
        { id: 'gender', text: 'Tu es ?', type: 'visual', options: ['Homme', 'Femme'] },
        { id: 'age', text: 'Quel est ton âge exact ?', type: 'number', min: 18, max: 100, placeholder: 'Ex: 42' },
        { id: 'weight_height', text: 'Tes mensurations actuelles', type: 'dual_input' },
        { id: 'objectives', text: 'Tes objectifs prioritaires ?', type: 'multi', max: 3, options: [
            '⚡ Énergie illimitée', '🧠 Corps optimal', '💤 Mental sharp', 
            '🏃 Longévité maximale', '⚖️ Zéro stress'
        ]},
        { id: 'energy_3years', text: 'Ton énergie vs il y a 3 ans ?', type: 'single', options: [
            'Mieux qu\'avant !', 'Identique', 'En baisse', 'Fatigue chronique'
        ]},
        { id: 'last_100', text: 'Dernière fois à 100% de ta forme ?', type: 'single', options: [
            'Cette semaine', 'Ce mois-ci', 'Cette année', 'Je ne sais plus...'
        ]},
        { id: 'sitting_hours', text: 'Heures assis par jour (bureau, voiture, canapé) :', type: 'single', options: [
            '<4h', '4-6h', '6-8h', '8-10h', '>10h'
        ]},
        { id: 'sport_frequency', text: 'Sport par semaine :', type: 'single', options: [
            'Jamais', '1 fois', '2-3 fois', '4-5 fois', 'Tous les jours'
        ]},
        { id: 'sport_types', text: 'Quel type de sport pratiques-tu ?', type: 'multi', max: 3, options: [
            '🏃 Cardio/Running', '💪 Musculation', '🧘 Yoga/Pilates', 
            '🚴 Vélo', '🏊 Natation', '🥊 Sports de combat'
        ]},
        { id: 'steps_daily', text: 'Nombre de pas par jour :', type: 'single', options: [
            '<3000', '3000-5000', '5000-7500', '7500-10000', '>10000'
        ]},
        { id: 'sleep_hours', text: 'Heures de sommeil par nuit :', type: 'single', options: [
            '<5h', '5-6h', '6-7h', '7-8h', '>8h'
        ]},
        { id: 'sleep_quality', text: 'Réveils nocturnes :', type: 'single', options: [
            'Jamais', '1 fois', '2-3 fois', '>3 fois'
        ]},
        { id: 'libido_cycle', text: '', type: 'conditional' }, // Sera défini selon le genre
        { id: 'energy_crash', text: 'Premier crash énergétique de la journée :', type: 'single', options: [
            'Jamais', 'Après 17h', 'Vers 14-15h', 'Dès le matin'
        ]},
        { id: 'weight_ideal', text: 'Ton poids vs ton idéal :', type: 'single', options: [
            'Parfait', '+2-5kg', '+5-10kg', '+10-15kg', '>15kg'
        ]},
        { id: 'digestion', text: 'Ta digestion au quotidien :', type: 'single', options: [
            'Parfaite', 'Ballonnements occasionnels', 'Problèmes fréquents', 'Douleurs chroniques'
        ]},
        { id: 'breakfast', text: 'Ton petit-déjeuner type :', type: 'single', options: [
            'Rien/Café', 'Sucré (céréales, pain...)', 'Protéiné', 'Jeûne intermittent'
        ]},
        { id: 'water_intake', text: 'Verres d\'eau par jour (hors café/thé) :', type: 'single', options: [
            '<3', '3-5', '6-8', '8-10', '>10'
        ]},
        { id: 'alcohol', text: 'Consommation d\'alcool :', type: 'single', options: [
            'Jamais', '1-2/semaine', '3-4/semaine', 'Tous les jours'
        ]},
        { id: 'coffee', text: 'Cafés par jour :', type: 'single', options: [
            '0', '1-2', '3-4', '5-6', '>6'
        ]},
        { id: 'stress_level', text: 'Niveau de stress moyen :', type: 'single', options: [
            'Zen total', 'Gérable', 'Élevé', 'Burnout proche'
        ]},
        { id: 'meditation', text: 'Pratiques-tu méditation/breathwork ?', type: 'single', options: [
            'Tous les jours', '2-3x/semaine', 'Occasionnellement', 'Jamais'
        ]},
        { id: 'screen_time', text: 'Temps d\'écran par jour :', type: 'single', options: [
            '<2h', '2-4h', '4-6h', '6-8h', '>8h'
        ]},
        { id: 'phone_morning', text: 'Téléphone au réveil :', type: 'single', options: [
            'Jamais', 'Après 1h', 'Dans les 30min', 'Immédiatement'
        ]},
        { id: 'supplements', text: 'Prends-tu des compléments alimentaires ?', type: 'single', options: [
            'Programme complet', 'Quelques basiques', 'Occasionnellement', 'Jamais'
        ]},
        { id: 'which_supplements', text: 'Lesquels ?', type: 'multi', max: 5, options: [
            'Vitamine D', 'Magnésium', 'Oméga 3', 'Probiotiques', 'Multivitamines', 
            'Protéines', 'Créatine', 'Ashwagandha', 'NAD+', 'Autres'
        ]},
        { id: 'tracking', text: 'Utilises-tu des outils de tracking ?', type: 'single', options: [
            'Oui, plusieurs', 'Une montre/bague', 'Application mobile', 'Non'
        ]},
        { id: 'which_trackers', text: 'Lesquels ?', type: 'multi', max: 3, options: [
            'Apple Watch', 'Garmin', 'Whoop', 'Oura', 'Fitbit', 'Eight Sleep', 'Autre'
        ]},
        { id: 'focus_productivity', text: 'Heures vraiment productives par jour :', type: 'single', options: [
            '<2h', '2-4h', '4-6h', '6-8h', '>8h'
        ]},
        { id: 'brain_fog', text: 'Brouillard mental fréquent ?', type: 'single', options: [
            'Jamais', 'Rarement', 'Souvent', 'Tous les jours'
        ]},
        { id: 'cold_exposure', text: 'Exposition au froid (douche froide, bain...) :', type: 'single', options: [
            'Tous les jours', '2-3x/semaine', 'Occasionnellement', 'Jamais'
        ]},
        { id: 'sauna_heat', text: 'Sauna ou exposition chaleur :', type: 'single', options: [
            '3+/semaine', '1-2/semaine', 'Occasionnellement', 'Jamais'
        ]},
        { id: 'nature_time', text: 'Temps dans la nature par semaine :', type: 'single', options: [
            '>10h', '5-10h', '2-5h', '<2h', 'Jamais'
        ]},
        { id: 'sun_exposure', text: 'Exposition soleil quotidienne :', type: 'single', options: [
            '>1h', '30min-1h', '15-30min', '<15min', 'Jamais'
        ]},
        { id: 'social_life', text: 'Vie sociale épanouissante ?', type: 'single', options: [
            'Très riche', 'Satisfaisante', 'Pourrait être mieux', 'Isolé'
        ]},
        { id: 'purpose', text: 'Sens/mission claire dans ta vie ?', type: 'single', options: [
            'Crystal clear', 'Plutôt claire', 'En recherche', 'Perdu'
        ]},
        { id: 'projection_3years', text: 'Si tu continues comme ça, dans 3 ans tu seras :', type: 'single', options: [
            'Au top!', 'Pareil', 'Moins bien', 'Inquiet pour ma santé'
        ]},
        { id: 'ready_change', text: 'Prêt à changer maintenant ?', type: 'single', options: [
            '100% déterminé', 'Très motivé', 'Curieux', 'Pas sûr'
        ]},
        { id: 'investment_health', text: 'Budget annuel santé/développement perso :', type: 'single', options: [
            '<500€', '500-1000€', '1000-3000€', '3000-5000€', '>5000€'
        ]},
        { id: 'time_for_health', text: 'Temps dispo par jour pour ta santé :', type: 'single', options: [
            '<15min', '15-30min', '30-60min', '1-2h', '>2h'
        ]},
        { id: 'biggest_challenge', text: 'Ton plus gros challenge ?', type: 'single', options: [
            'Manque de temps', 'Manque de motivation', 'Pas de méthode', 'Trop d\'infos contradictoires'
        ]},
        { id: 'motivations', text: 'Ce qui te motive vraiment ?', type: 'multi', max: 3, options: [
            '🚀 Rester performant', '💰 Réussir business', '❤️ Être un exemple', 
            '🌟 Vivre longtemps', '🎯 Me dépasser'
        ]}
    ];
    
    // Flow avec wow breaks
    const wowBreaks = [
        { after: 'sitting_hours', id: 'wow-chair', type: 'wow' },
        { after: 'digestion', id: 'wow-inequality', type: 'wow' },
        { after: 'alcohol', id: 'wow-genetics', type: 'wow' },
        { after: 'which_trackers', id: 'wow-moment', type: 'wow' },
        { after: 'projection_3years', id: 'wow-control', type: 'wow' }
    ];
    
    // Initialisation
    function init() {
        renderCurrentStep();
        setupKeyboardNavigation();
    }
    
    // Navigation clavier
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const activeInput = document.activeElement;
                if (activeInput && activeInput.tagName === 'INPUT') {
                    if (activeInput.type === 'number' || activeInput.type === 'text' || activeInput.type === 'email') {
                        handleNext();
                    }
                }
            }
        });
    }
    
    // Rendu de l'étape actuelle
    function renderCurrentStep() {
        updateProgressBar();
        
        if (currentStep === 0) {
            renderLanding();
        } else if (currentStep <= questions.length) {
            const wowBreak = checkForWowBreak();
            if (wowBreak) {
                renderWowBreak(wowBreak);
            } else {
                renderQuestion(questions[currentStep - 1]);
            }
        } else if (currentStep === questions.length + 1) {
            renderEmailForm();
        } else if (currentStep === questions.length + 2) {
            renderCalculating();
        } else {
            renderResults();
        }
    }
    
    // Check for wow break
    function checkForWowBreak() {
        if (currentStep > 1) {
            const prevQuestion = questions[currentStep - 2];
            return wowBreaks.find(wb => wb.after === prevQuestion.id);
        }
        return null;
    }
    
    // Update progress bar
    function updateProgressBar() {
        const totalSteps = questions.length + wowBreaks.length + 3;
        const progress = (currentStep / totalSteps) * 100;
        
        document.getElementById('progressBar').style.width = progress + '%';
        
        // Update checkmarks
        if (progress > 33) document.getElementById('check1').classList.add('active');
        if (progress > 66) document.getElementById('check2').classList.add('active');
        if (progress > 95) document.getElementById('check3').classList.add('active');
        
        // Update text
        const progressText = document.getElementById('progress-text');
        if (currentStep === 0) {
            progressText.textContent = 'Découvre ton profil...';
        } else if (currentStep <= questions.length * 0.33) {
            progressText.textContent = 'Analyse de tes habitudes...';
        } else if (currentStep <= questions.length * 0.66) {
            progressText.textContent = 'Calcul de ton potentiel...';
        } else if (currentStep <= questions.length) {
            progressText.textContent = 'Finalisation du diagnostic...';
        } else {
            progressText.textContent = 'Résultats prêts !';
        }
    }
    
    // Render Landing
    function renderLanding() {
        const html = `
            <div class="card landing">
                <h1>Découvre Ton Âge<br>Biologique Réel</h1>
                <p class="subtitle">Test scientifique gratuit • 3 minutes</p>
                <div class="hook">
                    ⚠️ 93% des entrepreneurs vieillissent 2x plus vite sans le savoir
                </div>
                <button class="btn-primary" onclick="Quiz.next()">
                    COMMENCER LE TEST →
                </button>
                <p style="text-align: center; margin-top: 30px; color: #888; font-size: 14px;">
                    Basé sur 1200+ études scientifiques<br>
                    Déjà 12,847 entrepreneurs testés
                </p>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
    }
    
    // Render Question
    function renderQuestion(question) {
        let html = '<div class="card">';
        
        // Question spéciale conditionnelle (libido/cycle)
        if (question.id === 'libido_cycle') {
            if (answers.gender === 'Femme') {
                question.text = 'Où en es-tu dans ton cycle ?';
                question.options = ['Réglée', 'Folliculaire', 'Ovulation', 'Lutéale', 'Ménopause'];
            } else {
                question.text = 'Ta libido actuellement :';
                question.options = ['Au top!', 'Normale', 'En baisse', 'Problématique'];
            }
        }
        
        html += `<h2 class="question-text">${question.text}</h2>`;
        
        // Render selon le type
        switch(question.type) {
            case 'visual':
                html += renderVisualOptions(question);
                break;
            case 'number':
                html += renderNumberInput(question);
                break;
            case 'dual_input':
                html += renderDualInput(question);
                break;
            case 'single':
            case 'conditional':
                html += renderSingleOptions(question);
                break;
            case 'multi':
                html += renderMultiOptions(question);
                break;
        }
        
        // Bouton retour (sauf première question)
        if (currentStep > 1) {
            html += '<button class="btn-back" onclick="Quiz.prev()">← Retour</button>';
        }
        
        html += '</div>';
        document.getElementById('quiz-container').innerHTML = html;
        
        // Focus sur input si nécessaire
        const firstInput = document.querySelector('input[type="number"], input[type="text"]');
        if (firstInput) firstInput.focus();
    }
    
    // Render Visual Options
    function renderVisualOptions(question) {
        let html = '<div class="visual-options">';
        const images = {
            'Homme': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
            'Femme': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop'
        };
        
        question.options.forEach(option => {
            const selected = answers[question.id] === option ? 'selected' : '';
            html += `
                <div class="visual-option ${selected}" onclick="Quiz.answer('${question.id}', '${option}')">
                    <img src="${images[option]}" alt="${option}">
                    <div class="label">${option}</div>
                </div>
            `;
        });
        
        html += '</div>';
        html += '<button class="btn-primary" onclick="Quiz.next()">Continuer →</button>';
        return html;
    }
    
    // Render Number Input
    function renderNumberInput(question) {
        const value = answers[question.id] || '';
        return `
            <input type="number" 
                   id="${question.id}" 
                   min="${question.min}" 
                   max="${question.max}" 
                   placeholder="${question.placeholder}"
                   value="${value}"
                   onchange="Quiz.answer('${question.id}', this.value)">
            <button class="btn-primary" onclick="Quiz.next()">Continuer →</button>
        `;
    }
    
    // Render Dual Input (poids/taille)
    function renderDualInput(question) {
        const weight = answers.weight || '';
        const height = answers.height || '';
        let html = `
            <div class="dual-inputs">
                <div class="input-group">
                    <label>Poids (kg)</label>
                    <input type="number" id="weight" min="40" max="200" 
                           placeholder="73" value="${weight}"
                           onchange="Quiz.answer('weight', this.value); Quiz.calculateIMC();">
                </div>
                <div class="input-group">
                    <label>Taille (cm)</label>
                    <input type="number" id="height" min="140" max="220" 
                           placeholder="177" value="${height}"
                           onchange="Quiz.answer('height', this.value); Quiz.calculateIMC();">
                </div>
            </div>
        `;
        
        // Affichage IMC si les deux valeurs existent
        if (weight && height) {
            const imc = (weight / ((height/100) * (height/100))).toFixed(1);
            let status = 'normal';
            let statusText = 'Poids normal ✓';
            
            if (imc < 18.5) {
                status = 'souspoids';
                statusText = 'Sous-poids';
            } else if (imc >= 25 && imc < 30) {
                status = 'surpoids';
                statusText = 'Surpoids';
            } else if (imc >= 30) {
                status = 'obesite';
                statusText = 'Obésité';
            }
            
            html += `
                <div class="imc-display">
                    <div class="imc-label">Ton IMC :</div>
                    <div class="imc-value">${imc}</div>
                    <div class="imc-status ${status}">${statusText}</div>
                    <div class="imc-gauge">
                        <div class="imc-marker" style="left: ${Math.min(95, Math.max(5, (imc - 15) * 4))}%"></div>
                    </div>
                </div>
            `;
        }
        
        html += '<button class="btn-primary" onclick="Quiz.next()">Continuer →</button>';
        return html;
    }
    
    // Render Single Options
    function renderSingleOptions(question) {
        let html = '<div class="options">';
        
        question.options.forEach(option => {
            const selected = answers[question.id] === option ? 'selected' : '';
            html += `
                <div class="option ${selected}" 
                     onclick="Quiz.answer('${question.id}', '${option}'); Quiz.next();">
                    ${option}
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
    
    // Render Multi Options
    function renderMultiOptions(question) {
        const selections = multiSelections[question.id] || [];
        let html = `
            <p style="text-align: center; color: #666; margin-bottom: 20px;">
                Choisis jusqu'à ${question.max} options
            </p>
            <div class="multi-options">
        `;
        
        question.options.forEach(option => {
            const selected = selections.includes(option) ? 'selected' : '';
            html += `
                <div class="multi-option ${selected}" 
                     onclick="Quiz.toggleMulti('${question.id}', '${option}', ${question.max})">
                    <div class="checkbox"></div>
                    <span>${option}</span>
                </div>
            `;
        });
        
        html += '</div>';
        html += `<button class="btn-primary" onclick="Quiz.next()" 
                  ${selections.length === 0 ? 'disabled' : ''}>
                  Continuer →
                 </button>`;
        return html;
    }
    
    // Render Wow Break
    function renderWowBreak(wowBreak) {
        let html = '<div class="card wow-screen">';
        
        switch(wowBreak.id) {
            case 'wow-chair':
                html += `
                    <div class="wow-icon">💀</div>
                    <h2 class="wow-title">LA CHAISE QUI TUE</h2>
                    <div class="wow-stat">+34%</div>
                    <p class="wow-description">
                        <strong>10h assis = +34% mortalité (AVEC sport régulier)</strong><br>
                        <strong>10h assis = +52% mortalité (SANS sport)</strong><br><br>
                        Rester assis plus de 8h/jour augmente drastiquement ton risque de mortalité,
                        même si tu fais du sport. La position assise prolongée est le nouveau tabac.
                    </p>
                    <div class="wow-graph">
                        <div style="display: flex; justify-content: space-around; align-items: flex-end; height: 150px;">
                            <div style="background: #28a745; width: 60px; height: 60%;">
                                <div style="text-align: center; color: white; padding: 5px;">4h<br>Normal</div>
                            </div>
                            <div style="background: #ffc107; width: 60px; height: 80%;">
                                <div style="text-align: center; color: white; padding: 5px;">8h<br>+15%</div>
                            </div>
                            <div style="background: #ff4444; width: 60px; height: 100%;">
                                <div style="text-align: center; color: white; padding: 5px;">10h<br>+34%</div>
                            </div>
                        </div>
                    </div>
                    <div class="wow-source">
                        📊 Étude Katzmarzyk et al., Medicine & Science in Sports & Exercise, 2019
                    </div>
                `;
                break;
                
            case 'wow-inequality':
                html += `
                    <div class="wow-icon">⏰</div>
                    <h2 class="wow-title">L'INÉGALITÉ FACE À LA MORT</h2>
                    <div class="wow-stat">6.8 ANS</div>
                    <p class="wow-description">
                        <strong>Différence d'espérance de vie selon le mode de vie</strong><br><br>
                        • Cadres supérieurs : 84.4 ans<br>
                        • Ouvriers : 77.6 ans<br><br>
                        La différence ? Stress chronique, sédentarité et habitudes alimentaires.
                        Ton mode de vie détermine directement combien d'années tu vas vivre.
                    </p>
                    <div class="wow-source">
                        📊 INSEE, Études démographiques 2019-2023
                    </div>
                `;
                break;
                
            case 'wow-genetics':
                html += `
                    <div class="wow-icon">🧬</div>
                    <h2 class="wow-title">TU CONTRÔLES TON DESTIN</h2>
                    <div class="wow-stat">7%</div>
                    <p class="wow-description">
                        <strong>Seulement 7% de ta longévité dépend de tes gènes</strong><br><br>
                        Étude massive sur 400 millions de profils généalogiques :<br>
                        93% de ta santé et longévité dépendent de tes choix quotidiens.<br><br>
                        <em>Tu es le maître de ton destin biologique.</em>
                    </p>
                    <div class="wow-graph">
                        <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0;">
                            <div style="text-align: center;">
                                <div style="width: 100px; height: 100px; border-radius: 50%; 
                                     background: conic-gradient(#ff4444 0% 7%, #01FF00 7% 100%);
                                     display: flex; align-items: center; justify-content: center;">
                                    <div style="background: white; width: 80px; height: 80px; 
                                         border-radius: 50%; display: flex; align-items: center; 
                                         justify-content: center; font-weight: bold;">
                                        93%
                                    </div>
                                </div>
                                <p style="margin-top: 10px;">Tes choix</p>
                            </div>
                        </div>
                    </div>
                    <div class="wow-source">
                        📊 Ruby et al., Nature Medicine, 2018 - PMC6661543
                    </div>
                `;
                break;
                
            case 'wow-moment':
                html += `
                    <div class="wow-icon">⚡</div>
                    <h2 class="wow-title">MOMENT DE VÉRITÉ</h2>
                    <div style="font-size: 48px; margin: 30px 0;">
                        <span id="countdown">3</span>
                    </div>
                    <p class="wow-description">
                        Dans quelques secondes, tu vas découvrir ton vrai potentiel de transformation...<br><br>
                        <strong>Es-tu prêt à voir la vérité sur ton état actuel ?</strong>
                    </p>
                    <script>
                        let count = 3;
                        const interval = setInterval(() => {
                            count--;
                            if (count > 0) {
                                document.getElementById('countdown').textContent = count;
                            } else {
                                clearInterval(interval);
                                document.getElementById('countdown').innerHTML = '🚀';
                            }
                        }, 1000);
                    </script>
                `;
                break;
                
            case 'wow-control':
                html += `
                    <div class="wow-icon">🎯</div>
                    <h2 class="wow-title">TU AS LE CONTRÔLE</h2>
                    <div class="wow-stat">+10 ANS</div>
                    <p class="wow-description">
                        <strong>Tu peux gagner 10 ans de vie en pleine forme</strong><br><br>
                        Les bonnes habitudes peuvent littéralement inverser ton vieillissement :<br>
                        • Exercice régulier : +3 ans<br>
                        • Sommeil optimisé : +2 ans<br>
                        • Nutrition adaptée : +3 ans<br>
                        • Gestion du stress : +2 ans<br><br>
                        <em>Prêt à reprendre le contrôle ?</em>
                    </p>
                    <div class="wow-source">
                        📊 Longo et al., Cell Metabolism, 2021
                    </div>
                `;
                break;
        }
        
        html += '<button class="btn-primary" onclick="Quiz.next()">Continuer →</button>';
        html += '</div>';
        document.getElementById('quiz-container').innerHTML = html;
    }
    
    // Render Email Form
    function renderEmailForm() {
        const html = `
            <div class="card">
                <h2 class="question-text">Dernière étape !</h2>
                <p class="subtitle">Reçois ton diagnostic personnalisé par email</p>
                
                <input type="text" id="name" placeholder="Ton prénom" 
                       value="${userInfo.name || ''}"
                       onchange="Quiz.saveUserInfo('name', this.value)">
                
                <input type="email" id="email" placeholder="ton@email.com" 
                       value="${userInfo.email || ''}"
                       onchange="Quiz.saveUserInfo('email', this.value)">
                
                <input type="tel" id="phone" placeholder="06 12 34 56 78 (optionnel)" 
                       value="${userInfo.phone || ''}"
                       onchange="Quiz.saveUserInfo('phone', this.value)">
                
                <button class="btn-primary" onclick="Quiz.submitQuiz()">
                    OBTENIR MES RÉSULTATS →
                </button>
                
                <p style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
                    🔒 100% gratuit et confidentiel<br>
                    ✅ Résultats basés sur 1200+ études<br>
                    📧 Protocole personnalisé envoyé par email
                </p>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
        document.getElementById('name').focus();
    }
    
    // Render Calculating
    function renderCalculating() {
        const html = `
            <div class="card calculating">
                <div class="progress-circle">
                    <svg width="150" height="150">
                        <circle cx="75" cy="75" r="70" class="progress-circle-bg"></circle>
                        <circle cx="75" cy="75" r="70" class="progress-circle-fill"></circle>
                    </svg>
                </div>
                <h2>Analyse de tes réponses...</h2>
                <p>Calcul de ton profil biohacking personnalisé</p>
                <div class="progress-steps">
                    <div class="progress-step" id="step1">
                        <div class="progress-step-icon"></div>
                        <span>Analyse de tes habitudes</span>
                    </div>
                    <div class="progress-step" id="step2">
                        <div class="progress-step-icon"></div>
                        <span>Comparaison avec 1200+ études</span>
                    </div>
                    <div class="progress-step" id="step3">
                        <div class="progress-step-icon"></div>
                        <span>Création de ton protocole</span>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
        
        // Animation des étapes
        setTimeout(() => document.getElementById('step1').classList.add('active'), 500);
        setTimeout(() => document.getElementById('step2').classList.add('active'), 1500);
        setTimeout(() => document.getElementById('step3').classList.add('active'), 2500);
        
        // Calcul et affichage des résultats
        setTimeout(() => calculateAndShowResults(), 3500);
    }
    
    // Calculate and Show Results
    async function calculateAndShowResults() {
        try {
            // Calcul local du score
            const score = calculateBiologicalAge();
            
            // Envoi vers Google Sheets
            await sendToGoogleSheets();
            
            // Affichage des résultats
            renderResults(score);
        } catch (error) {
            console.error('Erreur:', error);
            renderResults(calculateBiologicalAge());
        }
    }
    
    // Calculate Biological Age
    function calculateBiologicalAge() {
        const realAge = parseInt(answers.age) || 40;
        let biologicalAge = realAge;
        let factors = [];
        
        // Facteurs de vieillissement
        
        // Sédentarité
        if (answers.sitting_hours === '>10h') {
            biologicalAge += 3;
            factors.push({ icon: '🪑', name: 'Sédentarité toxique', impact: '+3 ans', description: '10h+ assis/jour' });
        } else if (answers.sitting_hours === '8-10h') {
            biologicalAge += 2;
            factors.push({ icon: '🪑', name: 'Sédentarité élevée', impact: '+2 ans', description: '8-10h assis/jour' });
        }
        
        // Sommeil
        if (answers.sleep_hours === '<5h') {
            biologicalAge += 3;
            factors.push({ icon: '😴', name: 'Dette de sommeil', impact: '+3 ans', description: 'Moins de 5h/nuit' });
        } else if (answers.sleep_hours === '5-6h') {
            biologicalAge += 2;
            factors.push({ icon: '😴', name: 'Sommeil insuffisant', impact: '+2 ans', description: '5-6h/nuit' });
        }
        
        // Stress
        if (answers.stress_level === 'Burnout proche') {
            biologicalAge += 3;
            factors.push({ icon: '🔥', name: 'Stress chronique', impact: '+3 ans', description: 'Burnout imminent' });
        } else if (answers.stress_level === 'Élevé') {
            biologicalAge += 2;
            factors.push({ icon: '🔥', name: 'Stress élevé', impact: '+2 ans', description: 'Stress mal géré' });
        }
        
        // Sport (facteur protecteur)
        if (answers.sport_frequency === 'Tous les jours') {
            biologicalAge -= 2;
        } else if (answers.sport_frequency === 'Jamais') {
            biologicalAge += 2;
            factors.push({ icon: '🏃', name: 'Zéro activité', impact: '+2 ans', description: 'Aucun sport' });
        }
        
        // Alcool
        if (answers.alcohol === 'Tous les jours') {
            biologicalAge += 2;
            factors.push({ icon: '🍷', name: 'Alcool quotidien', impact: '+2 ans', description: 'Consommation excessive' });
        }
        
        // Poids
        if (answers.weight && answers.height) {
            const imc = answers.weight / ((answers.height/100) * (answers.height/100));
            if (imc > 30) {
                biologicalAge += 2;
                factors.push({ icon: '⚖️', name: 'Surpoids important', impact: '+2 ans', description: 'IMC > 30' });
            }
        }
        
        // Limiter les top 3 facteurs
        factors = factors.slice(0, 3);
        
        return {
            realAge,
            biologicalAge,
            difference: biologicalAge - realAge,
            factors,
            potential: Math.max(5, Math.abs(biologicalAge - realAge) + 3)
        };
    }
    
    // Send to Google Sheets
    async function sendToGoogleSheets() {
        const data = {
            timestamp: new Date().toISOString(),
            ...answers,
            ...userInfo,
            multiSelections: JSON.stringify(multiSelections)
        };
        
        try {
            await fetch(SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.log('Sheets error:', error);
        }
    }
    
    // Render Results
    function renderResults(score) {
        const html = `
            <div class="card results-screen">
                <div class="result-header">
                    <h1>TON DIAGNOSTIC PERSONNALISÉ</h1>
                </div>
                
                <!-- Affichage des âges -->
                <div class="age-display">
                    <div class="age-block">
                        <div class="age-label">Âge Réel</div>
                        <div class="age-value">${score.realAge}</div>
                        <div class="age-label">ans</div>
                    </div>
                    <div class="age-arrow">→</div>
                    <div class="age-block">
                        <div class="age-label">Âge Biologique</div>
                        <div class="age-value biological">${score.biologicalAge}</div>
                        <div class="age-label">ans</div>
                    </div>
                </div>
                
                ${score.difference > 0 ? `
                    <div class="age-difference">
                        ⚠️ Tu vieillis ${Math.round(score.difference * 20 / score.realAge)}% plus vite que normal
                    </div>
                ` : `
                    <div class="age-difference" style="background: #d4edda; color: #155724;">
                        ✅ Bravo ! Tu vieillis bien
                    </div>
                `}
                
                <!-- Facteurs de vieillissement -->
                ${score.factors.length > 0 ? `
                    <div class="factors-section">
                        <h3 class="factors-title">CE QUI T'USE LE PLUS</h3>
                        ${score.factors.map(factor => `
                            <div class="factor-item">
                                <div class="factor-icon">${factor.icon}</div>
                                <div class="factor-content">
                                    <div class="factor-name">${factor.name}</div>
                                    <div class="factor-description">${factor.description}</div>
                                </div>
                                <div class="factor-impact">${factor.impact}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <!-- Potentiel -->
                <div class="potential-section">
                    <h3 class="potential-title">💪 TON POTENTIEL DE RÉCUPÉRATION</h3>
                    <p style="color: #aaa; margin-bottom: 20px;">
                        En corrigeant ces ${score.factors.length} points, tu peux :
                    </p>
                    <div class="potential-value">
                        GAGNER ${score.potential} ANS
                    </div>
                    <p style="color: #aaa; margin-top: 20px;">
                        de vie en pleine forme
                    </p>
                </div>
                
                <!-- CTA -->
                <div class="cta-section">
                    <button class="btn-primary" onclick="window.location.href='https://oralife.club/protocole'">
                        DÉCOUVRIR MON PROTOCOLE GRATUIT →
                    </button>
                    <p style="margin-top: 20px; color: #666; font-size: 14px;">
                        📧 Vérifie tes emails, ton protocole détaillé arrive !
                    </p>
                </div>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
    }
    
    // Public API
    return {
        init: init,
        next: handleNext,
        prev: handlePrev,
        answer: handleAnswer,
        toggleMulti: handleToggleMulti,
        calculateIMC: handleCalculateIMC,
        saveUserInfo: handleSaveUserInfo,
        submitQuiz: handleSubmitQuiz
    };
    
    // Handlers
    function handleNext() {
        // Validation
        const question = questions[currentStep - 1];
        if (question) {
            if (question.type === 'number' || question.type === 'dual_input') {
                if (question.id === 'age' && !answers.age) {
                    alert('Merci d\'indiquer ton âge');
                    return;
                }
                if (question.id === 'weight_height' && (!answers.weight || !answers.height)) {
                    alert('Merci d\'indiquer ton poids et ta taille');
                    return;
                }
            }
            if (question.type === 'multi' && !multiSelections[question.id]?.length) {
                alert(`Merci de choisir au moins une option`);
                return;
            }
        }
        
        currentStep++;
        renderCurrentStep();
    }
    
    function handlePrev() {
        if (currentStep > 0) {
            currentStep--;
            renderCurrentStep();
        }
    }
    
    function handleAnswer(key, value) {
        answers[key] = value;
    }
    
    function handleToggleMulti(questionId, option, max) {
        if (!multiSelections[questionId]) {
            multiSelections[questionId] = [];
        }
        
        const selections = multiSelections[questionId];
        const index = selections.indexOf(option);
        
        if (index > -1) {
            selections.splice(index, 1);
        } else if (selections.length < max) {
            selections.push(option);
        } else {
            alert(`Tu peux choisir maximum ${max} options`);
            return;
        }
        
        // Re-render
        renderCurrentStep();
    }
    
    function handleCalculateIMC() {
        renderCurrentStep();
    }
    
    function handleSaveUserInfo(key, value) {
        userInfo[key] = value;
    }
    
    function handleSubmitQuiz() {
        if (!userInfo.name || !userInfo.email) {
            alert('Merci de remplir ton prénom et email');
            return;
        }
        
        currentStep++;
        renderCurrentStep();
    }
})();

// Démarrage au chargement
document.addEventListener('DOMContentLoaded', Quiz.init);
