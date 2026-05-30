// =============================================================================
// main.js — Mental Health Analyzer Website
// =============================================================================

// ── 1. NAVBAR ────────────────────────────────────────────────────────────────

function toggleNav() {
    var nav = document.getElementById('navLinks');
    if (nav) nav.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', function () {

    // Close nav on link click
    var nav = document.getElementById('navLinks');
    if (nav) {
        nav.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                nav.classList.remove('open');
            });
        });
    }

    // Ctrl+Enter shortcut for textarea
    var area = document.getElementById('demoInput');
    if (area) {
        area.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.key === 'Enter') analyseText();
        });
    }

    // Animate stat numbers
    document.querySelectorAll('.stat-number').forEach(function (el) {
        var target = parseInt(el.textContent);
        if (!isNaN(target)) {
            var current = 0;
            var step    = Math.ceil(target / 30);
            var timer   = setInterval(function () {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = current;
            }, 40);
        }
    });

    // Fade-in cards on scroll
    var cards = document.querySelectorAll(
        '.feature-card,.stat-card,.step-card,.about-card,.label-item'
    );
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.style.opacity   = '1';
                e.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(function (c) {
        c.style.opacity    = '0';
        c.style.transform  = 'translateY(16px)';
        c.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(c);
    });
});

// ── 2. EXAMPLE TEXTS ─────────────────────────────────────────────────────────

var EXAMPLES = [
    "I feel absolutely wonderful today! Life is full of hope and I am grateful for everything around me.",
    "I cannot stop crying. Everything feels pointless and dark. I see no reason to go on anymore.",
    "Work has been stressful lately but I am managing okay. Some good days, some bad ones.",
    "I have been thinking about ending my life. Nobody cares about me. I feel invisible and worthless."
];

function loadExample(index) {
    var area = document.getElementById('demoInput');
    if (area && EXAMPLES[index] !== undefined) {
        area.value = EXAMPLES[index];
        area.focus();
        var res = document.getElementById('demoResult');
        if (res) res.style.display = 'none';
    }
}

// ── 3. KEYWORD CLASSIFIER ────────────────────────────────────────────────────

var NEG_STRONG = [
    'hopeless','worthless','pointless','hollow','empty inside','cannot go on',
    "can't go on",'no reason','nothing matters','nobody cares','no one cares',
    'suicidal','ending my life','kill myself','want to die','die','dying',
    'self-harm','self harm','cannot function',"can't function",'breakdown',
    'completely lost','completely empty'
];
var NEG_MILD = [
    'sad','unhappy','depressed','tired','exhausted','anxious','worried',
    'stressed','fear','afraid','scared','pain','hurt','cry','crying',
    'alone','lonely','isolated','dark','bad day','terrible','awful',
    'cannot sleep',"can't sleep",'not eating','low mood','numb'
];
var POS = [
    'wonderful','amazing','happy','great','joy','joyful','hope','hopeful',
    'grateful','thankful','love','excited','calm','peaceful','motivated',
    'confident','better','fantastic','excellent','blessed','inspired',
    'proud','light','lighter','good day','positive','optimistic'
];
var SEV_SEVERE   = ['suicidal','suicide','ending my life','kill myself','want to die',
                    'no reason to live','thinking about ending','self-harm','self harm'];
var SEV_MODERATE = ['hopeless','worthless','hollow','empty inside','cannot function',
                    "can't function",'completely lost','not eating','not sleeping',
                    'weeks','breakdown','drag myself','no motivation','no energy'];
var SEV_MILD     = ['stressed','stressful','a bit anxious','somewhat','manageable',
                    'not great','struggling','a bit','sometimes','bit down','nervous',
                    'overthinking','unmotivated'];

function countWords(text, list) {
    var lower = text.toLowerCase(), n = 0;
    list.forEach(function (w) { if (lower.indexOf(w) !== -1) n++; });
    return n;
}

function classifySentiment(text) {
    var ns = countWords(text, NEG_STRONG) * 3;
    var nm = countWords(text, NEG_MILD);
    var ps = countWords(text, POS);
    var neg = ns + nm;
    if (ps > neg * 1.5) return 'positive';
    if (neg > ps)       return 'negative';
    return 'neutral';
}

function classifySeverity(text) {
    if (countWords(text, SEV_SEVERE)   > 0) return {label:'severe',   cls:'severe',   emoji:'🔴'};
    if (countWords(text, SEV_MODERATE) > 0) return {label:'moderate', cls:'moderate', emoji:'🟠'};
    if (countWords(text, SEV_MILD)     > 0) return {label:'mild',     cls:'mild',     emoji:'🟡'};
    var neg = countWords(text, NEG_STRONG) + countWords(text, NEG_MILD);
    if (neg > 2) return {label:'moderate', cls:'moderate', emoji:'🟠'};
    if (neg > 0) return {label:'mild',     cls:'mild',     emoji:'🟡'};
    return {label:'minimum', cls:'minimum', emoji:'🟢'};
}

var SENT_EMOJI  = {positive:'😊', neutral:'😐', negative:'😞'};
var SENT_COLOR  = {positive:'#10b981', neutral:'#94a3b8', negative:'#ef4444'};
var SEV_COLOR   = {minimum:'#10b981', mild:'#f59e0b', moderate:'#f97316', severe:'#ef4444'};

function analyseText() {
    var area      = document.getElementById('demoInput');
    var resultBox = document.getElementById('demoResult');
    var sentEl    = document.getElementById('sentimentResult');
    var sevEl     = document.getElementById('severityResult');
    if (!area || !resultBox || !sentEl || !sevEl) return;

    var text = area.value.trim();
    if (!text) {
        area.style.borderColor = '#ef4444';
        setTimeout(function () { area.style.borderColor = ''; }, 2000);
        return;
    }
    area.style.borderColor = '';

    var sent = classifySentiment(text);
    var sev  = classifySeverity(text);

    sentEl.textContent = SENT_EMOJI[sent] + ' ' + sent.charAt(0).toUpperCase() + sent.slice(1);
    sentEl.style.color = SENT_COLOR[sent];

    sevEl.textContent  = sev.emoji + ' ' + sev.label.charAt(0).toUpperCase() + sev.label.slice(1);
    sevEl.style.color  = SEV_COLOR[sev.cls];

    resultBox.style.display = 'block';
    resultBox.scrollIntoView({behavior:'smooth', block:'nearest'});
}

function clearDemo() {
    var area      = document.getElementById('demoInput');
    var resultBox = document.getElementById('demoResult');
    var sentEl    = document.getElementById('sentimentResult');
    var sevEl     = document.getElementById('severityResult');
    if (area)      { area.value = ''; area.style.borderColor = ''; area.focus(); }
    if (resultBox) resultBox.style.display = 'none';
    if (sentEl)    sentEl.textContent = '—';
    if (sevEl)     sevEl.textContent  = '—';
}

// iframe error handler
function handleIframeError() {
    var box = document.getElementById('iframeLoading');
    if (box) box.innerHTML =
        '<p style="color:#ef4444;">⚠️ Could not load embedded app.</p>' +
        '<a href="https://huggingface.co/spaces/AnkitSheoran/mental-health-analyzer" ' +
        'target="_blank" style="color:#f59e0b;font-weight:600;">' +
        '🤗 Open directly in HuggingFace →</a>';
}
