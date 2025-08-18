// quiz.js - Frontend modulaire avec API integration
// Compatible avec ton HTML/CSS existant

class ORALifeQuiz {
  constructor() {
    // Configuration API
    this.apiBase = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000/api' 
      : '/api';
    
    // Google Script URL
    this.googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwjyAjH9Nl6y2IeRWHi5Qrr6ftqVilH4T9RMPAdNXM_XYVuaN0WFzrPPYwVL8oOZR0W/exec';
    
    // État du quiz
    this.state = {
      currentScreen: 'landing',
      currentQuestionIndex: 0,
      answers: {},
      userProfile: {},
      startTime: null,
      quizData: null,
      currentSection: 0,
      currentQuestionInSection: 0
    };
    
    // Initialisation
    this.init();
  }

  async init() {
    try {
      // Charger les questions depuis l'API
      await this.loadQuizData();
      
      // Setup event listeners
      this.setupEventListeners();
      
      console.log('Quiz initialisé avec succès');
    } catch (error) {
      console.error('Erreur initialisation:', error);
      this.showError('Impossible de charger le quiz. Veuillez rafraîchir la page.');
    }
  }

  async loadQuizData() {
    try {
      const response = await fetch(`${this.apiBase}/questions`);
      
      // Fallback si API non disponible (mode développement)
      if (!response.ok) {
        console.log('API non disponible, utilisation des données locales');
        this.loadLocalQuestions();
        return;
      }
      
      this.state.quizData = await response.json();
      console.log('Questions chargées depuis API:', this.state.quizData);
    } catch (error) {
      console.warn('Chargement API échoué, fallback local:', error);
      this.loadLocalQuestions();
    }
  }

  loadLocalQuestions() {
    // Fallback avec questions locales pour développement
    this.state.quizData = {
      sections: [
        {
          id: "baseline",
          questions: [
            {
              id: "q1",
              text: "Comment décrirais-tu ton niveau d'énergie actuel ?",
              type: "single",
              options: [
                { value: "exhausted", label: "Je suis épuisé(e) en permanence", score: 1 },
                { value: "tired", label: "Souvent fatigué(e), ça fluctue", score: 2 },
                { value: "ok", label: "Correct mais irrégulier", score: 3 },
                { value: "excellent", label: "Excellent et stable toute la journée", score: 5 }
              ]
            }
            // Ajoute tes autres questions ici
          ]
        }
      ],
      wowBreaks: [
        {
          id: "wow1",
          afterQuestion: "q3",
          title: "😴 Le Saviez-Vous ?",
          content: "Les personnes qui dorment moins de 6h ont 4.5x plus de risques de burnout.",
          source: "Sleep Medicine Reviews 2023"
        }
      ]
    };
  }

  setupEventListeners() {
    // Start Quiz
    const startBtn = document.getElementById('start-quiz');
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
      prevBtn.addEventListener('click', () => this.handlePrev());
    }

