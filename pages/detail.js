import React, { Component } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { web3 } from '../ethereum/web3';

class Detail extends Component {
  static async getInitialProps(props) {
    const { txId } = props.query;
    const tx = await web3.eth.getTransaction(txId);
    return { txId, tx };
  }

  render() {
    const { from, to } = this.props.tx;
    return (
      <div>
        <h3>{this.props.txId}</h3>
        <Jazzicon diameter={50} seed={jsNumberForAddress(from)} /> ->
        <Jazzicon diameter={50} seed={jsNumberForAddress(to)} />
      </div>
    );
  }
}

export default Detail;
