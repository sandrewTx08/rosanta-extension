import Browser from 'webextension-polyfill';
import Storage from '../../../../Storage';
import CatalogItemsLink from '../../../../roblox/CatalogItemsLink';

const LimitedUGCInGame = ({
  loading: [loading, setloading],
  storage: [storage, setstorage]
}: {
  loading: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  storage: [Storage, React.Dispatch<React.SetStateAction<Storage>>];
}) => {
  return (
    <div className="d-flex flex-column">
      <div className="form-check form-switch py-3 mx-3">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          disabled={loading}
          checked={storage.limitedUGCInGameNotifierEnabled}
          onChange={(event) => {
            setloading(true);
            setstorage((value) => {
              value.limitedUGCInGameNotifierEnabled =
                event.target.checked || value.limitedUGCInGameNotifierEnabled;
              return { ...value };
            });

            if (event.target.checked) {
              Browser.storage.local
                .set({
                  limitedUGCInGameNotifierEnabled: event.target.checked
                } as Storage)
                .then(() => {
                  setstorage((value) => {
                    value.limitedUGCInGameNotifierEnabled = event.target.checked;
                    return { ...value };
                  });
                })
                .catch(() => {
                  setstorage((value) => {
                    value.limitedUGCInGameNotifierEnabled = !value.limitedUGCInGameNotifierEnabled;
                    return { ...value };
                  });
                });
            } else {
              Browser.storage.local
                .set({
                  limitedUGCInGameNotifierAssets: [] as any[],
                  limitedUGCInGameNotifierEnabled: false
                } as Storage)
                .then(() => {
                  setstorage((value) => {
                    value.limitedUGCInGameNotifierAssets = [];
                    return { ...value };
                  });
                })
                .finally(() => {
                  setloading(false);
                });
            }
          }}
        />
        <label className="form-check-label">Notifier</label>
      </div>

      <ul className="list-group list-group-flush text-break" style={{ border: 0 }}>
        {storage.limitedUGCInGameNotifierAssets.map((data) => (
          <li className="list-group-item" key={data.productId}>
            <div>
              <a href={CatalogItemsLink.parseCatalogDetails(data)} target="_blank">
                {data.name}
              </a>
            </div>

            <div>
              <small>
                Units available: <b>{data.unitsAvailableForConsumption}</b>
                {' / '}
                <b>{data.totalQuantity}</b>
              </small>
            </div>

            <div>
              <small>
                <a className="text-black" href={data.gameURL} target="_blank">
                  {data.gameURL}
                </a>
              </small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LimitedUGCInGame;
