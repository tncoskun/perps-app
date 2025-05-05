import { useEffect, useMemo, useState } from 'react';
import SkeletonTable from '~/components/Skeletons/SkeletonTable/SkeletonTable';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { TableSortDirection } from '~/utils/CommonIFs';
import { TableState } from '~/utils/CommonIFs';
import type { OrderDataSortBy } from '~/utils/orderbook/OrderBookIFs';
import { sortOrderData } from '~/utils/orderbook/OrderBookUtils';
import styles from './OpenOrdersTable.module.css';
import OpenOrdersTableHeader from './OpenOrdersTableHeader';
import OpenOrdersTableRow from './OpenOrdersTableRow';
import { openOrdersData } from './data';
import NoDataRow from '~/components/Skeletons/NoDataRow';
interface OpenOrdersTableProps {
    onCancel?: (time: number, coin: string) => void;
    onViewAll?: () => void;
    selectedFilter: string;
}

export default function OpenOrdersTable(props: OpenOrdersTableProps) {
    const { onCancel, onViewAll, selectedFilter } = props;

    const [tableState, setTableState] = useState<TableState>(
        TableState.LOADING,
    );

    const [sortDirection, setSortDirection] = useState<TableSortDirection>();
    const [sortBy, setSortBy] = useState<OrderDataSortBy>();

    const handleCancel = (time: number, coin: string) => {
        if (onCancel) {
            onCancel(time, coin);
        }
    };

    const handleViewAll = () => {
        if (onViewAll) {
            onViewAll();
        }
    };

    const { userSymbolOrders, userOrders, webDataFetched } =
        useTradeDataStore();

    const openOrdersLimit = 10;

    const filteredOrders = useMemo(() => {
        switch (selectedFilter) {
            case 'all':
                return userOrders;
            case 'active':
                return userSymbolOrders;
            case 'long':
                return userOrders.filter((order) => order.side === 'buy');
            case 'short':
                return userOrders.filter((order) => order.side === 'sell');
        }

        return userOrders;
    }, [userOrders, selectedFilter]);

    const sortedOrders = useMemo(() => {
        return sortOrderData(filteredOrders, sortBy, sortDirection);
    }, [filteredOrders, sortBy, sortDirection]);

    const ordersToShow = useMemo(() => {
        return sortedOrders.slice(0, openOrdersLimit);
    }, [sortedOrders]);

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
            setSortBy(key as OrderDataSortBy);
            setSortDirection('desc');
        }
    };

    useEffect(() => {
        if (webDataFetched) {
            if (ordersToShow.length === 0) {
                setTableState(TableState.EMPTY);
            } else {
                setTableState(TableState.FILLED);
            }
        } else {
            setTableState(TableState.LOADING);
        }
    }, [ordersToShow, webDataFetched]);

    return (
        <div className={styles.tableWrapper}>
            {tableState === TableState.LOADING ? (
                <SkeletonTable
                    rows={7}
                    colRatios={[1, 2, 2, 1, 1, 2, 1, 1, 2, 3, 1]}
                />
            ) : (
                <>
                    <OpenOrdersTableHeader
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        sortClickHandler={handleSort}
                    />
                    <div className={styles.tableBody}>
                        {tableState === TableState.FILLED && (
                            <>
                                {ordersToShow.map((order, index) => (
                                    <OpenOrdersTableRow
                                        key={`order-${order.oid}`}
                                        order={order}
                                        onCancel={handleCancel}
                                    />
                                ))}

                                {openOrdersData.length > 0 && (
                                    <a
                                        href='#'
                                        className={styles.viewAllLink}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleViewAll();
                                        }}
                                    >
                                        View All
                                    </a>
                                )}
                            </>
                        )}

                        {tableState === TableState.EMPTY && <NoDataRow />}
                    </div>
                </>
            )}
        </div>
    );
}
