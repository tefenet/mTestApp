import React, { useEffect, useState } from 'react';
import { Translate } from 'react-jhipster';
import useAxiosFetch from 'app/shared/util/axiosFetch';
import { Container, Grid } from '@material-ui/core';    
import { DeliveredGraph } from './deliveredGraph';
import {TotalSalesGraph} from './totalSalesGraph'
import { RankingProdGraph, ProdRank } from './rankingProdGrpah';
import { IIncomeRank, RankingIncomesGraph } from './rankingIcomesGraph';
import { neveTheme } from 'app/theme';

export interface IDataGraph {
  delivered: { date: string; amount: number }[],
  total: { date: string; amount: number }[],
  count: { product: string; amount: number }[],
  incomes: { product: string; income: number }[]
}

export const GrapHome = () => {
  const [state, setState] = useState<IDataGraph>(null);
  const { data, loading, error, errorMessage } = useAxiosFetch('/api/sales/countByDate', 3600);
  useEffect(() => {
    if (data) {
      const { productAmount, totalSales, deliveredCount, productIncome } = data.data
      setState({
        delivered: deliveredCount.map(productSale=>{return {date: productSale.date , 
          amount: Number(productSale.amount) }} ),
        total: totalSales.map(productSale=>{return {date: productSale.date , 
          amount: Number(productSale.amount) }} ),
        count: productAmount,
        incomes: productIncome
      })
    }
  }, [data])

  const [prodsCount, setCounts] = useState<ProdRank>(null);
  const [prodsIncome, setIncomes] = useState<IIncomeRank>(null);
  useEffect(() => {
    if (state) {
      setCounts({prop:Array.from(state.count).map(productSale =>   
             
             {return {productName: JSON.parse(productSale.product.substring(7)).name , 
               amount: Number(productSale.amount) }})})
      setIncomes({prop: Array.from(state.incomes)
                  .map(productSale => { return { productName: JSON.parse(productSale.product.substring(7)).name,
                     income: Number(productSale.income) } })})      
    }
  }, [state])  

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
