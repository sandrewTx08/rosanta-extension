import Storage from '../../../../Storage';

const useProgress = (storage: Storage): number => {
  return (
    ((storage.catalogItemsAutoBuyerAssetsTotal - storage.catalogItemsAutoBuyerAssets.length) *
      100) /
      storage.catalogItemsAutoBuyerAssetsTotal || 0
  );
};

export default useProgress;
