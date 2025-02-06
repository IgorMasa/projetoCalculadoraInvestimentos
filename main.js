import { generateReturnsArray } from './src/investmentGoals.js';

const form = document.getElementById('investment-form');
const clearFormBtn = document.getElementById('clear-form');

function renderProgression(evt) {
    evt.preventDefault();
    if (document.querySelector('.error')) {
        return;
    }
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

    console.log(returnsArray);
}

function clearForm() {
    form['starting-amount'].value = '';
    form['additional-contribution'].value = '';
    form['time-amount'].value = '';
    form['return-rate'].value = '';
    form['tax-rate'].value = '';

    const errorInputContainers = document.querySelectorAll('.error');

    for (const errorInputContainer of errorInputContainers) {
        errorInputContainer.classList.remove('error');
        errorInputContainer.parentElement.querySelector('p').remove();
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

form.addEventListener('submit', renderProgression);
clearFormBtn.addEventListener('click', clearForm);
