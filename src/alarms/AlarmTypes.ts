import Storage from '../Storage';

export default Object.freeze({
  catalogItemsAutoBuyerEnabled: 'catalogItemsAutoBuyerEnabled',
  limitedUGCInGameNotifierEnabled: 'limitedUGCInGameNotifierEnabled'
} as { [K in keyof Storage]: K });
