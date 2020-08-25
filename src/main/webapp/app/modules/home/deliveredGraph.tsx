import React from 'react'
import { Grid, Container, Typography } from "@material-ui/core"
import { BarChart, CartesianGrid, XAxis, Label, YAxis, Bar, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { IDataGraph } from './GrapHome'

export const DeliveredGraph = ({ delivered }: IDataGraph) => {
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
      <Typography variant="h6" color="initial" style={{paddingTop:"30px", textAlign:"center"}}>Delivered Sales by day</Typography>      
     </Container>
            <ResponsiveContainer width="99%" aspect={2}>
                {delivered?(
            <BarChart data={delivered} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 2" />
                <XAxis dataKey="date">
                    <Label value="days" offset={0} position="insideBottom" />
                </XAxis>
                <YAxis label={{ value: 'sales delivered', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                
                <Bar dataKey="amount" stackId="amount" fill="#e28db2">
                {delivered.map((entry) => (
                     <Cell key={entry.amount} fill={entry.amount < 3 ? '#cedfd9' : '#0a55a9' }/>
                    ))}
                </Bar>
            </BarChart>):(<Container maxWidth="xs">
                <Typography variant="h6" color="initial" style={{paddingTop:"30px", textAlign:"center"}}>Delivered Sales by day</Typography>      
            </Container>)
            }
            </ResponsiveContainer>       
          
        </Grid>
    )
}