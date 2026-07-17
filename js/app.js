document.addEventListener('DOMContentLoaded', () => {
  initStylePreferences();
  initCanvasBackground();
});

// Leitura segura local
function safeGetLocalStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn("Acesso ao localStorage bloqueado pelo navegador:", error);
    return null;
  }
}

// Gravação segura local
function safeSetLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn("Acesso ao localStorage bloqueado pelo navegador:", error);
  }
}

// Inicializa preferências visuais
function initStylePreferences() {
  const bodyElement = document.body;
  const rootElement = document.documentElement;

  const btnThemeLight = document.getElementById('theme-light');
  const btnThemeDark = document.getElementById('theme-dark');
  const btnFontSans = document.getElementById('font-sans-btn');
  const btnFontMono = document.getElementById('font-mono-btn');

  const savedTheme = safeGetLocalStorage('portfolio-theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDarkMode ? 'dark' : 'light');
  }

  if (btnThemeLight && btnThemeDark) {
    btnThemeLight.addEventListener('click', () => applyTheme('light'));
    btnThemeDark.addEventListener('click', () => applyTheme('dark'));
  }

  // Aplica tema selecionado
  function applyTheme(theme) {
    if (theme === 'dark') {
      rootElement.classList.remove('theme-light');
      rootElement.classList.add('theme-dark');
      bodyElement.classList.remove('theme-light');
      bodyElement.classList.add('theme-dark');
      if (btnThemeDark) btnThemeDark.classList.add('active');
      if (btnThemeLight) btnThemeLight.classList.remove('active');
    } else {
      rootElement.classList.remove('theme-dark');
      rootElement.classList.add('theme-light');
      bodyElement.classList.remove('theme-dark');
      bodyElement.classList.add('theme-light');
      if (btnThemeLight) btnThemeLight.classList.add('active');
      if (btnThemeDark) btnThemeDark.classList.remove('active');
    }
    safeSetLocalStorage('portfolio-theme', theme);
  }

  const savedFont = safeGetLocalStorage('portfolio-font');
  if (savedFont) {
    applyFont(savedFont);
  } else {
    applyFont('sans');
  }

  if (btnFontSans && btnFontMono) {
    btnFontSans.addEventListener('click', () => applyFont('sans'));
    btnFontMono.addEventListener('click', () => applyFont('mono'));
  }

  // Aplica fonte selecionada
  function applyFont(fontStyle) {
    if (fontStyle === 'mono') {
      rootElement.classList.remove('font-sans');
      rootElement.classList.add('font-mono');
      bodyElement.classList.remove('font-sans');
      bodyElement.classList.add('font-mono');
      if (btnFontMono) btnFontMono.classList.add('active');
      if (btnFontSans) btnFontSans.classList.remove('active');
    } else {
      rootElement.classList.remove('font-mono');
      rootElement.classList.add('font-sans');
      bodyElement.classList.remove('font-mono');
      bodyElement.classList.add('font-sans');
      if (btnFontSans) btnFontSans.classList.add('active');
      if (btnFontMono) btnFontMono.classList.remove('active');
    }
    safeSetLocalStorage('portfolio-font', fontStyle);
  }
}

