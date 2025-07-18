
'use client';

import {Bar, BarChart , ResponsiveContainer , XAxis , YAxis} from "recharts";

interface OverviewProps{
    data : any[];
}



export function Overview(props : OverviewProps)
{
    return(
        <ResponsiveContainer width='100%' height={350}>
            <BarChart data={props.data}>
                <XAxis dataKey='name'
                stroke="888888"
                fontSize={12}
                tickLine = {false}
                axisLine = {false}
                />
                 <YAxis 
                stroke="888888"
                fontSize={12}
                tickLine = {false}
                axisLine = {false}
                tickFormatter={(value)=>`${"₹"}${value}`}
                />
                <Bar dataKey= "total" fill="#3498db" radius={[4,4,0,0]}/>
            </BarChart>
        </ResponsiveContainer>
    )
}