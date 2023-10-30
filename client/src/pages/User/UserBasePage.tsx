import React, { useState } from "react";
import ThirdPartyAuthenticators from "../../components/ThirdPartyAuthenticators";
import Page from "../../components/Page";
import UserInfoForm from "./UserInfoForm";
import { Button, Container } from "semantic-ui-react";

// TODO: Figure out how to add a submitable form
// We can use the login page to get an idea of it

const UserBasePage: React.FC = (props) => {
  return (
    <Page>
      <UserInfoForm />
		</Page>
  );
}

export default UserBasePage;