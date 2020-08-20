import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { height } from '@fortawesome/free-solid-svg-icons/faCloud'; 
import GraphikRegular from "../content/fonts/GraphikRegular.woff";
import GraphikSemibold from "../content/fonts/GraphikSemibold.woff";
import PoppinsLight  from "../content/fonts/Poppins-Light.ttf";
import createPalette from '@material-ui/core/styles/createPalette';
 
const themePalette=createPalette(
  {
  primary: {
    main: "#2a6a9e"
  },
  secondary: {
    main: "#ebebeb"
  }
})
const graphikSemibold = {
  fontFamily: 'Graphik',
  fontStyle: 'semibold',  
  fontWeight: 400,
  src: `
    local('Graphik'),
    local('Graphik-semibold'),
    url(${GraphikSemibold}) format('woff')
  `,
};
const graphikRegular = {
  fontFamily: 'Graphik',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('Graphik'),
    local('Graphik-Regular'),
    url(${GraphikRegular}) format('woff')
  `,
};
const poppinsLight={
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 300,
  src: `
    local('Poppins'),
    local('Poppins-Light'),
    url(${PoppinsLight}) format('truetype')
  `,
};
export const neveTheme = createMuiTheme({
    palette: themePalette,
    typography: {
      fontFamily: ['Graphik','-apple-system','BlinkMacSystemFont','Segoe UI','Helvetica','Arial','sans-serif'].join(','),      
      h2:{
        color: "#FFFFFF",
        fontSize: "52px",
        fontWeight: 600,
        textTransform: "uppercase",
        fontStyle: "normal",
        lineHeight: "1.1em",
        letterSpacing: "-1.4px"
      },
      h5:{      
        fontFamily: 'sans-serif',  
        fontSize: "1em",
        lineHeight: "1.6em",
        letterSpacing: "0px",
        fontWeight: 400,
        textTransform: "none",
        color:themePalette.secondary.main,
        '&:hover':{
          color:"#002a49",
        }        
      },
      button:{
        fontFamily:"Poppins",
        lineHeight: "1em",
        fontSize: "15px",
      },
      subtitle1:{
        fontFamily:"Poppins",
        fontSize: "17px",
        lineHeight:"1.9em",
        marginBottom: "20px",
        color: themePalette.secondary.main,
      }
    },
    shape: {
      borderRadius: 30
    },
    spacing: 4,
    overrides: {  
      MuiCssBaseline: {
        '@global': {
          '@font-face': [graphikRegular,graphikSemibold,poppinsLight],
        },
      },          
      MuiButton: {
        root: {
          textTransform: "none",
          padding: 0,          
          border:"none",
          margin:0,          
          lineHeight:1                    
        },
        textPrimary:{
          color: themePalette.secondary.main,
          fontSize: "16px"          
        },
        fullWidth: {
          maxWidth: "300px"
        },        
      },
      MuiContainer:{        
        root:{
          
          color:themePalette.primary.main,
          
          fontSize: "1em",
          lineHeight: 1.6,
          letterSpacing: "0px",
          paddingTop: "0px",          
          paddingBottom: "0px",          
          marginTop: "0px",
          marginRight: "0px",
          marginBottom: "0px",
          marginLeft: "0px",
        },      
      },
      MuiGrid:{
        "spacing-xs-1":{
          margin:"0px",
          zIndex: 100
        },
        "spacing-xs-2":{
          margin:"10px",          
        }
      }      
    },
    props: {      
      MuiIconButton:{
        color:"primary",
        disableRipple: true,              
      },      
      MuiButton: {
        disableRipple: true,
        variant: "contained",
        color: "primary"
      },    
}});