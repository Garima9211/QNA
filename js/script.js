// GK Question Bank Data
const gkQuestionBank = [
    {
        id: 1,
        q: "भारतीय संविधान का जनक किसे कहा जाता है?",
        a: "डॉ. बी.आर. अम्बेडकर", b: "महात्मा गांधी", c: "जवाहरलाल नेहरू", d: "डॉ. राजेन्द्र प्रसाद",
        correct: "A", exam: "UPPCS", year: "2024", likes: 245, views: "1.2K",
        context: "डॉ. भीमराव अम्बेडकर को भारतीय संविधान का जनक और निर्माता कहा जाता है क्योंकि वह 'प्रारूप समिति' के अध्यक्ष थे। उन्होंने दुनिया भर के संविधानों का अध्ययन करके भारत का संविधान तैयार किया।"
    },
    {
        id: 2,
        q: "भारत में किस राज्य की तटरेखा (Coastline) सबसे लंबी है?",
        a: "महाराष्ट्र", b: "तमिलनाडु", c: "गुजरात", d: "आंध्र प्रदेश",
        correct: "C", exam: "SSC CGL", year: "2023", likes: 189, views: "940",
        context: "भारत की मुख्य भूमि की कुल तटरेखा में अकेले गुजरात राज्य की तटरेखा सबसे लंबी (लगभग 1214.7 किमी) है। इसके बाद दूसरे स्थान पर आंध्र प्रदेश आता है।"
    },
    {
        id: 3,
        q: "प्लेट विवर्तनिकी सिद्धांत के अनुसार पृथ्वी का स्थलमंडल किसमें विभाजित है?",
        a: "7 मुख्य प्लेटों में", b: "5 मुख्य परतों में", c: "3 मुख्य खण्डों में", d: "9 छोटी प्लेटों में",
        correct: "A", exam: "UPSC CSE", year: "2021", likes: 312, views: "2.1K",
        context: "प्लेट विवर्तनिकी सिद्धांत (Plate Tectonics) के अनुसार पृथ्वी की बाहरी परत (Lithosphere) 7 मुख्य और कई छोटी-छोटी विवर्तनिकी प्लेटों में बंटी हुई है।"
    }
];

const wrapper = document.getElementById('reels-wrapper');
const contentContainer = document.getElementById('reels-content');
let activeTimers = {};
let currentActiveReelIndex = 0;
let nextSectionToScroll = null;

