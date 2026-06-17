(function() {
    'use strict';

    // ─── Interactive Map Zones Data ───
    // To add more zones, simply add a new key here with top/left percentage coordinates and type ("red" or "green")
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
            },
            top: 76.2,
            left: 42.1,
            type: "red"
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
            },
            top: 79,
            left: 48,
            type: "green"
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
            },
            top: 81,
            left: 51,
            type: "green"
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
            },
            top: 82,
            left: 49,
            type: "green"
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
            },
            top: 38,
            left: 22,
            type: "red"
        }
    };

    const mapImageWrapper = document.getElementById('mapImageWrapper');
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
        const hotspots = document.querySelectorAll('.map-hotspot');
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

    // Function to render all hotspots dynamically from mapZonesData
    function renderHotspots() {
        if (!mapImageWrapper) return;
        
        // Remove existing hotspots (but keep the map image)
        const existingHotspots = mapImageWrapper.querySelectorAll('.map-hotspot');
        existingHotspots.forEach(h => h.remove());

        // Create new hotspots
        Object.keys(mapZonesData).forEach(zoneId => {
            const zone = mapZonesData[zoneId];
            
            const hotspotEl = document.createElement('div');
            hotspotEl.className = `map-hotspot hotspot-${zone.type || 'green'}`;
            hotspotEl.style.top = `${zone.top}%`;
            hotspotEl.style.left = `${zone.left}%`;
            hotspotEl.setAttribute('data-id', zoneId);
            
            hotspotEl.innerHTML = `
                <span class="hotspot-pulse"></span>
                <span class="hotspot-core"></span>
                <div class="hotspot-tooltip">${zone.name}</div>
            `;
            
            // Add click listener
            hotspotEl.addEventListener('click', () => {
                selectZone(zoneId);
            });
            
            mapImageWrapper.appendChild(hotspotEl);
        });
    }

    // Initialize map
    renderHotspots();

    // Select Jewelry by default on load
    if (mapZonesData.jewelry) {
        selectZone('jewelry');
    }
})();
