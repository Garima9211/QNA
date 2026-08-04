const questions = [
    {
        subject: "इतिहास", 
        test: "Test #1000", 
        question: "1857 की क्रांति के समय भारत का गवर्नर जनरल कौन था?", 
        options: ["लॉर्ड डलहौजी", "लॉर्ड कैनिंग", "लॉर्ड कर्जन", "लॉर्ड मिंटो"], 
        answer: 1, 
        info: "1857 की क्रांति के समय भारत का गवर्नर जनरल लॉर्ड कैनिंग था। यह विद्रोह 10 मई 1857 को मेरठ से शुरू हुआ था और जल्द ही उत्तर और मध्य भारत के बड़े हिस्सों में फैल गया।"
    },
    {
        subject: "भूगोल", 
        test: "Test #1002", 
        question: "भारत का सबसे दक्षिणी बिंदु कौन सा है?", 
        options: ["कन्याकुमारी", "रामेश्वरम", "इंदिरा पॉइंट", "लक्षद्वीप"], 
        answer: 2, 
        info: "भारत का सबसे दक्षिणी बिंदु इंदिरा पॉइंट है, जो अंडमान और निकोबार द्वीप समूह के ग्रेट निकोबार द्वीप पर स्थित है।"
    },
    {
        subject: "सामान्य ज्ञान", 
        test: "Test #1003", 
        question: "भारत का राष्ट्रीय पशु कौन है?", 
        options: ["शेर", "बाघ", "हाथी", "मोर"], 
        answer: 1, 
        info: "बाघ भारत का राष्ट्रीय पशु है। इसे 1973 में राष्ट्रीय पशु घोषित किया गया था।"
    }
];

const container = document.getElementById("reelsContainer");
const adModal = document.getElementById("adModal");
let index = 0;

function optionHTML(q, i) {
    const isCorrect = i === q.answer;
    const optionLetter = String.fromCharCode(65 + i); // A, B, C, D
    
    return `
    <div class="${isCorrect ? 'correct-option' : 'glass-option'}">
        <span>${optionLetter}. ${q.options[i]}</span>
        ${isCorrect ? '<i class="fa-solid fa-circle-check"></i>' : ''}
    </div>`;
}

function reelHTML(q, n) {
    return `
    <section class="reel-item">
        <div class="main-content-area">
            <div class="meta-header">
                <span class="subject-tag">${q.subject}</span>
                <span class="test-tag">${q.test}</span>
            </div>
            
            <h2 class="question-text">${q.question}</h2>
            
            <div class="interactive-row">
                <div class="options-list">
                    ${q.options.map((_, i) => optionHTML(q, i)).join("")}
                </div>
                
                <div class="side-actions-box">
                    <button class="action-btn">
                        <i class="fa-solid fa-heart"></i>
                        <span>12K</span>
                    </button>
                    <button class="action-btn">
                        <i class="fa-solid fa-bookmark"></i>
                        <span>Save</span>
                    </button>
                    <button class="action-btn">
                        <i class="fa-solid fa-share"></i>
                        <span>Share</span>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="bottom-info-box">
            <p id="context-${n}" class="info-text line-clamp-2">
                <span class="info-highlight">विस्तृत जानकारी:</span> ${q.info}
            </p>
            <button id="btn-${n}" onclick="handleReadMore('context-${n}', 'btn-${n}')" class="read-more-btn">...Read more</button>
        </div>
    </section>`;
}

function addQuestion() { 
    container.insertAdjacentHTML("beforeend", reelHTML(questions[index % questions.length], index)); 
    index++; 
}

// Initial Loading
for (let i = 0; i < questions.length; i++) {
    addQuestion();
}

// Infinite Scroll Listener
container.addEventListener("scroll", () => {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 150) {
        addQuestion();
    }
});

// Read More & Ad logic
let currentTargetText = null;
let currentTargetBtn = null;

function handleReadMore(textId, btnId) {
    currentTargetText = textId;
    currentTargetBtn = btnId;
    adModal.classList.add("flex-show");
}

function closeAd() {
    adModal.classList.remove("flex-show");
    if (currentTargetText) {
        document.getElementById(currentTargetText).classList.remove("line-clamp-2");
        document.getElementById(currentTargetBtn).style.display = "none";
    }
}

function openProfile() {
    alert("Profile opening...");
}