import React, { useCallback } from 'react';
import './Dashboard.css';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import Bank from '../Bank';
import ExchangeCard from '../Bond/components/ExchangeCard';
// import useTokenBalance from '../../hooks/useTokenBalance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import DashboardFarm from './DashboardFarm';
import useBanks from '../../hooks/useBanks';
import ExchangeStat from '../Bond/components/ExchangeStat';
import useBondStats from '../../hooks/useBondStats';

import Spacer from '../../components/Spacer';
import Harvest from './components/Harvest';
import Stake from './components/Stake.tsx';
import styled from 'styled-components';
import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';

import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import useWithdrawCheck from '../../hooks/boardroom/useWithdrawCheck';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import { getDisplayBalance } from '../../utils/formatBalance';

import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';

import moment from 'moment';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';

import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';

import useBombFinance from '../../hooks/useBombFinance';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { roundAndFormatNumber } from '../../0x';
import { useMemo } from 'react';

// import { BombFinance } from '../../bomb-finance/BombFinance';
import useBombStats from '../../hooks/useBombStats';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';

import usebShareStats from '../../hooks/usebShareStats';

import { Box, Card, CardContent, Button, Typography, Grid } from '@material-ui/core';
import useTokenBalance from '../../hooks/useTokenBalance';

function Dashboard() {
  const { account } = useWallet();

  const [banks] = useBanks();

  const { path } = useRouteMatch();
  const bombFinance = useBombFinance();
  // console.log(bombFinance);
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  //const bombStat = useBombStats();
  const cashPrice = useCashPriceInLastTWAP();

  const bondsPurchasable = useBondsPurchasable();

  // const bondBalance = useTokenBalance(bombFinance?.BBOND);

  // console.log(bondBalance);
  // const bondBalance = useTokenBalance(bombFinance?.BBOND);
  //const scalingFactor = useMemo(() => (cashPrice ? Number(cashPrice) : null), [cashPrice]);

  const handleBuyBonds = useCallback(
    async (amount) => {
      const tx = await bombFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} BBOND with ${amount} BOMB`,
      });
    },
    [bombFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount) => {
      const tx = await bombFinance.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} BBOND` });
    },
    [bombFinance, addTransaction],
  );
  const BOMB = async () => {
    const bomb = await bombFinance.BOMB;
    return bomb;
  };
  const BBOND = async () => {
    const bomb = await bombFinance.BOMB;
    return bomb;
  };
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);
  const isBondPayingPremium = useMemo(() => Number(bondStat?.tokenInFtm) >= 1.1, [bondStat]);
  // console.log("bondstat", Number(bondStat?.tokenInFtm))
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4);
  // const bondStat = useBondStats();

  const activeBanks = banks.filter((bank) => !bank.finished);

  const active_Banks = () => {
    activeBanks
      .filter((bank) => bank.sectionInUI === 3)
      .map(async (bank) => {
        const tokenBalanceDeposite = (await bank.depositToken.balanceOf(account)).toNumber();
        const tokenBalanceEarned = (await bank.earnToken.balanceOf(account)).toNumber();
        const tokenEarned = bank.earnTokenName;
        const tokenDeposit = bank.depositTokenName;

        console.log(tokenBalanceDeposite + '  ' + tokenBalanceEarned);
        return {
          tokenBalanceDeposite,
          tokenBalanceEarned,
          tokenDeposit,
          tokenEarned,
        };
      });
  };
  const active_banks = async () => {
    const a = await active_Banks;
    console.log(a);
  };

  // console.log(active_Banks.tokenBalanceDeposite);

  const { onRedeem } = useRedeemOnBoardroom();
  const bombStats = useBombStats();
  const tBondStats = useBondStats();
  const cashStat = useCashPriceInEstimatedTWAP();
  // const bondBalance = useTokenBalance(bombFinance?.BBOND);

  // const canClaimReward = useClaimRewardCheck();
  const canWithdraw = useWithdrawCheck();
  const stakedBalance = useStakedBalanceOnBoardroom();
  const totalStaked = useTotalStakedOnBoardroom();

  const { to } = useTreasuryAllocationTimes();

  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(2) : null), [cashStat]);

  const TVL = useTotalValueLocked();
  const currentEpoch = useCurrentEpoch();

  const bShareStats = usebShareStats();
  //BOMB
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);

  //BSHARE
  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);
  //BBOND
  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );

  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  return (
    //START BOMBFINACE SUMMARY
    <div>
      <div style={{ marginBottom: '30px' }} className="topLevelBox dash_bord_css row">
        <h1 className={'topLevelBox_title'}>BOMB FINANCE SUMMARY</h1>
        <hr className="horizontalLine"></hr>
        <div className="topLevelBox_flex">
          <div className="topLevel_grid">
            <table>
              <tr>
                <th></th>
                <th>Current Supply</th>
                <th>Total Supply</th>
                <th>Price</th>
              </tr>
              <tr>
                <td>$BOMB</td>
                <td>{roundAndFormatNumber(bombCirculatingSupply, 2)}</td>
                <td>{roundAndFormatNumber(bombTotalSupply, 2)}</td>
                <td>${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'}</td>
              </tr>
              <tr>
                <td>$BSHARE</td>
                <td>{roundAndFormatNumber(bShareCirculatingSupply, 2)}</td>
                <td>{roundAndFormatNumber(bShareTotalSupply, 2)}</td>
                <td>${bSharePriceInDollars ? bSharePriceInDollars : '-.--'}</td>
              </tr>
              <tr>
                <td>$BBOND</td>
                <td>{roundAndFormatNumber(tBondCirculatingSupply, 2)}</td>
                <td>{roundAndFormatNumber(tBondTotalSupply, 2)}</td>
                <td>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</td>
              </tr>
            </table>
          </div>
          <div className="topLevel_right">
            <p>Current Epoch:</p>
            <p>{Number(currentEpoch)}</p>
            <p className="topLevel_right_division_line-1"></p>

            <p>
              <Typography style={{ textTransform: 'uppercase', color: '#ffffff' }}>
                Next Epoch:
                <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
              </Typography>
            </p>
            <p className="topLevel_right_division_line-2"></p>
            <p>Live TWAP: {scalingFactor}</p>

            <p>TVL: {parseFloat(TVL).toFixed(2)}</p>
            {/* <hr></hr> */}
          </div>
        </div>

        {/* <div className="column">
      <div>
      <Box>
            <span style={{ fontSize: '30px', color: 'white' }}>
              {tBondPriceInBNB ? tBondPriceInBNB : '-.----'} BTC
            </span>
          </Box>
          <Box>
            <span style={{ fontSize: '16px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'} / BBOND</span>
          </Box>
          <span style={{ fontSize: '12px' }}>
            Market Cap: ${roundAndFormatNumber((tBondCirculatingSupply * tBondPriceInDollars).toFixed(2), 2)} <br />
            Circulating Supply: {roundAndFormatNumber(tBondCirculatingSupply, 2)} <br />
            Total Supply: {roundAndFormatNumber(tBondTotalSupply, 2)}
          </span>
        Current Epoch: {Number(currentEpoch)}
        <Typography style={{ textTransform: 'uppercase', color: '#ffffff', margin: '10px' }}>
          Next Epoch:
          <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
        </Typography>
        <Typography style={{ textTransform: 'uppercase', color: '#ffffff' }}>
          BOMB PEG <small>(TWAP) :</small>
        </Typography>
        <Typography>{scalingFactor} BTC</Typography>
        <small>per 10,000 BOMB</small>
      </div>
    </div> */}
      </div>
      {/* END BINANCE SUMMARY */}
      <div className="secondLevel">
        <div className="secondLevel_FirstBox">
          <button>INVEST NOW</button>
          <div className="secondLevel_FirstBox_btn2">
            <button>Chat On Discord</button>
            <button>Read Docs</button>
          </div>
          <div className="secondLevel_FirstBox_Box"></div>
        </div>
        <div className="secondLevel_SecondBox">
          <p>Latest News</p>
        </div>
      </div>

      {/*START BOARDROOM */}
      <div className="row">
        <div>
          <Button
            href="https://bombbshare.medium.com/the-bomb-cycle-how-to-print-forever-e89dc82c12e5"
            target={'_blank'}
            style={{ color: 'white' }}
          >
            Read Investment strategy
          </Button>
        </div>
        <div style={{ marginBottom: '10px', marginLeft: '10px' }}>
          <a href="https://discord.bomb.money" rel="noopener noreferrer" target="_blank" style={{ color: '#dddfee' }}>
            Discord
          </a>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <Button href="https://docs.bomb.money/welcome-start-here/readme" target={'_blank'} style={{ color: 'white' }}>
            Read Docs
          </Button>
        </div>
        <div style={{ marginBottom: '20px' }}>
          {!!account ? (
            <div>
              <h1 style={{ fontSize: '17px', color: 'white', marginBottom: '15px' }}>
                BOARDROOM
                <h1 style={{ fontSize: '10px', color: 'white' }}> Stake BSHARE and Earn BOMM every epoch</h1>
              </h1>

              <div className="column-boardroom">
                <Harvest />

                {/* <Spacer /> */}

                <Stake />

                <div className="column-boardroom">
                  {!!account && (
                    <div style={{ marginBottom: '30px' }}>
                      <Button
                        className="column-boardroom"
                        onClick={
                          stakedBalance.eq(0) || !canWithdraw
                            ? onRedeem
                            : () => alert('Either Staked balance is zero or you can not withdraw yet')
                        }
                        style={{ color: 'white' }}
                      >
                        Withdraw
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="column-boardroom" style={{ color: 'white' }}>
                <span> TVL: {`$${parseFloat(TVL).toFixed(2)}`}</span>
                <Typography> Total stake: {getDisplayBalance(totalStaked)}</Typography>
              </div>
            </div>
          ) : (
            <UnlockWallet />
          )}
        </div>
      </div>
      {/*START BOARDROOM */}

      {/*START BOMB FARM */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '17px', color: 'white', marginBottom: '15px' }}>
          BOMB FARM
          <h1 style={{ fontSize: '12px', color: 'white' }}>
            {' '}
            Stake your LP tokens in our Farm to start earning $BSHARE
          </h1>
        </h1>

        <div hidden={activeBanks.filter((bank) => bank.sectionInUI === 3).length === 0}>
          <div spacing={3} style={{ marginTop: '20px' }}>
            {/* {activeBanks
          .filter((bank) => bank.sectionInUI === 3)
          .map((bank) => {
            return ( */}
            <div>
              <h1 style={{ fontSize: '14px' }}>
                {active_Banks.tokenDeposit}
                {/* <span>{tokenBalnce}</span> */}
              </h1>
              <h1 style={{ fontSize: '14px' }}> {active_Banks.tokenEarned}</h1>
            </div>
            {/* );
          })} */}
            <div>
              <Button onClick={onRedeem} className="shinyButtonSecondary">
                Claim &amp; Withdraw
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/*END BOMB FARM */}

      <div>
        <h1 style={{ fontSize: '17px', color: 'white', marginBottom: '15px' }}>
          BONDS
          <h1 style={{ fontSize: '12px', color: 'white' }}>
            {' '}
            BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1
          </h1>
        </h1>
        <div className="row">
          <div style={{ marginBottom: '15px' }}>
            <ExchangeStat
              tokenName="10,000 BBOND"
              description="Current Price: (BOMB)^2"
              price={Number(bondStat?.tokenInFtm).toFixed(4) || '-'}
            />
          </div>
        </div>
        <div>
          <h1 style={{ fontSize: '12px', color: 'white', marginBottom: '15px' }}>
            Available to Redeem
            <h1 style={{ fontSize: '12px', color: 'white' }}> {0}</h1>
          </h1>
        </div>
      </div>
    </div>
  );
}

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;
export default Dashboard;

