import React, { useState, useRef } from 'react';
import { Button, Container, Form, Grid, List, Message, Ref, Segment } from 'semantic-ui-react';
import {localSignupApiClass} from "../../api/auth";
import { ToastContainer, toast } from 'react-toastify';

function InstructorClassSignUpForm() {
  interface Student {
    firstName: string;
    lastName: string;
    email: string;
  }
  const [currStudent, setCurrStudent] = useState({ firstName: '', lastName: '', email: '' });
  const [students, setStudents] = useState<Student[]>([]);
  const [success, setSuccess] = useState(false);

  const handleStudentInfoChange = (field: string, value: string) => {
    setCurrStudent({ ...currStudent, [field]: value });
  };

  const addStudent = () => {
    setStudents([...students, currStudent]);
    setCurrStudent({ firstName: '', lastName: '', email: '' });
    // NOTE: This is a hacky way to focus on the first input field because Refs and/or the autoFocus prop doesn't work
    document.getElementById('focus-me')?.focus();
  };

  const removeStudent = (index: number) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
  };

  const signUpClass = () => {
    if (students.length == 0) {
      toast.error("Please add at least one student.");
      return;
    }
    localSignupApiClass(students).then((res) => {
        setCurrStudent({ firstName: '', lastName: '', email: '' });
        setStudents([]);
        toast.success("Successfully signed up all students!");
    }).catch((err) => {
        console.log(err);
        toast.error("Something went wrong. Unable to register all students.");
        // if (err.response.status == 409) {
        //    formStateDispatch({
        //    type: "REQUEST_ERROR",
        //    payload:"Unable to register all students. The account has already been created."
        //   })
        // }
    });
  };

  return (
    <Container>
      <Container hidden={success}>
        <h1>Instructor Sign Up</h1>
        <p>
          First, provide your name and email to create an instructor account.
          Then provide a list of names and emails for your students, and we will email them a link to activate their accounts
          and assign them to your class. When you sign in, you can manage your class by adding and removing students and purchasing 
          subscriptions for them.
        </p>
        <h2>Student List</h2>
        <List>
          {students.map((student, index) => (
            <List.Item key={index}>
              <List.Content floated="left">
                <List.Header>{student.firstName} {student.lastName}</List.Header>
                {student.email}
              </List.Content>
              <List.Content floated="right">
                <Button type="button" onClick={() => removeStudent(index)}>
                  Remove
                </Button>
              </List.Content>
            </List.Item>
          ))}
        </List>
        {/* ALTERNATE IDEA FOR STUDENT LIST
        {students.map((student, index) => (
          <Form.Group key={index} widths="equal">
            <Form.Input
              style={{ fontColor: 'black', fontWeight: 'bold' }}
              disabled
              type="text" fluid
              placeholder="Name"
              value={student.name}
            />
            <Form.Input
              disabled
              type="email" fluid
              placeholder="Email"
              value={student.email}
            />
            <Button type="button" onClick={() => removeStudent(index)}>
              Remove
            </Button>
          </Form.Group>
        ))} */}
        <Form>
          <Form.Group>
            <Form.Input
              width={6}
              id="focus-me"
              type="text" fluid
              // label="First Name"
              placeholder="First Name"
              value={currStudent.firstName}
              onChange={(e) => handleStudentInfoChange("firstName",e.target.value)}
              autoFocus
            />
            <Form.Input
              width={6}
              type="text" fluid
              // label="Last Name"
              placeholder="Last Name"
              value={currStudent.lastName}
              onChange={(e) => handleStudentInfoChange("lastName",e.target.value)}
              autoFocus
            />
            <Form.Input
              width={8}
              type="email" fluid
              // label="Email"
              placeholder="Email"
              value={currStudent.email}
              onChange={(e) => handleStudentInfoChange("email",e.target.value)}
              onKeyPress={(e: { key: string; }) => e.key === 'Enter' ? addStudent() : null}
            />
            <Button color="blue" type="button" onClick={() => addStudent()}>Add</Button>
          </Form.Group>
          <Button color="green" fluid type="submit" onClick={signUpClass}>Submit</Button>
        </Form>
        <ToastContainer position="bottom-right" />
      </Container>
      <Container>
        <Message
          hidden={!success}
					content="Your account has been successfully created. To login, first confirm your email using the link that was sent to the email address you provided."
					header="SUCCESS"
					success
				/>
      </Container>
    </Container>
  );
}

export default InstructorClassSignUpForm;
