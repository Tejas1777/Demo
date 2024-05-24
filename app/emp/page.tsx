'use client';
// components/RegistrationForm.tsx
import React, { useState,useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import styles from './emp-details.module.css';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import { useRouter } from 'next/router'; // Import useRouter


interface FormData {
    ID: string;
    email: string;
    firstName: string;
    lastName: string;
    contact: string;
    address: string;
    joinDate: string;
    password: string;
}

interface RegistrationFormProps {
    initialData?: FormData;
    onSuccess?: () => void;
 }
 const RegistrationForm: React.FC<RegistrationFormProps> = ({ initialData, onSuccess }) => {
    const [formData, setFormData] = useState<FormData>({
        ID: '',
        email: '',
        firstName: '',
        lastName: '',
        contact: '',
        address: '',
        joinDate: '',
        password: 'Parkar@123',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData, password: 'Parkar@123' }); // Ensure initial data also has default password
        }
     }, [initialData]);

    const [errors, setErrors] = useState<Partial<FormData>>({});

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newErrors: Partial<FormData> = {};
        if (!formData.ID) {
            newErrors.ID = 'Employee ID is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.firstName) {
            newErrors.firstName = 'First Name is required';
        } else if (!/^[a-zA-Z]+$/.test(formData.firstName)) {
            newErrors.firstName = 'First Name should contain only alphabets';
        }
        if (!formData.lastName) {
            newErrors.lastName = 'Last Name is required';
        } else if (!/^[a-zA-Z]+$/.test(formData.lastName)) {
            newErrors.lastName = 'Last Name should contain only alphabets';
        }
        if (!formData.contact) {
            newErrors.contact = 'Contact is required';
        } else if (!/^[0-9]+$/.test(formData.contact)) {
            newErrors.contact = 'Contact should contain only numbers';
        }
        if (!formData.address) {
            newErrors.address = 'Address is required';
        }
        if (!formData.joinDate) {
            newErrors.joinDate = 'Date of Joining is required';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            try {
                const encryptedPassword = await bcrypt.hash('Parkar@123', 10);
                const updatedFormData = { ...formData, password: encryptedPassword };
                const response = initialData
                    ? await axios.put(`http://localhost:3001/employees/${formData.ID}`, updatedFormData)
                    : await axios.post('http://localhost:3001/employees', updatedFormData);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: `Employee ${initialData ? 'updated' : 'added'} successfully!`,
                }).then(() => {
                    setFormData({
                        ID: '',
                        email: '',
                        firstName: '',
                        lastName: '',
                        contact: '',
                        address: '',
                        joinDate: '',
                        password: 'Parkar@123',
                    });
                    if (onSuccess) onSuccess();
                });
            } catch (error) {
                console.error('Error submitting form:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            }
        }
    };
     


    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.id);
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <p>New Employee Details</p>
            </div>
            <form onSubmit={handleFormSubmit}>
            <div className={styles.user_details}>
<div className={styles.input_box}>
<label htmlFor="ID">Employee ID</label>
<input type="text" id="ID" name="ID" value={formData.ID} onChange={handleInputChange} placeholder="Enter Employee ID" />
                       {errors.ID && <span className={styles.error}>{errors.ID}</span>}
</div>
<div className={styles.input_box}>
<label htmlFor="email">Email</label>
<input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter Email of Employee" />
                       {errors.email && <span className={styles.error}>{errors.email}</span>}
</div>
<div className={styles.input_box}>
<label htmlFor="firstName">First Name</label>
<input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Enter First Name of Employee" />
   {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
</div>
<div className={styles.input_box}>
<label htmlFor="lastName">Last Name</label>
<input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Enter Last Name of Employee" />
   {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
</div>
<div className={styles.input_box}>
<label htmlFor="password">Password</label>
<input type="password" id="password" name="password" value={formData.password} disabled />
</div>
<div className={styles.input_box}>
<label htmlFor="contact">Contact</label>
<input type="text" id="contact" name="contact" value={formData.contact} onChange={handleInputChange} placeholder="Enter Employee's Contact Number" />
   {errors.contact && <span className={styles.error}>{errors.contact}</span>}
</div>
<div className={styles.input_box}>
<label htmlFor="address">Address</label>
<input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter Employee's Address" />
   {errors.address && <span className={styles.error}>{errors.address}</span>}
</div>
<div className={styles.input_box}>
<label htmlFor="joinDate">Date of Joining</label>
<input type="date" id="joinDate" name="joinDate" value={formData.joinDate} onChange={handleInputChange} />
   {errors.joinDate && <span className={styles.error}>{errors.joinDate}</span>}
</div>
</div>
<div className={styles.gender}> 
  <span className={styles.gender_title}>Position</span>
  <input
    type="radio"
    name="gender"
    id="radio_1"
    onChange={handleRadioChange}
    checked={selectedOption === 'radio_1'}
  />
  <input
    type="radio"
    name="gender"
    id="radio_2"
    onChange={handleRadioChange}
    checked={selectedOption === 'radio_2'}
  />
  <input
    type="radio"
    name="gender"
    id="radio_3"
    onChange={handleRadioChange}
    checked={selectedOption === 'radio_3'}
  />
  <input
    type="radio" 
    name="gender"
    id="radio_4"
    onChange={handleRadioChange}
    checked={selectedOption === 'radio_4'}
  />

  <div className={styles.category}>
  <label htmlFor="radio_1" className={`${styles.category_label} ${selectedOption === 'radio_1' ? styles.selected : ''}`}>
<span className={`${styles.dot} ${styles.one}`}></span>
<span>GTE</span>
</label>
<label htmlFor="radio_2" className={`${styles.category_label} ${selectedOption === 'radio_2' ? styles.selected : ''}`}>
<span className={`${styles.dot} ${styles.two}`}></span>
<span>SE</span>
</label>
<label htmlFor="radio_3" className={`${styles.category_label} ${selectedOption === 'radio_3' ? styles.selected : ''}`}>
<span className={`${styles.dot} ${styles.three}`}></span>
<span>PL</span>
</label>
<label htmlFor="radio_4" className={`${styles.category_label} ${selectedOption === 'radio_4' ? styles.selected : ''}`}>
<span className={`${styles.dot} ${styles.four}`}></span>
<span>EM</span>
</label>
  </div>
</div>
                <div className={styles.reg_btn}>
                    <input type="submit" value="Save" />
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;