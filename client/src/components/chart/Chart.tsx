import { useState } from "react";
import ApexChart from "./child/ApexChart";
import ChartHeader from "./child/ChartHeader";

export default function Chart() {
    return (
        <>
            <ChartHeader />
            <ApexChart />
        </>
    )
}