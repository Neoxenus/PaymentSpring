import React, {useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from '../AppNavbar';

const AccountNew = () => {
    const initialFormState = {
        number: '',
        accountName: '',
        iban: '',
    };
    const [account, setAccount] = useState(initialFormState);
    const navigate = useNavigate();
    const { id } = useParams();

    // useEffect(() => {
    //     if (id !== 'new') {
    //         fetch(`/account/${id}`)
    //             .then(response => response.json())
    //             .then(data => setAccount(data));
    //     }
    // }, [id, setAccount]);

    const handleChange = (event) => {
        const { name, value } = event.target

        setAccount({ ...account, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(account);
        await fetch(`/account`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(account)
        });
        setAccount(initialFormState);
        navigate('/accounts');
    }

    const title = <h2>{account.id ? 'Edit Account' : 'Add Account'}</h2>;
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
                        <Label for="number">Number</Label>
                        <Input type="text" name="number" id="number"
                               onChange={handleChange} autoComplete="number"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="account_name">Account Name</Label>
                        <Input type="text" name="accountName" id="account_name"
                               onChange={handleChange} autoComplete="account name"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="IBAN">IBAN</Label>
                        <Input type="text" name="iban" id="IBAN"
                               onChange={handleChange} autoComplete="iban"/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>
                        <Button color="secondary" tag={Link} to="/accounts">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    )
};

export default AccountNew;