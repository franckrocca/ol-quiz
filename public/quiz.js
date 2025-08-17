// ORA LIFE Quiz Engine - Version Complete Corrigée
const Quiz = (function() {
    'use strict';
    
    // Configuration
    const API_URL = '/api/calculate-score';
    const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwjyAjH9Nl6y2IeRWHi5Qrr6ftqVilH4T9RMPAdNXM_XYVuaN0WFzrPPYwVL8oOZR0W/exec';
    
    // État global
    let currentScreen = 0;
    let currentQuestionIndex = 0;
    let answers = {};
    let userInfo = {};
    let multiAnswers = {};
    
    // Mapping des écrans (questions + wow breaks)
    const screenFlow = [
        'q-0', 'q-1', 'q-2-3', 'q-4', 'q-5', 'q-6', 'q-7', 'q-8', 'q-9',
        'wow-1', // Après heures assis
        'q-10', 'q-11', 'q-12', 'q-13', 'q-14', 'q-15',
        'wow-2', // Après digestion
        'q-16', 'q-17', 'q-18', 'q-19', 'q-20', 'q-21', 'q-22', 'q-23',
        'wow-3', // Après environnement
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
    
    // Questions complètes index9
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
            max: 100 
        },
        { 
            id: 'weight_height', 
            text: 'Ton poids et ta taille ?',
            type: 'dual_number',
            fields: [
                { id: 'weight', label: 'Poids (kg)', min: 40, max: 200 },
                { id: 'height', label: 'Taille (cm)', min: 140, max: 220 }
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
                'Cette année',
                'Je ne sais plus'
            ],
            type: 'single'
        },
        {
            id: 'blockers',
            text: 'Qu\'est-ce qui t\'a empêché d\'optimiser ta santé avant ?',
            options: [
                'Manque de temps',
                'Trop d\'infos contradictoires',
                'Pas de résultats visibles',
                'Motivation qui retombe',
                'Ne sais pas par où commencer',
                'Manque de soutien'
            ],
            type: 'multi',
            max: 'unlimited'
        },
        {
            id: 'stairs_test',
            text: 'Test : monter 2 étages à pied',
            options: [
                'Facile, en parlant',
                'Léger essoufflement',
                'Besoin de reprendre mon souffle',
                'Très difficile',
                'J\'évite les escaliers'
            ],
            type: 'single'
        },
        {
            id: 'sitting_hours',
            text: 'Heures assis par jour :',
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
            id: 'night_wakeups',
            text: 'Réveils nocturnes :',
            options: [
                'Jamais',
                '1 fois',
                '2-3 fois',
                '4+ fois',
                'Insomnie chronique'
            ],
            type: 'single'
        },
        {
            id: 'cycle_libido',
            text: '', // Défini dynamiquement
            options: [],
            type: 'single',
            conditional: true
        },
        {
            id: 'first_crash',
            text: 'Ton premier crash énergétique arrive :',
            options: [
                'Jamais',
                'Après 17h',
                'Vers 14h-15h',
                'Juste après le déjeuner',
                'Dès le matin'
            ],
            type: 'single'
        },
        {
            id: 'weight_vs_ideal',
            text: 'Ton poids vs ton idéal :',
            options: [
                'Parfait',
                '+2-5 kg',
                '+5-10 kg',
                '+10-15 kg',
                '+15 kg ou plus'
            ],
            type: 'single'
        },
        {
            id: 'digestion',
            text: 'Ta digestion au quotidien :',
            options: [
                'Parfaite comme une horloge',
                'Quelques inconforts occasionnels',
                'Ballonnements fréquents',
                'Problèmes quotidiens',
                'Chaos intestinal permanent'
            ],
            type: 'single'
        },
        {
            id: 'joint_pain',
            text: 'Douleurs articulaires :',
            options: [
                'Jamais',
                'Après effort intense seulement',
                'Régulièrement',
                'Chroniques',
                'Handicapantes'
            ],
            type: 'single'
        },
        {
            id: 'memory_focus',
            text: 'Mémoire et focus :',
            options: [
                'Excellents',
                'Quelques oublis mineurs',
                'Difficultés fréquentes',
                'Brouillard mental',
                'Problèmes inquiétants'
            ],
            type: 'single'
        },
        {
            id: 'symptoms_hormonal',
            text: '', // Défini dynamiquement
            options: [],
            type: 'single',
            conditional: true
        },
        {
            id: 'infections_frequency',
            text: 'Tu attrapes des rhumes/grippes :',
            options: [
                'Jamais (système immunitaire de warrior)',
                'Rarement (1 fois/an max)',
                'Normalement (2-3 fois/an)',
                'Souvent (4-5 fois/an)',
                'Tout le temps (système KO)'
            ],
            type: 'single'
        },
        {
            id: 'recovery',
            text: 'Récupération après effort :',
            options: [
                'Moins de 24h',
                '24-48h',
                '48-72h',
                'Plus de 72h',
                'Je ne récupère jamais vraiment'
            ],
            type: 'single'
        },
        {
            id: 'stress_level',
            text: 'Ton niveau de stress moyen :',
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
            id: 'skin_quality',
            text: 'Qualité de ta peau :',
            options: [
                'Éclatante',
                'Correcte pour mon âge',
                'Terne/sèche',
                'Problématique',
                'Vieillissement accéléré visible'
            ],
            type: 'single'
        },
        {
            id: 'environment',
            text: 'Ton environnement :',
            options: [
                'Campagne/nature',
                'Petite ville (<50k hab)',
                'Grande ville',
                'Mégapole',
                'Zone très polluée'
            ],
            type: 'single'
        },
        {
            id: 'sun_exposure',
            text: 'Exposition soleil (sans lunettes le matin) :',
            options: [
                'Quotidienne >30min',
                'Quelques fois/semaine',
                'Weekends seulement',
                'Rarement',
                'Jamais (vampire mode)'
            ],
            type: 'single'
        },
        {
            id: 'nature_time',
            text: 'Temps dans la nature/semaine :',
            options: [
                '>10h',
                '5-10h',
                '2-5h',
                '<2h',
                'Zéro nature'
            ],
            type: 'single'
        },
        {
            id: 'sleep_quality',
            text: 'Qualité de ton sommeil :',
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
            id: 'bedtime',
            text: 'Heure habituelle du coucher :',
            options: [
                'Avant 22h',
                '22h-23h',
                '23h-minuit',
                'Après minuit',
                'Horaires chaotiques'
            ],
            type: 'single'
        },
        {
            id: 'screen_before_bed',
            text: 'Écrans avant de dormir :',
            options: [
                'Jamais (coupure 2h avant)',
                '30min avant',
                '1h avant',
                'Jusqu\'au coucher',
                'Dans le lit'
            ],
            type: 'single'
        },
        {
            id: 'breakfast',
            text: 'Petit-déjeuner type :',
            options: [
                'Protéines + bons gras',
                'Équilibré varié',
                'Sucré (pain blanc, confiture)',
                'Juste café/rien'
            ],
            type: 'single'
        },
        {
            id: 'hydration',
            text: 'Hydratation quotidienne (eau pure) :',
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
            text: 'Consommation d\'alcool/semaine :',
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
            id: 'physical_activities',
            text: 'Activités physiques pratiquées :',
            options: [
                'Marche active',
                'Course à pied',
                'Musculation/CrossFit',
                'Yoga/Pilates',
                'Natation',
                'Sports collectifs',
                'Vélo',
                'Arts martiaux',
                'Danse',
                'Aucune activité'
            ],
            type: 'multi',
            max: 'unlimited'
        },
        {
            id: 'sport_frequency',
            text: 'Fréquence sport/semaine :',
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
                'NAD+',
                'Ashwagandha',
                'Aucun'
            ],
            type: 'multi',
            max: 'unlimited'
        },
        {
            id: 'tracking_tools',
            text: 'Outils de tracking utilisés :',
            options: [
                'Apple Watch',
                'Garmin',
                'Whoop',
                'Oura Ring',
                'Fitbit',
                'Balance connectée',
                'App nutrition',
                'App méditation',
                'Tensiomètre',
                'Glucomètre',
                'Aucun'
            ],
            type: 'multi',
            max: 'unlimited'
        },
        {
            id: 'mental_pressure',
            text: '', // Défini dynamiquement
            options: [],
            type: 'single',
            conditional: true
        },
        {
            id: 'social_relations',
            text: 'Relations sociales :',
            options: [
                'Épanouissantes',
                'Satisfaisantes',
                'Limitées',
                'Conflictuelles',
                'Isolement'
            ],
            type: 'single'
        },
        {
            id: 'last_vacation',
            text: 'Dernières vraies vacances (déconnexion totale) :',
            options: [
                'Il y a moins de 3 mois',
                '3-6 mois',
                '6-12 mois',
                'Plus d\'1 an',
                'Je ne prends jamais de vacances'
            ],
            type: 'single'
        },
        {
            id: 'projection_5years',
            text: 'Dans 5 ans, tu te vois :',
            options: [
                'Au top de ma forme',
                'Stable (stagnation)',
                'En déclin probable',
                'Inquiet pour ma santé',
                'Je n\'ose pas y penser'
            ],
            type: 'single'
        },
        {
            id: 'biggest_fear',
            text: 'Ta plus grande peur santé :',
            options: [
                'Cancer',
                'Infarctus/AVC',
                'Alzheimer/Démence',
                'Douleurs chroniques',
                'Perte d\'autonomie'
            ],
            type: 'single'
        },
        {
            id: 'motivations',
            text: 'Tes motivations pour transformer ta santé :',
            options: [
                'Voir mes enfants/petits-enfants grandir',
                'Rester performant(e) professionnellement',
                'Profiter de la vie longtemps',
                'Ne pas être un poids pour mes proches',
                'Réaliser mes rêves/projets',
                'Être un exemple inspirant',
                'Retrouver ma vitalité d\'avant'
            ],
            type: 'multi',
            max: 'unlimited'
        },
        {
            id: 'health_budget',
            text: 'Budget santé mensuel actuel :',
            options: [
                'Moins de 50€',
                '50-150€',
                '150-300€',
                '300-500€',
                'Plus de 500€'
            ],
            type: 'single'
        },
        {
            id: 'time_available',
            text: 'Temps disponible/jour pour ta santé :',
            options: [
                'Moins de 15min',
                '15-30min',
                '30-60min',
                '1-2h',
                'Plus de 2h'
            ],
            type: 'single'
        }
    ];
    
    // WOW Breaks
    const wowBreaks = {
        'wow-1': {
            icon: '🪑',
            title: 'LA CHAISE QUI TUE',
            badge: '📊 MÉTA-ANALYSE • 595,086 PARTICIPANTS',
            stat: '10h assis = +52% mortalité',
            fact: 'MÊME avec du sport régulier !',
            details: `
                <strong>Sans sport :</strong> +52% mortalité<br>
                <strong>Avec sport :</strong> +34% mortalité<br>
                <small>La solution existe → Détails dans tes résultats</small>
            `,
            source: 'Annals of Internal Medicine, 2017'
        },
        'wow-2': {
            icon: '🧠',
            title: 'TON VENTRE CONTRÔLE TON CERVEAU',
            badge: '📊 NATURE MICROBIOLOGY • 1,054 PARTICIPANTS',
            stat: '95% sérotonine = intestin',
            fact: 'Ton bonheur vient littéralement du ventre !',
            details: `
                <strong>3 semaines</strong> de probiotiques =<br>
                Humeur transformée<br>
                <small>Protocole complet → Dans tes résultats</small>
            `,
            source: 'Nature Microbiology, 2022'
        },
        'wow-3': {
            icon: '🌆',
            title: 'L\'AIR QUI TUE',
            badge: '📊 ENVIRONMENTAL RESEARCH • 42 VILLES',
            stat: 'Pollution = -2.2 ans',
            fact: 'Chaque µg/m³ de PM2.5 = vieillissement accéléré',
            details: `
                <strong>En ville :</strong> +15% inflammation<br>
                <strong>Solution :</strong> Protocole détox<br>
                <small>Plan d\'action → Dans tes résultats</small>
            `,
            source: 'Environmental Research, 2021'
        },
        'wow-4': {
            icon: '💊',
            title: 'LE SUPER-POUVOIR CACHÉ',
            badge: '📊 CELL METABOLISM • HARVARD',
            stat: 'NAD+ : -50% à 40 ans',
            fact: 'La molécule qui fait rajeunir tes cellules',
            details: `
                <strong>Ton énergie cellulaire</strong> s\'effondre<br>
                Mais c\'est réversible en 8 semaines<br>
                <small>Protocole NAD+ → Dans tes résultats</small>
            `,
            source: 'Dr. David Sinclair, Harvard Medical School'
        },
        'wow-5': {
            icon: '💼',
            title: 'L\'INÉGALITÉ FACE À LA MORT',
            badge: '📊 THE LANCET • 1.7 MILLION DE DONNÉES',
            stat: 'Ton métier prédit ta longévité',
            fact: 'Cadre stressé = -9 ans vs artisan',
            details: `
                <strong>MAIS</strong> le biohacking égalise les chances !<br>
                Tu peux battre les statistiques<br>
                <small>Ton protocole anti-stress → Dans tes résultats</small>
            `,
            source: 'The Lancet Public Health, 2023'
        },
        'wow-6': {
            icon: '🧬',
            title: 'TU CONTRÔLES TON DESTIN',
            badge: '📊 SCIENCE • 2,748 JUMEAUX • 40 ANS D\'ÉTUDE',
            stat: '77% = Tes choix',
            fact: 'Génétique = seulement 23% !',
            details: `
                <strong>En 12 semaines tu peux :</strong><br>
                ✓ Modifier 500+ gènes<br>
                ✓ Inverser 3 ans d\'âge cellulaire<br>
                ✓ Activer tes gènes de longévité<br>
                <small>Prêt(e) pour TON protocole personnalisé ?</small>
            `,
            source: 'Science, 2018'
        },
        'wow-7': {
            icon: '⚡',
            title: 'LE MOMENT DE VÉRITÉ',
            badge: '📊 RÉSULTATS BASÉS SUR 1,200+ ÉTUDES',
            stat: 'Ton score arrive...',
            fact: 'Basé sur tes 42 réponses',
            details: `
                <strong>Tu vas découvrir :</strong><br>
                • Ton score de vitalité sur 100<br>
                • Ton âge biologique estimé<br>
                • Tes 3 axes prioritaires<br>
                • Ton protocole personnalisé<br>
                <small>Une dernière étape...</small>
            `,
            source: 'Méta-analyse ORA LIFE'
        }
    };
    
    // Fonctions principales
    function init() {
        renderLanding();
        setupKeyboardNavigation();
    }
    
    function setupKeyboardNavigation() {
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const numberInput = document.querySelector('input[type="number"]:focus');
                if (numberInput) {
                    const btnNext = document.querySelector('.btn-primary');
                    if (btnNext) btnNext.click();
                }
            }
        });
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
        currentQuestionIndex = 0;
        renderScreen();
    }
    
    function renderScreen() {
        const screenId = screenFlow[currentScreen];
        
        if (!screenId) {
            renderResults();
            return;
        }
        
        if (screenId.startsWith('wow-')) {
            renderWowBreak(screenId);
        } else if (screenId === 'email') {
            renderEmailForm();
        } else if (screenId === 'calculating') {
            submitQuiz();
        } else if (screenId === 'results') {
            renderResults();
        } else if (screenId.startsWith('q-')) {
            renderQuestion(screenId);
        }
        
        updateProgressBar();
        updateProgressText();
    }
    
    function renderQuestion(screenId) {
        // Parse question index
        const parts = screenId.substring(2).split('-');
        const indices = parts.map(p => parseInt(p));
        
        let html = `<div class="card">`;
        
        if (indices.length === 2) {
            // Dual question (poids + taille)
            const q = questions[indices[0]];
            html += `
                <h2 class="question-text">${q.text}</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label>${q.fields[0].label}</label>
                        <input type="number" id="${q.fields[0].id}" 
                               min="${q.fields[0].min}" max="${q.fields[0].max}" 
                               placeholder="${q.fields[0].min}-${q.fields[0].max}" />
                    </div>
                    <div class="form-group">
                        <label>${q.fields[1].label}</label>
                        <input type="number" id="${q.fields[1].id}" 
                               min="${q.fields[1].min}" max="${q.fields[1].max}"
                               placeholder="${q.fields[1].min}-${q.fields[1].max}" />
                    </div>
                </div>
                <div class="imc-container" id="imc-container" style="display:none;">
                    <div class="imc-value" id="imc-value">--</div>
                    <div class="imc-label" id="imc-label">Calcul IMC...</div>
                    <div class="imc-gauge">
                        <div class="imc-pointer" id="imc-pointer"></div>
                    </div>
                    <div class="imc-ranges">
                        <span>Insuffisant</span>
                        <span>Normal</span>
                        <span>Surpoids</span>
                        <span>Obésité</span>
                    </div>
                </div>
                <button class="btn-primary" onclick="Quiz.answerDual()">Suivant →</button>
            `;
        } else {
            const q = questions[indices[0]];
            
            // Setup conditional questions
            if (q.conditional) {
                setupConditionalQuestion(q);
            }
            
            if (q.type === 'visual' && q.id === 'gender') {
                html += `
                    <h2 class="question-text">${q.text}</h2>
                    <div class="visual-options">
                        <div class="visual-option" onclick="Quiz.answer('${q.id}', 'homme')">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" alt="Homme">
                            <div class="label">Homme</div>
                        </div>
                        <div class="visual-option" onclick="Quiz.answer('${q.id}', 'femme')">
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
                            `<div class="option" onclick="Quiz.answer('${q.id}', '${opt.replace(/'/g, "\\'")}')">${opt}</div>`
                        ).join('')}
                    </div>
                `;
            } else if (q.type === 'number') {
                html += `
                    <h2 class="question-text">${q.text}</h2>
                    <input type="number" id="${q.id}" min="${q.min}" max="${q.max}" 
                           placeholder="${q.min}-${q.max}" />
                    <button class="btn-primary" onclick="Quiz.answerNumber('${q.id}')">Suivant →</button>
                `;
            } else if (q.type === 'multi') {
                const maxText = q.max === 'unlimited' ? 'Choisis toutes les options pertinentes' : `Choisis jusqu'à ${q.max} options`;
                html += `
                    <h2 class="question-text">${q.text}</h2>
                    <p class="multi-select-info">${maxText}</p>
                    <div class="${q.options.length > 6 ? 'options-grid' : 'options'}">
                        ${q.options.map(opt => 
                            `<div class="option multi" data-question="${q.id}" onclick="Quiz.toggleMulti('${q.id}', '${opt.replace(/'/g, "\\'")}')">${opt}</div>`
                        ).join('')}
                    </div>
                    <button class="btn-primary" onclick="Quiz.validateMulti('${q.id}')">Valider →</button>
                `;
            }
        }
        
        if (currentScreen > 0) {
            html += `<button class="btn-back" onclick="Quiz.prev()">← Retour</button>`;
        }
        
        html += `</div>`;
        document.getElementById('quiz-container').innerHTML = html;
        
        // Setup IMC listener
        if (screenId === 'q-2-3') {
            setupIMCListeners();
        }
        
        // Restore multi-select state
        if (q && q.type === 'multi' && multiAnswers[q.id]) {
            multiAnswers[q.id].forEach(value => {
                const el = Array.from(document.querySelectorAll('.option.multi'))
                    .find(e => e.textContent === value);
                if (el) el.classList.add('selected');
            });
        }
    }
    
    function setupConditionalQuestion(q) {
        const gender = answers.gender;
        
        if (q.id === 'cycle_libido') {
            if (gender === 'femme') {
                q.text = 'Où en es-tu dans ton cycle féminin ?';
                q.options = [
                    'Cycle régulier',
                    'Cycle irrégulier',
                    'Grossesse',
                    'Périménopause',
                    'Ménopause',
                    'Post-ménopause',
                    'Aménorrhée'
                ];
            } else {
                q.text = 'Ta libido actuelle :';
                q.options = [
                    'Au top',
                    'Normale',
                    'En baisse',
                    'Problématique',
                    'Éteinte'
                ];
            }
        } else if (q.id === 'symptoms_hormonal') {
            if (gender === 'femme') {
                q.text = 'Symptômes hormonaux :';
                q.options = [
                    'Aucun',
                    'SPM léger',
                    'SPM intense',
                    'Bouffées de chaleur',
                    'Troubles multiples'
                ];
            } else {
                q.text = 'Masse musculaire :';
                q.options = [
                    'En progression',
                    'Stable',
                    'Légère perte',
                    'Perte importante',
                    'Fonte musculaire'
                ];
            }
        } else if (q.id === 'mental_pressure') {
            if (gender === 'femme') {
                q.text = 'Charge mentale quotidienne :';
                q.options = [
                    'Légère',
                    'Gérable',
                    'Lourde',
                    'Écrasante',
                    'Burn-out maternel'
                ];
            } else {
                q.text = 'Pression professionnelle :';
                q.options = [
                    'Stimulante',
                    'Normale',
                    'Élevée',
                    'Toxique',
                    'Insoutenable'
                ];
            }
        }
    }
    
    function setupIMCListeners() {
        const weightInput = document.getElementById('weight');
        const heightInput = document.getElementById('height');
        
        function calculateIMC() {
            const weight = parseFloat(weightInput.value);
            const height = parseFloat(heightInput.value);
            
            if (weight && height) {
                const imc = (weight / ((height/100) * (height/100))).toFixed(1);
                const container = document.getElementById('imc-container');
                const value = document.getElementById('imc-value');
                const label = document.getElementById('imc-label');
                const pointer = document.getElementById('imc-pointer');
                
                container.style.display = 'block';
                value.textContent = imc;
                
                let position = 50;
                let status = 'Normal';
                
                if (imc < 18.5) {
                    position = 10;
                    status = 'Insuffisant';
                } else if (imc < 25) {
                    position = 30;
                    status = 'Normal';
                } else if (imc < 30) {
                    position = 55;
                    status = 'Surpoids';
                } else if (imc < 35) {
                    position = 75;
                    status = 'Obésité';
                } else {
                    position = 90;
                    status = 'Obésité sévère';
                }
                
                pointer.style.left = position + '%';
                label.textContent = `IMC : ${imc} - ${status}`;
            }
        }
        
        if (weightInput) weightInput.addEventListener('input', calculateIMC);
        if (heightInput) heightInput.addEventListener('input', calculateIMC);
    }
    
    function renderWowBreak(wowId) {
        const wb = wowBreaks[wowId];
        if (!wb) return;
        
        const html = `
            <div class="card wow-break">
                <div class="wow-header">
                    <div class="wow-icon">${wb.icon}</div>
                    <h2 class="wow-title">${wb.title}</h2>
                </div>
                
                <div class="wow-content">
                    <span class="study-badge">${wb.badge}</span>
                    
                    <div class="wow-stat">${wb.stat}</div>
                    
                    <p style="text-align: center; font-weight: 600; color: #FF4444; margin: 20px 0;">
                        ${wb.fact}
                    </p>
                    
                    <div class="wow-fact">
                        ${wb.details}
                    </div>
                    
                    <p style="font-size: 12px; color: #999; margin-top: 20px;">
                        ${wb.source}
                    </p>
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
                <h2 class="question-text">Obtiens ton score personnalisé</h2>
                <p style="text-align: center; color: var(--text-light); margin-bottom: 30px;">
                    Reçois ton protocole complet basé sur tes 42 réponses
                </p>
                
                <div class="form-group">
                    <label>Prénom</label>
                    <input type="text" id="name" placeholder="Ton prénom" />
                </div>
                
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email" placeholder="ton@email.com" />
                </div>
                
                <div class="form-group">
                    <label>Téléphone (optionnel)</label>
                    <input type="tel" id="phone" placeholder="+33 6 12 34 56 78" />
                </div>
                
                <button class="btn-primary" onclick="Quiz.next()">
                    RECEVOIR MON SCORE →
                </button>
                
                <p style="text-align: center; color: var(--text-light); font-size: 12px; margin-top: 20px;">
                    🔒 100% confidentiel • Résultats immédiats • Garantie satisfait ou remboursé
                </p>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
    }
    
    async function submitQuiz() {
        // Get user info
        userInfo.name = document.getElementById('name').value;
        userInfo.email = document.getElementById('email').value;
        userInfo.phone = document.getElementById('phone').value || '';
        
        if (!userInfo.name || !userInfo.email) {
            alert('Merci de remplir tous les champs obligatoires');
            currentScreen--;
            renderScreen();
            return;
        }
        
        // Show calculating screen
        const html = `
            <div class="card calculating">
                <div class="spinner"></div>
                <h2>Analyse de tes réponses...</h2>
                <p>Calcul de ton profil biohacking personnalisé</p>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
        
        try {
            // Calculate score via API
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
                timestamp: new Date().toISOString()
            };
            
            await fetch(SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
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
                message: '👍 BON NIVEAU ! Tu es dans le TOP 40%',
                level: 'Bon',
                priorities: [
                    'Hydratation : Passe à 2.5L d\'eau pure/jour',
                    'Sommeil : Vise 7-9h de qualité chaque nuit',
                    'Mouvement : Pause active toutes les heures'
                ],
                biologicalAge: parseInt(answers.age) + 2
            };
            renderResults();
        }
    }
    
    function renderResults() {
        const result = window.quizResult || { score: 73 };
        const age = parseInt(answers.age) || 40;
        
        const html = `
            <div class="card results">
                <h1>${userInfo.name}, voici ton Score de Vieillissement</h1>
                
                <div class="score-container">
                    <div class="score-circle">
                        <svg viewBox="0 0 200 200">
                            <circle cx="100" cy="100" r="90" stroke="#E0E0E0" />
                            <circle cx="100" cy="100" r="90" stroke="url(#gradient2)" 
                                    stroke-dasharray="${result.score * 5.65} 565" />
                            <defs>
                                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style="stop-color:var(--primary-blue);stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:var(--accent-green);stop-opacity:1" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div class="score-value">${result.score}</div>
                    </div>
                </div>
                
                <div class="score-interpretation">
                    <h2>${result.message}</h2>
                    <p>Basé sur l'analyse de tes 42 réponses et les corrélations épidémiologiques</p>
                </div>
                
                <div class="results-details">
                    <h3>📊 Ton Analyse Détaillée :</h3>
                    
                    <div class="estimation-hb">
                        <h4>Estimation Âge Biologique :</h4>
                        <div class="hb-age-value">${result.biologicalAge || age} ans</div>
                        <p>Âge chronologique : ${age} ans</p>
                        <p><small>*Basé sur tes réponses et les corrélations épidémiologiques</small></p>
                    </div>
                    
                    <div class="risk-analysis">
                        <h3>📊 TENDANCE BASÉE SUR TES RÉPONSES</h3>
                        <div class="risk-stat">+12 ans</div>
                        <p class="risk-text">
                            Si tu ne changes rien, ton vieillissement biologique continuera d'accélérer.
                            <br><br>
                            <strong>MAIS</strong> avec les bons protocoles, tu peux inverser la tendance en 12 semaines.
                        </p>
                    </div>
                    
                    <div class="attention-points">
                        <h4>⚠️ TES 3 AXES PRIORITAIRES :</h4>
                        <ul>
                            ${result.priorities ? result.priorities.map(p => `<li>${p}</li>`).join('') : `
                            <li>Hydratation : Passe à 2.5L d'eau pure/jour</li>
                            <li>Sommeil : Vise 7-9h de qualité chaque nuit</li>
                            <li>Mouvement : Pause active toutes les heures</li>
                            `}
                        </ul>
                    </div>
                </div>
                
                <button class="btn-primary" onclick="window.open('https://calendly.com/oralife/consultation', '_blank')">
                    RÉSERVER MA CONSULTATION GRATUITE →
                </button>
                
                <p style="text-align: center; font-size: 14px; color: var(--text-light); margin-top: 25px;">
                    📧 Ton analyse complète a été envoyée à <strong>${userInfo.email}</strong><br>
                    <small>(Vérifie tes spams si tu ne la reçois pas dans 5 minutes)</small>
                </p>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
    }
    
    // Actions functions
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
    
    function answerDual() {
        const weight = document.getElementById('weight').value;
        const height = document.getElementById('height').value;
        
        if (weight && height) {
            answers.weight = weight;
            answers.height = height;
            next();
        } else {
            alert('Merci de remplir les deux champs');
        }
    }
    
    function toggleMulti(id, value) {
        if (!multiAnswers[id]) multiAnswers[id] = [];
        
        const q = questions.find(q => q.id === id);
        const maxSelections = q.max === 'unlimited' ? 999 : q.max;
        
        // Si "Aucun" est sélectionné, désélectionner tout
        if (value === 'Aucun' || value === 'Aucune activité') {
            multiAnswers[id] = [value];
            document.querySelectorAll(`.option.multi[data-question="${id}"]`).forEach(el => {
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
            document.querySelectorAll(`.option.multi[data-question="${id}"]`).forEach(el => {
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
        } else if (q.max !== 'unlimited') {
            alert(`Tu peux choisir maximum ${maxSelections} options`);
            return;
        }
        
        // Update UI
        document.querySelectorAll(`.option.multi[data-question="${id}"]`).forEach(el => {
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
        renderScreen();
    }
    
    function prev() {
        currentScreen--;
        renderScreen();
    }
    
    function updateProgressBar() {
        const progress = (currentScreen / screenFlow.length) * 100;
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
                progressText.textContent = 'Continue comme ça !';
            } else if (currentScreen < 40) {
                progressText.textContent = 'Presque fini !';
            } else {
                progressText.textContent = 'Dernières questions !';
            }
        }
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
        toggleMulti,
        validateMulti,
        renderScreen
    };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    Quiz.init();
});


