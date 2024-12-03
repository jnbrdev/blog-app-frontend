import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Logout() {
	const { setUser, unsetUser } = useContext(UserContext);

	unsetUser();

	useEffect(() => {
		setUser({
		  id: null
		});
	  }, [setUser]); // Add setUser to the dependency array
	  



    return (
        <Navigate to='/login' />
    )

}