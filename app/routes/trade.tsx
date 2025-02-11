import { Link, Outlet } from "react-router";
import type { Route } from "./+types/home";
import styles from "./trade.module.css";
import Chart from "~/components/chart/Chart";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "TRADE" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_NETLIFY };
}

export default function Trade({ loaderData }: Route.ComponentProps) {
  // const nav = (
  //      {/* Example nav links to each child route */}
  //   <nav style={{ marginBottom: '1rem' }}>
  //   <Link to='market' style={{ marginRight: '1rem' }}>
  //     Market
  //   </Link>
  //   <Link to='limit' style={{ marginRight: '1rem' }}>
  //     Limit
  //   </Link>
  //   <Link to='pro' style={{ marginRight: '1rem' }}>
  //     Pro
  //   </Link>
  // </nav>

  // )
  return (
    <div className={styles.container}>
      <section className={styles.containerTop}>
        <div className={styles.containerTopLeft}>
          <div className={styles.watchlist}>watchlist</div>
          <div className={styles.symbolInfo}>symbol info</div>
          <div className={styles.chart}>
            <Chart />
          </div>
        </div>

        <div className={styles.orderBook}>order book goes here</div>

        <div className={styles.tradeModules}>trade module goes here</div>
      </section>
      <section className={styles.containerBottom}>Table goes here</section>
      {/* Child routes (market, limit, pro) appear here */}
      {/* <Outlet /> */}
    </div>
  );
}
