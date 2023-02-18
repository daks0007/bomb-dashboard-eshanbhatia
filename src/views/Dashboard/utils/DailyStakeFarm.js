import React from 'react';
import classes from './DailyStake.module.css';
import { getDisplayBalance } from '../../../utils/formatBalance';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';

import useStakedBalance from '../../../hooks/useStakedBalance';
import useEarnings from '../../../hooks/useEarnings';
import useStatsForPool from '../../../hooks/useStatsForPool';
import useHarvest from '../../../hooks/useHarvest';
import useRedeem from '../../../hooks/useRedeem';
import { BiUpArrowCircle, BiDownArrowCircle } from 'react-icons/bi';
import TokenSymbol from '../../../components/TokenSymbol';

const Element = (props) => {
  return (
    <div className={classes.element}>
      <p>{props.title}</p>
      <p>
        <span> {props.tokenName ? <TokenSymbol symbol={props.tokenName} size={20} /> : null}</span> {props.amount}
      </p>
    </div>
  );
};

const DailyStake = (props) => {
  const earnings = useEarnings(props.bank.contract, props.bank.earnTokenName, props.bank.poolId);

  const [approveStatus, approve] = useApprove(props.bank.depositToken, props.bank.address);
  const { onReward } = useHarvest(props.bank);

  const stakedBalance = useStakedBalance(props.bank.contract, props.bank.poolId);
  let statsOnPool = useStatsForPool(props.bank);
  const { onRedeem } = useRedeem(props.bank);

  return (
    <div className={`${props.className} ${classes.main}`}>
      <div className={classes.cover}>
        <Element title="Daily returns:" amount={`${props.bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}%`} />
        <Element
          title="Your Stake:"
          tokenName={props.bank.depositToken.symbol}
          amount={getDisplayBalance(stakedBalance, props.bank.depositToken.decimal)}
        />
        <Element title="Earned" tokenName={props.bank.earnTokenName} amount={getDisplayBalance(earnings)} />
      </div>
      <div className={classes.btns}>
        <button
          disabled={
            props.bank.closedForStaking ||
            approveStatus === ApprovalState.PENDING ||
            approveStatus === ApprovalState.UNKNOWN
          }
          onClick={approve}
        >
          Deposit <BiUpArrowCircle />
        </button>

        <button onClick={onRedeem}>
          {' '}
          Withdraw <BiDownArrowCircle />
        </button>
        <button onClick={() => (earnings.eq(0) ? alert('You have no earning!') : onReward)}>
          Claim Rewards <TokenSymbol symbol="BSHARE" size={20} />
        </button>
      </div>
    </div>
  );
};

export default DailyStake;
