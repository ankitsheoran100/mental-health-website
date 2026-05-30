// =============================================================================
// main.js  —  Mental Health Analyzer Website
// =============================================================================================

// ── 1. NAVBAR TOGGLE ─────────────────────────────────────────────────────────

function toggleNav() {
    var navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('open');
    }
}

// Close mobile nav when a link inside it is clicked
document.addEventListener('DOMContentLoaded', function () {
    var navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
            });
        });
    }

    // Ctrl+Enter shortcut for the demo textarea
    var demoInput = document.getElementById('demoInput');
    if (demoInput) {
        demoInput.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.key === 'Enter') {
                analyseText();
            }
        });
    }
});

// ── 2. EXAMPLE TEXTS ─────────────────────────────────────────────────────────

var EXAMPLES = [
    // index 0 — Positive
    "I feel absolutely wonderful today! Life is full of hope and I am grateful "
    + "for everything around me. My mood has been incredible.",

    // index 1 — Negative / Severe
    "I cannot stop crying. Everything feels pointless and dark. I see no reason "
    + "to go on anymore. I feel completely hopeless and exhausted.",

    // index 2 — Neutral / Mild
    "Work has been a bit stressful lately but I am managing okay. Some good days "
    + "and some bad ones, but nothing I cannot handle.",

    // index 3 — Severe
    "I have been thinking about ending my life. Nobody cares about me. "
    + "I feel invisible and completely worthless. Nothing matters anymore."
];

function loadExample(index) {
    var demoInput = document.getElementById('demoInput');
    if (demoInput && EXAMPLES[index] !== undefined) {
        demoInput.value = EXAMPLES[index];
        demoInput.focus();
    }
}

// ── 3. KEYWORD-BASED QUICK DEMO ───────────────────────────────────────────────
//
// Sentiment keywords
var NEGATIVE_WORDS = [
    'hopeless', 'worthless', 'empty', 'pointless', 'tired', 'exhausted',
    'depressed', 'sad', 'miserable', 'lonely', 'alone', 'fail', 'failure',
    'dark', 'numb', 'pain', 'hurt', 'cry', 'crying', 'tears', 'cannot',
    "can't", 'nothing', 'nobody', 'hate', 'anxious', 'anxiety', 'panic',
    'afraid', 'scared', 'worried', 'stress', 'bad', 'terrible', 'awful'
];

var POSITIVE_WORDS = [
    'happy', 'wonderful', 'great', 'amazing', 'hopeful', 'grateful',
    'thankful', 'joy', 'joyful', 'excited', 'love', 'peaceful', 'calm',
    'better', 'good', 'fantastic', 'excellent', 'blessed', 'motivated',
    'confident', 'energetic', 'positive', 'optimistic', 'inspired', 'proud'
];

// Severity keywords
var SEVERE_WORDS = [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'ending my life',
    'die', 'dying', 'death', 'not worth living', 'no reason to live',
    'want to disappear', 'thinking about ending', 'self-harm', 'self harm'
];

var MODERATE_WORDS = [
    'hopeless', 'worthless', 'cannot function', "can't function", 'hollow',
    'empty inside', 'completely lost', 'no one cares', 'nobody cares',
    'no energy', 'cannot sleep', "can't sleep", 'not eating', 'isolating',
    'weeks', 'months', 'stopped caring'
];

var MILD_WORDS = [
    'bit anxious', 'a little', 'somewhat', 'sometimes', 'occasionally',
    'manageable', 'handling', 'manage', 'stressful', 'worried about',
    'nervous', 'overthinking', 'unmotivated', 'tired', 'low'
];

function classifySentiment(text) {
    var lower = text.toLowerCase();
    var negScore = 0;
    var posScore = 0;

    NEGATIVE_WORDS.forEach(function (word) {
        if (lower.includes(word)) negScore++;
    });
    POSITIVE_WORDS.forEach(function (word) {
        if (lower.includes(word)) posScore++;
    });

    if (negScore === 0 && posScore === 0) return 'neutral';
    if (posScore > negScore) return 'positive';
    if (negScore > posScore) return 'negative';
    return 'neutral';
}

function classifySeverity(text) {
    var lower = text.toLowerCase();

    for (var i = 0; i < SEVERE_WORDS.length; i++) {
        if (lower.includes(SEVERE_WORDS[i])) return 'severe 🔴';
    }
    for (var j = 0; j < MODERATE_WORDS.length; j++) {
        if (lower.includes(MODERATE_WORDS[j])) return 'moderate 🟠';
    }
    for (var k = 0; k < MILD_WORDS.length; k++) {
        if (lower.includes(MILD_WORDS[k])) return 'mild 🟡';
    }
    return 'minimum 🟢';
}

// Colour classes for sentiment result display
var SENTIMENT_COLOUR = {
    'negative': 'negative',
    'neutral' : 'neutral',
    'positive': 'positive'
};

// Colour classes for severity result display
var SEVERITY_COLOUR = {
    'minimum 🟢' : 'minimum',
    'mild 🟡'    : 'mild',
    'moderate 🟠': 'moderate',
    'severe 🔴'  : 'severe'
};

function analyseText() {
    var demoInput  = document.getElementById('demoInput');
    var demoResult = document.getElementById('demoResult');
    var sentimentResult = document.getElementById('sentimentResult');
    var severityResult  = document.getElementById('severityResult');

    if (!demoInput || !demoResult || !sentimentResult || !severityResult) return;

    var text = demoInput.value.trim();

    if (!text) {
        demoInput.style.borderColor = '#ef4444';
        demoInput.placeholder = '⚠️ Please enter some text first…';
        setTimeout(function () {
            demoInput.style.borderColor = '';
            demoInput.placeholder = 'Enter text here... (Ctrl+Enter to analyse)';
        }, 2000);
        return;
    }

    // Reset border if previously highlighted
    demoInput.style.borderColor = '';

    var sentiment = classifySentiment(text);
    var severity  = classifySeverity(text);

    // Set sentiment result text + colour class
    sentimentResult.textContent = sentiment;
    sentimentResult.className   = 'result-value ' + (SENTIMENT_COLOUR[sentiment] || '');

    // Set severity result text + colour class
    severityResult.textContent = severity;
    var severityBase = severity.replace(/ [^\w]/g, '').trim(); // strip emoji for class lookup
    severityResult.className   = 'result-value ' + (SEVERITY_COLOUR[severity] || '');

    // Show the result panel
    demoResult.style.display = 'block';
    demoResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearDemo() {
    var demoInput  = document.getElementById('demoInput');
    var demoResult = document.getElementById('demoResult');
    var sentimentResult = document.getElementById('sentimentResult');
    var severityResult  = document.getElementById('severityResult');

    if (demoInput)  {
        demoInput.value = '';
        demoInput.style.borderColor = '';
        demoInput.focus();
    }
    if (demoResult)       demoResult.style.display = 'none';
    if (sentimentResult)  sentimentResult.textContent = '—';
    if (severityResult)   severityResult.textContent  = '—';
}

