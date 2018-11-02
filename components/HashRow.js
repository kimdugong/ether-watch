import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { Router } from '../routes';

class HashRow extends Component {
  onDetail = event => {
    event.preventDefault();
    Router.pushRoute(`/${this.props.transaction.hash}`);
  };

  render() {
    const { Row, Cell } = Table;
    const { hash, to, from, value, blockNumber } = this.props.transaction;
    const amount = web3.utils.fromWei(value, 'ether');

    return (
      <Row>
        <Cell>
          <a href={`https://rinkeby.etherscan.io/tx/${hash}`} target="_blank">
            {hash}
          </a>
        </Cell>
        <Cell>
          <Jazzicon diameter={50} seed={jsNumberForAddress(from)} />
        </Cell>
        <Cell>
          <Jazzicon diameter={50} seed={jsNumberForAddress(to)} />
        </Cell>
        <Cell>{amount}</Cell>
        <Cell>{this.props.currentBlock - blockNumber}</Cell>
        <Cell>
          {this.props.currentBlock - blockNumber >= 6 ? (
            <Button color="green" onClick={this.onDetail}>
              6Confirmed
            </Button>
          ) : (
            <Button color="red" onClick={this.onDetail}>
              Not yet
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default HashRow;
