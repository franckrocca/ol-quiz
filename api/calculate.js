// ALGORITHME SCIENTIFIQUE BASÉ SUR LA LONGÉVITÉ ET LE HEALTHSPAN
// Basé sur les études : VO2max (Mandsager 2018), Sleep (Walker 2017), Stress (Epel 2004), etc.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, userInfo } = req.body;

  if (!answers || !userInfo) {
    return res.status(400).json({ error: 'Missing data' });
  }

  // SYSTÈME DE SCORING SCIENTIFIQUE
  // Basé sur l'impact réel sur la longévité selon les études

  // TIER 1 - FACTEURS CRITIQUES (Poids x5)
  // Impact majeur sur l'espérance de vie
  const tier1Scoring = {
    stairs: { // VO2 Max proxy - Prédit -15 ans d'espérance (Mandsager et al., 2018)
      'Facile, en parlant': 100,
      'Léger essoufflement': 75,
      'Besoin de reprendre mon souffle': 50,
      'Très difficile': 25,
      'J\'évite les escaliers': 0
    },
    sleepQuality: { // Sommeil - Impact sur TOUTES les fonctions (Walker, 2017)
      '7-9h de sommeil profond': 100,
      '6-7h correct': 75,
      '5-6h léger et fragmenté': 40,
      'Moins de 5h': 20,
      'Insomnie chronique': 0
    },
    stress: { // Stress chronique - Télomères courts (Epel et al., 2004)
      'Zen permanent': 100,
      'Gérable la plupart du temps': 75,
      'Élevé régulièrement': 40,
      'Très élevé quotidiennement': 20,
      'Mode survie/burnout': 0
    },
    frequency: { // Activité physique - #1 facteur modifiable (Wen et al., 2011)
      'Tous les jours': 100,
      '4-6 fois/semaine': 85,
      '2-3 fois/semaine': 60,
      '1 fois/semaine': 30,
      'Rarement ou jamais': 0
    }
  };

  // TIER 2 - FACTEURS IMPORTANTS (Poids x3)
  // Impact fort sur healthspan
  const tier2Scoring = {
    energy3y: { // Déclin énergétique = marqueur de vieillissement
      'Mieux qu\'avant': 100,
      'Identique': 75,
      '-20% environ': 50,
      '-40% environ': 25,
      '-60% ou plus': 0
    },
    weightVsIdeal: { // Obésité = -8 ans d'espérance (Peeters et al., 2003)
      'Parfait': 100,
      '+2-5 kg': 80,
      '+5-10 kg': 60,
      '+10-15 kg': 30,
      '+15 kg ou plus': 0
    },
    alcohol: { // Alcool = toxine, 0 bénéfice (GBD 2016 Alcohol Collaborators)
      '0 (jamais)': 100,
      '1-3 verres': 75,
      '4-7 verres (1/jour)': 50,
      '8-14 verres (2/jour)': 25,
      '15+ verres': 0
    },
    digestion: { // Microbiome = 70% système immunitaire
      'Parfaite comme une horloge': 100,
      'Quelques inconforts occasionnels': 75,
      'Ballonnements fréquents': 50,
      'Problèmes quotidiens': 25,
      'Chaos intestinal permanent': 0
    },
    cognition: { // Déclin cognitif = mortalité précoce
      'Excellentes': 100,
      'Quelques oublis mineurs': 75,
      'Difficultés fréquentes': 50,
      'Brouillard mental régulier': 25,
      'Très inquiétant': 0
    },
    recovery: { // Capacité adaptative = résilience
      'Moins de 24h': 100,
      '24-48h': 75,
      '2-3 jours': 50,
      '4-7 jours': 25,
      'Plus d\'une semaine': 0
    }
  };

  // TIER 3 - FACTEURS MODÉRÉS (Poids x2)
  const tier3Scoring = {
    hydration: { // Hydratation = fonction cellulaire
      '2L+ religieusement': 100,
      '1.5-2L': 75,
      '1-1.5L': 50,
      'Moins d\'1L': 25,
      'Principalement café/sodas': 0
    },
    sun: { // Vitamine D = -20% mortalité (Schöttker et al., 2014)
      '30min+ quotidien': 100,
      '15-30min régulier': 75,
      'Quelques fois/semaine': 50,
      'Rarement': 25,
      'Jamais (vampire mode)': 0
    },
    nature: { // Nature = -12% mortalité (Gascon et al., 2016)
      'Plus de 10h': 100,
      '5-10h': 75,
      '2-5h': 50,
      'Moins de 2h': 25,
      'Zéro': 0
    },
    social: { // Isolation = +50% mortalité (Holt-Lunstad et al., 2010)
      'Très riches et nombreuses': 100,
      'Satisfaisantes': 75,
      'Limitées': 50,
      'Difficiles/conflictuelles': 25,
      'Isolement social': 0
    },
    breakfast: { // Jeûne intermittent = longévité (de Cabo & Mattson, 2019)
      'Jeûne intermittent': 100,
      'Protéines + bons gras': 85,
      'Céréales complètes + fruits': 60,
      'Sucré (pain blanc, confiture)': 30,
      'Juste café/rien': 50
    },
    nightAwakenings: { // Fragmentation sommeil = vieillissement
      '0 (sommeil parfait)': 100,
      '1 fois': 75,
      '2-3 fois': 50,
      '4+ fois': 25,
      'Insomnie chronique': 0
    }
  };

  // TIER 4 - FACTEURS LÉGERS (Poids x1)
  const tier4Scoring = {
    sitting: { // Sédentarité (compensable par exercice)
      'Moins de 4h': 100,
      '4-6h': 75,
      '6-8h': 50,
      '8-10h': 25,
      'Plus de 10h': 0
    },
    screens: { // Lumière bleue = perturbation circadien
      'Jamais (coupure 2h avant)': 100,
      'Avec lunettes anti-lumière bleue': 75,
      'Parfois': 50,
      'Toujours': 25,
      'Jusqu\'au lit': 0
    },
    supplements: { // Compléments = bonus si bien fait
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

  // Tier 1 (x5)
  Object.entries(tier1Scoring).forEach(([key, scoring]) => {
    if (answers[key] && scoring[answers[key]] !== undefined) {
      const score = scoring[answers[key]] * 5;
      totalScore += score;
      categoryScores[key] = { score, max: 500, tier: 1 };
    }
    maxPossible += 500;
  });

  // Tier 2 (x3)
  Object.entries(tier2Scoring).forEach(([key, scoring]) => {
    if (answers[key] && scoring[answers[key]] !== undefined) {
      const score = scoring[answers[key]] * 3;
      totalScore += score;
      categoryScores[key] = { score, max: 300, tier: 2 };
    }
    maxPossible += 300;
  });

  // Tier 3 (x2)
  Object.entries(tier3Scoring).forEach(([key, scoring]) => {
    if (answers[key] && scoring[answers[key]] !== undefined) {
      const score = scoring[answers[key]] * 2;
      totalScore += score;
      categoryScores[key] = { score, max: 200, tier: 3 };
    }
    maxPossible += 200;
  });

  // Tier 4 (x1)
  Object.entries(tier4Scoring).forEach(([key, scoring]) => {
    if (answers[key] && scoring[answers[key]] !== undefined) {
      const score = scoring[answers[key]] * 1;
      totalScore += score;
      categoryScores[key] = { score, max: 100, tier: 4 };
    }
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
  const finalScore = Math.round((totalScore / maxPossible) * 100);

  // Calcul de l'âge biologique estimé (avec formulation prudente)
  const agePenalty = Math.round((100 - finalScore) * 0.3);
  const biologicalAge = age + agePenalty;
  
  // Formulation prudente pour l'âge biologique
  let ageMessage = '';
  if (agePenalty <= -5) {
    ageMessage = 'Tu as probablement un profil biologique plus jeune que ton âge';
  } else if (agePenalty <= 0) {
    ageMessage = 'Ton profil biologique correspond à ton âge chronologique';
  } else if (agePenalty <= 5) {
    ageMessage = 'Ton profil suggère un léger vieillissement accéléré';
  } else if (agePenalty <= 10) {
    ageMessage = 'Attention : signes de vieillissement prématuré détectés';
  } else {
    ageMessage = 'Alerte : vieillissement biologique significativement accéléré';
  }

  // Identification des 3 priorités
  const priorities = Object.entries(categoryScores)
    .sort((a, b) => (a[1].score / a[1].max) - (b[1].score / b[1].max))
    .slice(0, 3)
    .map(([key, data]) => ({
      key,
      percentage: Math.round((data.score / data.max) * 100),
      tier: data.tier
    }));

  // Niveau de risque et projections
  let riskLevel, riskColor, trend, projections;
  
  if (finalScore >= 80) {
    riskLevel = 'Très faible';
    riskColor = '#00CC00';
    trend = 'Vieillissement optimal';
    projections = [
      '🌟 Excellence biologique atteinte',
      '🌟 Protection maximale contre le vieillissement',
      '🌟 Espérance de vie : +10-15 ans vs moyenne',
      '💎 Maintiens cette excellence avec Ora Life'
    ];
  } else if (finalScore >= 60) {
    riskLevel = 'Faible';
    riskColor = '#01FF00';
    trend = 'Vieillissement ralenti';
    projections = [
      '✅ Profil santé supérieur à la moyenne',
      '✅ Habitudes protectrices en place',
      '✅ Potentiel +5-10 ans d\'espérance de vie',
      '🚀 Objectif : Atteindre l\'excellence biologique'
    ];
  } else if (finalScore >= 40) {
    riskLevel = 'Modéré';
    riskColor = '#FFA500';
    trend = 'Vieillissement normal';
    projections = [
      '⚠️ Risque +45% maladies chroniques après 60 ans',
      '⚠️ Déclin cognitif probable après 70 ans',
      '⚠️ Perte d\'autonomie vers 75-80 ans',
      '💡 Action nécessaire pour inverser la tendance'
    ];
  } else if (finalScore >= 20) {
    riskLevel = 'Élevé';
    riskColor = '#FF4444';
    trend = 'Vieillissement accéléré';
    projections = [
      '🚨 Risque +73% maladies cardiovasculaires',
      '🚨 Risque +89% diabète type 2 dans 10 ans',
      '🚨 -12 ans d\'espérance de vie en bonne santé',
      '⚡ Protocole urgent nécessaire'
    ];
  } else {
    riskLevel = 'Critique';
    riskColor = '#CC0000';
    trend = 'Vieillissement très accéléré';
    projections = [
      '🆘 État de santé critique',
      '🆘 Multiples facteurs de risque cumulés',
      '🆘 Espérance de vie réduite de 15-20 ans',
      '🔴 Intervention immédiate requise'
    ];
  }

  // Envoi vers Google Sheets avec TOUTES les données
  try {
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwjyAjH9Nl6y2IeRWHi5Qrr6ftqVilH4T9RMPAdNXM_XYVuaN0WFzrPPYwVL8oOZR0W/exec';
    
    // Préparer toutes les données pour Google Sheets
    const dataForSheet = {
      timestamp: new Date().toISOString(),
      firstname: userInfo.firstname,
      email: userInfo.email,
      phone: userInfo.phone,
      score: finalScore,
      biologicalAge,
      chronologicalAge: age,
      ageDifference: biologicalAge - age,
      riskLevel,
      // Toutes les réponses individuelles
      gender: answers.gender || '',
      age: answers.age || '',
      weight: answers.weight || '',
      height: answers.height || '',
      imc: answers.imc || '',
      goals: Array.isArray(answers.goals) ? answers.goals.join(', ') : '',
      energy3y: answers.energy3y || '',
      last100: answers.last100 || '',
      barriers: answers.barriers || '',
      stairs: answers.stairs || '',
      sitting: answers.sitting || '',
      nightAwakenings: answers.nightAwakenings || '',
      femaleSpecific: answers.femaleSpecific || '',
      libido: answers.libido || '',
      crash: answers.crash || '',
      weightVsIdeal: answers.weightVsIdeal || '',
      digestion: answers.digestion || '',
      jointPain: answers.jointPain || '',
      cognition: answers.cognition || '',
      recovery: answers.recovery || '',
      stress: answers.stress || '',
      skin: answers.skin || '',
      environment: answers.environment || '',
      sun: answers.sun || '',
      nature: answers.nature || '',
      sleepQuality: answers.sleepQuality || '',
      bedtime: answers.bedtime || '',
      screens: answers.screens || '',
      breakfast: answers.breakfast || '',
      hydration: answers.hydration || '',
      alcohol: answers.alcohol || '',
      activities: Array.isArray(answers.activities) ? answers.activities.join(', ') : '',
      frequency: answers.frequency || '',
      supplements: answers.supplements || '',
      tracking: Array.isArray(answers.tracking) ? answers.tracking.join(', ') : '',
      social: answers.social || '',
      vacations: answers.vacations || '',
      projection: answers.projection || '',
      fear: answers.fear || '',
      motivation: Array.isArray(answers.motivation) ? answers.motivation.join(', ') : '',
      budget: answers.budget || '',
      time: answers.time || ''
    };
    
    await fetch(googleScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataForSheet)
    });
  } catch (error) {
    console.error('Erreur Google Sheets:', error);
  }

  // Réponse complète
  res.status(200).json({
    success: true,
    score: finalScore,
    biologicalAge,
    chronologicalAge: age,
    ageDifference: biologicalAge - age,
    ageMessage,
    risk: {
      level: riskLevel,
      color: riskColor,
      trend
    },
    projections,
    priorities,
    categoryScores,
    timestamp: new Date().toISOString()
  });
}
