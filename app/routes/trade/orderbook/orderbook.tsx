import { useEffect, useState } from 'react';
import { useWebSocketContext } from '~/contexts/WebSocketContext';
import OrderRow from './orderrow/orderrow';
import styles from './orderbook.module.css';

interface OrderBookProps {
  symbol: string;
}


export interface OrderRowIF{
  px: number;
  sz: number;
  n: number;
  type: 'buy' | 'sell';
  total: number;
  ratio: number;
}

const formatNum = (val : string | number) => {
  return parseFloat(val.toString()).toFixed(2);
}


const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {

    const { sendMessage, lastMessage, readyState } = useWebSocketContext();


    const [buyOrders, setBuyOrders] = useState<OrderRowIF[]>([]);
    const [sellOrders, setSellOrders] = useState<OrderRowIF[]>([]);

    
    useEffect(() => {
        if(readyState === 1) {
            console.log('>>> send msg')
            sendMessage(JSON.stringify({
                "method": "subscribe",
                "subscription": {
                    "coin": "BTC",
                    "type": "l2Book"
                } 
            }))
        }
    }, [readyState])

    useEffect(() => {
      if(lastMessage) {
          const msg = JSON.parse(lastMessage);
          if(msg.channel === 'l2Book') {
              const data = msg.data;

              const buysRaw = data.levels[0].slice(0, 11);
              const sellsRaw = data.levels[1].slice(0, 11);

              let buyTotal = 0;
              let sellTotal = 0;
              let buysProcessed: OrderRowIF[] = buysRaw.map((e: any) => {
                buyTotal += parseFloat(e.sz);
                return {
                  px: formatNum(e.px),
                  sz: formatNum(e.sz),
                  n: parseInt(e.n),
                  type: 'buy',
                  total: formatNum(buyTotal)
                }
              });
              let sellsProcessed: OrderRowIF[] = sellsRaw.map((e: any) => {
                sellTotal += parseFloat(e.sz);
                return {
                  px: formatNum(e.px),
                  sz: formatNum(e.sz),
                  n: parseInt(e.n),
                  type: 'sell',
                  total: formatNum(sellTotal)
                }
              });
              const ratioPivot = sellTotal > buyTotal ? sellTotal : buyTotal;
              // const ratioPivot = buyTotal + sellTotal;
              
              buysProcessed = buysProcessed.map((e, index) => {
                e.ratio = e.total / ratioPivot;
                return e;
              });

              sellsProcessed = sellsProcessed.map((e, index) => {
                e.ratio = e.total / ratioPivot;
                return e;
              });

              setBuyOrders(buysProcessed);
              setSellOrders(sellsProcessed);
          }
      }
  }, [lastMessage])

//   useEffect(() => {
//     console.log('>>> buyOrders', buyOrders)
//     console.log('>>> sellOrders', sellOrders)
// }, [buyOrders, sellOrders])


  return (
    <div className={styles.orderBookContainer}>

<div className={styles.orderBookHeader}>

<div>Price</div>
<div>Size</div>
<div>Total</div>

</div>

<div className={styles.orderBookBlock}>
      {sellOrders.slice(0, 10).reverse().map((order, index) => (
        <OrderRow key={order.px + order.sz} order={order} />
      ))}
</div>


<div className={styles.orderBookBlockMid}>

      <div>Spread</div>
      <div>0.1</div>
      <div>0.01%</div>

</div>

<div className={styles.orderBookBlock}>
      {buyOrders.slice(0, 10).map((order) => (
        <OrderRow key={order.px + order.sz} order={order} />
      ))}
</div>

     
    </div>
  );
}

export default OrderBook;