// HTML Component Generator for Reel Card
function createQuestionReelHTML(item, index) {
    return `
        <div id="reel-${index}" class="reel-section" data-correct="${item.correct}" data-index="${index}">
            <div class="watermark">
                <span class="wm-title">www.theQna.in</span>
                <span class="wm-sub">The QNA</span>
            </div>

            <div class="reel-top-bar">
                <div class="meta-info">
                    <span class="q-badge">सवाल #${index + 1}</span>
                    <span class="timer-badge">⏱️ <span class="timer-text">30</span>s</span>
                </div>
                <div class="timer-bg">
                    <div class="timer-bar"></div>
                </div>
            </div>

            <div class="reel-middle">
                <div class="question-card">
                    <h2>${item.q}</h2>
                    <span class="exam-tag">${item.exam}</span>
                </div>

                <div class="options-group">
                    ${['A', 'B', 'C', 'D'].map(opt => `
                        <button onclick="checkAnswer(this, '${opt}')" class="option-btn">
                            <span class="opt-badge">${opt}</span>
                            <span>${item[opt.toLowerCase()]}</span>
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="reel-bottom">
                <div class="answer-box hidden">
                    <div class="correct-info">
                        <span>✅ उत्तर: (${item.correct})</span>
                        <button onclick="openExplanation(${index})" class="explain-btn">व्याख्या 📖</button>
                    </div>
                    <button onclick="scrollToNext(this)" class="primary-btn">अगला सवाल ➡️</button>
                </div>

                <div class="interactions-bar">
                    <div class="stats-group">
                        <button onclick="toggleLike(this)" class="like-btn">
                            <span class="heart">🤍</span> <span class="like-count">${item.likes}</span>
                        </button>
                        <span>|</span>
                        <div>👁️ ${item.views}</div>
                    </div>
                    <button onclick="reportQuestionError(${item.id})" class="report-btn">🚨 रिपोर्ट</button>
                </div>
            </div>
        </div>
    `;
}

// Render Loops
function renderReelsEngine() {
    let combinedHTML = "";
    let totalQuestions = 0;

    for (let loop = 0; loop < 9; loop++) {
        gkQuestionBank.forEach((item) => {
            combinedHTML += createQuestionReelHTML(item, totalQuestions);
            totalQuestions++;
        });
    }
    contentContainer.innerHTML = combinedHTML;
    setTimeout(initScrollObserver, 100);
}

// Timer Logic
function startTimerForReel(reelElement, index) {
    let timeLeft = 30;
    const timerText = reelElement.querySelector('.timer-text');
    const timerBar = reelElement.querySelector('.timer-bar');

    if (activeTimers[index]) clearInterval(activeTimers[index]);
    if (!timerBar) return;

    timerBar.style.width = '100%';
    timerBar.classList.remove('warning');

    activeTimers[index] = setInterval(() => {
        timeLeft--;
        if (timerText) timerText.innerText = timeLeft;

        let percentage = (timeLeft / 30) * 100;
        if (timerBar) timerBar.style.width = percentage + '%';

        if (timeLeft <= 5 && timerBar) {
            timerBar.classList.add('warning');
        }

        if (timeLeft <= 0) {
            clearInterval(activeTimers[index]);
            const correctOption = reelElement.getAttribute('data-correct');
            const firstCorrectBtn = Array.from(reelElement.querySelectorAll('.option-btn'))
                .find(btn => btn.querySelector('.opt-badge').innerText === correctOption);
            if (firstCorrectBtn) checkAnswer(firstCorrectBtn, null);
        }
    }, 1000);
}

// Answer Check
function checkAnswer(selectedBtn, selectedOption) {
    const reel = selectedBtn.closest('.reel-section');
    const correctOption = reel.getAttribute('data-correct');
    const allButtons = reel.querySelectorAll('.option-btn');
    const reelIndex = reel.getAttribute('data-index');

    if (activeTimers[reelIndex]) clearInterval(activeTimers[reelIndex]);
    allButtons.forEach(btn => btn.disabled = true);

    allButtons.forEach(btn => {
        const optionLetter = btn.querySelector('.opt-badge').innerText;

        if (optionLetter === correctOption) {
            btn.classList.add('correct');
        } else if (optionLetter === selectedOption && selectedOption !== correctOption) {
            btn.classList.add('wrong');
        }
    });

    reel.querySelector('.interactions-bar').classList.add('hidden');
    reel.querySelector('.answer-box').classList.remove('hidden');
}

// Navigation & Video Ad Trigger
function scrollToNext(btn) {
    const currentSection = btn ? btn.closest('.reel-section') : document.getElementById(`reel-${currentActiveReelIndex}`);
    const nextSection = currentSection.nextElementSibling;

    if (nextSection) {
        let nextIndex = parseInt(nextSection.getAttribute('data-index'));

        if (nextIndex > 0 && nextIndex % 20 === 0 && !nextSection.dataset.adShown) {
            showFullScreenVideoAd(nextSection);
            nextSection.dataset.adShown = 'true';
        } else {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        alert("🎉 बधाई हो! आपने सभी सवाल पूरे कर लिए हैं।");
    }
}

// Fullscreen Ad Logic
function showFullScreenVideoAd(nextSection) {
    nextSectionToScroll = nextSection;
    const overlay = document.getElementById('video-ad-overlay');
    overlay.classList.remove('hidden');

    document.getElementById('skip-btn-container').classList.add('hidden');
    document.getElementById('ad-countdown').classList.remove('hidden');
    document.getElementById('v-time').innerText = '5';

    let timeLeft = 5;
    let vInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('v-time').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(vInterval);
            document.getElementById('ad-countdown').classList.add('hidden');
            document.getElementById('skip-btn-container').classList.remove('hidden');
        }
    }, 1000);
}

function skipVideoAd() {
    document.getElementById('video-ad-overlay').classList.add('hidden');
    if (nextSectionToScroll) {
        nextSectionToScroll.scrollIntoView({ behavior: 'smooth' });
    }
}

// Modal Sheet Logic
function openExplanation(originalIndex) {
    currentActiveReelIndex = originalIndex;
    const itemIndex = originalIndex % gkQuestionBank.length;
    const item = gkQuestionBank[itemIndex];

    document.getElementById('explanation-text').innerHTML = item.context || "व्याख्या उपलब्ध नहीं है।";
    document.getElementById('sheet-overlay').classList.remove('hidden');
    document.getElementById('explanation-sheet').classList.add('active');
}

function closeExplanation() {
    document.getElementById('sheet-overlay').classList.add('hidden');
    document.getElementById('explanation-sheet').classList.remove('active');
}

function nextFromExplanation() {
    closeExplanation();
    setTimeout(() => scrollToNext(null), 300);
}

// Scroll Observer
function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const reelIndex = entry.target.getAttribute('data-index');
                if (reelIndex !== null) startTimerForReel(entry.target, reelIndex);
            }
        });
    }, { root: wrapper, threshold: 0.6 });

    document.querySelectorAll('.reel-section').forEach(reel => observer.observe(reel));
}

// Helpers
function toggleLike(btn) {
    const heart = btn.querySelector('.heart');
    const countSpan = btn.querySelector('.like-count');
    let currentCount = parseInt(countSpan.innerText);

    if (heart.innerText === '🤍') {
        heart.innerText = '❤️';
        countSpan.innerText = currentCount + 1;
        btn.classList.add('active');
    } else {
        heart.innerText = '🤍';
        countSpan.innerText = currentCount - 1;
        btn.classList.remove('active');
    }
}

function reportQuestionError(id) {
    alert(`⚠️ सवाल #${id} की रिपोर्ट दर्ज कर ली गई है।`);
}

// Start Engine
renderReelsEngine();