export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const data = req.body;
        
        // Calculer le score
        const score = calculateScore(data);
        
        // Calculer l'âge biologique
        const ageAnalysis = calculateBiologicalAge(data, score);
        
        // Obtenir le niveau
        const level = getScoreLevel(score);
        
        // Analyser les points urgents et forces
        const urgentPoints = analyzeUrgentPoints(data);
        const strengthPoints = analyzeStrengthPoints(data);
        
        // Analyse des risques
        const riskAnalysis = analyzeRisks(score);
        
        // Calculer l'IMC
        const bmi = calculateBMI(data.weight, data.height);
        
        return res.status(200).json({
            score,
            level,
            ageAnalysis,
            urgentPoints,
            strengthPoints,
            riskAnalysis,
            bmi
        });
        
    } catch (error) {
        console.error('Erreur calcul score:', error);
        return res.status(500).json({ error: 'Erreur lors du calcul' });
    }
}

function calculateScore(data) {
    let score = 100;
    
    // Système de scoring basé sur études scientifiques
    const scoring = {
        // Basé sur : Katzmarzyk et al., 2013 (PMID: 23826128)
        'sitting_hours': {
            'Moins de 4h': 0,
            '4-6h': -3,
            '6-8h': -6,
            '8-10h': -9,
            'Plus de 10h': -12
        },
        // Basé sur : Cappuccio et al., 2010 (PMID: 20469800)
        'sleep_quality': {
            '7-9h de sommeil profond': 0,
            '6-7h correct': -5,
            '5-6h léger et fragmenté': -10,
            'Moins de 5h': -15,
            'Insomnie chronique': -20
        },
        // Basé sur : Epel et al., 2004 (PMID: 15574496)
        'stress_level': {
            'Zen permanent': 0,
            'Gérable la plupart du temps': -5,
            'Élevé régulièrement': -10,
            'Très élevé quotidiennement': -15,
            'Mode survie/burnout': -20
        },
        'energy_vs_3years': {
            'Mieux qu\'avant': 0,
            'Identique': -5,
            '-20% environ': -10,
            '-40% environ': -20,
            '-60% ou plus': -30
        },
        'last_100_percent': {
            'Cette semaine': 0,
            'Ce mois-ci': -5,
            'Cette année': -10,
            'L\'année dernière': -15,
            'Je ne sais plus': -20
        },
        'first_crash': {
            'Jamais': 0,
            'Après 17h': -3,
            'Vers 14h-15h': -6,
            'Juste après le déjeuner': -9,
            'Dès le matin': -12
        },
        'stairs_test': {
            'Facile, en parlant': 0,
            'Léger essoufflement': -5,
            'Besoin de reprendre mon souffle': -10,
            'Très difficile': -15,
            'J\'évite les escaliers': -20
        },
        'weight_vs_ideal': {
            'Parfait': 0,
            '+2-5 kg': -3,
            '+5-10 kg': -6,
            '+10-15 kg': -9,
            '+15 kg ou plus': -12
        },
        'night_wakeups': {
            '0 (sommeil parfait)': 0,
            '1 fois': -3,
            '2-3 fois': -6,
            '4+ fois': -9,
            'Insomnie chronique': -15
        },
        'bedtime': {
            'Avant 22h': 0,
            '22h-23h': -2,
            '23h-minuit': -4,
            'Minuit-1h': -6,
            'Après 1h du matin': -8
        },
        'screens_before_bed': {
            'Jamais (coupure 2h avant)': 0,
            'Avec lunettes anti-lumière bleue': -2,
            'Parfois': -4,
            'Toujours': -6,
            'Jusqu\'au lit': -8
        },
        'digestion': {
            'Parfaite comme une horloge': 0,
            'Quelques inconforts occasionnels': -3,
            'Ballonnements fréquents': -6,
            'Problèmes quotidiens': -9,
            'Chaos intestinal permanent': -12
        },
        'joint_pain': {
            'Jamais': 0,
            'Après effort intense uniquement': -3,
            'Le matin au réveil': -6,
            'Régulièrement dans la journée': -9,
            'Douleurs chroniques permanentes': -12
        },
        'memory_focus': {
            'Excellentes': 0,
            'Quelques oublis mineurs': -3,
            'Difficultés fréquentes': -6,
            'Brouillard mental régulier': -9,
            'Très inquiétant': -12
        },
        'recovery': {
            'Moins de 24h': 0,
            '24-48h': -3,
            '2-3 jours': -6,
            '4-7 jours': -9,
            'Plus d\'une semaine': -12
        },
        'skin_quality': {
            'Éclatante et ferme': 0,
            'Correcte pour mon âge': -3,
            'Terne et fatiguée': -6,
            'Rides marquées': -9,
            'Très vieillie prématurément': -12
        },
        'living_environment': {
            'Nature/campagne (air pur)': 0,
            'Petite ville (<50k habitants)': -2,
            'Ville moyenne (50-200k)': -4,
            'Grande ville (200k-1M)': -6,
            'Mégapole (Paris, Lyon, Marseille)': -8
        },
        'sun_exposure': {
            '30min+ quotidien': 0,
            '15-30min régulier': -2,
            'Quelques fois/semaine': -4,
            'Rarement': -6,
            'Jamais (vampire mode)': -8
        },
        'nature_time': {
            'Plus de 10h': 0,
            '5-10h': -2,
            '2-5h': -4,
            'Moins de 2h': -6,
            'Zéro': -8
        },
        'breakfast': {
            'Jeûne intermittent': 0,
            'Protéines + bons gras': 0,
            'Céréales complètes + fruits': -3,
            'Sucré (pain blanc, confiture)': -6,
            'Juste café/rien': -4
        },
        'hydration': {
            '2L+ religieusement': 0,
            '1.5-2L': -2,
            '1-1.5L': -4,
            'Moins d\'1L': -6,
            'Principalement café/sodas': -8
        },
        'alcohol': {
            '0 (jamais)': 0,
            '1-3 verres': -3,
            '4-7 verres (1/jour)': -6,
            '8-14 verres (2/jour)': -12,
            '15+ verres': -18
        },
        'sport_frequency': {
            'Tous les jours': 0,
            '4-6 fois/semaine': -2,
            '2-3 fois/semaine': -5,
            '1 fois/semaine': -8,
            'Rarement ou jamais': -15
        },
        'supplements': {
            'Protocole complet personnalisé': 0,
            'Basiques (Vit D, Omega 3, Magnésium)': -2,
            'Occasionnels': -4,
            'Jamais': -6,
            'Je ne sais pas quoi prendre': -5
        },
        'social_relations': {
            'Très riches et nombreuses': 0,
            'Satisfaisantes': -3,
            'Limitées': -6,
            'Difficiles/conflictuelles': -9,
            'Isolement social': -12
        },
        'last_vacation': {
            'Il y a moins de 3 mois': 0,
            '3-6 mois': -2,
            '6-12 mois': -4,
            'Plus d\'un an': -6,
            'Je ne déconnecte jamais': -8
        },
        'projection_5years': {
            'En meilleure forme (j\'optimise déjà)': 0,
            'Stable (stagnation)': -5,
            'Diminué(e) de 20%': -10,
            'Très diminué(e) de 40%': -15,
            'J\'ai peur d\'y penser': -12
        }
    };
    
    // Calculer le score basé sur les réponses
    for (const [key, value] of Object.entries(data)) {
        if (scoring[key] && scoring[key][value]) {
            score += scoring[key][value];
        }
    }
    
    // Ajustement IMC
    const bmi = calculateBMI(data.weight, data.height);
    if (bmi > 0) {
        if (bmi < 18.5 || bmi > 30) score -= 10;
        else if (bmi > 25) score -= 5;
    }
    
    // Bonus pour activités multiples
    if (data.activities && Array.isArray(data.activities) && !data.activities.includes('Aucune activité')) {
        score += Math.min(5, data.activities.length * 2);
    }
    
    // Bonus pour objectifs clairs
    if (data.objectives && Array.isArray(data.objectives) && data.objectives.length > 0) {
        score += 2;
    }
    
    // Bonus pour tracking
    if (data.tracking && Array.isArray(data.tracking) && !data.tracking.includes('Aucun')) {
        score += 3;
    }
    
    // S'assurer que le score reste entre 0 et 100
    score = Math.max(0, Math.min(100, score));
    
    return Math.round(score);
}

