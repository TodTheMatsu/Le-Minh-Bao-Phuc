import { useState, useEffect } from 'react';

type PriceData = {
  currency: string;
  date: string;
  price: number;
};

type Prices = Record<string, number>;

function App() {
  const [prices, setPrices] = useState<Prices>({});
  const [sendCurrency, setSendCurrency] = useState<string>('');
  const [receiveCurrency, setReceiveCurrency] = useState<string>('');
  const [sendAmount, setSendAmount] = useState<number>(0);
  const [receiveAmount, setReceiveAmount] = useState<number>(0);
  const [sendCurrencyIcon, setSendCurrencyIcon] = useState<string | null>(null);
  const [receiveCurrencyIcon, setReceiveCurrencyIcon] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

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
      return;
    }

    setError('');
    const sendRate = prices[normalizedSendCurrency];
    const receiveRate = prices[normalizedReceiveCurrency];
    const calculatedAmount = (sendAmount * sendRate) / receiveRate;
    setReceiveAmount(calculatedAmount);
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

  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col">
      <form
        className="flex justify-center items-center flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className="text-3xl text-center font-mono">Amount to Send</h1>
  
        <div className="relative flex items-center w-full">
          <input
            type="text"
            list="currency-options"
            placeholder="Currency Name"
            value={sendCurrency}
            onChange={(e) => setSendCurrency(e.target.value)}
            className="text-xl text-center font-mono pl-10 w-full border-2 border-gray-300 rounded"
          />
          {sendCurrencyIcon && (
            <img
              src={sendCurrencyIcon}
              alt={sendCurrency}
              className="absolute right-1 w-6 h-6"
            />
          )}
        </div>
  
        <datalist id="currency-options">
          {Object.keys(prices).map((currency) => (
            <option key={currency} value={currency} />
          ))}
        </datalist>
  
        <div className="relative flex items-center w-full">
          <input
            type="number"
            placeholder="Amount"
            value={sendAmount}
            onChange={(e) => setSendAmount(parseFloat(e.target.value))}
            className="text-2xl text-center font-mono pl-10 w-full border-2 border-gray-300 rounded"
          />
        </div>
  
        <h1 className="text-3xl text-center font-mono">Amount to Receive</h1>
  
        <div className="relative flex items-center w-full">
          <input
            type="text"
            list="currency-options"
            placeholder="Currency Name"
            value={receiveCurrency}
            onChange={(e) => setReceiveCurrency(e.target.value)}
            className="text-xl text-center font-mono pl-10 w-full border-2 border-gray-300 rounded"
          />
          {receiveCurrencyIcon && (
            <img
              src={receiveCurrencyIcon}
              alt={receiveCurrency}
              className="absolute right-1 w-6 h-6"
            />
          )}
        </div>
  
        <div className="relative flex items-center w-full">
          <input
            type="number"
            value={receiveAmount}
            readOnly
            className="text-2xl text-center font-mono pl-10 w-full border-2 border-gray-300 rounded"
          />
        </div>
  
        {error && <p className="text-red-500 text-sm">{error}</p>}
  
        <button
          type="button"
          onClick={handleCalculation}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Calculate
        </button>
      </form>
    </div>
  );
  
}

export default App;
