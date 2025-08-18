// api/questions.js - Les 38 questions EXACTES de ton quiz index9.html
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const quizData = {
    sections: [
      {
        id: "baseline",
        title: "Profil de base",
        questions: [
          {
            id: "q1",
            screenId: 1,
            text: "Tu es ?",
            type: "single",
            isVisual: true,
            options: [
              { 
                value: "homme", 
                label: "Homme",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
              },
              { 
                value: "femme", 
                label: "Femme",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop"
              }
            ]
          },
          {
            id: "q2",
            screenId: 2,
            text: "Ton âge ?",
            type: "single",
            options: [
              { value: "18-29", label: "18-29 ans" },
              { value: "30-39", label: "30-39 ans" },
              { value: "40-49", label: "40-49 ans" },
              { value: "50-59", label: "50-59 ans" },
              { value: "60+", label: "60 ans et +" }
            ]
          }
        ]
      },
      {
        id: "energy",
        title: "Énergie & Vitalité",
        questions: [
          {
            id: "q3",
            screenId: 3,
            text: "Ton niveau d'énergie au réveil ?",
            type: "single",
            options: [
              { value: "explosif", label: "🌟 Explosif, prêt à tout casser" },
              { value: "bien", label: "👍 Bien après quelques minutes" },
              { value: "moyen", label: "😐 J'ai besoin de 30min+ pour démarrer" },
              { value: "difficile", label: "😴 Difficile, je traîne longtemps" },
              { value: "zombie", label: "💀 Mode zombie jusqu'à midi" }
            ]
          },
          {
            id: "q4",
            screenId: 4,
            text: "Première baisse d'énergie dans la journée ?",
            type: "single",
            options: [
              { value: "jamais", label: "Je ne ressens pas de baisse notable" },
              { value: "10-11h", label: "Vers 10-11h" },
              { value: "14-15h", label: "Vers 14-15h" },
              { value: "16-17h", label: "Après 16-17h" },
              { value: "permanent", label: "Je suis crevé tout le temps" }
            ]
          },
          {
            id: "q5",
            screenId: 5,
            text: "Temps passé assis par jour ?",
            type: "single",
            options: [
              { value: "moins-3h", label: "Moins de 3h" },
              { value: "3-6h", label: "3 à 6h" },
              { value: "6-8h", label: "6 à 8h" },
              { value: "8-10h", label: "8 à 10h" },
              { value: "plus-10h", label: "Plus de 10h" }
            ]
          }
        ]
      },
      {
        id: "sleep",
        title: "Sommeil & Récupération",
        questions: [
          {
            id: "q6",
            screenId: 6,
            text: "Heures de sommeil en moyenne ?",
            type: "single",
            options: [
              { value: "moins-5h", label: "Moins de 5h" },
              { value: "5-6h", label: "5-6h" },
              { value: "6-7h", label: "6-7h" },
              { value: "7-8h", label: "7-8h" },
              { value: "plus-8h", label: "Plus de 8h" }
            ]
          },
          {
            id: "q7",
            screenId: 7,
            text: "Qualité de ton sommeil ?",
            type: "single",
            options: [
              { value: "parfait", label: "Parfait, je dors comme un bébé" },
              { value: "bon", label: "Bon, quelques réveils occasionnels" },
              { value: "moyen", label: "Moyen, réveils fréquents" },
              { value: "mauvais", label: "Mauvais, je me réveille fatigué" },
              { value: "insomnie", label: "Insomnie chronique" }
            ]
          }
        ]
      },
      {
        id: "activity",
        title: "Activité Physique",
        questions: [
          {
            id: "q8",
            screenId: 8,
            text: "Fréquence de sport par semaine ?",
            type: "single",
            options: [
              { value: "jamais", label: "Jamais" },
              { value: "1-2x", label: "1-2 fois" },
              { value: "3-4x", label: "3-4 fois" },
              { value: "5-6x", label: "5-6 fois" },
              { value: "tous-jours", label: "Tous les jours" }
            ]
          },
          {
            id: "q9",
            screenId: 9,
            text: "Nombre de pas par jour ?",
            type: "single",
            options: [
              { value: "moins-3000", label: "Moins de 3000" },
              { value: "3000-5000", label: "3000-5000" },
              { value: "5000-7500", label: "5000-7500" },
              { value: "7500-10000", label: "7500-10000" },
              { value: "plus-10000", label: "Plus de 10000" }
            ]
          },
          {
            id: "q10",
            screenId: 10,
            text: "Essoufflement en montant 2 étages ?",
            type: "single",
            options: [
              { value: "jamais", label: "Jamais, c'est facile" },
              { value: "leger", label: "Légèrement" },
              { value: "moyen", label: "Moyennement" },
              { value: "beaucoup", label: "Beaucoup" },
              { value: "extreme", label: "J'évite les escaliers" }
            ]
          }
        ]
      },
      {
        id: "nutrition",
        title: "Nutrition & Hydratation",
        questions: [
          {
            id: "q11",
            screenId: 11,
            text: "Verres d'eau par jour ?",
            type: "single",
            options: [
              { value: "moins-3", label: "Moins de 3 verres" },
              { value: "3-5", label: "3-5 verres" },
              { value: "6-8", label: "6-8 verres" },
              { value: "9-10", label: "9-10 verres" },
              { value: "plus-10", label: "Plus de 10 verres" }
            ]
          },
          {
            id: "q12",
            screenId: 12,
            text: "Portions de fruits/légumes par jour ?",
            type: "single",
            options: [
              { value: "0", label: "0 (j'aime pas ça)" },
              { value: "1-2", label: "1-2 portions" },
              { value: "3-4", label: "3-4 portions" },
              { value: "5-6", label: "5-6 portions" },
              { value: "plus-7", label: "7+ portions" }
            ]
          },
          {
            id: "q13",
            screenId: 13,
            text: "Fast-food/plats transformés par semaine ?",
            type: "single",
            options: [
              { value: "jamais", label: "Jamais" },
              { value: "1-2x", label: "1-2 fois" },
              { value: "3-4x", label: "3-4 fois" },
              { value: "5-6x", label: "5-6 fois" },
              { value: "tous-jours", label: "Tous les jours" }
            ]
          },
          {
            id: "q14",
            screenId: 14,
            text: "Consommation d'alcool ?",
            type: "single",
            options: [
              { value: "jamais", label: "0 (jamais)" },
              { value: "occasionnel", label: "1-2 verres/semaine" },
              { value: "modere", label: "3-5 verres/semaine" },
              { value: "regulier", label: "1-2 verres/jour" },
              { value: "excessif", label: "3+ verres/jour" }
            ]
          }
        ]
      },
      {
        id: "mental",
        title: "Santé Mentale & Stress",
        questions: [
          {
            id: "q15",
            screenId: 15,
            text: "Fréquence de rire par jour ?",
            type: "single",
            options: [
              { value: "beaucoup", label: "Je ris beaucoup (10+ fois)" },
              { value: "souvent", label: "Souvent (5-10 fois)" },
              { value: "parfois", label: "Parfois (2-4 fois)" },
              { value: "rarement", label: "Rarement (0-1 fois)" },
              { value: "jamais", label: "Je ne ris presque jamais" }
            ]
          },
          {
            id: "q16",
            screenId: 16,
            text: "Temps de récupération après un stress ?",
            type: "single",
            options: [
              { value: "immediat", label: "Immédiat (zen attitude)" },
              { value: "minutes", label: "Quelques minutes" },
              { value: "heures", label: "Quelques heures" },
              { value: "jours", label: "Plusieurs jours" },
              { value: "permanent", label: "Je suis toujours stressé" }
            ]
          },
          {
            id: "q17",
            screenId: 17,
            text: "Mémoire et concentration ?",
            type: "single",
            options: [
              { value: "excellent", label: "Excellentes" },
              { value: "bonnes", label: "Bonnes" },
              { value: "moyennes", label: "Moyennes" },
              { value: "difficiles", label: "Difficiles" },
              { value: "problematiques", label: "Très problématiques" }
            ]
          },
          {
            id: "q18",
            screenId: 18,
            text: "Libido/désir ?",
            type: "single",
            options: [
              { value: "eleve", label: "Élevé" },
              { value: "normal", label: "Normal" },
              { value: "variable", label: "Variable" },
              { value: "faible", label: "Faible" },
              { value: "absent", label: "Absent" }
            ]
          },
          {
            id: "q19",
            screenId: 19,
            text: "Niveau de stress quotidien ?",
            type: "single",
            options: [
              { value: "nul", label: "Nul, je suis zen" },
              { value: "faible", label: "Faible occasionnellement" },
              { value: "moyen", label: "Moyen régulièrement" },
              { value: "eleve", label: "Élevé régulièrement" },
              { value: "extreme", label: "Mode survie/burnout" }
            ]
          }
        ]
      },
      {
        id: "physical",
        title: "Signes Physiques",
        questions: [
          {
            id: "q20",
            screenId: 20,
            text: "Qualité de ta peau ?",
            type: "single",
            options: [
              { value: "eclatante", label: "Éclatante et ferme" },
              { value: "correcte", label: "Correcte pour mon âge" },
              { value: "terne", label: "Terne et fatiguée" },
              { value: "ridee", label: "Rides marquées" },
              { value: "vieillie", label: "Très vieillie prématurément" }
            ]
          },
          {
            id: "q21",
            screenId: 21,
            text: "Ton environnement principal ?",
            type: "single",
            options: [
              { value: "nature", label: "Nature/campagne (air pur)" },
              { value: "petite-ville", label: "Petite ville (<50k habitants)" },
              { value: "moyenne-ville", label: "Ville moyenne (50-200k)" },
              { value: "grande-ville", label: "Grande ville (200k-1M)" },
              { value: "megapole", label: "Mégapole (Paris, Lyon, Marseille)" }
            ]
          },
          {
            id: "q22",
            screenId: 22,
            text: "Douleurs articulaires/musculaires ?",
            type: "single",
            options: [
              { value: "jamais", label: "Jamais" },
              { value: "rarement", label: "Rarement" },
              { value: "parfois", label: "Parfois" },
              { value: "souvent", label: "Souvent" },
              { value: "chroniques", label: "Chroniques" }
            ]
          },
          {
            id: "q23",
            screenId: 23,
            text: "Digestion après les repas ?",
            type: "single",
            options: [
              { value: "parfaite", label: "Parfaite" },
              { value: "bonne", label: "Bonne" },
              { value: "moyenne", label: "Moyenne (ballonnements occasionnels)" },
              { value: "difficile", label: "Difficile (problèmes fréquents)" },
              { value: "catastrophique", label: "Catastrophique" }
            ]
          },
          {
            id: "q24",
            screenId: 24,
            text: "Force de poignée (serre fort un objet) ?",
            type: "single",
            options: [
              { value: "tres-forte", label: "Très forte" },
              { value: "forte", label: "Forte" },
              { value: "normale", label: "Normale" },
              { value: "faible", label: "Faible" },
              { value: "tres-faible", label: "Très faible" }
            ]
          }
        ]
      },
      {
        id: "habits",
        title: "Habitudes de Vie",
        questions: [
          {
            id: "q25",
            screenId: 25,
            text: "Tabac/cigarette ?",
            type: "single",
            options: [
              { value: "jamais", label: "Jamais fumé" },
              { value: "arrete", label: "Ancien fumeur (arrêté)" },
              { value: "occasionnel", label: "Occasionnel" },
              { value: "quotidien", label: "Quotidien (<10/jour)" },
              { value: "gros-fumeur", label: "Gros fumeur (10+/jour)" }
            ]
          },
          {
            id: "q26",
            screenId: 26,
            text: "Exposition au soleil ?",
            type: "single",
            options: [
              { value: "quotidien", label: "Quotidienne (30min+)" },
              { value: "regulier", label: "Régulière (3-4x/semaine)" },
              { value: "occasionnel", label: "Occasionnelle" },
              { value: "rare", label: "Rare" },
              { value: "jamais", label: "Jamais (vampire mode)" }
            ]
          },
          {
            id: "q27",
            screenId: 27,
            text: "Temps sur les écrans par jour ?",
            type: "single",
            options: [
              { value: "moins-2h", label: "Moins de 2h" },
              { value: "2-4h", label: "2-4h" },
              { value: "4-6h", label: "4-6h" },
              { value: "6-8h", label: "6-8h" },
              { value: "plus-8h", label: "Plus de 8h" }
            ]
          },
          {
            id: "q28",
            screenId: 28,
            text: "Méditation/relaxation ?",
            type: "single",
            options: [
              { value: "quotidien", label: "Quotidienne" },
              { value: "regulier", label: "Régulière (3-4x/semaine)" },
              { value: "occasionnel", label: "Occasionnelle" },
              { value: "rare", label: "Rarement" },
              { value: "jamais", label: "Jamais" }
            ]
          },
          {
            id: "q29",
            screenId: 29,
            text: "Contrôles médicaux/bilans santé ?",
            type: "single",
            options: [
              { value: "annuel", label: "Annuel complet" },
              { value: "bi-annuel", label: "Tous les 2 ans" },
              { value: "occasionnel", label: "Occasionnel" },
              { value: "urgence", label: "Seulement si urgence" },
              { value: "jamais", label: "Jamais" }
            ]
          }
        ]
      },
      {
        id: "social",
        title: "Vie Sociale & Relations",
        questions: [
          {
            id: "q30",
            screenId: 30,
            text: "Relations sociales enrichissantes ?",
            type: "single",
            options: [
              { value: "beaucoup", label: "Beaucoup (réseau solide)" },
              { value: "plusieurs", label: "Plusieurs amis proches" },
              { value: "quelques", label: "Quelques relations" },
              { value: "peu", label: "Peu de contacts" },
              { value: "isole", label: "Isolé socialement" }
            ]
          },
          {
            id: "q31",
            screenId: 31,
            text: "Fréquence des moments de joie/plaisir ?",
            type: "single",
            options: [
              { value: "quotidien", label: "Plusieurs fois par jour" },
              { value: "regulier", label: "Quotidiennement" },
              { value: "hebdo", label: "Quelques fois/semaine" },
              { value: "rare", label: "Rarement" },
              { value: "jamais", label: "Presque jamais" }
            ]
          },
          {
            id: "q32",
            screenId: 32,
            text: "Sentiment de solitude ?",
            type: "single",
            options: [
              { value: "jamais", label: "Jamais" },
              { value: "rarement", label: "Rarement" },
              { value: "parfois", label: "Parfois" },
              { value: "souvent", label: "Souvent" },
              { value: "toujours", label: "Toujours" }
            ]
          },
          {
            id: "q33",
            screenId: 33,
            text: "Activités/hobbies passionnants ?",
            type: "single",
            options: [
              { value: "beaucoup", label: "Plusieurs passions actives" },
              { value: "quelques", label: "Quelques hobbies réguliers" },
              { value: "un-peu", label: "Un peu" },
              { value: "peu", label: "Peu d'intérêts" },
              { value: "aucun", label: "Aucune passion" }
            ]
          }
        ]
      },
      {
        id: "motivation",
        title: "Motivation & Projets",
        questions: [
          {
            id: "q34",
            screenId: 34,
            text: "Enthousiasme pour l'avenir ?",
            type: "single",
            options: [
              { value: "maximum", label: "Maximum (projets excitants)" },
              { value: "eleve", label: "Élevé" },
              { value: "moyen", label: "Moyen" },
              { value: "faible", label: "Faible" },
              { value: "nul", label: "Aucun (résigné)" }
            ]
          },
          {
            id: "q35",
            screenId: 35,
            text: "Sensation de vieillir ?",
            type: "single",
            options: [
              { value: "rajeunir", label: "Je rajeunis !" },
              { value: "stable", label: "Stable depuis des années" },
              { value: "normal", label: "Vieillissement normal" },
              { value: "accelere", label: "Plus vite que prévu" },
              { value: "tres-vite", label: "Beaucoup trop vite" }
            ]
          },
          {
            id: "q36",
            screenId: 36,
            text: "Comparé aux gens de ton âge ?",
            type: "single",
            options: [
              { value: "bien-mieux", label: "Bien meilleure forme" },
              { value: "mieux", label: "Meilleure forme" },
              { value: "pareil", label: "Similaire" },
              { value: "moins-bien", label: "Moins bonne forme" },
              { value: "catastrophe", label: "Catastrophique" }
            ]
          },
          {
            id: "q37",
            screenId: 37,
            text: "Satisfaction vie actuelle (sur 10) ?",
            type: "single",
            options: [
              { value: "9-10", label: "9-10 (vie de rêve)" },
              { value: "7-8", label: "7-8 (très satisfait)" },
              { value: "5-6", label: "5-6 (moyen)" },
              { value: "3-4", label: "3-4 (insatisfait)" },
              { value: "0-2", label: "0-2 (très malheureux)" }
            ]
          },
          {
            id: "q38",
            screenId: 38,
            text: "Prêt à changer pour vivre mieux/plus longtemps ?",
            type: "single",
            options: [
              { value: "100%", label: "100% déterminé" },
              { value: "motive", label: "Très motivé" },
              { value: "ouvert", label: "Ouvert aux changements" },
              { value: "sceptique", label: "Sceptique mais curieux" },
              { value: "non", label: "Pas vraiment" }
            ]
          }
        ]
      }
    ],
    
    wowBreaks: [
      {
        id: "wow1",
        afterQuestion: 5,
        title: "😴 Le Saviez-Vous ?",
        content: "Les personnes qui dorment moins de 6h ont 4.5x plus de risques de tomber malade après exposition à un virus.",
        stat: "4.5x",
        source: "Study: Sleep, 2015, UCSF"
      },
      {
        id: "wow2",
        afterQuestion: 10,
        title: "💪 Force = Longévité",
        content: "La force de préhension est le meilleur prédicteur de mortalité toutes causes confondues.",
        stat: "-16%",
        statDetail: "de risque de mortalité par 5kg de force en plus",
        source: "BMJ, 2018 - 140,000 participants"
      },
      {
        id: "wow3",
        afterQuestion: 15,
        title: "🧠 Le Cerveau Rétrécit",
        content: "Après 30 ans, ton cerveau perd 0.5% de son volume chaque année. Le sport peut inverser ce processus.",
        stat: "+2%",
        statDetail: "de volume hippocampique avec exercice régulier",
        source: "PNAS, 2011"
      },
      {
        id: "wow4",
        afterQuestion: 20,
        title: "⏰ L'Effet Assis",
        content: "Chaque heure assise après 8h/jour augmente ton risque de mortalité de 2%, même si tu fais du sport.",
        stat: "+60%",
        statDetail: "de risque si >10h assis/jour",
        source: "Annals of Internal Medicine, 2017"
      },
      {
        id: "wow5",
        afterQuestion: 25,
        title: "🍷 L'Alcool Vieillit",
        content: "L'alcool accélère le raccourcissement des télomères. Même modéré, il vieillit tes cellules.",
        stat: "4.6 ans",
        statDetail: "de vieillissement cellulaire pour 2 verres/jour",
        source: "Molecular Psychiatry, 2022"
      },
      {
        id: "wow6",
        afterQuestion: 30,
        title: "😊 Le Pouvoir Social",
        content: "La solitude augmente le risque de mortalité autant que fumer 15 cigarettes par jour.",
        stat: "+50%",
        statDetail: "de risque de mortalité prématurée",
        source: "Perspectives on Psychological Science, 2015"
      }
    ]
  };

  return res.status(200).json(quizData);
}
