import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Alert } from 'reactstrap';
import AppNavbar from '../AppNavbar';

const PaymentNew = () => {
    const initialFormState = {
        amount: '',
        assignment: '', // Added assignment field
        sender: '',
        receiver: ''
    };
    const [accounts, setAccounts] = useState([]);
    const [payment, setPayment] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // State for error messages
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);

        fetch('/accounts')
            .then(response => response.json())
            .then(data => {
                let availableAccounts = data.filter(account => account.isBlocked === 'ACTIVE');
                setAccounts(availableAccounts);
                setLoading(false);
            });
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPayment({ ...payment, [name]: value });
    };

    const validateForm = () => {
        // Reset error state
        setError(null);
        // Check if required fields are filled
        if (!payment.amount || !payment.assignment || !payment.sender || !payment.receiver) {
            setError('All fields are required.');
            return false;
        }
        // Check if amount is a valid number
        if (!/^\d+(\.\d{1,2})?$/.test(payment.amount)) {
            setError('Amount must be a valid number with up to two decimal places.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate the form before submission
        if (!validateForm()) return;

        // Submit the payment
        fetch(`/payment`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payment)
        })            .then(response => response.ok ? response.json() : response.text())
            .then(data => {
                if (typeof data === "object" && data !== null) {
                    navigate('/payments');
                } else {
                    setError(data);
                }
            })
            .catch(error => setError("An error occurred during registration."));
        setPayment(initialFormState);

    };

    if (loading) {
        return <p>Loading...</p>;
    }

    const title = <h2>Make Payment</h2>;

    return (
        <div>
            <AppNavbar />
            <Container>
                {title}
                {error && <Alert color="danger">{error}</Alert>} {/* Display error message */}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="amount">Amount</Label>
                        <Input type="text" pattern="([\d]+([.][\d]{1,2})?)" name="amount"
                               placeholder="Amount"
                               id="amount"
                               onChange={handleChange}
                               required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="assignment">Assignment</Label>
                        <Input type="text" name="assignment"
                               placeholder="Assignment"
                               id="assignment"
                               onChange={handleChange}
                               required
                        />
                    </FormGroup>

                    <Label for="sender">Sender Account</Label>
                    <Input id="sender" list="senderAccounts" name="sender" onChange={handleChange} autoComplete="off" required />
                    <datalist id="senderAccounts">
                        {accounts.map(account =>
                            <option key={account.id} value={account.number} />
                        )}
                    </datalist>

                    <FormGroup>
                        <Label for="receiver">Receiver Account Number</Label>
                        <Input type="text" name="receiver" id="receiver"
                               onChange={handleChange}
                               required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>
                        <Button color="secondary" tag={Link} to="/payments">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
};

export default PaymentNew;
