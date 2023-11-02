/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useContext } from "react";
import { Button, Checkbox, CheckboxProps, Container, Form, Grid, GridColumn, Header, Input, Table } from "semantic-ui-react";
import { getClassByInstructor, addStudentToClassByEmail, removeStudentFromClass } from "../../api/classes";
import { ToastContainer, toast } from "react-toastify";
import { ExpandedUser, ExpandedClass } from "../../entities";
import { localSignupApi } from "../../api/auth";
import { validatePurchaseCode } from "../../api/checkout"
import ApplicationContext from "../../context/application.context";

// @ts-ignore
//const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });
import { capturePaypalOrder, createPaypalOrder } from "../../api/payment";
import { CartDataDto, PayPalOrderDetails } from "../../entities/orders";
import { CartItem } from "../../entities/product";

interface Student {
  id: number;
  firstName: string,
  lastName: string,
  email: string;
  hasSubscription: boolean;
  instructorOwnsSub: boolean;
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
  const [classData, setClassData] = React.useState<ClassData>({id: 0, students: []})
  const [newStudent, setNewStudent] = React.useState<NewStudent>({firstName: "", lastName: "", email: ""})
  const [addExistingStudentEmail, setExistingStudentEmail] = React.useState("")
  const [isInstructor, setIsInstructor] = React.useState<boolean>(true)
  const [checkBoxStates, setCheckBoxStates] = React.useState<{number:boolean}>()
  const ctx = useContext(ApplicationContext);

  const transformUserToStudent = (user: ExpandedUser, instructorId: number): Student => {
    let ownsSub = false
    user.usingSubscriptions.forEach( subs => {
      console.log(subs)
      if (subs.owner.userId == instructorId) {
        ownsSub = true
      }
    })
    return {
      id: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      hasSubscription: user.usingSubscriptions.length != 0,
      instructorOwnsSub: ownsSub
    }
  }

  const checkIsInstructor = () => {
    const user = JSON.parse(localStorage.getItem('user') ?? 'null')
    setIsInstructor(user.role.toLowerCase() === 'instructor')
  }

  const loadClass = () => {
    if (isInstructor) {
      const instructor = JSON.parse(localStorage.getItem('user') ?? 'null')
      console.log(instructor)
      const instructorId = instructor.userId
      getClassByInstructor(instructorId)
        .then(res => {
          // THERE'S AN ERROR WHERE IF THE INSTRUCTOR TRIES TO ADD THEIR OWN EMAIL, THIS ALL BREAKS
          const students: Student[] = res.data.students.map(u => transformUserToStudent(u, instructorId));
          setClassData({id: res.data.classId, students: students});
          console.log("END OF LOADCLASS()")
          if (students.length === 0) {
            toast.warning("No students found in class");
          }
        }).catch(err => {
          console.log(err);
          toast.error("Failed to load class");
        }
      );
    }
  }

  useEffect(() => {
    console.log("__FUNCTION__useEffect")
    checkIsInstructor();
    loadClass();
    
    const checkboxes = {}
    console.log("\tclassData.students =", classData.students)
    for (const student of classData.students) {
      // @ts-ignore
      checkboxes[student.id] = false
    }
    for (const element of ctx.students) {
      // @ts-ignore
      checkboxes[element] = true
    }
    console.log("\tcheckboxes = ", checkboxes)
    // @ts-ignore
    setCheckBoxStates(checkboxes)
  }, []);

  const removeStudent = (studentId: number) => {
    const instructor = JSON.parse(localStorage.getItem('user') ?? 'null')
    removeStudentFromClass(classData.id, studentId)
      .then(res => {
        console.log(res)
        const students: Student[] = res.data.students.map(u => transformUserToStudent(u, instructor.userId))
        setClassData({id: classData.id, students: students})
        const stuArray = ctx.students
        if (stuArray.includes(studentId)) {
          stuArray.splice(stuArray.indexOf(studentId), 1)
        } 
        ctx.setStudents(stuArray)
        toast.success("Student removed")
      }).catch(err => {
        console.log(err)
        toast.error("Failed to remove student")
      });
  }

  const purchaseItems = (studentId: number) => (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    console.log("__FUNCTION__purchaseItems()")

    const stuArray = ctx.students
    const checkboxes = checkBoxStates
    console.log(checkboxes)
    // @ts-ignore
    checkboxes[studentId] = !checkboxes[studentId]    
    setCheckBoxStates(checkboxes)

    console.log("\tstuArray =", stuArray)
    if (stuArray.includes(studentId)) {
      stuArray.splice(stuArray.indexOf(studentId), 1)
    } else {
      stuArray.push(studentId)
    }
    console.log("\tdata.checked =", data.checked)
    data.checked = !data.checked
    console.log("\tdata.checked =", data.checked)

    ctx.setStudents(stuArray)
    console.log("\tstuArray =", stuArray)
    console.log("\tctx.students =", ctx.students)
    console.log("\tcheckboxStates =", checkBoxStates)
  }

