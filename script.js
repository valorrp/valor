(function() {
    'use strict';
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) loader.classList.add('hidden');
            setTimeout(() => loader && loader.remove(), 700);
        }, 1400);
    });
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            menuToggle.classList.toggle('open');
        });
        sidebar.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                    menuToggle.classList.remove('open');
                }
            });
        });
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                menuToggle.classList.remove('open');
            }
        });
    }
    const sections = document.querySelectorAll('main>section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 120;
        let current = '';
        sections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                current = section.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink, {
        passive: true
    });
    updateActiveLink();
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const top = target.getBoundingClientRect().top + window.scrollY - 30;
                    window.scrollTo({
                        top,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    const counters = document.querySelectorAll('[data-count]:not(#livePlayersCount)');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        countersStarted = true;
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10);
            const suffix = counter.parentElement.querySelector('[data-suffix]')?.dataset.suffix || '';
            const duration = 1800;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(eased * target);
                counter.textContent = value + (progress === 1 && suffix ? '' : '');
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.disconnect();
            }
        });
    }, {
        threshold: 0.3
    });
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) heroObserver.observe(heroStats);
    const revealEls = document.querySelectorAll('.rule,.concept,.price-card,.robbery-card,.duration-card,.info-box,.ct-row,.section-head');
    revealEls.forEach(el => el.classList.add('reveal'));
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = Math.random() * 80;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });
    revealEls.forEach(el => revealObserver.observe(el));
    const backTop = document.getElementById('backTop');
    if (backTop) {
        backTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            menuToggle.classList.remove('open');
        }
    });
    const toast = document.getElementById('toast');
    let toastTimeout = null;

    function showToast(message) {
        if (!toast) return;
        const text = toast.querySelector('.toast-text');
        if (text && message) text.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise((resolve, reject) => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                resolve();
            } catch (err) {
                document.body.removeChild(textArea);
                reject(err);
            }
        });
    }
    document.querySelectorAll('.rule-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const hash = link.getAttribute('data-copy') || link.getAttribute('href');
            if (!hash) return;
            const fullUrl = window.location.origin + window.location.pathname + hash;
            const target = document.querySelector(hash);
            if (target) {
                history.replaceState(null, '', hash);
                const top = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({
                    top,
                    behavior: 'smooth'
                });
            }
            copyToClipboard(fullUrl).then(() => {
                link.classList.add('copied');
                link.textContent = '✓';
                showToast('تم نسخ رابط القانون');
                setTimeout(() => {
                    link.classList.remove('copied');
                    link.textContent = '#';
                }, 1600);
            }).catch(() => {
                showToast('تعذر نسخ الرابط');
            });
        });
    });
    if (window.location.hash) {
        const navEntries = performance.getEntriesByType('navigation');
        const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';

        if (isReload) {
            history.replaceState(null, '', window.location.pathname);
        } else {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    const top = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({
                        top,
                        behavior: 'smooth'
                    });
                }
            }, 1600);
        }
    }
    const searchInput = document.getElementById('rulesSearch');
    if (searchInput) {
        const searchableItems = document.querySelectorAll('.rule,.concept,.price-card,.robbery-card,.duration-card,.info-box');
        const sectionsList = document.querySelectorAll('main>section');

        function normalizeArabic(text) {
            return text.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/[ًٌٍَُِّ~]/g, '').trim();
        }
        searchInput.addEventListener('input', (e) => {
            const query = normalizeArabic(e.target.value);
            if (query === '') {
                searchableItems.forEach(item => item.classList.remove('hidden-search'));
                sectionsList.forEach(sec => sec.classList.remove('hidden-search'));
                return;
            }
            searchableItems.forEach(item => {
                const text = normalizeArabic(item.innerText || item.textContent);
                if (text.includes(query)) {
                    item.classList.remove('hidden-search');
                } else {
                    item.classList.add('hidden-search');
                }
            });
            sectionsList.forEach(section => {
                if (section.id === 'intro') return;
                const visibleItems = section.querySelectorAll('.rule:not(.hidden-search),.concept:not(.hidden-search),.price-card:not(.hidden-search),.robbery-card:not(.hidden-search),.duration-card:not(.hidden-search),.info-box:not(.hidden-search)');
                if (visibleItems.length === 0) {
                    section.classList.add('hidden-search');
                } else {
                    section.classList.remove('hidden-search');
                }
            });
        });
    }
    const openStaffApp = document.getElementById('openStaffApp');
    const openGangApp = document.getElementById('openGangApp');
    const staffModal = document.getElementById('staffModal');
    const gangModal = document.getElementById('gangModal');
    const closeStaffModal = document.getElementById('closeStaffModal');
    const closeGangModal = document.getElementById('closeGangModal');
    const cancelStaffBtn = document.getElementById('cancelStaffBtn');
    const cancelGangBtn = document.getElementById('cancelGangBtn');
    const staffAgreeCheckbox = document.getElementById('staffAgreeCheckbox');
    const gangAgreeCheckbox = document.getElementById('gangAgreeCheckbox');
    const submitStaffBtn = document.getElementById('submitStaffBtn');
    const submitGangBtn = document.getElementById('submitGangBtn');

    function openModal(modal) {
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modal, checkbox, submitBtn) {
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
            if (checkbox && submitBtn) {
                checkbox.checked = false;
                submitBtn.classList.add('disabled');
            }
        }
    }
    if (openStaffApp && staffModal) {
        openStaffApp.addEventListener('click', () => openModal(staffModal));
        closeStaffModal.addEventListener('click', () => closeModal(staffModal, staffAgreeCheckbox, submitStaffBtn));
        cancelStaffBtn.addEventListener('click', () => closeModal(staffModal, staffAgreeCheckbox, submitStaffBtn));
        staffAgreeCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                submitStaffBtn.classList.remove('disabled');
            } else {
                submitStaffBtn.classList.add('disabled');
            }
        });
    }
    if (openGangApp && gangModal) {
        openGangApp.addEventListener('click', () => openModal(gangModal));
        closeGangModal.addEventListener('click', () => closeModal(gangModal, gangAgreeCheckbox, submitGangBtn));
        cancelGangBtn.addEventListener('click', () => closeModal(gangModal, gangAgreeCheckbox, submitGangBtn));
        gangAgreeCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                submitGangBtn.classList.remove('disabled');
            } else {
                submitGangBtn.classList.add('disabled');
            }
        });
    }
    window.addEventListener('click', (e) => {
        if (e.target === staffModal) {
            closeModal(staffModal, staffAgreeCheckbox, submitStaffBtn);
        }
        if (e.target === gangModal) {
            closeModal(gangModal, gangAgreeCheckbox, submitGangBtn);
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (staffModal && staffModal.classList.contains('open')) {
                closeModal(staffModal, staffAgreeCheckbox, submitStaffBtn);
            }
            if (gangModal && gangModal.classList.contains('open')) {
                closeModal(gangModal, gangAgreeCheckbox, submitGangBtn);
            }
        }
    });

    // ─── Discord Guild Widget Status (الحالة الحقيقية لطاقم الإدارة) ───
    const guildId = '1480974725592252712';
    const staffCards = document.querySelectorAll('.staff-card');

    function removeUnicodeFormatting(str) {
        if (!str) return '';
        return str.replace(/[\uD835][\uDC00-\uDFFF]/g, (char) => {
            const code = char.codePointAt(0);
            let offset = 0;
            if (code >= 0x1D400 && code <= 0x1D419) offset = code - 0x1D400 + 65; // Bold A-Z
            else if (code >= 0x1D41A && code <= 0x1D433) offset = code - 0x1D41A + 97; // Bold a-z
            else if (code >= 0x1D434 && code <= 0x1D44D) offset = code - 0x1D434 + 65; // Italic A-Z
            else if (code >= 0x1D44E && code <= 0x1D467) offset = code - 0x1D44E + 97; // Italic a-z
            else if (code >= 0x1D468 && code <= 0x1D481) offset = code - 0x1D468 + 65; // Bold Italic A-Z
            else if (code >= 0x1D482 && code <= 0x1D49B) offset = code - 0x1D482 + 97; // Bold Italic a-z
            else if (code >= 0x1D49C && code <= 0x1D4B5) offset = code - 0x1D49C + 65; // Script A-Z
            else if (code >= 0x1D4B6 && code <= 0x1D4CF) offset = code - 0x1D4B6 + 97; // Script a-z
            else if (code >= 0x1D4D0 && code <= 0x1D4E9) offset = code - 0x1D4D0 + 65; // Bold Script A-Z
            else if (code >= 0x1D4EA && code <= 0x1D503) offset = code - 0x1D4EA + 97; // Bold Script a-z
            else if (code >= 0x1D504 && code <= 0x1D51D) offset = code - 0x1D504 + 65; // Fraktur A-Z
            else if (code >= 0x1D51E && code <= 0x1D537) offset = code - 0x1D51E + 97; // Fraktur a-z
            else if (code >= 0x1D538 && code <= 0x1D551) offset = code - 0x1D538 + 65; // Double-struck A-Z
            else if (code >= 0x1D552 && code <= 0x1D56B) offset = code - 0x1D552 + 97; // Double-struck a-z
            else if (code >= 0x1D56C && code <= 0x1D585) offset = code - 0x1D56C + 65; // Bold Fraktur A-Z
            else if (code >= 0x1D586 && code <= 0x1D59F) offset = code - 0x1D586 + 97; // Bold Fraktur a-z
            else if (code >= 0x1D5A0 && code <= 0x1D5B9) offset = code - 0x1D5A0 + 65; // Sans-serif A-Z
            else if (code >= 0x1D5BA && code <= 0x1D5D3) offset = code - 0x1D5BA + 97; // Sans-serif a-z
            else if (code >= 0x1D5D4 && code <= 0x1D5ED) offset = code - 0x1D5D4 + 65; // Sans-serif Bold A-Z
            else if (code >= 0x1D5EE && code <= 0x1D607) offset = code - 0x1D5EE + 97; // Sans-serif Bold a-z
            else if (code >= 0x1D608 && code <= 0x1D621) offset = code - 0x1D608 + 65; // Sans-serif Italic A-Z
            else if (code >= 0x1D622 && code <= 0x1D63B) offset = code - 0x1D622 + 97; // Sans-serif Italic a-z
            else if (code >= 0x1D63C && code <= 0x1D655) offset = code - 0x1D63C + 65; // Sans-serif Bold Italic A-Z
            else if (code >= 0x1D656 && code <= 0x1D66F) offset = code - 0x1D656 + 97; // Sans-serif Bold Italic a-z
            else if (code >= 0x1D670 && code <= 0x1D689) offset = code - 0x1D670 + 65; // Monospace A-Z
            else if (code >= 0x1D68A && code <= 0x1D6A3) offset = code - 0x1D68A + 97; // Monospace a-z
            return offset ? String.fromCharCode(offset) : char;
        });
    }

    function cleanName(str) {
        if (!str) return '';
        let normalized = removeUnicodeFormatting(str).toLowerCase();
        // إزالة الرموز الخاصة وعلامات الترقيم والرموز التعبيرية والمسافات
        normalized = normalized.replace(/[^a-z0-9\u0600-\u06FF]/g, '');
        // إزالة بادئة va الشائعة في السيرفر إذا بدأت بها الكلمة
        if (normalized.startsWith('va')) {
            normalized = normalized.slice(2);
        }
        return normalized;
    }

    async function updateStaffStatus() {
        try {
            const response = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json?_t=${Date.now()}`);
            if (!response.ok) return;
            const data = await response.json();
            
            if (staffCards.length > 0 && data.members) {
                // تبسيط أسماء الأعضاء المتصلين بالإنترنت مع حفظ حالتهم الفردية
                const onlineMembersCleaned = data.members.map(m => ({
                    id: String(m.id),
                    usernameCleaned: cleanName(m.username),
                    originalUsername: String(m.username).toLowerCase(),
                    status: String(m.status || 'online').toLowerCase()
                }));

                staffCards.forEach(card => {
                    const idAttr = card.getAttribute('data-discord-id');
                    const usernameAttr = card.getAttribute('data-discord-username');
                    const cardName = card.querySelector('h4')?.textContent;
                    const statusEl = card.querySelector('.staff-status');
                    if (!statusEl) return;

                    const cardId = idAttr ? idAttr.trim() : '';
                    const dispNameCleaned = cleanName(cardName);
                    
                    // استخراج الكلمات المفتاحية لاسم الديسكورد من الكارد
                    const usernames = usernameAttr 
                        ? usernameAttr.split(',').map(u => cleanName(u.trim())).filter(u => u !== '')
                        : [];
                    
                    if (dispNameCleaned) {
                        usernames.push(dispNameCleaned);
                    }

                    // التحقق مما إذا كان العضو متصلاً وحفظ بياناته
                    let isOnline = false;
                    let matchedMember = null;
                    
                    for (const member of onlineMembersCleaned) {
                        // 1. مطابقة المعرف الرقمي إذا وجد وكان الـ API يرجعه كخيار أول
                        if (cardId && member.id === cardId) {
                            isOnline = true;
                            matchedMember = member;
                            break;
                        }
                        
                        // 2. مطابقة مرنة ومبسطة لاسم المستخدم والاسم المعروض
                        for (const targetUser of usernames) {
                            if (!targetUser) continue;
                            
                            // إذا كان أحد الأسماء قصيراً جداً (أقل من حرفين)، نستخدم التطابق التام
                            if (targetUser.length < 2 || member.usernameCleaned.length < 2) {
                                if (member.usernameCleaned === targetUser || member.originalUsername === targetUser) {
                                    isOnline = true;
                                    matchedMember = member;
                                    break;
                                }
                            } else {
                                // وإلا نستخدم المطابقة الجزئية
                                if (
                                    member.usernameCleaned.includes(targetUser) || 
                                    targetUser.includes(member.usernameCleaned) ||
                                    member.originalUsername.includes(targetUser)
                                ) {
                                    isOnline = true;
                                    matchedMember = member;
                                    break;
                                }
                            }
                        }
                        if (isOnline) break;
                    }

                    if (isOnline && matchedMember) {
                        const statusKey = matchedMember.status;
                        if (statusKey === 'dnd') {
                            statusEl.textContent = 'Do Not Disturb';
                            statusEl.style.color = '#ff4655'; // أحمر نيون
                        } else if (statusKey === 'idle') {
                            statusEl.textContent = 'Idle';
                            statusEl.style.color = 'var(--gold)'; // ذهبي نيون
                        } else {
                            statusEl.textContent = 'Online';
                            statusEl.style.color = 'var(--emerald)'; // أخضر نيون
                        }
                    } else {
                        statusEl.textContent = 'Offline';
                        statusEl.style.color = 'var(--text-muted)';
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching Discord widget status:', error);
        }
    }

    updateStaffStatus();
    setInterval(updateStaffStatus, 30000);
})();
