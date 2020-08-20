import './footer.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { Col, Row } from 'reactstrap';
import { Container, makeStyles } from '@material-ui/core';
import {neveTheme}from '../../../theme';

const useStyles = makeStyles(theme => ({
  footerContainer: {    
    height:"42px",
    paddingTop: "7px",    
    paddingBottom: "7px",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    textAlign:"center"
  }
}));

const Footer = props => (
  
    <Container maxWidth={false} className={useStyles(neveTheme).footerContainer}>
      <Col md="12" >        
        All rights reserved © 2020 Merlion Techs        
      </Col>
    </Container>
  
);

export default Footer;
