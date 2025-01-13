import { useState, useEffect } from 'react';
import Confirm from './Confirm';
import { AnimatePresence, motion } from "motion/react"
import Spinner from './Spinner';
type PriceData = {
  currency: string;
  date: string;
  price: number;
};

type Prices = Record<string, number>;
const MAX_SEND_AMOUNT = 9999999;
function App() {
  const [prices, setPrices] = useState<Prices>({});
  const [sendCurrency, setSendCurrency] = useState<string>('');
  const [receiveCurrency, setReceiveCurrency] = useState<string>('');
  const [sendAmount, setSendAmount] = useState<number>(0);
  const [receiveAmount, setReceiveAmount] = useState<number>(0);
  const [sendCurrencyIcon, setSendCurrencyIcon] = useState<string | null>(null);
  const [receiveCurrencyIcon, setReceiveCurrencyIcon] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [confirmationStep, setConfirmationStep] = useState<boolean>(false);
  const [swapConfirmed, setSwapConfirmed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://interview.switcheo.com/prices.json');
        const data: PriceData[] = await response.json();
        const priceMap = data.reduce((acc: Prices, item) => {
          acc[item.currency] = item.price;
          return acc;
        }, {});

        setPrices(priceMap);
      } catch (err) {
        setError('Failed to fetch prices. Please try again.');
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    const fetchSendIcon = async () => {
      if (sendCurrency) {
        const icon = await getTokenIcon(sendCurrency);
        setSendCurrencyIcon(icon);
      } else {
        setSendCurrencyIcon(null);
      }
    };
    fetchSendIcon();
  }, [sendCurrency]);

  useEffect(() => {
    const fetchReceiveIcon = async () => {
      if (receiveCurrency) {
        const icon = await getTokenIcon(receiveCurrency);
        setReceiveCurrencyIcon(icon);
      } else {
        setReceiveCurrencyIcon(null);
      }
    };
    fetchReceiveIcon();
  }, [receiveCurrency]);

  const handleCalculation = () => {
    const normalizedSendCurrency = sendCurrency;
    const normalizedReceiveCurrency = receiveCurrency;

    if (!prices[normalizedSendCurrency] || !prices[normalizedReceiveCurrency]) {
      setError('Invalid currency name(s). Please check your input.');
      setReceiveAmount(0);
      setConfirmationStep(false);
      return;
    }

    setError('');
    const sendRate = prices[normalizedSendCurrency];
    const receiveRate = prices[normalizedReceiveCurrency];
    const calculatedAmount = (sendAmount * sendRate) / receiveRate;
    setReceiveAmount(calculatedAmount);
    setConfirmationStep(true);
  };

  const handleConfirmSwap = () => {
    setIsLoading(true);
    setConfirmationStep(false);
    setTimeout(() => {
      setSwapConfirmed(true);
      setIsLoading(false);
    }, 3000);
  };
  

  const handleNewSwap = () => {
    setSwapConfirmed(false);
  };

  const getTokenIcon = async (currency: string): Promise<string | null> => {
    const url = new URL(`./assets/tokens/${currency}.svg`, import.meta.url).toString();
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.url.includes('undefined') && response.ok) {
        return url;
      } else {
        throw new Error(`Invalid icon URL: ${response.url}`);
      }
    } catch (error) {
      console.error(`Failed to find icon for ${currency}`);
      return null;
    }
  };
  
  const handleSendAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value ? parseFloat(e.target.value) : 0;
    if (value > MAX_SEND_AMOUNT) {
      value = MAX_SEND_AMOUNT;
    }
    setSendAmount(value);
  };
  return (
    <div className="h-screen w-screen bg-purple-950 flex justify-center items-center flex-col overflow-hidden shadow-purple-800 shadow-[inset_0_0px_200px_rgba(0,0,0,0)]">
      <div className="absolute top-4 right-4 w-[500px] h-[500px] rounded-full bg-purple-600 blur-[170px]"></div>
      <div className="absolute bottom-4 left-4 w-[500px] h-[500px] rounded-full bg-purple-600 blur-[170px]"></div>
      <motion.form
        initial={{ opacity: 0, scale: 0.5, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex w-[700px] bg-purple-900 py-20 relative rounded-xl justify-center items-center flex-col px-28 gap-4 shadow-purple-700 shadow-[inset_0_0px_30px_rgba(0,0,0,0.6)]"
        onSubmit={(e) => e.preventDefault()}
      >
       <svg className='absolute z-10 w-auto h-24 rotate-90 right-24' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path className='fill-pink-200' d="M4.99255 12.9841C4.44027 12.9841 3.99255 13.4318 3.99255 13.9841C3.99255 14.3415 4.18004 14.6551 4.46202 14.8319L7.14964 17.5195C7.54016 17.9101 8.17333 17.9101 8.56385 17.5195C8.95438 17.129 8.95438 16.4958 8.56385 16.1053L7.44263 14.9841H14.9926C15.5448 14.9841 15.9926 14.5364 15.9926 13.9841C15.9926 13.4318 15.5448 12.9841 14.9926 12.9841L5.042 12.9841C5.03288 12.984 5.02376 12.984 5.01464 12.9841H4.99255Z" fill="currentColor"/><path className='fill-pink-200' d="M19.0074 11.0159C19.5597 11.0159 20.0074 10.5682 20.0074 10.0159C20.0074 9.6585 19.82 9.3449 19.538 9.16807L16.8504 6.48045C16.4598 6.08993 15.8267 6.08993 15.4361 6.48045C15.0456 6.87098 15.0456 7.50414 15.4361 7.89467L16.5574 9.01589L9.00745 9.01589C8.45516 9.01589 8.00745 9.46361 8.00745 10.0159C8.00745 10.5682 8.45516 11.0159 9.00745 11.0159L18.958 11.0159C18.9671 11.016 18.9762 11.016 18.9854 11.0159H19.0074Z" /></svg>
     <div className="relative flex flex-grow justify-center items-center w-full flex-col py-5 bg-white rounded-xl bg-opacity-15 backdrop-blur-xl">
        <h1 className="text-3xl text-center font-sans font-thin text-pink-200">Amount to Send</h1>
        <input
          type="text"
          list="currency-options"
          placeholder="Name"
          value={sendCurrency}
          autoComplete='off'
          onChange={(e) => setSendCurrency(e.target.value)}
          className="text-xl text-pink-200 w-20 text-end absolute right-2 font-mono z-10 bg-white bg-opacity-15 rounded-xl focus:outline-none focus:shadow-[0_0px_10px_rgba(0,0,0,0.6)] focus:shadow-purple-400"
        />
        {sendCurrencyIcon && (
          <img
            src={sendCurrencyIcon}
            alt={sendCurrency}
            className="absolute right-2 z-10 w-6 h-6"
          />
        )}
        <datalist id="currency-options">
          {Object.keys(prices).map((currency) => (
            <option key={currency} value={currency} />
          ))}
        </datalist>
        <div className="relative flex items-center w-full">
          <input
            type="text"
            inputMode='numeric'
            placeholder="Amount"
            value={sendAmount}
            onChange={handleSendAmountChange}
            className="text-8xl text-pink-200 h-20 w-[80%]  text-left font-mono pl-10 focus:outline-none  bg-transparent"
          />
        </div>
      </div>
      <div className="relative flex flex-grow justify-center items-center w-full flex-col py-5 bg-white rounded-xl bg-opacity-15 backdrop-blur-xl">
        <h1 className="text-3xl text-center font-thin text-pink-200 font-sans">Amount to Receive</h1>
        <input
          type="text"
          list="currency-options"
          placeholder="Name"
          autoComplete='off'
          value={receiveCurrency}
          onChange={(e) => setReceiveCurrency(e.target.value)}
          className="text-xl text-pink-200 w-20 text-end absolute right-2 font-mono z-10 bg-white bg-opacity-15 rounded-xl  focus:outline-none focus:shadow-[0_0px_10px_rgba(0,0,0,0.6)] focus:shadow-purple-400"
        />
        {receiveCurrencyIcon && (
          <img
            src={receiveCurrencyIcon}
            alt={receiveCurrency}
            className="absolute z-10 right-2 w-6 h-6"
          />
        )}
        <datalist id="currency-options">
          {Object.keys(prices).map((currency) => (
            <option key={currency} value={currency} />
          ))}
        </datalist>
        
        <div className="relative flex items-center w-full">
          <input
            type="number"
            value={receiveAmount}
            readOnly
            className="text-8xl text-pink-200 h-20 w-[80%] text-left font-mono pl-10 focus:outline-none  bg-transparent"
          />
        </div>
      </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <AnimatePresence>
        {!confirmationStep && !swapConfirmed && (
          <motion.button
          initial={{scale: 1}}
          whileHover={{scale: 1.1}}
          whileTap={{scale: 0.9}}
          exit={{scale: 0, opacity: 0}}
            type="button"
            onClick={handleCalculation}
            className="bg-white text-purple-950 px-4 py-2 rounded absolute bottom-2" 
          >
            CONFIRM SWAP
          </motion.button>
        )}
        </AnimatePresence>
      </motion.form>
      <AnimatePresence>
      {confirmationStep && (
        <Confirm
          sendAmount={sendAmount}
          receiveAmount={receiveAmount}
          sendCurrency={sendCurrency}
          receiveCurrency={receiveCurrency}
          handleConfirmSwap={handleConfirmSwap}
          setConfirmationStep={setConfirmationStep}
        />
        )}
        {isLoading && (<Spinner />)}
   </AnimatePresence>
      {swapConfirmed && (
        <div className="mt-4 p-4 bg-green-200 text-green-800 rounded flex flex-col items-center gap-4">
          <p>Swap confirmed!</p>
          <p>
            You have sent {sendAmount} {sendCurrency} and received {receiveAmount.toFixed(2)}{' '}
            {receiveCurrency}.
          </p>
          <button
            type="button"
            onClick={handleNewSwap}
            className="bg-white text-purple-950 px-4 py-2 rounded mt-4"
          >
            Swap Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
