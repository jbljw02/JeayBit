import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

export default function ChangeRate() {
  const cryptoRealTime = useSelector((state: RootState) => state.cryptoRealTime);

  return (
    <>
      {
        cryptoRealTime && cryptoRealTime.change_rate !== undefined &&
        (
          (
            cryptoRealTime.change === 'RISE' ?
              <span className="crypto-change_rate rise">
                &nbsp; +{((cryptoRealTime.change_rate) * 100).toFixed(2)}%
              </span> :
              (
                cryptoRealTime.change === 'FALL' ?
                  <span className="crypto-change_rate- fall">
                    &nbsp; -{((cryptoRealTime.change_rate) * 100).toFixed(2)}%
                  </span> :
                  <span className="crypto-change_rate even">
                    &nbsp; {cryptoRealTime.change_rate}.00%
                  </span>
              )
          )
        )
      }
    </>
  );
}
