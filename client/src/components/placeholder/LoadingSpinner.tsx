import { ClipLoader } from "react-spinners";
import '../../styles/placeholder/spinner.css';

const loaderStyle = {
    border: '3px solid #585858'
}

type LoadingSpinnerProps = {
    containerHeight: string,
    size: number,
}

export default function LoadingSpinner({ containerHeight, size }: LoadingSpinnerProps) {
    return (
        <div
            className="loading-spinner-container"
            style={{ height: containerHeight }}>
            <ClipLoader
                color="#585858"
                size={size}
                loading={true}
                cssOverride={loaderStyle}
            />
        </div>
    );
}
