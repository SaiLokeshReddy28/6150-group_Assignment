/**
 * Finsight - Dashboard JavaScript
 * Author: Finsight Team - Sai Lokesh Reddy Nandavarapu
 */

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('✅ Dashboard initialized');

    // ==========================================
    // SIDEBAR TOGGLE FUNCTIONALITY
    // ==========================================
    
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            // On mobile, toggle show/hide
            if (window.innerWidth <= 992) {
                sidebar.classList.toggle('show');
            } else {
                // On desktop, toggle collapsed
                sidebar.classList.toggle('collapsed');
            }
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('show');
        }
    });

    // ==========================================
    // SPENDING TREND CHART
    // ==========================================
    
    const spendingTrendCtx = document.getElementById('spendingTrendChart');
    if (spendingTrendCtx) {
        const spendingTrendChart = new Chart(spendingTrendCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Daily Spending',
                    data: [320, 450, 280, 390, 520, 680, 450],
                    borderColor: '#4A90E2',
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#4A90E2',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#2C3E50',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return 'Spent: $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            },
                            color: '#7F8C8D'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#7F8C8D'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
        // Trend Period Toggle
        const trendPeriodRadios = document.querySelectorAll('[name="trendPeriod"]');
        trendPeriodRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                console.log('Trend period changed to:', this.id);
                
                // Update chart data based on selection
                let newData, newLabels;
                
                if (this.id === 'trend7days') {
                    newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    newData = [320, 450, 280, 390, 520, 680, 450];
                } else if (this.id === 'trend30days') {
                    newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                    newData = [2100, 2450, 2280, 2890];
                } else if (this.id === 'trend90days') {
                    newLabels = ['Month 1', 'Month 2', 'Month 3'];
                    newData = [8500, 9200, 8700];
                }
                
                spendingTrendChart.data.labels = newLabels;
                spendingTrendChart.data.datasets[0].data = newData;
                spendingTrendChart.update();
            });
        });
    }

    // ==========================================
    // CATEGORY PIE CHART
    // ==========================================
    
    const categoryChartCtx = document.getElementById('categoryChart');
    if (categoryChartCtx) {
        new Chart(categoryChartCtx, {
            type: 'doughnut',
            data: {
                labels: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping'],
                datasets: [{
                    data: [35, 20, 15, 20, 10],
                    backgroundColor: [
                        '#4A90E2',  // Primary - Food
                        '#50C878',  // Success - Transport
                        '#F39C12',  // Warning - Entertainment
                        '#E74C3C',  // Danger - Bills
                        '#9B59B6'   // Purple - Shopping
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            },
                            color: '#2C3E50',
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#2C3E50',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }

    // ==========================================
    // STATISTICS ANIMATION
    // ==========================================
    
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = '$' + value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Animate stat values on page load
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach((stat, index) => {
        const text = stat.textContent.replace(/[$,]/g, '');
        const value = parseInt(text);
        if (!isNaN(value)) {
            stat.textContent = '$0';
            setTimeout(() => {
                animateValue(stat, 0, value, 1500);
            }, index * 200);
        }
    });

    // ==========================================
    // QUICK ACTION BUTTONS
    // ==========================================
    
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // If it's a placeholder link (href="#"), prevent default and show message
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                console.log('Quick action clicked:', this.querySelector('span').textContent);
                // You can add a toast notification here
                alert('This feature will be implemented soon!');
            }
        });
    });

    // ==========================================
    // TABLE ROW CLICK
    // ==========================================
    
    const tableRows = document.querySelectorAll('.table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            console.log('Transaction clicked:', this.cells[1].textContent);
            // You can open a modal or navigate to transaction details
        });
    });

    // ==========================================
    // SEARCH FUNCTIONALITY
    // ==========================================
    
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            console.log('Searching for:', searchTerm);
            
            // Filter table rows
            if (searchTerm.length > 0) {
                tableRows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            } else {
                tableRows.forEach(row => {
                    row.style.display = '';
                });
            }
        });
    }

    // ==========================================
    // NOTIFICATION ICON CLICK
    // ==========================================
    
    const notificationIcon = document.querySelector('.notification-icon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', function() {
            console.log('Notifications clicked');
            // You can show a dropdown or modal with notifications
            alert('You have 3 new notifications!\n\n1. Budget alert: Entertainment\n2. New transaction detected\n3. Monthly report ready');
        });
    }

    // ==========================================
    // ALERT AUTO-DISMISS
    // ==========================================
    
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 10000);
    });

    // ==========================================
    // REAL-TIME CLOCK (Optional Enhancement)
    // ==========================================
    
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        
        // You can add this to the header if needed
        console.log('Current time:', timeString, dateString);
    }
    
    // Update clock every minute
    updateClock();
    setInterval(updateClock, 60000);

    // ==========================================
    // DUMMY DATA FOR DEMONSTRATION
    // ==========================================
    
    const dashboardData = {
        totalBalance: 12450,
        monthlySpending: 2845,
        savingsGoal: 8200,
        budgetUsed: 81,
        recentTransactions: [
            { date: 'Oct 10, 2025', description: 'Starbucks Coffee', category: 'Food', amount: -15.50 },
            { date: 'Oct 9, 2025', description: 'Amazon Purchase', category: 'Shopping', amount: -89.99 },
            { date: 'Oct 8, 2025', description: 'Shell Gas Station', category: 'Transport', amount: -45.00 },
            { date: 'Oct 7, 2025', description: 'Salary Deposit', category: 'Income', amount: 3500.00 },
            { date: 'Oct 6, 2025', description: 'Netflix Subscription', category: 'Entertainment', amount: -15.99 }
        ],
        categoryBreakdown: {
            food: 35,
            transport: 20,
            entertainment: 15,
            bills: 20,
            shopping: 10
        }
    };
    
    console.log('📊 Dashboard data loaded:', dashboardData);

    // ==========================================
    // CONSOLE SUMMARY
    // ==========================================
    
    console.log('✅ Dashboard JavaScript fully loaded');
    console.log('🎨 Charts initialized');
    console.log('🔄 Event listeners attached');
    console.log('📱 Responsive handlers ready');
    
});