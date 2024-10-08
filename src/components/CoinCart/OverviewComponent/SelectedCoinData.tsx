import { useEffect, useState } from "react";
import { useCoinSelector } from "../../../store/hooks";
import { useGetCoins } from "../../../hooks/useGetCoin";
import { formatterPrices } from "../../../util/formatter";

type SelectedCoinItem = {
  id: string;
  current_price: number;
  high_24h: number;
  low_24h?: number;
  name: string;
};

export default function SelectedCoinData() {
  const [color, setColor] = useState("#00dc00");
  const [item, setItem] = useState<SelectedCoinItem>();
  const { data } = useGetCoins();
  const selectedCoin = useCoinSelector((state) => state.coin.items[0]);
  const coinCurrency = useCoinSelector((state) => state.coin.currency[0]);

  useEffect(() => {
    if (Array.isArray(data) && selectedCoin) {
      const foundItem = data.find(
        (findItem: SelectedCoinItem) => findItem.id === selectedCoin.id
      );
      setItem(foundItem);

      if (selectedCoin.percent < 0 || selectedCoin.price < 0) {
        setColor("red");
      } else {
        setColor("#00dc00");
      }
    }
  }, [selectedCoin, data, coinCurrency.currencyName]);

  const { percent, price, coin } = selectedCoin || {};
  const { low_24h = 0, high_24h = 0 } = item || {};

  return (
    <div className="lg:mx-0 2xl:mx-8 flex flex-col md:content-normal items-center justify-around">
      <div className="w-full px-8 md:px-4 py-4 flex justify-between items-center">
        <p className="text-gray-500 max-sm:text-sm text-lg md:text-sm 2xl:text-base">
          Balance
        </p>
        <p
          className="text-lg max-sm:text-sm md:text-sm 2xl:text-base"
          style={{ color: color }}
        >
          {percent?.toFixed(2)} %
        </p>
      </div>

      <div className="w-full px-8 md:px-4 py-4 flex justify-between items-center">
        <div className="flex">
          <p
            className="max-sm:text-sm md:text-sm text-lg 2xl:text-base mr-4"
            style={{
              color: "#00dc00",
            }}
          >
            {formatterPrices(price)}
          </p>
          <p
            className="max-sm:text-sm md:text-sm text-lg 2xl:text-base"
            style={{ color: "#6b7280" }}
          >
            {coinCurrency?.currencyName}
          </p>
        </div>
        <p className="text-gray-500 md:text-sm text-lg 2xl:text-base">{coin}</p>
      </div>

      <div className="w-full px-8 md:px-4 flex justify-between items-center">
        <div className="flex-1 mb-0 text-center md:text-center">
          <p className="text-gray-500 flex max-sm:text-sm md:text-sm text-lg 2xl:text-base">
            24h lowest price
          </p>
          <div className="flex md:justify-center">
            <p
              className="max-sm:text-sm md:text-sm text-lg 2xl:text-base mr-4"
              style={{ color: "red" }}
            >
              {formatterPrices(low_24h)}
            </p>
            <p className="text-gray-500 max-sm:text-sm md:text-sm text-center text-lg 2xl:text-base">
              {coinCurrency?.currencyName}
            </p>
          </div>
        </div>

        <div className="border mx-4 border-gray-500 h-12"></div>

        <div className="flex-1 w-full text-center md:text-center text-nowrap">
          <p className="text-gray-500 max-sm:text-sm flex justify-end md:justify-normal md:text-sm text-lg 2xl:text-base">
            24h highest price
          </p>
          <div className="flex justify-end md:justify-center">
            <p
              className="max-sm:text-sm md:text-sm text-lg 2xl:text-base mr-4"
              style={{
                color: "#00dc00",
              }}
            >
              {formatterPrices(high_24h)}
            </p>
            <p className="text-gray-500 max-sm:text-sm md:text-sm text-lg 2xl:text-base">
              {coinCurrency?.currencyName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
