// quiz.js - Frontend complet et fonctionnel
class ORALifeQuiz {
  constructor() {
    // Configuration
    this.apiBase = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000/api' 
      : '/api';
    
    this.googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwjyAjH9Nl6y2IeRWHi5Qrr6ftqVilH4T9RMPAdNXM_XYVuaN0WFzrPPYwVL8oOZR0W/exec';
    
    // État
    this.state = {
      currentScreen: 'landing',
      currentQuestionIndex: 0,
      answers: {},
      userProfile: {},
      startTime: null,
      quizData: null
    };
    
    this.init();
  }

  async init() {
    try {
      await this.loadQuizData();
      this.setupEventListeners();
      this.showScreen('landing');
      console.log('✅ Quiz initialisé');
    } catch (error) {
      console.error('❌ Erreur init:', error);
      this.showError('Erreur de chargement. Veuillez rafraîchir.');
    }
  }

  async loadQuizData() {
    try {
      const response = await fetch(`${this.apiBase}/questions`);
      if (response.ok) {
        this.state.quizData = await response.json();
        console.log('✅ Questions chargées depuis API');
        return;
      }
    } catch (error) {
      console.warn('⚠️ API non disponible, utilisation données locales');
    }
    
    // Fallback avec données locales
    this.loadLocalData();
  }

  loadLocalData() {
    this.state.quizData = {
      sections: [
        {
          id: "baseline",
          questions: [
            {
              id: "q1",
              text: "Tu es ?",
              type: "single",
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
            }
          ]
        }
      ],
      wowBreaks: [
        {
          afterQuestion: 3,
          title: "😴 Le Saviez-Vous ?",
          content: "Les personnes qui dorment moins de 6h ont 4.5x plus de risques de burnout.",
          stat: "4.5x"
        }
      ]
    };
  }

