import { useState } from "react";
import ApexChart from "./child/ApexChart";
import ChartHeader from "./child/ChartHeader";

export default function Chart() {
    const [format, setFormat] = useState<string>('');

    return (
        <>
            <ChartHeader />
            <ApexChart />
        </>
    )
}