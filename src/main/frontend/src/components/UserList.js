import React, { useEffect, useState } from 'react';
import '../App.css';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import {useCookies} from "react-cookie";

const UserList = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['XSRF-TOKEN']);


    useEffect(() => {
        setLoading(true);

        fetch('/users')
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
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
        } else{
            blocked = 'ACTIVE';
        }
        return blocked;
    }

    const block = async (id) => {
        await fetch(`/user/block/${id}`, {
            method: 'PUT',
            headers: {
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let blockedStatus = [...users].find(i => i.id === id)?.isBlocked;
            blockedStatus = getNewBlockedStatus(blockedStatus);

            const entityIndex = users.findIndex((entity) => entity.id === id);
            const updatedUsers = [...users];
            let userToUpdate = [...users].find(i => i.id === id);
            userToUpdate.isBlocked = blockedStatus;
            updatedUsers.splice(entityIndex, 1, userToUpdate);
            setUsers(updatedUsers);

        });
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    // function getDateFromLocalDateJSON(dateArray) {
    //     let date = new Date()
    //     date.setFullYear(dateArray[0], dateArray[1]-1, dateArray[2])
    //     date.setHours(dateArray[3], dateArray[4], dateArray[5])
    //     return date;
    // }

    const userList = users.map(user => {
        //const date = getDateFromLocalDateJSON(account.dateOfRegistration);

        let blockedStatus;
        if(user.isBlocked === 'BLOCKED'){
            blockedStatus = "BLOCKED";
        } else if(user.isBlocked === 'APPROVAL'){
            blockedStatus = "APPROVAL";
        } else{
            blockedStatus = "ACTIVE";
        }


        return <tr key={user.id}>

            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.phoneNumber}</td>

            <td>{user.role}</td>
            <td>{user.isBlocked}
            </td>
            <td>
                <ButtonGroup>
                    <Button size="sm" color="primary" tag={Link}
                            to={"/user/" + user.id}>More</Button>
                    {blockedStatus === 'ACTIVE'?
                        <Button size="sm" disabled={(user.role === 'ADMIN' && user.isBlocked === 'ACTIVE')}

                                color="danger" onClick={() => block(user.id)}>Block</Button> :
                        <Button size="sm" color="primary" onClick={() => block(user.id)}>Unblock</Button>
                    }
                    {/*<Button size="sm" color="secondary" tag={Link} to={"/account/" + account.id}>Edit</Button>*/}
                    {/*<Button size="sm" color="danger" onClick={() => remove(account.id)}>Delete</Button>*/}
                </ButtonGroup>
            </td>
        </tr>

    });

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <h3>Users</h3>
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
                    {userList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default UserList;