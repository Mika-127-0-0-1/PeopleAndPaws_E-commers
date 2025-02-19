"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
    data: any[];
};

export const Overview: React.FC<OverviewProps> = ({ data }) => {
    return(
        <ResponsiveContainer width="100%" height={350}>
            <BarChart
                data={data}
                // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <XAxis dataKey="name" 
                 stroke="#888888"
                 fontSize={12}
                 tickLine={false}
                 axisLine={false}/>
                <YAxis 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R${value}`}/>
                <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]}/>
            </BarChart>
        </ResponsiveContainer>
    );
}