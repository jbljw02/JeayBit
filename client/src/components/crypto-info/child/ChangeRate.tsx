import { useAppSelector } from "../../../redux/hooks";

export default function ChangeRate() {
  const cryptoRealTime = useAppSelector(state => state.cryptoRealTime);
  return (
    <>
      {
        cryptoRealTime.change === 'RISE' ?
          <span className="crypto-change_rate rise">
            &nbsp; +{((cryptoRealTime.change_rate) * 100).toFixed(2)}%
          </span> :
          (
            cryptoRealTime.change === 'FALL' ?
              <span className="crypto-change_rate fall">
                &nbsp; -{((cryptoRealTime.change_rate) * 100).toFixed(2)}%
              </span> :
              <span className="crypto-change_rate even">
                &nbsp; {cryptoRealTime.change_rate}.00%
              </span>
          )
      }
    </>
  );
}
