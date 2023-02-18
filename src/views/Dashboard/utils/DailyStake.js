import React from 'react';
import classes from './DailyStake.module.css';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useEarningsOnBoardroom from '../../../hooks/useEarningsOnBoardroom';
import useStakedBalanceOnBoardroom from '../../../hooks/useStakedBalanceOnBoardroom';
import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useBombFinance from '../../../hooks/useBombFinance';
import useClaimRewardCheck from '../../../hooks/boardroom/useClaimRewardCheck';
import useHarvestFromBoardroom from '../../../hooks/useHarvestFromBoardroom';
import useFetchBoardroomAPR from '../../../hooks/useFetchBoardroomAPR';
import useRedeemOnBoardroom from '../../../hooks/useRedeemOnBoardroom';
import { BiUpArrowCircle, BiDownArrowCircle } from 'react-icons/bi';
import TokenSymbol from '../../../components/TokenSymbol';

const Element = (props) => {
  return (
    <div className={classes.element}>
      <p>{props.title}</p>
      <p>
        {props.tokenName ? <TokenSymbol symbol={props.tokenName} size={20} /> : null} {props.amount}
      </p>
    </div>
  );
};

const DailyStake = (props) => {
  const bombFinance = useBombFinance();
  const earnings = useEarningsOnBoardroom();
  const stakedBalance = useStakedBalanceOnBoardroom();
  const [approveStatus, approve] = useApprove(bombFinance.BSHARE, bombFinance.contracts.Boardroom.address);
  const canClaimReward = useClaimRewardCheck();
  const { onReward } = useHarvestFromBoardroom();
  const boardroomAPR = useFetchBoardroomAPR();
  const { onRedeem } = useRedeemOnBoardroom();

  return (
    <div className={`${props.className} ${classes.main}`}>
      <div className={classes.cover}>
        <Element title="Daily returns:" amount={`${(boardroomAPR / 365).toFixed(2)}%`} />
        <Element title="Your Stake:" tokenName="BSHARE" amount={getDisplayBalance(stakedBalance)} />
        <Element title="Earned" tokenName="BOMB" amount={getDisplayBalance(earnings)} />
      </div>
      <div className={classes.btns}>
        <button disabled={approveStatus !== ApprovalState.NOT_APPROVED} onClick={approve}>
          Deposit <BiUpArrowCircle />
        </button>

        <button onClick={onRedeem}>
          Withdraw <BiDownArrowCircle />
        </button>
        <button
          onClick={
            earnings.eq(0) || !canClaimReward
              ? () => alert('no Bomb to claim or you still can not claim the bombs')
              : onReward
          }
        >
          Claim Reward <TokenSymbol symbol="BSHARE" size={20} />
        </button>
      </div>
    </div>
  );
};

export default DailyStake;
