import { Grid, Typography, Container } from "@material-ui/core"
import React, { useState } from 'react'
import {PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts"
const COLORS = ['#e4959e', '#b98b82', '#f3b3a6', '#37515f','#1f0812' ];
const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, amount,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <text x={cx} y={cy + outerRadius +20} dy={8} textAnchor="middle" fill="#00a152">{payload.productName}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Amount ${amount}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

export interface ProdRank{
    prop: {productName: string, amount: number}[]
}
export const RankingProdGraph = ({ prop }: ProdRank) => {
    const [state, setState] = useState({activeIndex: 0})
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
        alignItems="stretch"
        alignContent="center"
        wrap="nowrap"
        zeroMinWidth
                
    >       
        <Container maxWidth={false}>
        <Typography variant="h6" color="initial" style={{paddingTop:"30px", textAlign:"center"}}>Ranking 5 best-selling products</Typography>  
        </Container>
        <ResponsiveContainer width="99%" aspect={2}>            
        <PieChart height={200} >            
            <Pie 
            activeIndex={state.activeIndex} activeShape={renderActiveShape}
            onMouseEnter={onPieEnter} data={prop} dataKey="amount" 
            nameKey="productName" cx="50%" cy="50%" outerRadius="56%"            
            fill="#f57c00" >
                {prop.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
        </PieChart>
        </ResponsiveContainer>
   </Grid>

)
}