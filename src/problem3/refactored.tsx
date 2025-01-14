// Interface defining wallet balance
interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
  }
  
  // Interface extending wallet balance with a formatted string
  interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
  }
  
  // Component props definition
  interface Props extends BoxProps { 
    children?: React.ReactNode;
  }
  
  const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    
    // Fetch wallet balances and prices
    const balances = useWalletBalances();
    const prices = usePrices();
    
    // Blockchain priority mapping
    const blockchainPriorities: Record<string, number> = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    };
  
    // Function to retrieve blockchain priority
    const getPriority = (blockchain: string): number => blockchainPriorities[blockchain] ?? -99;
  
    // Sort balances by blockchain priority
    const sortedBalances = useMemo(() => {
      return balances.filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (balancePriority > -99) {  
          if (balance.amount <= 0) {  
            return true; 
          }
        }
        return false;
      }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
    }, [balances]);
  
    // Format balances for display
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(2)
      };
    });
  
    // Map formatted balances to rows
    const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow 
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  
    // Render wallet rows
    return (
      <div {...rest}>
        {rows}
      </div>
    );
  };
  