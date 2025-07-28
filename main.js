document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const amountInput = document.getElementById('amount');
    const expenseChart = document.getElementById('expense-chart');

    //Generate year options dinamically
    for (let year = 2010; year <= 2040; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    };

    //Initialize expense objects with categories
    const expenses = {
        January: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        February: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        March: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        April: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        May: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        June: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        July: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        August: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        September: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        October: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        November: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        December: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
    };

    //Load expenses
    function getExpensesFromLocalStorage(month, year) {
        const key = `${month}-${year}`;
        return JSON.parse(localStorage.getItem(key)) || {};
    }

    //Save expenses
    function saveExpensesToLocalStorage(month, year) {
        const key = `${month}-${year}`;
        localStorage.setItem(key, JSON.stringify(expenses[month]));
    }

    //Handle form submission
    function handleSubmit(event) {
        event.preventDefault();
        
        const selectedMonth = monthSelect.value;
        const selectedYear = yearSelect.value;
        const category = event.target.category.value;
        const amount = parseFloat(event.target.amount.value);

        if (!selectedMonth || !selectedYear) {
            alert('Month or year not selected');
            return;
        }

        if (!expenses[selectedMonth]) {
            expenses[selectedMonth] = { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 };
        }

        const expenseData = getExpensesFromLocalStorage(selectedMonth, selectedYear);
        Object.assign(expenses[selectedMonth], expenseData);

        const currentAmount = expenses[selectedMonth][category] || 0;

        if (amount > 0) {
            expenses[selectedMonth][category] = currentAmount + amount; 
        } else if (amount < 0 && currentAmount >= Math.abs(amount)) {
            expenses[selectedMonth][category] = currentAmount + amount;
        } else {
            alert('Invalid amount: Cannot reduce the category below zero.')
        }

        console.log(expenses[selectedMonth]);
        saveExpensesToLocalStorage(selectedMonth, selectedYear);
        amountInput.value = '';
    }

    expenseForm.addEventListener('submit', handleSubmit);

    //Set default month and year based on current month and year
    function setDefaultMonthYear() {
        const now = new Date();
        const initialMonth = now.toLocaleString('default', { month: 'long'});
        const initialYear = now.getFullYear();
        monthSelect.value = initialMonth;
        yearSelect.value = initialYear;
    };

    setDefaultMonthYear();
});