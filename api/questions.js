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
      ]
    },
    {
      id: 4,
      key: 'goals',
      text: 'Tes objectifs prioritaires ?',
      subtitle: 'Choisis jusqu\'à 3 options',
      type: 'multi-select',
      maxChoices: 3,
      options: [
        'Perdre du gras',
        'Gagner du muscle',
        'Plus d\'énergie',
        'Mieux dormir',
        'Moins de stress',
        'Améliorer ma concentration',
        'Ralentir le vieillissement',
        'Optimiser ma santé'
      ]
    },
    {
      id: 5,
      key: 'energy3y',
      text: 'Comparé à il y a 3 ans, ton énergie c\'est :',
      type: 'single',
      options: [
        'Bien mieux qu\'avant',
        'Un peu mieux',
        'Pareil (stable)',
        'Un peu moins bien',
        'Beaucoup moins bien'
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
        'Il y a 2-3 ans',
        'Je ne m\'en souviens plus'
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
        'Pas de motivation',
        'Trop cher',
        'Je ne savais pas par où commencer'
      ]
    },
    {
      id: 8,
      key: 'stairs',
      text: 'Test de l\'escalier (2 étages sans pause) :',
      type: 'single',
      options: [
        'Facile, je pourrais continuer',
        'OK mais légèrement essoufflé',
        'Difficile, bien essoufflé',
        'Très dur, obligé de m\'arrêter',
        'Impossible sans pause'
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
        '7-9h',
        '10-12h',
        'Plus de 12h'
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
        '4-5 fois',
        'Plus de 5 fois'
      ]
    },
    {
      id: 11,
      key: 'libido',
      text: 'Libido et énergie sexuelle :',
      type: 'single',
      options: [
        'Au top, comme à 20 ans',
        'Plutôt bien',
        'Correct mais en baisse',
        'Clairement diminuée',
        'Plus vraiment d\'intérêt'
      ]
    },
    {
      id: 12,
      key: 'crash',
      text: 'Ton premier crash énergétique arrive :',
      type: 'single',
      options: [
        'Jamais de crash',
        'Après 17h',
        'Vers 14-15h',
        'Dès 11h',
        'Fatigué dès le réveil'
      ]
    },
    {
      id: 13,
      key: 'weightVsIdeal',
      text: 'Ton poids vs ton idéal :',
      type: 'single',
      options: [
        'Pile mon poids idéal',
        '+/- 3kg de mon idéal',
        '+5 à 10kg',
        '+10 à 20kg',
        '+20kg ou plus'
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
        'Aucune douleur',
        'Petites gênes occasionnelles',
        'Douleurs régulières mais gérables',
        'Douleurs qui limitent mes activités',
        'Douleurs chroniques handicapantes'
      ]
    },
    {
      id: 16,
      key: 'cognition',
      text: 'Ta mémoire et concentration :',
      type: 'single',
      options: [
        'Sharp comme un laser',
        'Plutôt bonnes',
        'Des moments de flou',
        'Difficultés fréquentes',
        'Brouillard mental constant'
      ]
    },
    {
      id: 17,
      key: 'symptoms',
      text: 'Masse musculaire et force :',
      type: 'single',
      options: [
        'Muscle et force au top',
        'Maintien correct',
        'Légère perte visible',
        'Perte importante',
        'Fonte musculaire inquiétante'
      ]
    },
    {
      id: 18,
      key: 'recovery',
      text: 'Récupération après effort physique :',
      type: 'single',
      options: [
        '24h max',
        '48h environ',
        '3-4 jours',
        'Une semaine',
        'Courbatures permanentes'
      ]
    },
    {
      id: 19,
      key: 'stress',
      text: 'Niveau de stress chronique :',
      type: 'single',
      options: [
        'Zen en toutes circonstances',
        'Stress ponctuel gérable',
        'Stress régulier',
        'Stress quotidien élevé',
        'Burnout/épuisement'
      ]
    },
    {
      id: 20,
      key: 'skin',
      text: 'Qualité de ta peau :',
      type: 'single',
      options: [
        'Peau de bébé',
        'Quelques imperfections',
        'Rides et ridules visibles',
        'Vieillissement marqué',
        'Problèmes cutanés multiples'
      ]
    },
    {
      id: 21,
      key: 'environment',
      text: 'Ton environnement principal :',
      type: 'single',
      options: [
        'Campagne/nature',
        'Petite ville',
        'Ville moyenne',
        'Grande ville',
        'Mégapole polluée'
      ]
    },
    {
      id: 22,
      key: 'sun',
      text: 'Exposition soleil (peau nue) :',
      type: 'single',
      options: [
        '30min+ par jour',
        '15-30min par jour',
        'Quelques fois par semaine',
        'Rarement',
        'Jamais (mode vampire)'
      ]
    },
    {
      id: 23,
      key: 'nature',
      text: 'Temps en nature par semaine :',
      type: 'single',
      options: [
        'Je vis dans la nature',
        'Plus de 10h',
        '5-10h',
        '1-5h',
        '0h (100% béton)'
      ]
    },
    {
      id: 24,
      key: 'sleepQuality',
      text: 'Qualité de ton sommeil :',
      type: 'single',
      options: [
        'Parfait, je me réveille en forme',
        'Plutôt bon',
        'Variable',
        'Souvent mauvais',
        'Insomnie chronique'
      ]
    },
    {
      id: 25,
      key: 'bedtime',
      text: 'Heure habituelle du coucher :',
      type: 'single',
      options: [
        'Avant 22h',
        '22h-23h',
        '23h-minuit',
        'Minuit-1h',
        'Après 1h'
      ]
    },
    {
      id: 26,
      key: 'screens',
      text: 'Écrans avant de dormir :',
      type: 'single',
      options: [
        'Jamais (livre/méditation)',
        'Arrêt 2h avant',
        'Arrêt 1h avant',
        'Jusqu\'au lit',
        'Je m\'endors avec'
      ]
    },
    {
      id: 27,
      key: 'breakfast',
      text: 'Ton petit-déjeuner type :',
      type: 'single',
      options: [
        'Protéines + gras (œufs, avocat)',
        'Équilibré (complet)',
        'Céréales/muesli',
        'Sucré (pain blanc, confiture)',
        'Juste café/rien'
      ]
    },
    {
      id: 28,
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
      id: 29,
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
      id: 30,
      key: 'activities',
      text: 'Tes activités physiques régulières ?',
      subtitle: 'Choisis toutes celles que tu pratiques',
      type: 'multi-select',
      options: [
        'Musculation',
        'Course à pied',
        'Yoga/Pilates',
        'Sports collectifs',
        'Natation',
        'Vélo',
        'Marche active',
        'Arts martiaux',
        'CrossFit/HIIT',
        'Aucune activité'
      ]
    },
    {
      id: 31,
      key: 'frequency',
      text: 'Fréquence d\'activité physique :',
      type: 'single',
      options: [
        '6-7x par semaine',
        '4-5x par semaine',
        '2-3x par semaine',
        '1x par semaine',
        'Jamais'
      ]
    },
    {
      id: 32,
      key: 'supplements',
      text: 'Compléments alimentaires :',
      type: 'single',
      options: [
        'Stack complet optimisé',
        'Quelques basiques (vitamines)',
        'Occasionnellement',
        'Jamais',
        'N\'importe quoi sans stratégie'
      ]
    },
    {
      id: 33,
      key: 'tracking',
      text: 'Outils de tracking santé ?',
      subtitle: 'Choisis tous ceux que tu utilises',
      type: 'multi-select',
      options: [
        'Montre connectée',
        'Balance intelligente',
        'App de sommeil',
        'App nutrition',
        'Tracker d\'activité',
        'Tensiomètre',
        'Glucomètre',
        'Aucun tracking'
      ]
    },
    {
      id: 34,
      key: 'social',
      text: 'Relations sociales épanouissantes :',
      type: 'single',
      options: [
        'Entourage au top',
        'Plutôt bien entouré',
        'Quelques bonnes relations',
        'Peu de vraies connexions',
        'Isolement social'
      ]
    },
    {
      id: 35,
      key: 'vacations',
      text: 'Dernières vacances vraiment déconnectées :',
      type: 'single',
      options: [
        'Ce mois-ci',
        'Cette année',
        'L\'année dernière',
        'Il y a 2-3 ans',
        'Je ne déconnecte jamais'
      ]
    },
    {
      id: 36,
      key: 'projection',
      text: 'Sans changement, dans 5 ans tu seras :',
      type: 'single',
      options: [
        'En pleine forme',
        'À peu près pareil',
        'Un peu diminué',
        'Sérieusement dégradé',
        'Dans un état critique'
      ]
    },
    {
      id: 37,
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
      id: 38,
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
      id: 39,
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
      id: 40,
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

  res.status(200).json({ 
    success: true, 
    questions,
    total: questions.length
  });
}
