import { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Browser from 'webextension-polyfill';
import Storage from '../../Storage';
import './index.scss';
import { Tab, Tabs } from 'react-bootstrap';
import RobloxSchedulerBackground from '../../background/RobloxSchedulerBackground';
import CatalogItemsAutoBuyerTab from './Tabs/CatalogItemsAutoBuyerTab';
import UserTab from './Tabs/UserTab';

const Popup = () => {
  const [storage, setstorage] = useState(RobloxSchedulerBackground.INITIAL_STORAGE);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);

    Browser.storage.local
      .get(null)
      .then(
        // @ts-ignore
        (storage: Storage) => {
          setstorage(storage);
        }
      )
      .finally(() => {
        setloading(false);
      });

    Browser.storage.local.onChanged.addListener(
      ({ catalogItemsAutoBuyerAssets, catalogItemsAutoBuyerAssetsTotal }) => {
        if (catalogItemsAutoBuyerAssets) {
          setstorage((value) => {
            value.catalogItemsAutoBuyerAssets = catalogItemsAutoBuyerAssets.newValue;
            value.catalogItemsAutoBuyerAssetsTotal =
              catalogItemsAutoBuyerAssetsTotal?.newValue || value.catalogItemsAutoBuyerAssetsTotal;
            return { ...value };
          });
          setloading(false);
        }
      }
    );
  }, []);

  return (
    <main style={{ width: 256 }}>
      <div className="d-flex justify-content-center" style={{ height: 128 }}>
        <img className="h-100 w-auto" src="icon.png" />
      </div>

      <Tabs defaultActiveKey="tab1" justify>
        <Tab eventKey="tab1" title="Free items auto-buyer">
          <CatalogItemsAutoBuyerTab
            loading={[loading, setloading]}
            storage={[storage, setstorage]}
          />
        </Tab>
        <Tab eventKey="tab2" title="UGC limited notifier" disabled></Tab>
        <Tab eventKey="tab3" title="My User" disabled={!storage?.robloxUser}>
          {storage.robloxUser && <UserTab robloxUser={storage.robloxUser} />}
        </Tab>
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
