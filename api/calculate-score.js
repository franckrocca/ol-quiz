export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { answers } = req.body;
    
    // CALCUL DE L'ÂGE BIOLOGIQUE BASÉ SUR LA SCIENCE
    
    // Âge de base
    let biologicalAge = parseFloat(answers.age) || 40;
    const chronologicalAge = biologicalAge;
    
    // Facteurs de vieillissement basés sur les études
    const agingFactors = [];
    
    // 1. SÉDENTARITÉ (Medicine & Science in Sports & Exercise, 2019)
    // +34% mortalité après 10h assis AVEC sport, +52% sans sport
    if (answers.sitting_hours === 'Plus de 10h') {
        biologicalAge += 3.5; // Impact majeur
        agingFactors.push({
            name: '🪑 Sédentarité extrême',
            desc: '+34% mortalité (étude 2019)',
            impact: '-3.5 ans'
        });
    } else if (answers.sitting_hours === '8-10h') {
        biologicalAge += 2.5;
        agingFactors.push({
            name: '🪑 Trop assis',
            desc: 'Inflammation chronique',
            impact: '-2.5 ans'
        });
    } else if (answers.sitting_hours === '6-8h') {
        biologicalAge += 1;
    } else if (answers.sitting_hours === 'Moins de 4h') {
        biologicalAge -= 1; // Bonus actif
    }
    
    // 2. SOMMEIL (Walker, "Why We Sleep", 2017 + études multiples)
    // Moins de 5h = +15% mortalité toutes causes
    if (answers.sleep_hours === 'Moins de 5h' || answers.sleep_hours === 'Insomnie chronique') {
        biologicalAge += 3;
        agingFactors.push({
            name: '😴 Privation de sommeil',
            desc: '+15% mortalité (Walker, 2017)',
            impact: '-3 ans'
        });
    } else if (answers.sleep_hours === '5-7h agité') {
        biologicalAge += 2;
        agingFactors.push({
            name: '😴 Sommeil insuffisant',
            desc: 'Récupération partielle',
            impact: '-2 ans'
        });
    } else if (answers.sleep_hours === '7-9h de sommeil profond') {
        biologicalAge -= 1; // Bonus récupération
    }
    
    // Qualité du réveil
    if (answers.sleep_quality === 'Épuisé') {
        biologicalAge += 1.5;
    } else if (answers.sleep_quality === 'Fatigué') {
        biologicalAge += 0.5;
    } else if (answers.sleep_quality === 'Toujours en forme') {
        biologicalAge -= 0.5;
    }
    
    // 3. STRESS (Epel et al., 2004 - Télomères)
    // Stress chronique = vieillissement accéléré de 9-17 ans au niveau cellulaire
    if (answers.stress_level === 'Burnout proche') {
        biologicalAge += 4;
        agingFactors.push({
            name: '🔥 Burnout imminent',
            desc: 'Télomères raccourcis (Epel, 2004)',
            impact: '-4 ans'
        });
    } else if (answers.stress_level === 'Très élevé') {
        biologicalAge += 3;
        agingFactors.push({
            name: '🔥 Stress chronique',
            desc: 'Cortisol toxique',
            impact: '-3 ans'
        });
    } else if (answers.stress_level === 'Élevé') {
        biologicalAge += 1.5;
    } else if (answers.stress_level === 'Zen permanent') {
        biologicalAge -= 1;
    }
    
    // 4. ACTIVITÉ PHYSIQUE (Lancet, 2018 - 150min/semaine = -3.4 ans)
    if (answers.sport_frequency === 'Jamais') {
        biologicalAge += 3;
        agingFactors.push({
            name: '🏃 Zéro activité',
            desc: 'Sarcopénie accélérée',
            impact: '-3 ans'
        });
    } else if (answers.sport_frequency === '1 fois') {
        biologicalAge += 1.5;
    } else if (answers.sport_frequency === '3-4 fois') {
        biologicalAge -= 1.5; // Bonus
    } else if (answers.sport_frequency === '5+ fois') {
        biologicalAge -= 2; // Bonus max
    }
    
    // 5. ALCOOL (Lancet, 2018 - Pas de niveau sûr)
    if (answers.alcohol === '15+ verres') {
        biologicalAge += 4;
        agingFactors.push({
            name: '🍺 Alcool excessif',
            desc: 'Neurotoxicité (Lancet, 2018)',
            impact: '-4 ans'
        });
    } else if (answers.alcohol === '8-14 verres (2/jour)') {
        biologicalAge += 2.5;
        agingFactors.push({
            name: '🍺 Trop d\'alcool',
            desc: 'Inflammation hépatique',
            impact: '-2.5 ans'
        });
    } else if (answers.alcohol === '4-7 verres (1/jour)') {
        biologicalAge += 1;
    } else if (answers.alcohol === '0 (jamais)') {
        biologicalAge -= 0.5; // Léger bonus
    }
    
    // 6. TABAC (énorme impact)
    if (answers.smoking === 'Quotidien') {
        biologicalAge += 5;
        agingFactors.push({
            name: '🚬 Tabagisme',
            desc: '-10 ans espérance de vie',
            impact: '-5 ans'
        });
    } else if (answers.smoking === 'Vapotage') {
        biologicalAge += 1;
    }
    
    // 7. NUTRITION & HYDRATATION
    if (answers.breakfast === 'Café seulement') {
        biologicalAge += 0.5;
    } else if (answers.breakfast === 'Protéiné (œufs, viande)') {
        biologicalAge -= 0.5;
    }
    
    if (answers.hydration === 'Moins d\'1L' || answers.hydration === 'Principalement café/sodas') {
        biologicalAge += 1.5;
        agingFactors.push({
            name: '💧 Déshydratation',
            desc: 'Toxines accumulées',
            impact: '-1.5 ans'
        });
    } else if (answers.hydration === '2L+ religieusement') {
        biologicalAge -= 0.5;
    }
    
    // 8. EXPOSITION SOLEIL (Vitamine D)
    if (answers.sun_exposure === 'Quasi jamais') {
        biologicalAge += 1.5;
        agingFactors.push({
            name: '☀️ Carence vitamine D',
            desc: 'Immunité affaiblie',
            impact: '-1.5 ans'
        });
    } else if (answers.sun_exposure === '2h+ direct') {
        biologicalAge -= 0.5;
    }
    
    // 9. NATURE & GROUNDING
    if (answers.nature_time === 'Jamais') {
        biologicalAge += 1;
    } else if (answers.nature_time === 'Quotidien') {
        biologicalAge -= 0.5;
    }
    
    // 10. EXPOSITION AU FROID (Hormèse)
    if (answers.cold_exposure === 'Douche froide quotidienne' || answers.cold_exposure === 'Bain glacé/cryothérapie') {
        biologicalAge -= 1; // Bonus hormétique
    }
    
    // 11. SAUNA (Étude finlandaise - 4x/sem = -40% mortalité)
    if (answers.sauna_heat === '3+ fois/semaine') {
        biologicalAge -= 2; // Bonus important
    } else if (answers.sauna_heat === '1-2 fois/semaine') {
        biologicalAge -= 0.5;
    }
    
    // 12. IMC (calcul si poids et taille disponibles)
    if (answers.weight && answers.height) {
        const imc = answers.weight / ((answers.height/100) * (answers.height/100));
        if (imc < 18.5 || imc > 30) {
            biologicalAge += 2;
            agingFactors.push({
                name: '⚖️ IMC problématique',
                desc: 'Risques métaboliques',
                impact: '-2 ans'
            });
        } else if (imc > 25 && imc <= 30) {
            biologicalAge += 0.5;
        }
    }
    
    // 13. DIGESTION & MICROBIOME
    if (answers.digestion === 'Problèmes chroniques') {
        biologicalAge += 2;
        agingFactors.push({
            name: '🦠 Dysbiose intestinale',
            desc: 'Inflammation systémique',
            impact: '-2 ans'
        });
    } else if (answers.digestion === 'Ballonnements fréquents') {
        biologicalAge += 1;
    } else if (answers.digestion === 'Parfaite') {
        biologicalAge -= 0.5;
    }
    
    // 14. COGNITION & BRAIN FOG
    if (answers.focus_concentration === 'Brain fog permanent') {
        biologicalAge += 2;
        agingFactors.push({
            name: '🧠 Brain fog',
            desc: 'Neuroinflammation',
            impact: '-2 ans'
        });
    } else if (answers.focus_concentration === 'Focus laser 4h+') {
        biologicalAge -= 1;
    }
    
    // 15. LIBIDO (marqueur de vitalité)
    if (answers.libido === 'Inexistante' || answers.libido === '25% problématique') {
        biologicalAge += 1.5;
    } else if (answers.libido === '100% au top') {
        biologicalAge -= 0.5;
    }
    
    // 16. ÉNERGIE GLOBALE
    if (answers.energy_vs_3years === 'Fatigue chronique') {
        biologicalAge += 2;
    } else if (answers.energy_vs_3years === 'Débordante, mieux qu\'avant !') {
        biologicalAge -= 1;
    }
    
    // Arrondir l'âge biologique
    biologicalAge = Math.round(biologicalAge);
    const ageDifference = biologicalAge - chronologicalAge;
    
    // Trier les facteurs par impact
    agingFactors.sort((a, b) => {
        const impactA = parseFloat(a.impact.replace(/[^0-9.-]/g, ''));
        const impactB = parseFloat(b.impact.replace(/[^0-9.-]/g, ''));
        return impactA - impactB;
    });
    
    // Prendre les 3 principaux facteurs
    const topFactors = agingFactors.slice(0, 3);
    
    // Si pas assez de facteurs négatifs, ajouter des facteurs génériques
    while (topFactors.length < 3) {
        if (answers.last_blood_test === 'Jamais' || answers.last_blood_test === 'Plus de 2 ans') {
            topFactors.push({
                name: '🔬 Pas de suivi médical',
                desc: 'Prévention absente',
                impact: '-1 an'
            });
        } else if (answers.supplements === 'Aucun') {
            topFactors.push({
                name: '💊 Zéro supplémentation',
                desc: 'Carences probables',
                impact: '-1 an'
            });
        } else {
            topFactors.push({
                name: '⚡ Optimisation possible',
                desc: 'Marge de progression',
                impact: '-1 an'
            });
        }
    }
    
    // Score global (0-100)
    let score = 100;
    if (ageDifference > 0) {
        score = Math.max(0, 100 - (ageDifference * 10));
    } else if (ageDifference < 0) {
        score = Math.min(100, 100 + (Math.abs(ageDifference) * 5));
    }
    
    // Message selon le score
    let message = '';
    let level = '';
    
    if (score >= 85) {
        level = 'Excellence';
        message = '🏆 EXCELLENCE ! Tu fais partie du TOP 5%';
    } else if (score >= 70) {
        level = 'Très bon';
        message = '💪 TRÈS BON ! Tu es dans le TOP 20%';
    } else if (score >= 55) {
        level = 'Bon';
        message = '👍 BON NIVEAU ! Tu es dans le TOP 40%';
    } else if (score >= 40) {
        level = 'Moyen';
        message = '⚠️ MOYEN - Du potentiel à exploiter';
    } else {
        level = 'Critique';
        message = '🚨 CRITIQUE - Changements urgents nécessaires';
    }
    
    // Top 3 priorités d'action
    const priorities = [];
    
    topFactors.forEach(factor => {
        if (factor.name.includes('Sédentarité')) {
            priorities.push('Timer 50min = 10min debout/marche');
        } else if (factor.name.includes('Sommeil')) {
            priorities.push('Protocole 7-9h (magnésium glycinate 400mg)');
        } else if (factor.name.includes('Stress')) {
            priorities.push('HRV training 5min matin + soir');
        } else if (factor.name.includes('Alcool')) {
            priorities.push('Réduire à 0-3 verres/semaine maximum');
        } else if (factor.name.includes('activité')) {
            priorities.push('Minimum 3x/semaine HIIT 20min');
        } else if (factor.name.includes('Tabagisme')) {
            priorities.push('Arrêt urgent du tabac (protocole nicotine)');
        } else if (factor.name.includes('Hydratation')) {
            priorities.push('35ml/kg poids corporel d\'eau pure/jour');
        } else if (factor.name.includes('vitamine D')) {
            priorities.push('Vitamine D 4000UI/jour + K2');
        } else if (factor.name.includes('Dysbiose')) {
            priorities.push('Probiotiques 50 milliards CFU + fibres');
        } else if (factor.name.includes('Brain fog')) {
            priorities.push('Lions Mane 1g + Oméga-3 DHA 1g/jour');
        }
    });
    
    // Compléter si nécessaire
    const defaultPriorities = [
        'Exposition lumière 10min au réveil',
        'Douche froide 2min/jour',
        'Jeûne intermittent 16:8',
        'Earthing 20min pieds nus/jour',
        'Méditation 10min/jour'
    ];
    
    while (priorities.length < 3 && defaultPriorities.length > 0) {
        priorities.push(defaultPriorities.shift());
    }
    
    return res.status(200).json({
        score: score,
        level: level,
        message: message,
        biologicalAge: biologicalAge,
        chronologicalAge: chronologicalAge,
        ageDifference: ageDifference,
        factors: topFactors,
        priorities: priorities.slice(0, 3)
    });
}
