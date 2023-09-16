import { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Browser from 'webextension-polyfill';
import Storage from '../../Storage';
import CatalogItemsDetailsShedulerData from '../../roblox/CatalogItemsDetailsShedulerData';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Popup = () => {
  const [enableBot, setEnableBot] = useState(false);
  const [purchasesNotification, setpurchasesNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [catalogAssetDetails, setCatalogAssetDetails] = useState<
    [number, CatalogItemsDetailsShedulerData][]
  >([]);
  const [catalogAssetDetailsTotal, setCatalogAssetDetailsTotal] = useState(0);

  function process() {
    return (
      ((catalogAssetDetailsTotal - catalogAssetDetails.length) * 100) / catalogAssetDetailsTotal ||
      0
    );
  }

  useEffect(() => {
    setLoading(true);

    Browser.storage.local
      .get([
        'enableBot',
        'catalogAssetDetails',
        'purchasesNotification',
        'catalogAssetDetailsTotal'
      ] as (keyof Storage)[])
      .then(
        // prettier-ignore
        // @ts-ignore
        ({ enableBot, catalogAssetDetails, purchasesNotification, catalogAssetDetailsTotal }: Storage) => {
          setpurchasesNotification(purchasesNotification);
          setEnableBot(enableBot);
          setCatalogAssetDetails(catalogAssetDetails);
          setCatalogAssetDetailsTotal(catalogAssetDetailsTotal);
        }
      )
      .finally(() => {
        setLoading(false);
      });

    Browser.storage.local.onChanged.addListener(
      ({ catalogAssetDetails, catalogAssetDetailsTotal }) => {
        if (catalogAssetDetails) {
          setCatalogAssetDetails(catalogAssetDetails.newValue);
          setCatalogAssetDetailsTotal((value) => catalogAssetDetailsTotal?.newValue || value);
          setLoading(false);
        }
      }
    );
  }, []);

  return (
    <div style={{ width: 256 }} className="p-3 d-flex flex-column gap-3">
      <div className="d-flex justify-content-center">
        <img className="img-fluid" src="icon.png" />
      </div>

      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
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
              Browser.storage.local
                .set({ catalogAssetDetails: [], enableBot: false })
                .then(() => {
                  setCatalogAssetDetails([]);
                })
                .finally(() => {
                  setLoading(false);
                });
            }
          }}
        />
        <label className="form-check-label">RoSanta</label>
      </div>

      <div className="form-check form-switch">
        <input
          className="form-check-input"
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
        <label className="form-check-label">Notifications</label>
      </div>

      <button
        type="button"
        className="btn btn-sm btn-warning rounded-pill"
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
        Clear
      </button>

      {catalogAssetDetails.length > 0 && (
        <>
          <div className="progress">
            <div className="progress-bar" role="progressbar" style={{ width: `${process()}%` }}>
              {process()}%
            </div>
          </div>

          <div>
            Progress <b>{catalogAssetDetailsTotal - catalogAssetDetails.length}</b> of{' '}
            <b>{catalogAssetDetailsTotal}</b>
          </div>
        </>
      )}

      {catalogAssetDetails.length > 0 ? (
        <ul className="list-group overflow-y-scroll border" style={{ maxHeight: 120 }}>
          {catalogAssetDetails.map(([_, a], i) => (
            <li key={a.data.id} className={'list-group-item small' + (i == 0 && ' active')}>
              <b>{a.data.name}</b>

              <br />

              <span className="muted">
                {
                  new Date(
                    new Date(a.alertISODate).getTime() - new Date().getTimezoneOffset() * 60_000
                  )
                    .toISOString()
                    .split('T')[1]
                    .replace('Z', '')
                    .split('.')[0]
                }
              </span>
            </li>
          ))}
        </ul>
      ) : loading ? (
        <div className="text-center">
          <div className="spinner-grow text-primary " role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>Activate the RoSanta to start</div>
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
