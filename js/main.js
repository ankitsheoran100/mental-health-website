// js/main.js
// Complete JavaScript for Mental Health Thesis Website

// ── Active nav link highlight ─────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {

    // Mark current page link as active
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks    = document.querySelectorAll(".navbar-links a");

    navLinks.forEach(function (link) {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

    // ── iframe loading message ────────────────────────────────────
    const iframe         = document.getElementById("streamlit-iframe");
    const iframeLoading  = document.getElementById("iframe-loading");

    if (iframe) {
        iframe.addEventListener("load", function () {
            if (iframeLoading) {
                iframeLoading.style.display = "none";
            }
            iframe.style.opacity = "1";
        });
    }
});