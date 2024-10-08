import { ChangeEvent, useEffect, useState } from "react";
import { useCoinSelector } from "../../../store/hooks";
import { formatterPrices } from "../../../util/formatter";
import Input from "../../UI/Input";
import Button from "../../UI/Button";

export default function CalcBox() {
  const selectInfo = useCoinSelector((state) => state.coin.items[0]);
  const coinCurrency = useCoinSelector((state) => state.coin.currency[0]);
  const [calcPrice, setCalcPrice] = useState(selectInfo?.price || 0);
  const [amount, setAmount] = useState<number>(1);
  const [disable, setDisable] = useState<boolean>(true);

  useEffect(() => {
    setCalcPrice(selectInfo?.price || 0);
  }, [selectInfo, coinCurrency.currencyName]);

  function onChangeAmountHandler(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.valueAsNumber;
    if (!isNaN(value)) {
      setDisable(false);
      setAmount(value);
    } else {
      setDisable(true);
      setAmount(0);
    }
  }

  function onChangePriceHandler(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.valueAsNumber;
    formatterPrices(value);
    if (!isNaN(value)) {
      setCalcPrice(value);
    } else {
      setCalcPrice(0);
    }
  }

  function onClickExchangeHandler() {
    if (amount === 1) {
      setCalcPrice(selectInfo.price || 0);
    } else {
      const newPrice = calcPrice * (amount || 0);
      setCalcPrice(newPrice);
    }
    setDisable(true);
  }

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-2 md:ml-3 mb-6 glass ">
      <div className="h-72 xl:h-96 flex flex-col items-center justify-evenly">
        <span className="text-xl xl:text-2xl w-3/4 lg:my-4 bg-gradient-to-r from-gray-300 to-gray-800 text-transparent bg-clip-text">
          Exchange
        </span>
        <div className="w-full flex flex-col items-center ">
          <label className="w-3/4 text-sm 2xl:text-base flex justify-start mb-2 text-gray-300">
            Amount:
          </label>
          <div className="w-2/3 mx-8 bg-gradient-to-r from-stone-500 to-stone-700 border border-gray-400 rounded-2xl flex justify-evenly items-center">
            <Input
              disable={false}
              value={amount.toString()}
              onChange={onChangeAmountHandler}
              placeholder="0"
              style="h-10 md:h-8 xl:h-10 w-3/4 text-center w-1/2 text-sm 2xl:text-base bg-transparent px-2 text-gray-200 mx-2"
              type="number"
            />
            <div className="border border-l-0 h-4 xl:h-6"></div>
            <div className="w-1/4 flex items-center justify-center">
              <img
                className="h-6 md:h-4 xl:h-8 mx-2 "
                src={selectInfo?.image}
                alt="Coin Picture"
              />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-center ">
          <label className="w-3/4 flex text-sm 2xl:text-base justify-start mb-2 text-gray-200">
            Price:
          </label>
          <div className="w-2/3 mx-8 bg-gradient-to-r from-stone-500 to-stone-700 border border-gray-400 rounded-2xl flex justify-evenly items-center">
            <Input
              disable={true}
              value={formatterPrices(calcPrice)}
              onChange={onChangePriceHandler}
              placeholder="Coin Price"
              style="h-10 md:h-8 xl:h-10 w-3/4 text-center text-sm 2xl:text-base bg-transparent px-2 text-gray-300 mx-2"
            />
            <div className="border border-l-0 h-4 xl:h-6"></div>
            <div className="w-1/4 flex items-center justify-center">
              <div className="text-gray-300 text-sm 2xl:text-base flex items-center mx-2">
                {coinCurrency?.currencyName}
              </div>
            </div>
          </div>
        </div>
        <Button
          disable={disable}
          onClick={onClickExchangeHandler}
          style={`shadow-lg lg:text-sm 2xl:text-base h-10 md:h-8 xl:h-10 my-4 xl:mt-8 w-52 text-gray-300 border border-gray-400 rounded-2xl ${
            !disable
              ? "bg-slate-900 cursor-pointer hover:bg-gradient-to-r from-teal-700 to-teal-900 transition duration-300 hover:text-white hover:shadow-teal-200/20 transition duration-300"
              : "bg-slate-800"
          }`}
        >
          Exchange
        </Button>
      </div>
    </div>
  );
}
