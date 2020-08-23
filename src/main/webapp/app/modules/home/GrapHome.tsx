import React, { useEffect,Component, useState } from 'react';
import { useSelector, connect } from 'react-redux';
import sales, {ISalesProps, Sales} from '../../entities/sales/sales';
import { getEntities } from 'app/entities/sales/sales.reducer';
import rootReducer, { IRootState } from 'app/shared/reducers';
import axios, { AxiosResponse } from 'axios';
import { Translate, getSortState } from 'react-jhipster';
import { entitiesReducer } from 'redux-query';
import { ISales } from 'app/shared/model/sales.model';
import useAxiosFetch from 'app/shared/util/axiosFetch';
import { Link } from 'react-router-dom';
import LineChart, { CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar, Label } from 'recharts'
import { Container, Grid } from '@material-ui/core';


const getDeliveredMap=(data:Array<ISales>)=>{    
  const salesCount:Map<string,{deliveredAmount:number, totalAmount:number}>= new Map();
  const productCount:Map<number,{amount:number}>= new Map();
  const productSum:Map<number,number>= new Map();
  data.forEach(sale=> {
    if (salesCount.get(sale.date)===undefined) {      
      salesCount.set(sale.date, {deliveredAmount:0,totalAmount:0});
    }
    if(sale.state==='DELIVERED'){
      salesCount.get(sale.date).deliveredAmount++;
    }
    salesCount.get(sale.date).totalAmount++;
    if (productCount.get(sale.product.id)===undefined){
      productCount.set(sale.product.id,{amount:0});
    }
    productCount.get(sale.product.id).amount++;
    productSum.set(sale.product.id, (productSum.get(sale.product.id)||0)+sale.product.price);
  }, {})
  
  return {salesCount,productCount, productSum};
}
const sortAndMap=(countByDate:Array<{date:Date, amount:number}>)=>{
return countByDate.sort((a, b) => a.date.getTime() - b.date.getTime())
.map(sale => { return { date: sale.date.getDate() + '/' + sale.date.getMonth(), amount: sale.amount }; });
}
const chartBeans= (data:Array<ISales>)=>{  
  const deliveredByDate=Array<{date:Date, amount:number}>();
  const totalByDate=Array<{date:Date, amount:number}>();
  let productsSales=Array<{productName:string, amount:number}>();
  const productIncome=Array<{productName:string, income:number}>();
  const {salesCount,productCount, productSum}=getDeliveredMap(data);
  salesCount.forEach((val,datw)=>{ 
      deliveredByDate.push({date:new Date(datw),amount:val.deliveredAmount})
      totalByDate.push({date:new Date(datw),amount:val.totalAmount})
    }
  )
  productsSales=Array.from(productCount.entries()).sort((a,b)=> a[1].amount - b[1].amount)
  .map(productSale=>{return{productName:productSale[0].toString(), amount:productSale[1].amount}} )
  return {delivered:sortAndMap(deliveredByDate),total: sortAndMap(totalByDate), productsSales}
  
}

export const GrapHome = () => {
  const { data, loading, error, errorMessage }= useAxiosFetch('/api/sales', 3600); 
  
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
        <BarChart  width={630} height={450} data={chartBeans(data.data).delivered}  margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
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
        <BarChart  width={630} height={450} data={chartBeans(data.data).total}  margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
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