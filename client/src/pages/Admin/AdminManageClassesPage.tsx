import React from "react";
import { Table } from "semantic-ui-react";
import AdminBasePage from "./AdminBasePage";
import { useEffect, useState } from "react";
import { getClasses } from "../../api/classes";
import { ToastContainer, toast } from "react-toastify";
import Class from "../../entities/class";
import { User } from "../../entities";

const AdminManageClassesPage: React.FC = (props): JSX.Element | null => {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    getClasses().then((res) => {
      setClasses(res.data);
    }).catch((err) => {
      toast.error("Failed to get classes");
    });
  }, []);

  return (
  <AdminBasePage>
    <h1>Manage Classes</h1>
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Class ID</Table.HeaderCell>
          <Table.HeaderCell>Class Instructor</Table.HeaderCell>
          <Table.HeaderCell>Student Names</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {classes.map(c => (
          <Table.Row key={c.classId}>
            <Table.Cell>{c.classId}</Table.Cell>
            <Table.Cell>{c.instructor.firstName} {c.instructor.lastName}</Table.Cell>
            <Table.Cell>{c.students.map((s) => s.firstName.concat(s.lastName)).join(';')}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
    <ToastContainer />
  </AdminBasePage>)
}

export default AdminManageClassesPage;