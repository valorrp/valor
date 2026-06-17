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

    // ─── Interactive Map Zones Data ───
    const mapZonesData = {
        jewelry: {
            name: "موقع المجوهرات",
            badge: "منطقة حمراء",
            badgeClass: "badge-red",
            coords: "مربع: 7251",
            image: "https://media.discordapp.net/attachments/1480976637561540668/1490091134242914435/image.png?ex=6a33b142&is=6a325fc2&hm=9c69958bc518c2d5482c57aea8b84853e3341cde5c2deda37b4f2023ae52eb68&=&format=webp&quality=lossless",
            cops: "13",
            crims: "10",
            weapons: ["Combat Pistol", "MK2 Pistol", "Heavy Pistol"],
            rules: {
                red: "منقطة مجرمين ويمنع على المجرمين تجاوزها - في حال تجاوزها يتم خطفه - يُمنع على العسكري الذهاب لحدود العصابة في حال تجاوزها يحق لهم خطفه",
                blue: "منقطة تفاوض ويسمح فقط بالتواجد فيها من يريد التفاوض (شخص واحد فقط من طرف العصابات - وشخص واحد فقط من طرف الوزارات)",
                green: "منقطة عساكر ويمنع على العساكر تجاوزها - في حال تجاوزها يتم استبعاده - يُمنع على عضو العصابة الذهاب لحدود العساكر"
            }
        },
        pillbox: {
            name: "مستشفى بيليبوكس المركزي",
            badge: "منطقة آمنة",
            badgeClass: "badge-green",
            coords: "وسط لوس سانتوس",
            image: "",
            cops: "غير محدود",
            crims: "يُمنع التواجد الجنائي المسلح",
            weapons: ["الدفاع عن النفس فقط"],
            rules: {
                red: "لا يُسمح بأي نشاط عدائي أو قتال في حرم المستشفى نهائياً.",
                blue: "منطقة حظر جنائي كاملة ويمنع خطف الأطباء أو المرضى.",
                green: "يُمنع على الجهات الأمنية إطلاق النار أو الاعتقال العنيف داخل المبنى إلا للضرورة القصوى."
            }
        },
        missionrow: {
            name: "مركز الشرطة الرئيسي (Mission Row)",
            badge: "منطقة آمنة عسكرية",
            badgeClass: "badge-green",
            coords: "وسط لوس سانتوس",
            image: "",
            cops: "مقر رئيسي",
            crims: "يُمنع الهجوم المنفرد",
            weapons: ["جميع الأسلحة المصرحة للعساكر"],
            rules: {
                red: "يُمنع منعاً باتاً هجوم العصابات على المركز بدون سيناريو معتمد رسمياً ومسبقاً من الإدارة.",
                blue: "منطقة تفاوض آمنة عند تسليم أنفسهم أو طلب تسوية قانونية.",
                green: "يُسمح للعساكر بالدفاع الكامل واستخدام القوة المميتة داخل المركز وحرمه."
            }
        },
        legion: {
            name: "ساحة الليجن سكوير (Legion Square)",
            badge: "منطقة آمنة عامة",
            badgeClass: "badge-green",
            coords: "وسط لوس سانتوس",
            image: "",
            cops: "دورية مستمرة",
            crims: "يُمنع القتل والخطف",
            weapons: ["يُمنع إشهار السلاح"],
            rules: {
                red: "يُمنع القتل أو الخطف تماماً في هذه الساحة كونها نقطة تجمع عامة للاعبين الجدد.",
                blue: "يُسمح بالتجمع السلمي والتواصل الاجتماعي فقط OOC و IC.",
                green: "تعتبر منطقة تحت الحماية المدنية العالية ويُعاقب بشدة من يثير الفوضى فيها."
            }
        },
        fortzancudo: {
            name: "قاعدة فورت زانكودو العسكرية (Fort Zancudo)",
            badge: "منطقة محظورة عالية الخطورة",
            badgeClass: "badge-red",
            coords: "الساحل الغربي",
            image: "",
            cops: "حراسة مشددة",
            crims: "خطر الموت",
            weapons: ["جميع أنواع الأسلحة الثقيلة"],
            rules: {
                red: "منطقة عسكرية حمراء يُطلق النار فيها فوراً دون تحذير على أي دخيل أو طائرة غير مصرح لها.",
                blue: "يُمنع التفاوض نهائياً داخل حدود القاعدة العسكرية.",
                green: "تخضع لسيطرة الجيش وزارة الدفاع بالكامل ويحق لهم تصفية أي شخص يتجاوز الحدود."
            }
        }
    };

    const hotspots = document.querySelectorAll('.map-hotspot');
    const cardEmptyState = document.getElementById('cardEmptyState');
    const cardContent = document.getElementById('cardContent');
    const zoneBadge = document.getElementById('zoneBadge');
    const zoneName = document.getElementById('zoneName');
    const zoneCoords = document.getElementById('zoneCoords');
    const zoneImage = document.getElementById('zoneImage');
    const zoneMediaContainer = document.getElementById('zoneMediaContainer');
    const copCount = document.getElementById('copCount');
    const crimCount = document.getElementById('crimCount');
    const allowedWeapons = document.getElementById('allowedWeapons');
    const redZoneRules = document.getElementById('redZoneRules');
    const blueZoneRules = document.getElementById('blueZoneRules');
    const greenZoneRules = document.getElementById('greenZoneRules');
    const ruleRedContainer = document.getElementById('ruleRedContainer');
    const ruleBlueContainer = document.getElementById('ruleBlueContainer');
    const ruleGreenContainer = document.getElementById('ruleGreenContainer');

    function selectZone(zoneId) {
        const zone = mapZonesData[zoneId];
        if (!zone) return;

        // Toggle active hotspot class
        hotspots.forEach(h => {
            if (h.getAttribute('data-id') === zoneId) {
                h.classList.add('active');
            } else {
                h.classList.remove('active');
            }
        });

        // Hide empty state and show content
        if (cardEmptyState) cardEmptyState.classList.add('hidden');
        if (cardContent) cardContent.classList.remove('hidden');

        // Set text content
        if (zoneName) zoneName.textContent = zone.name;
        if (zoneCoords) zoneCoords.textContent = zone.coords;
        if (copCount) copCount.textContent = zone.cops;
        if (crimCount) crimCount.textContent = zone.crims;

        // Set badge class & text
        if (zoneBadge) {
            zoneBadge.className = `zone-badge ${zone.badgeClass}`;
            zoneBadge.textContent = zone.badge;
        }

        // Handle Image
        if (zoneImage && zoneMediaContainer) {
            if (zone.image) {
                zoneImage.src = zone.image;
                zoneMediaContainer.style.display = 'block';
            } else {
                zoneMediaContainer.style.display = 'none';
            }
        }

        // Allowed weapons tags
        if (allowedWeapons) {
            allowedWeapons.innerHTML = '';
            zone.weapons.forEach(w => {
                const tag = document.createElement('span');
                tag.className = 'weapon-tag';
                tag.textContent = w;
                allowedWeapons.appendChild(tag);
            });
        }

        // Rules
        if (redZoneRules && ruleRedContainer) {
            if (zone.rules.red) {
                redZoneRules.textContent = zone.rules.red;
                ruleRedContainer.style.display = 'flex';
            } else {
                ruleRedContainer.style.display = 'none';
            }
        }

        if (blueZoneRules && ruleBlueContainer) {
            if (zone.rules.blue) {
                blueZoneRules.textContent = zone.rules.blue;
                ruleBlueContainer.style.display = 'flex';
            } else {
                ruleBlueContainer.style.display = 'none';
            }
        }

        if (greenZoneRules && ruleGreenContainer) {
            if (zone.rules.green) {
                greenZoneRules.textContent = zone.rules.green;
                ruleGreenContainer.style.display = 'flex';
            } else {
                ruleGreenContainer.style.display = 'none';
            }
        }
    }

    // Add click listeners to hotspots
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            const zoneId = hotspot.getAttribute('data-id');
            selectZone(zoneId);
        });
    });

    // Select Jewelry by default on load
    if (mapZonesData.jewelry) {
        selectZone('jewelry');
    }

    // ─── Discord Guild Widget Status (الحالة الحقيقية لطاقم الإدارة) ───
    const guildId = '1480974725592252712';
    const staffCards = document.querySelectorAll('.staff-card');

    async function updateStaffStatus() {
        try {
            const response = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json?_t=${Date.now()}`);
            if (!response.ok) return;
            const data = await response.json();
            
            if (staffCards.length > 0) {
                // استخراج قائمة أسماء الأعضاء المتصلين بالإنترنت (بالحروف الصغيرة لمقارنة غير حساسة للأحرف)
                const onlineUsernames = new Set((data.members || []).map(m => String(m.username).toLowerCase()));

                staffCards.forEach(card => {
                    const usernameAttr = card.getAttribute('data-discord-username');
                    const cardName = card.querySelector('h4')?.textContent;
                    const statusEl = card.querySelector('.staff-status');
                    if (!statusEl) return;

                    const username = usernameAttr ? usernameAttr.trim().toLowerCase() : '';
                    const dispName = cardName ? cardName.trim().toLowerCase() : '';

                    if ((username && onlineUsernames.has(username)) || (dispName && onlineUsernames.has(dispName))) {
                        statusEl.textContent = 'متصل';
                        statusEl.style.color = 'var(--emerald)';
                    } else {
                        statusEl.textContent = 'غير متصل';
                        statusEl.style.color = 'var(--text-muted)';
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching Discord widget status:', error);
        }
    }

    updateStaffStatus();
    setInterval(updateStaffStatus, 120000);
})();
