import React, { useEffect } from "react";
import { Button, Container, Grid, GridColumn, Header, Icon, Input, Table } from "semantic-ui-react";
import AdminMenu from "../../components/AdminMenu";

interface Student {
  id: number;
  name: string;
  email: string;
}

const ManageClassPage: React.FC = (props): JSX.Element | null => {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [newStudent, setNewStudent] = React.useState<Student>({id: 0, name: "", email: ""});

  useEffect(() => {
    // fetch('/api/students')
    //   .then(res => res.json())
    //   .then(data => {
    //     setStudents(data);
    //   }
    // );
  }, []);


  const removeStudent = (id: number) => {
    setStudents(students.filter(student => student.id !== id));
  }

  const addStudent = () => {
    if (students.length === 0) newStudent.id = 1;
    else newStudent.id = students[students.length - 1].id + 1 || 1;
    setStudents([...students, newStudent]);
    setNewStudent({id: 0, name: "", email: ""});
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === 'name') {
      setNewStudent({...newStudent, name: value});
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
                      {students.map(student => (
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
                  <Input placeholder="Student Name" type="text" value={newStudent.name} onChange={(e) => handleInputChange('name',e.target.value)}/>
                  <Input placeholder="Student Email" type="email" value={newStudent.email} onChange={(e) => handleInputChange('email',e.target.value)}/>
                  <Button compact color="green" onClick={() => addStudent()}>Add Student</Button>
              </GridColumn>
          </Grid.Row>
      </Grid>
    </Container>
  );
}

export default ManageClassPage;