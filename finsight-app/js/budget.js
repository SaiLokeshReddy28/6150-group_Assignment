/**
 * Finsight - Budget Planning JavaScript
 * Person 3: Budget Page Functionality
 * Author: Finsight Team
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // DUMMY DATA FOR BUDGET CATEGORIES
    // ==========================================
    
    const budgetData = [
        {
            id: 1,
            category: 'Housing',
            icon: 'fa-home',
            color: 'primary',
            budget: 1200,
            spent: 800,
            description: 'Rent & Utilities'
        },
        {
            id: 2,
            category: 'Food & Dining',
            icon: 'fa-utensils',
            color: 'warning',
            budget: 500,
            spent: 425,
            description: 'Groceries & Restaurants'
        },
        {
            id: 3,
            category: 'Transportation',
            icon: 'fa-car',
            color: 'info',
            budget: 300,
            spent: 150,
            description: 'Gas & Public Transit'
        },
        {
            id: 4,
            category: 'Entertainment',
            icon: 'fa-film',
            color: 'danger',
            budget: 400,
            spent: 340,
            description: 'Movies & Recreation'
        },
        {
            id: 5,
            category: 'Utilities',
            icon: 'fa-bolt',
            color: 'secondary',
            budget: 200,
            spent: 180,
            description: 'Electric & Internet'
        },
        {
            id: 6,
            category: 'Shopping',
            icon: 'fa-shopping-bag',
            color: 'success',
            budget: 400,
            spent: 170,
            description: 'Clothing & Personal'
        }
    ];
    
    
    // ==========================================
    // FILTER FUNCTIONALITY
    // ==========================================
    
    const categoryFilter = document.getElementById('categoryFilter');
    const periodFilter = document.getElementById('periodFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            console.log('Filter by category:', selectedCategory);
            
            // TODO: Filter budget cards based on selection
            // For now, just log the selection
            
            if (selectedCategory === 'all') {
                showAllBudgets();
            } else {
                filterBudgetsByCategory(selectedCategory);
            }
        });
    }
    
    if (periodFilter) {
        periodFilter.addEventListener('change', function() {
            const selectedPeriod = this.value;
            console.log('Filter by period:', selectedPeriod);
            
            // TODO: Update data based on time period
            // For now, just log the selection
        });
    }
    
    
    // ==========================================
    // VIEW TYPE TOGGLE (Monthly/Yearly)
    // ==========================================
    
    const monthlyView = document.getElementById('monthlyView');
    const yearlyView = document.getElementById('yearlyView');
    
    if (monthlyView && yearlyView) {
        monthlyView.addEventListener('change', function() {
            if (this.checked) {
                console.log('Switched to Monthly View');
                // TODO: Show monthly data
            }
        });
        
        yearlyView.addEventListener('change', function() {
            if (this.checked) {
                console.log('Switched to Yearly View');
                // TODO: Show yearly data
            }
        });
    }
    
    
    // ==========================================
    // CREATE BUDGET MODAL FUNCTIONALITY
    // ==========================================
    
    const saveBudgetBtn = document.getElementById('saveBudgetBtn');
    const createBudgetForm = document.getElementById('createBudgetForm');
    
    if (saveBudgetBtn && createBudgetForm) {
        saveBudgetBtn.addEventListener('click', function() {
            
            // Get form values
            const monthlyIncome = document.getElementById('monthlyIncome').value;
            const budgetCategory = document.getElementById('budgetCategory').value;
            const budgetAmount = document.getElementById('budgetAmount').value;
            const timePeriod = document.getElementById('timePeriod').value;
            const budgetNotes = document.getElementById('budgetNotes').value;
            
            // Validate form
            if (!createBudgetForm.checkValidity()) {
                createBudgetForm.classList.add('was-validated');
                return;
            }
            
            // Create budget object
            const newBudget = {
                id: budgetData.length + 1,
                monthlyIncome: parseFloat(monthlyIncome),
                category: budgetCategory,
                amount: parseFloat(budgetAmount),
                period: timePeriod,
                notes: budgetNotes,
                spent: 0, // Initial spent amount
                createdDate: new Date().toISOString()
            };
            
            console.log('New Budget Created:', newBudget);
            
            // TODO: Add the new budget to the page dynamically
            // For now, just show success message
            
            // Show success message
            alert('Budget created successfully! 🎉');
            
            // Reset form
            createBudgetForm.reset();
            createBudgetForm.classList.remove('was-validated');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('createBudgetModal'));
            modal.hide();
            
            // TODO: Refresh the budget cards to show new budget
        });
    }
    
    
    // ==========================================
    // EDIT/DELETE BUDGET FUNCTIONALITY
    // ==========================================
    
    // Get all dropdown menus in budget cards
    const dropdownItems = document.querySelectorAll('.budget-card .dropdown-item');
    
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const action = this.textContent.trim();
            const budgetCard = this.closest('.budget-card');
            const categoryName = budgetCard.querySelector('h6').textContent;
            
            if (action.includes('Edit')) {
                console.log('Edit budget:', categoryName);
                // TODO: Open edit modal with pre-filled data
                alert('Edit functionality will be added! 📝');
            } else if (action.includes('Delete')) {
                const confirmDelete = confirm(`Are you sure you want to delete the ${categoryName} budget?`);
                if (confirmDelete) {
                    console.log('Delete budget:', categoryName);
                    // TODO: Remove budget from data and DOM
                    alert('Budget deleted! 🗑️');
                }
            }
        });
    });
    
    
    // ==========================================
    // DISMISS INSIGHT ALERTS
    // ==========================================
    
    const alertCloseButtons = document.querySelectorAll('.alert .btn-close');
    
    alertCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const alert = this.closest('.alert');
            alert.style.transition = 'opacity 0.3s ease';
            alert.style.opacity = '0';
            
            setTimeout(() => {
                alert.remove();
            }, 300);
        });
    });
    
    
    // ==========================================
    // EXPORT BUDGET REPORT
    // ==========================================
    
    const exportButton = document.querySelector('button:has(.fa-download)');
    
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            console.log('Exporting budget report...');
            
            // TODO: Generate PDF or CSV of budget data
            // For now, just show a message
            alert('Export functionality will be added! 📊\n\nYour budget report will be downloaded as PDF.');
        });
    }
    
    
    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    
    /**
     * Show all budget cards
     */
    function showAllBudgets() {
        const budgetCards = document.querySelectorAll('.budget-card');
        budgetCards.forEach(card => {
            card.style.display = 'block';
        });
    }
    
    /**
     * Filter budget cards by category
     */
    function filterBudgetsByCategory(category) {
        const budgetCards = document.querySelectorAll('.budget-card');
        
        budgetCards.forEach(card => {
            const cardCategory = card.querySelector('h6').textContent.toLowerCase();
            const categoryMatch = cardCategory.includes(category.toLowerCase());
            
            if (categoryMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    /**
     * Calculate budget percentage
     */
    function calculatePercentage(spent, budget) {
        return Math.round((spent / budget) * 100);
    }
    
    /**
     * Get status badge based on percentage
     */
    function getStatusBadge(percentage) {
        if (percentage < 60) {
            return { text: 'Good', color: 'success' };
        } else if (percentage < 80) {
            return { text: 'Caution', color: 'warning' };
        } else {
            return { text: 'Warning', color: 'danger' };
        }
    }
    
    /**
     * Format currency
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    /**
     * Update summary cards with calculated totals
     */
    function updateSummaryCards() {
        const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
        const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
        const remaining = totalBudget - totalSpent;
        const percentageUsed = calculatePercentage(totalSpent, totalBudget);
        
        console.log('Summary:', {
            totalBudget: formatCurrency(totalBudget),
            totalSpent: formatCurrency(totalSpent),
            remaining: formatCurrency(remaining),
            percentageUsed: percentageUsed + '%'
        });
        
        // TODO: Update the DOM with these values
    }
    
    /**
     * Generate AI insights based on budget data
     */
    function generateInsights() {
        const insights = [];
        
        budgetData.forEach(budget => {
            const percentage = calculatePercentage(budget.spent, budget.budget);
            
            if (percentage > 80) {
                insights.push({
                    type: 'warning',
                    category: budget.category,
                    message: `You've used ${percentage}% of your ${budget.category} budget. Consider reducing spending.`
                });
            } else if (percentage < 50) {
                insights.push({
                    type: 'success',
                    category: budget.category,
                    message: `Great job! You're only at ${percentage}% of your ${budget.category} budget.`
                });
            }
        });
        
        console.log('Generated Insights:', insights);
        return insights;
    }
    
    
    // ==========================================
    // INITIALIZE PAGE
    // ==========================================
    
    console.log('Budget Planning Page Initialized');
    console.log('Budget Data:', budgetData);
    
    // Update summary on load
    updateSummaryCards();
    
    // Generate initial insights
    generateInsights();
    
});