// Inicializa fundo animado
function initCanvasBackground() {
  const canvasElement = document.getElementById('canvas-bg');
  if (!canvasElement) return;

  const canvasContext = canvasElement.getContext('2d');
  let particleArray = [];
  let animationFrameId;

  const mousePosition = {
    x: null,
    y: null,
    radius: 120
  };

  // Redimensiona o canvas
  function resizeCanvas() {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
    setupParticles();
  }

  class Particle {
    // Inicializa a partícula
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.velocityX = (Math.random() - 0.5) * 0.35;
      this.velocityY = (Math.random() - 0.5) * 0.35;
      this.baseRadius = Math.random() * 1.5 + 0.5;
      this.currentRadius = this.baseRadius;
    }

    // Desenha a partícula
    draw() {
      const textColorHex = getComputedStyle(document.body).getPropertyValue('--c-text');
      canvasContext.fillStyle = textColorHex;
      canvasContext.beginPath();
      canvasContext.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
      canvasContext.closePath();
      canvasContext.fill();
    }

    // Atualiza a partícula
    update() {
      this.x += this.velocityX;
      this.y += this.velocityY;

      if (this.x < 0 || this.x > canvasElement.width) this.velocityX = -this.velocityX;
      if (this.y < 0 || this.y > canvasElement.height) this.velocityY = -this.velocityY;

      if (mousePosition.x !== null && mousePosition.y !== null) {
        const distanceX = mousePosition.x - this.x;
        const distanceY = mousePosition.y - this.y;
        const totalDistance = Math.hypot(distanceX, distanceY);

        if (totalDistance < mousePosition.radius) {
          this.currentRadius = this.baseRadius * (1 + (mousePosition.radius - totalDistance) / mousePosition.radius * 0.5);
          const forceFactor = (mousePosition.radius - totalDistance) / mousePosition.radius;
          this.x += (distanceX / totalDistance) * forceFactor * 0.6;
          this.y += (distanceY / totalDistance) * forceFactor * 0.6;
        } else {
          this.currentRadius = this.baseRadius;
        }
      } else {
        this.currentRadius = this.baseRadius;
      }

      this.draw();
    }
  }

  // Gera as partículas
  function setupParticles() {
    particleArray = [];
    const particleDensity = window.innerWidth < 768 ? 40 : 100;
    
    for (let i = 0; i < particleDensity; i++) {
      const initialX = Math.random() * canvasElement.width;
      const initialY = Math.random() * canvasElement.height;
      particleArray.push(new Particle(initialX, initialY));
    }
  }

  // Desenha as conexões
  function connectParticles() {
    const isDarkModeActive = document.body.classList.contains('theme-dark') || document.documentElement.classList.contains('theme-dark');
    const strokeColorRGB = isDarkModeActive ? '255, 255, 255' : '0, 0, 0';
    const connectionMaxDistance = 100;

    for (let a = 0; a < particleArray.length; a++) {
      for (let b = a + 1; b < particleArray.length; b++) {
        const distanceX = particleArray[a].x - particleArray[b].x;
        const distanceY = particleArray[a].y - particleArray[b].y;
        const totalDistance = Math.hypot(distanceX, distanceY);

        if (totalDistance < connectionMaxDistance) {
          const lineOpacity = (1 - totalDistance / connectionMaxDistance) * 0.15;
          canvasContext.strokeStyle = `rgba(${strokeColorRGB}, ${lineOpacity})`;
          canvasContext.lineWidth = 0.5;
          canvasContext.beginPath();
          canvasContext.moveTo(particleArray[a].x, particleArray[a].y);
          canvasContext.lineTo(particleArray[b].x, particleArray[b].y);
          canvasContext.stroke();
        }
      }

      if (mousePosition.x !== null && mousePosition.y !== null) {
        const distanceX = mousePosition.x - particleArray[a].x;
        const distanceY = mousePosition.y - particleArray[a].y;
        const totalDistance = Math.hypot(distanceX, distanceY);

        if (totalDistance < mousePosition.radius) {
          const lineOpacity = (1 - totalDistance / mousePosition.radius) * 0.55;
          canvasContext.strokeStyle = `rgba(${strokeColorRGB}, ${lineOpacity})`;
          canvasContext.lineWidth = 0.6;
          canvasContext.beginPath();
          canvasContext.moveTo(particleArray[a].x, particleArray[a].y);
          canvasContext.lineTo(mousePosition.x, mousePosition.y);
          canvasContext.stroke();
        }
      }
    }
  }

  // Loop de animação
  function animate() {
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].update();
    }
    connectParticles();
    animationFrameId = requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', (event) => {
    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mousePosition.x = null;
    mousePosition.y = null;
  });

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationFrameId);
    resizeCanvas();
    animate();
  });

  resizeCanvas();
  animate();
}
