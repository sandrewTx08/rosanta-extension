import { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Browser from 'webextension-polyfill';
import Roblox from './roblox';

export const Popup = () => {
  const [enableBot, setEnableBot] = useState(false);
  const [catalogAssetDetails, setCatalogAssetDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    Browser.storage.local
      .get(['enableBot', 'catalogAssetDetails'])
      .then(({ enableBot, catalogAssetDetails }) => {
        setEnableBot(enableBot);
        setCatalogAssetDetails(catalogAssetDetails);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <label>Enable bot:</label>
      <input
        type="checkbox"
        disabled={loading}
        checked={enableBot}
        onChange={(event) => {
          setLoading(true);
          setEnableBot(event.target.checked);

          Browser.storage.local
            .set({
              enableBot: event.target.checked
            })
            .then(() => {
              if (event.target.checked) {
                return Roblox.controller.startPurchaseManyAssets().then((catalogAssetDetails) => {
                  setCatalogAssetDetails(catalogAssetDetails);
                });
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      />
      <button
        type="submit"
        onClick={() => {
          setLoading(true);

          Browser.storage.local
            .set({ catalogAssetDetails: [] })
            .then(() => {
              setCatalogAssetDetails(() => []);
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        Clear assets
      </button>

      {catalogAssetDetails.length > 0 ? (
        <ul>
          {catalogAssetDetails.map(([_, a]: any) => (
            <div key={a.data.id}>
              <p>{a.data.name}</p> <span>{a.nextBuy}</span>
            </div>
          ))}
        </ul>
      ) : loading ? (
        <h1>Loading</h1>
      ) : (
        <h2>No schuduler</h2>
      )}
    </div>
  );
};

ReactDOM.render(
  <StrictMode>
    <Popup />
  </StrictMode>,
  document.getElementById('app')
);
