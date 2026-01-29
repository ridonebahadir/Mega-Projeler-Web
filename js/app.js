/**
 * MEGA PROJELER Kiosk Logic
 */

// Project Data
const PROJECT_DATA = {
    canakkale: {
        id: 'canakkale',
        title: '1915 Çanakkale Köprüsü',
        type: 'KÖPRÜ',
        metrics: {
            'Ana Açıklık': '2,023 m',
            'Kule Yüksekliği': '318 m',
            'Toplam Uzunluk': '4,608 m'
        },
        description: "1915 Çanakkale Köprüsü, Çanakkale Boğazı'nın iki yakasını birbirine bağlayan, dünyanın en uzun asma köprüsüdür. Cumhuriyet'in 100. yılına ithafen 2023 metre orta açıklığı simgelemektedir.",
        image: 'assets/project_canakkale_bridge_1769107033076.png'
    },
    yavuz: {
        id: 'yavuz',
        title: 'Yavuz Sultan Selim Köprüsü',
        type: 'KÖPRÜ',
        metrics: {
            'Ana Açıklık': '1,408 m',
            'Kule Yüksekliği': '322 m',
            'Genişlik': '59 m'
        },
        description: "İstanbul Boğazı üzerindeki üçüncü köprü olan Yavuz Sultan Selim Köprüsü, hem karayolu hem de demiryolu geçişine sahip dünyanın en geniş asma köprüsüdür.",
        image: 'assets/project_yavuz_bridge_1769107047787.png'
    },
    osmangazi: {
        id: 'osmangazi',
        title: 'Osmangazi Köprüsü',
        type: 'KÖPRÜ',
        metrics: {
            'Ana Açıklık': '1,550 m',
            'Yükseklik': '252 m',
            'Toplam Uzunluk': '2,682 m'
        },
        description: "İzmit Körfezi'ni birbirine bağlayan bu devasa yapı, dünyanın işletmeye açık en büyük orta açıklıklı asma köprülerinden biridir.",
        image: 'assets/project_osmangazi_bridge_1769107063229.png'
    },
    zigana: {
        id: 'zigana',
        title: 'Zigana Tüneli',
        type: 'TÜNEL',
        metrics: {
            'Uzunluk': '14.5 km',
            'Tüp Sayısı': '2',
            'Rakım': '1,212 m'
        },
        description: "Doğu Karadeniz'i Orta Anadolu'ya bağlayan Zigana Tüneli, Avrupa'nın ve Türkiye'nin en uzun karayolu tünelidir.",
        image: 'assets/zigana_tunnel_minimal_text_1769109119084.png'
    },
    ovit: {
        id: 'ovit',
        title: 'Ovit Tüneli',
        type: 'TÜNEL',
        metrics: {
            'Uzunluk': '14.3 km',
            'Tüp Sayısı': '2',
            'Yapım Yılı': '2018'
        },
        description: "Rize ile Erzurum'u birbirine bağlayan Ovit Tüneli, kış aylarında kapanan yolları yıl boyu açık tutarak stratejik bir ulaşım koridoru sağlar.",
        image: 'assets/project_ovit_tunnel_1769107093438.png'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initInteractions();
    initNavigation();

    // Page Specific Initializations
    if (window.location.pathname.includes('screen-detail.html')) {
        loadProjectDetail();
    }

    if (window.location.pathname.includes('screen-simulation.html')) {
        initSimulation();
    }
});

function initInteractions() {
    // Add touch scales to all interactive elements
    const interactiveElements = document.querySelectorAll('button, .project-card, .option-card');

    interactiveElements.forEach(el => {
        el.addEventListener('touchstart', () => {
            el.style.transform = 'scale(0.98)';
        }, { passive: true });

        el.addEventListener('touchend', () => {
            el.style.transform = '';
        });
    });

    // Option cards selection logic in Simulation screen
    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            optionCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });
}

function initNavigation() {
    // We are using standard links, but we can enhance transitions here if needed
    // For now, let's just make sure "Geri" buttons work nicely with history if feasible,
    // or hardcode them as per spec. 
    // Spec says: BottomBar: "Geri" -> Screen 1, etc.

    // We will rely on inline onclicks or hrefs in HTML for simplicity and robustness
}

