import React, { Component } from 'react';
import web3 from '../ethereum/web3';
import HashRow from '../components/HashRow';
import { Container, Table } from 'semantic-ui-react';
import Head from 'next/head';
import axios from 'axios';

const myAddress = '0xcbf0e955385c2edc08d1b4368c99252bb8ab3275';
const API_KEY = 'HARR2IMX4J87MWFK76UWJDANEDMH24TQ8V';
class EtherWatch extends Component {
  static async getInitialProps() {
    const currentBlock = await web3.eth.getBlockNumber();
    const { data } = await axios.get(
      `http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=${myAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${API_KEY}`
    );
    const hex2dec = parseInt(currentBlock, 16);
    return { currentBlock: hex2dec, foundTx: data.result, myAddress };
  }

  componentDidMount() {
    this.listenLatestBlock();
  }

  state = {
    currentBlock: this.props.currentBlock,
    foundTx: [...this.props.foundTx]
  };

  hex2dec = hex => {
    return parseInt(hex, 16);
  };

  renderRow = dataArray => {
    return dataArray.map(transaction => {
      return (
        <HashRow
          transaction={transaction}
          currentBlock={this.state.currentBlock}
          key={transaction.hash}
        />
      );
    });
  };

  listenLatestBlock = () => {
    web3.eth
      .subscribe('newBlockHeaders')
      .on('data', async block => {
        console.log('block found  :', block);
        this.setState({ currentBlock: block.number });
        const blockInfo = await web3.eth.getBlock(block.hash);
        console.log('block info  :', blockInfo);
        const myTxs = await this.searchTx(blockInfo.transactions);
        console.log('myTxs', myTxs);
        this.setState(prev => ({
          foundTx: [...myTxs, ...prev.foundTx]
        }));
      })
      .on('error', err => {
        console.error('web3 netBlockHeaders subscribe event error  : ', err);
        this.props.errorOccurred(err.errorMessage);
      });
    // blockTracker.on('sync', async ({ newBlock, oldBlock }) => {
    //   this.setState({
    //     currentBlock: this.hex2dec(newBlock)
    //   });

    //   const newBlockInfo = await web3.eth.getBlock(this.hex2dec(newBlock));
    //   if (this.hex2dec(oldBlock) === this.hex2dec(newBlock) - 2) {
    //     const oldBlockInfo = await web3.eth.getBlock(
    //       this.hex2dec(oldBlock) + 1
    //     );
    //     console.log(
    //       `${this.hex2dec(newBlock) - 1}th Block information  : `,
    //       oldBlockInfo
    //     );

    //     const txs = await this.searchTx(oldBlockInfo.transactions);
    //     console.log('search result txs  : ', txs);
    //     this.setState(prev => ({
    //       foundTx: [...txs, ...prev.foundTx]
    //     }));
    //   }
    //   console.log(
    //     `${this.hex2dec(newBlock)}th Block information  : `,
    //     newBlockInfo
    //   );
    //   const txs = await this.searchTx(newBlockInfo.transactions);

    //   console.log('search result txs  : ', txs);
    //   this.setState(prev => ({
    //     foundTx: [...txs, ...prev.foundTx]
    //   }));
    // });
  };

  searchTx = async txs => {
    const result = await Promise.all(
      txs.map(async tx => {
        const transaction = await web3.eth.getTransaction(tx);
        if (
          transaction.to !== null &&
          transaction.to.toLowerCase() === myAddress
        ) {
          console.log('my transaction    :  ', transaction);
          return transaction;
        }
      })
    );
    return result.filter(e => e !== undefined);
  };

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Container>
        <Head>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"
          />
        </Head>
        <div>
          <h1>Dugong's Ether Watch</h1>
          <div>
            현재 블록 : {this.state.currentBlock}{' '}
            <a href={'https://ropsten.etherscan.io/'} target="_blank">
              (ROPSTEN)
            </a>
          </div>
        </div>

        <Table>
          <Header>
            <Row>
              <HeaderCell>Transaction Hash</HeaderCell>
              <HeaderCell>From</HeaderCell>
              <HeaderCell>To</HeaderCell>
              <HeaderCell>Amount(ether)</HeaderCell>
              <HeaderCell>Block Confirmation</HeaderCell>
              <HeaderCell>Confirmation</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRow(this.state.foundTx)}</Body>
        </Table>
      </Container>
    );
  }
}

export default EtherWatch;
