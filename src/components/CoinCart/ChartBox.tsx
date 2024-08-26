import { useCallback, useEffect, useState } from "react";

import ChartUI from "../UI/ChartUI";
import { ChartData, Point, ScriptableChartContext } from "chart.js";
import Button from "../UI/Button";
import { useGetPriceCoins } from "../../hooks/useGetCoin";
import { useCoinSelector } from "../../store/hooks";

type ChartCoinPrice = {
  price: number[];
  time: string[];
  coinName: string;
};

export default function ChartBox() {
  const [getDay, setGetDay] = useState(1);
  const { data, isFetched } = useGetPriceCoins(getDay);
  const [getCoins, setGetCoins] = useState<ChartCoinPrice>();
  const selectedInfo = useCoinSelector((state) => state.coin.items[0]);

  let content;

  const fetchPriceData = useCallback(async () => {
    if (isFetched) {
      const coinPrice: number[] = [];
      const coinTime: string[] = [];
      let currentDate: string;
      await data.prices?.map((singleData: number[]) => {
        coinPrice.push(singleData[1]);
        if (getDay === 1) {
          currentDate = new Date(singleData[0])
            .toLocaleTimeString()
            .replace(/(.*)\D\d+/, "$1");
        } else {
          currentDate = new Date(singleData[0]).toLocaleDateString();
        }
        coinTime.push(currentDate);
      });
      if (selectedInfo !== undefined) {
        setGetCoins({
          price: coinPrice,
          time: coinTime,
          coinName: selectedInfo.coin,
        });
      }
    }
  }, [getDay, data, isFetched, selectedInfo]);

  useEffect(() => {
    fetchPriceData();
  }, [fetchPriceData, selectedInfo, getDay, data]);

  const dataset: ChartData<"line", (number | Point)[], unknown> = {
    labels: getCoins?.time.map((time) => time),
    datasets: [
      {
        label: getCoins?.coinName,
        data: getCoins?.price ? getCoins?.price.map((newData) => newData) : [],
        backgroundColor: (context: ScriptableChartContext) => {
          if (!context.chart.chartArea) {
            return;
          }
          const { ctx } = context.chart;
          const gradientBg = ctx.createLinearGradient(0, 20, 100, 800);
          gradientBg.addColorStop(0.225, "transparent");
          gradientBg.addColorStop(1, "#13e2a4");
          return gradientBg;
        },
        fill: true,
        pointBackgroundColor: "white",
        pointBorderWidth: 1,
        pointRadius: 2,
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  if (data) {
    content = (
      <div className=" h-5/6 p-4 flex flex-col items-center mr-10 border rounded-lg">
        <div className="w-full">
          <Button
            style={`${
              getDay === 1
                ? "  text-white bg-gradient-to-r from-teal-700 to-teal-900 transition duration-300"
                : ""
            }shadow shadow-lg h-auto w-20 bg-slate-900 text-gray-400 border rounded-xl mx-2 cursor-pointer hover:bg-gradient-to-r from-teal-700 to-teal-900 transition duration-300 hover:text-white hover:shadow-teal-200/20 transition duration-300`}
            onClick={() => setGetDay(1)}
          >
            1 Day
          </Button>
          <Button
            style={`${
              getDay === 14
                ? " text-white bg-gradient-to-r from-teal-700 to-teal-900 transition duration-300"
                : ""
            }shadow shadow-lg h-auto w-20 bg-slate-900 text-gray-400 border rounded-xl mx-2 cursor-pointer hover:bg-gradient-to-r from-teal-700 to-teal-900 transition duration-300 hover:text-white hover:shadow-teal-200/20 transition duration-300`}
            onClick={() => setGetDay(14)}
          >
            14 Days
          </Button>
          <Button
            style={`${
              getDay === 30
                ? " text-white bg-gradient-to-r from-teal-700 to-teal-900 transition duration-300"
                : ""
            }shadow shadow-lg h-auto w-20 bg-slate-900 text-gray-400 border rounded-xl mx-2 cursor-pointer hover:bg-gradient-to-r from-teal-700 to-teal-900 transition duration-300 hover:text-white hover:shadow-teal-200/20 transition duration-300`}
            onClick={() => setGetDay(30)}
          >
            30 Days
          </Button>
        </div>
        <ChartUI data={dataset} />
      </div>
    );
  }

  return <>{content}</>;
}
