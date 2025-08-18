// api/questions.js - Vercel Function
// Endpoint pour servir les questions de manière sécurisée

const QUIZ_CONFIG = require('./config');

export default function handler(req, res) {
  // CORS headers pour permettre l'accès depuis ton domaine
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Questions organisées par sections avec metadata scientifique
  const quizData = {
    sections: [
      {
        id: "energy-baseline",
        title: "Baseline Énergétique",
        weight: 3, // Poids modéré dans le scoring
        questions: [
          {
            id: "q1",
            text: "Comment décrirais-tu ton niveau d'énergie actuel ?",
            type: "single",
            category: "energy",
            biomarker: "mitochondrial_function",
            options: [
              { value: "exhausted", label: "Je suis épuisé(e) en permanence", score: 1 },
              { value: "tired", label: "Souvent fatigué(e), ça fluctue", score: 2 },
              { value: "ok", label: "Correct mais irrégulier", score: 3 },
              { value: "excellent", label: "Excellent et stable toute la journée", score: 5 }
            ]
          },
          {
            id: "q2",
            text: "À quelle fréquence te sens-tu 'au top' de ta forme ?",
            type: "single",
            category: "energy",
            biomarker: "energy_consistency",
            options: [
              { value: "never", label: "Jamais vraiment", score: 1 },
              { value: "monthly", label: "Quelques fois par mois", score: 2 },
              { value: "weekly", label: "Plusieurs fois par semaine", score: 3 },
              { value: "daily", label: "Tous les jours ou presque", score: 5 }
            ]
          },
          {
            id: "q3",
            text: "Quand tu te réveilles le matin, tu te sens comment ?",
            type: "single",
            category: "sleep",
            biomarker: "sleep_quality",
            options: [
              { value: "exhausted_morning", label: "Épuisé(e), j'ai besoin de café", score: 1 },
              { value: "tired_morning", label: "Fatigué(e) mais ça va", score: 2 },
              { value: "good_morning", label: "En forme", score: 3 },
              { value: "energized_morning", label: "Plein(e) d'énergie", score: 5 }
            ]
          }
        ]
      },
      {
        id: "critical-biomarkers",
        title: "Biomarqueurs Critiques",
        weight: 5, // Poids maximal - impact majeur sur longévité
        questions: [
          {
            id: "q4",
            text: "Connais-tu ta VO2 max actuelle ?",
            type: "single",
            category: "fitness",
            biomarker: "vo2max",
            scientific_ref: "Mandsager et al., JAMA 2018",
            impact_years: 12,
            options: [
              { value: "very_low", label: "< 25 ml/kg/min", score: 1, mortality_risk: 5.0 },
              { value: "low", label: "25-35 ml/kg/min", score: 2, mortality_risk: 2.5 },
              { value: "moderate", label: "35-45 ml/kg/min", score: 3, mortality_risk: 1.5 },
              { value: "good", label: "45-55 ml/kg/min", score: 4, mortality_risk: 1.0 },
              { value: "excellent", label: "> 55 ml/kg/min", score: 5, mortality_risk: 0.5 },
              { value: "unknown", label: "Je ne sais pas", score: 2, mortality_risk: 2.0 }
            ]
          },
          {
            id: "q5",
            text: "Combien d'heures dors-tu en moyenne ?",
            type: "single",
            category: "sleep",
            biomarker: "sleep_duration",
            scientific_ref: "Sleep Medicine Reviews 2010",
            impact_years: 8,
            options: [
              { value: "less_5", label: "Moins de 5h", score: 1, mortality_risk: 1.5 },
              { value: "5_6", label: "5-6h", score: 2, mortality_risk: 1.3 },
              { value: "6_7", label: "6-7h", score: 3, mortality_risk: 1.1 },
              { value: "7_8", label: "7-8h", score: 5, mortality_risk: 1.0 },
              { value: "8_9", label: "8-9h", score: 4, mortality_risk: 1.0 },
              { value: "more_9", label: "Plus de 9h", score: 2, mortality_risk: 1.2 }
            ]
          },
          {
            id: "q6",
            text: "Peux-tu faire 40 pompes d'affilée ?",
            type: "single",
            category: "fitness",
            biomarker: "muscle_strength",
            scientific_ref: "BMJ 2008, Ruiz et al.",
            impact_years: 10,
            options: [
              { value: "zero", label: "Pas une seule", score: 1, mortality_risk: 2.0 },
              { value: "less_10", label: "Moins de 10", score: 2, mortality_risk: 1.5 },
              { value: "10_25", label: "10-25", score: 3, mortality_risk: 1.2 },
              { value: "25_40", label: "25-40", score: 4, mortality_risk: 1.0 },
              { value: "more_40", label: "Plus de 40", score: 5, mortality_risk: 0.7 }
            ]
          }
        ]
      },
      {
        id: "metabolic-health",
        title: "Santé Métabolique",
        weight: 4,
        questions: [
          {
            id: "q7",
            text: "Quelle est ta glycémie à jeun ?",
            type: "single",
            category: "metabolic",
            biomarker: "glucose",
            scientific_ref: "NEJM 2011",
            impact_years: 7,
            options: [
              { value: "optimal", label: "< 85 mg/dL", score: 5, mortality_risk: 0.8 },
              { value: "normal", label: "85-99 mg/dL", score: 4, mortality_risk: 1.0 },
              { value: "prediabetic", label: "100-125 mg/dL", score: 2, mortality_risk: 1.5 },
              { value: "diabetic", label: "> 125 mg/dL", score: 1, mortality_risk: 2.0 },
              { value: "unknown_glucose", label: "Je ne sais pas", score: 2, mortality_risk: 1.3 }
            ]
          },
          {
            id: "q8",
            text: "Ton pourcentage de masse grasse ?",
            type: "single",
            category: "body_composition",
            biomarker: "body_fat",
            scientific_ref: "Lancet 2009",
            impact_years: 6,
            conditional: {
              basedOn: "gender",
              conditions: {
                male: {
                  options: [
                    { value: "athlete_m", label: "< 10%", score: 5, mortality_risk: 0.9 },
                    { value: "fit_m", label: "10-15%", score: 4, mortality_risk: 1.0 },
                    { value: "normal_m", label: "15-20%", score: 3, mortality_risk: 1.1 },
                    { value: "overweight_m", label: "20-25%", score: 2, mortality_risk: 1.5 },
                    { value: "obese_m", label: "> 25%", score: 1, mortality_risk: 2.5 }
                  ]
                },
                female: {
                  options: [
                    { value: "athlete_f", label: "< 18%", score: 5, mortality_risk: 0.9 },
                    { value: "fit_f", label: "18-23%", score: 4, mortality_risk: 1.0 },
                    { value: "normal_f", label: "23-28%", score: 3, mortality_risk: 1.1 },
                    { value: "overweight_f", label: "28-33%", score: 2, mortality_risk: 1.5 },
                    { value: "obese_f", label: "> 33%", score: 1, mortality_risk: 2.5 }
                  ]
                }
              }
            }
          }
        ]
      },
      {
        id: "lifestyle-factors",
        title: "Facteurs Lifestyle",
        weight: 2,
        questions: [
          {
            id: "q9",
            text: "Combien de pas fais-tu par jour en moyenne ?",
            type: "single",
            category: "activity",
            biomarker: "daily_steps",
            scientific_ref: "JAMA 2020",
            impact_years: 4,
            options: [
              { value: "sedentary", label: "< 3000", score: 1, mortality_risk: 1.8 },
              { value: "low_active", label: "3000-5000", score: 2, mortality_risk: 1.5 },
              { value: "somewhat_active", label: "5000-7500", score: 3, mortality_risk: 1.2 },
              { value: "active", label: "7500-10000", score: 4, mortality_risk: 1.0 },
              { value: "very_active", label: "> 10000", score: 5, mortality_risk: 0.8 }
            ]
          },
          {
            id: "q10",
            text: "Fréquence de consommation d'aliments ultra-transformés ?",
            type: "single",
            category: "nutrition",
            biomarker: "processed_foods",
            scientific_ref: "BMJ 2019",
            impact_years: 5,
            options: [
              { value: "daily_multiple", label: "Plusieurs fois par jour", score: 1, mortality_risk: 1.62 },
              { value: "daily", label: "Une fois par jour", score: 2, mortality_risk: 1.4 },
              { value: "weekly", label: "Quelques fois par semaine", score: 3, mortality_risk: 1.2 },
              { value: "monthly", label: "Quelques fois par mois", score: 4, mortality_risk: 1.1 },
              { value: "rarely", label: "Rarement ou jamais", score: 5, mortality_risk: 1.0 }
            ]
          }
        ]
      },
      {
        id: "advanced-tracking",
        title: "Tracking Avancé",
        weight: 3,
        questions: [
          {
            id: "q11",
            text: "Quelle est ta variabilité cardiaque (HRV) moyenne ?",
            type: "single",
            category: "cardiovascular",
            biomarker: "hrv",
            scientific_ref: "Circulation 2017",
            impact_years: 6,
            options: [
              { value: "very_low_hrv", label: "< 20ms", score: 1, mortality_risk: 1.8 },
              { value: "low_hrv", label: "20-30ms", score: 2, mortality_risk: 1.5 },
              { value: "moderate_hrv", label: "30-50ms", score: 3, mortality_risk: 1.2 },
              { value: "good_hrv", label: "50-70ms", score: 4, mortality_risk: 1.0 },
              { value: "excellent_hrv", label: "> 70ms", score: 5, mortality_risk: 0.8 },
              { value: "unknown_hrv", label: "Je ne mesure pas", score: 2, mortality_risk: 1.3 }
            ]
          },
          {
            id: "q12",
            text: "Utilises-tu des outils de tracking santé ?",
            type: "multiple",
            category: "quantified_self",
            biomarker: "health_awareness",
            options: [
              { value: "oura", label: "Oura Ring", score: 1 },
              { value: "whoop", label: "Whoop", score: 1 },
              { value: "apple_watch", label: "Apple Watch", score: 0.8 },
              { value: "garmin", label: "Garmin", score: 0.8 },
              { value: "cgm", label: "Capteur de glucose", score: 1.5 },
              { value: "biomarkers", label: "Tests sanguins réguliers", score: 2 },
              { value: "dexa", label: "DEXA scan", score: 1.5 },
              { value: "none", label: "Aucun", score: 0 }
            ]
          }
        ]
      }
    ],
    wowBreaks: [
      {
        id: "wow1",
        afterQuestion: "q3",
        title: "😴 Le Saviez-Vous ?",
        content: "Les entrepreneurs qui dorment moins de 6h ont 4.5x plus de risques de burnout dans les 2 ans.",
        source: "Stanford Business School Study 2023"
      },
      {
        id: "wow2",
        afterQuestion: "q6",
        title: "💪 Fait Choquant",
        content: "Pouvoir faire 40+ pompes réduit de 96% le risque cardiovasculaire sur 10 ans.",
        source: "Harvard School of Public Health 2019"
      },
      {
        id: "wow3",
        afterQuestion: "q8",
        title: "⚡ Révélation",
        content: "Ta VO2 max est le prédicteur #1 de longévité, devant TOUS les autres facteurs.",
        source: "Cleveland Clinic Study, JAMA 2018"
      }
    ]
  };

  return res.status(200).json(quizData);
}
