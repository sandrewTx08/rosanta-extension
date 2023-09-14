import { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Browser from 'webextension-polyfill';
import AssetsPurchaser from '../../roblox/AssetsPurchaser';

export const Popup = () => {
  const [enableBot, setEnableBot] = useState(false);
  const [purchasesNotification, setpurchasesNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [catalogAssetDetails, setCatalogAssetDetails] = useState<[number, AssetsPurchaser][]>([]);

  useEffect(() => {
    setLoading(true);

    Browser.storage.local
      .get(['enableBot', 'catalogAssetDetails', 'purchasesNotification'])
      .then(({ enableBot, catalogAssetDetails, purchasesNotification }) => {
        setpurchasesNotification(purchasesNotification);
        setEnableBot(enableBot);
        setCatalogAssetDetails(catalogAssetDetails);
      })
      .finally(() => {
        setLoading(false);
      });

    Browser.storage.local.onChanged.addListener(({ catalogAssetDetails }) => {
      if (catalogAssetDetails) {
        setCatalogAssetDetails(catalogAssetDetails.newValue);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div>
      <div>
        <label>Enable bot:</label>
        <input
          type="checkbox"
          disabled={loading}
          checked={enableBot}
          onChange={(event) => {
            setLoading(true);
            setEnableBot(event.target.checked);

            if (event.target.checked) {
              Browser.storage.local.set({
                enableBot: event.target.checked
              });
            } else {
              setLoading(false);
            }
          }}
        />
      </div>

      <div>
        <label>Enable purchases notification:</label>
        <input
          disabled={loading}
          type="checkbox"
          checked={purchasesNotification}
          onChange={(event) => {
            setpurchasesNotification(event.target.checked);

            Browser.storage.local.set({
              purchasesNotification: event.target.checked
            });
          }}
        />
      </div>

      <button
        type="reset"
        disabled={catalogAssetDetails.length <= 0}
        onClick={() => {
          setLoading(true);
          setEnableBot(false);

          Browser.storage.local
            .set({ catalogAssetDetails: [], enableBot: false })
            .then(() => {
              setCatalogAssetDetails([]);
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
          {Array.from(catalogAssetDetails).map(([_, a]) => (
            <div key={a.data.id}>
              <p>{a.data.name}</p>
              <span>{a.nextBuy}</span>
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