function calculateBMI(weight, height) {
    if (weight && height) {
        const heightInM = height / 100;
        return weight / (heightInM * heightInM);
    }
    return 0;
}

function getScoreLevel(score) {
    if (score >= 80) return {
        level: 5,
        label: "OPTIMAL",
        color: "#00CC00",
        emoji: "🌟",
        description: "Performance biologique maximale"
    };
    if (score >= 65) return {
        level: 4,
        label: "BON",
        color: "#8BC34A",
        emoji: "✅",
        description: "Santé préservée, optimisation possible"
    };
    if (score >= 50) return {
        level: 3,
        label: "MOYEN",
        color: "#FFA500",
        emoji: "⚠️",
        description: "Signaux d'alerte, action recommandée"
    };
    if (score >= 35) return {
        level: 2,
        label: "FAIBLE",
        color: "#FF6600",
        emoji: "🚨",
        description: "Vieillissement accéléré détecté"
    };
    return {
        level: 1,
        label: "CRITIQUE",
        color: "#FF0000",
        emoji: "🆘",
        description: "Urgence santé, intervention nécessaire"
    };
}

function calculateBiologicalAge(data, score) {
    const exactAge = parseInt(data.age_exact) || 40;
    
    let adjustment = 0;
    
    if (score >= 80) {
        adjustment = -Math.round(exactAge * 0.1);
    } else if (score >= 60) {
        adjustment = 0;
    } else if (score >= 40) {
        adjustment = Math.round(exactAge * 0.1);
    } else {
        adjustment = Math.round(exactAge * 0.2);
    }
    
    // Ajustements spécifiques
    const bmi = calculateBMI(data.weight, data.height);
    if (bmi > 30) adjustment += 3;
    else if (bmi > 25) adjustment += 1;
    
    if (data.sitting_hours === 'Plus de 10h') adjustment += 2;
    if (data.sleep_quality === 'Insomnie chronique') adjustment += 3;
    if (data.stress_level === 'Mode survie/burnout') adjustment += 4;
    if (data.sport_frequency === 'Tous les jours') adjustment -= 2;
    if (data.alcohol === '0 (jamais)') adjustment -= 1;
    
    const biologicalAge = exactAge + adjustment;
    
    return {
        chrono: exactAge,
        bio: biologicalAge,
        difference: biologicalAge - exactAge,
        interpretation: getAgeInterpretation(biologicalAge - exactAge)
    };
}

