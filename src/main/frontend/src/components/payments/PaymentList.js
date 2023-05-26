import React, { useEffect, useState } from 'react';
import '../../App.css';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import {useCookies} from "react-cookie";

const PaymentList = () => {

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['XSRF-TOKEN']);


    useEffect(() => {
        setLoading(true);

        fetch('/payments')
            .then(response => response.json())
            .then(data => {
                setPayments(data);
                setLoading(false);
                console.log(data);
            })
    }, []);

    const cancel = async (id) => {
        await fetch(`/payment/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedPayments = [...payments].filter(i => i.id !== id);
            setPayments(updatedPayments);
        });
    }

    // function getNewPaymentStatus(paymentStatus) {
    //     let blocked ='';
    //     if(paymentStatus === ''){
    //         blocked = 'BLOCKED';
    //     } else if (blockedStatus === 'BLOCKED'){
    //         blocked = 'APPROVAL';
    //     }
    //     return blocked;
    // }

    const send = async (id) => {
        await fetch(`/payment/send/${id}`, {
            method: 'PUT',
            headers: {
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            //let blockedStatus = [...payments].find(i => i.id === id)?.isBlocked;
            //blockedStatus = getNewBlockedStatus(blockedStatus);

            const entityIndex = payments.findIndex((entity) => entity.id === id);
            const updatedAccounts = [...payments];
            let accountToUpdate = [...payments].find(i => i.id === id);
            accountToUpdate.status = 'SENT';
            updatedAccounts.splice(entityIndex, 1, accountToUpdate);
            setPayments(updatedAccounts);

        });
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    function getDateFromLocalDateJSON(dateArray) {
        let date = new Date()
        date.setFullYear(dateArray[0], dateArray[1] - 1, dateArray[2])
        date.setHours(dateArray[3], dateArray[4], dateArray[5])
        return date;
    }

    const paymentList = payments?.map(payment => {
        const time = getDateFromLocalDateJSON(payment.time);

        // let blockedStatus;
        // if(payment.isBlocked === 'BLOCKED'){
        //     blockedStatus = "BLOCKED";
        // } else if(account.isBlocked === 'APPROVAL'){
        //     blockedStatus = "APPROVAL";
        // } else{
        //     blockedStatus = "ACTIVE";
        // }

        return <tr key={payment.id}>

            <td>{payment.number}</td>
            <td>{payment.amount}</td>
            <td>{payment.assignment}</td>
            <td>{time.toLocaleString()}</td>

            <td>{payment.status}</td>
            {/*<td></td>*/}
            {/*{blockedStatus}*/}
            {/*</td>*/}
            <td>
                <ButtonGroup>
                    <Button size="sm" color="danger"
                            disabled={(payment.status === 'SENT')}
                            onClick={() => cancel(payment.id)}>Cancel</Button>

                    <Button size="sm" color="success"
                            disabled={(payment.status === 'SENT')}
                            onClick={() => send(payment.id)}>Send</Button>
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
                <div className="float-end">
                    <Button color="success" tag={Link} to="/payment/new">Make Payment</Button>
                </div>
                <h3>My JUG Tour</h3>
                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th>Number</th>
                        <th>Amount</th>
                        <th>Assignment</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paymentList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default PaymentList;