'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from './Dashboard.module.css';
interface ReimbursementData {
 id: number;
 receiptNumber: string;
 claimDate: string;
 claimAmount: string;
 details: string;
 remarks: string;
 reimbursementType: string;
 attachment: string; // URL to the attachment file
 status: string; // "Pending", "Accepted", "Rejected"
}
const Dashboard: React.FC = () => {
 const [reimbursements, setReimbursements] = useState<ReimbursementData[]>([]);
 const [editingId, setEditingId] = useState<number | null>(null);
 const [newStatus, setNewStatus] = useState<string | null>(null);
 useEffect(() => {
   fetchReimbursements();
 }, []);
 const fetchReimbursements = async () => {
   try {
     const response = await axios.get<ReimbursementData[]>('http://localhost:3001/reimbursements');
     console.log(response.data); // Log the response data
     setReimbursements(response.data);
   } catch (error) {
     console.error('Error fetching reimbursements:', error);
     Swal.fire({
       icon: 'error',
       title: 'Oops...',
       text: 'Something went wrong!',
     });
   }
 };
 const handleStatusChange = (id: number, status: string) => {
   Swal.fire({
     title: 'Are you sure?',
     text: `You are about to change the status to ${status}.`,
     icon: 'warning',
     showCancelButton: true,
     confirmButtonText: 'Yes, do it!',
     cancelButtonText: 'No, cancel!',
   }).then((result) => {
     if (result.isConfirmed) {
       updateStatus(id, status);
     }
   });
 };
 const updateStatus = async (id: number, status: string) => {
    try {
      await axios.put(`http://localhost:3001/employees/${id}`, { status });
      // Fetch the updated employee details after successful update
      const response = await axios.get(`http://localhost:3001/employees/${id}`);
      const updatedEmployee = response.data;
      // Update the state with the new employee data
      setReimbursements(prevState =>
        prevState.map(reimbursement =>
   reimbursement.id
   === id ? { ...reimbursement, status: updatedEmployee.status } : reimbursement
        )
      );
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `Reimbursement status has been updated to ${status}.`,
      });
      // Reset the editing state
      setEditingId(null);
      setNewStatus(null);
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
   };
 return (
<div className={styles.dashboardContainer}>
<h1 className={styles.title}>Reimbursement Dashboard</h1>
<table className={styles.table}>
<thead>
<tr>
<th>ID</th>
<th>Receipt Number</th>
<th>Claim Date</th>
<th>Claim Amount</th>
<th>Details</th>
<th>Remarks</th>
<th>Type</th>
<th>Attachment</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
         {reimbursements.map((reimbursement) => (
<tr key={
reimbursement.id
}>
<td>{
reimbursement.id
}</td>
<td>{reimbursement.receiptNumber}</td>
<td>{reimbursement.claimDate}</td>
<td>{reimbursement.claimAmount}</td>
<td>{reimbursement.details}</td>
<td>{reimbursement.remarks}</td>
<td>{reimbursement.reimbursementType}</td>
<td>
<a href={`http://localhost:3001/uploads/${reimbursement.attachment}`} target="_blank" rel="noopener noreferrer">View Attachment</a>
</td>
<td>{reimbursement.status}</td>
<td>
               {editingId ===
reimbursement.id
? (
<button onClick={() => handleStatusChange(
reimbursement.id
, newStatus === 'Accepted' ? 'Rejected' : 'Accepted')} className={styles.updateButton}>Update</button>
               ) : reimbursement.status === 'Pending' ? (
<>
<button onClick={() => handleStatusChange(
reimbursement.id
, 'Accepted')} className={styles.acceptButton}>Accept</button>
<button onClick={() => handleStatusChange(
reimbursement.id
, 'Rejected')} className={styles.rejectButton}>Reject</button>
</>
               ) : null}
</td>
</tr>
         ))}
</tbody>
</table>
</div>
 );
};
export default Dashboard;