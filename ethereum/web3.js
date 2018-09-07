import Web3 from 'web3';
import PollingBlockTracker from 'eth-block-tracker';
import HttpProvider from 'ethjs-provider-http';
// let web3;

// if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
// web3 = new Web3(window.web3.currentProvider);
// } else {
const provider = new Web3.providers.HttpProvider(
  'https://rinkeby.infura.io/orDImgKRzwNrVCDrAk5Q'
);
const httpProvider = new HttpProvider(
  'https://rinkeby.infura.io/orDImgKRzwNrVCDrAk5Q'
);
// const provider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545');
const web3 = new Web3(provider);
const blockTracker = new PollingBlockTracker({ provider: httpProvider });

// }

export { web3, blockTracker };
