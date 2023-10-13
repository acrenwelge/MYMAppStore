import React from "react";
import {
    Grid,
    GridColumn,
    Container,
} from "semantic-ui-react";
import AdminMenu from "../../components/AdminMenu";

// TODO: Figure out how to add a submitable form

const UserBasePage: React.FC = (props) => {
  return (
    <Container fluid style={{padding: "2"}}>
      <Grid columns={2}>
        <Grid.Row>
          <GridColumn width={3}>
              <AdminMenu/>
          </GridColumn>
          <GridColumn width={12}>
              {props.children}
          </GridColumn>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default UserBasePage;