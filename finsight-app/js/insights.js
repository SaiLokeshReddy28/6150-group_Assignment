/**
 * Insights Page JavaScript
 * Author: Person 4
 */

document.addEventListener('DOMContentLoaded', function() {

    // Monthly Trend Chart
    const monthlyTrendCtx = document.getElementById('monthlyTrendChart');
    if (monthlyTrendCtx) {
        new Chart(monthlyTrendCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Monthly Spending',
                    data: [2800, 3100, 2900, 3200, 2700, 2900, 3000, 2800, 3100, 2900],
                    borderColor: '#4A90E2',
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => 'Spent: $' + context.parsed.y.toLocaleString()
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => '$' + value.toLocaleString()
                        }
                    }
                }
            }
        });
    }

    // Category Pie Chart
    const categoryPieCtx = document.getElementById('categoryPieChart');
    if (categoryPieCtx) {
        new Chart(categoryPieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping'],
                datasets: [{
                    data: [35, 20, 15, 20, 10],
                    backgroundColor: [
                        '#4A90E2', '#50C878', '#F39C12', '#E74C3C', '#9B59B6'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => context.label + ': ' + context.parsed + '%'
                        }
                    }
                }
            }
        });
    }

    // View Type Toggle
    document.querySelectorAll('[name="viewType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            console.log('View changed to:', this.id);
        });
    });

    // Filter selects
    document.getElementById('timePeriodSelect').addEventListener('change', function() {
        console.log('Time period:', this.value);
    });

    document.getElementById('categorySelect').addEventListener('change', function() {
        console.log('Category:', this.value);
    });

    console.log('✅ Insights page initialized');
    console.log('📊 Charts rendered successfully');
});