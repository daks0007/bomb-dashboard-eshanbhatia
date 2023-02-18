import React from 'react';
import classes from './StyledBox.module.css';

const StyledBox = (props) => {
  return <div className={`${props.className} ${classes.box}`}>{props.children}</div>;
};

export default StyledBox;