    // Réponses (délégation d'événements)
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('quiz-option')) {
        this.handleAnswer(e.target);
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.state.currentScreen === 'quiz') {
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn && !nextBtn.disabled) {
          this.handleNext();
        }
      }
    });
  }

  startQuiz() {
    this.state.startTime = Date.now();
    this.state.currentScreen = 'quiz';
    this.switchScreen('quiz');
    this.renderCurrentQuestion();
  }

  switchScreen(screenName) {
    // Cacher tous les écrans
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Afficher l'écran demandé
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
      targetScreen.classList.add('active');
      
      // Animation d'entrée
      targetScreen.style.opacity = '0';
      requestAnimationFrame(() => {
        targetScreen.style.transition = 'opacity 0.5s ease';
        targetScreen.style.opacity = '1';
      });
    }
  }

  renderCurrentQuestion() {
    const question = this.getCurrentQuestion();
    if (!question) {
      this.submitQuiz();
      return;
    }

    // Vérifier si on doit afficher un WOW break
    const previousQuestion = this.getPreviousQuestion();
    if (previousQuestion) {
      const wowBreak = this.state.quizData.wowBreaks.find(
        wb => wb.afterQuestion === previousQuestion.id
      );
      if (wowBreak && !this.state.wowShown?.[wowBreak.id]) {
        this.renderWowBreak(wowBreak);
        return;
      }
    }

    // Mettre à jour la progression
    this.updateProgress();

    // Render la question
    const container = document.getElementById('question-container');
    if (!container) return;

    const html = `
      <div class="question-wrapper" data-question-id="${question.id}">
        <h2 class="question-title">${question.text}</h2>
        
        ${question.scientific_ref ? `
          <div class="scientific-reference">
            <span class="ref-icon">📊</span>
            <span class="ref-text">${question.scientific_ref}</span>
          </div>
        ` : ''}
        
        <div class="options-grid ${question.type === 'multiple' ? 'multiple-select' : ''}">
          ${this.renderOptions(question)}
        </div>
      </div>
    `;

    container.innerHTML = html;
    
    // Mettre à jour les boutons de navigation
    this.updateNavigationButtons();
  }

  renderOptions(question) {
    const currentAnswer = this.state.answers[question.id];
    
    return question.options.map(option => {
      const isChecked = question.type === 'multiple' 
        ? currentAnswer?.includes(option.value)
        : currentAnswer === option.value;
      
      return `
        <label class="option-label ${isChecked ? 'selected' : ''}">
          <input 
            type="${question.type === 'multiple' ? 'checkbox' : 'radio'}"
            name="question-${question.id}"
            value="${option.value}"
            class="quiz-option"
            ${isChecked ? 'checked' : ''}
          >
          <span class="option-content">
            <span class="option-text">${option.label}</span>
            ${option.mortality_risk ? `
              <span class="risk-indicator" title="Impact: ${option.mortality_risk}x">
                ${this.getRiskEmoji(option.mortality_risk)}
              </span>
            ` : ''}
          </span>
        </label>
      `;
    }).join('');
  }

  renderWowBreak(wowBreak) {
    const container = document.getElementById('wow-screen');
    const content = container.querySelector('.wow-content');
    
    if (!content) return;

    content.innerHTML = `
      <div class="wow-wrapper">
        <h2 class="wow-title">${wowBreak.title}</h2>
        <p class="wow-text">${wowBreak.content}</p>
        <cite class="wow-source">${wowBreak.source}</cite>
        <button class="btn-primary btn-large" onclick="quiz.continueFromWow()">
          Continuer l'évaluation →
        </button>
      </div>
    `;

    this.switchScreen('wow');
    
    // Marquer comme affiché
    if (!this.state.wowShown) this.state.wowShown = {};
    this.state.wowShown[wowBreak.id] = true;
  }

  continueFromWow() {
    this.switchScreen('quiz');
    this.state.currentQuestionIndex++;
    this.renderCurrentQuestion();
  }

  handleAnswer(input) {
    const question = this.getCurrentQuestion();
    if (!question) return;

    if (question.type === 'multiple') {
      const checked = document.querySelectorAll(`input[name="question-${question.id}"]:checked`);
      this.state.answers[question.id] = Array.from(checked).map(cb => cb.value);
    } else {
      this.state.answers[question.id] = input.value;
      
      // Pour les questions simples, mettre à jour visuellement
      document.querySelectorAll('.option-label').forEach(label => {
        label.classList.remove('selected');
      });
      input.closest('.option-label').classList.add('selected');
    }

    // Activer le bouton suivant
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
      nextBtn.disabled = false;
    }
  }

  handleNext() {
    const question = this.getCurrentQuestion();
    
    // Vérifier qu'une réponse est sélectionnée
    if (!this.state.answers[question?.id]) {
      this.showToast('Veuillez sélectionner une réponse');
      return;
    }

    // Avancer
    this.state.currentQuestionIndex++;
    this.renderCurrentQuestion();
  }

  handlePrev() {
    if (this.state.currentQuestionIndex > 0) {
      this.state.currentQuestionIndex--;
      this.renderCurrentQuestion();
    }
  }

  async submitQuiz() {
    // Afficher l'écran de chargement
    this.switchScreen('loading');
    
    try {
      // Collecter le profil utilisateur
      this.collectUserProfile();
      
      // Calculer le score via l'API
      const scoreData = await this.calculateScore();
      
      // Afficher les résultats
      this.renderResults(scoreData);
      
      // Envoyer à Google Sheets
      this.sendToGoogleSheets(scoreData);
      
    } catch (error) {
      console.error('Erreur soumission:', error);
      this.showError('Erreur lors du calcul de votre score');
    }
  }

  async calculateScore() {
    try {
      const response = await fetch(`${this.apiBase}/calculate-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers: this.state.answers,
          userProfile: this.state.userProfile,
          completionTime: Math.round((Date.now() - this.state.startTime) / 1000)
        })
      });

      if (!response.ok) {
        // Fallback calcul local simple
        return this.calculateScoreLocally();
      }

      return await response.json();
    } catch (error) {
      console.warn('API score non disponible, calcul local:', error);
      return this.calculateScoreLocally();
    }
  }

  calculateScoreLocally() {
    // Calcul simplifié en local (fallback)
    let totalScore = 0;
    let questionCount = 0;

    Object.entries(this.state.answers).forEach(([questionId, answer]) => {
      const question = this.findQuestionById(questionId);
      if (question && question.options) {
        const option = question.options.find(opt => opt.value === answer);
        if (option?.score) {
          totalScore += option.score;
          questionCount++;
        }
      }
    });

    const finalScore = questionCount > 0 ? Math.round((totalScore / (questionCount * 5)) * 100) : 50;

    return {
      score: finalScore,
      profile: this.getProfileFromScore(finalScore),
      biologicalAge: this.state.userProfile.age || 40,
      estimatedHealthspan: 85,
      priorities: [
        { biomarker: "Sommeil", priority: 1, actionableInsight: "Optimise ton sommeil" },
        { biomarker: "Activité", priority: 2, actionableInsight: "Augmente ton activité physique" },
        { biomarker: "Nutrition", priority: 3, actionableInsight: "Améliore ton alimentation" }
      ],
      recommendations: {
        immediate: ["Couche-toi 30 min plus tôt ce soir"],
        week1: ["Établis une routine de sommeil régulière"],
        month1: ["Optimise complètement ton hygiène de sommeil"]
      }
    };
  }

  renderResults(results) {
    const container = document.getElementById('results-container');
    if (!container) return;

    const html = `
      <div class="results-wrapper">
        <h1 class="results-title">Tes Résultats ORA Life</h1>
        
        <!-- Score Circle -->
        <div class="score-display">
          <div class="score-circle">
            <svg viewBox="0 0 200 200" class="score-svg">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#e0e0e0" stroke-width="20"/>
              <circle cx="100" cy="100" r="90" fill="none" 
                stroke="${this.getScoreColor(results.score)}" 
                stroke-width="20"
                stroke-dasharray="${results.score * 5.65} 565"
                transform="rotate(-90 100 100)"
                class="score-progress"/>
            </svg>
            <div class="score-value">
              <span class="score-number">${results.score}</span>
              <span class="score-max">/100</span>
            </div>
          </div>
        </div>

        <!-- Profile -->
        <div class="profile-section">
          <h2 class="profile-level" style="color: ${results.profile.color}">
            ${results.profile.emoji} ${results.profile.level}
          </h2>
          <p class="profile-description">${results.profile.description}</p>
        </div>

        <!-- Top 3 Priorités -->
        <div class="priorities-section">
          <h3>🎯 Tes 3 Priorités</h3>
          <div class="priorities-grid">
            ${results.priorities.map(p => `
              <div class="priority-card">
                <span class="priority-number">#${p.priority}</span>
                <h4>${p.biomarker}</h4>
                <p>${p.actionableInsight}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Protocole -->
        <div class="protocol-section">
          <h3>🚀 Ton Protocole Personnalisé</h3>
          <div class="timeline">
            <div class="timeline-item">
              <span class="timeline-marker">24h</span>
              <div class="timeline-content">
                <h4>Actions Immédiates</h4>
                <ul>${results.recommendations.immediate.map(r => `<li>${r}</li>`).join('')}</ul>
              </div>
            </div>
            <div class="timeline-item">
              <span class="timeline-marker">7j</span>
              <div class="timeline-content">
                <h4>Première Semaine</h4>
                <ul>${results.recommendations.week1.map(r => `<li>${r}</li>`).join('')}</ul>
              </div>
            </div>
            <div class="timeline-item">
              <span class="timeline-marker">30j</span>
              <div class="timeline-content">
                <h4>Premier Mois</h4>
                <ul>${results.recommendations.month1.map(r => `<li>${r}</li>`).join('')}</ul>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="cta-section">
          <h2>Prêt à Transformer Ta Vitalité ?</h2>
          <p>Reçois ton protocole complet personnalisé par email</p>
          
          <form id="email-form" class="email-capture">
            <input 
              type="email" 
              id="email-input"
              placeholder="ton@email.com" 
              class="email-input"
              required
            >
            <button type="submit" class="btn-primary">
              Recevoir Mon Protocole
            </button>
          </form>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.switchScreen('results');
    
    // Animation du score
    this.animateScore(results.score);
    
    // Setup email form
    this.setupEmailForm(results);
  }

  animateScore(targetScore) {
    const circle = document.querySelector('.score-progress');
    const numberEl = document.querySelector('.score-number');
    
    if (!circle || !numberEl) return;

    // Animation du cercle
    circle.style.strokeDashoffset = '565';
    setTimeout(() => {
      circle.style.transition = 'stroke-dashoffset 2s ease';
      circle.style.strokeDashoffset = '0';
    }, 100);

    // Animation du nombre
    let current = 0;
    const increment = targetScore / 40;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        current = targetScore;
        clearInterval(timer);
      }
      numberEl.textContent = Math.round(current);
    }, 50);
  }

  setupEmailForm(results) {
    const form = document.getElementById('email-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email-input').value;
      
      if (email) {
        this.state.userProfile.email = email;
        await this.sendToGoogleSheets({...results, email});
        this.showToast('✅ Protocole envoyé ! Check tes emails');
        form.style.display = 'none';
      }
    });
  }

  async sendToGoogleSheets(data) {
    try {
      const payload = {
        ...this.state.userProfile,
        ...this.state.answers,
        score: data.score,
        profile: data.profile?.level,
        timestamp: new Date().toISOString()
      };

      await fetch(this.googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Données envoyées à Google Sheets');
    } catch (error) {
      console.error('Erreur envoi Google Sheets:', error);
    }
  }

  // Méthodes Helper
  getCurrentQuestion() {
    let count = 0;
    for (const section of this.state.quizData.sections) {
      for (const question of section.questions) {
        if (count === this.state.currentQuestionIndex) {
          return question;
        }
        count++;
      }
    }
    return null;
  }

  getPreviousQuestion() {
    if (this.state.currentQuestionIndex === 0) return null;
    
    let count = 0;
    for (const section of this.state.quizData.sections) {
      for (const question of section.questions) {
        if (count === this.state.currentQuestionIndex - 1) {
          return question;
        }
        count++;
      }
    }
    return null;
  }

  findQuestionById(id) {
    for (const section of this.state.quizData.sections) {
      const question = section.questions.find(q => q.id === id);
      if (question) return question;
    }
    return null;
  }

  getTotalQuestions() {
    return this.state.quizData.sections.reduce(
      (total, section) => total + section.questions.length, 0
    );
  }

  updateProgress() {
    const total = this.getTotalQuestions();
    const current = this.state.currentQuestionIndex + 1;
    const percentage = (current / total) * 100;

    const fillEl = document.getElementById('progress-fill');
    const textEl = document.getElementById('progress-text');

    if (fillEl) {
      fillEl.style.width = `${percentage}%`;
    }

    if (textEl) {
      textEl.textContent = `Question ${current} sur ${total}`;
    }
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const question = this.getCurrentQuestion();

    if (prevBtn) {
      prevBtn.style.display = this.state.currentQuestionIndex > 0 ? 'block' : 'none';
    }

    if (nextBtn) {
      nextBtn.disabled = !this.state.answers[question?.id];
      
      const isLast = this.state.currentQuestionIndex >= this.getTotalQuestions() - 1;
      nextBtn.innerHTML = isLast ? 'Voir mes résultats →' : 'Suivant →';
    }
  }

  collectUserProfile() {
    this.state.userProfile = {
      age: this.state.answers.age || 40,
      gender: this.state.answers.gender || 'non-specifie',
      completionTime: Math.round((Date.now() - this.state.startTime) / 1000),
      timestamp: new Date().toISOString()
    };
  }

  getProfileFromScore(score) {
    if (score >= 90) {
      return {
        level: "Biohacker Elite",
        description: "Tu fais partie du top 1% en termes d'optimisation",
        color: "#00FF00",
        emoji: "🚀"
      };
    } else if (score >= 70) {
      return {
        level: "Optimisé",
        description: "Excellente base, quelques ajustements pour l'élite",
        color: "#7FFF00",
        emoji: "💪"
      };
    } else if (score >= 50) {
      return {
        level: "Potentiel",
        description: "Des bases solides avec un énorme potentiel inexploité",
        color: "#FFD700",
        emoji: "⚡"
      };
    } else if (score >= 30) {
      return {
        level: "À Risque",
        description: "Plusieurs signaux d'alarme, action recommandée",
        color: "#FF8C00",
        emoji: "⚠️"
      };
    } else {
      return {
        level: "Urgent",
        description: "Transformation urgente nécessaire pour ta santé",
        color: "#FF0000",
        emoji: "🆘"
      };
    }
  }

  getScoreColor(score) {
    if (score >= 80) return '#00FF00';
    if (score >= 60) return '#FFD700';
    if (score >= 40) return '#FF8C00';
    return '#FF0000';
  }

  getRiskEmoji(risk) {
    if (risk <= 0.8) return '🟢';
    if (risk <= 1.2) return '🟡';
    if (risk <= 1.5) return '🟠';
    return '🔴';
  }

  showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => toast.remove(), 3000);
  }

  showError(message) {
    const container = document.getElementById('quiz-container');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <p>${message}</p>
          <button onclick="location.reload()" class="btn-primary">Réessayer</button>
        </div>
      `;
    }
  }
}

// Initialisation
let quiz;
document.addEventListener('DOMContentLoaded', () => {
  quiz = new ORALifeQuiz();
});
