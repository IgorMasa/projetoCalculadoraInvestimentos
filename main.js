import { Chart } from 'chart.js/auto';
import { generateReturnsArray } from './src/investmentGoals.js';
import { createTable } from './src/table.js';

const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');

const form = document.getElementById('investment-form');
const clearFormBtn = document.getElementById('clear-form');

let doughnutChartReference = {};
let progressionChartReference = {};

const columnsArray = [
    { columnLabel: 'Mês', accessor: 'month' },
    {
        columnLabel: 'Total investido',
        accessor: 'investedAmount',
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
    {
        columnLabel: 'Rendimento mensal',
        accessor: 'interestReturns',
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
    {
        columnLabel: 'Rendimento total',
        accessor: 'totalInterestReturns',
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
    {
        columnLabel: 'Quantia total',
        accessor: 'totalAmount',
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
];

function formatCurrencyToTable(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

function formatCurrencyToGraph(value) {
    return value.toFixed(2);
}

function renderProgression(evt) {
    evt.preventDefault();
    if (document.querySelector('.error')) {
        return;
    }

    resetCharts();

    const startingAmount = Number(
        document.getElementById('starting-amount').value.replace(',', '.')
    );
    const additionalContribution = Number(
        document
            .getElementById('additional-contribution')
            .value.replace(',', '.')
    );
    const timeAmount = Number(document.getElementById('time-amount').value);
    const timeAmountPeriod =
        document.getElementById('time-amount-period').value;
    const returnRate = Number(
        document.getElementById('return-rate').value.replace(',', '.')
    );
    const returnRatePeriod = document.getElementById('evaluation-period').value;
    const taxRate = Number(
        document.getElementById('tax-rate').value.replace(',', '.')
    );

    const returnsArray = generateReturnsArray(
        startingAmount,
        timeAmount,
        timeAmountPeriod,
        additionalContribution,
        returnRate,
        returnRatePeriod
    );

    const finalInvestmentObject = returnsArray[returnsArray.length - 1];

    doughnutChartReference = new Chart(finalMoneyChart, {
        type: 'doughnut',
        data: {
            labels: ['Total investido', 'Rendimento', 'Imposto'],
            datasets: [
                {
                    data: [
                        formatCurrencyToGraph(
                            finalInvestmentObject.investedAmount
                        ),
                        formatCurrencyToGraph(
                            finalInvestmentObject.totalInterestReturns *
                                (1 - taxRate / 100)
                        ),
                        formatCurrencyToGraph(
                            finalInvestmentObject.totalInterestReturns *
                                (taxRate / 100)
                        ),
                    ],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                    ],
                    hoverOffset: 4,
                },
            ],
        },
    });

    progressionChartReference = new Chart(progressionChart, {
        type: 'bar',
        data: {
            labels: returnsArray.map(
                (investmentObject) => investmentObject.month
            ),
            datasets: [
                {
                    label: 'Total Investido',
                    backgroundColor: 'rgb(255,99,132)',
                    data: returnsArray.map((investmentObject) =>
                        formatCurrencyToGraph(investmentObject.investedAmount)
                    ),
                },
                {
                    label: 'Retorno do Investimento',
                    backgroundColor: 'rgb(54,162,235)',
                    data: returnsArray.map((investmentObject) =>
                        formatCurrencyToGraph(investmentObject.interestReturns)
                    ),
                },
            ],
        },
        options: {
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                },
            },
        },
    });
    createTable(columnsArray, returnsArray, 'results-table');
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function resetCharts() {
    if (
        !isObjectEmpty(doughnutChartReference) &&
        !isObjectEmpty(progressionChartReference)
    ) {
        doughnutChartReference.destroy();
        progressionChartReference.destroy();
    }
}

function clearForm() {
    form['starting-amount'].value = '';
    form['additional-contribution'].value = '';
    form['time-amount'].value = '';
    form['return-rate'].value = '';
    form['tax-rate'].value = '';

    resetCharts();

    const errorInputContainers = document.querySelectorAll('.error');

    for (const errorInputContainer of errorInputContainers) {
        errorInputContainer.classList.remove('error');
        errorInputContainer.parentElement.querySelector('p').remove();
    }
}

function clearTable() {
    if (document.querySelector('tbody') || document.querySelector('thead')) {
        const tbody = document.querySelectorAll('tbody');
        tbody.forEach((tag) => tag.remove());
        const thead = document.querySelectorAll('thead');
        thead.forEach((tag) => tag.remove());
    }
}

// Loop for para adicionar eventlistener em elementos do formulario que tenham simultaneamente uma tag chamada input e um atributo chamado name
for (const formElement of form) {
    if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
        formElement.addEventListener('blur', validateInput);
    }
}

function validateInput(evt) {
    if (evt.target.value === '') {
        return;
    }

    const parentElement = evt.target.parentElement; //pegando o elemento pai do campo de input (para poder pintar a borda de vermelho)
    const grandParentElement = evt.target.parentElement.parentElement; //pegando o elemento "avô" do campo input, ou seja, a div (para poder exibir a tag p com a mensagem de erro)
    const inputValue = evt.target.value.replace(',', '.');

    if (
        (!parentElement.classList.contains('error') && isNaN(inputValue)) ||
        Number(inputValue) <= 0
    ) {
        const errorTextElement = document.createElement('p');
        errorTextElement.classList.add('text-red-500'); //adicionando a classe que dá cor vermelha ao parágrafo p criado na linha anterior
        errorTextElement.innerText =
            'Insira um valor numérico e maior que zero';

        parentElement.classList.add('error');
        grandParentElement.appendChild(errorTextElement);
    } else if (
        parentElement.classList.contains('error') &&
        !isNaN(inputValue) &&
        Number(inputValue)
    ) {
        parentElement.classList.remove('error');
        grandParentElement.querySelector('p').remove();
    }
}

const mainEl = document.querySelector('main');
const carouselEl = document.getElementById('carousel');
const nextBtn = document.getElementById('slide-arrow-next');
const previousBtn = document.getElementById('slide-arrow-previous');

nextBtn.addEventListener('click', () => {
    carouselEl.scrollLeft += mainEl.clientWidth;
});

previousBtn.addEventListener('click', () => {
    carouselEl.scrollLeft -= mainEl.clientWidth;
});

form.addEventListener('submit', renderProgression);
clearFormBtn.addEventListener('click', clearForm);
clearFormBtn.addEventListener('click', clearTable);
