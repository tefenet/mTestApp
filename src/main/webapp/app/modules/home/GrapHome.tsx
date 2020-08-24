import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Translate } from 'react-jhipster';
import useAxiosFetch from 'app/shared/util/axiosFetch';
import { Link } from 'react-router-dom';
import LineChart, { CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar, Label } from 'recharts'
import { Container, Grid } from '@material-ui/core';    
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

  
  return(
    <Container maxWidth={false}>
      
    {data  ?(
      <Grid container spacing={1}
    direction="row"
            justify="flex-start"
            alignItems="flex-start"
            alignContent="stretch"
            wrap="nowrap"
            >  
      
      <Grid
      container={true}
      spacing={1}
      direction="column"
      justify="center"
      alignItems="center"
      alignContent="center"
      wrap="nowrap"
      // className={useStyles().gridCol}
    >    
        <BarChart  width={630} height={450} data={state.delivered}  margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 2" />
        <XAxis dataKey="date">
          <Label value="days" offset={0} position="insideBottom" />
        </XAxis>
        <YAxis label={{ value: 'sales delivered', angle: -90, position: 'insideLeft' }}/>
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>      
      </Grid>
      <Grid
      container={true}
      spacing={1}
      direction="column"
      justify="center"
      alignItems="center"
      alignContent="center"
      wrap="nowrap"
      // className={useStyles().gridCol}
    >    
        <BarChart  width={630} height={450} data={state.total}  margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 2" />
        <XAxis dataKey="date">
          <Label value="days" offset={0} position="insideBottom" />
        </XAxis>
        <YAxis label={{ value: 'total sales', angle: -90, position: 'insideLeft' }}/>
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#a210d8" />
        </BarChart>      
      </Grid>
      </Grid>
      ):!loading && (
            <div className="alert alert-warning">
              <Translate contentKey="testApp.sales.home.notFound">No Sales found</Translate>
            </div>
          )
        
        }
      </Container>
  )
}
