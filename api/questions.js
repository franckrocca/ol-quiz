// api/questions.js - Vercel Function avec TOUTES tes questions exactes
import QUIZ_CONFIG from './config.js';

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Les 38 questions EXACTES de ton quiz index9.html
  const quizData = {
    sections: [
      {
        id: "demographics",
        title: "Profil",
        weight: 1,
        questions: [
          {
            id: "q1",
            text: "Tu es ?",
            type: "single",
            category: "profile",
            isVisual: true,
            options: [
              { 
                value: "homme", 
                label: "Homme", 
                score: 3,
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
              },
              { 
                value: "femme", 
                label: "Femme", 
                score: 3,
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop"
              }
            ]
          },
          {
            id: "q2",
            text: "Ton âge ?",
            type: "single",
            category: "profile",
            biomarker: "age",
            options: [
              { value: "18-29", label: "18-29 ans", score: 5 },
              { value: "30-39", label: "30-39 ans", score: 4 },
              { value: "40-49", label: "40-49 ans", score: 3 },
              { value: "50-59", label: "50-59 ans", score: 2 },
              { value: "60+", label: "60 ans et +", score: 1 }
            ]
          }
        ]
      },
      {
        id: "energy-vitality",
        title: "Énergie et Vitalité",
        weight: 3,
        questions: [
          {
            id: "q3",
            text: "Ton niveau d'énergie quotidien ?",
            type: "single",
            category: "energy",
            biomarker: "energy_level",
            options: [
              { value: "10", label: "10/10 - Débordant", score: 5 },
              { value: "7-9", label: "7-9/10 - Très bien", score: 4 },
              { value: "5-6", label: "5-6/10 - Moyen", score: 3 },
              { value: "3-4", label: "3-4/10 - Faible", score: 2 },
              { value: "0-2", label: "0-2/10 - Épuisé", score: 1 }
            ]
          },
          {
            id: "q4",
            text: "Tu te réveilles comment ?",
            type: "single",
            category: "sleep",
            biomarker: "sleep_quality",
            options: [
              { value: "energized", label: "Frais et dispo", score: 5 },
              { value: "ok", label: "Ça va", score: 3 },
              { value: "tired", label: "Fatigué(e)", score: 2 },
              { value: "exhausted", label: "Épuisé(e)", score: 1 }
            ]
          }
        ]
      },
      {
        id: "sleep",
        title: "Sommeil",
        weight: 5,
        questions: [
          {
            id: "q5",
            text: "Heures de sommeil par nuit ?",
            type: "single",
            category: "sleep",
            biomarker: "sleep_duration",
            scientific_ref: "Walker, Nature 2017",
            options: [
              { value: "less_5", label: "Moins de 5h", score: 1, mortality_risk: 1.5 },
              { value: "5-6", label: "5-6h", score: 2, mortality_risk: 1.3 },
              { value: "6-7", label: "6-7h", score: 3, mortality_risk: 1.1 },
              { value: "7-9", label: "7-9h", score: 5, mortality_risk: 1.0 },
              { value: "more_9", label: "Plus de 9h", score: 2, mortality_risk: 1.2 }
            ]
          },
          {
            id: "q6",
            text: "Réveils nocturnes ?",
            type: "single",
            category: "sleep",
            biomarker: "sleep_interruptions",
            options: [
              { value: "0", label: "Jamais", score: 5 },
              { value: "1", label: "1 fois", score: 4 },
              { value: "2-3", label: "2-3 fois", score: 2 },
              { value: "4+", label: "4+ fois", score: 1 }
            ]
          },
          {
            id: "q7",
            text: "Temps pour t'endormir ?",
            type: "single",
            category: "sleep",
            biomarker: "sleep_latency",
            options: [
              { value: "less_10", label: "Moins de 10 min", score: 5 },
              { value: "10-20", label: "10-20 min", score: 4 },
              { value: "20-30", label: "20-30 min", score: 3 },
              { value: "30-60", label: "30-60 min", score: 2 },
              { value: "more_60", label: "Plus d'1h", score: 1 }
            ]
          }
        ]
      },
      {
        id: "physical-activity",
        title: "Activité Physique",
        weight: 4,
        questions: [
          {
            id: "q8",
            text: "Sport par semaine ?",
            type: "single",
            category: "fitness",
            biomarker: "exercise_frequency",
            options: [
              { value: "0", label: "Jamais", score: 1 },
              { value: "1-2", label: "1-2 fois", score: 2 },
              { value: "3-4", label: "3-4 fois", score: 4 },
              { value: "5+", label: "5+ fois", score: 5 }
            ]
          },
          {
            id: "q9",
            text: "Tu peux monter 3 étages sans être essoufflé(e) ?",
            type: "single",
            category: "fitness",
            biomarker: "cardiovascular_fitness",
            options: [
              { value: "easily", label: "Très facilement", score: 5 },
              { value: "yes", label: "Oui sans problème", score: 4 },
              { value: "bit_hard", label: "Un peu dur", score: 3 },
              { value: "very_hard", label: "Très difficile", score: 2 },
              { value: "impossible", label: "Impossible", score: 1 }
            ]
          },
          {
            id: "q10",
            text: "Pas quotidiens en moyenne ?",
            type: "single",
            category: "activity",
            biomarker: "daily_steps",
            scientific_ref: "Saint-Maurice, JAMA 2020",
            options: [
              { value: "less_3000", label: "Moins de 3000", score: 1, mortality_risk: 1.8 },
              { value: "3000-5000", label: "3000-5000", score: 2, mortality_risk: 1.5 },
              { value: "5000-7500", label: "5000-7500", score: 3, mortality_risk: 1.2 },
              { value: "7500-10000", label: "7500-10000", score: 4, mortality_risk: 1.0 },
              { value: "more_10000", label: "Plus de 10000", score: 5, mortality_risk: 0.8 }
            ]
          }
        ]
      },
      {
        id: "nutrition",
        title: "Nutrition",
        weight: 3,
        questions: [
          {
            id: "q11",
            text: "Portions de fruits/légumes par jour ?",
            type: "single",
            category: "nutrition",
            biomarker: "vegetables_intake",
            options: [
              { value: "0-1", label: "0-1", score: 1 },
              { value: "2-3", label: "2-3", score: 2 },
              { value: "4-5", label: "4-5", score: 3 },
              { value: "6-7", label: "6-7", score: 4 },
              { value: "8+", label: "8+", score: 5 }
            ]
          },
          {
            id: "q12",
            text: "Fast-food/Ultra-transformés par semaine ?",
            type: "single",
            category: "nutrition",
            biomarker: "processed_foods",
            scientific_ref: "Rico-Campà, BMJ 2019",
            options: [
              { value: "0", label: "Jamais", score: 5, mortality_risk: 1.0 },
              { value: "1-2", label: "1-2 fois", score: 4, mortality_risk: 1.1 },
              { value: "3-4", label: "3-4 fois", score: 3, mortality_risk: 1.2 },
              { value: "5-6", label: "5-6 fois", score: 2, mortality_risk: 1.4 },
              { value: "7+", label: "Tous les jours", score: 1, mortality_risk: 1.62 }
            ]
          },
          {
            id: "q13",
            text: "Verres d'eau par jour ?",
            type: "single",
            category: "nutrition",
            biomarker: "hydration",
            options: [
              { value: "less_3", label: "Moins de 3", score: 1 },
              { value: "3-5", label: "3-5", score: 2 },
              { value: "6-8", label: "6-8", score: 4 },
              { value: "more_8", label: "Plus de 8", score: 5 }
            ]
          },
          {
            id: "q14",
            text: "Alcool par semaine ?",
            type: "single",
            category: "lifestyle",
            biomarker: "alcohol_consumption",
            options: [
              { value: "0", label: "Jamais", score: 5 },
              { value: "1-2", label: "1-2 verres", score: 4 },
              { value: "3-7", label: "3-7 verres", score: 3 },
              { value: "8-14", label: "8-14 verres", score: 2 },
              { value: "15+", label: "15+ verres", score: 1 }
            ]
          }
        ]
      },
      {
        id: "body-composition",
        title: "Composition Corporelle",
        weight: 3,
        questions: [
          {
            id: "q15",
            text: "IMC (calcul après)",
            type: "calculated",
            category: "body_composition",
            biomarker: "bmi",
            note: "Sera calculé avec taille/poids"
          },
          {
            id: "q16",
            text: "Mémoire et concentration ?",
            type: "single",
            category: "cognitive",
            biomarker: "memory_focus",
            options: [
              { value: "excellent", label: "Excellentes", score: 5 },
              { value: "minor", label: "Quelques oublis mineurs", score: 4 },
              { value: "frequent", label: "Difficultés fréquentes", score: 2 },
              { value: "fog", label: "Brouillard mental régulier", score: 1 },
              { value: "worrying", label: "Très inquiétant", score: 1 }
            ]
          },
          {
            id: "q17",
            text: "Question conditionnelle",
            type: "conditional",
            category: "symptoms",
            conditional: {
              basedOn: "gender",
              conditions: {
                homme: {
                  text: "Troubles érectiles ?",
                  biomarker: "erectile_function",
                  options: [
                    { value: "never", label: "Jamais", score: 5 },
                    { value: "rare", label: "Rarement", score: 4 },
                    { value: "sometimes", label: "Parfois", score: 3 },
                    { value: "often", label: "Souvent", score: 2 },
                    { value: "always", label: "Systématiquement", score: 1 }
                  ]
                },
                femme: {
                  text: "Perte de masse musculaire visible ?",
                  biomarker: "muscle_loss",
                  options: [
                    { value: "none", label: "Aucune", score: 5 },
                    { value: "slight", label: "Légère", score: 4 },
                    { value: "moderate", label: "Modérée", score: 3 },
                    { value: "significant", label: "Importante", score: 2 },
                    { value: "severe", label: "Très importante", score: 1 }
                  ]
                }
              }
            }
          }
        ]
      },
      {
        id: "recovery-stress",
        title: "Récupération et Stress",
        weight: 3,
        questions: [
          {
            id: "q18",
            text: "Récupération après effort physique :",
            type: "single",
            category: "recovery",
            biomarker: "recovery_time",
            options: [
              { value: "less_24h", label: "Moins de 24h", score: 5 },
              { value: "24-48h", label: "24-48h", score: 4 },
              { value: "2-3d", label: "2-3 jours", score: 3 },
              { value: "4-7d", label: "4-7 jours", score: 2 },
              { value: "more_week", label: "Plus d'une semaine", score: 1 }
            ]
          },
          {
            id: "q19",
            text: "Niveau de stress chronique :",
            type: "single",
            category: "mental",
            biomarker: "stress_level",
            scientific_ref: "Cohen et al., JAMA 2007",
            options: [
              { value: "zen", label: "Zen permanent", score: 5 },
              { value: "manageable", label: "Gérable la plupart du temps", score: 4 },
              { value: "high_regular", label: "Élevé régulièrement", score: 3 },
              { value: "very_high", label: "Très élevé", score: 2 },
              { value: "overwhelming", label: "Écrasant/Burnout", score: 1 }
            ]
          },
          {
            id: "q20",
            text: "Anxiété ou dépression ?",
            type: "single",
            category: "mental",
            biomarker: "mental_health",
            options: [
              { value: "never", label: "Jamais", score: 5 },
              { value: "rare", label: "Rarement", score: 4 },
              { value: "sometimes", label: "Parfois", score: 3 },
              { value: "often", label: "Souvent", score: 2 },
              { value: "daily", label: "Quotidiennement", score: 1 }
            ]
          }
        ]
      },
      {
        id: "skin-appearance",
        title: "Peau et Apparence",
        weight: 2,
        questions: [
          {
            id: "q21",
            text: "État de ta peau ?",
            type: "single",
            category: "appearance",
            biomarker: "skin_health",
            options: [
              { value: "perfect", label: "Parfaite, éclatante", score: 5 },
              { value: "good", label: "Bonne avec imperfections mineures", score: 4 },
              { value: "ok", label: "Correcte", score: 3 },
              { value: "issues", label: "Problèmes visibles", score: 2 },
              { value: "poor", label: "Très abîmée", score: 1 }
            ]
          },
          {
            id: "q22",
            text: "Rides visibles ?",
            type: "single",
            category: "appearance",
            biomarker: "wrinkles",
            options: [
              { value: "none", label: "Aucune", score: 5 },
              { value: "fine", label: "Fines ridules", score: 4 },
              { value: "some", label: "Quelques rides", score: 3 },
              { value: "marked", label: "Rides marquées", score: 2 },
              { value: "deep", label: "Rides profondes", score: 1 }
            ]
          },
          {
            id: "q23",
            text: "Cheveux (perte, gris) ?",
            type: "single",
            category: "appearance",
            biomarker: "hair_health",
            options: [
              { value: "perfect", label: "Parfaits, aucun souci", score: 5 },
              { value: "minor", label: "Légers changements", score: 4 },
              { value: "moderate", label: "Changements modérés", score: 3 },
              { value: "significant", label: "Changements importants", score: 2 },
              { value: "severe", label: "Perte/grisonnement sévère", score: 1 }
            ]
          }
        ]
      },
      {
        id: "digestion",
        title: "Digestion",
        weight: 2,
        questions: [
          {
            id: "q24",
            text: "Digestion générale ?",
            type: "single",
            category: "digestion",
            biomarker: "gut_health",
            options: [
              { value: "perfect", label: "Parfaite", score: 5 },
              { value: "good", label: "Bonne", score: 4 },
              { value: "ok", label: "Correcte", score: 3 },
              { value: "issues", label: "Problèmes fréquents", score: 2 },
              { value: "poor", label: "Très problématique", score: 1 }
            ]
          },
          {
            id: "q25",
            text: "Ballonnements ?",
            type: "single",
            category: "digestion",
            biomarker: "bloating",
            options: [
              { value: "never", label: "Jamais", score: 5 },
              { value: "rare", label: "Rarement", score: 4 },
              { value: "sometimes", label: "Parfois", score: 3 },
              { value: "often", label: "Souvent", score: 2 },
              { value: "always", label: "Toujours", score: 1 }
            ]
          },
          {
            id: "q26",
            text: "Transit intestinal ?",
            type: "single",
            category: "digestion",
            biomarker: "bowel_movement",
            options: [
              { value: "daily", label: "1-2x/jour régulier", score: 5 },
              { value: "regular", label: "Régulier", score: 4 },
              { value: "variable", label: "Variable", score: 3 },
              { value: "constipation", label: "Constipation fréquente", score: 2 },
              { value: "issues", label: "Problèmes chroniques", score: 1 }
            ]
          }
        ]
      },
      {
        id: "libido-hormones",
        title: "Libido et Hormones",
        weight: 2,
        questions: [
          {
            id: "q27",
            text: "Libido actuelle ?",
            type: "single",
            category: "hormones",
            biomarker: "libido",
            options: [
              { value: "high", label: "Très élevée", score: 5 },
              { value: "good", label: "Bonne", score: 4 },
              { value: "ok", label: "Correcte", score: 3 },
              { value: "low", label: "Faible", score: 2 },
              { value: "none", label: "Inexistante", score: 1 }
            ]
          },
          {
            id: "q28",
            text: "Changements hormonaux ressentis ?",
            type: "single",
            category: "hormones",
            biomarker: "hormonal_changes",
            options: [
              { value: "none", label: "Aucun", score: 5 },
              { value: "minor", label: "Légers", score: 4 },
              { value: "moderate", label: "Modérés", score: 3 },
              { value: "significant", label: "Importants", score: 2 },
              { value: "severe", label: "Très importants", score: 1 }
            ]
          }
        ]
      },
      {
        id: "immunity",
        title: "Immunité",
        weight: 2,
        questions: [
          {
            id: "q29",
            text: "Rhumes/infections par an ?",
            type: "single",
            category: "immunity",
            biomarker: "infection_frequency",
            options: [
              { value: "0", label: "Jamais malade", score: 5 },
              { value: "1-2", label: "1-2 fois", score: 4 },
              { value: "3-4", label: "3-4 fois", score: 3 },
              { value: "5-6", label: "5-6 fois", score: 2 },
              { value: "more_6", label: "Plus de 6 fois", score: 1 }
            ]
          },
          {
            id: "q30",
            text: "Temps de guérison ?",
            type: "single",
            category: "immunity",
            biomarker: "healing_time",
            options: [
              { value: "fast", label: "Très rapide", score: 5 },
              { value: "normal", label: "Normal", score: 4 },
              { value: "slow", label: "Un peu lent", score: 3 },
              { value: "very_slow", label: "Très lent", score: 2 },
              { value: "chronic", label: "Problèmes chroniques", score: 1 }
            ]
          }
        ]
      },
      {
        id: "vision-hearing",
        title: "Vision et Audition",
        weight: 1,
        questions: [
          {
            id: "q31",
            text: "Vision actuelle ?",
            type: "single",
            category: "senses",
            biomarker: "vision",
            options: [
              { value: "perfect", label: "Parfaite 10/10", score: 5 },
              { value: "good", label: "Bonne avec/sans correction", score: 4 },
              { value: "ok", label: "Correcte avec correction", score: 3 },
              { value: "declining", label: "En baisse", score: 2 },
              { value: "poor", label: "Problématique", score: 1 }
            ]
          },
          {
            id: "q32",
            text: "Audition ?",
            type: "single",
            category: "senses",
            biomarker: "hearing",
            options: [
              { value: "perfect", label: "Parfaite", score: 5 },
              { value: "good", label: "Bonne", score: 4 },
              { value: "ok", label: "Correcte", score: 3 },
              { value: "declining", label: "En baisse", score: 2 },
              { value: "poor", label: "Problématique", score: 1 }
            ]
          }
        ]
      },
      {
        id: "pain-inflammation",
        title: "Douleurs et Inflammation",
        weight: 3,
        questions: [
          {
            id: "q33",
            text: "Douleurs articulaires/musculaires ?",
            type: "single",
            category: "inflammation",
            biomarker: "pain_level",
            options: [
              { value: "never", label: "Jamais", score: 5 },
              { value: "rare", label: "Rarement", score: 4 },
              { value: "sometimes", label: "Parfois", score: 3 },
              { value: "often", label: "Souvent", score: 2 },
              { value: "chronic", label: "Chroniques", score: 1 }
            ]
          },
          {
            id: "q34",
            text: "Question conditionnelle femme",
            type: "conditional",
            category: "hormones",
            conditional: {
              basedOn: "gender",
              conditions: {
                femme: {
                  text: "Symptômes prémenstruels/ménopause ?",
                  biomarker: "female_hormones",
                  options: [
                    { value: "none", label: "Aucun", score: 5 },
                    { value: "mild", label: "Légers", score: 4 },
                    { value: "moderate", label: "Modérés", score: 3 },
                    { value: "severe", label: "Sévères", score: 2 },
                    { value: "debilitating", label: "Handicapants", score: 1 }
                  ]
                },
                homme: {
                  text: "Inflammation générale ressentie ?",
                  biomarker: "inflammation",
                  options: [
                    { value: "none", label: "Aucune", score: 5 },
                    { value: "mild", label: "Légère", score: 4 },
                    { value: "moderate", label: "Modérée", score: 3 },
                    { value: "high", label: "Élevée", score: 2 },
                    { value: "chronic", label: "Chronique", score: 1 }
                  ]
                }
              }
            }
          }
        ]
      },
      {
        id: "social-lifestyle",
        title: "Social et Lifestyle",
        weight: 2,
        questions: [
          {
            id: "q35",
            text: "Relations sociales épanouissantes :",
            type: "single",
            category: "social",
            biomarker: "social_connections",
            scientific_ref: "Holt-Lunstad, PLoS Medicine 2010",
            options: [
              { value: "very_rich", label: "Très riches et nombreuses", score: 5 },
              { value: "satisfying", label: "Satisfaisantes", score: 4 },
              { value: "limited", label: "Limitées", score: 3 },
              { value: "difficult", label: "Difficiles/conflictuelles", score: 2 },
              { value: "isolated", label: "Isolement social", score: 1, mortality_risk: 1.5 }
            ]
          },
          {
            id: "q36",
            text: "Dernières vacances vraiment déconnectées :",
            type: "single",
            category: "lifestyle",
            biomarker: "vacation_recovery",
            options: [
              { value: "less_3m", label: "Il y a moins de 3 mois", score: 5 },
              { value: "3-6m", label: "3-6 mois", score: 4 },
              { value: "6-12m", label: "6-12 mois", score: 3 },
              { value: "more_1y", label: "Plus d'un an", score: 2 },
              { value: "never", label: "Je ne déconnecte jamais", score: 1 }
            ]
          },
          {
            id: "q37",
            text: "Sans changement, dans 5 ans tu seras :",
            type: "single",
            category: "projection",
            biomarker: "future_projection",
            options: [
              { value: "better", label: "En meilleure forme (j'optimise déjà)", score: 5 },
              { value: "same", label: "Pareil qu'aujourd'hui", score: 3 },
              { value: "bit_worse", label: "Un peu moins bien", score: 2 },
              { value: "much_worse", label: "Beaucoup moins bien", score: 1 },
              { value: "worried", label: "Inquiet(e) pour ma santé", score: 1 }
            ]
          },
          {
            id: "q38",
            text: "Prêt(e) à changer tes habitudes ?",
            type: "single",
            category: "motivation",
            biomarker: "change_readiness",
            options: [
              { value: "very_ready", label: "OUI, c'est urgent !", score: 5 },
              { value: "ready", label: "Oui, progressivement", score: 4 },
              { value: "maybe", label: "Peut-être, ça dépend", score: 3 },
              { value: "not_sure", label: "Pas sûr(e)", score: 2 },
              { value: "no", label: "Non, trop compliqué", score: 1 }
            ]
          }
        ]
      }
    ],
    
    // Les 6 WOW breaks EXACTS de ton quiz
    wowBreaks: [
      {
        id: "wow1",
        afterQuestion: "q4",
        title: "😴 ALERTE SOMMEIL",
        stat: "73%",
        content: "des gens qui dorment mal vieillissent 2x plus vite",
        source: "Harvard Medical School, 2023"
      },
      {
        id: "wow2",
        afterQuestion: "q10",
        title: "🚶 SÉDENTARITÉ = DANGER",
        stat: "-8 ans",
        content: "d'espérance de vie si moins de 4000 pas/jour",
        source: "European Heart Journal, 2023"
      },
      {
        id: "wow3",
        afterQuestion: "q14",
        title: "🍔 MALBOUFFE MORTELLE",
        stat: "+58%",
        content: "de risque de mort prématurée avec 4+ ultra-transformés/jour",
        source: "British Medical Journal, 2024"
      },
      {
        id: "wow4",
        afterQuestion: "q20",
        title: "🧠 STRESS CHRONIQUE",
        stat: "x3",
        content: "Plus de risques cardiaques avec un stress élevé constant",
        source: "The Lancet, 2023"
      },
      {
        id: "wow5",
        afterQuestion: "q27",
        title: "💪 MUSCLE = VIE",
        stat: "-40%",
        content: "de mortalité si tu maintiens ta masse musculaire après 40 ans",
        source: "Journal of Gerontology, 2024"
      },
      {
        id: "wow6",
        afterQuestion: "q33",
        title: "🔥 INFLAMMATION SILENCIEUSE",
        stat: "92%",
        content: "des maladies chroniques sont liées à l'inflammation",
        source: "Nature Medicine, 2023"
      }
    ]
  };

  return res.status(200).json(quizData);
}
