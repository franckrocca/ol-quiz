export default function handler(req, res) {
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
      position: 33,
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
      position: 40,
      icon: '🧬',
      title: 'TU CONTRÔLES TON DESTIN',
      badge: 'SCIENCE • 2,748 JUMEAUX • 40 ANS D\'ÉTUDE',
      mainStat: '77% = choix de vie',
      breakdown: '23% génétique | 77% ton contrôle',
      highlight: 'Tes choix ont 3x plus d\'impact que tes gènes !',
      possibilities: [
        '✅ Modifier 500+ gènes en 12 semaines',
        '✅ Inverser 3 ans d\'âge cellulaire',
        '✅ Activer les gènes de longévité',
        '✅ Reprogrammer ton métabolisme'
      ],
      source: 'Science (2018) • DOI: 10.1126/science.aat7615'
    }
  ];

  res.status(200).json({ 
    success: true, 
    wowBreaks,
    total: wowBreaks.length
  });
}
