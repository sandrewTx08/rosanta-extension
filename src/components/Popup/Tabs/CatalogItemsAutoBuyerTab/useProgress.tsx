import BrowserStorage from '../../../../BrowserStorage';

const useProgress = (storage: BrowserStorage): number => {
  return (
    ((storage.catalogItemsAutoBuyerAssetsTotal - storage.catalogItemsAutoBuyerAssets.length) *
      100) /
      storage.catalogItemsAutoBuyerAssetsTotal || 0
  );
};

export default useProgress;
