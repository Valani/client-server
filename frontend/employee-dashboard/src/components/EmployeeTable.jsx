import TableSearch from './TableSearch';
import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  randomId,
} from '@mui/x-data-grid-generator';
import axios from 'axios';

const EditToolbar = ({ setEmployees, setRowModesModel }) => {
  const handleClick = () => {
    const id = randomId();
    setEmployees((oldRows) => [{ id, last_name: '', position: '', salary: '', date_of_birth: '', isNew: true }, ...oldRows]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add employee
      </Button>
    </GridToolbarContainer>
  );
}

const EmployeeTable = ({ employees, setEmployees }) => {
  const columns = [
    { field: "last_name", headerName: "Last name", editable: true },
    { field: "position", headerName: "Position", editable: true },
    {
      field: "salary",
      headerName: "Salary",
      editable: true,
      sortComparator: (v1, v2) => parseInt(v1) >= parseInt(v2),
    },
    { field: "date_of_birth", headerName: "Date of birth", editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ]
  const [filteredData, setFilteredData] = useState(employees);
  const [rowModesModel, setRowModesModel] = useState({});

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleSearch = (searchText) => {
    const filtered = employees.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    axios.delete(`http://localhost:8000/api/employees/${id}/`).then(() => {
      setEmployees(employees.filter((row) => row.id !== id));
    });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = employees.find((row) => row.id === id);
    if (editedRow.isNew) {
      setEmployees(employees.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    if (newRow.isNew) {
      // create new employee
      let body = { last_name: newRow.last_name, position: newRow.position, salary: newRow.salary, date_of_birth: newRow.date_of_birth }
      axios.post(`http://localhost:8000/api/employees/`, body).then((response) => {
        setEmployees(employees.map((row) => (row.id === newRow.id ? { ...newRow, id: response.data.id, isNew: false } : row)));
      });
    } else {
      // update existing employee
      axios.patch(`http://localhost:8000/api/employees/${newRow.id}/`, newRow).then(() => {
        setEmployees(employees.map((row) => (row.id === newRow.id ? { ...newRow, isNew: false } : row)));

      });
    }
    return { ...newRow, isNew: false };
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <TableSearch onSearch={handleSearch} />
      <DataGrid
        rows={filteredData.length ? filteredData : employees}
        columns={columns}
        editMode='row'
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setEmployees, setRowModesModel },
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20, 50, 100]}
      />
    </div>
  )
}
EmployeeTable.propTypes = {};
EmployeeTable.defaultProps = {};

export default EmployeeTable;