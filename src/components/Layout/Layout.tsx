import { useCallback, useEffect } from "react";

import CoinContainer from "../CoinCart/ListCoinsComponent/CoinContainer";
import Header from "./Section/Header";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import { useGetCoins } from "../../hooks/useGetCoin";
import { selectedChartData } from "../../store/coin-slice";
import { useCoinDispatch } from "../../store/hooks";
import SelectedCoinData from "../CoinCart/OverviewComponent/SelectedCoinData";
import HighestCoinChart from "../CoinCart/OverviewComponent/HighestCoinChart";
import CoinOverview from "../CoinCart/OverviewComponent/CoinOverview";
import CalcBox from "../CoinCart/CalcChartComponent/CalcBox";
import ChartBox from "../CoinCart/CalcChartComponent/ChartBox";

function Layout() {
  const { data, isError, isLoading } = useGetCoins();
  let content;

  const dispatch = useCoinDispatch();

  const fetchCoinData = useCallback(() => {
    if (Array.isArray(data) && data.length > 0) {
      const getData = data[0];

      dispatch(
        selectedChartData({
          id: getData.id,
          coin: getData.name,
          days: 1,
          percent: getData.price_change_percentage_24h,
          price: getData.current_price,
          image: getData.image,
        })
      );
    }
  }, [dispatch, data]);

  useEffect(() => {
    if (!isLoading && !isError) {
      fetchCoinData();
    }
  }, [fetchCoinData, isLoading, isError]);

  if (isLoading) {
    content = (
      <div className="mt-80 flex justify-center items-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <div className="mt-80 flex justify-center items-center">
        <ErrorBlock
          title="An Error has occurred"
          message="Fetching data failed"
        />
      </div>
    );
  }

  if (data) {
    content = (
      <>
        <div className="w-11/12 max-sm:w-full grid grid-flow-row sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          <div className="max-sm:col-span-1 sm:col-span-1 md:col-span-3 lg:col-span-4 md:h-72 xl:ml-4 xl:mr-3 my-6 glass md:flex md:items-center md:justify-around">
            <SelectedCoinData />
            <div className="border border-gray-500 w-full md:w-0 mt-4 md:min-h-52"></div>
            <HighestCoinChart />
          </div>
          <CoinOverview />
          <CalcBox />
          <ChartBox />
        </div>
        <CoinContainer />
      </>
    );
  }
  return (
    <div className="w-screen flex flex-col items-center justify-center">
      <Header />
      {content}
    </div>
  );
}

export default Layout;
