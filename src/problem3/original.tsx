

interface WalletBalance {
  currency: string;
  amount: number;
  // Missing blockchain property
}
interface FormattedWalletBalance { // Could've extended WalletBalance instead
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps { // BoxProps is nowhere to be found
  // Missing children
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

	const getPriority = (blockchain: any): number => { // Should've used string instead of any, ensures type checking
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {  // lhsPriority is undefined should have been balancePriority instead
		     if (balance.amount <= 0) {  
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {  // Priorities are compared inefficiently
		    return 1; 
		  }
    });
  }, [balances, prices]); // prices aren't directly involved in sorting or filtering and should be removed
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed() // Would be be much preferable if it specified the decimal places
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {  // Should've been formattedBalances instead of sortedBalances
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row} // classes is not defined
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}