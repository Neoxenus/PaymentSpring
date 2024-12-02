import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Alert } from 'reactstrap';
import AppNavbar from '../AppNavbar';

const AccountNew = () => {
    const initialFormState = {
        number: '',
        accountName: '',
        iban: '',
    };

    const [account, setAccount] = useState(initialFormState);
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAccount({ ...account, [name]: value });
    };

    const validate = () => {
        const errors = {};

        // Account Number validation
        const accNumberRegex = /^\d{5,15}$/;

        if (!account.number.trim()) {
            errors.number = "Account number is required";
        } else if (!accNumberRegex.test(account.number)) {
            errors.number = "Account number should be digits 5 and 15 characters";
        }

        // Account Name validation
        if (!account.accountName.trim()) {
            errors.accountName = "Account name is required";
        } else if (account.accountName.length < 3) {
            errors.accountName = "Account name should be at least 3 characters";
        }

        // IBAN validation (example pattern, could vary based on country)
        const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
        if (!account.iban.trim()) {
            errors.iban = "IBAN is required";
        } else if (!ibanRegex.test(account.iban)) {
            errors.iban = "Invalid IBAN format";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        try {
            const response = await fetch(`/account`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(account)
            });

            if (response.ok) {
                setAccount(initialFormState);
                navigate('/accounts');
            } else {
                const errorMessage = await response.text();
                setError(errorMessage || "An error occurred while creating the account.");
            }
        } catch (error) {
            setError("An error occurred while creating the account.");
        }
    };

    const title = <h2>{id ? 'Edit Account' : 'Add Account'}</h2>;

    return (
        <div>
            <AppNavbar />
            <Container>
                {title}
                {error && <Alert color="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="number">Number</Label>
                        <Input
                            type="text"
                            name="number"
                            id="number"
                            onChange={handleChange}
                            autoComplete="number"
                            invalid={!!formErrors.number}
                        />
                        {formErrors.number && <div className="text-danger">{formErrors.number}</div>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="account_name">Account Name</Label>
                        <Input
                            type="text"
                            name="accountName"
                            id="account_name"
                            onChange={handleChange}
                            autoComplete="account name"
                            invalid={!!formErrors.accountName}
                        />
                        {formErrors.accountName && <div className="text-danger">{formErrors.accountName}</div>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="IBAN">IBAN</Label>
                        <Input
                            type="text"
                            name="iban"
                            id="IBAN"
                            onChange={handleChange}
                            autoComplete="iban"
                            invalid={!!formErrors.iban}
                        />
                        {formErrors.iban && <div className="text-danger">{formErrors.iban}</div>}
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/accounts">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    );
};

export default AccountNew;
