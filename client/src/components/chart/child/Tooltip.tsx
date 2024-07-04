import formatWithComas from "../../../utils/format/formatWithComas";
import '../../../styles/chart.css'

interface TooltipProps {
    o: number;
    h: number;
    l: number;
    c: number;
}

export default function Tooltip({ o, h, l, c }: TooltipProps) {
    return (
        <div className="apexchart-tooltip">
            <div className="open-close">
                <div>시가: <b>{formatWithComas(o)}</b></div>
                <div>종가: <b>{formatWithComas(c)}</b></div>
            </div>
            <div className="high-low">
                <div>고가: <b>{formatWithComas(h)}</b></div>
                <div>저가: <b>{formatWithComas(l)}</b></div>
            </div>
        </div>
    );
};