// api/config.js - Configuration centralisée pour modifications faciles
// Tout le contenu modifiable en un seul endroit

export const QUIZ_CONFIG = {
  // Metadata
  meta: {
    title: "ORA Life - Évalue l'Impact de Tes Habitudes sur Ta Longévité",
    description: "Diagnostic gratuit basé sur 12+ études scientifiques pour évaluer tes facteurs de vieillissement modifiables",
    ogTitle: "ORA Life - Score de Vitalité Scientifique",
    ogDescription: "Évalue tes habitudes de vie et leur impact sur ta longévité"
  },

  // Textes de l'interface
  ui: {
    landing: {
      title: "Découvre les 7 Signaux que Ton Corps Vieillit Trop Vite",
      subtitle: "Évaluation scientifique basée sur les dernières recherches en longévité",
      ctaButton: "Commencer l'Évaluation Gratuite",
      participants: 2847,
      timeEstimate: "3-4 minutes"
    },
    benefits: [
      { icon: "🧬", text: "Score de vitalité personnalisé" },
      { icon: "📊", text: "Analyse de tes biomarqueurs lifestyle" },
      { icon: "🎯", text: "3 priorités d'action concrètes" },
      { icon: "🚀", text: "Protocole adapté à ton profil" }
    ]
  },

  // Configuration du scoring
  scoring: {
    // Poids des biomarqueurs (basés sur la science)
    weights: {
      vo2max: 5.0,           // Mandsager JAMA 2018
      muscle_strength: 5.0,   // Ruiz BMJ 2008
      sleep_duration: 5.0,    // Cappuccio Sleep Med Rev 2010
      sleep_quality: 3.0,
      hrv: 3.0,              // Tsuji Circulation 2017
      glucose: 3.0,          // Selvin NEJM 2011
      body_fat: 3.0,         // Pischon Lancet 2009
      processed_foods: 2.0,   // Rico-Campà BMJ 2019
      daily_steps: 2.0,      // Saint-Maurice JAMA 2020
      energy: 1.5,
      health_awareness: 1.0
    },

    // Seuils pour les profils
    profiles: [
      {
        minScore: 90,
        level: "Biohacker Elite",
        description: "Tu fais partie du top 1% en termes d'optimisation",
        color: "#00FF00",
        emoji: "🚀"
      },
      {
        minScore: 70,
        level: "Optimisé",
        description: "Excellente base, quelques ajustements pour atteindre l'élite",
        color: "#7FFF00",
        emoji: "💪"
      },
      {
        minScore: 50,
        level: "Potentiel",
        description: "Des bases solides avec un énorme potentiel inexploité",
        color: "#FFD700",
        emoji: "⚡"
      },
      {
        minScore: 30,
        level: "À Risque",
        description: "Plusieurs signaux d'alarme, action recommandée",
        color: "#FF8C00",
        emoji: "⚠️"
      },
      {
        minScore: 0,
        level: "Urgent",
        description: "Transformation urgente nécessaire pour ta santé",
        color: "#FF0000",
        emoji: "🆘"
      }
    ]
  },

  // Recommandations par biomarqueur
  recommendations: {
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
    },
    body_fat: {
      immediate: "Photo avant + mesures (tour taille, poids)",
      week1: "Déficit calorique modéré -300-500 kcal",
      month1: "Recomposition corporelle: musculation + protein",
      protocol: "DEXA scan trimestriel, bodyfat <15% H / <23% F"
    },
    processed_foods: {
      immediate: "Liste courses: 80% aliments non-transformés",
      week1: "Meal prep dimanche: 5 repas préparés",
      month1: "Élimination totale ultra-transformés",
      protocol: "Whole food diet, 30g fibres/jour, tracking macros"
    },
    daily_steps: {
      immediate: "Marche 15 min après chaque repas",
      week1: "Objectif 8000 pas/jour minimum",
      month1: "10000 pas + 2x musculation/semaine",
      protocol: "12000 pas moyens, standing desk, walking meetings"
    }
  },

  // Références scientifiques
  references: {
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
    },
    body_fat: {
      study: "Pischon et al., 2009",
      journal: "Lancet",
      finding: ">30% bodyfat = 2.5x mortalité",
      url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(08)61692-1/fulltext"
    },
    processed_foods: {
      study: "Rico-Campà et al., 2019",
      journal: "BMJ",
      finding: ">4 portions/jour = +62% mortalité",
      url: "https://www.bmj.com/content/365/bmj.l1949"
    },
    daily_steps: {
      study: "Saint-Maurice et al., 2020",
      journal: "JAMA",
      finding: "8000+ pas = -51% mortalité",
      url: "https://jamanetwork.com/journals/jama/fullarticle/2763292"
    }
  },

  // Messages et textes
  messages: {
    loading: "Analyse de tes réponses en cours...",
    loadingSubtext: "Calcul de ton score basé sur 12+ études scientifiques",
    errorGeneric: "Une erreur s'est produite. Veuillez réessayer.",
    emailSuccess: "✅ Protocole envoyé ! Check tes emails",
    selectAnswer: "Veuillez sélectionner une réponse",
    
    results: {
      title: "Tes Résultats ORA Life",
      prioritiesTitle: "🎯 Tes 3 Priorités",
      protocolTitle: "🚀 Ton Protocole Personnalisé",
      ctaTitle: "Prêt à Transformer Ta Vitalité ?",
      ctaSubtitle: "Reçois ton protocole complet personnalisé par email",
      ctaButton: "Recevoir Mon Protocole"
    }
  },

  // Configuration des WOW breaks
  wowBreaks: {
    wow1: {
      title: "😴 Le Saviez-Vous ?",
      content: "Les personnes qui dorment moins de 6h ont 30% plus de risques de mortalité prématurée.",
      source: "Cappuccio et al., Sleep Medicine Reviews 2010"
    },
    wow2: {
      title: "💪 Fait Choquant",
      content: "Pouvoir faire 40+ pompes réduit de 96% le risque cardiovasculaire sur 10 ans.",
      source: "Yang et al., JAMA Network Open 2019"
    },
    wow3: {
      title: "⚡ Révélation",
      content: "Ta VO2 max est le prédicteur #1 de longévité, devant TOUS les autres facteurs.",
      source: "Mandsager et al., JAMA 2018"
    },
    wow4: {
      title: "🍔 Impact Alimentaire",
      content: "Chaque portion quotidienne d'ultra-transformés augmente la mortalité de 18%.",
      source: "Rico-Campà et al., BMJ 2019"
    },
    wow5: {
      title: "🚶 Pouvoir des Pas",
      content: "Passer de 2000 à 10000 pas/jour réduit de 28% le risque de mort prématurée.",
      source: "Saint-Maurice et al., JAMA 2020"
    },
    wow6: {
      title: "❤️ Variabilité Cardiaque",
      content: "Une HRV basse double le risque d'événements cardiovasculaires majeurs.",
      source: "Tsuji et al., Circulation 2017"
    }
  },

  // Configuration A/B testing (facile à modifier)
  experiments: {
    showBiologicalAge: true,
    showHealthspan: true,
    showMortalityRisk: false, // Peut être trop anxiogène
    showScientificRefs: true,
    emailRequired: false,
    showSocialProof: true
  }
};

// Export pour utilisation dans les autres fichiers API
export default QUIZ_CONFIG;
