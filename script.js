/**
 * S. Renik Mathew - Portfolio Interactive Scripts
 * Handles:
 * 1. Theme Toggling (CSS Media Query Detection + Manual Toggle)
 * 2. Left Vertical Sidebar Navigation (Mobile Drawer + Active Link Tracking)
 * 3. Retro 8-Bit NPC Companion Dialogue / Chat Simulation
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. THEME TOGGLING (CSS Media Query Detection + Manual Override)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeStatusText = document.getElementById('theme-status-text');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getSavedTheme() {
    return localStorage.getItem('portfolio-theme');
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-pressed', 'true');
        themeToggleBtn.setAttribute('title', 'Current: Night Mode (Click for Day Mode)');
      }
      if (themeStatusText) {
        themeStatusText.textContent = 'THEME: NIGHT';
      }
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-pressed', 'false');
        themeToggleBtn.setAttribute('title', 'Current: Day Mode (Click for Auto/System)');
      }
      if (themeStatusText) {
        themeStatusText.textContent = 'THEME: DAY';
      }
    } else {
      // System default detected via CSS Media Query
      document.documentElement.removeAttribute('data-theme');
      const isDark = systemPrefersDark.matches;
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        themeToggleBtn.setAttribute('title', isDark ? 'System Night (Click to override)' : 'System Day (Click to override)');
      }
      if (themeStatusText) {
        themeStatusText.textContent = isDark ? 'THEME: AUTO [NIGHT]' : 'THEME: AUTO [DAY]';
      }
    }
  }

  // Initial theme initialization
  const savedTheme = getSavedTheme();
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme('system');
  }

  // Listen to OS theme changes when in 'system' mode
  systemPrefersDark.addEventListener('change', () => {
    if (!getSavedTheme()) {
      applyTheme('system');
    }
  });

  // Cycle: [System Default] -> [Force Dark] -> [Force Light] -> [System Default]
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = getSavedTheme();
      if (!currentTheme) {
        const nextTheme = systemPrefersDark.matches ? 'light' : 'dark';
        localStorage.setItem('portfolio-theme', nextTheme);
        applyTheme(nextTheme);
      } else if (currentTheme === 'dark') {
        localStorage.setItem('portfolio-theme', 'light');
        applyTheme('light');
      } else {
        localStorage.removeItem('portfolio-theme');
        applyTheme('system');
      }
    });
  }

  /* ==========================================================================
     2. VERTICAL SIDEBAR NAVIGATION & MOBILE DRAWER
     ========================================================================== */
  const sidebar = document.getElementById('site-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  function openSidebar() {
    document.body.classList.add('sidebar-open');
    if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'true');
    // Set focus inside sidebar for accessibility
    const firstLink = sidebar ? sidebar.querySelector('.nav-link') : null;
    if (firstLink) firstLink.focus();
  }

  function closeSidebar() {
    document.body.classList.remove('sidebar-open');
    if (sidebarToggle) {
      sidebarToggle.setAttribute('aria-expanded', 'false');
      sidebarToggle.focus();
    }
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      const isOpen = document.body.classList.contains('sidebar-open');
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Close sidebar when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
      closeSidebar();
    }
  });

  // Close sidebar on link click (for mobile)
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        closeSidebar();
      }
    });
  });

  /* ==========================================================================
     3. ACTIVE SECTION TRACKING (INTERSECTION OBSERVER)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveLink(currentId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateActiveLink(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* ==========================================================================
     4. RETRO 8-BIT NPC COMPANION CHAT SIMULATION
     ========================================================================== */
  const chatMessages = document.getElementById('chat-messages-container');
  const chatForm = document.getElementById('pixel-chat-form');
  const chatInput = document.getElementById('chat-user-input');
  const promptChips = document.querySelectorAll('.pixel-chip');

  const botResponses = {
    stack: "Mathew's core inventory: TypeScript, Python, React, Next.js, Node.js, PostgreSQL, Docker, and AI/Machine Learning pipelines!",
    status: "STATUS: ACTIVE! Mathew is currently open to high-impact Full-Stack, AI, and Software Engineering opportunities.",
    projects: "Top quests completed: Cloud Analytics Dashboard (real-time metrics) and E-Commerce Microservices Engine (scalable event-driven architecture).",
    contact: "You can send an electronic owl directly to example@domain.com or use the contact form right below this chat terminal!",
    skills: "Mastery in full-stack web engineering, cloud distributed systems, relational & NoSQL databases, and machine learning models.",
    experience: "5+ years of programming experience, delivering resilient web systems and collaborating in agile squads."
  };

  function appendMessage(sender, text, isUser = false) {
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'chat-avatar';
    avatarDiv.setAttribute('aria-hidden', 'true');
    avatarDiv.textContent = isUser ? '👤' : '🤖';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'chat-bubble';

    const senderSpan = document.createElement('span');
    senderSpan.className = 'chat-sender';
    senderSpan.textContent = sender;

    const p = document.createElement('p');
    p.className = 'chat-text';
    p.textContent = text;

    bubbleDiv.appendChild(senderSpan);
    bubbleDiv.appendChild(p);
    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleBotReply(userInput) {
    const clean = userInput.toLowerCase();
    let reply = "Interesting query! Feel free to explore Mathew's projects, resume, or contact form for more details.";

    if (clean.includes('stack') || clean.includes('language') || clean.includes('tech')) {
      reply = botResponses.stack;
    } else if (clean.includes('work') || clean.includes('hire') || clean.includes('status') || clean.includes('open')) {
      reply = botResponses.status;
    } else if (clean.includes('project') || clean.includes('build')) {
      reply = botResponses.projects;
    } else if (clean.includes('contact') || clean.includes('email') || clean.includes('reach')) {
      reply = botResponses.contact;
    } else if (clean.includes('experience') || clean.includes('background')) {
      reply = botResponses.experience;
    } else if (clean.includes('skill')) {
      reply = botResponses.skills;
    }

    setTimeout(() => {
      appendMessage('BOT-MATHEW [V1.0]:', reply, false);
    }, 350);
  }

  // Handle preset chip clicks
  promptChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const promptKey = chip.getAttribute('data-prompt');
      const questionText = chip.textContent.replace(/^[^\w\s]+/, '').trim();
      
      appendMessage('YOU [PLAYER 1]:', questionText, true);
      const reply = botResponses[promptKey] || "Command received. Processing inquiry!";
      
      setTimeout(() => {
        appendMessage('BOT-MATHEW [V1.0]:', reply, false);
      }, 300);
    });
  });

  // Handle custom user form submissions
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = chatInput.value.trim();
      if (!val) return;

      appendMessage('YOU [PLAYER 1]:', val, true);
      chatInput.value = '';
      handleBotReply(val);
    });
  }

  /* ==========================================================================
     5. ABOUT ME: INTERACTIVE AVATAR SWITCHER (PIXEL <-> REAL PHOTO)
     ========================================================================== */
  const toggleAvatarBtn = document.getElementById('toggle-avatar-btn');
  const aboutProfileImg = document.getElementById('about-profile-img');
  const avatarModeLabel = document.getElementById('avatar-mode-label');

  const pixelAvatarSrc = 'pixel_avatar.jpg';
  const realPhotoSrc = 'WhatsApp Image 2026-10-07 at 10.13.35 AM.jpeg';

  if (toggleAvatarBtn && aboutProfileImg) {
    toggleAvatarBtn.addEventListener('click', () => {
      aboutProfileImg.style.opacity = '0';
      setTimeout(() => {
        const isCurrentPixel = aboutProfileImg.getAttribute('src') === pixelAvatarSrc;
        if (isCurrentPixel) {
          aboutProfileImg.setAttribute('src', realPhotoSrc);
          aboutProfileImg.setAttribute('alt', 'Photograph of S. Renik Mathew');
          if (avatarModeLabel) avatarModeLabel.textContent = 'VIEW PIXEL AVATAR';
        } else {
          aboutProfileImg.setAttribute('src', pixelAvatarSrc);
          aboutProfileImg.setAttribute('alt', '16-Bit Pixel Art Avatar of S. Renik Mathew');
          if (avatarModeLabel) avatarModeLabel.textContent = 'VIEW REAL PHOTO';
        }
        aboutProfileImg.style.opacity = '1';
      }, 150);
    });
  }

  /* ==========================================================================
     6. SKILLS SECTION: CATEGORY FILTERING & LIVE INSPECTOR HUD
     ========================================================================== */
  const skillTabs = document.querySelectorAll('.pixel-tab-btn');
  const skillCategoryCards = document.querySelectorAll('.skills-category-card');
  const skillItems = document.querySelectorAll('.skill-item');
  const inspectorHud = document.getElementById('skill-inspector-hud');
  const inspectorTitle = document.getElementById('inspector-title');
  const inspectorDesc = document.getElementById('inspector-desc');

  const defaultInspectorTitle = '> HOVER OR TAP ANY SKILL TO INSPECT ATTRIBUTES';
  const defaultInspectorDesc = "Explore Mathew's core stack. Hover over or tap any skill bar below to analyze proficiency level, use cases, and production experience.";

  // Filter Tab Logic
  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterVal = tab.getAttribute('data-filter');
      skillCategoryCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCat === filterVal) {
          card.classList.remove('hidden-category');
        } else {
          card.classList.add('hidden-category');
        }
      });
    });
  });

  // Skill Inspector HUD updates on hover / focus
  let inspectorResetTimeout = null;

  skillItems.forEach((item) => {
    function activateInspector() {
      if (inspectorResetTimeout) clearTimeout(inspectorResetTimeout);
      const skill = item.getAttribute('data-skill');
      const level = item.getAttribute('data-level');
      const desc = item.getAttribute('data-desc');

      if (inspectorTitle) inspectorTitle.textContent = `> INSPECTING: ${skill.toUpperCase()} [${level}]`;
      if (inspectorDesc) inspectorDesc.textContent = desc;
      if (inspectorHud) inspectorHud.classList.add('inspecting');
    }

    function deactivateInspector() {
      inspectorResetTimeout = setTimeout(() => {
        if (inspectorTitle) inspectorTitle.textContent = defaultInspectorTitle;
        if (inspectorDesc) inspectorDesc.textContent = defaultInspectorDesc;
        if (inspectorHud) inspectorHud.classList.remove('inspecting');
      }, 400);
    }

    item.addEventListener('mouseenter', activateInspector);
    item.addEventListener('focus', activateInspector);
    item.addEventListener('mouseleave', deactivateInspector);
    item.addEventListener('blur', deactivateInspector);
  });

  /* ==========================================================================
     7. VIDEO SHOWREEL — Play/Pause, Progress Bar, Mute, Fullscreen,
        & IntersectionObserver auto-pause
     ==========================================================================
     HOW THE THUMBNAIL → DETAIL CONNECTION WORKS:
       - The <video id="showreel-video"> is the "thumbnail" / embedded player.
       - #video-play-btn is the clickable trigger that connects the user's
         intent (click) to the detail (the playing video itself).
       - The frame's .is-playing CSS class drives all visual state changes
         (icon swap, brightness, button visibility) without extra JS queries.
       - The IntersectionObserver acts as an auto-pause guardian: when the
         video frame leaves the viewport the video stops, saving bandwidth
         and CPU — it resumes only when the user scrolls back.
     ========================================================================== */

  const showreelVideo     = document.getElementById('showreel-video');
  const showreelFrame     = document.getElementById('showreel-frame');
  const videoPlayBtn      = document.getElementById('video-play-btn');
  const videoProgressBar  = document.getElementById('video-progress-bar');
  const videoMuteBtn      = document.getElementById('video-mute-btn');
  const videoFullscreenBtn = document.getElementById('video-fullscreen-btn');

  // Only run if the showreel section exists on the page
  if (showreelVideo && showreelFrame && videoPlayBtn) {

    /* ------------------------------------------------------------------
       PLAY / PAUSE TOGGLE
       1. Click #video-play-btn → call togglePlayback().
       2. Clicking directly on the video also toggles (common UX pattern).
       3. .is-playing on the frame drives all CSS icon/brightness changes.
    ------------------------------------------------------------------ */
    function setPlayingState(isPlaying) {
      if (isPlaying) {
        showreelFrame.classList.add('is-playing');
        videoPlayBtn.setAttribute('aria-pressed', 'true');
        videoPlayBtn.setAttribute('aria-label', 'Pause showreel video');
      } else {
        showreelFrame.classList.remove('is-playing');
        videoPlayBtn.setAttribute('aria-pressed', 'false');
        videoPlayBtn.setAttribute('aria-label', 'Play showreel video');
      }
    }

    function togglePlayback() {
      if (showreelVideo.paused) {
        showreelVideo.play();
        setPlayingState(true);
      } else {
        showreelVideo.pause();
        setPlayingState(false);
      }
    }

    // Primary: custom pixel play button
    videoPlayBtn.addEventListener('click', togglePlayback);

    // Secondary: clicking directly on the video element also toggles
    showreelVideo.addEventListener('click', togglePlayback);

    // Sync state if video ends naturally (loop=true so this rarely fires,
    // but included for completeness if loop is ever removed)
    showreelVideo.addEventListener('ended', () => setPlayingState(false));

    /* ------------------------------------------------------------------
       LIVE PROGRESS BAR
       On every timeupdate event, calculate percentage played and set
       the bar width directly. Smooth via CSS transition on .video-progress-bar.
    ------------------------------------------------------------------ */
    showreelVideo.addEventListener('timeupdate', () => {
      if (!showreelVideo.duration) return;
      const pct = (showreelVideo.currentTime / showreelVideo.duration) * 100;
      if (videoProgressBar) videoProgressBar.style.width = pct + '%';
    });

    /* ------------------------------------------------------------------
       MUTE TOGGLE
       The video starts muted (HTML attribute). Clicking #video-mute-btn
       flips the muted property and updates the button label + icon.
    ------------------------------------------------------------------ */
    if (videoMuteBtn) {
      videoMuteBtn.addEventListener('click', () => {
        showreelVideo.muted = !showreelVideo.muted;
        const isMuted = showreelVideo.muted;

        // Update aria state
        videoMuteBtn.setAttribute('aria-pressed', isMuted ? 'true' : 'false');

        // Toggle CSS class that CSS uses to swap label text via ::before
        videoMuteBtn.classList.toggle('is-unmuted', !isMuted);

        // Directly update the label text and icon for clarity
        const label = videoMuteBtn.querySelector('.ctrl-btn-label');
        const icon  = videoMuteBtn.querySelector('.mute-icon');
        if (label) label.textContent = isMuted ? 'MUTED' : 'SOUND ON';
        if (icon)  icon.textContent  = isMuted ? '🔇' : '🔊';
      });
    }

    /* ------------------------------------------------------------------
       FULLSCREEN (with vendor prefix fallback for Safari)
       Requests fullscreen on the .video-ratio-box so the pixel frame
       is NOT included in fullscreen — pure video canvas only.
    ------------------------------------------------------------------ */
    if (videoFullscreenBtn) {
      videoFullscreenBtn.addEventListener('click', () => {
        const target = showreelVideo; // fullscreen the <video> itself
        if (target.requestFullscreen) {
          target.requestFullscreen();
        } else if (target.webkitRequestFullscreen) {
          target.webkitRequestFullscreen(); // Safari
        } else if (target.mozRequestFullScreen) {
          target.mozRequestFullScreen();    // Old Firefox
        }
      });
    }

    /* ------------------------------------------------------------------
       INTERSECTIONOBSERVER — AUTO-PAUSE ON SCROLL OUT
       When less than 20% of the showreel frame is visible in the viewport
       the video automatically pauses. This is battery/bandwidth friendly
       and avoids audio playing off-screen.
       The video does NOT auto-resume on scroll-back — user must click play.
    ------------------------------------------------------------------ */
    if ('IntersectionObserver' in window) {
      const showreelObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting && !showreelVideo.paused) {
              // Video is scrolled off-screen — pause it
              showreelVideo.pause();
              setPlayingState(false);
            }
          });
        },
        { threshold: 0.2 } // fire when < 20% visible
      );
      showreelObserver.observe(showreelFrame);
    }

  }
  /* end showreel block */

});
