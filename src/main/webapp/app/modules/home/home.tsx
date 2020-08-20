import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { Grid, makeStyles, Container, Typography, Button } from '@material-ui/core';
import { blueGrey, blue } from '@material-ui/core/colors';
import { neveTheme } from 'app/theme';

export type IHomeProp = StateProps;

const useStyles = makeStyles(theme => ({
  containerOne: {
    backgroundImage: `url(${"../../content/images/fondoConBirome.jpg"})`,
    backgroundSize: "cover",
  },
  containerTwo: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(94, 153, 197, 0.63)",
    zIndex: 1,
    position: "sticky"

  },
  gridCol: {
    display: "flex",
    alignContent: "center",
    paddingTop: "200px",
    paddingBottom: "200px",
    zIndex: 100,
    position: "sticky"
  },
  butonInit: {
    fontSize: "15px",
    textTransform: "uppercase",
    textDecoration: "none",
    letterSpacing: "1.5px",
    textShadow: "-49px 0px 12px rgba(0,0,0,0.3)",    
    borderRadius: "50px 50px 50px 50px",
    padding: "15px 50px 15px 50px",
    backgroundColor:neveTheme.palette.primary.dark,
    "&:hover": {      
      backgroundColor: neveTheme.palette.primary.light
  }    
  },
  image:{
    padding:"50px 100px 50px 50px"
  },
}));


export const Home = (props: IHomeProp) => {
  const { account } = props;

  return (
    <Container maxWidth={false} disableGutters={true}>

      <Container maxWidth={false} className={useStyles().containerOne} disableGutters={true}>
        <Container maxWidth={false} className={useStyles().containerTwo} disableGutters={true}>

          <Grid
            container
            spacing={1}
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            alignContent="stretch"
            wrap="nowrap"
          >

            <Grid
              container={true}
              spacing={1}
              direction="column"
              justify="center"
              alignItems="center"
              alignContent="center"
              wrap="nowrap"
              className={useStyles().gridCol}
            >
              <Typography align="center" variant="h2" paragraph={true} >
                <Translate contentKey="home.title">Welcome, Java Hipster!</Translate>
              </Typography>
              <Typography align="center" variant="subtitle1" >
                <Translate contentKey="home.subtitle">This is your homepage</Translate>
              </Typography>
              <Button className={useStyles().butonInit} >
                <Typography variant="button" color="initial">contact us</Typography>
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Container>
      
        {account && account.login ? (
          <Grid container spacing={1} justify="center">
            <Container maxWidth="xs">
          <div>
            <Alert color="success">
              <Translate contentKey="home.logged.message" interpolate={{ username: account.login }}>
                You are logged in as user {account.login}.
              </Translate>
            </Alert>
          </div>  
          </Container>
          </Grid>
        ) : (
            <Container maxWidth={false}>
              <Grid
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                alignContent="stretch"
                wrap="nowrap"                
              >
                <Grid
                  container={true}
                  spacing={1}
                  direction="column"
                  justify="center"
                  alignItems="center"
                  alignContent="center"
                  wrap="nowrap"
                >
                  <div>
                    <Alert color="warning">
                      <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
                      <Link to="/login" className="alert-link">
                        <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
                      </Link>
                      <Translate contentKey="global.messages.info.authenticated.suffix">
                        , you can try the default accounts:
                <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
                <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
              </Translate>
                    </Alert>

                    <Alert color="warning">
                      <Translate contentKey="global.messages.info.register.noaccount">You do not have an account yet?</Translate>&nbsp;
              <Link to="/account/register" className="alert-link">
                        <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
                      </Link>
                    </Alert>
                  </div>
                </Grid>
              </Grid>
            </Container>
          )}
          <Grid container spacing={1} 
          direction="row"
          justify="flex-start"
          alignItems="center"
          alignContent="stretch"
          wrap="nowrap"                
        >
          <Grid
            container={true}
            spacing={1}
            direction="column"
            justify="center"
            alignItems="center"
            alignContent="center"
            wrap="nowrap"
            xs={6}
          >
        <p>
          <Translate contentKey="home.question">If you have any question on JHipster:</Translate>
        </p>

        <ul>
          <li>
            <a href="https://www.jhipster.tech/" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.homepage">JHipster homepage</Translate>
            </a>
          </li>
          <li>
            <a href="http://stackoverflow.com/tags/jhipster/info" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.stackoverflow">JHipster on Stack Overflow</Translate>
            </a>
          </li>
          <li>
            <a href="https://github.com/jhipster/generator-jhipster/issues?state=open" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.bugtracker">JHipster bug tracker</Translate>
            </a>
          </li>
          <li>
            <a href="https://gitter.im/jhipster/generator-jhipster" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.chat">JHipster public chat room</Translate>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/jhipster" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.follow">follow @jhipster on Twitter</Translate>
            </a>
          </li>
        </ul>

        <p>
          <Translate contentKey="home.like">If you like JHipster, do not forget to give us a star on</Translate>{' '}
          <a href="https://github.com/jhipster/generator-jhipster" target="_blank" rel="noopener noreferrer">
            Github
          </a>
          !
        </p>
        </Grid>
        <Grid container spacing={1} direction="column" xs={6} sm={3}>
          
        </Grid>
        <Grid
                  container={true}
                  spacing={1}
                  direction="column"
                  justify="center"
                  alignItems="center"
                  alignContent="center"
                  wrap="nowrap"
                  xs={6} sm={3}
                >
                  <Container className={useStyles().image} component="img" src="content/images/LOGO-OK-PNG.png">
                    
                  </Container>
                  
                </Grid>
        </Grid>
      
    </Container>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
