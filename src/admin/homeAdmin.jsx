import React ,{useState,useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import {AccountTree,AlarmAdd,PeopleOutline,Lock}  from '@material-ui/icons';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Departments from "./departments";
import Doctors from "./doctors";
import Appointments from './requested_appointments';

import { Link, Switch, Route, useHistory } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor:"#007ACC"
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },

  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function AdminHome(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const history = useHistory();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menus=[
    {
      title:"Appointments",
      path:"/admin/appointments",
      icon:<AlarmAdd/>,
      page:() => <Appointments/>,
      exact: true,
    },
    {
      title:"Departments",
      path:"/admin/departments",
      icon:<AccountTree/>,
      page:() => <Departments/>,
      exact: true
    },
    {
      title:"Doctors",
      path:"/admin/doctors",
      icon:<PeopleOutline/>,
      page:() => <Doctors/>,
      exact: true,
    }
  ]

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>

        {menus.map((o) => (
          <ListItem button key={o.title} onClick={()=>{
            history.push(o.path);
            setMobileOpen(false);
          }}>
            <ListItemIcon>{o.icon}</ListItemIcon>
            <ListItemText primary={o.title} />
          </ListItem>
        ))}

      </List>
      <Divider />
      <List>
      <ListItem button key={"logout"} onClick={()=>{
        window.open("/","_self");
      }}>
            <ListItemIcon>{<Lock />}</ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  const logout=()=>{
    window.open("/","_self");
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" elevation={0} className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Hospital Appointment System Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">

        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, 
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          {menus.map((route, i) => (
            <Route
              key={i}
              exact={route.exact}
              path={route.path}
              component={route.page}
            />
          ))}
        </Switch>
      </main>
    </div>
  );
}


export default AdminHome;
