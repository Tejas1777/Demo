'use client';
import React, { useState, FormEvent } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import styles from './reimbursement.module.css';
import Swal from 'sweetalert2';
interface ReimbursementFormData {
   receiptNumber: string;
   claimDate: string;
   claimAmount: string;
   details: string;
   remarks: string;
   reimbursementType: string;
   attachment: File | null;
}
const ReimbursementForm: React.FC = () => {
   const [formData, setFormData] = useState<ReimbursementFormData>({
       receiptNumber: '',
       claimDate: '',
       claimAmount: '',
       details: '',
       remarks: '',
       reimbursementType: '',
       attachment: null,
   });
   const [errors, setErrors] = useState<Partial<ReimbursementFormData>>({});
   const reimbursementTypes = [
       "Certifications Reimbursement",
       "Internet Reimbursement",
       "Local Travel Expense",
       "Mobile Reimbursement",
       "Other Expense",
       "Relocation expenses",
       "Team Lunch Expenses"
   ];
   const validateForm = () => {
       const newErrors: Partial<ReimbursementFormData> = {};
       // Check for mandatory fields
       if (!formData.receiptNumber.trim()) {
           newErrors.receiptNumber = "Receipt Number is required";
       }
       if (!formData.claimDate.trim()) {
           newErrors.claimDate = "Claim Date is required";
       }
       if (!formData.claimAmount.trim()) {
           newErrors.claimAmount = "Claim Amount is required";
       }
       if (!formData.reimbursementType.trim()) {
           newErrors.reimbursementType = "Reimbursement Type is required";
       }
       // You can add more validations as needed
       setErrors(newErrors);
       return Object.keys(newErrors).length === 0; // Returns true if there are no errors
   };
   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
       const { name, value } = event.target;
       setFormData({
           ...formData,
           [name]: value,
       });
   };
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       const file = event.target.files && event.target.files[0];
       setFormData({
           ...formData,
           attachment: file || null,
       });
   };
   const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
       const { name, value } = event.target;
       setFormData({
           ...formData,
           [name]: value,
       });
   };
   const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
       event.preventDefault();
       if (validateForm()) {
           try {
               const formDataToSend = new FormData();
               Object.entries(formData).forEach(([key, value]) => {
                   formDataToSend.append(key, value as any);
               });
               await axios.post('http://localhost:3001/reimbursements', formDataToSend);
               
               Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Reimbursement request submitted successfully!',
             }).then(() => {
                setFormData({
                    receiptNumber: '',
                    claimDate: '',
                    claimAmount: '',
                    details: '',
                    remarks: '',
                    reimbursementType: '',
                    attachment: null,
                });
             });
           } catch (error) {
               console.error('Error submitting form:', error);
               Swal.fire({
                   icon: 'error',
                   title: 'Oops...',
                   text: 'Something went wrong!',
               });
           }
       } else {
           Swal.fire({
               icon: 'error',
               title: 'Validation Error',
               text: 'Please fill all the mandatory fields.',
           });
       }
   };
   return (
<div className={styles.container}>
<div className={styles.title}>
<p>Reimbursement Details</p>
</div>
<form onSubmit={handleFormSubmit}>
<div className={styles.user_details}>
<div className={styles.input_box}>
<label htmlFor="receiptNumber">Receipt Number</label>
<input type="text" id="receiptNumber" name="receiptNumber" value={formData.receiptNumber} onChange={handleInputChange} placeholder="Enter Receipt Number" />
                       {errors.receiptNumber && <span className={styles.error}>{errors.receiptNumber}</span>}
</div>
<div className={styles.input_box}>
<label htmlFor="claimDate">Claim Date</label>
<input type="date" id="claimDate" name="claimDate" value={formData.claimDate} onChange={handleInputChange} />
                       {errors.claimDate && <span className={styles.error}>{errors.claimDate}</span>}
</div>
<div className={styles.input_box}>
<label htmlFor="claimAmount">Claim Amount</label>
<input type="text" id="claimAmount" name="claimAmount" value={formData.claimAmount} onChange={handleInputChange} placeholder="Enter Claim Amount" />
                       {errors.claimAmount && <span className={styles.error}>{errors.claimAmount}</span>}
</div>
<div className={styles.input_box}>
<label htmlFor="reimbursementType">Reimbursement Type</label>
<select id="reimbursementType" name="reimbursementType" value={formData.reimbursementType} onChange={handleSelectChange}>
<option value="">Select Reimbursement Type</option>
                           {reimbursementTypes.map((type, index) => (
<option key={index} value={type}>{type}</option>
                           ))}
</select>
                       {errors.reimbursementType && <span className={styles.error}>{errors.reimbursementType}</span>}
</div>
<div className={styles.input_box}>
<label htmlFor="attachment">Attachment</label>
<input type="file" id="attachment" name="attachment" onChange={handleFileChange} />
</div>
<div className={styles.input_box}>
<label htmlFor="remarks">Remarks</label>
<textarea id="remarks" name="remarks" value={formData.remarks} onChange={handleInputChange} placeholder="Enter Remarks"></textarea>
</div>
</div>
<div className={styles.reg_btn}>
<input type="submit" value="Submit" />
</div>
</form>
</div>
   );
};
export default ReimbursementForm;