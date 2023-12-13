import axios from "axios";


export const getAllUsers = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/api/listUser', {
        headers: {
          Authorization: `Bearer ${token}`,
          // If the role is expected as a header, uncomment the following line
          // 'User-Role': 'admin'
        },
        // If the role is expected as a query parameter, uncomment the following line
        // params: { role: 'admin' }
      });
  
      return response.data; // Assuming the server response contains the user data
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };
  

export const deactivateUser = async (userId) => {
    try {
      // Send a PUT request to update the user's active status to false
      const response = await axios.put(`http://localhost:8000/api/deactivate${userId}`);
      
      // Check if the request was successful
      if (response.status === 200) {
        console.log('User deactivated successfully');
        // Optionally, you can handle the success response here
      } else {
        console.error('Failed to deactivate user');
        // Handle the failure response here
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error here
    }
  };
