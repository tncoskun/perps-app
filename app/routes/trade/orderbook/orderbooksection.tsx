import { BsThreeDots } from 'react-icons/bs';
import OrderBook from './orderbook';
import styles from './orderbooksection.module.css';
import OrderBookTrades from './orderbooktrades';
import Tabs from '~/components/Tabs/Tabs';
import BasicMenu from '~/components/BasicMenu/BasicMenu';
import { useState } from 'react';
interface OrderBookSectionProps {
  symbol: string;
}

const OrderBookSection: React.FC<OrderBookSectionProps> = ({ symbol }) => {
  

    const orderBookComponent = <OrderBook symbol={symbol} orderCount={9} />
    const orderBookTrades = <OrderBookTrades symbol={symbol} />
    const [mode, setMode] = useState<'tab' | 'stacked' | 'large'>('tab');

    const menuItems = [
        {
            label: 'Tab',
            listener: () => {
                console.log('>>>Tab mode');
                // setMode('tab');
            }
        },
        {
            label: 'Stacked',
            listener: () => {
                console.log('Stacked mode');
                // setMode('stacked');
            }
        },
        {
            label: 'Large',
            listener: () => {
                console.log('Large mode');
                // setMode('large');
            }
        }
    ]
    const tabs = [
        {
            label: 'Order Book',
            content: orderBookComponent
        },
        {
            label: 'Trades',
            content: orderBookTrades
        }
        
    ]


  return (
    <>
    <div className={styles.orderBookSection}>
      {mode === 'tab' && (
        <Tabs tabs={tabs} 
          headerRightContent={
            <BasicMenu items={menuItems} icon={<BsThreeDots />} />
          }
            />
      )}
      {mode === 'stacked' && (
        <div className={styles.stackedContainer}>
          {orderBookComponent}
          {orderBookTrades}
        </div>
      )}
    </div>
    </>
  );
}

export default OrderBookSection;
