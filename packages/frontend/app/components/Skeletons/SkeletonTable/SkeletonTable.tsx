import { useState } from 'react';
import styles from './SkeletonTable.module.css';

interface SkeletonTableProps {
    rows: number;
    columns?: number;
    colRatios?: number[];
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({
    rows = 3,
    columns = 5,
    colRatios = [],
}) => {
    const cols = colRatios.length > 0 ? colRatios : Array(columns).fill(1);

    const totalRatio = cols.reduce((acc, ratio) => acc + ratio, 0);
    const colRatiosWithTotal = cols.map((ratio) => (ratio / totalRatio) * 100);

    return (
        <>
            <div className={styles.skeletonTable}>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div
                        key={rowIndex}
                        className={styles.skeletonRow}
                        style={{
                            animationDelay: (0.1 * rowIndex).toString(),
                            opacity: 1 - (1 / rows) * 1.13 * rowIndex,
                        }}
                    >
                        {Array.from({ length: cols.length }).map(
                            (_, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={styles.skeletonCell}
                                    style={{
                                        width: colRatiosWithTotal[colIndex]
                                            ? `${colRatiosWithTotal[colIndex]}%`
                                            : (1 / columns) * 100 + '%',
                                    }}
                                />
                            ),
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default SkeletonTable;