function loadProjectDetail() {
    // Get project ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project') || 'canakkale'; // Default

    const data = PROJECT_DATA[projectId];
    if (!data) return;

    // Populate DOM
    const titleEl = document.querySelector('.info-panel .section-title');
    const descEl = document.querySelector('.info-panel .description');
    const metricsContainer = document.querySelector('.metric-rows');
    const imageContainer = document.querySelector('.media-container'); // Container

    // Update Image
    if (imageContainer && data.image) {
        imageContainer.innerHTML = `<img src="${data.image}" class="detail-image" alt="${data.title}">`;
    }

    if (titleEl) titleEl.innerText = data.title; // Using section-title as Header for detail? Or distinct?
    // Actually the layout has "TEKNİK ÖZET" as section title. The Project Title might need to be added or replaces the topbar title?
    // Let's assume the TopBar shows the generic title, and the detail view shows the content.
    // Wait, the spec Detail Screen layout doesn't explicitly have the Project Name H1 in the info panel, 
    // but usually it's there. I'll stick to the layout provided:
    // "TEKNİK ÖZET" is the header.
    // I will dynamically render the metrics rows.

    if (metricsContainer) {
        metricsContainer.innerHTML = '';
        for (const [key, value] of Object.entries(data.metrics)) {
            const row = document.createElement('div');
            row.classList.add('metric-row');
            // Select icon based on key
            let icon = '📏'; // Default for general metrics (length)

            // Width/Span metrics
            if (key.includes('Açıklık') || key.includes('Genişlik')) icon = '↔';
            // Height/Altitude metrics
            else if (key.includes('Yükseklik') || key.includes('Rakım')) icon = '↕';
            // Date/Year metrics
            else if (key.includes('Tarih') || key.includes('Yılı')) icon = '📅';
            // Number metrics (like Tüp Sayısı)
            else if (key.includes('Sayısı')) icon = '#️⃣';

            row.innerHTML = `
                <span class="icon">${icon}</span>
                <div class="metric-content">
                  <span class="label">${key}</span>
                  <span class="value">${value}</span>
                </div>
             `;
            metricsContainer.appendChild(row);
        }
    }

    if (descEl) descEl.innerText = data.description;

    // Also update "Simülasyon" button to pass the project ID
    const simBtn = document.querySelector('.cta-buttons .btn-secondary'); // "Simülasyonu Başlat"
    if (simBtn) {
        simBtn.onclick = () => window.location.href = `screen-simulation.html?project=${projectId}`;
    }
}

function initSimulation() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project') || 'canakkale';
    const data = PROJECT_DATA[projectId];

    // Map project IDs to their WebGL content folders
    const WEBGL_MAP = {
        canakkale: 'webgl/1915/',
        yavuz: 'webgl/yavuz/',
        osmangazi: 'webgl/osmangazi/',
        zigana: 'webgl/zigana/',
        ovit: 'webgl/ovit/'
    };

    const video = document.getElementById('simulation-video');
    const progressBar = document.getElementById('construction-progress');
    const progressText = document.getElementById('progress-text');
    const progressContainer = document.getElementById('progress-container');
    const constructionTitle = document.getElementById('construction-title');
    const startButton = document.getElementById('start-simulation-btn');
    const simulationPreview = document.querySelector('.simulation-preview'); // The main container

    if (video && simulationPreview) {
        // Set video source based on project ID
        // Note: Assumes video files in 'assets' are named like 'canakkale.mp4'
        const videoSource = document.createElement('source');
        videoSource.src = `assets/${projectId}.mp4`;
        videoSource.type = 'video/mp4';
        video.appendChild(videoSource);

        // Auto-play the video when ready
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });

        // Update progress bar as video plays
        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                let progress = (video.currentTime / video.duration) * 100;
                progress = Math.min(progress, 100);

                if (progressBar) {
                    progressBar.style.width = progress + '%';
                }
                if (progressText) {
                    progressText.textContent = Math.floor(progress) + '%';
                }
            }
        });

        // When video ends, hide video/progress elements and show the start button
        video.addEventListener('ended', () => {
            // Hide video and its controls
            if (video) video.style.display = 'none';
            if(simulationPreview.querySelector('.preview-content')) {
                 simulationPreview.querySelector('.preview-content').style.display = 'none';
            }
            if (progressContainer) progressContainer.style.display = 'none';
            if (progressText) progressText.style.display = 'none';
            if (constructionTitle) constructionTitle.style.display = 'none';

            // Show start button
            if (startButton) {
                startButton.style.display = 'flex';
            }
        });

        // *** CORRECTED LOGIC FOR THE START BUTTON ***
        if (startButton) {
            startButton.addEventListener('click', () => {
                const webglSrc = WEBGL_MAP[projectId];
                if (!webglSrc) {
                    console.error('WebGL path not found for project:', projectId);
                    simulationPreview.innerHTML = '<p style="color:red;">Simülasyon yüklenemedi.</p>';
                    return;
                }
                
                // Create and configure the iframe for the WebGL content
                const iframe = document.createElement('iframe');
                iframe.src = webglSrc;
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';

                // Replace the entire content of the preview area with the iframe
                simulationPreview.innerHTML = '';
                simulationPreview.appendChild(iframe);
            });
        }
    }
}