const StyledBank = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
// const LPTokenHelpText = ({ bank }) => {
//   const bombFinance = useBombFinance();
//   const bombAddr = bombFinance.BOMB.address;
//   const bshareAddr = bombFinance.BSHARE.address;
//   const busmAddr = bombFinance.BUSM.address;
//   const busdAddr = bombFinance.BUSD.address;

//   //const depositToken = bank.depositTokenName;
//   //console.log({depositToken})
//   let pairName;
//   let uniswapUrl;
//   // let vaultUrl: string;
//   if (bank.depositTokenName.includes('BOMB-BTCB')) {
//     pairName = 'BOMB-BTCB pair';
//     uniswapUrl = 'https://pancakeswap.finance/add/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c/' + bombAddr;
//     //   vaultUrl = 'https://www.bomb.farm/#/bsc/vault/bomb-bomb-btcb';
//   } else if (bank.depositTokenName.includes('80BOMB-20BTCB-LP')) {
//     pairName = 'BOMB MAXI 80% BOMB - 20% BTCB (at ACSI.finance)';
//     uniswapUrl =
//       'https://app.acsi.finance/#/pool/0xd6f52e8ab206e59a1e13b3d6c5b7f31e90ef46ef000200000000000000000028/invest';
//     //   vaultUrl = 'https://www.bomb.farm/#/bsc/vault/bomb-bomb-btcb';
//   } else if (bank.depositTokenName.includes('80BSHARE-20WBNB-LP')) {
//     pairName = 'BSHARE MAXI 80% BSHARE - 20% BNB (at ACSI.finance)';
//     uniswapUrl =
//       'https://app.acsi.finance/#/pool/0x2c374ed1575e5c2c02c569f627299e902a1972cb000200000000000000000027/invest';
//     //   vaultUrl = 'https://www.bomb.farm/#/bsc/vault/bomb-bomb-btcb';
//   } else if (bank.depositTokenName.includes('BOMB-BSHARE')) {
//     pairName = 'BOMB-BSHARE pair';
//     uniswapUrl = 'https://pancakeswap.finance/add/' + bombAddr + '/' + bshareAddr;
//     //   vaultUrl = 'https://www.bomb.farm/#/bsc/vault/bomb-bomb-btcb';
//   } else if (bank.depositTokenName.includes('BUSM-BUSD')) {
//     pairName = 'BUSM-BUSD pair';
//     uniswapUrl = 'https://pancakeswap.finance/add/' + busmAddr + '/' + busdAddr;
//     //   vaultUrl = 'https://www.bomb.farm/#/bsc/vault/bomb-bomb-btcb';
//   } else {
//     pairName = 'BSHARE-BNB pair';
//     uniswapUrl = 'https://pancakeswap.finance/add/BNB/' + bshareAddr;
//     //   vaultUrl = 'https://www.bomb.farm/#/bsc/vault/bomb-bshare-bnb';
//   }
//   return (
//     <Card>
//       <CardContent>
//         <StyledLink href={uniswapUrl} target="_blank">
//           {`Provide liquidity for ${pairName} now!`}
//         </StyledLink>
//       </CardContent>
//     </Card>
//   );
// };

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.main};
`;
