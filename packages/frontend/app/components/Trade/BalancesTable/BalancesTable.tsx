import { useEffect, useMemo, useState } from 'react';
import SkeletonTable from '~/components/Skeletons/SkeletonTable/SkeletonTable';
import { sortUserBalances } from '~/processors/processUserBalance';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { TableSortDirection } from '~/utils/CommonIFs';
import { TableState } from '~/utils/CommonIFs';
import type { UserBalanceSortBy } from '~/utils/UserDataIFs';
import styles from './BalancesTable.module.css';
import BalancesTableHeader from './BalancesTableHeader';
import BalancesTableRow from './BalancesTableRow';
import NoDataRow from '~/components/Skeletons/NoDataRow';

type BalancesTableProps = {
    hideSmallBalances: boolean;
};

export default function BalancesTable(props: BalancesTableProps) {
    const { hideSmallBalances } = props;

    const smallBalanceThreshold = 10;

    const { userBalances, webDataFetched } = useTradeDataStore();

    const [tableState, setTableState] = useState<TableState>(
        TableState.LOADING,
    );

    const [sortBy, setSortBy] = useState<UserBalanceSortBy>();
    const [sortDirection, setSortDirection] = useState<TableSortDirection>();

    const handleSort = (key: string) => {
        if (sortBy === key) {
            if (sortDirection === 'desc') {
                setSortDirection('asc');
            } else if (sortDirection === 'asc') {
                setSortDirection(undefined);
                setSortBy(undefined);
            } else {
                setSortDirection('desc');
            }
        } else {
            setSortBy(key as UserBalanceSortBy);
            setSortDirection('desc');
        }
    };

    const sortedBalances = useMemo(() => {
        return sortUserBalances(userBalances, sortBy, sortDirection);
    }, [userBalances, sortBy, sortDirection]);

    const balancesToShow = useMemo(() => {
        if (hideSmallBalances) {
            return sortedBalances.filter((balance) => {
                return balance.usdcValue > smallBalanceThreshold;
            });
        }
        return sortedBalances;
    }, [sortedBalances, hideSmallBalances]);

    useEffect(() => {
        if (webDataFetched) {
            if (balancesToShow.length === 0) {
                setTableState(TableState.EMPTY);
            } else {
                setTableState(TableState.FILLED);
            }
        } else {
            setTableState(TableState.LOADING);
        }
    }, [balancesToShow, webDataFetched]);

    return (
        <div className={styles.tableWrapper}>
            {tableState === TableState.LOADING ? (
                <SkeletonTable rows={7} colRatios={[1, 2, 2, 1, 1, 1, 3]} />
            ) : (
                <>
                    <BalancesTableHeader
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        sortClickHandler={handleSort}
                    />
                    <div className={styles.tableBody}>
                        {tableState === TableState.FILLED && (
                            <>
                                {balancesToShow.map((balance, index) => (
                                    <BalancesTableRow
                                        key={`balance-${index}`}
                                        balance={balance}
                                    />
                                ))}
                            </>
                        )}

                        {tableState === TableState.EMPTY && <NoDataRow />}
                    </div>
                </>
            )}
        </div>
    );
}