function getAgeInterpretation(diff) {
    if (diff <= -5) return "🌟 Exceptionnel ! Ton corps fonctionne comme celui de quelqu'un de beaucoup plus jeune";
    if (diff <= -2) return "✨ Excellent ! Tu rajeunis biologiquement";
    if (diff <= 2) return "✅ Bon ! Tu maintiens ton âge biologique";
    if (diff <= 5) return "⚠️ Attention, vieillissement légèrement accéléré";
    if (diff <= 10) return "🚨 Alerte ! Vieillissement prématuré détecté";
    return "🆘 Critique ! Vieillissement très accéléré - Action urgente nécessaire";
}

function analyzeUrgentPoints(data) {
    const urgentPoints = [];
    
    if (data.sitting_hours === 'Plus de 10h' || data.sitting_hours === '8-10h') {
        urgentPoints.push('🪑 Position assise excessive détectée');
    }
    
    if (data.sleep_quality === 'Insomnie chronique' || data.sleep_quality === 'Moins de 5h') {
        urgentPoints.push('😴 Sommeil insuffisant identifié');
    }
    
    if (data.stress_level === 'Mode survie/burnout' || data.stress_level === 'Très élevé quotidiennement') {
        urgentPoints.push('🧠 Niveau de stress préoccupant');
    }
    
    if (data.digestion === 'Chaos intestinal permanent' || data.digestion === 'Problèmes quotidiens') {
        urgentPoints.push('🦠 Santé digestive à optimiser');
    }
    
    if (data.sport_frequency === 'Rarement ou jamais') {
        urgentPoints.push('🏃 Activité physique insuffisante');
    }
    
    if (data.alcohol === '15+ verres' || data.alcohol === '8-14 verres (2/jour)') {
        urgentPoints.push('🍷 Consommation d\'alcool élevée');
    }
    
    if (data.first_crash === 'Dès le matin' || data.first_crash === 'Juste après le déjeuner') {
        urgentPoints.push('⚡ Gestion énergétique à améliorer');
    }
    
    if (data.weight_vs_ideal === '+15 kg ou plus' || data.weight_vs_ideal === '+10-15 kg') {
        urgentPoints.push('⚖️ Poids à optimiser');
    }
    
    if (data.memory_focus === 'Très inquiétant' || data.memory_focus === 'Brouillard mental régulier') {
        urgentPoints.push('🧠 Fonctions cognitives à soutenir');
    }
    
    return urgentPoints;
}

