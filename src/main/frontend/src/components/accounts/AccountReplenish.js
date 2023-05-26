import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import {useCookies} from "react-cookie";

const AccountReplenish = () => {
    // const initialFormState = {
    //     amount: ''
    // };



    const [amount, setAmount] = useState([]);
    const [account, setAccount] = useState();
    const navigate = useNavigate();
    const { id } = useParams();
    const [cookies] = useCookies(['XSRF-TOKEN']);

    useEffect(() => {
        fetch(`/account/${id}`)
            .then(response => response.json())
            .then(data => setAccount(data));
    }, [id, setAccount]);

    const handleChange = (event) => {
        const { name, value } = event.target

        setAmount( value )
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        //console.log(account);
        await fetch(`/account/replenish/${id}`, {
            method: 'PUT',
            headers: {
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(amount)
        });
        navigate('/accounts');
    }
    //console.log(account);
    //console.log(account.accountName);
    const title = <h2>Replenishment of account {account?.accountName}</h2>;
    return (<div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={handleSubmit}>

                    <FormGroup>
                        <Label for="amount">Amount</Label>
                        <Input type="text" pattern="([\d]+([.][\d]{1,2})?)" name="amount"
                               placeholder="Amount"
                               id="amount"
                               onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Send</Button>{''}
                        <Button color="secondary" tag={Link} to="/accounts">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    )
};

export default AccountReplenish;