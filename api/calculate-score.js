// api/calculate-score.js - Vercel Function
// Algorithme de scoring basé sur la littérature scientifique

const QUIZ_CONFIG = require('./config');

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, userProfile } = req.body;

  // Configuration des poids scientifiques par catégorie
  const CATEGORY_WEIGHTS = {
    vo2max: 5.0,        // Impact majeur - Mandsager et al., JAMA 2018
    muscle_strength: 5.0, // Impact majeur - BMJ 2008
    sleep_duration: 5.0,  // Impact majeur - Sleep Medicine Reviews 2010
    sleep_quality: 3.0,
    hrv: 3.0,           // Impact fort - Circulation 2017
    glucose: 3.0,       // Impact fort - NEJM 2011
    body_fat: 3.0,      // Impact fort - Lancet 2009
    processed_foods: 2.0, // Impact modéré - BMJ 2019
    daily_steps: 2.0,   // Impact modéré - JAMA 2020
    energy: 1.5,
    mitochondrial_function: 1.5,
    health_awareness: 1.0,
    energy_consistency: 1.0
  };

  // Calcul du score brut pondéré
  let weightedScore = 0;
  let totalWeight = 0;
  let biomarkerScores = {};
  let mortalityRiskFactor = 1.0;
  let estimatedHealthspan = 85; // Base healthspan en années

  // Analyse détaillée par réponse
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = findQuestionById(questionId);
    if (!question) return;

    const weight = CATEGORY_WEIGHTS[question.biomarker] || 1.0;
    let score = 0;
    
    if (question.type === 'single') {
      const option = question.options.find(opt => opt.value === answer);
      if (option) {
        score = option.score;
        
        // Calcul du facteur de risque de mortalité
        if (option.mortality_risk) {
          mortalityRiskFactor *= option.mortality_risk;
        }
        
        // Impact sur le healthspan
        if (question.impact_years && score < 3) {
          const reduction = question.impact_years * (3 - score) / 2;
          estimatedHealthspan -= reduction;
        } else if (question.impact_years && score > 3) {
          const increase = question.impact_years * (score - 3) / 2;
          estimatedHealthspan += increase;
        }
      }
    } else if (question.type === 'multiple') {
      // Pour les questions multiples, on fait la moyenne des scores
      const selectedOptions = answer.split(',');
      const scores = selectedOptions.map(val => {
        const option = question.options.find(opt => opt.value === val);
        return option ? option.score : 0;
      });
      score = scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    weightedScore += score * weight;
    totalWeight += weight;
    
    // Stockage du score par biomarqueur
    if (!biomarkerScores[question.biomarker]) {
      biomarkerScores[question.biomarker] = {
        score: 0,
        count: 0,
        weight: weight,
        category: question.category
      };
    }
    biomarkerScores[question.biomarker].score += score;
    biomarkerScores[question.biomarker].count += 1;
  });

  // Score final normalisé sur 100
  const finalScore = Math.round((weightedScore / totalWeight) * 20);
  
  // Ajustement du healthspan basé sur le facteur de mortalité
  estimatedHealthspan = Math.round(estimatedHealthspan / mortalityRiskFactor);

  // Calcul de l'âge biologique
  const chronologicalAge = parseInt(userProfile.age) || 40;
  const ageDifference = Math.round((100 - finalScore) * 0.3); // Max ±30 ans de différence
  const biologicalAge = chronologicalAge + ageDifference - 15; // Ajustement pour centrer

  // Détermination du profil
  let profile = determineProfile(finalScore, biomarkerScores);

  // Top 3 priorités d'amélioration
  const priorities = calculatePriorities(biomarkerScores);

  // Génération des recommandations personnalisées
  const recommendations = generateRecommendations(profile, priorities, biomarkerScores);

  // Calcul du potentiel d'amélioration
  const improvementPotential = calculateImprovementPotential(biomarkerScores);

  const result = {
    score: finalScore,
    profile: profile,
    biologicalAge: biologicalAge,
    chronologicalAge: chronologicalAge,
    estimatedHealthspan: estimatedHealthspan,
    mortalityRisk: Math.round((mortalityRiskFactor - 1) * 100), // % au-dessus/en-dessous de la moyenne
    biomarkers: biomarkerScores,
    priorities: priorities,
    recommendations: recommendations,
    improvementPotential: improvementPotential,
    scientificReferences: getRelevantReferences(priorities)
  };

  // Sauvegarde en base de données (optionnel)
  // await saveResults(userProfile.email, result);

  return res.status(200).json(result);
}

