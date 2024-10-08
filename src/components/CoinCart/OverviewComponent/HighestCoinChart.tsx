import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetCoins } from "../../../hooks/useGetCoin";
import { ChartData, Point } from "chart.js";
import ChartPie from "../../UI/ChartPie";
import { formatterPrices } from "../../../util/formatter";
import Button from "../../UI/Button";
import { useCoinSelector } from "../../../store/hooks";

interface HighestChange {
  symbol: string;
  change: number;
  currency: string;
  id: number;
}

const nameButtons = [
  { id: 1, name: "Percentage Change" },
  { id: 2, name: "Price Change" },
  { id: 3, name: "Cheapest Price" },
];

type HighestChanges = HighestChange[];

export default function HighestCoinChart() {
  const { data } = useGetCoins();
  const [highestChanges, setHighestChanges] = useState<HighestChanges | null>(
    null
  );
  const coinCurrency = useCoinSelector((state) => state.coin.currency[0]);
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);

  const loadSortData = useCallback(
    (id: number) => {
      if (Array.isArray(data) && data) {
        let sortedData;
        let topThree: HighestChanges;
        switch (id) {
          case 0:
            sortedData = data
              .slice()
              .sort(
                (a, b) =>
                  b.price_change_percentage_24h - a.price_change_percentage_24h
              );
            topThree = sortedData.slice(0, 3).map((item) => ({
              symbol: item.symbol,
              change: item.price_change_percentage_24h.toFixed(2),
              currency: "%",
              id: 0,
            }));
            break;
          case 1:
            sortedData = data
              .slice()
              .sort((a, b) => b.price_change_24h - a.price_change_24h);
            topThree = sortedData.slice(0, 3).map((item) => ({
              symbol: item.symbol,
              change: item.price_change_24h.toFixed(2),
              currency: coinCurrency.currencyName,
              id: 1,
            }));
            break;
          case 2:
            sortedData = data
              .slice()
              .sort((a, b) => a.current_price - b.current_price);
            topThree = sortedData.slice(0, 3).map((item) => ({
              symbol: item.symbol,
              change: item.current_price,
              currency: coinCurrency.currencyName,
              id: 2,
            }));
            break;
          default:
            return;
        }

        setHighestChanges(topThree);
      }
    },
    [data, coinCurrency.currencyName]
  );

  useEffect(() => {
    loadSortData(activeButtonIndex);
  }, [loadSortData, activeButtonIndex]);

  const dataset: ChartData<"pie", (number | string | Point)[], unknown> =
    useMemo(
      () => ({
        labels: highestChanges?.map((item) => item.symbol),
        datasets: [
          {
            label: "Highest Changes",
            backgroundColor: ["#B48CFF", "#8D8CFF", "#8CD3FF"],
            data:
              highestChanges?.map((highestItem) => highestItem.change) || [],
            borderWidth: 1,
          },
        ],
      }),
      [highestChanges]
    );

  return (
    <>
      {highestChanges && highestChanges.length > 0 ? (
        <div className="w-full flex flex-col items-center md:ml-4 2xl:mr-8">
          <p className="flex my-2 bg-gradient-to-r from-gray-300 to-gray-500 text-transparent bg-clip-text">
            {activeButtonIndex === 2 ? "Cheapest Price" : "Highest Changes"}
            <span className="pl-2">{highestChanges[0].currency}</span>
          </p>
          <div className="flex max-sm:flex-col max-sm:justify-center max-sm:items-center w-full xl:justify-around md:justify-between">
            <div>
              <ChartPie width="100%" height="6rem" data={dataset} />
            </div>
            <ul className="lg:m-4 2xl:m-8 flex items-start justify-around flex-col">
              {highestChanges.map((highestItem) => (
                <li
                  className="text-gray-400 max-sm:my-2 flex items-center justify-between text-sm 2xl:text-base"
                  key={highestItem.symbol}
                >
                  {highestItem.symbol}:
                  <div
                    style={
                      highestItem.change >= 0
                        ? {
                            color: "#00dc00",
                            marginLeft: "0.25rem",
                            textAlign: "center",
                          }
                        : {
                            color: "red",
                            marginLeft: "0.25rem",
                            textAlign: "center",
                          }
                    }
                  >
                    {highestItem.id === 2
                      ? highestItem.change
                      : formatterPrices(highestItem.change)}
                    {highestItem.currency}
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex max-sm:mt-4 flex-col justify-around items-center pr-2 xl:w-40 w-38 2xl:w-44">
              {nameButtons.map((button, index) => (
                <Button
                  key={button.id}
                  disable={false}
                  onClick={() => {
                    setActiveButtonIndex(index);
                    loadSortData(index);
                  }}
                  style={`shadow-lg max-sm:my-2 py-1 px-2 text-gray-300 border border-gray-400 rounded-2xl text-sm 2xl:text-base w-full ${
                    activeButtonIndex === index
                      ? "bg-slate-900 cursor-pointer bg-gradient-to-r from-teal-700 to-teal-900 transition duration-300 hover:text-white hover:shadow-teal-200/20 transition duration-300"
                      : "bg-slate-800"
                  }`}
                >
                  {button.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>No data available</div>
      )}
    </>
  );
}
