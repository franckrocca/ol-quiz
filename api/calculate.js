// api/calculate.js - Algorithme de scoring scientifique pondéré

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, userInfo } = req.body;

  // ALGORITHME DE SCORING SCIENTIFIQUE PAR TIERS
  // Basé sur la littérature scientifique du biohacking et de la longévité

  // TIER 1 - FACTEURS CRITIQUES (poids x5)
  // Impact majeur sur la longévité selon les études
  const tier1Scoring = {
    sleep_quality: { // Le sommeil = 25-30% de la longévité (Walker, 2017)
      'Excellent (7-9h, profond)': 100,
      'Bon (6-7h, quelques réveils)': 75,
      'Moyen (5-6h, réveils fréquents)': 50,
      'Mauvais (4-5h, insomnie)': 25,
      'Très mauvais (<4h)': 0
    },
    exercise_frequency: { // Exercice = -35% mortalité (Arem et al., 2015)
      '5-7 fois/semaine': 100,
      '3-4 fois/semaine': 80,
      '1-2 fois/semaine': 50,
      'Occasionnel': 25,
      'Jamais': 0
    },
    nutrition_quality: { // Nutrition = 20 ans d'espérance de vie (Longo, 2019)
      'Optimale (bio, variée, équilibrée)': 100,
      'Bonne (fait maison, équilibrée)': 75,
      'Moyenne (mixte maison/industriel)': 50,
      'Médiocre (majoritairement industriel)': 25,
      'Mauvaise (fast-food, ultra-transformé)': 0
    },
    stress_level: { // Stress chronique = +50% mortalité (Cohen et al., 2012)
      'Très faible (zen)': 100,
      'Faible (gérable)': 75,
      'Modéré (pics occasionnels)': 50,
      'Élevé (quotidien)': 25,
      'Très élevé (burnout)': 0
    },
    alcohol_consumption: { // Alcool = dose-dépendant sur mortalité (Wood et al., 2018)
      'Jamais': 100,
      '1-2 verres/semaine': 85,
      '3-5 verres/semaine': 60,
      '1-2 verres/jour': 30,
      'Plus de 2 verres/jour': 0
    }
  };

  // TIER 2 - FACTEURS IMPORTANTS (poids x3)
  const tier2Scoring = {
    fasting_practice: { // Jeûne intermittent = +15% longévité (de Cabo & Mattson, 2019)
      '16:8 quotidien': 100,
      '14:10 quotidien': 80,
      'Quelques fois/semaine': 60,
      'Occasionnel': 40,
      'Jamais': 20
    },
    meditation: { // Méditation = -23% mortalité CV (Schneider et al., 2012)
      'Quotidienne (>20min)': 100,
      'Régulière (3-5x/semaine)': 75,
      'Occasionnelle': 50,
      'Rare': 25,
      'Jamais': 0
    },
    social_connections: { // Relations sociales = +50% survie (Holt-Lunstad, 2010)
      'Très riches (famille + amis + communauté)': 100,
      'Bonnes (cercle proche solide)': 75,
      'Moyennes (quelques proches)': 50,
      'Faibles (isolement partiel)': 25,
      'Très faibles (isolement)': 0
    },
    hydration: { // Hydratation = biomarqueur de longévité (Dmitrieva et al., 2023)
      'Plus de 3L/jour': 100,
      '2-3L/jour': 80,
      '1.5-2L/jour': 60,
      '1-1.5L/jour': 40,
      'Moins de 1L/jour': 0
    },
    energy_3years: { // Tendance énergétique = prédicteur de déclin
      'Meilleure': 100,
      'Stable': 75,
      'Légèrement diminuée': 50,
      'Diminuée': 25,
      'Très diminuée': 0
    }
  };

  // TIER 3 - FACTEURS MODULATEURS (poids x2)
  const tier3Scoring = {
    morning_energy: { // Énergie matinale = marqueur circadien
      'Pleine forme': 100,
      'Bien': 75,
      'Correct': 50,
      'Fatigué(e)': 25,
      'Épuisé(e)': 0
    },
    recovery_practices: { // Récupération active
      'Quotidienne (sauna, bain froid, étirements)': 100,
      'Régulière (3-5x/semaine)': 75,
      'Occasionnelle': 50,
      'Rare': 25,
      'Jamais': 0
    },
    nature_exposure: { // Nature = -12% mortalité (Rojas-Rueda et al., 2021)
      'Quotidienne (>2h)': 100,
      'Régulière (weekend)': 75,
      'Occasionnelle': 50,
      'Rare': 25,
      'Jamais (100% urbain)': 0
    },
    cold_exposure: { // Hormèse par le froid = longévité (Søberg et al., 2021)
      'Quotidienne (douche froide + bain)': 100,
      'Régulière (3-5x/semaine)': 75,
      'Occasionnelle': 50,
      'Rare': 25,
      'Jamais': 0
    },
    breathwork: { // Respiration = variabilité cardiaque (Zaccaro et al., 2018)
      'Quotidienne (Wim Hof, cohérence)': 100,
      'Régulière': 75,
      'Occasionnelle': 50,
      'Rare': 25,
      'Jamais': 0
    }
  };

  // TIER 4 - FACTEURS ADDITIONNELS (poids x1)
  const tier4Scoring = {
    screen_evening: { // Lumière bleue = perturbation circadienne
      'Jamais (coupure 2h avant)': 100,
      'Avec lunettes anti-lumière bleue': 75,
      'Parfois': 50,
      'Toujours': 25,
      'Jusqu\'au lit': 0
    },
    supplements: { // Compléments = bonus si bien ciblés
      'Protocole complet personnalisé': 100,
      'Basiques (Vit D, Omega 3, Magnésium)': 75,
      'Occasionnels': 50,
      'Jamais': 40,
      'Je ne sais pas quoi prendre': 30
    },
    bedtime: { // Rythme circadien
      'Avant 22h': 100,
      '22h-23h': 75,
      '23h-minuit': 50,
      'Minuit-1h': 25,
      'Après 1h du matin': 0
    },
    environment: { // Pollution = -2.2 ans (Lancet, 2022)
      'Nature/campagne (air pur)': 100,
      'Petite ville (<50k habitants)': 75,
      'Ville moyenne (50-200k)': 50,
      'Grande ville (200k-1M)': 25,
      'Mégapole (Paris, Lyon, Marseille)': 0
    },
    vacations: { // Récupération mentale
      'Il y a moins de 3 mois': 100,
      '3-6 mois': 75,
      '6-12 mois': 50,
      'Plus d\'un an': 25,
      'Je ne déconnecte jamais': 0
    }
  };

  // CALCUL DU SCORE
  let totalScore = 0;
  let maxPossible = 0;
  let categoryScores = {};

  // Helper pour calculer le score d'une catégorie
  function calculateCategoryScore(categoryKey, scoring, multiplier) {
    const answer = answers[categoryKey];
    if (answer && scoring[answer] !== undefined) {
      const score = scoring[answer] * multiplier;
      totalScore += score;
      categoryScores[categoryKey] = { 
        score, 
        max: 100 * multiplier, 
        tier: multiplier === 5 ? 1 : multiplier === 3 ? 2 : multiplier === 2 ? 3 : 4,
        percentage: scoring[answer]
      };
      return true;
    }
    return false;
  }

  // Tier 1 (x5)
  Object.entries(tier1Scoring).forEach(([key, scoring]) => {
    calculateCategoryScore(key, scoring, 5);
    maxPossible += 500;
  });

  // Tier 2 (x3)
  Object.entries(tier2Scoring).forEach(([key, scoring]) => {
    calculateCategoryScore(key, scoring, 3);
    maxPossible += 300;
  });

  // Tier 3 (x2)
  Object.entries(tier3Scoring).forEach(([key, scoring]) => {
    calculateCategoryScore(key, scoring, 2);
    maxPossible += 200;
  });

  // Tier 4 (x1)
  Object.entries(tier4Scoring).forEach(([key, scoring]) => {
    calculateCategoryScore(key, scoring, 1);
    maxPossible += 100;
  });

  // BONUS/MALUS selon l'âge
  const age = parseInt(answers.age) || 40;
  if (age < 30) totalScore += 100;
  else if (age < 40) totalScore += 50;
  else if (age < 50) totalScore += 0;
  else if (age < 60) totalScore -= 50;
  else totalScore -= 100;

  // BONUS IMC optimal
  if (answers.weight && answers.height) {
    const imc = answers.weight / Math.pow(answers.height / 100, 2);
    if (imc >= 20 && imc <= 25) totalScore += 100;
    else if (imc >= 18.5 && imc < 20) totalScore += 50;
    else if (imc > 25 && imc <= 27) totalScore += 50;
    else totalScore += 0;
    maxPossible += 100;
  }

  // Score final sur 100
  let finalScore = Math.round((totalScore / maxPossible) * 100);
  
  // S'assurer que le score est réaliste (entre 15 et 95)
  finalScore = Math.max(15, Math.min(95, finalScore));

  // Calcul de l'âge biologique estimé
  const agePenalty = Math.round((100 - finalScore) * 0.3);
  const biologicalAge = age + agePenalty;
  
  // Formulation pour l'âge biologique
  let interpretation = '';
  if (finalScore >= 80) {
    interpretation = 'EXCELLENT - Profil optimal';
  } else if (finalScore >= 65) {
    interpretation = 'BON - Santé préservée';
  } else if (finalScore >= 50) {
    interpretation = 'MOYEN - Optimisation nécessaire';
  } else if (finalScore >= 35) {
    interpretation = 'ALERTE - Changements urgents';
  } else {
    interpretation = 'CRITIQUE - Action immédiate';
  }

  // Identification des 3 priorités (les catégories avec les scores les plus bas)
  const priorities = Object.entries(categoryScores)
    .filter(([key, data]) => data.percentage !== undefined)
    .sort((a, b) => a[1].percentage - b[1].percentage)
    .slice(0, 3)
    .map(([key, data]) => {
      const labels = {
        sleep_quality: 'Sommeil',
        exercise_frequency: 'Activité physique',
        nutrition_quality: 'Nutrition',
        stress_level: 'Gestion du stress',
        alcohol_consumption: 'Consommation d\'alcool',
        fasting_practice: 'Jeûne intermittent',
        meditation: 'Méditation',
        social_connections: 'Relations sociales',
        hydration: 'Hydratation',
        energy_3years: 'Énergie vitale',
        morning_energy: 'Énergie matinale',
        recovery_practices: 'Récupération',
        nature_exposure: 'Contact nature',
        cold_exposure: 'Exposition au froid',
        breathwork: 'Respiration'
      };
      
      return {
        key,
        label: labels[key] || key,
        percentage: data.percentage,
        tier: data.tier
      };
    });

  // Niveau de risque et projections
  let riskLevel, riskColor, trend, projections;
  
  if (finalScore >= 80) {
    riskLevel = 'Très faible';
    riskColor = '#00CC00';
    trend = 'Vieillissement optimal';
    projections = [
      '🌟 Excellence biologique maintenue',
      '🌟 Protection maximale contre le vieillissement',
      '🌟 Espérance de vie : +10-15 ans'
    ];
  } else if (finalScore >= 65) {
    riskLevel = 'Faible';
    riskColor = '#01FF00';
    trend = 'Vieillissement ralenti';
    projections = [
      '✅ Bonne trajectoire de santé',
      '✅ Potentiel d\'optimisation : +5-10 ans',
      '✅ Risques maîtrisés avec vigilance'
    ];
  } else if (finalScore >= 50) {
    riskLevel = 'Modéré';
    riskColor = '#FFA500';
    trend = 'Vieillissement normal';
    projections = [
      '⚠️ Amélioration nécessaire',
      '💡 Potentiel non exploité : 5-10 ans',
      '🚀 Objectif : Passer en zone verte'
    ];
  } else if (finalScore >= 35) {
    riskLevel = 'Élevé';
    riskColor = '#FF4444';
    trend = 'Vieillissement accéléré';
    projections = [
      '⚠️ Risque de maladies chroniques élevé',
      '⚠️ Perte estimée : 5-10 ans',
      '🆘 Action urgente requise'
    ];
  } else {
    riskLevel = 'Critique';
    riskColor = '#CC0000';
    trend = 'Vieillissement très accéléré';
    projections = [
      '🚨 Danger immédiat pour la santé',
      '🚨 Perte estimée : 10-15 ans',
      '🚨 Changement radical nécessaire'
    ];
  }

  // Construire la réponse
  const result = {
    score: finalScore,
    biologicalAge,
    chronologicalAge: age,
    interpretation,
    risk: {
      level: riskLevel,
      color: riskColor,
      trend
    },
    priorities,
    projections,
    categoryScores,
    userInfo
  };

  // Envoyer l'email avec les résultats (si configuré)
  if (userInfo && userInfo.email) {
    try {
      await sendResultEmail(result, answers);
    } catch (error) {
      console.error('Erreur envoi email:', error);
    }
  }

  // Retourner les résultats
  res.status(200).json(result);
}

