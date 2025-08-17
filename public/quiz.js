// ORA LIFE Quiz Engine - Version Finale
const Quiz = (function() {
    'use strict';
    
    // Configuration
    const API_URL = '/api/calculate-score';
    const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwjyAjH9Nl6y2IeRWHi5Qrr6ftqVilH4T9RMPAdNXM_XYVuaN0WFzrPPYwVL8oOZR0W/exec';
    
    // État global
    let currentScreen = -1; // -1 = landing
    let currentQuestionIndex = 0;
    let answers = {};
    let userInfo = {};
    let multiAnswers = {};
    
    // Mapping des écrans avec wow breaks
    const screenFlow = [
        'landing',
        'q-0', 'q-1', 'q-2-3', 'q-4', 'q-5', 'q-6', 'q-7', 'q-8', 'q-9',
        'wow-1', // Après heures assis
        'q-10', 'q-11', 'q-12', 'q-13', 'q-14', 'q-15',
        'wow-2', // Après digestion  
        'q-16', 'q-17', 'q-18', 'q-19', 'q-20', 'q-21', 'q-22', 'q-23',
        'wow-3', // Génétique 7%
        'q-24', 'q-25', 'q-26', 'q-27', 'q-28', 'q-29',
        'wow-4', // Après alcool
        'q-30', 'q-31', 'q-32', 'q-33',
        'wow-5', // Après tracking
        'q-34', 'q-35', 'q-36', 'q-37',
        'wow-6', // Après projection
        'q-38', 'q-39', 'q-40', 'q-41',
        'wow-7', // Final
        'email', 'calculating', 'results'
    ];
    
    // Questions complètes basées sur index9
    const questions = [
        { 
            id: 'gender', 
            text: 'Tu es ?', 
            options: ['Homme', 'Femme'], 
            type: 'visual' 
        },
        { 
            id: 'age', 
            text: 'Ton âge exact ?', 
            type: 'number', 
            min: 18, 
            max: 100,
            placeholder: '42'
        },
        { 
            id: 'weight_height', 
            text: 'Ton poids et ta taille ?',
            type: 'dual_number',
            fields: [
                { id: 'weight', label: 'Poids (kg)', min: 40, max: 200, placeholder: '75' },
                { id: 'height', label: 'Taille (cm)', min: 140, max: 220, placeholder: '175' }
            ]
        },
        {
            id: 'objectives',
            text: 'Tes objectifs principaux ?',
            options: [
                'Énergie illimitée toute la journée',
                'Sommeil réparateur profond',
                'Mental sharp & focus laser',
                'Perte de poids durable',
                'Longévité & anti-âge',
                'Performance sportive',
                'Équilibre hormonal'
            ],
            type: 'multi',
            max: 3
        },
        {
            id: 'energy_vs_3years',
            text: 'Ton énergie vs il y a 3 ans ?',
            options: [
                'Débordante, mieux qu\'avant !',
                'Identique',
                'En baisse',
                'Fatigue chronique'
            ],
            type: 'single'
        },
        {
            id: 'last_100_percent',
            text: 'Dernière fois à 100% de ta forme ?',
            options: [
                'Cette semaine',
                'Ce mois-ci',
                'Il y a 6 mois',
                'Il y a 1 an',
                'Plus de 2 ans',
                'Jamais vraiment'
            ],
            type: 'single'
        },
        {
            id: 'sitting_hours',
            text: 'Heures assis par jour ?',
            options: [
                'Moins de 4h',
                '4-6h',
                '6-8h',
                '8-10h',
                'Plus de 10h'
            ],
            type: 'single'
        },
        {
            id: 'back_pain',
            text: 'Douleurs dos/cervicales ?',
            options: [
                'Jamais',
                'Parfois',
                'Souvent',
                'Tous les jours'
            ],
            type: 'single'
        },
        {
            id: 'screen_eyes',
            text: 'Yeux fatigués/secs le soir ?',
            options: [
                'Jamais',
                'Parfois',
                'Souvent',
                'Toujours'
            ],
            type: 'single'
        },
        {
            id: 'last_blood_test',
            text: 'Dernière prise de sang complète ?',
            options: [
                'Moins de 6 mois',
                '6-12 mois',
                '1-2 ans',
                'Plus de 2 ans',
                'Jamais'
            ],
            type: 'single'
        },
        // WOW BREAK 1 - La chaise qui tue
        {
            id: 'sport_frequency',
            text: 'Fréquence sport/semaine ?',
            options: [
                '5+ fois',
                '3-4 fois',
                '2-3 fois',
                '1 fois',
                'Jamais'
            ],
            type: 'single'
        },
        {
            id: 'sport_type',
            text: 'Type d\'activité principale ?',
            options: [
                'HIIT/CrossFit',
                'Musculation',
                'Course/Cardio',
                'Yoga/Pilates',
                'Sports collectifs',
                'Marche',
                'Aucune'
            ],
            type: 'multi',
            max: 'unlimited'
        },
        {
            id: 'recovery_time',
            text: 'Récupération après effort ?',
            options: [
                '< 24h',
                '24-48h',
                '2-3 jours',
                '> 3 jours'
            ],
            type: 'single'
        },
        {
            id: 'breakfast',
            text: 'Petit-déjeuner type ?',
            options: [
                'Protéiné (œufs, viande)',
                'Glucides (pain, céréales)',
                'Jeûne intermittent',
                'Café seulement',
                'Variable'
            ],
            type: 'single'
        },
        {
            id: 'meals_per_day',
            text: 'Nombre de repas/jour ?',
            options: [
                '1-2 repas',
                '3 repas',
                '3 repas + collations',
                'Grignotage continu'
            ],
            type: 'single'
        },
        {
            id: 'digestion',
            text: 'Qualité digestion ?',
            options: [
                'Parfaite',
                'Bonne',
                'Ballonnements fréquents',
                'Problèmes chroniques'
            ],
            type: 'single'
        },
        // WOW BREAK 2 - L'inégalité face à la mort
        {
            id: 'hydration',
            text: 'Consommation d\'eau/jour ?',
            options: [
                '2L+ religieusement',
                '1.5-2L',
                '1-1.5L',
                'Moins d\'1L',
                'Principalement café/sodas'
            ],
            type: 'single'
        },
        {
            id: 'alcohol',
            text: 'Verres d\'alcool/semaine ?',
            options: [
                '0 (jamais)',
                '1-3 verres',
                '4-7 verres (1/jour)',
                '8-14 verres (2/jour)',
                '15+ verres'
            ],
            type: 'single'
        },
        {
            id: 'smoking',
            text: 'Tabac/Nicotine ?',
            options: [
                'Jamais',
                'Occasionnel',
                'Vapotage',
                'Quotidien'
            ],
            type: 'single'
        },
        {
            id: 'supplements',
            text: 'Compléments actuels ?',
            options: [
                'Vitamine D',
                'Magnésium',
                'Oméga-3',
                'Probiotiques',
                'Multivitamines',
                'Protéines',
                'Créatine',
                'Aucun'
            ],
            type: 'multi',
            max: 'unlimited'
        },
        {
            id: 'sleep_hours',
            text: 'Heures de sommeil/nuit ?',
            options: [
                '7-9h de sommeil profond',
                '7-9h avec réveils',
                '5-7h agité',
                'Moins de 5h',
                'Insomnie chronique'
            ],
            type: 'single'
        },
        {
            id: 'sleep_quality',
            text: 'Te réveilles-tu reposé ?',
            options: [
                'Toujours en forme',
                'Plutôt bien',
                'Fatigué',
                'Épuisé'
            ],
            type: 'single'
        },
        {
            id: 'sleep_schedule',
            text: 'Heure coucher habituelle ?',
            options: [
                'Avant 22h',
                '22h-23h',
                '23h-00h',
                'Après minuit',
                'Variable'
            ],
            type: 'single'
        },
        {
            id: 'screen_before_bed',
            text: 'Écrans avant dormir ?',
            options: [
                'Jamais',
                '30min avant',
                '1h avant',
                'Jusqu\'au coucher'
            ],
            type: 'single'
        },
        // WOW BREAK 3 - Génétique 7%
        {
            id: 'stress_level',
            text: 'Niveau de stress quotidien ?',
            options: [
                'Zen permanent',
                'Gérable',
                'Élevé',
                'Très élevé',
                'Burnout proche'
            ],
            type: 'single'
        },
        {
            id: 'stress_management',
            text: 'Gestion du stress ?',
            options: [
                'Méditation quotidienne',
                'Sport',
                'Respiration',
                'Rien de structuré',
                'Alcool/Netflix'
            ],
            type: 'multi',
            max: 'unlimited'
        },
        {
            id: 'libido',
            text: 'Libido actuelle vs optimal ?',
            options: [
                '100% au top',
                '75% correct',
                '50% en baisse',
                '25% problématique',
                'Inexistante'
            ],
            type: 'single'
        },
        {
            id: 'erection_orgasm',
            text: 'Qualité érection/orgasme ?',
            options: [
                'Excellente',
                'Bonne',
                'Variable',
                'Difficultés fréquentes',
                'Problématique'
            ],
            type: 'single',
            conditional: true
        },
        {
            id: 'cycle_libido',
            text: 'Impact cycle sur libido/énergie ?',
            options: [
                'Aucun impact',
                'Légères variations',
                'Impact modéré',
                'Fort impact',
                'Ménopause'
            ],
            type: 'single',
            conditional: true
        },
        {
            id: 'focus_concentration',
            text: 'Capacité de concentration ?',
            options: [
                'Focus laser 4h+',
                '2-4h productives',
                '1-2h max',
                'Difficultés constantes',
                'Brain fog permanent'
            ],
            type: 'single'
        },
        // WOW BREAK 4
        {
            id: 'memory',
            text: 'Ta mémoire actuelle ?',
            options: [
                'Excellente',
                'Bonne',
                'Quelques oublis',
                'Oublis fréquents',
                'Problématique'
            ],
            type: 'single'
        },
        {
            id: 'creativity',
            text: 'Créativité/Innovation ?',
            options: [
                'Débordante',
                'Bonne',
                'En baisse',
                'Bloquée'
            ],
            type: 'single'
        },
        {
            id: 'mood',
            text: 'Humeur générale ?',
            options: [
                'Excellent moral',
                'Plutôt positif',
                'Variable',
                'Souvent négatif',
                'Déprimé'
            ],
            type: 'single'
        },
        {
            id: 'social_energy',
            text: 'Énergie sociale ?',
            options: [
                'Très sociable',
                'Normal',
                'Fatigue sociale',
                'Isolement'
            ],
            type: 'single'
        },
        // WOW BREAK 5
        {
            id: 'sun_exposure',
            text: 'Exposition soleil/jour ?',
            options: [
                '2h+ direct',
                '30min-2h',
                '10-30min',
                'Quasi jamais'
            ],
            type: 'single'
        },
        {
            id: 'nature_time',
            text: 'Temps en nature/semaine ?',
            options: [
                'Quotidien',
                '3-4 fois',
                '1-2 fois',
                'Jamais'
            ],
            type: 'single'
        },
        {
            id: 'cold_exposure',
            text: 'Exposition au froid ?',
            options: [
                'Douche froide quotidienne',
                'Occasionnelle',
                'Jamais',
                'Bain glacé/cryothérapie'
            ],
            type: 'single'
        },
        {
            id: 'sauna_heat',
            text: 'Sauna/chaleur ?',
            options: [
                '3+ fois/semaine',
                '1-2 fois/semaine',
                'Occasionnel',
                'Jamais'
            ],
            type: 'single'
        },
        // WOW BREAK 6
        {
            id: 'tracking',
            text: 'Outils de tracking ?',
            options: [
                'Oura Ring',
                'Apple Watch',
                'Garmin',
                'Whoop',
                'Fitbit',
                'Aucun'
            ],
            type: 'multi',
            max: 'unlimited'
        },
        {
            id: 'blood_tests_frequency',
            text: 'Analyses sang préventives ?',
            options: [
                'Tous les 3 mois',
                'Tous les 6 mois',
                '1 fois/an',
                'Jamais'
            ],
            type: 'single'
        },
        {
            id: 'biohacking_experience',
            text: 'Expérience biohacking ?',
            options: [
                'Expert (3+ ans)',
                'Intermédiaire (1-3 ans)',
                'Débutant (<1 an)',
                'Curieux',
                'Aucune'
            ],
            type: 'single'
        },
        {
            id: 'investment_health',
            text: 'Budget santé/mois ?',
            options: [
                '500€+',
                '200-500€',
                '100-200€',
                '50-100€',
                '<50€'
            ],
            type: 'single'
        },
        // WOW BREAK 7
        {
            id: 'projection_3years',
            text: 'Dans 3 ans, tu te vois ?',
            options: [
                'Au top de ma forme',
                'Stable',
                'En déclin',
                'Inquiet pour ma santé'
            ],
            type: 'single'
        },
        {
            id: 'motivation',
            text: 'Ta motivation principale ?',
            options: [
                'Voir mes enfants/petits-enfants grandir',
                'Rester performant',
                'Profiter de la vie longtemps',
                'Ne pas être un poids pour mes proches',
                'Réaliser mes rêves/projets',
                'Retrouver ma vitalité d\'avant',
                'Être un exemple inspirant'
            ],
            type: 'multi',
            max: 3
        },
        {
            id: 'commitment',
            text: 'Temps disponible/jour pour ta santé ?',
            options: [
                '2h+',
                '1-2h',
                '30min-1h',
                '15-30min',
                '<15min'
            ],
            type: 'single'
        },
        {
            id: 'ready_to_change',
            text: 'Prêt à changer maintenant ?',
            options: [
                'OUI, j\'ai trop attendu !',
                'Oui mais progressivement',
                'J\'hésite encore',
                'Pas vraiment'
            ],
            type: 'single'
        }
    ];
    
    // Fonctions publiques
    function init() {
        renderLanding();
        updateProgressBar();
    }
    
    function renderLanding() {
        const html = `
            <div class="card landing">
                <div class="logo">ORA LIFE</div>
                <h1>Découvre Ton Score de Vitalité</h1>
                <p class="subtitle">Test scientifique gratuit - 3 minutes</p>
                <div class="hook">⚠️ 93% des 35-50 ans vieillissent 2x plus vite sans le savoir</div>
                <button class="btn-primary" onclick="Quiz.start()">
                    COMMENCER LE TEST GRATUIT
                </button>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
    }
    
    function start() {
        currentScreen = 1;
        currentQuestionIndex = 0;
        renderScreen();
    }
    
    function renderScreen() {
        const screenId = screenFlow[currentScreen];
        
        if (!screenId) {
            renderResults();
            return;
        }
        
        updateProgressBar();
        updateProgressText();
        
        if (screenId === 'landing') {
            renderLanding();
        } else if (screenId.startsWith('wow-')) {
            renderWowBreak(screenId);
        } else if (screenId === 'email') {
            renderEmailForm();
        } else if (screenId === 'calculating') {
            renderCalculating();
        } else if (screenId === 'results') {
            renderResults();
        } else if (screenId.startsWith('q-')) {
            renderQuestion(screenId);
        }
    }
    
    function updateProgressBar() {
        // Calculer le pourcentage de progression
        const totalScreens = screenFlow.length;
        const progress = (currentScreen / totalScreens) * 100;
        
        // Déterminer quel segment est actif
        let activeSegment = 1;
        if (progress > 33) activeSegment = 2;
        if (progress > 66) activeSegment = 3;
        
        // Mettre à jour les segments
        for (let i = 1; i <= 3; i++) {
            const segment = document.getElementById(`segment-${i}`);
            if (segment) {
                segment.classList.remove('active', 'completed');
                
                if (i < activeSegment) {
                    segment.classList.add('completed');
                } else if (i === activeSegment) {
                    segment.classList.add('active');
                    // Animer la progression dans le segment actif
                    const segmentProgress = ((progress - (i-1) * 33.33) / 33.33) * 100;
                    segment.querySelector('.segment-fill').style.width = `${Math.min(segmentProgress, 100)}%`;
                }
            }
        }
    }
    
    function updateProgressText() {
        const progressText = document.getElementById('progress-text');
        if (!progressText) return;
        
        const screenId = screenFlow[currentScreen];
        
        if (screenId === 'landing') {
            progressText.textContent = 'Prêt à commencer';
        } else if (screenId.startsWith('q-')) {
            const questionCount = questions.length;
            const currentQ = Math.min(currentQuestionIndex + 1, questionCount);
            progressText.textContent = `Question ${currentQ}/${questionCount}`;
        } else if (screenId.startsWith('wow-')) {
            progressText.textContent = 'Découverte scientifique';
        } else if (screenId === 'email') {
            progressText.textContent = 'Dernière étape';
        } else if (screenId === 'calculating') {
            progressText.textContent = 'Analyse en cours...';
        } else if (screenId === 'results') {
            progressText.textContent = 'Résultats';
        }
    }
    
    
    function renderQuestion(screenId) {
        // Parse question index
        const parts = screenId.substring(2).split('-');
        const indices = parts.map(i => parseInt(i));
        
        let html = '<div class="card question">';
        
        // Questions doubles (poids/taille)
        if (indices.length === 2) {
            const q = questions[indices[0]];
            
            if (q.type === 'dual_number') {
                html += `
                    <h2 class="question-text">${q.text}</h2>
                    <div class="dual-inputs">
                `;
                
                q.fields.forEach(field => {
                    html += `
                        <div class="input-group">
                            <label for="${field.id}">${field.label}</label>
                            <input type="number" 
                                   id="${field.id}" 
                                   min="${field.min}" 
                                   max="${field.max}"
                                   placeholder="${field.placeholder}"
                                   value="${answers[field.id] || ''}"
                                   onchange="Quiz.updateAnswer('${field.id}', this.value)" />
                        </div>
                    `;
                });
                
                html += `
                    </div>
                    <div class="imc-display" id="imc-display" style="display: none;">
                        <div class="imc-value" id="imc-value"></div>
                        <div class="imc-label" id="imc-label"></div>
                        <div class="imc-scale">
                            <span>Maigreur</span>
                            <span>Normal</span>
                            <span>Surpoids</span>
                            <span>Obésité</span>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="Quiz.answerDual()">Suivant →</button>
                `;
            }
        } else {
            const q = questions[indices[0]];
            currentQuestionIndex = indices[0];
            
            // Setup conditional questions
            if (q.conditional) {
                setupConditionalQuestion(q);
            }
            
            if (q.type === 'visual' && q.id === 'gender') {
                html += `
                    <h2 class="question-text">${q.text}</h2>
                    <div class="visual-options">
                        <div class="visual-option ${answers.gender === 'Homme' ? 'selected' : ''}" onclick="Quiz.answer('${q.id}', 'Homme')">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" alt="Homme">
                            <div class="label">Homme</div>
                        </div>
                        <div class="visual-option ${answers.gender === 'Femme' ? 'selected' : ''}" onclick="Quiz.answer('${q.id}', 'Femme')">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop" alt="Femme">
                            <div class="label">Femme</div>
                        </div>
                    </div>
                `;
            } else if (q.type === 'single') {
                const useGrid = q.options.length > 6;
                html += `
                    <h2 class="question-text">${q.text}</h2>
                    <div class="${useGrid ? 'options-grid' : 'options'}">
                        ${q.options.map(opt => 
                            `<div class="option ${answers[q.id] === opt ? 'selected' : ''}" onclick="Quiz.answer('${q.id}', '${opt.replace(/'/g, "\\'")}')">${opt}</div>`
                        ).join('')}
                    </div>
                `;
            } else if (q.type === 'number') {
                html += `
                    <h2 class="question-text">${q.text}</h2>
                    <input type="number" id="${q.id}" min="${q.min}" max="${q.max}" 
                           placeholder="${q.placeholder || ''}"
                           value="${answers[q.id] || ''}" />
                    <button class="btn-primary" onclick="Quiz.answerNumber('${q.id}')">Suivant →</button>
                `;
            } else if (q.type === 'multi') {
                const maxText = q.max === 'unlimited' ? 'Choisis toutes les options pertinentes' : `Choisis jusqu'à ${q.max} options`;
                html += `
                    <h2 class="question-text">${q.text}</h2>
                    <p class="multi-select-info">${maxText}</p>
                    <div class="${q.options.length > 6 ? 'options-grid' : 'options'}">
                        ${q.options.map(opt => {
                            const isSelected = multiAnswers[q.id] && multiAnswers[q.id].includes(opt);
                            return `<div class="option multi ${isSelected ? 'selected' : ''}" data-question="${q.id}" onclick="Quiz.toggleMulti('${q.id}', '${opt.replace(/'/g, "\\'")}')">${opt}</div>`;
                        }).join('')}
                    </div>
                    <button class="btn-primary" onclick="Quiz.validateMulti('${q.id}')">Valider →</button>
                `;
            }
        }
        
        if (currentScreen > 1) {
            html += `<button class="btn-back" onclick="Quiz.prev()">← Retour</button>`;
        }
        
        html += '</div>';
        document.getElementById('quiz-container').innerHTML = html;
        
        // Setup IMC listener
        if (screenId === 'q-2-3') {
            setupIMCListeners();
        }
    }
    
    function setupConditionalQuestion(q) {
        const gender = answers.gender;
        
        if (q.id === 'cycle_libido') {
            if (gender === 'Femme') {
                q.text = 'Où en es-tu dans ton cycle féminin ?';
                q.options = [
                    'Cycles réguliers',
                    'Cycles irréguliers', 
                    'Péri-ménopause',
                    'Ménopause',
                    'Grossesse',
                    'Post-partum'
                ];
            } else {
                // Skip for men
                currentScreen++;
                renderScreen();
                return;
            }
        } else if (q.id === 'erection_orgasm') {
            if (gender === 'Homme') {
                q.text = 'Qualité érection matinale ?';
                q.options = [
                    'Tous les jours',
                    '3-5 fois/semaine',
                    '1-2 fois/semaine',
                    'Rarement',
                    'Jamais'
                ];
            } else {
                // Skip for women
                currentScreen++;
                renderScreen();
                return;
            }
        }
    }
    
    function setupIMCListeners() {
        const weightInput = document.getElementById('weight');
        const heightInput = document.getElementById('height');
        
        if (weightInput && heightInput) {
            const calculateIMC = () => {
                const weight = parseFloat(weightInput.value);
                const height = parseFloat(heightInput.value);
                
                if (weight && height) {
                    const imc = weight / ((height/100) * (height/100));
                    const imcDisplay = document.getElementById('imc-display');
                    const imcValue = document.getElementById('imc-value');
                    const imcLabel = document.getElementById('imc-label');
                    
                    if (imcDisplay && imcValue && imcLabel) {
                        imcDisplay.style.display = 'block';
                        imcValue.textContent = imc.toFixed(1);
                        
                        if (imc < 18.5) {
                            imcValue.className = 'imc-value maigreur';
                            imcLabel.textContent = 'Maigreur';
                        } else if (imc < 25) {
                            imcValue.className = 'imc-value normal';
                            imcLabel.textContent = 'Poids normal';
                        } else if (imc < 30) {
                            imcValue.className = 'imc-value surpoids';
                            imcLabel.textContent = 'Surpoids';
                        } else {
                            imcValue.className = 'imc-value obesite';
                            imcLabel.textContent = 'Obésité';
                        }
                    }
                }
            };
            
            weightInput.addEventListener('input', calculateIMC);
            heightInput.addEventListener('input', calculateIMC);
            
            // Calculate on load if values exist
            calculateIMC();
        }
    }
    
    function renderWowBreak(screenId) {
        let html = '<div class="wow-break">';
        
        switch(screenId) {
            case 'wow-1':
                html += `
                    <div class="wow-icon">🪑</div>
                    <h2 class="wow-title">LA CHAISE QUI TUE</h2>
                    <div class="wow-stat">+34%</div>
                    <p class="wow-description">
                        de mortalité après 10h assis par jour<br>
                        <strong>MÊME avec du sport régulier</strong>
                    </p>
                    <div class="wow-graph">
                        <div class="graph-bars">
                            <div class="bar" style="height: 50%;">
                                <span>4h</span>
                                <span>Normal</span>
                            </div>
                            <div class="bar" style="height: 75%;">
                                <span>8h</span>
                                <span>+15%</span>
                            </div>
                            <div class="bar" style="height: 100%;">
                                <span>10h+</span>
                                <span>+34%</span>
                            </div>
                        </div>
                    </div>
                    <p class="wow-description">
                        Sans sport : +52% de mortalité<br>
                        Solution : Pause active toutes les heures
                    </p>
                    <div class="wow-source">📊 Medicine & Science in Sports & Exercise (2019)</div>
                `;
                break;
                
            case 'wow-2':
                html += `
                    <div class="wow-icon">⚖️</div>
                    <h2 class="wow-title">L'INÉGALITÉ FACE À LA MORT</h2>
                    <div class="wow-stat">6.8 ans</div>
                    <p class="wow-description">d'écart d'espérance de vie selon ta catégorie sociale</p>
                    <div class="wow-graph">
                        <div style="padding: 20px; background: #f8f9fa; border-radius: 12px;">
                            <div style="margin-bottom: 15px;">
                                <strong>👔 Cadres supérieurs :</strong> 84.4 ans
                            </div>
                            <div style="margin-bottom: 15px;">
                                <strong>💼 Professions intermédiaires :</strong> 82 ans
                            </div>
                            <div>
                                <strong>🔧 Ouvriers :</strong> 77.6 ans
                            </div>
                        </div>
                    </div>
                    <p class="wow-description">
                        <strong>Pourquoi cette différence ?</strong><br>
                        • Stress chronique vs stress physique<br>
                        • Accès aux soins et prévention<br>
                        • Conditions de travail<br>
                        • Connaissances santé
                    </p>
                    <div class="wow-source">📊 INSEE 2023 - Espérance de vie par CSP</div>
                `;
                break;
                
            case 'wow-3':
                html += `
                    <div class="wow-icon">🧬</div>
                    <h2 class="wow-title">LA GÉNÉTIQUE ? PRESQUE RIEN !</h2>
                    <div class="genetics-display">
                        <div class="genetics-part">
                            <div class="stat small">7%</div>
                            <div class="label">Génétique</div>
                        </div>
                        <div class="genetics-part">
                            <div class="stat big">93%</div>
                            <div class="label">Tes choix quotidiens</div>
                        </div>
                    </div>
                    <p class="wow-description">
                        <strong>"La génétique n'explique qu'environ 7% de la longévité.<br>
                        Le reste se gagne au quotidien."</strong><br><br>
                        Étude sur 400 millions de profils généalogiques :<br>
                        L'héritabilité réelle de la durée de vie est minime.<br>
                        <em>Tu es le maître de ton destin biologique.</em>
                    </p>
                    <div class="wow-source">📊 Ruby et al., Genetics, 2018 - PMC6661543</div>
                `;
                break;
                
            // Ajouter les autres wow breaks...
            default:
                html += `
                    <div class="wow-icon">💡</div>
                    <h2 class="wow-title">DÉCOUVERTE SCIENTIFIQUE</h2>
                    <p class="wow-description">Information importante pour ta santé</p>
                `;
        }
        
        html += `
            <button class="btn-primary" onclick="Quiz.next()">Continuer →</button>
        </div>`;
        
        document.getElementById('quiz-container').innerHTML = html;
    }
    
    function renderEmailForm() {
        const html = `
            <div class="card">
                <h2 class="question-text">Dernière étape !</h2>
                <p class="subtitle">Reçois ton diagnostic personnalisé par email</p>
                <div class="email-form">
                    <input type="text" id="name" placeholder="Ton prénom" value="${userInfo.name || ''}" />
                    <input type="email" id="email" placeholder="ton@email.com" value="${userInfo.email || ''}" />
                    <input type="tel" id="phone" placeholder="06 12 34 56 78 (optionnel)" value="${userInfo.phone || ''}" />
                    <button class="btn-primary" onclick="Quiz.submitQuiz()">
                        OBTENIR MON DIAGNOSTIC →
                    </button>
                </div>
                <p style="text-align: center; margin-top: 20px; font-size: 0.9rem; color: #666;">
                    🔒 100% gratuit et confidentiel<br>
                    ✅ Résultats basés sur 1200+ études<br>
                    💯 Protocole personnalisé ou remboursé
                </p>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
    }
    
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
        
        // Animate steps
        setTimeout(() => document.getElementById('step1').classList.add('completed'), 1000);
        setTimeout(() => document.getElementById('step2').classList.add('completed'), 2000);
        setTimeout(() => document.getElementById('step3').classList.add('completed'), 3000);
        
        // Calculate and show results
        setTimeout(() => calculateAndShowResults(), 4000);
    }
    
    async function calculateAndShowResults() {
        try {
            // Send to API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers })
            });
            
            const result = await response.json();
            
            // Send to Google Sheets
            const allData = {
                ...userInfo,
                ...answers,
                score: result.score,
                biologicalAge: result.biologicalAge,
                timestamp: new Date().toISOString()
            };
            
            await fetch(SHEETS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(allData)
            });
            
            // Store result and show
            window.quizResult = result;
            renderResults();
            
        } catch (error) {
            console.error('Erreur:', error);
            // Fallback result
            window.quizResult = {
                score: 73,
                biologicalAge: answers.age ? parseInt(answers.age) + 5 : 45,
                message: 'Analyse complète disponible'
            };
            renderResults();
        }
    }
    
    function renderResults() {
        const result = window.quizResult || {};
        const realAge = parseInt(answers.age) || 40;
        const bioAge = result.biologicalAge || realAge + 5;
        const ageDiff = bioAge - realAge;
        
        let html = '<div class="results">';
        
        // Age comparison
        html += `
            <div class="result-card age-comparison">
                <div class="age-actual">Ton âge chronologique : ${realAge} ans</div>
                <div class="age-visual">
                    <div class="age-number biological ${ageDiff <= 0 ? 'good' : ''}">
                        ${bioAge}
                        <div class="age-label">Âge biologique</div>
                    </div>
                    <div class="age-arrow">→</div>
                    <div class="age-number real">
                        ${realAge}
                        <div class="age-label">Âge réel</div>
                    </div>
                </div>
        `;
        
        if (ageDiff > 0) {
            html += `
                <div class="age-difference bad">
                    <strong>⚠️ Tu vieillis trop vite</strong><br>
                    Ton corps a ${ageDiff} ans d'avance sur ton âge réel
                </div>
            `;
        } else if (ageDiff < 0) {
            html += `
                <div class="age-difference good">
                    <strong>✨ Excellent !</strong><br>
                    Ton corps a ${Math.abs(ageDiff)} ans de moins que ton âge réel
                </div>
            `;
        } else {
            html += `
                <div class="age-difference">
                    <strong>👍 Pas mal !</strong><br>
                    Ton âge biologique correspond à ton âge réel
                </div>
            `;
        }
        
        html += '</div>';
        
        // Factors
        html += `
            <div class="result-card factors-section">
                <h3 class="factors-title">3 FACTEURS ${ageDiff > 0 ? 'QUI TE VIEILLISSENT' : 'À OPTIMISER'}</h3>
        `;
        
        const factors = result.factors || [
            { name: 'Sédentarité', desc: 'Trop d\'heures assis', impact: '-2 ans' },
            { name: 'Sommeil', desc: 'Récupération insuffisante', impact: '-2 ans' },
            { name: 'Stress', desc: 'Cortisol chronique', impact: '-1 an' }
        ];
        
        factors.forEach(factor => {
            html += `
                <div class="factor-item ${ageDiff <= 0 ? 'positive' : ''}">
                    <div class="factor-info">
                        <div class="factor-name">${factor.name}</div>
                        <div class="factor-description">${factor.desc}</div>
                    </div>
                    <div class="factor-impact ${ageDiff <= 0 ? 'positive' : ''}">${factor.impact}</div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Recovery potential
        html += `
            <div class="result-card recovery-section">
                <h3 class="recovery-title">✨ MAIS TU PEUX ${ageDiff > 0 ? 'RÉCUPÉRER' : 'ENCORE PROGRESSER'}</h3>
                <div class="recovery-stat">${ageDiff > 0 ? `CES ${ageDiff} ANS PERDUS` : '+5 ANS'}</div>
                <p class="recovery-description">
                    ${ageDiff > 0 ? '+ EN GAGNER 3 DE PLUS' : 'de vie en pleine forme'}<br><br>
                    Les bonnes habitudes peuvent te faire gagner<br>
                    <strong>${ageDiff > 0 ? ageDiff + 3 : 8} ans de vie en pleine forme</strong>
                </p>
            </div>
        `;
        
        // CTA
        html += `
            <div class="cta-section">
                <a href="#" class="cta-button" onclick="Quiz.getProtocol(); return false;">
                    OBTENIR MON PROTOCOLE GRATUIT →
                </a>
            </div>
        `;
        
        html += '</div>';
        document.getElementById('quiz-container').innerHTML = html;
    }
    
    // Event handlers
    function answer(questionId, value) {
        answers[questionId] = value;
        next();
    }
    
    function answerNumber(questionId) {
        const input = document.getElementById(questionId);
        if (input && input.value) {
            answers[questionId] = input.value;
            next();
        }
    }
    
    function answerDual() {
        const weight = document.getElementById('weight').value;
        const height = document.getElementById('height').value;
        
        if (weight && height) {
            answers.weight = weight;
            answers.height = height;
            next();
        }
    }
    
    function updateAnswer(field, value) {
        answers[field] = value;
    }
    
    function toggleMulti(questionId, value) {
        if (!multiAnswers[questionId]) {
            multiAnswers[questionId] = [];
        }
        
        const index = multiAnswers[questionId].indexOf(value);
        if (index > -1) {
            multiAnswers[questionId].splice(index, 1);
        } else {
            const q = questions.find(q => q.id === questionId);
            if (q.max !== 'unlimited' && multiAnswers[questionId].length >= q.max) {
                alert(`Maximum ${q.max} choix`);
                return;
            }
            multiAnswers[questionId].push(value);
        }
        
        // Update UI
        renderScreen();
    }
    
    function validateMulti(questionId) {
        if (multiAnswers[questionId] && multiAnswers[questionId].length > 0) {
            answers[questionId] = multiAnswers[questionId].join(',');
            next();
        } else {
            alert('Sélectionne au moins une option');
        }
    }
    
    function next() {
        currentScreen++;
        renderScreen();
    }
    
    function prev() {
        if (currentScreen > 1) {
            currentScreen--;
            renderScreen();
        }
    }
    
    async function submitQuiz() {
        // Get user info
        userInfo.name = document.getElementById('name').value;
        userInfo.email = document.getElementById('email').value;
        userInfo.phone = document.getElementById('phone').value || '';
        
        if (!userInfo.name || !userInfo.email) {
            alert('Merci de remplir tous les champs obligatoires');
            return;
        }
        
        currentScreen++;
        renderScreen();
    }
    
    function getProtocol() {
        window.location.href = 'https://oralife.club/protocole';
    }
    
    // Public API
    return {
        init,
        start,
        next,
        prev,
        answer,
        answerNumber,
        answerDual,
        updateAnswer,
        toggleMulti,
        validateMulti,
        submitQuiz,
        getProtocol,
        renderScreen
    };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    Quiz.init();
});
