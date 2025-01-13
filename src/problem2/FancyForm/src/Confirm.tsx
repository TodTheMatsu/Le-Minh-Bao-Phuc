function Confirm({sendAmount, receiveAmount, sendCurrency, receiveCurrency, handleConfirmSwap, setConfirmationStep}: any) {
    return (
        <div className=" w-screen h-full overflow-y-hidden absolute bg-black bg-opacity-70 z-20 absolut flex flex-col items-center justify-center gap-4">
            <div className="overflow-y-hidden backdrop-blur-md bg-purple-600 bg-opacity-20 absolute rounded-xl p-5 flex flex-col items-center  gap-4">
            <p className="text-pink-200">
            You are about to send {sendAmount} {sendCurrency} and receive {receiveAmount.toFixed(2)}{' '}
            {receiveCurrency}.
            </p>
            <div className="flex gap-4">
            <button
                type="button"
                onClick={handleConfirmSwap}
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                Confirm
            </button>
            <button
                type="button"
                onClick={() => setConfirmationStep(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Cancel
            </button>
            </div>
        </div>
      </div>
    )
};

export default Confirm