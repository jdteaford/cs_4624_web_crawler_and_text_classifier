import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the stored JWT token
        navigate('/login'); // Navigate to the login page
    };

    return (
        <button className="logout-button" onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;
