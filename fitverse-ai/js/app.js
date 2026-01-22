/**
 * FITVERSE AI - Main Application Logic
 * Modules: Navigation, BMI Calculator, Member Registration, Admin Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

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
                <a href="admin_login.html" class="nav-link">Admin</a>
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

        const name = document.getElementById('card-name') ? document.getElementById('card-name').value : 'Member';
        const methodInput = document.querySelector('input[name="pay-mode"]:checked');
        const method = methodInput ? methodInput.value : 'Credit Card';

        setTimeout(() => {
            msgBox.textContent = "Payment Verified! Redirecting...";
            msgBox.style.color = "#4cd964";

            // SAVE TRANSACTION
            const transactions = JSON.parse(localStorage.getItem('fitverse_payments') || '[]');
            const newTx = {
                id: 'FIT-' + Math.floor(10000 + Math.random() * 90000),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                user: name,
                plan: 'Monthly Pro', // Default for simulation
                amount: '$59.00',
                method: method,
                status: 'Completed'
            };
            transactions.unshift(newTx);
            localStorage.setItem('fitverse_payments', JSON.stringify(transactions));

            setTimeout(() => {
                const params = new URLSearchParams({
                    name: name,
                    amount: "$59.00",
                    method: method
                });
                window.location.href = `bill.html?${params.toString()}`;
            }, 1000);
        }, 2000);
    });
}

// --- Admin Dashboard Logic ---
function initAdmin() {
    // 1. Seed Data if empty
    seedDatabase();

    // 2. Setup Interactions
    setupAdminInteractions();

    // 3. Initial Data Load
    loadMembersTable();
}

// Global functions for HTML onclick binding


window.exportForNotepad = exportForNotepad; // Ensure global visibility

function loadMembersTable() {
    const tbody = document.getElementById('members-table-body');
    const members = JSON.parse(localStorage.getItem('fitverse_members') || '[]');
    const payments = JSON.parse(localStorage.getItem('fitverse_payments') || '[]');

    updateDashboardStats(members);
    loadPaymentsTable(payments); // Load second table

    if (!tbody) return;
    tbody.innerHTML = '';

    if (members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color: #666; padding: 30px;">No operative records found.</td></tr>';
        return;
    }

    members.forEach(m => {
        // Find subscription Plan
        const payment = payments.find(p => p.user && p.user.toLowerCase() === m.name.toLowerCase());
        const plan = payment ? payment.plan : 'Free Tier';
        const planColor = payment ? '#FDB915' : '#888';

        const tr = document.createElement('tr');
        let badgeClass = 'badge-blue';
        if (m.goal && m.goal.includes('Loss')) badgeClass = 'badge-green';
        if (m.goal && m.goal.includes('Muscle')) badgeClass = 'badge-purple';

        tr.innerHTML = `
            <td><strong style="color:#fff;">${m.name}</strong></td>
            <td>${m.height}cm / ${m.weight}kg</td>
            <td><span style="color:${planColor}; font-weight:bold;">${plan}</span></td>
            <td><span class="badge ${badgeClass}">${m.goal || 'General'}</span></td>
            <td style="color:#888;">${m.date}</td>
            <td><span style="color:#4cd964;">● Active</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function loadPaymentsTable(payments) {
    const tbody = document.getElementById('payments-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!payments || payments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color: #666; padding: 30px;">No transaction records found.</td></tr>';
        return;
    }

    payments.forEach(p => {
        const tr = document.createElement('tr');
        const methodBadge = `<span style="text-transform: uppercase; font-size: 0.7rem; color: #888; border: 1px solid #444; padding: 2px 6px; border-radius: 4px;">${p.method || 'Card'}</span>`;

        tr.innerHTML = `
            <td><strong style="color:#fff;">${p.user}</strong></td>
            <td>${p.plan}</td>
            <td style="color:var(--primary); font-weight:bold;">${p.amount}</td>
            <td>${methodBadge}</td>
            <td style="color:#888;">${p.date}</td>
            <td style="color:#888;">${p.time || '12:00 PM'}</td>
            <td><span style="color:#4cd964;">● Completed</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function seedDatabase() {
    // Seed Members only if keys don't exist at all (sterile state)
    const currentMembers = localStorage.getItem('fitverse_members');
    if (currentMembers === null) {
        console.log("Seeding Database with Dummy Members...");
        const mockMembers = [
            { name: "Sarah Connor", height: "165", weight: "58", goal: "Muscle Gain", date: "10/24/2025" },
            { name: "John Wick", height: "185", weight: "82", goal: "Endurance", date: "10/23/2025" },
            { name: "Bruce Wayne", height: "188", weight: "95", goal: "Muscle Gain", date: "10/22/2025" },
            { name: "Diana Prince", height: "178", weight: "65", goal: "Flexibility", date: "10/22/2025" },
            { name: "Tony Stark", height: "175", weight: "70", goal: "Weight Loss", date: "10/21/2025" }
        ];
        localStorage.setItem('fitverse_members', JSON.stringify(mockMembers));
    }

    // Seed Payments
    if (localStorage.getItem('fitverse_payments') === null) {
        const mockPayments = [
            { id: 'FIT-9921', date: 'Oct 24, 2025', time: '10:15 AM', user: 'Sarah Connor', plan: 'Monthly Pro', amount: '$59.00', method: 'card', status: 'Completed' },
            { id: 'FIT-9920', date: 'Oct 24, 2025', time: '11:30 AM', user: 'Guest User', plan: 'Daily Pass', amount: '$15.00', method: 'paypal', status: 'Completed' },
            { id: 'FIT-9919', date: 'Oct 23, 2025', time: '02:45 PM', user: 'John Wick', plan: 'Annual Elite', amount: '$599.00', method: 'crypto', status: 'Completed' },
            { id: 'FIT-9918', date: 'Oct 22, 2025', time: '08:20 AM', user: 'Bruce Wayne', plan: 'Monthly Pro', amount: '$59.00', method: 'card', status: 'Pending' },
            { id: 'FIT-9917', date: 'Oct 21, 2025', time: '09:00 PM', user: 'Tony Stark', plan: 'Quarterly', amount: '$149.00', method: 'card', status: 'Completed' }
        ];
        localStorage.setItem('fitverse_payments', JSON.stringify(mockPayments));
    }
}

function setupAdminInteractions() {
    // Mobile Sidebar Toggle
    const toggle = document.getElementById('adminMenuToggle');
    const sidebar = document.getElementById('adminSidebar');
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Admin Search Filtering
    const searchInput = document.getElementById('adminSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();

            // Filter Members Table
            const memberRows = document.querySelectorAll('#members-table-body tr');
            memberRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });

            // Filter Transactions Table
            const transactionRows = document.querySelectorAll('#payments-table-body tr');
            transactionRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }

    // Wipe Data Trigger
    const wipeBtn = document.getElementById('wipe-data-btn');
    if (wipeBtn) {
        wipeBtn.addEventListener('click', () => {
            if (confirm("⚠️ WARNING: This will permanently ERASE all member records and transaction history. This action cannot be undone. \n\nAre you sure you want to initialize system wipe?")) {
                wipeAllData();
            }
        });
    }

    // Sidebar View Switching
    const textLinks = document.querySelectorAll('.sidebar-link[data-view]');
    const views = document.querySelectorAll('.admin-view-section');

    textLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Active State
            textLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const viewName = link.getAttribute('data-view');

            // View Switching
            const targetId = `view-${viewName}`;
            views.forEach(view => {
                if (view.id === targetId) {
                    view.style.display = 'block';
                    view.classList.add('animate-fade');
                } else {
                    view.style.display = 'none';
                }
            });

            // Trigger Specific Actions
            if (viewName === 'analytics') {
                renderCharts(); // Render only when visible
            }
            // Removed loadRevenueTable call as it is no longer used


            // Mobile: Close menu on selection
            if (sidebar && window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
}

// --- Core Initialization ---
function initApp() {
    renderSharedComponents();

    // Intelligent Routing: Check which page we are on
    if (document.getElementById('adminLayout')) {
        // We are on Admin Page
        initAdmin();
    } else {
        // We are on Public Pages
        initBMI();
        initJoin();
        initPayment();
    }

    // Global Animations
    setupScrollAnimations();
    setupScrollSpy();
}

// Global chart instances
let revenueChartInstance = null;
let goalsChartInstance = null;

function renderCharts() {
    try {
        if (typeof Chart === 'undefined') {
            console.error("Chart.js not loaded");
            return;
        }

        // Colors
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#FDB915';
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#ff073a';

        // Data Processing
        const members = JSON.parse(localStorage.getItem('fitverse_members') || '[]');
        const payments = JSON.parse(localStorage.getItem('fitverse_payments') || '[]');

        // --- 1. Goal Distribution Data ---
        const goalCounts = { 'Weight Loss': 0, 'Muscle Gain': 0, 'Endurance': 0, 'Flexibility': 0 };
        members.forEach(m => {
            const g = m.goal || 'Weight Loss'; // Fallback
            if (goalCounts[g] !== undefined) goalCounts[g]++;
            else goalCounts['Weight Loss']++;
        });
        const goalData = Object.values(goalCounts);

        // --- 2. Revenue Trend Data ---
        let totalRev = 0;
        payments.forEach(p => {
            let val = 0;
            if (typeof p.amount === 'number') {
                val = p.amount;
            } else if (typeof p.amount === 'string') {
                val = parseFloat(p.amount.replace(/[^0-9.]/g, '')) || 0;
            }
            totalRev += val;
        });

        // Create a dummy trend 
        const revData = [
            totalRev * 0.2,
            totalRev * 0.35,
            totalRev * 0.5,
            totalRev * 0.65,
            totalRev * 0.8,
            totalRev
        ].map(v => Math.max(v, 0));

        const ctxRevenue = document.getElementById('revenueChart');
        const ctxGoals = document.getElementById('goalsChart');

        // Revenue Chart
        if (ctxRevenue) {
            if (revenueChartInstance) revenueChartInstance.destroy();
            revenueChartInstance = new Chart(ctxRevenue, {
                type: 'line',
                data: {
                    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Cumulative Revenue ($)',
                        data: revData,
                        borderColor: primaryColor,
                        backgroundColor: 'rgba(253, 185, 21, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#000',
                        pointBorderColor: primaryColor
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } },
                        x: { grid: { display: false }, ticks: { color: '#888' } }
                    }
                }
            });
        }

        // Goals Chart
        if (ctxGoals) {
            if (goalsChartInstance) goalsChartInstance.destroy();
            goalsChartInstance = new Chart(ctxGoals, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(goalCounts),
                    datasets: [{
                        data: goalData.some(x => x > 0) ? goalData : [1, 1, 1, 1], // Fallback if empty
                        backgroundColor: ['#4cd964', secondaryColor, '#3498db', primaryColor],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#fff' } }
                    },
                    cutout: '75%'
                }
            });
        }
    } catch (err) {
        console.error("Error rendering charts:", err);
    }
}



function updateDashboardStats(members) {
    if (!members) members = JSON.parse(localStorage.getItem('fitverse_members') || '[]');
    const payments = JSON.parse(localStorage.getItem('fitverse_payments') || '[]');

    // 1. Overview Tab Stats
    const totalEl = document.getElementById('stats-total');
    const newEl = document.getElementById('stats-new');
    const avgBmiEl = document.getElementById('stats-avg-bmi');

    if (totalEl) totalEl.textContent = members.length;

    // Avg BMI
    if (avgBmiEl) {
        if (members.length > 0) {
            const sumBmi = members.reduce((acc, m) => {
                const hM = (parseFloat(m.height) || 160) / 100;
                const bmi = (parseFloat(m.weight) || 60) / (hM * hM);
                return acc + bmi;
            }, 0);
            avgBmiEl.textContent = (sumBmi / members.length).toFixed(1);
        } else {
            avgBmiEl.textContent = '--';
        }
    }

    // Today's Inflow (loose check)
    if (newEl) {
        const today = new Date().toLocaleDateString();
        const todayCount = members.filter(m => m.date && m.date.includes(today)).length;
        newEl.textContent = todayCount;
    }

    // 2. Revenue Tab Stats
    const revTotalEl = document.getElementById('rev-total');
    const revMonthlyEl = document.getElementById('rev-monthly');
    const revPendingEl = document.getElementById('rev-pending');

    // Calculate Financials
    let totalRevenue = 0;
    let monthlyRec = 0;
    let pendingAmt = 0;

    payments.forEach(p => {
        const amt = parseFloat(p.amount.replace('$', '').replace(',', '')) || 0;

        // Total
        if (p.status === 'Completed') {
            totalRevenue += amt;
            // Monthly Recurring (Simple logic: if plan is Monthly)
            if (p.plan && p.plan.includes('Monthly')) {
                monthlyRec += amt;
            }
        }
        // Pending
        if (p.status === 'Pending') {
            pendingAmt += amt;
        }
    });

    if (revTotalEl) revTotalEl.textContent = '$' + totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 });
    if (revMonthlyEl) revMonthlyEl.textContent = '$' + monthlyRec.toLocaleString(undefined, { minimumFractionDigits: 2 });
    if (revPendingEl) revPendingEl.textContent = '$' + pendingAmt.toLocaleString(undefined, { minimumFractionDigits: 2 });

    // Update Overview Card too (Revenue Stream)
    const overallRevCard = document.querySelector('.stats-deck .saas-card:last-child .card-value');
    if (overallRevCard) {
        // Format as 12.4K if large
        overallRevCard.textContent = totalRevenue > 1000
            ? '$' + (totalRevenue / 1000).toFixed(1) + 'K'
            : '$' + totalRevenue;
    }
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

// --- Admin Login Logic ---
function initAdminLogin() {
    console.log("Initializing Admin Login...");

    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const msg = document.getElementById('login-msg');
        const btn = loginForm.querySelector('button');

        // Simple Hardcoded Auth (For Demo)
        if (user === 'admin' && pass === 'admin123') {
            btn.textContent = 'ACCESS GRANTED';
            btn.style.background = '#4cd964';
            btn.style.color = '#fff';
            msg.textContent = 'Redirecting to Command Center...';
            msg.style.color = '#4cd964';
            msg.style.opacity = '1';

            // Simulate loading
            setTimeout(() => {
                window.location.href = 'admin_dashboard.html';
            }, 1500);
        } else {
            msg.textContent = 'Access Denied: Invalid Credentials';
            msg.style.color = '#ff073a';
            msg.style.opacity = '1';

            // Shake animation effect
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
        }
    });
}

function exportForNotepad() {
    const members = JSON.parse(localStorage.getItem('fitverse_members') || '[]');
    const payments = JSON.parse(localStorage.getItem('fitverse_payments') || '[]');

    if (members.length === 0) {
        alert("No data to export.");
        return;
    }

    // Advanced Text Formatting
    let content = "";
    content += "=================================================================================\n";
    content += "                          FITVERSE AI - OPERATIVE DATABASE                        \n";
    content += "=================================================================================\n\n";
    content += `GENERATED ON: ${new Date().toLocaleString()}\n`;
    content += `TOTAL OPERATIVES: ${members.length}\n\n`;

    content += "OPERATIVE ROSTER:\n";
    content += "------------------------------------------------------------------------------------------------------\n";
    content += "| NAME                |  METRICS      |  SUBSCRIPTION     |  DIRECTIVE       |  JOIN DATE  |  STATUS  |\n";
    content += "|---------------------|---------------|-------------------|------------------|-------------|----------|\n";

    members.forEach(m => {
        // Resolve Plan
        const payment = payments.find(p => p.user && p.user.toLowerCase() === m.name.toLowerCase());
        const plan = payment ? payment.plan : 'Free Tier';

        // Pad strings
        const p = (s, l) => (s + "                              ").substring(0, l);

        const name = p(m.name, 19);
        const metr = p(`${m.height}/${m.weight}`, 13);
        const sub = p(plan, 17);
        const goal = p(m.goal || 'General', 16);
        const date = p(m.date || '--', 11);
        const stat = p('Active', 8);

        content += `| ${name} | ${metr} | ${sub} | ${goal} | ${date} | ${stat} |\n`;
    });

    content += "------------------------------------------------------------------------------------------------------\n";
    content += "\nEND OF TRANSMISSION.";

    // Download Logic
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fitverse-memberlist.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function wipeAllData() {
    console.log("System Wipe Initialized...");

    // Clear LocalStorage keys
    localStorage.removeItem('fitverse_members');
    localStorage.removeItem('fitverse_payments');

    // Also set to empty arrays to prevent immediate re-seeding if logic allows
    localStorage.setItem('fitverse_members', JSON.stringify([]));
    localStorage.setItem('fitverse_payments', JSON.stringify([]));

    // Refresh UI
    loadMembersTable();

    // Show Notification
    alert("SYSTEM WIPE COMPLETE. All operative and transaction records have been purged.");

    // Redirect or refresh to ensure sterile state
    window.location.reload();
}
