import { ISales } from "../model/sales.model";

const getDeliveredMap = (data: Array<ISales>) => {
    const salesCount: Map<string, { deliveredAmount: number, totalAmount: number }> = new Map();
    const productCount: Map<number, { amount: number }> = new Map();
    const productSum: Map<number, number> = new Map();
    data.forEach(sale => {
        if (salesCount.get(sale.date) === undefined) {
            salesCount.set(sale.date, { deliveredAmount: 0, totalAmount: 0 });
        }
        if (sale.state === 'DELIVERED') {
            salesCount.get(sale.date).deliveredAmount++;
        }
        salesCount.get(sale.date).totalAmount++;
        if (productCount.get(sale.product.id) === undefined) {
            productCount.set(sale.product.id, { amount: 0 });
        }
        productCount.get(sale.product.id).amount++;
        productSum.set(sale.product.id, (productSum.get(sale.product.id) || 0) + sale.product.price);
    }, {})

    return { salesCount, productCount, productSum };
}
const sortByDateToString = (countByDate: Array<{ date: Date, amount: number }>) => {
    return countByDate.sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(sale => { return { date: sale.date.getDate() + '/' + sale.date.getMonth(), amount: sale.amount }; });
}

export const ChartBeans = (data: Array<ISales>) => {
    const deliveredByDate = Array<{ date: Date, amount: number }>();
    const totalByDate = Array<{ date: Date, amount: number }>();
    const productIncome = Array<{ productID: number, income: number }>();
    const productSales = Array<{ productID: number, amount: number }>();
    const { salesCount, productCount, productSum } = getDeliveredMap(data);
    salesCount.forEach((val, datw) => {
        deliveredByDate.push({ date: new Date(datw), amount: val.deliveredAmount })
        totalByDate.push({ date: new Date(datw), amount: val.totalAmount })
        }
    )
    productSum.forEach((val ,key)=> productIncome.push({ productID: key, income: val }))
    productCount.forEach((val,key)=> productSales.push({ productID: key, amount: val.amount }))
    return {
        deliveredSales: sortByDateToString(deliveredByDate),
        totalSales: sortByDateToString(totalByDate),
        bigFiveSales:productSales.sort((a, b) => a.amount - b.amount).slice(-5),
        bigFiveIncomes:productIncome.sort((a, b) => a.income - b.income).slice(-5)
    }

}
