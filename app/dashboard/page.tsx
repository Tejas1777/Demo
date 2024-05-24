'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './dashboard.module.css';
import Swal from 'sweetalert2';
import router, { useRouter } from 'next/router';    
interface Employee {
   empid: string;
   firstname: string;
   lastname: string;
   email: string;
   contact: string;
   address: string;
   DOJ: string;
}
const Dashboard: React.FC = () => {
   const [employees, setEmployees] = useState<Employee[]>([]);
   const [editIndex, setEditIndex] = useState<number | null>(null);
   const [editFormData, setEditFormData] = useState<Partial<Employee>>({});
   useEffect(() => {
       fetchEmployees();
   }, []);
   const fetchEmployees = async () => {
       try {
           const response = await axios.get('http://localhost:3001/employees');
           console.log('Fetched employees:', response.data);
           setEmployees(response.data);
       } catch (error) {
           console.error('Error fetching employees:', error);
       }
   };
   const handleEditClick = (index: number) => {
    setEditIndex(index);
    setEditFormData({
        empid: employees[index].empid,
        firstname: employees[index].firstname,
        lastname: employees[index].lastname,
        email: employees[index].email,
        contact: employees[index].contact,
        address: employees[index].address,
        DOJ: employees[index].DOJ,
    });
 };
   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       const { name, value } = event.target;
       setEditFormData({
           ...editFormData,
           [name]: value,
       });
   };
   const handleSaveClick = async () => {
    if (editIndex !== null) {
        try {
            const employeeToUpdate = { ...employees[editIndex], ...editFormData };
            const res = await axios.put(`http://localhost:3001/employees/${employeeToUpdate.empid}`, employeeToUpdate);
            console.log("res in hasaveclick", res)
            setEmployees((prev) =>
                prev.map((emp, index) => (index === editIndex ? employeeToUpdate : emp))
            );
            setEditIndex(null);
            setEditFormData({});
            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Employee updated successfully!',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/dashboard'; // Redirect to dashboard after successful submission and user confirmation
                }
            });
        } catch (error) {
            console.error('Error updating employee:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    }
 };
 const handleDeleteClick = async (id: string) => {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete this employee.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3001/employees/${id}`);
                setEmployees((prev) => prev.filter((emp) => emp.empid !== id));
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Employee deleted successfully!',
                });
            } catch (error) {
                console.error('Error deleting employee:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            }
        }
    });
 };
   return (
<div className={styles.container}>
<div className={styles.title}>
<p>Employee Dashboard</p>
</div>
<table className={styles.table}>
<thead>
<tr>
<th>ID</th>
<th>First Name</th>
<th>Last Name</th>
<th>Email</th>
<th>Contact</th>
<th>Address</th>
<th>Date of Joining</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
                   {employees.map((employee, index) => (
<tr key={employee.empid}>
                           {editIndex === index ? (
<>
<td>{employee.empid}</td>
<td>
<input
                                           type="text"
                                           name="firstname"
                                           value={editFormData.firstname || ''}
                                           onChange={handleInputChange}
                                       />
</td>
<td>
<input
                                           type="text"
                                           name="lastname"
                                           value={editFormData.lastname || ''}
                                           onChange={handleInputChange}
                                       />
</td>
<td>
<input
                                           type="email"
                                           name="email"
                                           value={editFormData.email || ''}
                                           onChange={handleInputChange}
                                       />
</td>
<td>
<input
                                           type="text"
                                           name="contact"
                                           value={editFormData.contact || ''}
                                           onChange={handleInputChange}
                                       />
</td>
<td>
<input
                                           type="text"
                                           name="address"
                                           value={editFormData.address || ''}
                                           onChange={handleInputChange}
                                       />
</td>
<td>
<input
                                           type="date"
                                           name="DOJ"
                                           value={editFormData.DOJ || ''}
                                           onChange={handleInputChange}
                                       />
</td>
<td>
<button onClick={handleSaveClick}>Save</button>
</td>
</>
                           ) : (
<>
<td>{employee.empid}</td>
<td>{employee.firstname}</td>
<td>{employee.lastname}</td>
<td>{employee.email}</td>
<td>{employee.contact}</td>
<td>{employee.address}</td>
<td>{employee.DOJ}</td>
<td>
<button onClick={() => handleEditClick(index)}>Edit</button>
<button onClick={() => handleDeleteClick(employee.empid)}>Delete</button>
</td>
</>
                           )}
</tr>
                   ))}
</tbody>
</table>
</div>
   );
};
export default Dashboard;