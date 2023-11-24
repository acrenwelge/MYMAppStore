import React, {useEffect, useState, useReducer} from "react";
import {
  Table,
  Icon,
  Input,
  Container,
  Confirm,
  Loader, Dimmer, Button, Dropdown
} from "semantic-ui-react";
import AdminBasePage from "./AdminBasePage";
import { getClasses } from "../../api/classes";
import { ToastContainer, toast } from "react-toastify";
import Class from "../../entities/class";
import { User } from "../../entities";

interface localState {
  sortBy: string; // 'email', 'name', 'createdAt'
  sortDirection: 'ascending' | 'descending' | undefined;
  filterActivated: boolean | null;
  filterRole: null;
  filterText: string;
}

const AdminManageClassesPage: React.FC = (props): JSX.Element | null => {
  const [classData, setClassData] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmBoxOpen, setConfirmBoxOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const initlocalState: localState = {
      sortBy: '',
      sortDirection: undefined,
      filterActivated: null,
      filterRole: null,
      filterText: '',
  };
  const [state, dispatch] = useReducer(sortingReducer, initlocalState);
  const filteredClasses = classData.filter(one_class => {
      if (state.filterActivated !== null) {
          return false;
      }
      if (state.filterText !== '' && 
          !one_class.instructor.firstName.toLowerCase().includes(state.filterText.toLowerCase()) && 
          !one_class.instructor.firstName.toLowerCase().includes(state.filterText.toLowerCase()) ) {
          return false;
      }
      return true;
  });

  let sortedClasses = filteredClasses;
    if (state.sortBy != '' && state.sortDirection === 'ascending') {
        switch (state.sortBy) {
            case 'id':
                sortedClasses = sortedClasses.sort((a, b) => {
                  if (a['classId'] < b['classId']) return -1;
                  if (a['classId'] > b['classId']) return 1;
                  return 0;
                });
                break;
            case 'instructor':
                sortedClasses = sortedClasses.sort((a, b) => a.instructor['firstName'].localeCompare(b.instructor['firstName']));
                break;
        }
    } else if (state.sortBy != '' && state.sortDirection === 'descending') {
        switch (state.sortBy) {
          case 'id':
              sortedClasses = sortedClasses.sort((b, a) => {
                if (a['classId'] < b['classId']) return -1;
                if (a['classId'] > b['classId']) return 1;
                return 0;
              });
              break;
          case 'instructor':
              sortedClasses = sortedClasses.sort((b, a) => a.instructor['firstName'].localeCompare(b.instructor['firstName']));
              break;
        }
    }

    const handleFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: 'FILTER_TEXT', payload: e.target.value });
    };

    const handleSortChange = (field: string) => {
        if (state.sortBy === field) {
            dispatch({ type: 'CHANGE_SORT_DIRECTION', payload: field});
        } else {
            dispatch({ type: 'CHANGE_SORT_FIELD', payload: field });
        }
    };

    function sortingReducer(state: localState, action: {type: string, payload: string}): localState {
        switch (action.type) {
            case 'CHANGE_SORT_FIELD':
              return {
                ...state,
                sortBy: action.payload,
                sortDirection: 'ascending',
              }
            case 'CHANGE_SORT_DIRECTION':
                return {
                    ...state,
                    sortDirection: state.sortDirection === 'ascending' ? 'descending' : 'ascending',
            }
            case 'FILTER_TEXT':
                return {
                    ...state,
                    filterText: action.payload,
                }
          default:
            throw new Error("invalid action type")
        }
      }

    const refreshAllClassData = async () => {
        setLoading(true);
        getClasses()
        .then(res => {
            setClassData(res.data)
            setLoading(false)
        })
        .catch(error => {
            console.error(error)
            toast.error("Failed to load user data")
            setLoading(false)
        });
    }

  useEffect(() => {
    refreshAllClassData()
  }, []);

  return (
  <AdminBasePage>
    <h1>Manage Classes</h1>
    <div style={{height:'80vh',overflowY:'auto'}}>
    {loading==true?<Dimmer active inverted>
      <Loader inverted>Loading User</Loader>
    </Dimmer>:<div></div>
    }
    <Container>
        {state.sortBy === '' ? null : <div>Sorting by: {state.sortBy}</div>}
        {state.filterActivated === null ? null : 
            <div>Filtering by: {state.filterActivated ? 'Activated' : 'Deactivated'}
            </div>
        }
        {state.filterRole === null ? null : 
            <div>Filtering by: {state.filterRole}
            </div>
        }
    </Container>

      <Input label="Search by User or Owner Name:" icon='search' placeholder='name'
        onChange={(e) => handleFilterTextChange(e)}/>
      <Table sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={state.sortBy === 'id' ? state.sortDirection : undefined}
              onClick={() => handleSortChange('id')}
            >Class ID</Table.HeaderCell>
            <Table.HeaderCell
              sorted={state.sortBy === 'instructor' ? state.sortDirection : undefined}
              onClick={() => handleSortChange('instructor')}
            >Class Instructor</Table.HeaderCell>
            <Table.HeaderCell>Student Names</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body id="classTable">
          {sortedClasses.map(c => (
            <Table.Row key={c.classId} id="classRow">
              <Table.Cell>{c.classId}</Table.Cell>
              <Table.Cell>{c.instructor.firstName} {c.instructor.lastName}</Table.Cell>
              <Table.Cell>{c.students.map((s) => s.firstName.concat(" " + s.lastName)).join(", ")}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
    <ToastContainer />
  </AdminBasePage>)
}

export default AdminManageClassesPage;