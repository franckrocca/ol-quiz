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
    // Poids basés sur impact mortalité/longévité
    
    const scoringWeights = {
        // TIER 1 - IMPACT MAXIMAL (Facteurs qui impactent >20% mortalité)
        alcohol: {
            '0 (jamais)': 30,
            '1-3 verres': 22,
            '4-7 verres (1/jour)': 15,
            '8-14 verres (2/jour)': 8,
            '15+ verres': 0
        },
        
        sleep_quality: {
            '7-9h de sommeil profond': 30,
            '7-9h avec réveils': 22,
            '5-7h agité': 12,
            'Moins de 5h': 3,
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
            'Juste café/rien': 5,
            'Variable selon l\'humeur': 10
        },
        
        infections_frequency: {
            'Jamais (système immunitaire de warrior)': 20,
            'Rarement (1 fois/an max)': 16,
            'Normalement (2-3 fois/an)': 12,
            'Souvent (4-5 fois/an)': 6,
            'Tout le temps (système immunitaire KO)': 0
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
            'Je ne récupère jamais': 0
        },
        
        sun_exposure: {
            'Quotidienne (>30min)': 15,
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
        
        // TIER 4 - IMPACT LÉGER (<5% mortalité)
        skin_quality: {
            'Éclatante': 10,
            'Correcte pour mon âge': 8,
            'Terne/sèche': 5,
            'Problématique': 3,
            'Vieillissement accéléré': 0
        },
        
        social_relations: {
            'Épanouissantes': 10,
            'Satisfaisantes': 8,
            'Limitées': 5,
            'Conflictuelles': 2,
            'Isolement': 0
        },
        
        memory_focus: {
            'Excellent': 10,
            'Quelques oublis mineurs': 8,
            'Difficultés fréquentes': 5,
            'Brouillard mental': 2,
            'Problèmes inquiétants': 0
        },
        
        joint_pain: {
            'Jamais': 10,
            'Après effort intense': 8,
            'Régulièrement': 5,
            'Chroniques': 2,
            'Handicapantes': 0
        }
    };
    
    // BONUS/MALUS basés sur l'âge et le genre
    const ageBonus = {
        '18-25': 5,
        '26-35': 3,
        '36-45': 0,
        '46-55': -3,
        '56+': -5
    };
    
    // Calculer le score
    let totalScore = 0;
    let maxScore = 0;
    let categoryScores = {};
    
    // Score par catégorie
    Object.entries(answers).forEach(([key, value]) => {
        if (scoringWeights[key] && scoringWeights[key][value]) {
            totalScore += scoringWeights[key][value];
            categoryScores[key] = scoringWeights[key][value];
        }
        if (scoringWeights[key]) {
            maxScore += Math.max(...Object.values(scoringWeights[key]));
        }
    });
    
    // Ajuster selon l'âge
    const age = parseInt(answers.age);
    if (age) {
        if (age < 26) totalScore += 5;
        else if (age < 36) totalScore += 3;
        else if (age < 46) totalScore += 0;
        else if (age < 56) totalScore -= 3;
        else totalScore -= 5;
    }
    
    // Bonus femme enceinte
    if (answers.cycle_libido === 'Grossesse') {
        totalScore += 10; // Bonus car besoins spécifiques
    }
    
    // Calculer l'IMC et ajuster
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
    
    // Score final sur 100
    const finalScore = Math.round((totalScore / maxScore) * 100);
    
    // Identifier les 3 priorités (les catégories avec les plus bas scores)
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
    
    // Créer les recommandations
    const recommendations = {
        alcohol: 'Alcool : Réduire à 0-3 verres/semaine max',
        sleep_quality: 'Sommeil : Viser 7-9h de qualité chaque nuit',
        sport_frequency: 'Sport : Minimum 3x/semaine, idéal 5x',
        sitting_hours: 'Sédentarité : Pause active toutes les heures',
        stress_level: 'Stress : Méditation 10min/jour minimum',
        hydration: 'Hydratation : 2.5L d\'eau pure quotidiennement',
        breakfast: 'Nutrition : Petit-déj protéiné obligatoire',
        infections_frequency: 'Immunité : Protocole vitamine D + zinc',
        digestion: 'Digestion : Probiotiques + fibres',
        recovery: 'Récupération : Magnésium + étirements',
        sun_exposure: 'Soleil : 20min/jour minimum (matin idéal)',
        nature_time: 'Nature : 5h/semaine minimum'
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
    
    // Calcul de l'âge biologique estimé
    const biologicalAge = age + Math.round((100 - finalScore) / 10) - 5;
    
    return res.status(200).json({
        score: finalScore,
        message: message,
        level: level,
        priorities: priorities,
        biologicalAge: biologicalAge,
        categoryScores: categoryPercentages
    });
}
