function convertToMonthlyReturnRate(yearlyReturnRate) {
    return yearlyReturnRate ** (1 / 12);
}

export function generateReturnsArray(
    startingAmount = 0,
    timeHorizon = 0,
    timePeriod = 'monthly',
    monthlyContribution = 0,
    returnRate = 0,
    returnTimeframe = 'monthly'
) {
    if (!timeHorizon || !startingAmount) {
        throw new Error(
            'Investimento inicial e prazo de investimento devem ser preenchidos com valores positivos.'
        );
    }

    const finalReturnRate =
        returnTimeframe === 'monthly'
            ? 1 + returnRate / 100
            : convertToMonthlyReturnRate(1 + returnRate / 100);

    const finalTimeHorizon =
        timePeriod === 'monthly' ? timeHorizon : timeHorizon * 12;

    const referenceInvestmentObject = {
        investedAmount: startingAmount, //quanto de dinheiro investido pelo investidor
        interestReturns: 0, //rendimento apenas do último mês
        totalInterestReturns: 0, //acumulado desde o início do investimento
        month: 0, //quantos meses já passaram
        totalAmount: startingAmount, //soma do dinheiro investido com o total advindo dos juros (investedAmount+totalInterestReturns)
    };

    const returnsArray = [referenceInvestmentObject];

    for (
        let timeReference = 1;
        timeReference <= finalTimeHorizon;
        timeReference++
    ) {
        const totalAmount =
            returnsArray[timeReference - 1].totalAmount * finalReturnRate +
            monthlyContribution;

        const interestReturns =
            returnsArray[timeReference - 1].totalAmount * (finalReturnRate - 1);

        const investedAmount =
            startingAmount + monthlyContribution * timeReference;

        const totalInterestReturns = totalAmount - investedAmount;

        returnsArray.push({
            investedAmount,
            interestReturns,
            totalInterestReturns,
            month: timeReference,
            totalAmount,
        });
    }
    return returnsArray;
}
