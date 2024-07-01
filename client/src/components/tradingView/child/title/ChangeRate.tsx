import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

export default function ChangeRate() {
  const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);

  return (
    <>
      {
        selectedCrypto && selectedCrypto.change_rate !== undefined &&
        (
          (
            selectedCrypto.change === 'RISE' ?
              <span className="crypto-change_rate-rise">
                &nbsp; +{((selectedCrypto.change_rate) * 100).toFixed(2)}%
              </span> :
              (
                selectedCrypto.change === 'FALL' ?
                  <span className="crypto-change_rate-fall">
                    &nbsp; -{((selectedCrypto.change_rate) * 100).toFixed(2)}%
                  </span> :
                  <span className="crypto-change_rate-even">
                    &nbsp; {selectedCrypto.change_rate}.00%
                  </span>
              )
          )
        )
      }
    </>
  );
}
