import React, { useState } from 'react'
import { Grid , Typography, Container} from "@material-ui/core"
import {PieChart, Pie, Sector, ResponsiveContainer } from "recharts"
const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, income, productName
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);            
    const textAnchor = cos >= 0 ? 'start' : 'end';
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <g>        
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill="#f3b3a6"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill="#436375"
        />        
        <text x={cx} y={cy + outerRadius + 20} textAnchor={textAnchor} fill="#333">{`${productName} $${income}`}</text>        
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      </g>
    );
  };
 
export interface IIncomeRank{
    prop: {productName: string, income: number}[]
}
export const RankingIncomesGraph = ({ prop }: IIncomeRank) => {
    const [state, setState] = useState({activeIndex: 0})
    const renderLabel=(e)=>{
      return e.prop.productName
    }
    const onPieEnter = (data, index) => {
        setState({
          activeIndex: index,
        });
      };
    return (    
        <Grid
        container={true}
        spacing={1}
        direction="column"
        justify="center"
        alignItems="center"
        alignContent="center"
        wrap="nowrap"
        >
          <Container maxWidth="xs">
            <Typography variant="h6" color="initial" style={{paddingTop:"30px", textAlign:"center"}}>Ranking 5 products that gave more income</Typography>      
           </Container>        
        <ResponsiveContainer width="99%" aspect={2}>
        <PieChart  >
            <Pie 
            activeIndex={state.activeIndex} activeShape={renderActiveShape}
            onMouseEnter={onPieEnter} data={prop} dataKey="income" 
            nameKey="productName" cx="50%" cy="50%" innerRadius="30%" outerRadius="70%"
            fill="#e28db2" label={renderLabel}  isAnimationActive={true}/>            
            
        </PieChart>
        </ResponsiveContainer>
    </Grid>

)
}