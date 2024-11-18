import axios from "axios";
import { useState } from "react";

const App = () => {
  const [wallets, setWallets] = useState<string[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchBalances = async () => {
    setLoading(true);
    setError(null);
    const fetchedBalances: any[] = [];

    try {
      for (const wallet of wallets) {
        const response = await axios.get(
          `https://tonapi.io/v2/accounts/${wallet}/jettons`
        );
        fetchedBalances.push({
          wallet,
          balances: response.data.balances || [],
        });
      }
      setBalances(fetchedBalances);
    } catch (err: any) {
      setError("Ошибка в адресе");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero">
      <h1>TON Multichecker</h1>
      <textarea
        placeholder="Введите адреса кошельков"
        onChange={(e) =>
          setWallets(e.target.value.split(",").map((addr) => addr.trim()))
        }
        className="textarea"
      />
      <button
        onClick={handleFetchBalances}
        disabled={loading}
        className="button"
      >
        {loading ? "Загрузка..." : "Проверить балансы"}
      </button>

      {error && <p className="error">{error}</p>}

      <div className="wallet-container">
        {balances.map(({ wallet, balances }: any) => (
          <div key={wallet} className="wallet">
            <h2>Кошелек: {wallet}</h2>
            <ul className="jetton-list">
              {balances.map((jetton: any, idx: number) => (
                <li key={idx} className="jetton-item">
                  <img
                    src={jetton.jetton.image}
                    alt={jetton.jetton.name}
                    className="jetton-img"
                  />
                  {jetton.jetton.name} ({jetton.jetton.symbol}):{" "}
                  {parseFloat(jetton.balance) / 10 ** jetton.jetton.decimals}{" "}
                  {jetton.jetton.symbol}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
