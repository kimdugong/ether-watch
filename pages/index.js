import React, { Component } from 'react';
import { web3, blockTracker } from '../ethereum/web3';
import HashRow from '../components/HashRow';
import { Container, Table } from 'semantic-ui-react';
import Head from 'next/head';
import axios from 'axios';

class EtherWatch extends Component {
  static async getInitialProps() {
    const currentBlock = await blockTracker.getLatestBlock();
    const myAddress = '0xcbf0e955385c2edc08d1b4368c99252bb8ab3275';
    const API_KEY = 'HARR2IMX4J87MWFK76UWJDANEDMH24TQ8V';
    const { data } = await axios.get(
      `http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${myAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${API_KEY}`
    );
    const hex2dec = parseInt(currentBlock, 16);
    return { currentBlock: hex2dec, foundTx: data.result, myAddress };
  }

  componentDidMount() {
    this.listenLatestBlock();
  }

  state = {
    currentBlock: this.props.currentBlock,
    foundTx: [
      ...this.props.foundTx
      // {
      //   blockHash:
      //     '0xaef8dcb73300cb944fe37757a4aade15f020a1afab79aae94f6047358870b817',
      //   blockNumber: 2902289,
      //   from: '0xCBf0e955385C2EDC08d1B4368C99252BB8ab3275',
      //   gas: 21000,
      //   gasPrice: '1000000000',
      //   hash:
      //     '0x2e3c852d72dcf6021f5eccd7abb452313ff814bd5a0d6228d148d4c0d43bac0a',
      //   input: '0x',
      //   nonce: 33,
      //   r: '0x4293eed8b08b0b0449c75d60827e9157db24f79d9e9eaea9a7d1c2115af1ead',
      //   s: '0x34404bf381f03234a443ba5a737df35445d67e890fb8812342daf7bc309ba765',
      //   to: '0x27a6eCB69be24dBBcea684957a659a7bB225bd51',
      //   transactionIndex: 5,
      //   v: '0x2b',
      //   value: '100000000000000'
      // },
      // {
      //   blockHash:
      //     '0x139b82024bcca2b27552c2e503d467dbbc19631ae5179507095bfee1a0c12dcd',
      //   blockNumber: 2902352,
      //   from: '0x27a6eCB69be24dBBcea684957a659a7bB225bd51',
      //   gas: 21000,
      //   gasPrice: '1000000000',
      //   hash:
      //     '0x8612607454a5d0fdabc6a514394ae0a91f84678c85b0e064ac996b1b893e970c',
      //   input: '0x',
      //   nonce: 3,
      //   r: '0x8888b4e99ee294e87bd015fc65a969abd10a4511ebd71269ed0af11272aafe21',
      //   s: '0x245d5d2fd5c90ffd4a86cd68cc0224a02b7b7c3426d87b4dc9b5657367388c0e',
      //   to: '0xCBf0e955385C2EDC08d1B4368C99252BB8ab3275',
      //   transactionIndex: 11,
      //   v: '0x2b',
      //   value: '120000000000000'
      // }
    ]
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
    blockTracker.on('sync', async ({ newBlock, oldBlock }) => {
      this.setState({
        currentBlock: this.hex2dec(newBlock)
      });

      const newBlockInfo = await web3.eth.getBlock(this.hex2dec(newBlock));
      if (this.hex2dec(oldBlock) === this.hex2dec(newBlock) - 2) {
        const oldBlockInfo = await web3.eth.getBlock(
          this.hex2dec(oldBlock) + 1
        );
        console.log(
          `${this.hex2dec(newBlock) - 1}th Block information  : `,
          oldBlockInfo
        );

        const txs = await this.searchTx(oldBlockInfo.transactions);
        console.log('search result txs  : ', txs);
        this.setState(prev => ({
          foundTx: [...txs, ...prev.foundTx]
        }));
      }
      console.log(
        `${this.hex2dec(newBlock)}th Block information  : `,
        newBlockInfo
      );
      const txs = await this.searchTx(newBlockInfo.transactions);

      console.log('search result txs  : ', txs);
      this.setState(prev => ({
        foundTx: [...txs, ...prev.foundTx]
      }));
    });
  };

  searchTx = async txs => {
    const result = await Promise.all(
      txs.map(async tx => {
        const transaction = await web3.eth.getTransaction(tx);
        if (
          transaction.to !== null &&
          transaction.to.toLowerCase() === this.props.myAddress
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
            <a href={'https://rinkeby.etherscan.io/'} target="_blank">
              (RINKEBY)
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
