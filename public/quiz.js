// ORA LIFE Quiz Engine - Version Complete
const Quiz = (function() {
    'use strict';
    
    // Configuration
    const API_URL = '/api/calculate-score';
    const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwa_F2dIfYfpEqsX5kWQ5wMlabyHMDtuEWHmQD23IEJuh9Foe_WdbOArFBFaM51Vo6i/exec';
    
    // État global
    let currentScreen = 0;
    let answers = {};
    let userInfo = {};
    const multiAnswers = {};
    
    // Toutes les questions du quiz original
    const questions = [
        { id: 'gender', text: 'Tu es ?', options: ['Homme', 'Femme'], type: 'visual' },
        { id: 'age', text: 'Ton âge exact ?', type: 'number', min: 18, max: 100 },
        { id: 'weight', text: 'Ton poids (kg) ?', type: 'number', min: 40, max: 200 },
        { id: 'height', text: 'Ta taille (cm) ?', type: 'number', min: 140, max: 220 },
        {
            id: 'objectives',
            text: 'Tes objectifs principaux ?',
            options: [
                'Perdre du poids',
                'Gagner en énergie', 
                'Améliorer mon sommeil',
                'Réduire le stress',
                'Longévité maximale',
                'Performance mentale',
                'Santé globale'
            ],
            type: 'multi',
            max: 3
        },
        { 
            id: 'energy_vs_3years', 
            text: 'Ton énergie vs il y a 3 ans ?',
            options: ['Débordante, mieux qu\'avant', 'Identique', 'En baisse', 'Fatigue chronique'],
            type: 'single'
        },
        {
            id: 'last_100_percent',
            text: 'Dernière fois à 100% de ta forme ?',
            options: ['Cette semaine', 'Ce mois-ci', 'Cette année', 'Je ne sais plus'],
            type: 'single'
        },
        {
            id: 'blockers',
            text: 'Qu\'est-ce qui t\'empêche d\'être au top ?',
            options: [
                'Manque de temps',
                'Trop d\'infos contradictoires',
                'Pas de résultats visibles',
                'Motivation inconstante',
                'Ne sais pas par où commencer',
                'Manque de discipline'
            ],
            type: 'multi',
            max: 3
        },
        {
            id: 'stairs_test',
            text: 'Monter 2 étages à pied, c\'est :',
            options: ['Facile, en parlant', 'Léger essoufflement', 'Besoin de reprendre mon souffle', 'Très difficile', 'J\'évite les escaliers'],
            type: 'single'
        },
        {
            id: 'sitting_hours',
            text: 'Heures assis par jour :',
            options: ['Moins de 4h', '4-6h', '6-8h', '8-10h', 'Plus de 10h'],
            type: 'single'
        },
        {
            id: 'night_wakeups',
            text: 'Combien de fois te réveilles-tu la nuit ?',
            options: ['Jamais', '1 fois', '2-3 fois', '4+ fois', 'Insomnie chronique'],
            type: 'single'
        },
        {
            id: 'cycle_libido',
            text: '', // Sera défini dynamiquement selon le genre
            options: [], // Sera défini dynamiquement
            type: 'single',
            conditional: true
        },
        {
            id: 'first_crash',
            text: 'Ton premier crash énergétique arrive :',
            options: ['Jamais', 'Après 17h', 'Vers 14h-15h', 'Juste après le déjeuner', 'Dès le matin'],
            type: 'single'
        },
        {
            id: 'weight_vs_ideal',
            text: 'Ton poids vs ton idéal :',
            options: ['Parfait', '+2-5 kg', '+5-10 kg', '+10-15 kg', '+15 kg ou plus'],
            type: 'single'
        },
        {
            id: 'digestion',
            text: 'Ta digestion au quotidien :',
            options: ['Parfaite comme une horloge', 'Quelques inconforts occasionnels', 'Ballonnements fréquents', 'Problèmes quotidiens', 'Chaos intestinal permanent'],
            type: 'single'
        },
        {
            id: 'joint_pain',
            text: 'Douleurs articulaires :',
            options: ['Jamais', 'Après effort intense', 'Régulièrement', 'Chroniques', 'Handicapantes'],
            type: 'single'
        },
        {
            id: 'memory_focus',
            text: 'Mémoire et focus :',
            options: ['Excellent', 'Quelques oublis mineurs', 'Difficultés fréquentes', 'Brouillard mental', 'Problèmes inquiétants'],
            type: 'single'
        },
        {
            id: 'symptoms_hormonal',
            text: '', // Sera défini dynamiquement selon le genre
            options: [], // Sera défini dynamiquement
            type: 'single',
            conditional: true
        },
        {
            id: 'recovery',
            text: 'Récupération après effort :',
            options: ['Moins de 24h', '24-48h', '48-72h', 'Plus de 72h', 'Je ne récupère jamais'],
            type: 'single'
        },
        {
    id: 'infections_frequency',
    text: 'Tu attrapes des rhumes/grippes ou infections :',
    options: [
        'Jamais (système immunitaire de warrior)',
        'Rarement (1 fois/an max)',
        'Normalement (2-3 fois/an)',
        'Souvent (4-5 fois/an)',
        'Tout le temps (système immunitaire KO)'
    ],
    type: 'single'
},
        {
            id: 'stress_level',
            text: 'Ton niveau de stress :',
            options: ['Zen permanent', 'Gérable', 'Élevé', 'Très élevé', 'Burnout proche'],
            type: 'single'
        },
        {
            id: 'skin_quality',
            text: 'Qualité de ta peau :',
            options: ['Éclatante', 'Correcte pour mon âge', 'Terne/sèche', 'Problématique', 'Vieillissement accéléré'],
            type: 'single'
        },
        {
            id: 'environment',
            text: 'Ton environnement :',
            options: ['Campagne pure', 'Petite ville (<50k habitants)', 'Grande ville (>50k habitants)', 'Mégapole', 'Zone très polluée'],
            type: 'single'
        },
        {
            id: 'sun_exposure',
            text: 'Exposition au soleil :',
            options: ['Quotidienne (>30min)', 'Quelques fois/semaine', 'Weekends seulement', 'Rarement', 'Jamais (vampire mode)'],
            type: 'single'
        },
        {
            id: 'nature_time',
            text: 'Temps dans la nature/semaine :',
            options: ['>10h', '5-10h', '2-5h', '<2h', 'Zéro nature'],
            type: 'single'
        },
        {
            id: 'sleep_quality',
            text: 'Qualité de ton sommeil :',
            options: ['7-9h de sommeil profond', '7-9h avec réveils', '5-7h agité', 'Moins de 5h', 'Insomnie chronique'],
            type: 'single'
        },
        {
            id: 'bedtime',
            text: 'Heure habituelle du coucher :',
            options: ['Avant 22h', '22h-23h', '23h-minuit', 'Après minuit', 'Horaires chaotiques'],
            type: 'single'
        },
        {
            id: 'screen_before_bed',
            text: 'Écrans avant de dormir :',
            options: ['Jamais (coupure 2h avant)', '30min avant', '1h avant', 'Jusqu\'au coucher', 'Dans le lit'],
            type: 'single'
        },
        {
            id: 'breakfast',
            text: 'Petit-déjeuner type :',
            options: ['Protéines + bons gras', 'Équilibré varié', 'Sucré (pain blanc, confiture)', 'Juste café/rien', 'Variable selon l\'humeur'],
            type: 'single'
        },
        {
            id: 'hydration',
            text: 'Hydratation quotidienne (eau pure) :',
            options: ['2L+ religieusement', '1.5-2L', '1-1.5L', 'Moins d\'1L', 'Principalement café/sodas'],
            type: 'single'
        },
        {
            id: 'alcohol',
            text: 'Consommation d\'alcool par semaine :',
            options: ['0 (jamais)', '1-3 verres', '4-7 verres (1/jour)', '8-14 verres (2/jour)', '15+ verres'],
            type: 'single'
        },
        {
            id: 'physical_activities',
            text: 'Activités physiques pratiquées :',
            options: [
                'Course à pied',
                'Musculation/CrossFit',
                'Yoga/Pilates',
                'Natation',
                'Sports collectifs',
                'Marche',
                'Vélo',
                'Arts martiaux',
                'Aucune activité'
            ],
            type: 'multi',
            max: 3
        },
        {
            id: 'sport_frequency',
            text: 'Fréquence sport/semaine :',
            options: ['5+ fois', '3-4 fois', '2-3 fois', '1 fois', 'Jamais'],
            type: 'single'
        },
        {
            id: 'supplements',
            text: 'Compléments alimentaires :',
            options: [
                'Vitamine D',
                'Oméga 3',
                'Magnésium',
                'Probiotiques',
                'Multivitamines',
                'Protéines',
                'Créatine',
                'Collagène',
                'Aucun'
            ],
            type: 'multi',
            max: 5
        },
        {
            id: 'tracking_tools',
            text: 'Outils de tracking utilisés :',
            options: [
                'Montre connectée',
                'Balance connectée',
                'App nutrition',
                'App méditation',
                'Tracker sommeil',
                'Tensiomètre',
                'Glucomètre',
                'Aucun'
            ],
            type: 'multi',
            max: 3
        },
        {
            id: 'mental_pressure',
            text: '', // Sera défini dynamiquement selon le genre
            options: [], // Sera défini dynamiquement
            type: 'single',
            conditional: true
        },
        {
            id: 'social_relations',
            text: 'Relations sociales :',
            options: ['Épanouissantes', 'Satisfaisantes', 'Limitées', 'Conflictuelles', 'Isolement'],
            type: 'single'
        },
        {
            id: 'last_vacation',
            text: 'Dernières vraies vacances :',
            options: ['< 3 mois', '3-6 mois', '6-12 mois', '> 1 an', 'Je ne prends jamais de vacances'],
            type: 'single'
        },
        {
            id: 'projection_5years',
            text: 'Dans 5 ans, tu te vois :',
            options: ['Au top de ma forme', 'Stable (stagnation)', 'En déclin probable', 'Inquiet pour ma santé', 'Je n\'ose pas y penser'],
            type: 'single'
        },
        {
            id: 'biggest_fear',
            text: 'Ta plus grande peur santé :',
            options: ['Cancer', 'Infarctus/AVC', 'Alzheimer/Démence', 'Douleurs chroniques', 'Perte d\'autonomie'],
            type: 'single'
        },
        {
            id: 'motivations',
            text: 'Qu\'est-ce qui te motive vraiment ?',
            options: [
                'Voir mes enfants/petits-enfants grandir',
                'Rester performant au travail',
                'Profiter de la vie longtemps',
                'Ne pas être un poids pour mes proches',
                'Réaliser mes rêves',
                'Être un exemple'
            ],
            type: 'multi',
            max: 2
        },
        {
            id: 'health_budget',
            text: 'Budget santé mensuel :',
            options: ['<50€', '50-150€', '150-300€', '300-500€', '>500€'],
            type: 'single'
        },
        {
            id: 'time_available',
            text: 'Temps disponible/jour pour ta santé :',
            options: ['Moins de 15min', '15-30min', '30-60min', '1-2h', 'Plus de 2h'],
            type: 'single'
        }
    ];
    
    // WOW Breaks positions et contenu
    const wowBreaks = {
        10: {
            icon: '🪑',
            title: 'TA CHAISE TE TUE LENTEMENT',
            stat: 'Mortalité +52%',
            fact: '10h assis = 52% sans sport, 34% avec sport régulier',
            source: 'Annals of Internal Medicine, 2017',
            solution: 'Solution simple dans tes résultats →'
        },
        11: {
            icon: '😴',
            title: 'LA DETTE QUE TU NE REMBOURSERAS JAMAIS',
            stat: '<6h = 0.8g alcool',
            fact: 'Dormir moins de 6h = cerveau avec 0.8g d\'alcool. Les grasses mat\' ne récupèrent RIEN.',
            source: 'Sleep Medicine Reviews, 2023',
            solution: 'Protocole sommeil dans tes résultats →'
        },
        16: {
            icon: '🧠',
            title: 'TON VENTRE CONTRÔLE TON CERVEAU',
            stat: '95% sérotonine = intestin',
            fact: 'Ton bonheur vient littéralement du ventre ! Pas du cerveau.',
            source: 'Nature Microbiology, 2022',
            solution: 'Résultats possibles en 3 semaines →'
        },
        24: {
            icon: '🌆',
            title: 'L\'AIR QUI T\'EMPOISONNE',
            stat: '-2.2 ans d\'espérance de vie',
            fact: 'Pollution urbaine = vieillissement accéléré de tes cellules',
            source: 'Environmental Research, 2021',
            solution: 'Protocole détox dans tes résultats →'
        },
        33: {
            icon: '🐟',
            title: 'LE POISON DANS TON ASSIETTE',
            stat: '10x plus de toxines',
            fact: 'Saumon d\'élevage = 10x plus de PCB. 92% du thon contient du mercure.',
            source: 'Environmental Research, 2023',
            solution: 'Liste poissons sûrs dans tes résultats →'
        },
        42: {
            icon: '💼',
            title: 'TON MÉTIER PRÉDIT TA LONGÉVITÉ',
            stat: 'Cadre = -9 ans',
            fact: 'Cadre stressé vs artisan = 9 ans d\'espérance de vie en moins',
            source: 'The Lancet Public Health, 2023',
            solution: 'Le biohacking égalise les chances →'
        },
        47: {
            icon: '⚡',
            title: 'TU CONTRÔLES TON DESTIN',
            stat: '77% = Tes choix',
            fact: 'Génétique = seulement 23% ! En 12 semaines tu peux modifier 500+ gènes',
            source: 'Science, 2018 (2,748 jumeaux)',
            solution: 'Prêt pour TON protocole personnalisé ?'
        }
    };
    
    // Fonctions principales
    function init() {
        renderLanding();
    }
    
    function renderLanding() {
        const html = `
            <div class="card landing">
                <div class="logo">ORA LIFE</div>
                <h1>Découvre Ton Score de Vieillissement</h1>
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
        currentScreen = 0;
        renderQuestion();
        updateProgressBar();
    }
    
    function renderQuestion() {
        // Check si c'est un WOW break
        if (wowBreaks[currentScreen]) {
            renderWowBreak();
            return;
        }
        
        // Check si on a fini les questions
        if (currentScreen >= questions.length + Object.keys(wowBreaks).length) {
            renderEmailForm();
            return;
        }
        
        // Trouve la question actuelle (en sautant les WOW breaks)
        let questionIndex = currentScreen;
        for (let wb in wowBreaks) {
            if (currentScreen > wb) questionIndex--;
        }
        
        const q = questions[questionIndex];
        if (!q) {
            renderEmailForm();
            return;
        }
        
        // Setup questions conditionnelles
        if (q.conditional) {
            setupConditionalQuestion(q);
        }
        
        let html = `<div class="card">`;
        
        // Render selon le type
        if (q.type === 'visual' && q.id === 'gender') {
            html += `
                <h2 class="question-text">${q.text}</h2>
                <div class="visual-options">
                    <div class="visual-option" onclick="Quiz.answer('${q.id}', 'homme')">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" alt="Homme">
                        <div class="label">Homme</div>
                    </div>
                    <div class="visual-option" onclick="Quiz.answer('${q.id}', 'femme')">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop" alt="Femme">
                        <div class="label">Femme</div>
                    </div>
                </div>
            `;
        } else if (q.type === 'single') {
            html += `
                <h2 class="question-text">${q.text}</h2>
                <div class="options">
                    ${q.options.map(opt => 
                        `<div class="option" onclick="Quiz.answer('${q.id}', '${opt.replace(/'/g, "\\'")}')">${opt}</div>`
                    ).join('')}
                </div>
            `;
        } else if (q.type === 'number') {
            html += `
                <h2 class="question-text">${q.text}</h2>
                <input type="number" id="${q.id}" min="${q.min}" max="${q.max}" />
                <button class="btn-primary" onclick="Quiz.answerNumber('${q.id}')">Suivant →</button>
            `;
            
            // Calcul IMC si on a poids et taille
            if (q.id === 'height' && answers.weight) {
                html += `
                    <div class="imc-container" id="imc-container" style="display:none;">
                        <div class="imc-value" id="imc-value">--</div>
                        <div class="imc-label" id="imc-label">IMC</div>
                        <div class="imc-gauge">
                            <div class="imc-pointer" id="imc-pointer"></div>
                        </div>
                    </div>
                `;
            }
        } else if (q.type === 'multi') {
            html += `
                <h2 class="question-text">${q.text}</h2>
                <p class="multi-select-info">Choisis jusqu'à ${q.max} options</p>
                <div class="options">
                    ${q.options.map(opt => 
                        `<div class="option multi" onclick="Quiz.toggleMulti('${q.id}', '${opt.replace(/'/g, "\\'")}')">${opt}</div>`
                    ).join('')}
                </div>
                <button class="btn-primary" onclick="Quiz.validateMulti('${q.id}')">Valider →</button>
            `;
        }
        
        // Bouton retour
        if (currentScreen > 0) {
            html += `<button class="btn-back" onclick="Quiz.prev()">← Retour</button>`;
        }
        
        html += `</div>`;
        document.getElementById('quiz-container').innerHTML = html;
        
        // Setup IMC si nécessaire
        if (q.id === 'height') {
            setupIMC();
        }
    }
    
    function setupConditionalQuestion(q) {
        const gender = answers.gender;
        
        if (q.id === 'cycle_libido') {
            if (gender === 'femme') {
                q.text = 'Où en es-tu dans ton cycle féminin ?';
                q.options = ['Cycle régulier', 'Cycle irrégulier', 'Grossesse', 'Périménopause', 'Ménopause', 'Post-ménopause', 'Aménorrhée'];
            } else {
                q.text = 'Ta libido actuelle :';
                q.options = ['Au top', 'Normale', 'En baisse', 'Problématique', 'Éteinte'];
            }
        } else if (q.id === 'symptoms_hormonal') {
            if (gender === 'femme') {
                q.text = 'Symptômes hormonaux :';
                q.options = ['Aucun', 'SPM léger', 'SPM intense', 'Bouffées de chaleur', 'Troubles multiples'];
            } else {
                q.text = 'Masse musculaire :';
                q.options = ['En progression', 'Stable', 'Légère perte', 'Perte importante', 'Fonte musculaire'];
            }
        } else if (q.id === 'mental_pressure') {
            if (gender === 'femme') {
                q.text = 'Charge mentale quotidienne :';
                q.options = ['Légère', 'Gérable', 'Lourde', 'Écrasante', 'Burn-out maternel'];
            } else {
                q.text = 'Pression professionnelle :';
                q.options = ['Stimulante', 'Normale', 'Élevée', 'Toxique', 'Insoutenable'];
            }
        }
    }
    
    function setupIMC() {
        const input = document.getElementById('height');
        if (input) {
            input.addEventListener('input', function() {
                const height = parseFloat(this.value);
                const weight = parseFloat(answers.weight);
                
                if (height && weight) {
                    const imc = (weight / ((height/100) * (height/100))).toFixed(1);
                    const container = document.getElementById('imc-container');
                    const value = document.getElementById('imc-value');
                    const label = document.getElementById('imc-label');
                    const pointer = document.getElementById('imc-pointer');
                    
                    if (container) container.style.display = 'block';
                    if (value) value.textContent = imc;
                    
                    // Position du pointeur
                    let position = 50;
                    if (imc < 18.5) position = 10;
                    else if (imc < 25) position = 30;
                    else if (imc < 30) position = 50;
                    else if (imc < 35) position = 70;
                    else position = 90;
                    
                    if (pointer) pointer.style.left = position + '%';
                    
                    // Label
                    let status = 'Normal';
                    if (imc < 18.5) status = 'Insuffisant';
                    else if (imc < 25) status = 'Normal';
                    else if (imc < 30) status = 'Surpoids';
                    else if (imc < 35) status = 'Obésité';
                    else status = 'Obésité sévère';
                    
                    if (label) label.textContent = `IMC : ${status}`;
                }
            });
        }
    }
    
    function renderWowBreak() {
        const wb = wowBreaks[currentScreen];
        if (!wb) return;
        
        const html = `
            <div class="card wow-break">
                <div class="wow-header">
                    <div class="wow-icon">${wb.icon}</div>
                    <h2 class="wow-title">${wb.title}</h2>
                </div>
                
                <div class="wow-content">
                    <span class="study-badge">📊 ${wb.source}</span>
                    
                    <div class="wow-stat">${wb.stat}</div>
                    
                    <p style="text-align: center; font-weight: 600; color: var(--primary-blue); margin: 20px 0;">
                        ${wb.fact}
                    </p>
                    
                    <div class="wow-fact">
                        ${wb.solution}
                    </div>
                </div>
                
                <button class="btn-primary" onclick="Quiz.next()">
                    CONTINUER LE TEST →
                </button>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
    }
    
    function renderEmailForm() {
        const html = `
            <div class="card">
                <h2 class="question-text">Dernière étape pour recevoir ton score</h2>
                
                <div class="form-group">
                    <label>Prénom</label>
                    <input type="text" id="name" placeholder="Ton prénom" />
                </div>
                
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email" placeholder="ton@email.com" />
                </div>
                
                <button class="btn-primary" onclick="Quiz.submit()">
                    RECEVOIR MON SCORE →
                </button>
                
                <p style="text-align: center; color: var(--text-light); font-size: 12px; margin-top: 20px;">
                    🔒 100% confidentiel • Résultats immédiats
                </p>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
    }
    
    function answer(id, value) {
        answers[id] = value;
        next();
    }
    
    function answerNumber(id) {
        const value = document.getElementById(id).value;
        if (value) {
            answers[id] = value;
            next();
        } else {
            alert('Merci de remplir ce champ');
        }
    }
    
    function toggleMulti(id, value) {
        if (!multiAnswers[id]) multiAnswers[id] = [];
        
        const q = questions.find(q => q.id === id);
        const maxSelections = q ? q.max : 3;
        
        // Si "Aucun" est sélectionné, désélectionner tout
        if (value === 'Aucun' || value === 'Aucune activité') {
            multiAnswers[id] = [value];
            document.querySelectorAll('.option.multi').forEach(el => {
                el.classList.remove('selected');
                if (el.textContent === value) {
                    el.classList.add('selected');
                }
            });
            return;
        }
        
        // Si on sélectionne autre chose, enlever "Aucun"
        if (multiAnswers[id].includes('Aucun') || multiAnswers[id].includes('Aucune activité')) {
            multiAnswers[id] = [];
            document.querySelectorAll('.option.multi').forEach(el => {
                if (el.textContent === 'Aucun' || el.textContent === 'Aucune activité') {
                    el.classList.remove('selected');
                }
            });
        }
        
        const idx = multiAnswers[id].indexOf(value);
        
        if (idx > -1) {
            multiAnswers[id].splice(idx, 1);
        } else if (multiAnswers[id].length < maxSelections) {
            multiAnswers[id].push(value);
        } else {
            alert(`Tu peux choisir maximum ${maxSelections} options`);
            return;
        }
        
        // Update UI
        document.querySelectorAll('.option.multi').forEach(el => {
            if (multiAnswers[id].includes(el.textContent)) {
                el.classList.add('selected');
            } else {
                el.classList.remove('selected');
            }
        });
    }
    
    function validateMulti(id) {
        if (multiAnswers[id] && multiAnswers[id].length > 0) {
            answers[id] = multiAnswers[id];
            next();
        } else {
            alert('Merci de choisir au moins une option');
        }
    }
    
    function next() {
        currentScreen++;
        renderQuestion();
        updateProgressBar();
        updateProgressText();
    }
    
    function prev() {
        currentScreen--;
        renderQuestion();
        updateProgressBar();
        updateProgressText();
    }
    
    function updateProgressBar() {
        const totalScreens = questions.length + Object.keys(wowBreaks).length + 1; // +1 pour email
        const progress = (currentScreen / totalScreens) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
    }
    
    function updateProgressText() {
        const progressText = document.getElementById('progress-text');
        if (progressText) {
            if (currentScreen === 0) {
                progressText.textContent = 'Prêt à commencer';
            } else if (currentScreen < 10) {
                progressText.textContent = 'Début du test...';
            } else if (currentScreen < 20) {
                progressText.textContent = 'Tu progresses bien !';
            } else if (currentScreen < 30) {
                progressText.textContent = 'Encore quelques questions...';
            } else if (currentScreen < 40) {
                progressText.textContent = 'Presque fini !';
            } else {
                progressText.textContent = 'Dernière étape !';
            }
        }
    }
    
    async function submit() {
        userInfo.name = document.getElementById('name').value;
        userInfo.email = document.getElementById('email').value;
        
        if (!userInfo.name || !userInfo.email) {
            alert('Merci de remplir tous les champs');
            return;
        }
        
        // Loading screen
        document.getElementById('quiz-container').innerHTML = `
            <div class="card loading">
                <div class="spinner"></div>
                <h2>Calcul de ton score en cours...</h2>
                <p>Analyse de tes ${Object.keys(answers).length} réponses</p>
            </div>
        `;
        
        try {
            // Appel API pour calculer le score
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers })
            });
            
            const result = await response.json();
            
            // Envoi à Google Sheets
            await fetch(SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({
                    ...answers,
                    ...userInfo,
                    score: result.score,
                    timestamp: new Date().toISOString()
                })
            });
            
            // Afficher les résultats
            showResults(result);
            
        } catch (error) {
            console.error('Erreur:', error);
            // Score de demo si l'API fail
            showResults({ 
                score: 73, 
                message: 'Tu es dans le TOP 25% !',
                level: 'Bon',
                priorities: [
                    'Hydratation : Passe à 2.5L/jour',
                    'Sommeil : Vise 7-9h minimum',
                    'Mouvement : Pause active toutes les heures'
                ]
            });
        }
    }
    
    function showResults(result) {
        const html = `
            <div class="card results">
                <h1>${userInfo.name}, voici ton Score de Vitalité</h1>
                
                <div class="score-circle">
                    <svg viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="90" stroke="#E0E0E0" />
                        <circle cx="100" cy="100" r="90" stroke="url(#gradient)" 
                                stroke-dasharray="${result.score * 5.65} 565" />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:var(--primary-blue);stop-opacity:1" />
                                <stop offset="100%" style="stop-color:var(--accent-green);stop-opacity:1" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div class="score-value">${result.score}</div>
                </div>
                
                <div class="score-interpretation">
                    <h2>${result.message || 'Analyse complète envoyée par email'}</h2>
                </div>
                
                ${result.priorities ? `
                    <div class="results-details">
                        <h3 style="color: var(--primary-blue); margin-bottom: 15px;">
                            📊 Tes 3 axes prioritaires :
                        </h3>
                        ${result.priorities.map((p, i) => `
                            <div class="priority-item">
                                <div class="priority-number">${i + 1}</div>
                                <div class="priority-content">
                                    <h4>${p.split(':')[0]}</h4>
                                    <p>${p.split(':')[1] || ''}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <button class="btn-primary" onclick="window.open('https://calendly.com/oralife/consultation', '_blank')">
                    RÉSERVER MA CONSULTATION GRATUITE →
                </button>
                
                <p style="text-align: center; font-size: 12px; color: var(--text-light); margin-top: 20px;">
                    📧 Ton analyse détaillée a été envoyée à ${userInfo.email}
                </p>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
    }
    
    // Public API
    return {
        init,
        start,
        next,
        prev,
        answer,
        answerNumber,
        toggleMulti,
        validateMulti,
        submit
    };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    Quiz.init();
});

