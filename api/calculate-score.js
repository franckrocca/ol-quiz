/**
 * API Vercel pour le calcul du score biologique
 * Basé sur les études scientifiques validées
 */

export default function handler(req, res) {
    // CORS
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
    
    // Calcul du score avec pondération scientifique
    let score = 50; // Base
    let penalties = 0;
    let bonuses = 0;
    
    // TIER 1 - Impact maximal (basé sur études mortalité)
    
    // Sport (VO2 max proxy) - Impact le plus fort
    if (answers.sport_frequency) {
        switch(answers.sport_frequency) {
            case '5+ fois': bonuses += 20; break;
            case '3-4 fois': bonuses += 15; break;
            case '2-3 fois': bonuses += 10; break;
            case '1 fois': bonuses += 5; break;
            case 'Jamais': penalties += 20; break;
        }
    }
    
    // Capacité cardio (3 étages)
    if (answers.vo2_proxy) {
        if (answers.vo2_proxy.includes('Impossible')) penalties += 15;
        else if (answers.vo2_proxy.includes('Très facile')) bonuses += 15;
        else if (answers.vo2_proxy.includes('Facile')) bonuses += 10;
    }
    
    // Sommeil - Fondation de la santé
    if (answers.sleep_quality) {
        if (answers.sleep_quality.includes('Excellente')) bonuses += 15;
        else if (answers.sleep_quality.includes('Bonne')) bonuses += 8;
        else if (answers.sleep_quality.includes('Très mauvaise')) penalties += 15;
        else if (answers.sleep_quality.includes('Mauvaise')) penalties += 8;
    }
    
    // Alcool - Impact direct mortalité
    if (answers.alcohol) {
        if (answers.alcohol === '0 (jamais)') bonuses += 15;
        else if (answers.alcohol === '1-3 verres') bonuses += 5;
        else if (answers.alcohol === '8-14 verres') penalties += 10;
        else if (answers.alcohol === '15+ verres') penalties += 20;
    }
    
    // TIER 2 - Impact fort
    
    // Temps assis (étude 2019)
    if (answers.sitting_hours) {
        if (answers.sitting_hours === 'Plus de 10h') penalties += 12;
        else if (answers.sitting_hours === '8-10h') penalties += 8;
        else if (answers.sitting_hours === 'Moins de 4h') bonuses += 10;
    }
    
    // Stress chronique
    if (answers.stress_level) {
        if (answers.stress_level.includes('Extrême')) penalties += 12;
        else if (answers.stress_level.includes('Élevé')) penalties += 8;
        else if (answers.stress_level.includes('Très faible')) bonuses += 10;
    }
    
    // Hydratation
    if (answers.hydration) {
        if (answers.hydration === 'Plus de 2L') bonuses += 8;
        else if (answers.hydration === 'Moins de 0.5L') penalties += 10;
    }
    
    // TIER 3 - Optimisations
    
    // Petit-déjeuner
    if (answers.breakfast) {
        if (answers.breakfast.includes('Protéiné')) bonuses += 5;
        else if (answers.breakfast.includes('Sucré')) penalties += 5;
    }
    
    // Légumes
    if (answers.vegetables) {
        if (answers.vegetables === '7+') bonuses += 8;
        else if (answers.vegetables === '0') penalties += 8;
    }
    
    // Infections (système immunitaire)
    if (answers.infections_frequency) {
        if (answers.infections_frequency.includes('Jamais')) bonuses += 8;
        else if (answers.infections_frequency.includes('Tout le temps')) penalties += 10;
    }
    
    // BONUS SYNERGIQUES (effet multiplicateur)
    let synergies = 0;
    
    // Super Athlete combo
    if (answers.sport_frequency === '5+ fois' && 
        answers.daily_steps === 'Plus de 10000' &&
        answers.recovery === 'Tous les jours') {
        synergies += 10;
    }
    
    // Clean Living combo
    if (answers.alcohol === '0 (jamais)' &&
        answers.sleep_quality && answers.sleep_quality.includes('Excellente') &&
        answers.meditation === 'Tous les jours') {
        synergies += 10;
    }
    
    // Calcul final
    const finalScore = Math.max(0, Math.min(100, score + bonuses - penalties + synergies));
    
    // Calcul âge biologique
    const chronoAge = parseInt(answers.age);
    const agePenalty = Math.round((100 - finalScore) / 10);
    const biologicalAge = chronoAge + agePenalty - 5;
    
    // Identification des priorités
    const priorities = [];
    
    if (answers.sport_frequency === 'Jamais' || answers.sport_frequency === '1 fois') {
        priorities.push({
            title: '🏃 Activité physique insuffisante',
            impact: '-3 ans d\'espérance de vie',
            solution: 'Commencer par 2x20min/semaine de marche rapide'
        });
    }
    
    if (answers.sleep_quality && (answers.sleep_quality.includes('Mauvaise') || answers.sleep_quality.includes('Très mauvaise'))) {
        priorities.push({
            title: '😴 Sommeil non récupérateur',
            impact: '-2 ans + risque cognitif',
            solution: 'Routine du soir : pas d\'écran 1h avant + magnésium'
        });
    }
    
    if (answers.sitting_hours === 'Plus de 10h' || answers.sitting_hours === '8-10h') {
        priorities.push({
            title: '🪑 Trop de temps assis',
            impact: '+34% mortalité',
            solution: 'Timer 25/5 : 25min assis, 5min debout/marche'
        });
    }
    
    if (answers.hydration === 'Moins de 0.5L' || answers.hydration === '0.5-1L') {
        priorities.push({
            title: '💧 Déshydratation chronique',
            impact: '-20% performance cognitive',
            solution: 'Bouteille de 1L visible, à finir 2x/jour'
        });
    }
    
    if (answers.stress_level && answers.stress_level.includes('Extrême')) {
        priorities.push({
            title: '🧠 Stress chronique',
            impact: 'Vieillissement accéléré +3 ans',
            solution: 'Cohérence cardiaque 3x5min/jour'
        });
    }
    
    // Limiter à 3 priorités
    const topPriorities = priorities.slice(0, 3);
    
    // Si pas assez de priorités, ajouter des génériques
    if (topPriorities.length < 3) {
        topPriorities.push({
            title: '🥬 Optimiser la nutrition',
            impact: 'Inflammation chronique',
            solution: 'Plus de légumes, moins de transformé'
        });
    }
    
    res.status(200).json({
        score: finalScore,
        biologicalAge: Math.max(18, biologicalAge),
        chronologicalAge: chronoAge,
        priorities: topPriorities,
        level: finalScore >= 80 ? 'Excellence' : 
               finalScore >= 65 ? 'Bon' :
               finalScore >= 50 ? 'Moyen' : 'À améliorer'
    });
}
