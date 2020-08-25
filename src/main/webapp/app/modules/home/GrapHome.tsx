import React, { useEffect, useState, SetStateAction } from 'react';
import axios from 'axios';
import { Translate } from 'react-jhipster';
import useAxiosFetch from 'app/shared/util/axiosFetch';
import { Link } from 'react-router-dom';
import LineChart, { CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar, Label } from 'recharts'
import { Container, Grid, ThemeProvider } from '@material-ui/core';    
import { ChartBeans } from 'app/shared/util/ChartBeans';
import { DeliveredGraph } from './deliveredGraph';
import {TotalSalesGraph} from './totalSalesGraph'
import { RankingProdGraph, ProdRank } from './rankingProdGrpah';
import { IIncomeRank, RankingIncomesGraph } from './rankingIcomesGraph';
import { neveTheme } from 'app/theme';

export interface IDataGraph {
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

  const [prodsCount, setCounts] = useState<ProdRank>({prop:null});
  const [prodsIncome, setIncomes] = useState<IIncomeRank>(null);
  useEffect(() => {
    if (response) {
      setCounts({prop: Array.from(state.count)
        .map(productSale =>   
          {return {productName: response.find(product => product.id === productSale.productID).name, 
            amount: productSale.amount }
          })})
      setIncomes({prop: Array.from(state.incomes)
        .map(productSale => { return { productName: response.find(product => product.id === productSale.productID).name, income: productSale.income } })})
    }
  }, [state, response])  

  return (
    <Container maxWidth={false} disableGutters={true}>

      {state ? (
        <Container maxWidth={false} disableGutters={true}>
        <Grid container spacing={1}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          alignContent="stretch"
          wrap="nowrap"
          
        >
          <DeliveredGraph {...state} />
          <TotalSalesGraph {...state} />
        </Grid>
        {(prodsCount && prodsIncome)?(
        <Grid container spacing={1}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        alignContent="stretch"
        wrap="nowrap"
        style={{backgroundColor:neveTheme.palette.secondary.main}}
      >
        
        <RankingProdGraph {...prodsCount} />
        <RankingIncomesGraph {...prodsIncome} />
      </Grid>): !loading && (
        <Container maxWidth="xs">
            <div className="alert alert-warning">
                <Translate contentKey="testApp.sales.home.notFound">No Products found</Translate>
            </div>  
        </Container>)}
      </Container>
      ) : !loading && (
        <div className="alert alert-warning">
          <Translate contentKey="testApp.sales.home.notFound">No Sales found</Translate>
        </div>
      )

      }
    </Container>
  )
}
