import React from 'react';
import './App.css';
import Home from './components/Home';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AccountList from './components/accounts/AccountList';
import AccountNew from './components/accounts/AccountNew';
import Login from "./components/Login";
import Registration from "./components/Registration";
import AccountReplenish from "./components/accounts/AccountReplenish";
import UserList from "./components/UserList";
import UserInfo from "./components/UserInfo";
import PaymentList from "./components/payments/PaymentList";
import PaymentMake from "./components/payments/PaymentMake";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/registration' element={<Registration/>}/>
                <Route path='/users' element={<UserList/>}/>
                <Route path='/user/:id' element={<UserInfo/>}/>

                <Route path='/accounts'  element={<AccountList/>}/>
                <Route path='/account/:id'  element={<AccountNew/>}/>
                <Route path='/account/replenish/:id' element={<AccountReplenish/>}/>


                <Route path='/payments' element={<PaymentList/>}/>
                <Route path='/payment/new' element={<PaymentMake/>}/>
            </Routes>
        </Router>
    )
}

export default App;