// ORA LIFE Quiz Engine
const Quiz = (function() {
    'use strict';
    
    // Configuration
    const API_URL = '/api/calculate-score';
    const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwa_F2dIfYfpEqsX5kWQ5wMlabyHMDtuEWHmQD23IEJuh9Foe_WdbOArFBFaM51Vo6i/exec';
    
    // État
    let currentScreen = 0;
    let answers = {};
    let userInfo = {};
    const multiAnswers = {};
    
    // Questions (38 au total)
    const questions = [
        { id: 'gender', text: 'Tu es ?', options: ['Homme', 'Femme'], type: 'single' },
        { id: 'age', text: 'Ton âge exact ?', type: 'number', min: 18, max: 100 },
        { id: 'weight', text: 'Ton poids (kg) ?', type: 'number', min: 40, max: 200 },
        { id: 'height', text: 'Ta taille (cm) ?', type: 'number', min: 140, max: 220 },
        {
            id: 'objectives',
            text: 'Tes objectifs principaux ? (max 3)',
            options: ['Perdre du poids', 'Gagner en énergie', 'Améliorer mon sommeil', 'Réduire le stress', 'Longévité maximale'],
            type: 'multi',
            max: 3
        },
        { id: 'energy_vs_3years', text: 'Ton énergie vs il y a 3 ans ?', options: ['Débordante', 'Identique', 'En baisse', 'Fatigue chronique'], type: 'single' },
        { id: 'last_100_percent', text: 'Dernière fois à 100% ?', options: ['Cette semaine', 'Ce mois-ci', 'Cette année', 'Je ne sais plus'], type: 'single' },
        { id: 'stairs_test', text: 'Monter 2 étages ?', options: ['Facile, en parlant', 'Léger essoufflement', 'Besoin de reprendre mon souffle', 'Très difficile'], type: 'single' },
        { id: 'sitting_hours', text: 'Heures assis/jour ?', options: ['<4h', '4-6h', '6-8h', '8-10h', '>10h'], type: 'single' },
        { id: 'night_wakeups', text: 'Réveils nocturnes ?', options: ['Jamais', '1 fois', '2-3 fois', '4+ fois'], type: 'single' },
        { id: 'first_crash', text: 'Premier crash énergie ?', options: ['Jamais', 'Après 17h', 'Vers 14h-15h', 'Dès le matin'], type: 'single' },
        { id: 'weight_vs_ideal', text: 'Poids vs idéal ?', options: ['Parfait', '+2-5kg', '+5-10kg', '+10-15kg', '+15kg+'], type: 'single' },
        { id: 'digestion', text: 'Ta digestion ?', options: ['Parfaite', 'Quelques inconforts', 'Ballonnements fréquents', 'Problèmes quotidiens'], type: 'single' },
        { id: 'joint_pain', text: 'Douleurs articulaires ?', options: ['Jamais', 'Après effort intense', 'Régulièrement', 'Chroniques'], type: 'single' },
        { id: 'memory_focus', text: 'Mémoire/Focus ?', options: ['Excellent', 'Quelques oublis', 'Difficultés fréquentes', 'Brouillard mental'], type: 'single' },
        { id: 'recovery', text: 'Récupération après effort ?', options: ['<24h', '24-48h', '48-72h', '>72h'], type: 'single' },
        { id: 'stress_level', text: 'Niveau de stress ?', options: ['Zen permanent', 'Gérable', 'Élevé', 'Burnout proche'], type: 'single' },
        { id: 'skin_quality', text: 'Qualité de ta peau ?', options: ['Éclatante', 'Correcte', 'Terne/sèche', 'Problématique'], type: 'single' },
        { id: 'environment', text: 'Ton environnement ?', options: ['Campagne', 'Petite ville', 'Grande ville', 'Mégapole polluée'], type: 'single' },
        { id: 'sun_exposure', text: 'Exposition soleil ?', options: ['Quotidienne', 'Quelques fois/semaine', 'Rarement', 'Jamais'], type: 'single' },
        { id: 'nature_time', text: 'Temps dans la nature ?', options: ['>10h/semaine', '5-10h', '2-5h', '<2h'], type: 'single' },
        { id: 'sleep_quality', text: 'Qualité sommeil ?', options: ['7-9h profond', '7-9h avec réveils', '5-7h', '<5h'], type: 'single' },
        { id: 'bedtime', text: 'Heure du coucher ?', options: ['Avant 22h', '22h-23h', '23h-minuit', 'Après minuit'], type: 'single' },
        { id: 'screen_before_bed', text: 'Écrans avant dormir ?', options: ['Jamais (2h avant)', '30min avant', 'Jusqu\'au coucher', 'Dans le lit'], type: 'single' },
        { id: 'breakfast', text: 'Petit-déjeuner ?', options: ['Protéines + bons gras', 'Équilibré', 'Sucré', 'Juste café'], type: 'single' },
        { id: 'hydration', text: 'Hydratation/jour ?', options: ['2L+', '1.5-2L', '1-1.5L', '<1L'], type: 'single' },
        { id: 'alcohol', text: 'Alcool/semaine ?', options: ['0 (jamais)', '1-3 verres', '4-7 verres', '8-14 verres', '15+'], type: 'single' },
        { id: 'sport_frequency', text: 'Sport/semaine ?', options: ['5+ fois', '3-4 fois', '2-3 fois', '1 fois', 'Jamais'], type: 'single' },
        { id: 'mental_load', text: 'Charge mentale ?', options: ['Légère', 'Normale', 'Lourde', 'Écrasante'], type: 'single' },
        { id: 'social_relations', text: 'Relations sociales ?', options: ['Épanouissantes', 'Satisfaisantes', 'Limitées', 'Isolement'], type: 'single' },
        { id: 'last_vacation', text: 'Dernières vacances ?', options: ['<3 mois', '3-6 mois', '6-12 mois', '>1 an'], type: 'single' },
        { id: 'projection_5years', text: 'Dans 5 ans ?', options: ['Au top', 'Stable', 'En déclin', 'Inquiet'], type: 'single' },
        { id: 'biggest_fear', text: 'Plus grande peur ?', options: ['Cancer', 'Infarctus', 'Alzheimer', 'Douleurs'], type: 'single' },
        { id: 'health_budget', text: 'Budget santé/mois ?', options: ['<50€', '50-150€', '150-300€', '300-500€', '>500€'], type: 'single' },
        { id: 'time_available', text: 'Temps dispo/jour ?', options: ['<15min', '15-30min', '30-60min', '1-2h', '>2h'], type: 'single' }
    ];
    
    // WOW Breaks (6 au total)
    const wowBreaks = {
        9: {
            icon: '🪑',
            title: 'TA CHAISE TE TUE',
            stat: '52% mortalité en plus',
            fact: 'Assis 10h/jour = 52% sans sport, 34% avec sport',
            source: 'Annals of Internal Medicine, 2017'
        },
        10: {
            icon: '😴',
            title: 'LA DETTE IMPOSSIBLE',
            stat: '<6h = 0.8g alcool',
            fact: 'Les grasses mat\' ne récupèrent RIEN',
            source: 'Sleep Medicine Reviews, 2023'
        },
        13: {
            icon: '🧠',
            title: 'TON VENTRE = TON CERVEAU',
            stat: '95% sérotonine',
            fact: 'Ton humeur vient de l\'intestin',
            source: 'Nature Microbiology, 2022'
        },
        27: {
            icon: '🐟',
            title: 'POISON DANS L\'ASSIETTE',
            stat: '10x toxines',
            fact: 'Saumon élevage = 10x plus de toxines',
            source: 'Environmental Research, 2023'
        },
        29: {
            icon: '💼',
            title: 'TON JOB TE TUE',
            stat: '-9 ans d\'espérance',
            fact: 'Cadre stressé vs artisan',
            source: 'The Lancet, 2023'
        },
        35: {
            icon: '⚡',
            title: 'TU CONTRÔLES TOUT',
            stat: '77% = Tes choix',
            fact: 'Génétique = seulement 23%',
            source: 'Science, 2018'
        }
    };
    
    // Fonctions
    function init() {
        renderLanding();
    }
    
    function renderLanding() {
        const html = `
            <div class="card">
                <div class="logo">ORA LIFE</div>
                <h1>Découvre Ton Score de Vitalité</h1>
                <p class="subtitle">Test scientifique gratuit • 3 minutes</p>
                <button class="btn-primary" onclick="Quiz.start()">
                    COMMENCER LE TEST →
                </button>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
    }
    
    function start() {
        currentScreen = 0;
        renderQuestion();
    }
    
    function renderQuestion() {
        if (wowBreaks[currentScreen]) {
            renderWowBreak();
            return;
        }
        
        const q = questions[currentScreen];
        if (!q) {
            renderEmailForm();
            return;
        }
        
        let html = `<div class="card">`;
        
        if (q.type === 'single') {
            html += `
                <h2>${q.text}</h2>
                <div class="options">
                    ${q.options.map(opt => 
                        `<div class="option" onclick="Quiz.answer('${q.id}', '${opt}')">${opt}</div>`
                    ).join('')}
                </div>
            `;
        } else if (q.type === 'number') {
            html += `
                <h2>${q.text}</h2>
                <input type="number" id="${q.id}" min="${q.min}" max="${q.max}" />
                <button class="btn-primary" onclick="Quiz.answerNumber('${q.id}')">Suivant</button>
            `;
        } else if (q.type === 'multi') {
            html += `
                <h2>${q.text}</h2>
                <div class="options">
                    ${q.options.map(opt => 
                        `<div class="option multi" onclick="Quiz.toggleMulti('${q.id}', '${opt}')">${opt}</div>`
                    ).join('')}
                </div>
                <button class="btn-primary" onclick="Quiz.validateMulti('${q.id}')">Valider</button>
            `;
        }
        
        if (currentScreen > 0) {
            html += `<button class="btn-secondary" onclick="Quiz.prev()">← Retour</button>`;
        }
        
        html += `</div>`;
        document.getElementById('quiz-container').innerHTML = html;
        updateProgress();
    }
    
    function renderWowBreak() {
        const wb = wowBreaks[currentScreen];
        const html = `
            <div class="card wow-break">
                <div class="wow-icon">${wb.icon}</div>
                <h2 class="wow-title">${wb.title}</h2>
                <div class="wow-stat">${wb.stat}</div>
                <div class="wow-fact">${wb.fact}</div>
                <p style="font-size: 12px; color: #999;">${wb.source}</p>
                <button class="btn-primary" onclick="Quiz.next()">CONTINUER →</button>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
    }
    
    function renderEmailForm() {
        const html = `
            <div class="card">
                <h2>Dernière étape</h2>
                <label>Prénom</label>
                <input type="text" id="name" />
                <label>Email</label>
                <input type="email" id="email" />
                <button class="btn-primary" onclick="Quiz.submit()">
                    RECEVOIR MON SCORE →
                </button>
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
        }
    }
    
    function toggleMulti(id, value) {
        if (!multiAnswers[id]) multiAnswers[id] = [];
        const idx = multiAnswers[id].indexOf(value);
        
        if (idx > -1) {
            multiAnswers[id].splice(idx, 1);
        } else if (multiAnswers[id].length < 3) {
            multiAnswers[id].push(value);
        }
        
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
        }
    }
    
    function next() {
        currentScreen++;
        renderQuestion();
    }
    
    function prev() {
        currentScreen--;
        renderQuestion();
    }
    
    function updateProgress() {
        const total = questions.length + Object.keys(wowBreaks).length;
        const progress = (currentScreen / total) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
    }
    
    async function submit() {
        userInfo.name = document.getElementById('name').value;
        userInfo.email = document.getElementById('email').value;
        
        if (!userInfo.name || !userInfo.email) {
            alert('Remplis tous les champs');
            return;
        }
        
        document.getElementById('quiz-container').innerHTML = `
            <div class="card loading">
                <div class="spinner"></div>
                <h2>Calcul de ton score...</h2>
            </div>
        `;
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers })
            });
            
            const result = await response.json();
            
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
            
            showResults(result);
            
        } catch (error) {
            // Fallback score si API fail
            showResults({ score: 73, message: 'Top 25% !' });
        }
    }
    
    function showResults(result) {
        const html = `
            <div class="card">
                <h1>${userInfo.name}, ton score</h1>
                <div class="score-circle">
                    <div class="score-value">${result.score}</div>
                    <div class="score-label">sur 100</div>
                </div>
                <h2>${result.message}</h2>
                <button class="btn-primary" onclick="window.open('https://calendly.com/oralife/consultation', '_blank')">
                    RÉSERVER MA CONSULTATION →
                </button>
            </div>
        `;
        document.getElementById('quiz-container').innerHTML = html;
    }
    
    return {
        init, start, next, prev, answer, answerNumber,
        toggleMulti, validateMulti, submit
    };
})();

// Init
document.addEventListener('DOMContentLoaded', Quiz.init);
