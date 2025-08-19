// api/questions.js - Questions complètes du quiz

export default function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Retourner les questions et WOW breaks
  const data = {
    questions: [
      {
        id: 1,
        key: 'gender',
        text: 'Tu es ?',
        type: 'single',
        options: ['Homme', 'Femme']
      },
      {
        id: 2,
        key: 'age',
        text: 'Quel est ton âge exact ?',
        type: 'input',
        inputType: 'number',
        placeholder: 'Ex: 42'
      },
      {
        id: 3,
        key: 'weight_height',
        text: 'Ton poids et ta taille ?',
        subtitle: 'Pour calculer ton IMC et personnaliser tes recommandations',
        type: 'double-input',
        label1: 'Poids (kg)',
        placeholder1: '75',
        label2: 'Taille (cm)',
        placeholder2: '175'
      },
      {
        id: 4,
        key: 'hormones',
        text: 'Où en es-tu dans ton cycle de vie hormonal ?',
        type: 'single',
        options: [
          'Cycle menstruel régulier',
          'Périménopause',
          'Ménopause',
          'Post-ménopause',
          'Grossesse',
          'Post-partum',
          'Sous contraception hormonale',
          'Homme - Testostérone normale',
          'Homme - Baisse de testostérone'
        ]
      },
      {
        id: 5,
        key: 'sleep_quality',
        text: 'Comment est ton sommeil ?',
        type: 'single',
        options: [
          'Excellent (7-9h, profond)',
          'Bon (6-7h, quelques réveils)',
          'Moyen (5-6h, réveils fréquents)',
          'Mauvais (4-5h, insomnie)',
          'Très mauvais (<4h)'
        ]
      },
      {
        id: 6,
        key: 'morning_energy',
        text: 'Quand tu te réveilles, tu te sens comment ?',
        type: 'single',
        options: [
          'Pleine forme',
          'Bien',
          'Correct',
          'Fatigué(e)',
          'Épuisé(e)'
        ]
      },
      {
        id: 7,
        key: 'energy_dip',
        text: 'Vers quelle heure ressens-tu ta première baisse d\'énergie ?',
        type: 'single',
        options: [
          'Jamais',
          '10h-11h',
          'Midi-14h',
          '14h-16h',
          '16h-18h',
          'Dès le réveil'
        ]
      },
      {
        id: 8,
        key: 'energy_3years',
        text: 'Comparé à il y a 3 ans, ton énergie c\'est :',
        type: 'single',
        options: [
          'Meilleure',
          'Stable',
          'Légèrement diminuée',
          'Diminuée',
          'Très diminuée'
        ]
      },
      {
        id: 9,
        key: 'exercise_frequency',
        text: 'Ta fréquence d\'activité physique ?',
        type: 'single',
        options: [
          '5-7 fois/semaine',
          '3-4 fois/semaine',
          '1-2 fois/semaine',
          'Occasionnel',
          'Jamais'
        ]
      },
      {
        id: 10,
        key: 'exercise_types',
        text: 'Quel type d\'activité pratiques-tu ?',
        subtitle: 'Plusieurs choix possibles',
        type: 'multi',
        options: [
          'Musculation/Force',
          'HIIT/CrossFit',
          'Course/Running',
          'Vélo',
          'Natation',
          'Yoga/Pilates',
          'Sports collectifs',
          'Arts martiaux',
          'Marche',
          'Danse',
          'Aucune activité'
        ]
      },
      {
        id: 11,
        key: 'steps_daily',
        text: 'Nombre de pas moyens par jour ?',
        type: 'single',
        options: [
          'Plus de 10 000',
          '7 000 - 10 000',
          '5 000 - 7 000',
          '3 000 - 5 000',
          'Moins de 3 000',
          'Je ne compte pas'
        ]
      },
      {
        id: 12,
        key: 'nutrition_quality',
        text: 'Comment qualifierais-tu ton alimentation ?',
        type: 'single',
        options: [
          'Optimale (bio, variée, équilibrée)',
          'Bonne (fait maison, équilibrée)',
          'Moyenne (mixte maison/industriel)',
          'Médiocre (majoritairement industriel)',
          'Mauvaise (fast-food, ultra-transformé)'
        ]
      },
      {
        id: 13,
        key: 'breakfast',
        text: 'Petit-déjeuner type ?',
        type: 'single',
        options: [
          'Protéiné (œufs, grec yogurt)',
          'Continental (pain, confiture)',
          'Smoothie/Jus',
          'Café uniquement',
          'Je ne mange pas le matin'
        ]
      },
      {
        id: 14,
        key: 'fasting_practice',
        text: 'Pratiques-tu le jeûne intermittent ?',
        type: 'single',
        options: [
          '16:8 quotidien',
          '14:10 quotidien',
          'Quelques fois/semaine',
          'Occasionnel',
          'Jamais'
        ]
      },
      {
        id: 15,
        key: 'hydration',
        text: 'Nombre de verres d\'eau par jour (hors café/thé) ?',
        type: 'single',
        options: [
          'Plus de 3L/jour',
          '2-3L/jour',
          '1.5-2L/jour',
          '1-1.5L/jour',
          'Moins de 1L/jour'
        ]
      },
      {
        id: 16,
        key: 'alcohol_consumption',
        text: 'Ta consommation d\'alcool ?',
        type: 'single',
        options: [
          'Jamais',
          '1-2 verres/semaine',
          '3-5 verres/semaine',
          '1-2 verres/jour',
          'Plus de 2 verres/jour'
        ]
      },
      {
        id: 17,
        key: 'supplements',
        text: 'Prends-tu des compléments alimentaires ?',
        type: 'single',
        options: [
          'Protocole complet personnalisé',
          'Basiques (Vit D, Omega 3, Magnésium)',
          'Occasionnels',
          'Jamais',
          'Je ne sais pas quoi prendre'
        ]
      },
      {
        id: 18,
        key: 'stress_level',
        text: 'Ton niveau de stress moyen ?',
        type: 'single',
        options: [
          'Très faible (zen)',
          'Faible (gérable)',
          'Modéré (pics occasionnels)',
          'Élevé (quotidien)',
          'Très élevé (burnout)'
        ]
      },
      {
        id: 19,
        key: 'meditation',
        text: 'As-tu un rituel anti-stress régulier ?',
        type: 'single',
        options: [
          'Quotidienne (>20min)',
          'Régulière (3-5x/semaine)',
          'Occasionnelle',
          'Rare',
          'Jamais'
        ]
      },
      {
        id: 20,
        key: 'breathwork',
        text: 'Pratiques-tu des exercices de respiration ?',
        type: 'single',
        options: [
          'Quotidienne (Wim Hof, cohérence)',
          'Régulière',
          'Occasionnelle',
          'Rare',
          'Jamais'
        ]
      },
      {
        id: 21,
        key: 'cold_exposure',
        text: 'Exposition au froid ?',
        type: 'single',
        options: [
          'Quotidienne (douche froide + bain)',
          'Régulière (3-5x/semaine)',
          'Occasionnelle',
          'Rare',
          'Jamais'
        ]
      },
      {
        id: 22,
        key: 'recovery_practices',
        text: 'Pratiques-tu une activité pour la récupération ?',
        type: 'single',
        options: [
          'Quotidienne (sauna, bain froid, étirements)',
          'Régulière (3-5x/semaine)',
          'Occasionnelle',
          'Rare',
          'Jamais'
        ]
      },
      {
        id: 23,
        key: 'nature_exposure',
        text: 'Temps passé dans la nature ?',
        type: 'single',
        options: [
          'Quotidienne (>2h)',
          'Régulière (weekend)',
          'Occasionnelle',
          'Rare',
          'Jamais (100% urbain)'
        ]
      },
      {
        id: 24,
        key: 'social_connections',
        text: 'Tes relations sociales ?',
        type: 'single',
        options: [
          'Très riches (famille + amis + communauté)',
          'Bonnes (cercle proche solide)',
          'Moyennes (quelques proches)',
          'Faibles (isolement partiel)',
          'Très faibles (isolement)'
        ]
      },
      {
        id: 25,
        key: 'bedtime',
        text: 'Heure habituelle du coucher ?',
        type: 'single',
        options: [
          'Avant 22h',
          '22h-23h',
          '23h-minuit',
          'Minuit-1h',
          'Après 1h du matin'
        ]
      },
      {
        id: 26,
        key: 'screen_evening',
        text: 'Écrans le soir ?',
        type: 'single',
        options: [
          'Jamais (coupure 2h avant)',
          'Avec lunettes anti-lumière bleue',
          'Parfois',
          'Toujours',
          'Jusqu\'au lit'
        ]
      },
      {
        id: 27,
        key: 'environment',
        text: 'Où vis-tu ?',
        type: 'single',
        options: [
          'Nature/campagne (air pur)',
          'Petite ville (<50k habitants)',
          'Ville moyenne (50-200k)',
          'Grande ville (200k-1M)',
          'Mégapole (Paris, Lyon, Marseille)'
        ]
      },
      {
        id: 28,
        key: 'vacations',
        text: 'Dernières vraies vacances ?',
        type: 'single',
        options: [
          'Il y a moins de 3 mois',
          '3-6 mois',
          '6-12 mois',
          'Plus d\'un an',
          'Je ne déconnecte jamais'
        ]
      },
      {
        id: 29,
        key: 'tracking',
        text: 'Utilises-tu des outils de tracking ?',
        subtitle: 'Plusieurs choix possibles',
        type: 'multi',
        options: [
          'Oura Ring',
          'Whoop',
          'Apple Watch',
          'Garmin',
          'Fitbit',
          'Polar',
          'Eight Sleep',
          'CGM (glucose)',
          'Balance connectée',
          'Tensiomètre',
          'Aucun'
        ]
      },
      {
        id: 30,
        key: 'objectives',
        text: 'Tes 3 objectifs prioritaires ?',
        subtitle: 'Maximum 3 choix',
        type: 'multi',
        options: [
          'Perdre du gras',
          'Prendre du muscle',
          'Plus d\'énergie',
          'Mieux dormir',
          'Réduire le stress',
          'Améliorer ma concentration',
          'Booster ma libido',
          'Ralentir le vieillissement',
          'Performance sportive',
          'Équilibre hormonal'
        ]
      },
      {
        id: 31,
        key: 'blockers',
        text: 'Ce qui t\'a empêché de changer jusqu\'ici :',
        subtitle: 'Plusieurs choix possibles',
        type: 'multi',
        options: [
          'Manque de temps',
          'Manque de motivation',
          'Trop d\'infos contradictoires',
          'Pas de protocole clair',
          'Manque de soutien',
          'Budget',
          'Famille/obligations',
          'Je ne sais pas par où commencer'
        ]
      },
      {
        id: 32,
        key: 'investment_health',
        text: 'Combien investis-tu par an dans ta santé ?',
        type: 'single',
        options: [
          'Plus de 5000€',
          '3000-5000€',
          '1500-3000€',
          '500-1500€',
          'Moins de 500€'
        ]
      },
      {
        id: 33,
        key: 'projection_5years',
        text: 'Si tu continues à ce rythme, dans 5 ans tu seras :',
        type: 'single',
        options: [
          'En meilleure forme (j\'optimise déjà)',
          'Stable (stagnation)',
          'Diminué(e) de 20%',
          'Très diminué(e) de 40%',
          'J\'ai peur d\'y penser'
        ]
      },
      {
        id: 34,
        key: 'biggest_fear',
        text: 'Ta plus grande peur santé ?',
        type: 'single',
        options: [
          'Maladie grave (cancer, AVC)',
          'Perte d\'autonomie',
          'Déclin cognitif (Alzheimer)',
          'Douleurs chroniques',
          'Mort prématurée',
          'Ne pas voir mes enfants grandir'
        ]
      },
      {
        id: 35,
        key: 'motivation',
        text: 'Qu\'est-ce qui te motive à changer MAINTENANT ?',
        type: 'single',
        options: [
          'J\'ai eu un déclic récent',
          'Ma santé se dégrade',
          'Je veux être un exemple',
          'Peur de vieillir mal',
          'Envie de performer plus',
          'Pour ma famille'
        ]
      },
      {
        id: 36,
        key: 'commitment',
        text: 'Temps réaliste que tu peux consacrer par jour ?',
        type: 'single',
        options: [
          'Plus de 2h',
          '1-2h',
          '30min-1h',
          '15-30min',
          'Moins de 15min'
        ]
      },
      {
        id: 37,
        key: 'ready_to_invest',
        text: 'Si tu obtenais un vrai "upgrade" avec résultats concrets, tu serais prêt à investir :',
        type: 'single',
        options: [
          'Plus de 5000€/an',
          '3000-5000€/an',
          '1500-3000€/an',
          '500-1500€/an',
          'Moins de 500€/an'
        ]
      },
      {
        id: 38,
        key: 'accountability',
        text: 'Avec qui partages-tu tes routines santé ?',
        type: 'single',
        options: [
          'Coach personnel',
          'Communauté/groupe',
          'Partenaire/famille',
          'Amis proches',
          'Personne (solo)'
        ]
      },
      {
        id: 39,
        key: 'superpower',
        text: 'Si tu pouvais avoir UN super-pouvoir entrepreneurial, ce serait ?',
        type: 'single',
        options: [
          'Énergie illimitée',
          'Focus laser 12h/jour',
          'Dormir 4h et être en forme',
          'Zéro stress',
          'Mémoire photographique',
          'Charisme magnétique'
        ]
      },
      {
        id: 40,
        key: 'non_negotiable',
        text: 'Qu\'est-ce que tu refuses de sacrifier pour performer ?',
        type: 'single',
        options: [
          'Temps en famille',
          'Ma santé',
          'Mes loisirs/passions',
          'Mon sommeil',
          'Ma vie sociale',
          'Rien, je sacrifie tout'
        ]
      }
    ],
    wowBreaks: [
      {
        id: 'wow1',
        position: 5,
        icon: '💤',
        title: 'LE SOMMEIL EST TA SUPERPOWER',
        mainStat: '7-9h = Zone optimale',
        subStats: [
          '< 6h = +30% risque mortalité',
          '< 5h = x2 risque Alzheimer',
          'Chaque heure perdue = -2 ans'
        ],
        source: 'Walker et al., Nature 2017'
      },
      {
        id: 'wow2',
        position: 11,
        icon: '🪑',
        title: 'TA CHAISE TE TUE',
        mainStat: '10h assis = +52% mortalité',
        source: 'PLOS ONE (2013) • PMID: 23826128'
      },
      {
        id: 'wow3',
        position: 17,
        icon: '🥗',
        title: 'TON ASSIETTE = TON MÉDECIN',
        mainStat: 'Nutrition optimale = +13 ans',
        subStats: [
          'Jeûne 16:8 = +15% longévité',
          'Protéines 1.6g/kg = maintien masse',
          'Ultra-transformés = -62% espérance'
        ],
        source: 'Longo, Cell 2019'
      },
      {
        id: 'wow4',
        position: 23,
        icon: '🧘',
        title: 'LE STRESS TUE PLUS QUE LE TABAC',
        mainStat: 'Stress chronique = +50% mortalité',
        subStats: [
          'Méditation = -48% risque cardiaque',
          'Cohérence cardiaque = +25% HRV',
          'Nature 2h/sem = -30% cortisol'
        ],
        source: 'Cohen et al., JAMA 2012'
      },
      {
        id: 'wow5',
        position: 29,
        icon: '🏃',
        title: 'MUSCLE = LONGÉVITÉ',
        mainStat: 'Force musculaire = -23% mortalité',
        subStats: [
          '150min/sem = minimum vital',
          'HIIT 2x/sem = +5 ans',
          'Force 2x/sem = -46% chutes'
        ],
        source: 'BMJ 2019, Arem 2015'
      },
      {
        id: 'wow6',
        position: 35,
        icon: '🧬',
        title: 'TU CONTRÔLES TON DESTIN',
        mainStat: '7% génétique, 93% tes choix',
        subStats: [
          'Épigénétique modifiable à 70%',
          'Télomères réversibles en 3 mois',
          'Âge biologique ≠ chronologique'
        ],
        source: 'Ruby et al., Genetics 2018'
      }
    ]
  };

  return res.status(200).json(data);
}
