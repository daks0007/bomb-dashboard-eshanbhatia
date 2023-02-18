import React from 'react';
import classes from './AdvancedStake.module.css';
import DailyStakeFarm from './DailyStakeFarm';
import useStatsForPool from '../../../hooks/useStatsForPool';
import TokenSymbol from '../../../components/TokenSymbol';

const AdvancedStake = (props) => {
  let statsOnPool = useStatsForPool(props.bank);

  return (
    <div className={`${props.className} ${classes.main}`}>
      <div className={classes.title}>
        <p className={classes.name}>
          {' '}
          <TokenSymbol size={32} symbol={props.bank.depositTokenName} />
          {props.name}
        </p>
        <p>TVL: ${statsOnPool?.TVL}</p>
      </div>
      <hr className={classes.hr}></hr>
      <DailyStakeFarm bank={props.bank} />
    </div>
  );
};

export default AdvancedStake;
