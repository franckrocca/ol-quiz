// api/config.js - Configuration centralisée du quiz
const QUIZ_CONFIG = {
  // Métadonnées
  metadata: {
    version: "2.0.0",
    lastUpdate: "2025-08-18",
    scientificBasis: "12+ études peer-reviewed"
  },

  // Configuration UI
  ui: {
    landing: {
      title: "Découvre Ton Score de Vieillissement",
      subtitle: "Test scientifique gratuit - 3 minutes",
      hook: "⚠️ 98% des gens vieillissent 2x plus vite sans le savoir",
      cta: "COMMENCER LE TEST GRATUIT"
    },
    results: {
      title: "Ton Score de Vitalité ORA",
      subtitle: "Basé sur 12+ études scientifiques"
    }
  },

  // Poids scientifiques (basés sur la littérature)
  scoring: {
    weights: {
      // Impact majeur (5.0)
      vo2max: 5.0,           // Mandsager et al., JAMA 2018
      muscle_strength: 5.0,   // BMJ 2008
      sleep_duration: 5.0,    // Sleep Medicine Reviews 2010
      
      // Impact fort (3.0-4.0)
      sleep_quality: 4.0,     // Walker, Nature 2017
      hrv: 3.5,              // Circulation 2017
      glucose: 3.5,          // NEJM 2011
      body_fat: 3.0,         // Lancet 2009
      
      // Impact modéré (2.0-2.5)
      processed_foods: 2.5,   // BMJ 2019
      daily_steps: 2.0,      // JAMA 2020
      social_connection: 2.0, // Holt-Lunstad 2015
      
      // Impact de base (1.0-1.5)
      energy: 1.5,
      mitochondrial_function: 1.5,
      health_awareness: 1.0,
      energy_consistency: 1.0
    },
    
    // Calcul d'âge biologique
    biologicalAge: {
      baseHealthspan: 85,
      maxReduction: 15,
      maxIncrease: 10
    }
  },

  // WOW Breaks scientifiques
  wowBreaks: [
    {
      id: "wow1",
      afterQuestion: 3,
      title: "😴 Le Saviez-Vous ?",
      content: "Les personnes qui dorment moins de 6h ont 4.5x plus de risques de burnout.",
      stat: "4.5x",
      source: "Sleep Medicine Reviews, 2010"
    },
    {
      id: "wow2",
      afterQuestion: 7,
      title: "💪 Fait Scientifique",
      content: "Une VO2max élevée réduit le risque de mortalité de 80%.",
      stat: "80%",
      source: "JAMA, 2018"
    },
    {
      id: "wow3",
      afterQuestion: 11,
      title: "🧬 Découverte Récente",
      content: "7000 pas/jour suffisent pour réduire la mortalité de 50-70%.",
      stat: "70%",
      source: "JAMA Network, 2021"
    },
    {
      id: "wow4",
      afterQuestion: 15,
      title: "🔥 Impact Majeur",
      content: "Le jeûne intermittent peut augmenter l'espérance de vie de 10-15%.",
      stat: "15%",
      source: "Cell Metabolism, 2021"
    },
    {
      id: "wow5",
      afterQuestion: 19,
      title: "🧠 Neuroplasticité",
      content: "La méditation augmente la matière grise de 5% en 8 semaines.",
      stat: "5%",
      source: "Psychiatry Research, 2011"
    },
    {
      id: "wow6",
      afterQuestion: 23,
      title: "⚡ Mitochondries",
      content: "L'exercice HIIT augmente la fonction mitochondriale de 49-69%.",
      stat: "69%",
      source: "Cell Metabolism, 2017"
    },
    {
      id: "wow7",
      afterQuestion: 27,
      title: "🌡️ Hormèse",
      content: "L'exposition au froid augmente la graisse brune de 150%.",
      stat: "150%",
      source: "Journal of Clinical Investigation, 2013"
    },
    {
      id: "wow8",
      afterQuestion: 31,
      title: "🔬 Longévité",
      content: "La restriction calorique peut augmenter la durée de vie de 20%.",
      stat: "20%",
      source: "Science, 2018"
    },
    {
      id: "wow9",
      afterQuestion: 35,
      title: "🧘 Stress & HRV",
      content: "Une HRV élevée réduit le risque cardiovasculaire de 32%.",
      stat: "32%",
      source: "Circulation, 2017"
    }
  ],

  // Recommandations personnalisées
  recommendations: {
    elite: {
      title: "Protocole Elite 🚀",
      items: [
        "Zone 2 training quotidien",
        "Cold exposure 3x/semaine",
        "Tracking HRV continu",
        "Supplementation avancée"
      ]
    },
    optimized: {
      title: "Protocole Optimisation 💪",
      items: [
        "HIIT 2-3x/semaine",
        "Jeûne intermittent 16:8",
        "Méditation 10min/jour",
        "Sleep tracking"
      ]
    },
    potential: {
      title: "Protocole Potentiel ⚡",
      items: [
        "Marche 8000 pas/jour",
        "Coucher avant 23h",
        "Réduction sucre raffiné",
        "Hydratation 2L/jour"
      ]
    },
    risk: {
      title: "Protocole Urgence ⚠️",
      items: [
        "Consultation médicale",
        "Sommeil 7-9h prioritaire",
        "Activité physique de base",
        "Alimentation whole foods"
      ]
    }
  },

  // Configuration Google Sheets
  googleScript: {
    url: "https://script.google.com/macros/s/AKfycbwjyAjH9Nl6y2IeRWHi5Qrr6ftqVilH4T9RMPAdNXM_XYVuaN0WFzrPPYwVL8oOZR0W/exec"
  },

  // Messages et textes
  messages: {
    loading: "Analyse de tes réponses en cours...",
    loadingSubtitle: "Calcul de ton score basé sur 12+ études scientifiques",
    error: "Une erreur est survenue. Veuillez réessayer.",
    emailPrompt: "Entre ton email pour recevoir ton protocole personnalisé",
    emailSuccess: "✅ Protocole envoyé ! Check tes emails.",
    sharePrompt: "Partage ce test avec tes amis entrepreneurs"
  }
};

// Export pour Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QUIZ_CONFIG;
}

// Export pour ES6
export default QUIZ_CONFIG;
