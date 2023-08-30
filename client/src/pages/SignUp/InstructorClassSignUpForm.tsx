import React, { useState, useRef } from 'react';
import { Button, Container, Form, List, Ref } from 'semantic-ui-react';
import {localSignupApiClass} from "../../api/auth";
import { ToastContainer, toast } from 'react-toastify';

function InstructorClassSignUpForm() {
  interface Student {
    name: string;
    email: string;
  }
  const [currStudent, setCurrStudent] = useState({ name: '', email: '' });
  const [students, setStudents] = useState<Student[]>([]);

  const handleNameChange = (value: string) => {
    console.log(value);
    setCurrStudent({ ...currStudent, name: value });
  };

  const handleEmailChange = (value: string) => {
    setCurrStudent({ ...currStudent, email: value });
  };

  const addStudent = () => {
    setStudents([...students, currStudent]);
    setCurrStudent({ name: '', email: '' });
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
        setCurrStudent({ name: '', email: '' });
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
      <h1>Student List</h1>
        <Container>
          <List>
            {students.map((student, index) => (
              <List.Item key={index}>
                <List.Content floated="left">
                  <List.Header>{student.name}</List.Header>
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
          {/* {students.map((student, index) => (
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
        </Container>
        <Container>
          <Form>
            <Form.Group widths="equal">
              <Form.Input
                id="focus-me"
                type="text" fluid
                placeholder="Name"
                value={currStudent.name}
                onChange={(e) => handleNameChange(e.target.value)}
                autoFocus
              />
              <Form.Input
                type="email" fluid
                placeholder="Email"
                value={currStudent.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onKeyPress={(e: { key: string; }) => e.key === 'Enter' ? addStudent() : null}
              />
              <Button color="blue" type="button" onClick={() => addStudent()}>Add</Button>
            </Form.Group>
            <Button color="green" fluid type="submit" onClick={signUpClass}>Submit</Button>
        </Form>
      </Container>
      <ToastContainer position="bottom-right" />
    </Container>
  );
}

export default InstructorClassSignUpForm;
