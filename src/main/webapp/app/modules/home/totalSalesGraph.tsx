import React from 'react'
import { Grid, Container, Typography } from "@material-ui/core"
import { CartesianGrid, XAxis, Label, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { IDataGraph } from './GrapHome'

export const TotalSalesGraph = ({ total }: IDataGraph) => {
    return(
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
      <Typography variant="h6" color="initial" style={{paddingTop:"30px", textAlign:"center"}}>Total sales by day</Typography>      
     </Container>
    <ResponsiveContainer width="99%" aspect={2} >
        <LineChart   data={total}  margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 2" />
        <XAxis dataKey="date">
          <Label value="days" offset={0} position="insideBottom" />
        </XAxis>
        <YAxis dataKey="amount" interval={0} label={{ value: 'total sales', angle: -90, position: 'insideLeft' }}/>
        <Tooltip />
        <defs>
        <linearGradient id="colorUv" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a55a9" />
          <stop offset="100%" stopColor="#cedfd9" />
        </linearGradient>
      </defs>        
        <Line type="monotone" dataKey="amount" stroke="url(#colorUv)" strokeWidth={3} activeDot={false} dot={false}/>
        </LineChart>      
        </ResponsiveContainer> 
        </Grid>
    )
}