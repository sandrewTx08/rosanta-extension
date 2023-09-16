import { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Browser from 'webextension-polyfill';
import Storage from '../../Storage';
import CatalogItemsDetailsShedulerData from '../../roblox/CatalogItemsDetailsShedulerData';
import './index.scss';
import { Tab, Tabs } from 'react-bootstrap';
import CatalogItemsLink from '../../roblox/CatalogItemsLink';

const Popup = () => {
  const [catalogItemsAutoBuyerEnabled, setcatalogItemsAutoBuyerEnabled] = useState(false);
  const [catalogItemsAutoBuyerNotification, setcatalogItemsAutoBuyerNotification] = useState(false);
  const [loading, setloading] = useState(false);
  const [catalogItemsAutoBuyerAssets, setcatalogItemsAutoBuyerAssets] = useState<
    [number, CatalogItemsDetailsShedulerData][]
  >([]);
  const [catalogItemsAutoBuyerAssetsTotal, setcatalogItemsAutoBuyerAssetsTotal] = useState(0);

  function processPercentage() {
    return (
      ((catalogItemsAutoBuyerAssetsTotal - catalogItemsAutoBuyerAssets.length) * 100) /
        catalogItemsAutoBuyerAssetsTotal || 0
    );
  }

  useEffect(() => {
    setloading(true);

    Browser.storage.local
      .get([
        'catalogItemsAutoBuyerEnabled',
        'catalogItemsAutoBuyerAssets',
        'catalogItemsAutoBuyerNotification',
        'catalogItemsAutoBuyerAssetsTotal'
      ] as (keyof Storage)[])
      .then(
        // prettier-ignore
        // @ts-ignore
        ({ catalogItemsAutoBuyerEnabled, catalogItemsAutoBuyerAssets, catalogItemsAutoBuyerNotification, catalogItemsAutoBuyerAssetsTotal }: Storage) => {
          setcatalogItemsAutoBuyerNotification(catalogItemsAutoBuyerNotification);
          setcatalogItemsAutoBuyerEnabled(catalogItemsAutoBuyerEnabled);
          setcatalogItemsAutoBuyerAssets(catalogItemsAutoBuyerAssets);
          setcatalogItemsAutoBuyerAssetsTotal(catalogItemsAutoBuyerAssetsTotal);
        }
      )
      .finally(() => {
        setloading(false);
      });

    Browser.storage.local.onChanged.addListener(
      ({ catalogItemsAutoBuyerAssets, catalogItemsAutoBuyerAssetsTotal }) => {
        if (catalogItemsAutoBuyerAssets) {
          setcatalogItemsAutoBuyerAssets(catalogItemsAutoBuyerAssets.newValue);
          setcatalogItemsAutoBuyerAssetsTotal(
            (value) => catalogItemsAutoBuyerAssetsTotal?.newValue || value
          );
          setloading(false);
        }
      }
    );
  }, []);

  function CatalogItemsAutoBuyerTab() {
    return (
      <div className="p-3 d-flex flex-column gap-3">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            disabled={loading}
            checked={catalogItemsAutoBuyerEnabled}
            onChange={(event) => {
              setloading(true);
              setcatalogItemsAutoBuyerEnabled(event.target.checked);

              if (event.target.checked) {
                Browser.storage.local.set({
                  catalogItemsAutoBuyerEnabled: event.target.checked
                });
              } else {
                Browser.storage.local
                  .set({ catalogItemsAutoBuyerAssets: [], catalogItemsAutoBuyerEnabled: false })
                  .then(() => {
                    setcatalogItemsAutoBuyerAssets([]);
                  })
                  .finally(() => {
                    setloading(false);
                  });
              }
            }}
          />
          <label className="form-check-label">Auto-buyer</label>
        </div>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            disabled={loading}
            type="checkbox"
            checked={catalogItemsAutoBuyerNotification}
            onChange={(event) => {
              setcatalogItemsAutoBuyerNotification(event.target.checked);

              Browser.storage.local.set({
                catalogItemsAutoBuyerNotification: event.target.checked
              });
            }}
          />
          <label className="form-check-label">Notifications</label>
        </div>

        {catalogItemsAutoBuyerAssets.length > 0 ? (
          <div className="d-flex gap-3 flex-column">
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${processPercentage()}%` }}
              >
                {processPercentage().toFixed(0)}%
              </div>
            </div>

            <div>
              Progress{' '}
              <b>{catalogItemsAutoBuyerAssetsTotal - catalogItemsAutoBuyerAssets.length}</b> of{' '}
              <b>{catalogItemsAutoBuyerAssetsTotal}</b>
            </div>

            <ul className="list-group overflow-y-scroll border" style={{ maxHeight: 120 }}>
              {catalogItemsAutoBuyerAssets.map(([_, a], i) => (
                <li key={a.data.id} className={'list-group-item' + (i == 0 ? ' active' : '')}>
                  <small>
                    <b>
                      <a
                        className={'' + (i == 0 ? ' text-light' : ' text-black')}
                        href={CatalogItemsLink.parseCatalogDetails(a.data)}
                        target="_blank"
                      >
                        {a.data.name}
                      </a>
                    </b>
                  </small>

                  <br />

                  <small className="muted">
                    {
                      new Date(
                        new Date(a.alertISODate).getTime() - new Date().getTimezoneOffset() * 60_000
                      )
                        .toISOString()
                        .split('T')[1]
                        .replace('Z', '')
                        .split('.')[0]
                    }
                  </small>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="btn btn-sm btn-warning rounded-pill"
              disabled={catalogItemsAutoBuyerAssets.length <= 0}
              onClick={() => {
                setloading(true);
                setcatalogItemsAutoBuyerEnabled(false);

                Browser.storage.local
                  .set({ catalogItemsAutoBuyerAssets: [], catalogItemsAutoBuyerEnabled: false })
                  .then(() => {
                    setcatalogItemsAutoBuyerAssets([]);
                  })
                  .finally(() => {
                    setloading(false);
                  });
              }}
            >
              Clear
            </button>
          </div>
        ) : (
          loading && (
            <div className="text-center">
              <div className="spinner-grow text-primary " role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )
        )}
      </div>
    );
  }

  return (
    <main style={{ width: 256 }}>
      <div className="d-flex justify-content-center" style={{ height: 128 }}>
        <img className="h-100 w-auto" src="icon.png" />
      </div>

      <Tabs defaultActiveKey="tab1" justify>
        <Tab eventKey="tab1" title="Free items auto-buyer">
          <CatalogItemsAutoBuyerTab />
        </Tab>
        <Tab eventKey="tab2" title="UGC limited notifier" disabled></Tab>
      </Tabs>
    </main>
  );
};

ReactDOM.render(
  <StrictMode>
    <Popup />
  </StrictMode>,
  document.getElementById('app')
);
