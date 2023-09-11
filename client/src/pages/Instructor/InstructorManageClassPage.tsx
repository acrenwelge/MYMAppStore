import React, { useEffect } from "react";
import { Button, Container, Form, Grid, GridColumn, Header, Input, Table } from "semantic-ui-react";
import { getClassByInstructor, addStudentToClassByEmail, removeStudentFromClass } from "../../api/classes";
import { ToastContainer, toast } from "react-toastify";
import { User } from "../../entities";
import { localSignupApi } from "../../api/auth";

interface Student {
  id: number;
  name: string;
  email: string;
}

interface ClassData {
  id: number;
  students: Student[];
}

interface NewStudent {
  firstName: string;
  lastName: string;
  email: string;
}

const InstructorManageClassPage: React.FC = (props): JSX.Element | null => {
  const [classData, setClassData] = React.useState<ClassData>({id: 0, students: []});
  const [newStudent, setNewStudent] = React.useState<NewStudent>({firstName: "", lastName: "", email: ""});
  const [addExistingStudentEmail, setExistingStudentEmail] = React.useState("");

  const transformUserToStudent = (user: User): Student => {
    return {
      id: user.userId,
      name: user.firstName + " " + user.lastName,
      email: user.email
    }
  }

  useEffect(() => {
    const instructor = JSON.parse(localStorage.getItem('user') || 'null');
    const instructorId = instructor.userId;
    getClassByInstructor(instructorId)
      .then(res => {
        const students: Student[] = res.data.students.map(u => transformUserToStudent(u));
        setClassData({id: res.data.classId, students: students});
      }).catch(err => {
        console.log(err);
        toast.error("Failed to load class");
      }
    );
  }, []);

  const removeStudent = (studentId: number) => {
    removeStudentFromClass(classData.id, studentId)
      .then(res => {
        const students: Student[] = res.data.students.map(u => transformUserToStudent(u));
        setClassData({id: classData.id, students: students});
        toast.success("Student removed");
      }).catch(err => {
        console.log(err);
        toast.error("Failed to remove student");
      });
  }

  const addNewUserAsStudent = () => {
    // localSignupApi({
    //   firstName: formValues.firstName,
    //   lastName: formValues.lastName,
    //   email: formValues.email,
    //   password: formValues.password
    // }).then((res) => {
    //     setFormValues(emptyVals);
    //     formStateDispatch({ type: "SUCCESS" });
    //     toast.success("Account created");
    //   }).catch((err) => {
    //     console.log(err);
    //     toast.error("Failed to create account");
    //   });
  }

  const addExistingUserAsStudent = () => {
    addStudentToClassByEmail(classData.id, addExistingStudentEmail)
      .then(res => {
        const students: Student[] = res.data.students.map(u => transformUserToStudent(u));
        setClassData({id: classData.id, students: students});
        setExistingStudentEmail("");
        toast.success("Student added");
      }).catch(err => {
        console.log(err);
        toast.error("Failed to add student");
      });
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === 'firstName') {
      setNewStudent({...newStudent, firstName: value});
    } else if (field === 'lastName') {
      setNewStudent({...newStudent, lastName: value});
    } else if (field === 'email') {
      setNewStudent({...newStudent, email: value});
    }
  }

  return (
    <Container className="container-fluid" style={{padding: "2"}}>
      <Grid>
          <Grid.Row>
              <GridColumn>
                  <Header as="h1">Manage Class</Header>
                  <Table sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {classData.students.map(student => (
                          <Table.Row key={student.id}>
                            <Table.Cell>{student.name}</Table.Cell>
                            <Table.Cell>{student.email}</Table.Cell>
                            <Table.Cell>
                              <Button compact color="red" onClick={() => removeStudent(student.id)}>Remove Student</Button>
                            </Table.Cell>
                          </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
              </GridColumn>
          </Grid.Row>
          <Grid.Row>
            <GridColumn>
              <h3>Add Existing User as Student</h3>
              <p>If your student already has an account, enter their email below and we will add them to your class.</p>
              <Form>
                <Form.Field width={6}>
                <Input placeholder="jsmith123@email.com" type="email" label="Email"
                value={addExistingStudentEmail} onChange={(e) => setExistingStudentEmail(e.target.value)}/>
                </Form.Field>
                <Button compact color="green" onClick={() => addExistingUserAsStudent()}>Add Student</Button>
              </Form>
            </GridColumn>
          </Grid.Row>
          <Grid.Row>
            <GridColumn>
              <h3>Add New User as Student</h3>
              <p>If your student does not have an account, enter their information below and we will create an account for them and add them to your class automatically.</p>
              <Form>
                <Form.Field width={5}>
                <Input placeholder="John" type="text" label="First Name"
                value={newStudent.firstName} onChange={(e) => handleInputChange('firstName',e.target.value)}/>
                </Form.Field>
                <Form.Field width={5}>
                <Input placeholder="Smith" type="text" label="Last Name"
                value={newStudent.lastName} onChange={(e) => handleInputChange('lastName',e.target.value)}/>
                </Form.Field>
                <Form.Field width={6}>
                <Input placeholder="jsmith123@email.com" type="email" label="Email"
                value={newStudent.email} onChange={(e) => handleInputChange('email',e.target.value)}/>
                </Form.Field>
                <Button compact color="green" onClick={() => addNewUserAsStudent()}>Add Student</Button>
              </Form>
            </GridColumn>
          </Grid.Row>
      </Grid>
      <ToastContainer />
    </Container>
  );
}

export default InstructorManageClassPage;