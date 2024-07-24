import { useEffect, useState, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../styles/placeholder/skeletonUI.css';

type SkeletonUIProps = {
    containerHeight: string;
    elementsHeight: number;
    counts?: number,
};

export default function SkeletonUI({ containerHeight, elementsHeight, counts }: SkeletonUIProps) {
    const [rowCount, setRowCount] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const rowHeight = elementsHeight;

    useEffect(() => {
        const updateRowCount = () => {
            if (containerRef.current) {
                const containerHeight = containerRef.current.clientHeight;
                const count = Math.ceil(containerHeight / rowHeight);
                setRowCount(count);
            }
        };

        // 처음 마운트될 때와 창 크기가 변경될 때 rowCount 업데이트
        updateRowCount();
        window.addEventListener('resize', updateRowCount);

        return () => {
            window.removeEventListener('resize', updateRowCount);
        };
    }, [rowHeight]);

    return (
        <div
            className="skeleton-table"
            ref={containerRef}
            style={{ height: containerHeight }}>
            {
                Array.from({ length: counts ? counts : rowCount }).map((_, index) => (
                    <div
                        key={index}
                        className="skeleton-table-row">
                        <Skeleton width="100%" height={rowHeight} />
                    </div>
                ))
            }
        </div>
    );
}
