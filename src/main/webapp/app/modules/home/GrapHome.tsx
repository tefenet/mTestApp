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

const getDeliveredMap=(data:Array<ISales>):Map<string,{amount:number}>=>{  
  const dateCount:Map<string,{amount:number}>= new Map();
  data.forEach(sale=> {
    if (dateCount.get(sale.date)===undefined) {
      dateCount.set(sale.date, {amount:0});
    }
    if(sale.state==='DELIVERED'){
      dateCount.get(sale.date).amount++;
    }    
  }, {})
  return dateCount;
}
const chartBeans= (data:Array<ISales>)=>{  
  const salesByDate=[];
  getDeliveredMap(data).forEach((val,date)=> salesByDate.push({date:new Date(date),amount:val.amount}))    
return salesByDate
}

export const GrapHome = () => {
  const { data, loading, error, errorMessage }= useAxiosFetch('/api/sales', 3600); 
  
  return(
    <div>{data  ?(
      <div>
      {chartBeans(data.data).map(saleCount=>(
      <ul key={saleCount.date} >     
          <li >{saleCount.amount}</li>
      </ul>))
      }
      </div>
      ):!loading && (
            <div className="alert alert-warning">
              <Translate contentKey="testApp.sales.home.notFound">No Sales found</Translate>
            </div>
          )
        
        }
    </div>
  )
}