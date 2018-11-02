import Web3 from 'web3';
let web3;

// if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
//   web3 = new Web3(window.web3.currentProvider);
// } else {
//   const provider = new Web3.providers.WebsocketProvider(
//     'wss://ropsten.infura.io/ws/dc9c94b2163045c79362e8666ec7682c'
//   );
//   web3 = new Web3(provider);
// }
// const provider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546');

const provider = new Web3.providers.WebsocketProvider(
  'wss://ropsten.infura.io/ws/dc9c94b2163045c79362e8666ec7682c'
);
web3 = new Web3(provider);

export default web3;
