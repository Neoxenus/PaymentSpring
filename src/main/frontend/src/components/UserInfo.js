import React, { useEffect, useState } from 'react';
import '../App.css';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import {Link, useParams} from 'react-router-dom';
import {useCookies} from "react-cookie";

const UserInfo = () => {

    const [user, setUser] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(0);
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const { id } = useParams();

    useEffect(() => {
        setLoading(2)
        fetch(`/accounts/${id}`)
            .then(response => response.json())
            .then(data => {
                setAccounts(data);
                setLoading(loading - 1);
                console.log(data);
                console.log(loading);
            })
        fetch(`/user/${id}`)
            .then(response => response.json())
            .then(data => {
                setUser(data);
                setLoading(loading - 1);
                console.log(data);
                console.log(loading);

            })
    }, []);

    // const remove = async (id) => {
    //     await fetch(`/account/${id}`, {
    //         method: 'DELETE',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(() => {
    //         let updatedAccounts = [...accounts].filter(i => i.id !== id);
    //         setAccounts(updatedAccounts);
    //     });
    // }

    function getNewBlockedStatus(blockedStatus) {
        let blocked ='';
        if(blockedStatus === 'ACTIVE'){
            blocked = 'BLOCKED';
        } else {
            blocked = 'ACTIVE';
        }
        return blocked;
    }

    const block = async (id) => {
        await fetch(`/account/admin-block/${id}`, {
            method: 'PUT',
            headers: {
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let blockedStatus = [...accounts].find(i => i.id === id)?.isBlocked;
            blockedStatus = getNewBlockedStatus(blockedStatus);
            const entityIndex = accounts.findIndex((entity) => entity.id === id);
            const updatedAccounts = [...accounts];
            let accountToUpdate = [...accounts].find(i => i.id === id);
            accountToUpdate.isBlocked = blockedStatus;
            updatedAccounts.splice(entityIndex, 1, accountToUpdate);
            setAccounts(updatedAccounts);

        });
    }

    if (loading > 0) {
        return <p>Loading...</p>;
    }

    function getDateFromLocalDateJSON(dateArray) {
        let date = new Date()
        date.setFullYear(dateArray[0], dateArray[1]-1, dateArray[2])
        date.setHours(dateArray[3], dateArray[4], dateArray[5])
        return date;
    }


    const accountList = accounts.map(account => {
        const date = getDateFromLocalDateJSON(account.dateOfRegistration);

        let blockedStatus;
        if(account.isBlocked === 'BLOCKED'){
            blockedStatus = "BLOCKED";
        } else if(account.isBlocked === 'APPROVAL'){
            blockedStatus = "APPROVAL";
        } else{
            blockedStatus = "ACTIVE";
        }

        return <tr key={account.id}>

            <td>{account.number}</td>
            <td>{account.accountName}</td>
            <td>{account.iban}</td>
            <td>{date.toLocaleString()}</td>

            <td>{account.balanceAmount}</td>
            <td>{blockedStatus}
            </td>
            <td>
                <ButtonGroup>
                    {blockedStatus === 'ACTIVE'?
                        <Button size="sm" color="danger" onClick={() => block(account.id)}>Block</Button> :
                        <Button size="sm" color="primary" onClick={() => block(account.id)}>Unblock</Button>
                    }
                </ButtonGroup>
            </td>
        </tr>

    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <h3>Accounts of user {}</h3>
                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Role</th>
                        <th>Blocked Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.role}</td>
                        <td>{user.isBlocked}
                        </td>
                        <td>
                            <ButtonGroup>
                                {user.isBlocked === 'ACTIVE'?
                                    <Button size="sm" disabled={(user.role === 'ADMIN' && user.isBlocked === 'ACTIVE')}
                                            color="danger" onClick={() => block(user.id)}>Block</Button> :
                                    <Button size="sm" color="primary" onClick={() => block(user.id)}>Unblock</Button>
                                }
                            </ButtonGroup>
                        </td>
                    </tr>
                    </tbody>
                </Table>
                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th>Number</th>
                        <th>Name</th>
                        <th>IBAN</th>
                        <th>Date of registration</th>
                        <th>Balance Amount</th>
                        <th>Blocked Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {accountList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default UserInfo;