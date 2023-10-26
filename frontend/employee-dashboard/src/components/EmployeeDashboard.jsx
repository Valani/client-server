import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeTable from './EmployeeTable';
import Header from './Header';

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/employees/').then((response) => {
      setEmployees(response.data);
    });
  }, []);

  return (
    <div>
      <Header />
      <EmployeeTable employees={employees} setEmployees={setEmployees} />
    </div>
  )
}

EmployeeDashboard.propTypes = {};
EmployeeDashboard.defaultProps = {};

export default EmployeeDashboard;
