import React, { useEffect, useState } from 'react';
import { Utensils, Heart, Bell, User, LogOut, X, Edit } from 'lucide-react';
import axios from 'axios';
import './NavBar.css';

function NavBar() {
    const [showCard, setShowCard] = useState(false);
    const [userData, setUserData] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);
    const userId = localStorage.getItem('userID');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/notifications/${userId}`);
                const unreadCount = response.data.filter(notification => !notification.read).length;
                setNotificationCount(unreadCount);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        if (userId) {
            fetchUserData();
            fetchNotifications();

            const notificationInterval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(notificationInterval);
        }
    }, [userId]);

    const getInitials = (name) => {
        return name?.split(' ').map(word => word[0]).join('').toUpperCase() || 'U';
    };

    const currentPath = window.location.pathname;

    const handleEditProfile = () => {
        window.location.href = `/updateUserProfile/${userId}`;
    };

    const handleNotificationClick = () => {
        window.location.href = '/notifications';
    };

    return (
        <nav className="savored-navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <div className="logo-icon">
                        <Utensils size={28} className="utensils-icon" />
                        <Heart size={16} className="heart-icon" />
                    </div>
                    <span className="brand-name">Savored</span>
                </div>
                
                <div className="nav-links">
                    <a 
                        href="/learningSystem/allLearningPost" 
                        className={`nav-link ${currentPath === '/learningSystem/allLearningPost' ? 'active' : ''}`}
                    >
                        Recipe Sharing
                    </a>
                    <a 
                        href="/allPost" 
                        className={`nav-link ${currentPath === '/allPost' ? 'active' : ''}`}
                    > 
                        Cooking Communities
                    </a>
                    <a 
                        href="/allLearningProgress" 
                        className={`nav-link ${currentPath === '/allLearningProgress' ? 'active' : ''}`}
                    >
                        My Kitchen
                    </a>
                </div>

                <div className="nav-actions">
                    <button 
                        className="notification-icon"
                        onClick={handleNotificationClick}
                        title="View notifications"
                    >
                        <Bell size={24} />
                        {notificationCount > 0 && (
                            <span className="notification-badge">{notificationCount}</span>
                        )}
                    </button>
                    
                    <div 
                        className="user-avatar"
                        onClick={() => setShowCard(!showCard)}
                    >
                        {userData?.avatarUrl ? (
                            <img src={userData.avatarUrl} alt="User" className="avatar-img" />
                        ) : (
                            <div className="avatar-initials">{getInitials(userData?.fullname)}</div>
                        )}
                    </div>
                    
                    <button 
                        className="logout-btn"
                        onClick={() => {
                            localStorage.removeItem('userID');
                            window.location.href = '/';
                        }}
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            {showCard && userData && (
                <div className="user-profile-card">
                    <button 
                        className="close-card-btn"
                        onClick={() => setShowCard(false)}
                    >
                        <X size={18} />
                    </button>
                    <div className="card-header">
                        <div className="profile-avatar">
                            {userData.avatarUrl ? (
                                <img src={userData.avatarUrl} alt="User" className="avatar-img-large" />
                            ) : (
                                <div className="avatar-initials-large">{getInitials(userData.fullname)}</div>
                            )}
                        </div>
                        <div className="profile-info">
                            <h3>{userData.fullname}</h3>
                            <p>Food Enthusiast</p>
                        </div>
                    </div>
                    <div className="card-details">
                        <div className="detail-item">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{userData.email}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Specialty:</span>
                            <span className="detail-value">
                                {userData.skills?.join(', ') || 'Portrait, Landscape'}
                            </span>
                        </div>
                    </div>
                    <div className="card-actions">
                        <button 
                            className="edit-profile-btn"
                            onClick={handleEditProfile}
                        >
                            <Edit size={16} /> Edit Profile
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;
