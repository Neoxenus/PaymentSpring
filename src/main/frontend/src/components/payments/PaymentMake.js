import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from '../AppNavbar';

const AccountNew = () => {
    const initialFormState = {
        amount: '',
        assignment: '',
        sender: '',
        receiver: ''
    };
    const [accounts, setAccounts] = useState([]);
    const [payment, setPayment] = useState(initialFormState);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);

        fetch('/accounts')
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                //setAccounts(data);
               // console.log(accounts);
                let availableAccounts = [...data].filter(account => account.isBlocked === 'ACTIVE');
                setAccounts(availableAccounts);
                setLoading(false);
                //console.log(availableAccounts);
            })
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target
        // console.log(name);
        // console.log(value);
        setPayment({ ...payment, [name]: value })
    }
    // const handleSenderChange = (event) => {
    //     const { name, value, key } = event.target
    //     console.log(event.target);
    //     console.log(event);
    //     setPayment({ ...payment, [name]: accounts.find(e => e.id === value) })
    // }

    const handleSubmit = async (event) => {
        event.preventDefault();
        //payment.amount = parseFloat(payment.amount);
        //setPayment({ ...payment, amount: parseFloat(payment.amount) })
        console.log(payment);
        await fetch(`/payment`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payment)
        });
        setPayment(initialFormState);
        navigate('/payments');
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    const title = <h2>Make Payment</h2>;
    // <form method="post" action="<c:url value="/"/>"  class="form-group">
    //
    // <input name="command" type="hidden" value="addAccount">
    //
    //     <label for="number" class="form-label"><fmt:message key='account.table.accountNumber'/></label>
    //     <input type="text" name="number" class="form-control" required
    //            id="number">
    //         <br/>
    //         <label for="account_name" class="form-label"><fmt:message key='account.table.accountName'/></label>
    //         <input type="text" name="account_name" class="form-control" required
    //                id="account_name">
    //             <br/>
    //             <label for="IBAN" class="form-label"><fmt:message key='account.table.iban'/></label>
    //             <input type="text" name="IBAN" class="form-control" required
    //                    id="IBAN">
    //                 <br/>
    //                 <input type="submit" class="btn btn-info" value="<fmt:message key='accounts.addAccount'/>">
    //                 </form>
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

                    <Label for="sender">Sender Account</Label>
                    <Input id="sender" list="senderAccounts" name="sender" onChange={handleChange} autoComplete="off"/>
                    <datalist id="senderAccounts">
                        {accounts.map(account =>
                            <option key={account.id} value={account.number}/>
                        )}
                    </datalist>

                    <FormGroup>
                        <Label for="receiver">Receiver Account Number</Label>
                        <Input type="text" name="receiver" id="receiver"
                               onChange={handleChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>
                        <Button color="secondary" tag={Link} to="/payments">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    )
};

export default AccountNew;