  setupEventListeners() {
    // Bouton Start
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startQuiz());
    }

    // Navigation
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.handleNext());
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.handlePrevious());
    }

    // Options de réponse
    document.addEventListener('click', (e) => {
      if (e.target.closest('.option-btn')) {
        this.selectOption(e.target.closest('.option-btn'));
      }
      if (e.target.closest('.visual-option')) {
        this.selectVisualOption(e.target.closest('.visual-option'));
      }
    });
  }

  showScreen(screenName) {
    // Cacher tous les écrans
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });

    // Afficher l'écran demandé
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
      targetScreen.classList.add('active');
      this.state.currentScreen = screenName;
    }

    // Mise à jour de la progression
    this.updateProgress();
  }

  startQuiz() {
    this.state.startTime = Date.now();
    this.state.currentQuestionIndex = 0;
    this.showQuestion(0);
  }

  showQuestion(index) {
    const question = this.getCurrentQuestion();
    if (!question) {
      this.calculateResults();
      return;
    }

    // Check for WOW break
    const wowBreak = this.getWowBreak(index);
    if (wowBreak && index > 0) {
      this.showWowBreak(wowBreak);
      return;
    }

    this.showScreen('question');
    this.renderQuestion(question);
    this.updateProgress();
  }

  getCurrentQuestion() {
    const allQuestions = this.getAllQuestions();
    return allQuestions[this.state.currentQuestionIndex];
  }

  getAllQuestions() {
    if (!this.state.quizData) return [];
    return this.state.quizData.sections.flatMap(s => s.questions);
  }

  getWowBreak(index) {
    if (!this.state.quizData?.wowBreaks) return null;
    return this.state.quizData.wowBreaks.find(w => w.afterQuestion === index);
  }

  renderQuestion(question) {
    const container = document.getElementById('question-container');
    if (!container) return;

    const isVisual = question.isVisual;
    
    container.innerHTML = `
      <h2 class="question-text">${question.text}</h2>
      <div class="${isVisual ? 'visual-options' : 'options-grid'}">
        ${question.options.map(option => {
          if (isVisual) {
            return `
              <div class="visual-option" data-value="${option.value}">
                <img src="${option.image}" alt="${option.label}">
                <div class="label">${option.label}</div>
              </div>
            `;
          } else {
            return `
              <button class="option-btn" data-value="${option.value}">
                ${option.label}
              </button>
            `;
          }
        }).join('')}
      </div>
    `;

    // Restaurer la sélection si elle existe
    const savedAnswer = this.state.answers[question.id];
    if (savedAnswer) {
      const element = container.querySelector(`[data-value="${savedAnswer}"]`);
      if (element) element.classList.add('selected');
    }

    this.updateNavigationButtons();
  }

  selectOption(button) {
    const question = this.getCurrentQuestion();
    if (!question) return;

    // Retirer la sélection précédente
    button.parentElement.querySelectorAll('.option-btn').forEach(btn => {
      btn.classList.remove('selected');
    });

    // Ajouter la nouvelle sélection
    button.classList.add('selected');
    
    // Sauvegarder la réponse
    this.state.answers[question.id] = button.dataset.value;
    
    // Activer le bouton suivant
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.disabled = false;
  }

  selectVisualOption(option) {
    const question = this.getCurrentQuestion();
    if (!question) return;

    // Retirer la sélection précédente
    option.parentElement.querySelectorAll('.visual-option').forEach(opt => {
      opt.classList.remove('selected');
    });

    // Ajouter la nouvelle sélection
    option.classList.add('selected');
    
    // Sauvegarder la réponse
    this.state.answers[question.id] = option.dataset.value;
    
    // Auto-avancer après sélection visuelle
    setTimeout(() => this.handleNext(), 300);
  }

  showWowBreak(wowBreak) {
    this.showScreen('wow');
    
    const container = document.querySelector('.wow-content');
    if (container) {
      container.innerHTML = `
        <div class="wow-emoji">🤯</div>
        <h2 class="wow-title">${wowBreak.title}</h2>
        <div class="wow-stat">${wowBreak.stat}</div>
        <p class="wow-text">${wowBreak.content}</p>
        ${wowBreak.source ? `<p class="wow-source">Source: ${wowBreak.source}</p>` : ''}
        <button class="btn-primary" onclick="quiz.continueAfterWow()">
          Continuer →
        </button>
      `;
    }
  }

  continueAfterWow() {
    this.state.currentQuestionIndex++;
    this.showQuestion(this.state.currentQuestionIndex);
  }

  handleNext() {
    const allQuestions = this.getAllQuestions();
    
    if (this.state.currentQuestionIndex >= allQuestions.length - 1) {
      this.calculateResults();
    } else {
      this.state.currentQuestionIndex++;
      this.showQuestion(this.state.currentQuestionIndex);
    }
  }

  handlePrevious() {
    if (this.state.currentQuestionIndex > 0) {
      this.state.currentQuestionIndex--;
      this.showQuestion(this.state.currentQuestionIndex);
    }
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const question = this.getCurrentQuestion();
    const allQuestions = this.getAllQuestions();

    if (prevBtn) {
      prevBtn.style.display = this.state.currentQuestionIndex > 0 ? 'block' : 'none';
    }

    if (nextBtn) {
      nextBtn.disabled = !this.state.answers[question?.id];
      
      const isLast = this.state.currentQuestionIndex >= allQuestions.length - 1;
      nextBtn.innerHTML = isLast ? 'Voir mes résultats →' : 'Suivant →';
    }
  }

  updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progress-text');
    
    if (!progressBar || !progressText) return;

    const allQuestions = this.getAllQuestions();
    const progress = (this.state.currentQuestionIndex / allQuestions.length) * 100;
    
    progressBar.style.width = `${progress}%`;
    
    if (this.state.currentScreen === 'landing') {
      progressText.textContent = 'Prêt à commencer';
    } else if (this.state.currentScreen === 'results') {
      progressText.textContent = 'Analyse complète';
    } else {
      progressText.textContent = `Question ${this.state.currentQuestionIndex + 1}/${allQuestions.length}`;
    }
  }

  async calculateResults() {
    this.showScreen('loading');

    try {
      // Collecter le profil utilisateur
      this.collectUserProfile();

      // Calculer le score
      const scoreData = await this.calculateScore();

      // Afficher les résultats
      setTimeout(() => {
        this.displayResults(scoreData);
      }, 2000);

      // Envoyer à Google Sheets
      this.sendToGoogleSheets(scoreData);

    } catch (error) {
      console.error('Erreur calcul:', error);
      this.showError('Erreur lors du calcul des résultats');
    }
  }

  collectUserProfile() {
    this.state.userProfile = {
      gender: this.state.answers.q1 || 'non-specifie',
      age: this.state.answers.q2 || '30-39',
      completionTime: Math.round((Date.now() - this.state.startTime) / 1000),
      timestamp: new Date().toISOString()
    };
  }

  async calculateScore() {
    try {
      // Essayer l'API d'abord
      const response = await fetch(`${this.apiBase}/calculate-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: this.state.answers,
          userProfile: this.state.userProfile
        })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('API calcul non disponible, calcul local');
    }

    // Calcul local de secours
    return this.calculateScoreLocally();
  }

  calculateScoreLocally() {
    // Calcul simple pour le fallback
    const totalQuestions = Object.keys(this.state.answers).length;
    let totalScore = 0;
    let maxScore = 0;

    Object.entries(this.state.answers).forEach(([questionId, answer]) => {
      // Score simple basé sur les réponses
      maxScore += 5;
      
      // Attribution basique de points
      if (answer === 'excellent' || answer === 'toujours') totalScore += 5;
      else if (answer === 'bon' || answer === 'souvent') totalScore += 4;
      else if (answer === 'moyen' || answer === 'parfois') totalScore += 3;
      else if (answer === 'faible' || answer === 'rarement') totalScore += 2;
      else totalScore += 1;
    });

    const percentage = Math.round((totalScore / maxScore) * 100);

    return {
      score: percentage,
      biologicalAge: this.estimateBiologicalAge(percentage),
      profile: this.getProfile(percentage),
      recommendations: this.getRecommendations(percentage)
    };
  }

  estimateBiologicalAge(score) {
    const chronoAge = parseInt(this.state.userProfile.age?.split('-')[0] || 35);
    const adjustment = ((100 - score) / 100) * 15 - 7.5;
    return Math.round(chronoAge + adjustment);
  }

  getProfile(score) {
    if (score >= 80) {
      return {
        level: "Biohacker Elite",
        description: "Tu fais partie du top 1% en termes d'optimisation",
        color: "#00FF00",
        emoji: "🚀"
      };
    } else if (score >= 60) {
      return {
        level: "Optimisé",
        description: "Excellente base avec potentiel d'amélioration",
        color: "#7FFF00",
        emoji: "💪"
      };
    } else if (score >= 40) {
      return {
        level: "Potentiel",
        description: "Des bases solides avec un énorme potentiel inexploité",
        color: "#FFD700",
        emoji: "⚡"
      };
    } else {
      return {
        level: "À Risque",
        description: "Plusieurs signaux d'alarme, action recommandée",
        color: "#FF8C00",
        emoji: "⚠️"
      };
    }
  }

  getRecommendations(score) {
    if (score >= 80) {
      return [
        "Continue ton protocole actuel",
        "Explore les techniques avancées (hormèse)",
        "Track tes biomarqueurs mensuellement"
      ];
    } else if (score >= 60) {
      return [
        "Optimise ton sommeil (7-9h)",
        "Ajoute du HIIT 2x/semaine",
        "Considère le jeûne intermittent"
      ];
    } else if (score >= 40) {
      return [
        "Priorise 8000 pas quotidiens",
        "Améliore la qualité de ton alimentation",
        "Établis une routine de sommeil"
      ];
    } else {
      return [
        "Consultation médicale recommandée",
        "Focus sur les bases: sommeil, mouvement, nutrition",
        "Commence par 1 habitude à la fois"
      ];
    }
  }

  displayResults(scoreData) {
    this.showScreen('results');
    
    const container = document.getElementById('results-container');
    if (!container) return;

    const scoreColor = this.getScoreColor(scoreData.score);

    container.innerHTML = `
      <div class="results-header">
        <h1>Ton Score ORA Life</h1>
        <div class="score-circle" style="border-color: ${scoreColor}">
          <div class="score-value" style="color: ${scoreColor}">${scoreData.score}</div>
          <div class="score-label">/ 100</div>
        </div>
      </div>

      <div class="profile-card" style="border-left-color: ${scoreData.profile.color}">
        <div class="profile-emoji">${scoreData.profile.emoji}</div>
        <h2>${scoreData.profile.level}</h2>
        <p>${scoreData.profile.description}</p>
      </div>

      ${scoreData.biologicalAge ? `
        <div class="bio-age-card">
          <h3>Âge Biologique Estimé</h3>
          <div class="bio-age-value">${scoreData.biologicalAge} ans</div>
          <p>vs âge chronologique: ${this.state.userProfile.age}</p>
        </div>
      ` : ''}

      <div class="recommendations-card">
        <h3>🎯 Tes 3 Actions Prioritaires</h3>
        <ul>
          ${scoreData.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>

      <div class="cta-section">
        <h3>💚 Reçois Ton Protocole Personnalisé</h3>
        <input type="email" id="email-input" placeholder="ton@email.com" class="email-input">
        <button class="btn-primary" onclick="quiz.submitEmail()">
          Recevoir Mon Protocole Gratuit
        </button>
      </div>

      <div class="share-section">
        <p>Partage ce test avec tes amis entrepreneurs:</p>
        <button class="btn-secondary" onclick="quiz.shareResults()">
          📤 Partager
        </button>
      </div>
    `;
  }

  getScoreColor(score) {
    if (score >= 80) return '#00FF00';
    if (score >= 60) return '#7FFF00';
    if (score >= 40) return '#FFD700';
    return '#FF8C00';
  }

  async sendToGoogleSheets(scoreData) {
    try {
      const data = {
        ...this.state.answers,
        ...this.state.userProfile,
        score: scoreData.score,
        biologicalAge: scoreData.biologicalAge,
        profile: scoreData.profile.level
      };

      await fetch(this.googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      console.log('✅ Données envoyées à Google Sheets');
    } catch (error) {
      console.error('❌ Erreur envoi Google Sheets:', error);
    }
  }

  submitEmail() {
    const emailInput = document.getElementById('email-input');
    const email = emailInput?.value;

    if (!email || !email.includes('@')) {
      this.showToast('Entre un email valide');
      return;
    }

    // Envoyer l'email à Google Sheets
    this.sendToGoogleSheets({
      email,
      requestedProtocol: true
    });

    this.showToast('✅ Protocole envoyé ! Check tes emails.');
    emailInput.value = '';
  }

  shareResults() {
    const shareData = {
      title: 'ORA Life - Test de Vitalité',
      text: `J'ai obtenu ${this.state.score}/100 au test de vitalité ORA Life !`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
      this.showToast('Lien copié !');
    }
  }

  showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-blue);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  showError(message) {
    const container = document.getElementById('quiz-container') || document.querySelector('.container');
    if (container) {
      container.innerHTML = `
        <div class="error-card">
          <h2>⚠️ Erreur</h2>
          <p>${message}</p>
          <button onclick="location.reload()" class="btn-primary">
            Réessayer
          </button>
        </div>
      `;
    }
  }
}

// Initialisation globale
let quiz;
document.addEventListener('DOMContentLoaded', () => {
  quiz = new ORALifeQuiz();
});
