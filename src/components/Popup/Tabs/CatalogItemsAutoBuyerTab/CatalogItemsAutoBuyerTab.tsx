import React from 'react';
import Storage from '../../../../Storage';
import { Form } from 'react-bootstrap';
import Browser from 'webextension-polyfill';
import RobloxSchedulerBackground from '../../../../background/RobloxSchedulerBackground';
import CatalogItemsLink from '../../../../roblox/CatalogItemsLink';
import useProgress from './useProgress';
import CatalogItemsDetailsQueryParamDTO from '../../../../roblox/CatalogItemsDetailsQueryParamDTO';

export const CatalogItemsAutoBuyerTab: React.FC<{
  loading: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  storage: [Storage, React.Dispatch<React.SetStateAction<Storage>>];
}> = ({ loading: [loading, setloading], storage: [storage, setstorage] }) => {
  const progress = useProgress(storage);

  return (
    <div className="p-3 d-flex flex-column gap-3">
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          disabled={loading}
          checked={storage.catalogItemsAutoBuyerEnabled}
          onChange={(event) => {
            setloading(true);
            setstorage((value) => {
              value.catalogItemsAutoBuyerEnabled = event.target.checked;
              return { ...value };
            });

            if (event.target.checked) {
              Browser.storage.local.set({
                catalogItemsAutoBuyerEnabled: event.target.checked
              });
            } else {
              Browser.storage.local
                .set({
                  catalogItemsAutoBuyerAssets: [] as any[],
                  catalogItemsAutoBuyerEnabled: false
                } as Storage)
                .then(() => {
                  setstorage((value) => {
                    value.catalogItemsAutoBuyerAssets = [];
                    return { ...value };
                  });
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
          checked={storage.catalogItemsAutoBuyerNotification}
          onChange={(event) => {
            setstorage((value) => {
              value.catalogItemsAutoBuyerNotification = event.target.checked;
              return { ...value };
            });

            Browser.storage.local.set({
              catalogItemsAutoBuyerNotification: event.target.checked
            });
          }}
        />
        <label className="form-check-label">Notifications</label>
      </div>
      <Form.Label>
        Total of pages
        {storage.catalogItemsAutoBuyerTotalPages > 0 && (
          <>
            : <b>{storage.catalogItemsAutoBuyerTotalPages}</b>
          </>
        )}
      </Form.Label>
      <Form.Range
        min={1}
        disabled={loading}
        value={storage.catalogItemsAutoBuyerTotalPages}
        max={RobloxSchedulerBackground.INITIAL_STORAGE.catalogItemsAutoBuyerTotalPages}
        onChange={(event) => {
          const t = Number.parseInt(event.target.value);

          setstorage((value) => {
            value.catalogItemsAutoBuyerTotalPages = t;
            return { ...value };
          });

          Browser.storage.local.set({
            catalogItemsAutoBuyerTotalPages: t
          });
        }}
      />

      <div className="row">
        {([10, 30, 60, 120] as CatalogItemsDetailsQueryParamDTO['Limit'][]).map((data) => (
          <div className="col d-flex gap-2">
            <input
              className="form-check-input"
              type="radio"
              disabled={loading}
              checked={storage.catalogItemsAutoBuyerLimit == data}
              onChange={() => {
                setloading(true);
                setstorage((value) => {
                  value.catalogItemsAutoBuyerLimit = data;
                  return { ...value };
                });

                Browser.storage.local
                  .set({ catalogItemsAutoBuyerLimit: data } as Storage)
                  .finally(() => {
                    setloading(false);
                  });
              }}
            />
            <label className="form-check-label">
              <small>{data}</small>
            </label>
          </div>
        ))}
      </div>

      <div>
        Progress{' '}
        <b>
          {storage.catalogItemsAutoBuyerAssetsTotal - storage.catalogItemsAutoBuyerAssets.length}
        </b>{' '}
        of <b>{storage.catalogItemsAutoBuyerAssetsTotal}</b>
      </div>

      <div className="d-flex gap-3 flex-column">
        <div className="progress">
          <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }}>
            {progress.toFixed(0)}%
          </div>
        </div>

        <ul className="list-group overflow-y-scroll border" style={{ maxHeight: 120 }}>
          {storage.catalogItemsAutoBuyerAssets.map(([_, a], i) => (
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
                    new Date(a.alertISODate).getTime() - new Date().getTimezoneOffset() * 60000
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
          disabled={storage.catalogItemsAutoBuyerAssets.length <= 0}
          onClick={() => {
            setloading(true);
            setstorage((value) => {
              value.catalogItemsAutoBuyerEnabled = false;
              return { ...value };
            });

            Browser.storage.local
              .set({ catalogItemsAutoBuyerAssets: [], catalogItemsAutoBuyerEnabled: false })
              .then(() => {
                setstorage((value) => {
                  value.catalogItemsAutoBuyerAssets = [];
                  return { ...value };
                });
              })
              .finally(() => {
                setloading(false);
              });
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};
