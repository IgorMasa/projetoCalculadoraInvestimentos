// Necessário para esse arquivo:

// Tailwindcss, objeto exatamente no formato do objeto columnObject e um array de dados vazio como columnsArray

// Função para verificar se o array passado é realmente um array e que ele não é vazio
const isNonEmptyArray = (array) => {
    return Array.isArray(array) && array.length > 0;
};

export const createTable = (columnsArray, dataArray, tableId) => {
    if (
        //esse if verifica se os argumentos fornecidos são arrays válidos e o tableId é um valor válido
        !isNonEmptyArray(columnsArray) ||
        !isNonEmptyArray(dataArray) ||
        !tableId
    ) {
        throw new Error(
            'Para a correta execução, precisamos de um array com as colunas, outro com as informações das linhas e o id da tabela a ser selecionada'
        );
    }
    const tableElement = document.getElementById(tableId);

    if (
        // Esse if verifica se o idTable é um valor válido, e ligado a uma tabela HTML
        !tableElement ||
        tableElement.nodeName !== 'TABLE'
    ) {
        throw new Error('ID informado não corresponde a nenhum elemento table');
    }

    createTableHeader(tableElement, columnsArray);
    createTableBody(tableElement, dataArray, columnsArray);
};

function createTableHeader(tableReference, columnsArray) {
    // Função abaixo cria o elemento thead, adiciona ele ao elemento table e retorna a referência de thead
    function createTheadElement(tableReference) {
        const thead = document.createElement('thead');
        tableReference.appendChild(thead);
        return thead;
    }
    const tableHeaderReference =
        tableReference.querySelector('thead') ?? //essa coalescência nula verifica com queryselector se o elemento thead existe
        createTheadElement(tableReference); //caso não exista, chama a função que cria um thead e retorna a referência dele

    const headerRow = document.createElement('tr');

    ['bg-blue-900', 'text-slate-200', 'sticky', 'top-0'].forEach((cssClass) =>
        headerRow.classList.add(cssClass)
    );

    for (const tableColumnObject of columnsArray) {
        // Esse for cria uma coluna para cada elemento do columnsArray, já formatando com as tags th
        const headerElement = /*html*/ `<th class='text-center'>${tableColumnObject.columnLabel}</th>`;
        headerRow.innerHTML += headerElement; //o final do for vai criando o headerRow, linha a linha (o innerHTML transforma a string em um elemento)
    }
    tableHeaderReference.appendChild(headerRow); //ao final apendamos o headerRow à constante que guarda a referência à tabela
}

function createTableBody(tableReference, tableItems, columnsArray) {
    function createTbodyElement(tableReference) {
        const tbody = document.createElement('tbody');
        tableReference.appendChild(tbody);
        return tbody;
    }
    const tableBodyReference =
        tableReference.querySelector('tbody') ??
        createTbodyElement(tableReference);

    for (const [itemIndex, tableItem] of tableItems.entries()) {
        const tableRow = document.createElement('tr');

        if (itemIndex % 2 !== 0) {
            tableRow.classList.add('bg-blue-200');
        }

        for (const tableColumn of columnsArray) {
            const formatFunction = tableColumn.format ?? ((info) => info);
            tableRow.innerHTML += /*html*/ `<td class='text-center'>${formatFunction(
                tableItem[tableColumn.accessor]
            )}</td>`;
        }
        tableBodyReference.appendChild(tableRow);
    }
}
