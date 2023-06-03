import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import authService from './services/auth.service';
import VilleList from './components/VilleComponent/VilleList';
import { Link, Route, Routes } from 'react-router-dom';
import Login from './components/loginComponent/Login';
import SignIn from './components/loginComponent/SignIn';
import AddVille from './components/VilleComponent/AddVille';
import EditVille from './components/VilleComponent/EditVille';
import AddPharmacie from './components/PharmacieComponent/AddPharmacie';
import PharmacieList from './components/PharmacieComponent/PharmacieList';
import ListPhGarde from './components/phGardeComponent/ListPhGarde';
import AddPhGarde from './components/phGardeComponent/AddPhGarde';
import EditPharmacie from './components/PharmacieComponent/EditPharmacie';
import ZoneAdd from './components/zoneComponent/ZoneAdd';
import ZoneList from './components/zoneComponent/ZoneList';
import ZoneEdit from './components/zoneComponent/ZoneEdit';
import EditPhGarde from './components/phGardeComponent/EditPhGarde';



class App extends Component {
 

  
  constructor(props) {
    super(props);
    this.state = {
      showNavColor: false,
      showSidebar: false
    };
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }
  handleToggleSidebar = () => {
    this.setState((prevState) => ({
      showSidebar: !prevState.showSidebar
    }));
  };
  componentDidMount() {
    const user = authService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),

      });
    }
  }

  logOut() {
    authService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }
  toggleNavSecond = () => {
    this.setState(prevState => ({
      showNavSecond: !prevState.showNavSecond
    }));
  };

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;
    const { showNavSecond } = this.state;
  

    return (
      <div>

 

<nav class="navbar navbar-expand-lg navbar-light bg  ">
  <div class="container-fluid">
    <Link class="navbar-brand" href="#">Pharmacy</Link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <Link class="nav-link active" aria-current="page" href="#">Home</Link>
        {showAdminBoard && (
        <Link to={"/admin"} class="nav-link">Ville</Link>
        )}
       
 {showAdminBoard && (
        <Link to={"/ZoneList"} class="nav-link">Zone</Link>
 )}
 {showAdminBoard && (
        <Link to={"/ListPharmacie"} class="nav-link">Pharmacy</Link>
 )}
       {showAdminBoard && (
        <Link to={"/ListGarde"} class="nav-link">Garde</Link>
 )}
      </div>
      
    </div>
    
    

      




       <div class="navbar-nav me-5">
      
    <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Profile
          </a>
          {currentUser ? (
          <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <li><Link to={"/profile"} class="dropdown-item" href="#">Hello {currentUser.username}</Link></li>
            <li><Link  to={"/login"} class="dropdown-item" onClick={this.logOut}>LogOut</Link></li>
           
          </ul>
          ):(
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <li><Link to={"/login"} class="dropdown-item" href="#">Login</Link></li>
            <li><Link  to={"/register"} class="dropdown-item" onClick={this.logOut}>Sig Up</Link></li>
           
          </ul>

          )}
        </li>
       
        </div>
  </div>



</nav>


      

        <div className="container mt-5">
          <Routes>
            
           
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignIn />} />
           
            <Route path="/admin" element={<VilleList />} />
            <Route path="/AddVille" element={<AddVille />} />
            <Route path="/AddPharmacie" element={<AddPharmacie />} />
            <Route path="/ListPharmacie" element={<PharmacieList />} />
            <Route path="/ListGarde" element={<ListPhGarde />} />
            <Route path="/AddPh" element={<AddPhGarde />} />
            <Route path="/EditPharmacie/:id" element={<EditPharmacie />} />
            <Route path="/AddZone" element={<ZoneAdd />} />
            <Route path="/ZoneList" element={<ZoneList />} />
           
            <Route path="/EditVille/:id" element={<EditVille />} />
            <Route path="/EditZone/:id" element={<ZoneEdit />} />
            <Route path="/EditPhGarde/:id" element={<EditPhGarde />} />
          </Routes>
        </div>
      </div>
    );
  }
  }


export default App;
