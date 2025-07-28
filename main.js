document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const amountInput = document.getElementById('amount');
    const expenseChart = document.getElementById('expense-chart');

    let selectedMonth;
    let selectedYear;
    let myChart;

    //Generate year options dinamically
    for (let year = 2010; year <= 2040; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    };

    //Initialize expense objects with categories
    const expenses = {
        Enero: { Hogar: 0, Alimento: 0, Transporte: 0, Facturas: 0, Otros: 0 },
        Febrero: { Hogar: 0, Alimento: 0, Transporte: 0, Facturas: 0, Otros: 0 },
        Marzo: { Hogar: 0, Alimento: 0, Transporte: 0, Facturas: 0, Otros: 0 },
        Abril: { Hogar: 0, Alimento: 0, Transporte: 0, Facturas: 0, Otros: 0 },
        Mayo: { Hogar: 0, Alimento: 0, Transporte: 0, Facturas: 0, Otros: 0 },
        Junio: { Hogar: 0, Alimento: 0, Transporte: 0, Facturas: 0, Otros: 0 },
        Julio: { Hogar: 0, Alimento: 0, Transporte: 0, Facturas: 0, Otros: 0 },
        Agosto: { Hogar: 0, Alimento: 0, Transporte: 0, Facturas: 0, Otros: 0 },
        Septiembre: { Hogar: 0, Alimento: 0, Transporte: 0, Facturas: 0, Otros: 0 },
        Octubre: { Hogar: 0, Alimento: 0, Transporte: 0, Facturas: 0, Otros: 0 },
        Noviembre: { Hogar: 0, Alimento: 0, Transporte: 0, Facturas: 0, Otros: 0 },
        Diciembre: { Hogar: 0, Alimento: 0, Transporte: 0, Facturas: 0, Otros: 0 },
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

    //Get Selected Month and Year
    function getSelectedMonthYear() {
        selectedMonth = monthSelect.value;
        selectedYear = yearSelect.value;

        if (!selectedMonth || !selectedYear) {
            alert('Mes o Año no seleccionados');
            return;
        }

        if (!expenses[selectedMonth]) {
            expenses[selectedMonth] = { Hogar: 0, Alimento: 0, Transporte: 0, Facturas: 0, Otros: 0 };
        }
    }

    //Update Chart
    function updateChart() {
        getSelectedMonthYear();

        const expenseData = getExpensesFromLocalStorage(selectedMonth, selectedYear);
        Object.assign(expenses[selectedMonth], expenseData);

        const ctx = expenseChart.getContext('2d');

        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(expenses[selectedMonth]),
                datasets: [{
                    data: Object.values(expenses[selectedMonth]),
                    backgroundColor: [
                    '#FF6384',  // Hogar
                    '#4CAF50',  // Alimento
                    '#FFCE56',  // Transporte
                    '#36A2EB',  // Facturas
                    '#FF9F40'   // Otros
                    ],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.label}: $${tooltipItem.raw}`;
                            }
                        }
                    }
                }
            }
        });
    }

    //Handle form submission
    function handleSubmit(event) {
        event.preventDefault();
        getSelectedMonthYear();
        
        const selectedMonth = monthSelect.value;
        const selectedYear = yearSelect.value;
        const category = event.target.category.value;
        const amount = parseFloat(event.target.amount.value);

        const currentAmount = expenses[selectedMonth][category] || 0;

        if (amount > 0) {
            expenses[selectedMonth][category] = currentAmount + amount; 
        } else if (amount < 0 && currentAmount >= Math.abs(amount)) {
            expenses[selectedMonth][category] = currentAmount + amount;
        } else {
            alert('Cantidad no válida: No se puede reducir la categoría a menor que cero.')
        }

        saveExpensesToLocalStorage(selectedMonth, selectedYear);
        updateChart();
        amountInput.value = '';
    }

    expenseForm.addEventListener('submit', handleSubmit);
    monthSelect.addEventListener('change', updateChart);
    yearSelect.addEventListener('change', updateChart);

    //Set default month and year based on current month and year
    function setDefaultMonthYear() {
        const now = new Date();
        const initialMonth = now.toLocaleString('default', { month: 'long'});
        const initialYear = now.getFullYear();
        monthSelect.value = initialMonth;
        yearSelect.value = initialYear;
    };

    setDefaultMonthYear();
    updateChart();
});