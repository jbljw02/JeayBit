import { ClipLoader } from "react-spinners";
import '../../styles/placeholder/spinner.css';

const loaderStyle = {
    border: '3px solid #585858'
}

export default function LoadingSpinner() {

    return (
        <div className="spinner-container">
            <ClipLoader 
                color="#585858" 
                size={60} 
                loading={true}
                cssOverride={loaderStyle}
            />
        </div>
    );
}
