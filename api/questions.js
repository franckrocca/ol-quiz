export default function handler(req, res) {
  const questions = [
    {
      id: 1,
      key: 'gender',
      text: 'Tu es ?',
      type: 'visual',
      options: [
        { 
          value: 'homme', 
          label: 'Homme',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
        },
        { 
          value: 'femme', 
          label: 'Femme',
          image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop'
        }
      ]
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
      key: 'body',
      text: 'Tes mensurations actuelles',
      type: 'double-input',
      inputs: [
        { key: 'weight', placeholder: 'Poids (kg)', type: 'number' },
        { key: 'height', placeholder: 'Taille (cm)', type: 'number' }
      ],
      showIMC: true
    },
    {
      id: 4,
      key: 'goals',
      text: 'Tes objectifs prioritaires ?',
      subtitle: 'Choisis jusqu\'à 3 options',
      type: 'multi-select',
      maxChoices: 3,
      options: [
        'Énergie illimitée',
        'Corps optimal',
        'Mental sharp',
        'Longévité maximale',
        'Sommeil réparateur',
        'Zéro stress'
      ]
    },
    {
      id: 5,
      key: 'energy3y',
      text: 'Comparé à il y a 3 ans, ton énergie c\'est :',
      type: 'single',
      options: [
        'Mieux qu\'avant',
        'Identique',
        '-20% environ',
        '-40% environ',
        '-60% ou plus'
      ]
    },
    {
      id: 6,
      key: 'last100',
      text: 'La dernière fois que tu t\'es senti(e) à 100% :',
      type: 'single',
      options: [
        'Cette semaine',
        'Ce mois-ci',
        'Cette année',
        'L\'année dernière',
        'Je ne sais plus'
      ]
    },
    {
      id: 7,
      key: 'barriers',
      text: 'Ce qui t\'a empêché de changer jusqu\'ici :',
      type: 'single',
      options: [
        'Trop d\'infos contradictoires',
        'Manque de temps',
        'J\'ai essayé sans résultats',
        'Trop cher',
        'Je ne savais pas comment'
      ]
    },
    {
      id: 8,
      key: 'stairs',
      text: 'Test de l\'escalier (2 étages sans pause) :',
      type: 'single',
      options: [
        'Facile, en parlant',
        'Léger essoufflement',
        'Besoin de reprendre mon souffle',
        'Très difficile',
        'J\'évite les escaliers'
      ]
    },
    {
      id: 9,
      key: 'sitting',
      text: 'Heures assis par jour :',
      type: 'single',
      options: [
        'Moins de 4h',
        '4-6h',
        '6-8h',
        '8-10h',
        'Plus de 10h'
      ]
    },
    {
      id: 10,
      key: 'nightAwakenings',
      text: 'Réveils nocturnes par nuit :',
      type: 'single',
      options: [
        '0 (sommeil parfait)',
        '1 fois',
        '2-3 fois',
        '4+ fois',
        'Insomnie chronique'
      ]
    },
    {
      id: 11,
      key: 'femaleSpecific',
      text: 'Où en es-tu dans ton cycle féminin ?',
      type: 'single',
      conditional: { gender: 'femme' },
      options: [
        'Cycle régulier parfait',
        'Cycle irrégulier',
        'Grossesse',
        'Post-partum',
        'Péri-ménopause',
        'Ménopause',
        'Post-ménopause'
      ]
    },
    {
      id: 11,
      key: 'libido',
      text: 'Ta libido actuellement :',
      type: 'single',
      conditional: { gender: 'homme' },
      options: [
        'Au top comme à 20 ans',
        'Correcte',
        'En baisse notable',
        'Très diminuée',
        'Problématique'
      ]
    },
    {
      id: 12,
      key: 'crash',
      text: 'Ton premier crash énergétique arrive :',
      type: 'single',
      options: [
        'Jamais',
        'Après 17h',
        'Vers 14h-15h',
        'Juste après le déjeuner',
        'Dès le matin'
      ]
    },
    {
      id: 13,
      key: 'weightVsIdeal',
      text: 'Ton poids vs ton idéal :',
      type: 'single',
      options: [
        'Parfait',
        '+2-5 kg',
        '+5-10 kg',
        '+10-15 kg',
        '+15 kg ou plus'
      ]
    },
    {
      id: 14,
      key: 'digestion',
      text: 'Ta digestion au quotidien :',
      type: 'single',
      options: [
        'Parfaite comme une horloge',
        'Quelques inconforts occasionnels',
        'Ballonnements fréquents',
        'Problèmes quotidiens',
        'Chaos intestinal permanent'
      ]
    },
    {
      id: 15,
      key: 'jointPain',
      text: 'Douleurs articulaires :',
      type: 'single',
      options: [
        'Jamais',
        'Après effort intense uniquement',
        'Le matin au réveil',
        'Régulièrement dans la journée',
        'Douleurs chroniques permanentes'
      ]
    },
    {
      id: 16,
      key: 'cognition',
      text: 'Ta mémoire et concentration :',
      type: 'single',
      options: [
        'Excellentes',
        'Quelques oublis mineurs',
        'Difficultés fréquentes',
        'Brouillard mental régulier',
        'Très inquiétant'
      ]
    },
    {
      id: 17,
      key: 'recovery',
      text: 'Récupération après effort physique :',
      type: 'single',
      options: [
        'Moins de 24h',
        '24-48h',
        '2-3 jours',
        '4-7 jours',
        'Plus d\'une semaine'
      ]
    },
    {
      id: 18,
      key: 'stress',
      text: 'Niveau de stress chronique :',
      type: 'single',
      options: [
        'Zen permanent',
        'Gérable la plupart du temps',
        'Élevé régulièrement',
        'Très élevé quotidiennement',
        'Mode survie/burnout'
      ]
    },
    {
      id: 19,
      key: 'skin',
      text: 'Qualité de ta peau :',
      type: 'single',
      options: [
        'Éclatante et ferme',
        'Correcte pour mon âge',
        'Terne et fatiguée',
        'Rides marquées',
        'Très vieillie prématurément'
      ]
    },
    {
      id: 20,
      key: 'environment',
      text: 'Ton environnement principal :',
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
      id: 21,
      key: 'sun',
      text: 'Exposition soleil (peau nue) :',
      type: 'single',
      options: [
        '30min+ quotidien',
        '15-30min régulier',
        'Quelques fois/semaine',
        'Rarement',
        'Jamais (vampire mode)'
      ]
    },
    {
      id: 22,
      key: 'nature',
      text: 'Temps en nature par semaine :',
      type: 'single',
      options: [
        'Plus de 10h',
        '5-10h',
        '2-5h',
        'Moins de 2h',
        'Zéro'
      ]
    },
    {
      id: 23,
      key: 'sleepQuality',
      text: 'Qualité de ton sommeil :',
      type: 'single',
      options: [
        '7-9h de sommeil profond',
        '6-7h correct',
        '5-6h léger et fragmenté',
        'Moins de 5h',
        'Insomnie chronique'
      ]
    },
    {
      id: 24,
      key: 'bedtime',
      text: 'Heure habituelle du coucher :',
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
      id: 25,
      key: 'screens',
      text: 'Écrans avant de dormir :',
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
      id: 26,
      key: 'breakfast',
      text: 'Ton petit-déjeuner type :',
      type: 'single',
      options: [
        'Jeûne intermittent',
        'Protéines + bons gras',
        'Céréales complètes + fruits',
        'Sucré (pain blanc, confiture)',
        'Juste café/rien'
      ]
    },
    {
      id: 27,
      key: 'hydration',
      text: 'Hydratation quotidienne (eau pure) :',
      type: 'single',
      options: [
        '2L+ religieusement',
        '1.5-2L',
        '1-1.5L',
        'Moins d\'1L',
        'Principalement café/sodas'
      ]
    },
    {
      id: 28,
      key: 'alcohol',
      text: 'Consommation d\'alcool par semaine :',
      type: 'single',
      options: [
        '0 (jamais)',
        '1-3 verres',
        '4-7 verres (1/jour)',
        '8-14 verres (2/jour)',
        '15+ verres'
      ]
    },
    {
      id: 29,
      key: 'activities',
      text: 'Tes activités physiques régulières ?',
      subtitle: 'Choisis toutes celles que tu pratiques',
      type: 'multi-select',
      options: [
        'Course à pied',
        'Musculation',
        'HIIT/CrossFit',
        'Yoga/Pilates',
        'Natation',
        'Vélo',
        'Marche active',
        'Sports collectifs',
        'Arts martiaux',
        'Aucune activité'
      ]
    },
    {
      id: 30,
      key: 'frequency',
      text: 'Fréquence d\'activité physique :',
      type: 'single',
      options: [
        'Tous les jours',
        '4-6 fois/semaine',
        '2-3 fois/semaine',
        '1 fois/semaine',
        'Rarement ou jamais'
      ]
    },
    {
      id: 31,
      key: 'supplements',
      text: 'Compléments alimentaires :',
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
      id: 32,
      key: 'tracking',
      text: 'Outils de tracking santé ?',
      subtitle: 'Choisis tous ceux que tu utilises',
      type: 'multi-select',
      options: [
        'Apple Watch',
        'Garmin',
        'Whoop',
        'Oura Ring',
        'Fitbit',
        'Apps mobiles',
        'Balance connectée',
        'Aucun'
      ]
    },
    {
      id: 33,
      key: 'social',
      text: 'Relations sociales épanouissantes :',
      type: 'single',
      options: [
        'Très riches et nombreuses',
        'Satisfaisantes',
        'Limitées',
        'Difficiles/conflictuelles',
        'Isolement social'
      ]
    },
    {
      id: 34,
      key: 'vacations',
      text: 'Dernières vacances vraiment déconnectées :',
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
      id: 35,
      key: 'projection',
      text: 'Sans changement, dans 5 ans tu seras :',
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
      id: 36,
      key: 'fear',
      text: 'Ta plus grande peur santé :',
      type: 'single',
      options: [
        'AVC/Crise cardiaque',
        'Cancer',
        'Alzheimer/Démence',
        'Dépendance physique',
        'Mourir avant la retraite'
      ]
    },
    {
      id: 37,
      key: 'motivation',
      text: 'Ce qui te motive VRAIMENT à changer ?',
      subtitle: 'Choisis jusqu\'à 3 motivations principales',
      type: 'multi-select',
      maxChoices: 3,
      options: [
        'Voir mes petits-enfants grandir',
        'Rester autonome jusqu\'au bout',
        'Continuer à performer',
        'Être un exemple pour mes proches',
        'Ne pas souffrir',
        'Profiter de ma retraite',
        'Garder mon énergie',
        'Rester séduisant(e)'
      ]
    },
    {
      id: 38,
      key: 'budget',
      text: 'Budget mensuel pour ta santé :',
      type: 'single',
      options: [
        'Moins de 50€',
        '50-150€',
        '150-300€',
        '300-500€',
        'Plus de 500€'
      ]
    },
    {
      id: 39,
      key: 'time',
      text: 'Temps disponible par jour pour ta santé :',
      type: 'single',
      options: [
        'Moins de 15min',
        '15-30min',
        '30-60min',
        '1-2h',
        'Plus de 2h'
      ]
    }
  ];

  // WOW Breaks positions
  const wowBreaks = [
    {
      id: 'wow1',
      position: 10,
      icon: '💺',
      title: 'TA CHAISE TE TUE',
      badge: 'MÉTA-ANALYSE • 595,086 PARTICIPANTS',
      mainStat: '10h assis = +52% mortalité',
      stats: [
        '4h assis ✅ Risque minimal',
        '7h assis = +5% mortalité',
        '10h assis = +34% (avec sport)',
        '10h assis = +52% (sans sport)'
      ],
      solution: 'Solution : Pause active toutes les heures',
      source: 'PLOS ONE (2013) • PMID: 23826128'
    },
    {
      id: 'wow2',
      position: 16,
      icon: '🧠',
      title: 'TON VENTRE CONTRÔLE TON CERVEAU',
      badge: 'NATURE MICROBIOLOGY • 1,054 PARTICIPANTS',
      mainStat: '95% sérotonine = intestin',
      highlight: 'Ton bonheur vient littéralement du ventre !',
      stats: [
        'Intestin déréglé = +43% dépression',
        'Intestin déréglé = +38% anxiété',
        'Intestin déréglé = +52% inflammation',
        'Intestin déréglé = -27% performances cognitives'
      ],
      solution: '3 semaines de probiotiques = humeur transformée',
      source: 'Nature Microbiology (2023) • DOI: 10.1038/s41564-023-01339-5'
    },
    {
      id: 'wow3',
      position: 24,
      icon: '🏭',
      title: 'L\'AIR QUI TUE',
      badge: 'THE LANCET • 7 MILLIONS MORTS/AN',
      mainStat: 'Ville = -2.2 ans de vie',
      stats: [
        'PM2.5 > 10 μg/m³ = +15% maladies cardiaques',
        'PM2.5 > 10 μg/m³ = +25% déclin cognitif',
        'PM2.5 > 10 μg/m³ = +30% inflammation',
        'PM2.5 > 10 μg/m³ = -20% capacité pulmonaire'
      ],
      comparison: 'Paris: 15-20 μg/m³ | Lyon: 18-22 μg/m³ | Campagne: 5-8 μg/m³',
      source: 'The Lancet (2022) • DOI: 10.1016/S2542-5196(22)00090-0'
    },
    {
      id: 'wow4',
      position: 32,
      icon: '💊',
      title: 'LE SUPER-POUVOIR CACHÉ',
      badge: 'CELL • HARVARD MEDICAL SCHOOL',
      mainStat: 'NAD+ : -50% à 50 ans',
      highlight: 'La molécule qui contrôle ton vieillissement',
      boostMethods: [
        'Jeûne intermittent = +30% NAD+',
        'HIIT = +25% NAD+',
        'Sauna = +20% NAD+',
        'NMN/NR = +40-60% NAD+'
      ],
      benefits: [
        '✓ Énergie cellulaire',
        '✓ Réparation ADN',
        '✓ Régénération',
        '✓ Fonction cognitive'
      ],
      source: 'Cell (2024) • DOI: 10.1016/j.cell.2024.01.002'
    },
    {
      id: 'wow5',
      position: 36,
      icon: '⚰️',
      title: 'L\'INÉGALITÉ FACE À LA MORT',
      badge: 'INSEE 2023 • FRANCE',
      mainStat: 'Cadre = +7 ans de vie',
      stats: [
        '👔 Cadres supérieurs : 85 ans',
        '💼 Professions intermédiaires : 82 ans',
        '🔨 Ouvriers : 78 ans',
        '👷 Ouvriers non qualifiés : 76 ans'
      ],
      reasons: [
        'Stress physique vs mental',
        'Accès aux soins et prévention',
        'Conditions de travail',
        'Connaissances santé'
      ],
      solution: 'Le biohacking égalise les chances !',
      source: 'INSEE (2023) • insee.fr/fr/statistiques/6687000'
    },
    {
      id: 'wow6',
      position: 39,
      icon: '🧬',
      title: 'TU CONTRÔLES TON DESTIN',
      badge: 'GENETICS • 400M PROFILS • 40 ANS D\'ÉTUDE',
      mainStat: '7% Génétique | 93% Tes choix',
      highlight: 'La génétique n\'explique que 7% de la longévité !',
      breakdown: 'Le reste se gagne au quotidien',
      stats: [
        '✅ Étude sur 400 millions de profils',
        '✅ L\'héritabilité réelle est minime',
        '✅ Tu es le maître de ton destin',
        '✅ Tes choix quotidiens = 93% du résultat'
      ],
      solution: 'Ton protocole personnalisé Ora Life',
      source: 'Ruby et al., Genetics (2018) • PMC6661543'
    }
  ];

  res.status(200).json({ 
    success: true, 
    questions,
    wowBreaks,
    total: questions.length
  });
}
