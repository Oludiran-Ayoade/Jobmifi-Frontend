import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserCard from './UserCard';
import { Spinner } from 'react-bootstrap';

interface User {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  profilePicture: string;
  specialization: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  

  useEffect(() => {
    axios.get('http://localhost:3000/api/users/profilecards/allusers')
      .then(response => {
        setUsers(response.data.data);
        setLoading(false);
        // console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <div className="text-center" style={{paddingTop:'150px'}}><Spinner animation="border" style={{color: '#002745'}} role="status"></Spinner></div>;
  }

  return (
    <div className="user-list">
      {users.map(user => (
        <UserCard
          key={user._id}
          userId={user.userId._id}
          firstName={user.userId.firstName}
          lastName={user.userId.lastName}
          email={user.userId.email}
          profilePicture={user.profilePicture}
          specialization={user.specialization}
        />
      ))}
    </div>
  );
};

export default UserList;