function analyzeStrengthPoints(data) {
    const strengthPoints = [];
    
    if (data.sport_frequency === 'Tous les jours' || data.sport_frequency === '4-6 fois/semaine') {
        strengthPoints.push('💪 Excellente activité physique');
    }
    
    if (data.sleep_quality === '7-9h de sommeil profond') {
        strengthPoints.push('😴 Sommeil réparateur optimal');
    }
    
    if (data.hydration === '2L+ religieusement') {
        strengthPoints.push('💧 Hydratation parfaite');
    }
    
    if (data.alcohol === '0 (jamais)') {
        strengthPoints.push('🚫 Aucune consommation d\'alcool');
    }
    
    if (data.stress_level === 'Zen permanent' || data.stress_level === 'Gérable la plupart du temps') {
        strengthPoints.push('🧘 Bonne gestion du stress');
    }
    
    if (data.objectives && data.objectives.length > 0) {
        strengthPoints.push('🎯 Objectifs clairs et définis');
    }
    
    if (data.breakfast === 'Jeûne intermittent' || data.breakfast === 'Protéines + bons gras') {
        strengthPoints.push('🍳 Nutrition matinale optimisée');
    }
    
    const bmi = calculateBMI(data.weight, data.height);
    if (bmi >= 18.5 && bmi <= 25) {
        strengthPoints.push('✅ IMC dans la zone optimale');
    }
    
    if (data.nature_time === 'Plus de 10h' || data.nature_time === '5-10h') {
        strengthPoints.push('🌳 Excellente connexion à la nature');
    }
    
    if (data.social_relations === 'Très riches et nombreuses' || data.social_relations === 'Satisfaisantes') {
        strengthPoints.push('❤️ Relations sociales épanouissantes');
    }
    
    return strengthPoints;
}

function analyzeRisks(score) {
    if (score < 40) {
        return {
            level: 'Élevé',
            color: '#FF0000',
            text: '<strong>Tendance actuelle :</strong> Vieillissement accéléré<br><small style="color: #666;">Basé sur tes réponses et les études épidémiologiques</small>',
            futureRisks: [
                '📊 Probabilité élevée de développer des problèmes métaboliques',
                '📊 Risque cardiovasculaire augmenté selon ton profil',
                '📊 Déclin des capacités physiques probable sans intervention',
                '<span style="color: #00CC00; font-weight: bold;">✅ MAIS : Réversible avec le bon protocole !</span>'
            ]
        };
    } else if (score < 60) {
        return {
            level: 'Modéré',
            color: '#FFA500',
            text: '<strong>Tendance actuelle :</strong> Vieillissement normal avec points d\'attention<br><small style="color: #666;">Opportunités d\'optimisation identifiées</small>',
            futureRisks: [
                '📊 Certains marqueurs suggèrent un vieillissement standard',
                '📊 Potentiel d\'amélioration sur plusieurs axes',
                '📊 Prévention recommandée pour maintenir la trajectoire',
                '<span style="color: #00CC00; font-weight: bold;">✅ Fort potentiel d\'amélioration rapide</span>'
            ]
        };
    } else if (score < 80) {
        return {
            level: 'Faible',
            color: '#8BC34A',
            text: '<strong>Tendance actuelle :</strong> Vieillissement ralenti<br><small style="color: #666;">Continue ainsi et optimise encore</small>',
            futureRisks: [
                '✅ Profil santé supérieur à la moyenne',
                '✅ Habitudes protectrices en place',
                '✅ Trajectoire positive maintenue',
                '<span style="color: var(--accent-green); font-weight: bold;">🚀 Potentiel pour atteindre l\'excellence biologique</span>'
            ]
        };
    } else {
        return {
            level: 'Très faible',
            color: '#00CC00',
            text: '<strong>Tendance actuelle :</strong> Vieillissement optimal<br><small style="color: #666;">Tu es dans le top 5% de la population</small>',
            futureRisks: [
                '🌟 Excellence biologique atteinte',
                '🌟 Protection maximale contre le vieillissement',
                '🌟 Résilience physique et mentale optimale',
                '<span style="color: var(--accent-green); font-weight: bold;">💎 Maintiens cette excellence avec OraLife</span>'
            ]
        };
    }
}
