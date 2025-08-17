export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { answers } = req.body;
    
    // SCORING SCIENTIFIQUE PONDÉRÉ BASÉ SUR LA LITTÉRATURE
    const scoringWeights = {
        // TIER 1 - IMPACT MAXIMAL (>20% mortalité)
        alcohol: {
            '0 (jamais)': 30,
            '1-3 verres': 24,
            '4-7 verres (1/jour)': 16,
            '8-14 verres (2/jour)': 8,
            '15+ verres': 0
        },
        
        sleep_quality: {
            '7-9h de sommeil profond': 30,
            '7-9h avec réveils': 23,
            '5-7h agité': 15,
            'Moins de 5h': 5,
            'Insomnie chronique': 0
        },
        
        sport_frequency: {
            '5+ fois': 30,
            '3-4 fois': 25,
            '2-3 fois': 18,
            '1 fois': 10,
            'Jamais': 0
        },
        
        sitting_hours: {
            'Moins de 4h': 25,
            '4-6h': 20,
            '6-8h': 14,
            '8-10h': 7,
            'Plus de 10h': 0
        },
        
        // TIER 2 - IMPACT FORT (10-20% mortalité)
        stress_level: {
            'Zen permanent': 20,
            'Gérable': 16,
            'Élevé': 10,
            'Très élevé': 5,
            'Burnout proche': 0
        },
        
        hydration: {
            '2L+ religieusement': 20,
            '1.5-2L': 16,
            '1-1.5L': 11,
            'Moins d\'1L': 5,
            'Principalement café/sodas': 0
        },
        
        breakfast: {
            'Protéines + bons gras': 20,
            'Équilibré varié': 15,
            'Sucré (pain blanc, confiture)': 8,
            'Juste café/rien': 5
        },
        
        infections_frequency: {
            'Jamais (système immunitaire de warrior)': 20,
            'Rarement (1 fois/an max)': 16,
            'Normalement (2-3 fois/an)': 12,
            'Souvent (4-5 fois/an)': 6,
            'Tout le temps (système KO)': 0
        },
        
        // TIER 3 - IMPACT MODÉRÉ (5-10% mortalité)
        digestion: {
            'Parfaite comme une horloge': 15,
            'Quelques inconforts occasionnels': 12,
            'Ballonnements fréquents': 8,
            'Problèmes quotidiens': 4,
            'Chaos intestinal permanent': 0
        },
        
        recovery: {
            'Moins de 24h': 15,
            '24-48h': 11,
            '48-72h': 7,
            'Plus de 72h': 3,
            'Je ne récupère jamais vraiment': 0
        },
        
        sun_exposure: {
            'Quotidienne >30min': 15,
            'Quelques fois/semaine': 11,
            'Weekends seulement': 8,
            'Rarement': 4,
            'Jamais (vampire mode)': 0
        },
        
        nature_time: {
            '>10h': 15,
            '5-10h': 12,
            '2-5h': 8,
            '<2h': 4,
            'Zéro nature': 0
        },
        
        night_wakeups: {
            'Jamais': 15,
            '1 fois': 11,
            '2-3 fois': 7,
            '4+ fois': 3,
            'Insomnie chronique': 0
        },
        
        bedtime: {
            'Avant 22h': 15,
            '22h-23h': 12,
            '23h-minuit': 8,
            'Après minuit': 4,
            'Horaires chaotiques': 0
        },
        
        screen_before_bed: {
            'Jamais (coupure 2h avant)': 15,
            '30min avant': 12,
            '1h avant': 9,
            'Jusqu\'au coucher': 5,
            'Dans le lit': 0
        },
        
        // TIER 4 - IMPACT LÉGER (<5% mortalité)
        skin_quality: {
            'Éclatante': 10,
            'Correcte pour mon âge': 8,
            'Terne/sèche': 5,
            'Problématique': 3,
            'Vieillissement accéléré visible': 0
        },
        
        social_relations: {
            'Épanouissantes': 10,
            'Satisfaisantes': 8,
            'Limitées': 5,
            'Conflictuelles': 2,
            'Isolement': 0
        },
        
        memory_focus: {
            'Excellents': 10,
            'Quelques oublis mineurs': 8,
            'Difficultés fréquentes': 5,
            'Brouillard mental': 2,
            'Problèmes inquiétants': 0
        },
        
        joint_pain: {
            'Jamais': 10,
            'Après effort intense seulement': 8,
            'Régulièrement': 5,
            'Chroniques': 2,
            'Handicapantes': 0
        },
        
        last_vacation: {
            'Il y a moins de 3 mois': 10,
            '3-6 mois': 8,
            '6-12 mois': 5,
            'Plus d\'1 an': 3,
            'Je ne prends jamais de vacances': 0
        },
        
        environment: {
            'Campagne/nature': 10,
            'Petite ville (<50k hab)': 8,
            'Grande ville': 5,
            'Mégapole': 3,
            'Zone très polluée': 0
        }
    };
    
    // Calcul du score
    let totalScore = 0;
    let maxScore = 0;
    let categoryScores = {};
    
    // Score par catégorie
    Object.entries(answers).forEach(([key, value]) => {
        if (scoringWeights[key]) {
            // Pour les réponses simples
            if (typeof value === 'string') {
                if (scoringWeights[key][value] !== undefined) {
                    totalScore += scoringWeights[key][value];
                    categoryScores[key] = scoringWeights[key][value];
                }
            }
            // Calculer le max possible
            maxScore += Math.max(...Object.values(scoringWeights[key]));
        }
    });
    
    // Bonus/malus selon l'âge
    const age = parseInt(answers.age);
    if (age) {
        if (age < 26) totalScore += 5;
        else if (age < 36) totalScore += 3;
        else if (age < 46) totalScore += 0;
        else if (age < 56) totalScore -= 3;
        else totalScore -= 5;
        maxScore += 5;
    }
    
    // Bonus femme enceinte
    if (answers.cycle_libido === 'Grossesse') {
        totalScore += 10;
        maxScore += 10;
    }
    
    // Calcul IMC et ajustement
    if (answers.weight && answers.height) {
        const imc = answers.weight / ((answers.height/100) * (answers.height/100));
        if (imc >= 18.5 && imc <= 25) {
            totalScore += 10; // IMC optimal
        } else if (imc < 18.5 || (imc > 25 && imc <= 30)) {
            totalScore += 5; // IMC acceptable
        } else {
            totalScore += 0; // IMC problématique
        }
        maxScore += 10;
    }
    
    // Bonus pour bonnes habitudes multiples (synergies)
    let goodHabits = 0;
    if (answers.sport_frequency === '5+ fois' || answers.sport_frequency === '3-4 fois') goodHabits++;
    if (answers.sleep_quality === '7-9h de sommeil profond') goodHabits++;
    if (answers.alcohol === '0 (jamais)' || answers.alcohol === '1-3 verres') goodHabits++;
    if (answers.hydration === '2L+ religieusement') goodHabits++;
    
    if (goodHabits >= 4) {
        totalScore += 15; // Bonus synergie
        maxScore += 15;
    } else if (goodHabits >= 3) {
        totalScore += 10;
        maxScore += 15;
    }
    
    // Score final sur 100
    const finalScore = Math.round((totalScore / maxScore) * 100);
    
    // Identifier les 3 priorités
    const priorities = [];
    const categoryPercentages = {};
    
    Object.entries(categoryScores).forEach(([key, score]) => {
        if (scoringWeights[key]) {
            const maxCategoryScore = Math.max(...Object.values(scoringWeights[key]));
            const percentage = (score / maxCategoryScore) * 100;
            categoryPercentages[key] = { score, max: maxCategoryScore, percentage };
        }
    });
    
    // Trier par pourcentage le plus bas
    const sorted = Object.entries(categoryPercentages)
        .sort((a, b) => a[1].percentage - b[1].percentage)
        .slice(0, 3);
    
    // Recommandations
    const recommendations = {
        alcohol: 'Alcool : Réduire à 0-3 verres/semaine maximum',
        sleep_quality: 'Sommeil : Protocole 7-9h de qualité (magnésium glycinate 400mg)',
        sport_frequency: 'Sport : Minimum 3x/semaine HIIT 20min',
        sitting_hours: 'Sédentarité : Timer 50min = 10min debout/marche',
        stress_level: 'Stress : HRV training 5min matin + soir',
        hydration: 'Hydratation : 35ml/kg poids corporel d\'eau pure',
        breakfast: 'Nutrition : 30g protéines dans les 30min du réveil',
        infections_frequency: 'Immunité : Vitamine D 4000UI + Zinc 15mg/jour',
        digestion: 'Microbiome : Probiotiques 50 milliards CFU + fibres 35g/jour',
        recovery: 'Récupération : Sauna 20min 3x/semaine + douche froide',
        sun_exposure: 'Lumière : 10min soleil matin sans lunettes',
        nature_time: 'Nature : Earthing 20min pieds nus/jour'
    };
    
    sorted.forEach(([key, data]) => {
        if (recommendations[key]) {
            priorities.push(recommendations[key]);
        }
    });
    
    // Message selon le score
    let message = '';
    let level = '';
    
    if (finalScore >= 85) {
        message = '🏆 EXCELLENCE ! Tu fais partie du TOP 5%';
        level = 'Excellence';
    } else if (finalScore >= 70) {
        message = '💪 TRÈS BON ! Tu es dans le TOP 20%';
        level = 'Très bon';
    } else if (finalScore >= 55) {
        message = '👍 BON NIVEAU ! Tu es dans le TOP 40%';
        level = 'Bon';
    } else if (finalScore >= 40) {
        message = '⚠️ MOYEN - Du potentiel à exploiter';
        level = 'Moyen';
    } else {
        message = '🚨 CRITIQUE - Changements urgents nécessaires';
        level = 'Critique';
    }
    
    // Estimation âge biologique
    const agePenalty = Math.round((100 - finalScore) / 10);
    const biologicalAge = age + agePenalty - 5;
    
    return res.status(200).json({
        score: finalScore,
        message: message,
        level: level,
        priorities: priorities,
        biologicalAge: Math.max(18, biologicalAge), // Minimum 18 ans
        categoryScores: categoryPercentages
    });
}
