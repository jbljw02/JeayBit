import AskingPrice from "./child/asking/AskingPrice";
import ClosedPrice from "./child/closed/ClosedPrice";
import NavBar from "../common/NavBar";
import { useState } from "react";
import '../../styles/crypto-info/cryptoDetail.css';

type SectionChange = '호가내역' | '체결내역';

const navItems = [
  { label: '호가내역', color: '#000000' },
  { label: '체결내역', color: '#000000' },
];

export default function OrderBook() {
  const [sectionChange, setSectionChange] = useState<SectionChange>('호가내역');
  return (
    <div className="orderbook">
      <NavBar
        items={navItems}
        activeItem={sectionChange}
        onItemClick={(label) => setSectionChange(label as SectionChange)}
        size="large" />
      {
        sectionChange === '호가내역' ?
          <AskingPrice /> :
          <ClosedPrice />
      }
    </div>
  );
}
