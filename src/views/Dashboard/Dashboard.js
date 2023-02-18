import React from 'react';
import './Dashboard.css';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';

import useBanks from '../../hooks/useBanks';

import MetamaskFox from '../../assets/img/metamask-fox.svg';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BiDownArrowCircle } from 'react-icons/bi';

import useBondStats from '../../hooks/useBondStats';
import useApprove from '../../hooks/useApprove';

import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import { getDisplayBalance } from '../../utils/formatBalance';

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

import usebShareStats from '../../hooks/usebShareStats';

import { Typography } from '@material-ui/core';
import StyledBox from './utils/StyledBox';
import useTokenBalance from '../../hooks/useTokenBalance';
import DailyStake from './utils/DailyStake';
import AdvancedStake from './utils/AdvancedStake';
import useCatchError from '../../hooks/useCatchError';
import TokenSymbol from '../../components/TokenSymbol';
import Page from '../../components/Page';
import { Helmet } from 'react-helmet';
import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/background.jpg';

const UnstyledLink = ({ href, children }) => (
  <a
    href={href}
    style={{
      textDecoration: 'none',
      color: 'inherit',
      cursor: 'auto',
    }}
  >
    {children}
  </a>
);

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
  `;
function Dashboard() {
  const { account } = useWallet();
  const [banks] = useBanks();
  const bombFinance = useBombFinance();
  const bondStat = useBondStats();

  const fromToken = bombFinance ? bombFinance.BOMB : null;
  const bondBalance = useTokenBalance(bombFinance ? bombFinance.BBOND : null);

  const catchError = useCatchError();

  const {
    contracts: { Treasury },
  } = useBombFinance();
  const [approve] = useApprove(fromToken, Treasury.address);

  const activeBanks = banks.filter((bank) => !bank.finished);

  const bombStats = useBombStats();
  const tBondStats = useBondStats();
  const cashStat = useCashPriceInEstimatedTWAP();

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

  //BSHARE
  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
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

  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);
  const TITLE = 'bomb.money | Dashboard';

  if (!account) {
    return <UnlockWallet />;
  }

  return (
    //START BOMBFINACE SUMMARY
    <Page>
      <BackgroundImage />
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <div>
        <StyledBox className="topLevelBox dash_bord_css row">
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
                  <td>
                    <TokenSymbol symbol="BOMB" size={25} /> $BOMB
                  </td>
                  <td>{roundAndFormatNumber(bombCirculatingSupply, 2)}</td>
                  <td>{roundAndFormatNumber(bombTotalSupply, 2)}</td>
                  <td>${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'}</td>
                  <td>
                    <img alt="metamask fox" src={MetamaskFox} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <TokenSymbol symbol="BSHARE" size={25} /> $BSHARE
                  </td>
                  <td>{roundAndFormatNumber(bShareCirculatingSupply, 2)}</td>
                  <td>{roundAndFormatNumber(bShareTotalSupply, 2)}</td>
                  <td>${bSharePriceInDollars ? bSharePriceInDollars : '-.--'}</td>
                  <td>
                    <img alt="metamask fox" src={MetamaskFox} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <TokenSymbol symbol="BBOND" size={25} /> $BBOND
                  </td>
                  <td>{roundAndFormatNumber(tBondCirculatingSupply, 2)}</td>
                  <td>{roundAndFormatNumber(tBondTotalSupply, 2)}</td>
                  <td>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</td>
                  <td>
                    <img alt="metamask fox" src={MetamaskFox} />
                  </td>
                </tr>
              </table>
            </div>
            <div className="topLevel_right">
              <p>Current Epoch:</p>
              <p>{Number(currentEpoch)}</p>

              <p>
                <Typography style={{ textTransform: 'uppercase', color: '#ffffff' }}>
                  Next Epoch:
                  <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                </Typography>
              </p>
              <p>
                Live TWAP: <span style={{ color: 'green' }}> {scalingFactor} </span>
              </p>

              <p>
                TVL: <span style={{ color: 'green' }}>{parseFloat(TVL).toFixed(2)}</span>
              </p>
              {/* <hr></hr> */}
            </div>
          </div>
          {/* END BINANCE SUMMARY */}
        </StyledBox>
        <div className="secondLevel">
          <div className="secondLevel_FirstBox">
            <a
              style={{
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'auto',
                display: 'contents',
              }}
              href="https://bombbshare.medium.com/the-bomb-cycle-how-to-print-forever-e89dc82c12e5"
              target="_blank"
            >
              <button className="invest_btn">Invest Now</button>
            </a>
            <div className="secondLevel_FirstBox_btn2">
              <a
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'auto',
                  display: 'contents',
                }}
                href="https://discord.bomb.money"
                target="_blank"
              >
                <button className="secondary_btn">Chat On Discord</button>
              </a>
              <a
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'auto',
                  display: 'contents',
                }}
                href="https://docs.bomb.money/welcome-start-here/readme"
                target="_blank"
              >
                <button className="secondary_btn">Read Docs</button>
              </a>
            </div>
            <StyledBox className="secondLevel_FirstBox_Box">
              <div className="secondLevel_FirstBox_Box_top">
                <div style={{ display: 'flex' }}>
                  <TokenSymbol symbol="BSHARE" size={40} />

                  <p className="secondLevel_FirstBox_Box_top_title">Boardroom</p>
                </div>
                <div className="secondLevel_FirstBox_Box_top_subtitle">
                  <p className="secondLevel_FirstBox_Box_top_subtitle_p">Stake BSHARE and earn BOMB every epoch</p>
                  <p className="secondLevel_FirstBox_Box_top_subtitle_p">TVL: {`$${parseFloat(TVL).toFixed(2)}`}</p>
                </div>
              </div>
              <hr />
              <div className="secondLevel_FirstBox_Box_top_total_staked">
                <p>Total Staked: {getDisplayBalance(totalStaked)}</p>
              </div>
              <DailyStake />
            </StyledBox>
          </div>
          {/* <div>
          <a
            style={{ display: 'flex' }}
            href="https://bombbshare.medium.com/the-bomb-cycle-how-to-print-forever-e89dc82c12e5"
          >
            Read Investment strategy
          </a>
        </div> */}
          <StyledBox className={'secondLevel_SecondBox'}>
            <p className="latest_news">Latest News</p>
          </StyledBox>
        </div>
        {/* //bomb farm */}
        <StyledBox className="topLevelBox ThirdBox">
          <div className="ThirdBox_title">
            <p>Bomb Farms</p>
            <button className="circular_btn">Claim Reward</button>
          </div>
          <p>Stake your LP tokens in our farms to start earning $BSHARE</p>
          {activeBanks
            .filter((bank) => bank.sectionInUI === 3)
            .map((bank, index) => {
              if (index > 1) {
                return;
              }
              return <AdvancedStake bank={bank} name="BOMB-BTCB" />;
            })}
          {/* <AdvancedStake name="BSHARE-BNB" /> */}
        </StyledBox>
        {/* BOND */}
        <StyledBox className="topLevelBox ThirdBox">
          <div className="ThirdBox_title">
            <p>
              <TokenSymbol symbol="BBOND" size={45} /> Bonds
            </p>
          </div>
          <p>BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1</p>
          <div className="LastBox_SubBox">
            <div className="LastBox_SubBox_Box">
              <p>Current Price: (Bomb)^2</p>
              <p className="LastBox_SubBox_Box_largep">BBond = {Number(bondStat?.tokenInFtm).toFixed(4) || '-'}</p>
            </div>
            <div className="LastBox_SubBox_Box">
              <p>Available to redeem: </p>
              <p className="LastBox_SubBox_Box_largep">
                {' '}
                <h1 style={{ fontSize: '18px', color: 'white' }}>
                  <TokenSymbol symbol="BBOND" size={30} /> {bondBalance.toNumber()}
                </h1>
              </p>
            </div>
            <div className="LastBox_SubBox_Box">
              <div className="LastBox_SubBox_Box_inline">
                <p>Purchase BBond</p>
                <button disabled="true" onClick={approve} className="circular_btn">
                  Purchase <AiOutlineShoppingCart />
                </button>
              </div>
              <div className="LastBox_SubBox_Box_inline">
                <p>Redeem Bomb</p>
                <button disabled="true" className="circular_btn">
                  Redeem <BiDownArrowCircle />
                </button>
              </div>
            </div>
          </div>
        </StyledBox>
      </div>
    </Page>
  );
}

export default Dashboard;
