import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Translate } from 'react-jhipster';
import useAxiosFetch from 'app/shared/util/axiosFetch';
import { ChartBeans } from 'app/shared/util/ChartBeans';

interface IDataGraph {
  delivered: { date: string; amount: number }[],
  total: { date: string; amount: number }[],
  count: { productID: number; amount: number }[],
  incomes: { productID: number; income: number }[]
}
const urlBuild = (bigFiveSales: any[], bigFiveIncomes: any[]) => {
  const [first, ...theRest] = new Set(bigFiveSales.map(sale => sale.productID).concat(bigFiveIncomes.map(sale => sale.productID)))
  let url = '/api/products?id.in=' + first
  theRest.forEach(id => url += '&id.in=' + id)
  return url
}
function axiosGetProducts(state: IDataGraph, source, unmounted: boolean, setResp: React.Dispatch<React.SetStateAction<any[]>>) {
  axios
    .get(urlBuild(state.count, state.incomes), {
      cancelToken: source.token,
      timeout: 3600,
    })
    .then(a => {
      if (!unmounted) {
        setResp(a.data);
      }
    });
}

export const GrapHome = () => {
  const [state, setState] = useState<IDataGraph>({ delivered: null, total: null, count: null, incomes: null });
  const { data, loading, error, errorMessage } = useAxiosFetch('/api/sales', 3600);
  useEffect(() => {
    if (data) {
      const { deliveredSales, totalSales, bigFiveSales, bigFiveIncomes } = ChartBeans(data.data)
      setState({
        delivered: deliveredSales,
        total: totalSales, count: bigFiveSales, incomes: bigFiveIncomes
      })
    }
  }, [data])

  const [response, setResp] = useState<any[]>(null);

  useEffect(() => {
    if (state.count && state.incomes) {
      const source = axios.CancelToken.source();
      let unmounted = false;
      axiosGetProducts(state, source, unmounted, setResp);
      return function () {
        unmounted = true;
        source.cancel("Cancelling in cleanup");
      }
    }
  }, [state])

  const [prodsCount, setCounts] = useState<{ productName: string, amount: number }[]>(null);
  const [prodsIncome, setIncomes] = useState<{ productName: string, income: number }[]>(null);
  useEffect(() => {
    if (response) {
      setCounts(Array.from(state.count)
        .map(productSale => { return { productName: response.find(product => product.id === productSale.productID).name, amount: productSale.amount } }))
      setIncomes(Array.from(state.incomes)
        .map(productSale => { return { productName: response.find(product => product.id === productSale.productID).name, income: productSale.income } }))
    }
  }, [state, response])

  return (
    <div>{data ? (
      <div>
        {ChartBeans(data.data).deliveredSales.map(saleCount => (
          <ul key={saleCount.date} >
            <li >{saleCount.amount}</li>
          </ul>))
        }
      </div>

    ) : !loading && (
      <div className="alert alert-warning">
        <Translate contentKey="testApp.sales.home.notFound">No Sales found</Translate>
      </div>
    )

    }
    </div>
  )
}

