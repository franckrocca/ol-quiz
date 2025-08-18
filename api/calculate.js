// ATTENTION: Ceci est ton algorithme propriétaire - NE JAMAIS exposer côté client

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, userInfo } = req.body;

  if (!answers || !userInfo) {
    return res.status(400).json({ error: 'Missing data' });
  }

  // Scoring weights - ton algorithme secret
  const weights = {
    // Facteurs critiques (x3)
    energy3y: 3,
    last100: 3,
    crash: 3,
    sleepQuality: 3,
    nightAwakenings: 3,
    stress: 3,
    
    // Facteurs importants (x2)
    stairs: 2,
    recovery: 2,
    cognition: 2,
    digestion: 2,
    jointPain: 2,
    symptoms: 2,
    weightVsIdeal: 2,
    libido: 2,
    skin: 2,
    
    // Facteurs modérés (x1)
    sitting: 1,
    environment: 1,
    sun: 1,
    nature: 1,
    bedtime: 1,
    screens: 1,
    breakfast: 1,
    hydration: 1,
    alcohol: 1,
    frequency: 1,
    supplements: 1,
    social: 1,
    vacations: 1,
    projection: 1
  };

  // Système de scoring par réponse (0 = pire, 4 = meilleur)
  const scoring = {
    energy3y: { 
      'Bien mieux qu\'avant': 4,
      'Un peu mieux': 3,
      'Pareil (stable)': 2,
      'Un peu moins bien': 1,
      'Beaucoup moins bien': 0
    },
    last100: {
      'Cette semaine': 4,
      'Ce mois-ci': 3,
      'Cette année': 2,
      'Il y a 2-3 ans': 1,
      'Je ne m\'en souviens plus': 0
    },
    stairs: {
      'Facile, je pourrais continuer': 4,
      'OK mais légèrement essoufflé': 3,
      'Difficile, bien essoufflé': 2,
      'Très dur, obligé de m\'arrêter': 1,
      'Impossible sans pause': 0
    },
    sitting: {
      'Moins de 4h': 4,
      '4-6h': 3,
      '7-9h': 2,
      '10-12h': 1,
      'Plus de 12h': 0
    },
    nightAwakenings: {
      '0 (sommeil parfait)': 4,
      '1 fois': 3,
      '2-3 fois': 2,
      '4-5 fois': 1,
      'Plus de 5 fois': 0
    },
    libido: {
      'Au top, comme à 20 ans': 4,
      'Plutôt bien': 3,
      'Correct mais en baisse': 2,
      'Clairement diminuée': 1,
      'Plus vraiment d\'intérêt': 0
    },
    crash: {
      'Jamais de crash': 4,
      'Après 17h': 3,
      'Vers 14-15h': 2,
      'Dès 11h': 1,
      'Fatigué dès le réveil': 0
    },
    weightVsIdeal: {
      'Pile mon poids idéal': 4,
      '+/- 3kg de mon idéal': 3,
      '+5 à 10kg': 2,
      '+10 à 20kg': 1,
      '+20kg ou plus': 0
    },
    digestion: {
      'Parfaite comme une horloge': 4,
      'Quelques inconforts occasionnels': 3,
      'Ballonnements fréquents': 2,
      'Problèmes quotidiens': 1,
      'Chaos intestinal permanent': 0
    },
    jointPain: {
      'Aucune douleur': 4,
      'Petites gênes occasionnelles': 3,
      'Douleurs régulières mais gérables': 2,
      'Douleurs qui limitent mes activités': 1,
      'Douleurs chroniques handicapantes': 0
    },
    cognition: {
      'Sharp comme un laser': 4,
      'Plutôt bonnes': 3,
      'Des moments de flou': 2,
      'Difficultés fréquentes': 1,
      'Brouillard mental constant': 0
    },
    symptoms: {
      'Muscle et force au top': 4,
      'Maintien correct': 3,
      'Légère perte visible': 2,
      'Perte importante': 1,
      'Fonte musculaire inquiétante': 0
    },
    recovery: {
      '24h max': 4,
      '48h environ': 3,
      '3-4 jours': 2,
      'Une semaine': 1,
      'Courbatures permanentes': 0
    },
    stress: {
      'Zen en toutes circonstances': 4,
      'Stress ponctuel gérable': 3,
      'Stress régulier': 2,
      'Stress quotidien élevé': 1,
      'Burnout/épuisement': 0
    },
    skin: {
      'Peau de bébé': 4,
      'Quelques imperfections': 3,
      'Rides et ridules visibles': 2,
      'Vieillissement marqué': 1,
      'Problèmes cutanés multiples': 0
    },
    environment: {
      'Campagne/nature': 4,
      'Petite ville': 3,
      'Ville moyenne': 2,
      'Grande ville': 1,
      'Mégapole polluée': 0
    },
    sun: {
      '30min+ par jour': 4,
      '15-30min par jour': 3,
      'Quelques fois par semaine': 2,
      'Rarement': 1,
      'Jamais (mode vampire)': 0
    },
    nature: {
      'Je vis dans la nature': 4,
      'Plus de 10h': 3,
      '5-10h': 2,
      '1-5h': 1,
      '0h (100% béton)': 0
    },
    sleepQuality: {
      'Parfait, je me réveille en forme': 4,
      'Plutôt bon': 3,
      'Variable': 2,
      'Souvent mauvais': 1,
      'Insomnie chronique': 0
    },
    bedtime: {
      'Avant 22h': 4,
      '22h-23h': 3,
      '23h-minuit': 2,
      'Minuit-1h': 1,
      'Après 1h': 0
    },
    screens: {
      'Jamais (livre/méditation)': 4,
      'Arrêt 2h avant': 3,
      'Arrêt 1h avant': 2,
      'Jusqu\'au lit': 1,
      'Je m\'endors avec': 0
    },
    breakfast: {
      'Protéines + gras (œufs, avocat)': 4,
      'Équilibré (complet)': 3,
      'Céréales/muesli': 2,
      'Sucré (pain blanc, confiture)': 1,
      'Juste café/rien': 0
    },
    hydration: {
      '2L+ religieusement': 4,
      '1.5-2L': 3,
      '1-1.5L': 2,
      'Moins d\'1L': 1,
      'Principalement café/sodas': 0
    },
    alcohol: {
      '0 (jamais)': 4,
      '1-3 verres': 3,
      '4-7 verres (1/jour)': 2,
      '8-14 verres (2/jour)': 1,
      '15+ verres': 0
    },
    frequency: {
      '6-7x par semaine': 4,
      '4-5x par semaine': 3,
      '2-3x par semaine': 2,
      '1x par semaine': 1,
      'Jamais': 0
    },
    supplements: {
      'Stack complet optimisé': 4,
      'Quelques basiques (vitamines)': 3,
      'Occasionnellement': 2,
      'Jamais': 1,
      'N\'importe quoi sans stratégie': 0
    },
    social: {
      'Entourage au top': 4,
      'Plutôt bien entouré': 3,
      'Quelques bonnes relations': 2,
      'Peu de vraies connexions': 1,
      'Isolement social': 0
    },
    vacations: {
      'Ce mois-ci': 4,
      'Cette année': 3,
      'L\'année dernière': 2,
      'Il y a 2-3 ans': 1,
      'Je ne déconnecte jamais': 0
    },
    projection: {
      'En pleine forme': 4,
      'À peu près pareil': 3,
      'Un peu diminué': 2,
      'Sérieusement dégradé': 1,
      'Dans un état critique': 0
    }
  };

  // Calcul du score
  let totalScore = 0;
  let maxPossible = 0;

  for (const [key, value] of Object.entries(answers)) {
    if (scoring[key] && scoring[key][value] !== undefined) {
      const weight = weights[key] || 1;
      totalScore += scoring[key][value] * weight;
      maxPossible += 4 * weight;
    }
  }

  // Calcul du score final sur 100
  const finalScore = Math.round((totalScore / maxPossible) * 100);

  // Calcul de l'âge biologique
  const chronoAge = parseInt(answers.age) || 40;
  const agePenalty = Math.round((100 - finalScore) * 0.3);
  const biologicalAge = chronoAge + agePenalty;

  // Détermination du niveau de risque
  let riskLevel, riskColor, riskMessage, trend;
  
  if (finalScore >= 80) {
    riskLevel = 'Très faible';
    riskColor = '#00CC00';
    riskMessage = 'Excellence biologique atteinte';
    trend = 'Vieillissement optimal';
  } else if (finalScore >= 60) {
    riskLevel = 'Faible';
    riskColor = '#01FF00';
    riskMessage = 'Profil santé supérieur à la moyenne';
    trend = 'Vieillissement ralenti';
  } else if (finalScore >= 40) {
    riskLevel = 'Modéré';
    riskColor = '#FFA500';
    riskMessage = 'Amélioration nécessaire';
    trend = 'Vieillissement normal';
  } else if (finalScore >= 20) {
    riskLevel = 'Élevé';
    riskColor = '#FF4444';
    riskMessage = 'Attention requise';
    trend = 'Vieillissement accéléré';
  } else {
    riskLevel = 'Critique';
    riskColor = '#CC0000';
    riskMessage = 'Intervention urgente nécessaire';
    trend = 'Vieillissement très accéléré';
  }

  // Projections futures
  const futureRisks = [];
  if (finalScore < 40) {
    futureRisks.push('🚨 +73% risque cardiovasculaire dans 10 ans');
    futureRisks.push('🚨 +89% risque diabète type 2');
    futureRisks.push('🚨 -12 ans espérance de vie en bonne santé');
  } else if (finalScore < 60) {
    futureRisks.push('⚠️ +45% risque maladies chroniques');
    futureRisks.push('⚠️ Déclin cognitif accéléré après 60 ans');
    futureRisks.push('⚠️ -7 ans espérance de vie en bonne santé');
  } else if (finalScore < 80) {
    futureRisks.push('✅ Profil santé supérieur à la moyenne');
    futureRisks.push('✅ Habitudes protectrices en place');
    futureRisks.push('🚀 Potentiel pour atteindre l\'excellence');
  } else {
    futureRisks.push('🌟 Excellence biologique atteinte');
    futureRisks.push('🌟 Protection maximale contre le vieillissement');
    futureRisks.push('💎 Maintiens cette excellence avec OraLife');
  }

  // Recommandations personnalisées
  const recommendations = [];
  
  // Top 3 problèmes à adresser
  const problems = [];
  if (scoring.stress && scoring.stress[answers.stress] <= 1) {
    problems.push('Gestion du stress critique');
  }
  if (scoring.sleepQuality && scoring.sleepQuality[answers.sleepQuality] <= 1) {
    problems.push('Qualité de sommeil à améliorer d\'urgence');
  }
  if (scoring.energy3y && scoring.energy3y[answers.energy3y] <= 1) {
    problems.push('Niveau d\'énergie très bas');
  }
  if (scoring.digestion && scoring.digestion[answers.digestion] <= 1) {
    problems.push('Santé intestinale compromise');
  }

  // Messages de motivation basés sur les réponses
  const motivations = answers.motivation || [];
  let personalMessage = '';
  
  if (motivations.includes('Voir mes petits-enfants grandir')) {
    personalMessage = 'Pour voir tes petits-enfants grandir, chaque choix compte dès aujourd\'hui.';
  } else if (motivations.includes('Continuer à performer')) {
    personalMessage = 'Ta performance future dépend des actions que tu prends maintenant.';
  } else if (motivations.includes('Rester autonome jusqu\'au bout')) {
    personalMessage = 'L\'autonomie se construit aujourd\'hui pour demain.';
  }

  const response = {
    success: true,
    score: finalScore,
    biologicalAge,
    chronologicalAge: chronoAge,
    ageDifference: biologicalAge - chronoAge,
    risk: {
      level: riskLevel,
      color: riskColor,
      message: riskMessage,
      trend
    },
    projections: futureRisks,
    topProblems: problems,
    personalMessage,
    analysis: {
      energy: scoring.energy3y ? scoring.energy3y[answers.energy3y] : null,
      stress: scoring.stress ? scoring.stress[answers.stress] : null,
      sleep: scoring.sleepQuality ? scoring.sleepQuality[answers.sleepQuality] : null,
      physical: scoring.stairs ? scoring.stairs[answers.stairs] : null
    },
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
}