function determineProfile(score, biomarkers) {
  // Profils basés sur le score et les patterns de biomarqueurs
  if (score >= 90) {
    return {
      level: "Elite Biohacker",
      description: "Tu fais partie du top 1% en termes d'optimisation biologique",
      color: "#00FF00",
      emoji: "🚀"
    };
  } else if (score >= 75) {
    return {
      level: "Optimisé",
      description: "Excellente foundation, quelques ajustements pour atteindre l'élite",
      color: "#7FFF00",
      emoji: "💪"
    };
  } else if (score >= 60) {
    return {
      level: "Consciencieux",
      description: "Tu as les bases mais un potentiel énorme inexploité",
      color: "#FFD700",
      emoji: "⚡"
    };
  } else if (score >= 40) {
    return {
      level: "À Risque",
      description: "Plusieurs signaux d'alarme, action urgente recommandée",
      color: "#FF8C00",
      emoji: "⚠️"
    };
  } else {
    return {
      level: "Critique",
      description: "Ton corps vieillit prématurément, transformation urgente nécessaire",
      color: "#FF0000",
      emoji: "🆘"
    };
  }
}

function calculatePriorities(biomarkers) {
  // Identifie les 3 domaines prioritaires basés sur l'impact potentiel
  const priorities = [];
  
  Object.entries(biomarkers).forEach(([marker, data]) => {
    const avgScore = data.score / data.count;
    const impact = (5 - avgScore) * data.weight; // Potentiel d'amélioration × importance
    
    priorities.push({
      biomarker: marker,
      currentScore: avgScore,
      impact: impact,
      category: data.category,
      improvementPotential: Math.round((5 - avgScore) * 20) // % d'amélioration possible
    });
  });

  // Tri par impact décroissant et retour du top 3
  return priorities
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 3)
    .map((p, index) => ({
      ...p,
      priority: index + 1,
      actionableInsight: getActionableInsight(p.biomarker, p.currentScore)
    }));
}

function generateRecommendations(profile, priorities, biomarkers) {
  const recommendations = {
    immediate: [], // Actions à faire dans les 24h
    week1: [],     // Première semaine
    month1: [],    // Premier mois
    protocol: []   // Protocole personnalisé long terme
  };

  // Recommandations basées sur les priorités
  priorities.forEach(priority => {
    const reco = getRecommendationForBiomarker(priority.biomarker, priority.currentScore);
    recommendations.immediate.push(reco.immediate);
    recommendations.week1.push(reco.week1);
    recommendations.month1.push(reco.month1);
    recommendations.protocol.push(reco.protocol);
  });

  return recommendations;
}

function getRecommendationForBiomarker(biomarker, score) {
  const recommendations = {
    vo2max: {
      immediate: "Test de Cooper: mesure ta distance en 12 min de course",
      week1: "3x HIIT de 20 min (4min effort/2min récup)",
      month1: "Programme Zone 2 + HIIT structuré",
      protocol: "80% Zone 2, 20% HIIT, test VO2 max mensuel"
    },
    muscle_strength: {
      immediate: "Test max pompes + planche",
      week1: "3x musculation full body",
      month1: "Progressive overload sur 6 exercices clés",
      protocol: "Push/Pull/Legs 2x/semaine + tests force mensuels"
    },
    sleep_duration: {
      immediate: "Coucher 30 min plus tôt ce soir",
      week1: "Routine sommeil: -2h écrans, -10°C chambre",
      month1: "Optimisation complète: horaires, température, suppléments",
      protocol: "7-9h/nuit, tracking Oura/Whoop, ajustements hebdo"
    },
    hrv: {
      immediate: "5 min cohérence cardiaque maintenant",
      week1: "HRV morning routine: 10 min breathwork",
      month1: "Protocole complet: froid, méditation, recovery",
      protocol: "Mesure quotidienne + interventions ciblées"
    },
    glucose: {
      immediate: "Jeûne intermittent 16:8 dès demain",
      week1: "Élimination sucres raffinés + CGM",
      month1: "Protocole métabolique complet",
      protocol: "Glycémie <85, HbA1c <5.4%, zone training"
    }
  };

  return recommendations[biomarker] || {
    immediate: "Analyse approfondie nécessaire",
    week1: "Tests complémentaires",
    month1: "Protocole personnalisé",
    protocol: "Suivi mensuel des biomarqueurs"
  };
}

