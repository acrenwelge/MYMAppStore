import React, {useContext, useEffect, useState, useCallback,} from "react";
import {
    Header,
    Divider,
    Form,
    Table,
    Label,
    Menu,
    Icon,
    Grid,
    GridColumn,
    Container,
    Button,
    Pagination
} from "semantic-ui-react";
import * as libphonenumber from "libphonenumber-js";
import {ApplicationContext} from "../../../context";
import Page from "../../../components/Page";
import PropTypes from 'prop-types';
import axios from "axios";
import AdminMenu from "../../../components/AdminMenu";
import { deleteCodeApi, getAllPurchaseCodeData } from "../../../api/admin";

import CodeForm from "./codeForm";
import UpdateCodeForm from "./updateCodeForm";

interface PurchaseCode {
    readonly code_id: number;
    name: string;
    priceOff: number;
}


const AdminUserInfo: React.FC = (props): JSX.Element => {
    // const ctx = useContext(ApplicationContext);
    // const [name, setName] = useState<string>(ctx.user?.name ?? "");
    // const userName = ctx.user?.name;
    // const userEmail = ctx.user?.email;


    const [purchaseData, setPurchaseCodeData] = useState<PurchaseCode[]>([]);

    useEffect(() => {
        getAllPurchaseCodeData()
            .then(res => {
                setPurchaseCodeData(res.data)
            })
            .catch(error => console.error(error));
    }, []);

    const handleDeletePurchaseCode= (code_id:number)=>{
        deleteCodeApi({code_id:code_id})
            .then(res=>{
                getAllPurchaseCodeData()
            .then(res => {
                setPurchaseCodeData(res.data)
            })
            .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    };





    return (
        <Container className="container-fluid" fluid style={{padding: "2"}}>
            <Grid columns={2}>
                <Grid.Row>
                    <GridColumn width={3}>
                        <AdminMenu/>
                    </GridColumn>

                    <GridColumn width={12}>
                        <Table HEIGHT = {200}>
                            <Table.Header>
                                <Table.Row>
                                <Table.HeaderCell>Code ID</Table.HeaderCell>
                                    <Table.HeaderCell>Code</Table.HeaderCell>
                                    <Table.HeaderCell>Percent Off</Table.HeaderCell>
                                    <Table.HeaderCell>Delete Code</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {purchaseData.map(purchaseCode => (
                                    <Table.Row key={purchaseCode.code_id}>
                                        <Table.Cell>{purchaseCode.code_id}</Table.Cell>
                                        <Table.Cell>{purchaseCode.name}</Table.Cell>
                                        <Table.Cell>{purchaseCode.priceOff}</Table.Cell>
                                        <Table.Cell> <Button
                                            color="red"
                                            onClick={() => handleDeletePurchaseCode(purchaseCode.code_id)}
                                            >
                                            DELETE
                                        </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        
                        Add new purchase code:
                        <CodeForm />

                        
                        Update purchase code:
                        <UpdateCodeForm />
                    </GridColumn>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

export default AdminUserInfo;