  const addExistingUserAsStudent = () => {
    return addExistingUserPassEmail(addExistingStudentEmail);
  }

  const addExistingUserPassEmail = (email: string) => {
    const instructor = JSON.parse(localStorage.getItem('user') ?? 'null')
    return addStudentToClassByEmail(classData.id, email)
      .then(res => {
        console.log(res)
        const students: Student[] = res.data.students.map(u => transformUserToStudent(u, instructor.userId));
        setClassData({id: classData.id, students: students})
        setExistingStudentEmail("")
        toast.success("Student added to class successfully")
      }).catch(err => {
        console.log(err)
        toast.error("Failed to add student")
      });
  }

  const addNewUserAsStudent = () => {
    localSignupApi({
      firstName: newStudent.firstName,
      lastName: newStudent.lastName,
      email: newStudent.email,
    }).then((res) => {
        toast.success("Student account created")
        setNewStudent({firstName: "", lastName: "", email: ""})
        addExistingUserPassEmail(res.data.email)
      }).catch((err) => {
        console.log(err)
        setExistingStudentEmail("")
        toast.error("Failed to create an account for the student")
      });
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === 'firstName') {
      setNewStudent({...newStudent, firstName: value})
    } else if (field === 'lastName') {
      setNewStudent({...newStudent, lastName: value})
    } else if (field === 'email') {
      setNewStudent({...newStudent, email: value})
    }
  }


  if (isInstructor) {
    return (
      <Container name="valid-instructor" className="container-fluid" style={{padding: "2"}}>
        <Grid>
            <Grid.Row>
                <GridColumn>
                    <Header as="h1">Manage Class</Header>
                    <Table className="student-grid" sortable>
                      <Table.Header>
                          <Table.Row>
                              <Table.HeaderCell>First Name</Table.HeaderCell>
                              <Table.HeaderCell>Last Name</Table.HeaderCell>
                              <Table.HeaderCell>Email</Table.HeaderCell>
                              <Table.HeaderCell>Has Active Subscription</Table.HeaderCell>
                              <Table.HeaderCell>You Own Their Subscription</Table.HeaderCell>
                              <Table.HeaderCell>Action</Table.HeaderCell>
                          </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {classData.students.map(student => (
                            <Table.Row id="instructor-class-table-row" key={student.id}>
                              <Table.Cell>{student.firstName}</Table.Cell>
                              <Table.Cell>{student.lastName}</Table.Cell>
                              <Table.Cell id="instructor-class-table-cell-email">{student.email}</Table.Cell>
                              <Table.Cell id="instructor-class-table-cell-has_subscription">{(student.hasSubscription).toString().toUpperCase()}</Table.Cell>
                              <Table.Cell>{(student.instructorOwnsSub).toString().toUpperCase()} </Table.Cell>
                              <Table.Cell>
                                <Button compact id="remove-student" color="red" onClick={() => removeStudent(student.id)}>Remove Student</Button>
                                <Button compact color="blue" onClick={() => purchaseItems(student.id)}>Purchase Items For</Button>
                                
                                <Checkbox checked={// @ts-ignore
                                checkBoxStates[student.id]} 
                                onChange={purchaseItems(student.id)} inputProps={{ 'aria-label': 'controlled' }}/>
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
                  <Input placeholder="jsmith123@email.com" id="existing-email" type="email" label="Email"
                  value={addExistingStudentEmail} onChange={(e) => setExistingStudentEmail(e.target.value)}/>
                  </Form.Field>
                  <Button compact id="existing-add" color="green" onClick={() => addExistingUserAsStudent()}>Add Student</Button>
                </Form>
              </GridColumn>
            </Grid.Row>
            <Grid.Row>
              <GridColumn>
                <h3>Add New User as Student</h3>
                <p>If your student does not have an account, enter their information below and we will create an account for them and add them to your class automatically.</p>
                <Form>
                  <Form.Field width={5}>
                  <Input placeholder="John" type="text" label="First Name" id="new-first-name"
                  value={newStudent.firstName} onChange={(e) => handleInputChange('firstName',e.target.value)}/>
                  </Form.Field>
                  <Form.Field width={5}>
                  <Input placeholder="Smith" type="text" label="Last Name" id="new-last-name"
                  value={newStudent.lastName} onChange={(e) => handleInputChange('lastName',e.target.value)}/>
                  </Form.Field>
                  <Form.Field width={6}>
                  <Input placeholder="jsmith123@email.com" type="email" label="Email" id="new-email"
                  value={newStudent.email} onChange={(e) => handleInputChange('email',e.target.value)}/>
                  </Form.Field>
                  <Button compact id="new-add" color="green" onClick={() => addNewUserAsStudent()}>Add Student</Button>
                </Form>
              </GridColumn>
            </Grid.Row>
        </Grid>
        <ToastContainer />
      </Container>
    )
  } else {
    return (
    <Container name="not-instructor" style={{padding: "2"}}>
      <div id="not-instructor-info">
        Only users classified as instructors are allowed to use this page. 
      </div>
    </Container>
    )
  }
}

export default InstructorManageClassPage;