// Fonction d'envoi d'email (à implémenter avec votre service)
async function sendResultEmail(result, answers) {
  // Configuration pour l'envoi d'email
  const emailData = {
    to: result.userInfo.email,
    subject: `🧬 Ton Score de Vieillissement : ${result.score}/100`,
    data: {
      firstname: result.userInfo.firstname || 'Champion',
      score: result.score,
      biologicalAge: result.biologicalAge,
      chronologicalAge: result.chronologicalAge,
      interpretation: result.interpretation,
      risk: result.risk,
      priorities: result.priorities,
      projections: result.projections,
      
      // Données complètes pour l'email sans undefined
      age: answers.age || 'Non renseigné',
      gender: answers.gender || 'Non renseigné',
      imc: answers.imc ? `${answers.imc} (${getIMCStatus(answers.imc)})` : 'Non calculé',
      sleep: answers.sleep_quality || 'Non renseigné',
      exercise: answers.exercise_frequency || 'Non renseigné',
      nutrition: answers.nutrition_quality || 'Non renseigné',
      stress: answers.stress_level || 'Non renseigné',
      alcohol: answers.alcohol_consumption || 'Non renseigné',
      hydration: answers.hydration || 'Non renseigné',
      energy: answers.morning_energy || 'Non renseigné',
      objectives: Array.isArray(answers.objectives) ? answers.objectives.join(', ') : 'Non renseigné',
      tracking: Array.isArray(answers.tracking) ? answers.tracking.join(', ') : 'Non renseigné',
      blockers: Array.isArray(answers.blockers) ? answers.blockers.join(', ') : 'Non renseigné'
    }
  };

  // Ici, intégrer avec votre service d'email (SendGrid, Google Script, etc.)
  // Pour le moment, on log simplement
  console.log('Email à envoyer:', emailData);
  
  // Si vous utilisez Google Script :
  /*
  await fetch('YOUR_GOOGLE_SCRIPT_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailData)
  });
  */
}

function getIMCStatus(imc) {
  const value = parseFloat(imc);
  if (value < 18.5) return 'Insuffisant';
  if (value < 25) return 'Poids normal ✓';
  if (value < 30) return 'Surpoids';
  return 'Obésité';
}
