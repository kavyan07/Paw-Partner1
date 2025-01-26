import React, { useState } from 'react';
import axios from 'axios';

function AdditionalInfo() {
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch('http://localhost:8000/api/v1/users/update-user', {
                contact,
                address
            }, { withCredentials: true });

            if (response.data.success) {
                // Redirect to home or dashboard
                window.location.href = '/home';
            }
        } catch (error) {
            console.error('Error updating user info', error);
        }
    };

    return (
        <div>
            <h1>Additional Information</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AdditionalInfo;