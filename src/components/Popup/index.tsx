import { useEffect, useState } from 'react';
import Browser from 'webextension-polyfill';
import '../../../index.scss';
import BrowserStorage from '../../BrowserStorage';
import { Tab, Tabs } from 'react-bootstrap';
import RobloxFreeAutoBuyerAlarm from '../../alarms/RobloxFreeAutoBuyerAlarmToggle';
import CatalogItemsAutoBuyerTab from './Tabs/CatalogItemsAutoBuyerTab';
import UserTab from './Tabs/UserTab';
import LimitedUGCInGameNotifier from './Tabs/LimitedUGCInGameNotifierTab';

const Popup = () => {
  const [storage, setstorage] = useState(RobloxFreeAutoBuyerAlarm.INITIAL_STORAGE);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);

    Browser.storage.local
      .get(null)
      .then(
        // @ts-ignore
        (storage: BrowserStorage) => {
          setstorage(storage);
        }
      )
      .finally(() => {
        setloading(false);
      });

    Browser.storage.local.onChanged.addListener((storage) => {
      if (storage.catalogItemsAutoBuyerAssets) {
        setstorage((value) => {
          value.catalogItemsAutoBuyerAssets = storage.catalogItemsAutoBuyerAssets.newValue;
          value.catalogItemsAutoBuyerAssetsTotal =
            storage.catalogItemsAutoBuyerAssetsTotal?.newValue ||
            value.catalogItemsAutoBuyerAssetsTotal;
          return { ...value };
        });
        setloading(false);
      }

      if (storage.limitedUGCInGameNotifierAssets) {
        setstorage((value) => {
          value.limitedUGCInGameNotifierAssets = storage.limitedUGCInGameNotifierAssets.newValue;
          return { ...value };
        });
        setloading(false);
      }
    });
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
        <Tab eventKey="tab2" title="Limited UGC in-game notifier">
          <LimitedUGCInGameNotifier
            loading={[loading, setloading]}
            storage={[storage, setstorage]}
          />
        </Tab>
        <Tab eventKey="tab3" title="My User" disabled={!storage?.robloxUser}>
          {storage.robloxUser && <UserTab robloxUser={storage.robloxUser} />}
        </Tab>
      </Tabs>
    </main>
  );
};

export default Popup;