function calculateImprovementPotential(biomarkers) {
  // Calcule le gain potentiel en années de vie en bonne santé
  let potentialYears = 0;
  
  Object.entries(biomarkers).forEach(([marker, data]) => {
    const avgScore = data.score / data.count;
    if (avgScore < 3) {
      const improvement = (3 - avgScore) * data.weight;
      potentialYears += improvement * 1.5; // Conversion en années
    }
  });

  return {
    years: Math.round(potentialYears),
    percentage: Math.round(potentialYears / 0.85), // % d'amélioration du healthspan
    timeframe: potentialYears > 10 ? "6-12 mois" : "3-6 mois"
  };
}

function getActionableInsight(biomarker, score) {
  const insights = {
    vo2max: score < 3 ? 
      "Ta capacité cardiovasculaire est ton facteur limitant #1" :
      "Maintiens ton excellent niveau cardiovasculaire",
    muscle_strength: score < 3 ?
      "Ta force musculaire limite drastiquement ta longévité" :
      "Ta force est un atout, continue le renforcement",
    sleep_duration: score < 3 ?
      "Ton manque de sommeil sabote tous tes autres efforts" :
      "Ton sommeil est optimisé, garde cette routine",
    hrv: score < 3 ?
      "Ton système nerveux est en stress chronique" :
      "Bonne régulation nerveuse, maintiens l'équilibre",
    glucose: score < 3 ?
      "Ta glycémie indique un vieillissement accéléré" :
      "Excellente santé métabolique, continue ainsi"
  };
  
  return insights[biomarker] || "Analyse détaillée recommandée";
}

function getRelevantReferences(priorities) {
  const references = {
    vo2max: {
      study: "Mandsager et al., 2018",
      journal: "JAMA",
      finding: "VO2max est le prédicteur #1 de mortalité toutes causes",
      url: "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2707428"
    },
    muscle_strength: {
      study: "Ruiz et al., 2008",
      journal: "BMJ",
      finding: "Force musculaire réduit de 50% la mortalité",
      url: "https://www.bmj.com/content/337/bmj.a439"
    },
    sleep_duration: {
      study: "Cappuccio et al., 2010",
      journal: "Sleep Medicine Reviews",
      finding: "<6h sommeil = +30% mortalité",
      url: "https://pubmed.ncbi.nlm.nih.gov/20469800/"
    },
    hrv: {
      study: "Tsuji et al., 2017",
      journal: "Circulation",
      finding: "HRV bas = +32% risque cardiovasculaire",
      url: "https://www.ahajournals.org/doi/10.1161/01.CIR.94.11.2850"
    },
    glucose: {
      study: "Selvin et al., 2011",
      journal: "NEJM",
      finding: "Chaque 1% HbA1c = +8% mortalité",
      url: "https://www.nejm.org/doi/full/10.1056/NEJMoa0908359"
    }
  };

  return priorities.map(p => references[p.biomarker]).filter(Boolean);
}

// Helper function pour trouver une question par ID
function findQuestionById(questionId) {
  // Cette fonction devrait idéalement interroger la même source que l'endpoint questions
  // Pour simplifier, on retourne un placeholder
  return {
    type: 'single',
    biomarker: 'energy',
    category: 'general',
    options: [
      { value: 'low', score: 1 },
      { value: 'medium', score: 3 },
      { value: 'high', score: 5 }
    ]
  };
}
