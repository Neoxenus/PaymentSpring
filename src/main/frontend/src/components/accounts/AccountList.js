import React, { useEffect, useState } from 'react';
import '../../App.css';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import { useCookies } from "react-cookie";

const AccountList = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const [emptyList, setEmptyList] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('/accounts')
            .then(response => response.json())
            .then(data => {
                setAccounts(data);
                setLoading(false);
                setEmptyList(data.length === 0);
            });
    }, []);

    const remove = async (id) => {
        await fetch(`/account/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
            }
        }).then(() => {
            let updatedAccounts = accounts.filter(account => account.id !== id);
            setAccounts(updatedAccounts);
            setEmptyList(updatedAccounts.length === 0);
        }).catch(err => {
            console.error("Error deleting account:", err);
        });
    };

    const block = async (id) => {
        await fetch(`/account/block/${id}`, {
            method: 'PUT',
            headers: {
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let blockedStatus = [...accounts].find(i => i.id === id)?.isBlocked;
            // blockedStatus = getNewBlockedStatus(blockedStatus);
            const entityIndex = accounts.findIndex((entity) => entity.id === id);
            const updatedAccounts = [...accounts];
            let accountToUpdate = updatedAccounts[entityIndex];
            // console.log(accountToUpdate);
            accountToUpdate.isBlocked = blockedStatus;
            updatedAccounts.splice(entityIndex, 1, accountToUpdate);
            setAccounts(updatedAccounts);
        });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    function getDateFromLocalDateJSON(dateArray) {
        let date = new Date();
        date.setFullYear(dateArray[0], dateArray[1] - 1, dateArray[2]);
        date.setHours(dateArray[3], dateArray[4], dateArray[5]);
        return date;
    }

    const accountList = accounts?.map(account => {
        const date = getDateFromLocalDateJSON(account.dateOfRegistration);
        let blockedStatus;
        if (account.isBlocked === 'BLOCKED') {
            blockedStatus = "BLOCKED";
        } else if (account.isBlocked === 'APPROVAL') {
            blockedStatus = "APPROVAL";
        } else {
            blockedStatus = "ACTIVE";
        }

        return (
            <tr key={account.id}>
                <td>{account.number}</td>
                <td>{account.accountName}</td>
                <td>{account.iban}</td>
                <td>{date.toLocaleString()}</td>
                <td>{account.balanceAmount}</td>
                <td>{blockedStatus}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/account/replenish/" + account.id}>Replenish</Button>
                        {blockedStatus === 'ACTIVE' ?
                            <Button size="sm" color="danger" onClick={() => block(account.id)}>Block</Button> :
                            <Button size="sm" color="primary" onClick={() => block(account.id)}>Unblock</Button>
                        }
                        <Button size="sm" color="danger" onClick={() => remove(account.id)}>Delete</Button> {/* Add delete button */}
                    </ButtonGroup>
                </td>
            </tr>
        );
    });

    return (
        <div>
            <AppNavbar />
            <Container fluid>
                <div className="float-end">
                    <Button color="success" tag={Link} to="/account/new">Add Account</Button>
                </div>
                <h3>My JUG Tour</h3>
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

export default AccountList;
