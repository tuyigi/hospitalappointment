import logo from './logo.svg';
import './App.css';
import { SnackbarProvider } from "notistack";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Home from "./home";
import Login from "./login";
import AdminHome from "./admin/homeAdmin";


function App(props) {
  return (
    <SnackbarProvider
    preventDuplicate
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    maxSnack={2}
  >
    <Router forceRefresh={true}>
        <Switch>
          <Route exact path="/" component={() => <Home {...props} />} />
          <Route  path="/login" component={() => <Login {...props} />} />
          <Route  path="/admin" component={() => <AdminHome {...props} />} />
        </Switch>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
