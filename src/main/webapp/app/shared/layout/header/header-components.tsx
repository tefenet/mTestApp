import React from 'react';
import { Translate } from 'react-jhipster';

import { NavItem, NavLink, NavbarBrand } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import appConfig from 'app/config/constants';
import Link from '@material-ui/core/Link';
import { Container, makeStyles } from '@material-ui/core';
import {neveTheme}from '../../../theme';
const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: "145px",
    paddingTop: "7px",    
    paddingBottom: "7px",
    backgroundColor: theme.palette.primary.main,
  }
}));

export const Brand = () => ( 
  <Container className={useStyles(neveTheme).mainContainer}>
    <Link href="/" >
      <img src="content/images/cropped-logo-blanco-png.png" alt="Logo" height="100%" width="100%" />
    </Link>  
  </Container>  
);