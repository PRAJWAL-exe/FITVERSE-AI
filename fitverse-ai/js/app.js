/**
 * FITVERSE AI - Main Application Logic
 * Modules: Navigation, BMI Calculator, Member Registration, Admin Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// --- Core Initialization ---
function initApp() {
    renderSharedComponents();

    // Init all modules as they are now all present
    initBMI();
    initJoin();
    initPayment();
    initAdmin();

    // Global Animations
    setupScrollAnimations();
    setupScrollSpy();
}

// --- Shared Components (Navbar & Footer) ---
function renderSharedComponents() {
    // Shared Navbar with Hash Links
    const navbarHTML = `
        <div class="container">
            <a href="#home" class="logo">FITVERSE<span>.AI</span></a>
            <div class="menu-toggle" onclick="toggleMenu()">☰</div>
            <nav class="nav-links" id="navLinks">
                <a href="#home" class="nav-link active">Home</a>
                <a href="#about" class="nav-link">About</a>
                <a href="#trainers" class="nav-link">Trainers</a>
                <a href="#pricing" class="nav-link">Pricing</a>
                <a href="#bmi" class="nav-link">BMI Calc</a>
                <a href="#join" class="nav-link">Join Now</a>
                <a href="admin.html" class="nav-link">Admin</a>
                <div class="nav-indicator"></div>
            </nav>
        </div>
    `;

    const footerHTML = `
        <div class="container">
            <div class="social-icons">
                <a href="#">Instagram</a>
                <a href="#">Twitter</a>
                <a href="#">Facebook</a>
            </div>
            <p>&copy; 2025 FITVERSE AI. All Rights Reserved.</p>
        </div>
    `;

    // Inject if elements exist (they will be in HTML files)
    const headerEl = document.getElementById('main-navbar');
    if (headerEl) headerEl.innerHTML = navbarHTML;

    const footerEl = document.getElementById('main-footer');
    if (footerEl) footerEl.innerHTML = footerHTML;
}

function toggleMenu() {
    const nav = document.getElementById('navLinks');
    nav.classList.toggle('active');
}

// --- Scroll Spy & Navigation Logic (Optimized with IntersectionObserver) ---
function setupScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const indicator = document.querySelector('.nav-indicator');

    // Function to move indicator
    const moveIndicator = (element) => {
        if (indicator && element) {
            indicator.style.width = `${element.offsetWidth}px`;
            indicator.style.left = `${element.offsetLeft}px`;
        }
    };

    // Initial position
    setTimeout(() => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) moveIndicator(activeLink);
    }, 100);

    // Update on resize (Debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const activeLink = document.querySelector('.nav-link.active');
            if (activeLink) moveIndicator(activeLink);
        }, 200);
    });

    // Intersection Observer for performance
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Active when section is near top/middle
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Update active link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        moveIndicator(link);
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}


// --- BMI Calculator Logic ---
function initBMI() {
    const btn = document.getElementById('calc-bmi-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const resultDisplay = document.getElementById('bmi-result');

        if (!height || !weight || height <= 0 || weight <= 0) {
            showFeedback(resultDisplay, "Please enter valid height and weight.", "error");
            return;
        }

        // BMI Formula: kg / (m^2)
        const heightM = height / 100;
        const bmi = (weight / (heightM * heightM)).toFixed(2);

        let category = '';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 24.9) category = 'Normal Weight';
        else if (bmi < 29.9) category = 'Overweight';
        else category = 'Obese';

        showFeedback(resultDisplay, `Your BMI is <strong>${bmi}</strong><br>Category: ${category}`, "success");
    });
}

// --- Join Form Logic ---
function initJoin() {
    const form = document.getElementById('join-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('join-name').value.trim();
        const height = document.getElementById('join-height').value;
        const weight = document.getElementById('join-weight').value;
        const goal = document.getElementById('join-goal').value;
        const msgBox = document.getElementById('join-msg');

        if (!name || !height || !weight) {
            showFeedback(msgBox, "Please fill in all required fields.", "error");
            return;
        }

        const newMember = {
            id: Date.now(),
            name,
            height,
            weight,
            goal,
            date: new Date().toLocaleDateString()
        };

        // Save to LocalStorage
        const members = JSON.parse(localStorage.getItem('fitverse_members') || '[]');
        members.push(newMember);
        localStorage.setItem('fitverse_members', JSON.stringify(members));

        showFeedback(msgBox, `Welcome to the Verse, ${name}! Registration Successful.`, "success");
        form.reset();

        // Refresh admin table if visible
        loadMembersTable();
    });
}

// --- Payment Logic ---
function initPayment() {
    const form = document.getElementById('payment-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const msgBox = document.getElementById('payment-msg');
        const btn = form.querySelector('button');

        // Validate
        const num = document.getElementById('card-number').value;
        if (num.length < 16) {
            msgBox.textContent = "Invalid Card Number";
            msgBox.style.color = "red";
            return;
        }

        // Simulate Processing
        btn.textContent = "Processing...";
        btn.disabled = true;
        msgBox.textContent = "Contacting Secure Gateway...";
        msgBox.style.color = "#FDB915";

        setTimeout(() => {
            msgBox.textContent = "Payment Verified! Redirecting...";
            msgBox.style.color = "#4cd964";

            setTimeout(() => {
                // Redirect to Admin (Simulating Login)
                window.location.hash = "#admin";
                btn.textContent = "Pay Now";
                btn.disabled = false;
                msgBox.textContent = "";
                form.reset();
            }, 1000);
        }, 2000);
    });
}

// --- Admin Dashboard Logic ---
function initAdmin() {
    loadMembersTable();

    const clearBtn = document.getElementById('clear-data-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to delete all member records?")) {
                localStorage.removeItem('fitverse_members');
                loadMembersTable();
                alert("Database cleared.");
            }
        });
    }

    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }

    // --- Chart.js Initialization ---
    // Revenue Chart (Line)
    const ctxRevenue = document.getElementById('revenueChart');
    if (ctxRevenue) {
        new Chart(ctxRevenue, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Sales ($)',
                    data: [8500, 9200, 10500, 11200, 11800, 12450],
                    borderColor: '#FDB915', // Primary Gold
                    backgroundColor: 'rgba(253, 185, 21, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#888' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#888' }
                    }
                }
            }
        });
    }

    // Goals Chart (Doughnut)
    const ctxGoals = document.getElementById('goalsChart');
    if (ctxGoals) {
        new Chart(ctxGoals, {
            type: 'doughnut',
            data: {
                labels: ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: [
                        '#2ecc71', // Green
                        '#9b59b6', // Purple
                        '#3498db', // Blue
                        '#FDB915'  // Gold
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#fff' }
                    }
                },
                cutout: '70%'
            }
        });
    }
}

function loadMembersTable() {
    const tbody = document.getElementById('members-table-body');
    if (!tbody) return;

    const members = JSON.parse(localStorage.getItem('fitverse_members') || '[]');

    // Update Stats
    const totalEl = document.getElementById('stats-total');
    const newEl = document.getElementById('stats-new');

    if (totalEl) totalEl.textContent = members.length;

    // Simulate "New This Week" as 30% of total for demo, or actual date check if strict
    if (newEl) newEl.textContent = Math.ceil(members.length * 0.4);

    tbody.innerHTML = '';

    if (members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: #666;">No members found.</td></tr>';
        return;
    }

    members.forEach(m => {
        const tr = document.createElement('tr');

        // Determine badge color based on goal
        let badgeClass = 'badge-blue';
        if (m.goal.includes('Loss')) badgeClass = 'badge-green';
        if (m.goal.includes('Muscle')) badgeClass = 'badge-purple';

        tr.innerHTML = `
            <td><strong style="color:#fff;">${m.name}</strong></td>
            <td>${m.height}cm / ${m.weight}kg</td>
            <td><span class="badge ${badgeClass}">${m.goal}</span></td>
            <td style="color:#888;">${m.date}</td>
            <td><span style="color:#4cd964;">● Active</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function exportData() {
    const members = JSON.parse(localStorage.getItem('fitverse_members') || '[]');
    if (members.length === 0) {
        alert("No data to export.");
        return;
    }

    // Format for Notepad (Visual Table)
    let txtContent = "FITVERSE AI - MEMBER DATABASE REPORT\n";
    txtContent += "Generated On: " + new Date().toLocaleString() + "\n";
    txtContent += "=================================================================================\n";
    txtContent += "| Name                | Height (cm) | Weight (kg) | Goal            | Date      |\n";
    txtContent += "|---------------------|-------------|-------------|-----------------|-----------|\n";

    members.forEach(m => {
        // Simple padding for alignment (assuming monospace font in Notepad)
        const pad = (str, len) => (str + "                         ").substring(0, len);

        txtContent += `| ${pad(m.name, 19)} | ${pad(m.height, 11)} | ${pad(m.weight, 11)} | ${pad(m.goal, 15)} | ${pad(m.date, 9)} |\n`;
    });

    txtContent += "=================================================================================\n";
    txtContent += `Total Records: ${members.length}\n`;

    const blob = new Blob([txtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fitverse_members.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// --- Utility Functions ---
function showFeedback(element, message, type) {
    element.innerHTML = message;
    element.className = `result-box ${type}`;
    element.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        element.style.opacity = '0';
        setTimeout(() => element.style.display = 'none', 500);
        element.style.opacity = '1';
    }, 5000);
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('visible');
            }
        });
    });

    document.querySelectorAll('.animate-fade').forEach(el => observer.observe(el));
}
