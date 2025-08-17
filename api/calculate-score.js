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
    
    if (!answers) {
        return res.status(400).json({ error: 'Missing answers' });
    }
    
    // Calculer le score basé sur les réponses simplifiées
    let score = 50; // Score de base
    let factors = [];
    
    // Énergie au réveil
    if (answers.energie === 'plein_energie') {
        score += 10;
    } else if (answers.energie === 'correct') {
        score += 5;
    } else if (answers.energie === 'fatigue') {
        score -= 5;
    } else if (answers.energie === 'epuise') {
        score -= 10;
        factors.push('Fatigue chronique');
    }
    
    // Position assise
    if (answers.assis === '0-4') {
        score += 10;
    } else if (answers.assis === '4-6') {
        score += 5;
    } else if (answers.assis === '6-8') {
        // Neutre
    } else if (answers.assis === '8-10') {
        score -= 8;
        factors.push('Sédentarité excessive');
    } else if (answers.assis === '10+') {
        score -= 15;
        factors.push('Sédentarité critique');
    }
    
    // Sommeil
    if (answers.sommeil === '7-8' || answers.sommeil === '8+') {
        score += 10;
    } else if (answers.sommeil === '6-7') {
        score += 3;
    } else if (answers.sommeil === '5-6') {
        score -= 8;
        factors.push('Manque de sommeil');
    } else if (answers.sommeil === '0-5') {
        score -= 15;
        factors.push('Privation de sommeil sévère');
    }
    
    // Stress
    if (answers.stress === 'zen') {
        score += 10;
    } else if (answers.stress === 'gerable') {
        score += 5;
    } else if (answers.stress === 'eleve') {
        score -= 5;
        factors.push('Stress élevé');
    } else if (answers.stress === 'chronique') {
        score -= 10;
        factors.push('Stress chronique');
    }
    
    // Sport
    if (answers.sport === '5+') {
        score += 12;
    } else if (answers.sport === '3-4') {
        score += 8;
    } else if (answers.sport === '1-2') {
        score += 3;
    } else if (answers.sport === '0') {
        score -= 10;
        factors.push('Aucune activité physique');
    }
    
    // Alimentation
    if (answers.alimentation === 'excellent') {
        score += 10;
    } else if (answers.alimentation === 'bonne') {
        score += 5;
    } else if (answers.alimentation === 'moyenne') {
        score -= 3;
    } else if (answers.alimentation === 'mauvaise') {
        score -= 8;
        factors.push('Alimentation déséquilibrée');
    }
    
    // Engagement
    if (answers.engagement === 'oui_motive') {
        score += 5;
    } else if (answers.engagement === 'oui_essayer') {
        score += 2;
    } else if (answers.engagement === 'non') {
        score -= 5;
    }
    
    // Limiter le score entre 0 et 100
    score = Math.max(0, Math.min(100, score));
    
    // Déterminer le niveau
    let level = '';
    let message = '';
    
    if (score >= 85) {
        level = 'Excellent';
        message = '🏆 EXCELLENT ! Tu fais partie du TOP 5% des gens en forme';
    } else if (score >= 70) {
        level = 'Très bon';
        message = '💪 TRÈS BON ! Tu es sur la bonne voie';
    } else if (score >= 55) {
        level = 'Bon';
        message = '👍 BON NIVEAU ! Quelques ajustements à faire';
    } else if (score >= 40) {
        level = 'Moyen';
        message = '⚠️ MOYEN - Du potentiel à exploiter';
    } else {
        level = 'À améliorer';
        message = '🚨 À AMÉLIORER - Des changements sont nécessaires';
    }
    
    // Top 3 priorités
    const priorities = [];
    
    if (factors.includes('Sédentarité excessive') || factors.includes('Sédentarité critique')) {
        priorities.push('Bouger toutes les heures (timer 50min)');
    }
    
    if (factors.includes('Manque de sommeil') || factors.includes('Privation de sommeil sévère')) {
        priorities.push('Protocole sommeil 7-9h (magnésium + mélatonine)');
    }
    
    if (factors.includes('Stress élevé') || factors.includes('Stress chronique')) {
        priorities.push('Gestion du stress (cohérence cardiaque 5min x2/jour)');
    }
    
    if (factors.includes('Aucune activité physique')) {
        priorities.push('Minimum 3x20min de sport par semaine');
    }
    
    if (factors.includes('Alimentation déséquilibrée')) {
        priorities.push('Rééquilibrage alimentaire (30g protéines au petit-déj)');
    }
    
    if (factors.includes('Fatigue chronique')) {
        priorities.push('Check-up complet (thyroïde, fer, vitamine D)');
    }
    
    // Compléter à 3 priorités si nécessaire
    const defaultPriorities = [
        'Hydratation optimale (35ml/kg de poids corporel)',
        'Exposition lumière naturelle (10min matin)',
        'Respiration consciente (4-7-8 avant de dormir)',
        'Supplémentation vitamine D (4000 UI/jour)',
        'Marche quotidienne (8000 pas minimum)'
    ];
    
    while (priorities.length < 3 && defaultPriorities.length > 0) {
        const priority = defaultPriorities.shift();
        if (!priorities.includes(priority)) {
            priorities.push(priority);
        }
    }
    
    return res.status(200).json({
        score: score,
        level: level,
        message: message,
        priorities: priorities.slice(0, 3),
        factors: factors
    });
}
