// API Endpoint pour le calcul du score biologique
export default function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { answers } = req.body;
    
    // Calcul de l'âge biologique
    const realAge = parseInt(answers.age) || 40;
    let biologicalAge = realAge;
    let factors = [];
    
    // Analyse détaillée des facteurs
    
    // 1. SÉDENTARITÉ (impact majeur)
    const sittingScore = {
        '<4h': -1,
        '4-6h': 0,
        '6-8h': 1,
        '8-10h': 2,
        '>10h': 3
    };
    const sittingImpact = sittingScore[answers.sitting_hours] || 0;
    biologicalAge += sittingImpact;
    if (sittingImpact >= 2) {
        factors.push({
            category: 'sedentarity',
            icon: '🪑',
            name: 'Sédentarité toxique',
            impact: `+${sittingImpact} ans`,
            description: `${answers.sitting_hours} assis par jour`,
            solution: 'Pause active toutes les heures'
        });
    }
    
    // 2. SOMMEIL (récupération)
    const sleepScore = {
        '<5h': 3,
        '5-6h': 2,
        '6-7h': 1,
        '7-8h': 0,
        '>8h': 0
    };
    const sleepImpact = sleepScore[answers.sleep_hours] || 0;
    biologicalAge += sleepImpact;
    if (sleepImpact >= 2) {
        factors.push({
            category: 'sleep',
            icon: '😴',
            name: 'Dette de sommeil',
            impact: `+${sleepImpact} ans`,
            description: `Seulement ${answers.sleep_hours} de sommeil`,
            solution: 'Routine du soir à optimiser'
        });
    }
    
    // 3. STRESS (inflammation)
    const stressScore = {
        'Zen total': -1,
        'Gérable': 0,
        'Élevé': 2,
        'Burnout proche': 3
    };
    const stressImpact = stressScore[answers.stress_level] || 0;
    biologicalAge += stressImpact;
    if (stressImpact >= 2) {
        factors.push({
            category: 'stress',
            icon: '🔥',
            name: 'Stress chronique',
            impact: `+${stressImpact} ans`,
            description: answers.stress_level,
            solution: 'Breathwork quotidien nécessaire'
        });
    }
    
    // 4. ACTIVITÉ PHYSIQUE (protection)
    const sportScore = {
        'Jamais': 2,
        '1 fois': 1,
        '2-3 fois': 0,
        '4-5 fois': -1,
        'Tous les jours': -2
    };
    const sportImpact = sportScore[answers.sport_frequency] || 0;
    biologicalAge += sportImpact;
    if (sportImpact >= 2) {
        factors.push({
            category: 'sport',
            icon: '🏃',
            name: 'Zéro activité physique',
            impact: `+${sportImpact} ans`,
            description: 'Aucun sport régulier',
            solution: 'Commencer par 10min/jour'
        });
    }
    
    // 5. NUTRITION (énergie)
    const nutritionImpact = calculateNutritionImpact(answers);
    biologicalAge += nutritionImpact;
    if (nutritionImpact >= 2) {
        factors.push({
            category: 'nutrition',
            icon: '🍔',
            name: 'Alimentation déséquilibrée',
            impact: `+${nutritionImpact} ans`,
            description: 'Manque de nutriments essentiels',
            solution: 'Rééquilibrage alimentaire'
        });
    }
    
    // 6. ALCOOL (toxines)
    const alcoholScore = {
        'Jamais': 0,
        '1-2/semaine': 0,
        '3-4/semaine': 1,
        'Tous les jours': 2
    };
    const alcoholImpact = alcoholScore[answers.alcohol] || 0;
    biologicalAge += alcoholImpact;
    if (alcoholImpact >= 2) {
        factors.push({
            category: 'alcohol',
            icon: '🍷',
            name: 'Alcool quotidien',
            impact: `+${alcoholImpact} ans`,
            description: 'Consommation excessive',
            solution: 'Réduire progressivement'
        });
    }
    
    // 7. IMC (métabolisme)
    if (answers.weight && answers.height) {
        const imc = answers.weight / ((answers.height/100) ** 2);
        let imcImpact = 0;
        if (imc < 18.5) imcImpact = 1;
        else if (imc > 25 && imc <= 30) imcImpact = 1;
        else if (imc > 30) imcImpact = 2;
        
        biologicalAge += imcImpact;
        if (imcImpact >= 2) {
            factors.push({
                category: 'weight',
                icon: '⚖️',
                name: 'Surpoids important',
                impact: `+${imcImpact} ans`,
                description: `IMC de ${imc.toFixed(1)}`,
                solution: 'Plan nutrition personnalisé'
            });
        }
    }
    
    // Tri des facteurs par impact
    factors.sort((a, b) => {
        const impactA = parseInt(a.impact.replace('+', ''));
        const impactB = parseInt(b.impact.replace('+', ''));
        return impactB - impactA;
    });
    
    // Garder les 3 principaux
    factors = factors.slice(0, 3);
    
    // Calcul du potentiel
    const totalNegativeImpact = factors.reduce((sum, f) => {
        return sum + parseInt(f.impact.replace('+', ''));
    }, 0);
    
    const potential = Math.max(5, totalNegativeImpact + 3);
    
    // Détermination du profil
    let profile = 'standard';
    if (biologicalAge - realAge >= 5) {
        profile = 'urgent';
    } else if (biologicalAge - realAge >= 2) {
        profile = 'attention';
    } else if (biologicalAge <= realAge) {
        profile = 'optimal';
    }
    
    // Recommandations personnalisées
    const recommendations = generateRecommendations(answers, factors, profile);
    
    return res.status(200).json({
        success: true,
        score: {
            realAge,
            biologicalAge,
            difference: biologicalAge - realAge,
            profile,
            factors,
            potential,
            recommendations
        }
    });
}

function calculateNutritionImpact(answers) {
    let impact = 0;
    
    // Petit-déjeuner
    if (answers.breakfast === 'Rien/Café' || answers.breakfast === 'Sucré (céréales, pain...)') {
        impact++;
    }
    
    // Hydratation
    if (answers.water_intake === '<3' || answers.water_intake === '3-5') {
        impact++;
    }
    
    // Digestion
    if (answers.digestion === 'Problèmes fréquents' || answers.digestion === 'Douleurs chroniques') {
        impact++;
    }
    
    return impact;
}

function generateRecommendations(answers, factors, profile) {
    const recommendations = [];
    
    // Recommandations basées sur les facteurs principaux
    factors.forEach(factor => {
        recommendations.push({
            priority: 'high',
            category: factor.category,
            action: factor.solution,
            timeframe: 'Immédiat'
        });
    });
    
    // Recommandations additionnelles selon le profil
    if (profile === 'urgent') {
        recommendations.push({
            priority: 'critical',
            category: 'coaching',
            action: 'Accompagnement personnalisé recommandé',
            timeframe: 'Cette semaine'
        });
    }
    
    // Quick wins
    if (answers.phone_morning === 'Immédiatement') {
        recommendations.push({
            priority: 'medium',
            category: 'morning',
            action: 'Attendre 30min avant le téléphone',
            timeframe: 'Dès demain'
        });
    }
    
    if (answers.cold_exposure === 'Jamais') {
        recommendations.push({
            priority: 'medium',
            category: 'recovery',
            action: 'Terminer douche par 30s d\'eau froide',
            timeframe: 'Cette semaine'
        });
    }
    
    return recommendations.slice(0, 5);
}
