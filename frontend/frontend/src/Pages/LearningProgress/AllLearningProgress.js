import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { HiCalendarDateRange } from "react-icons/hi2";
import { IoMdAdd } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import './Progress.css';
import NavBar from '../../Components/NavBar/NavBar';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <button 
      className="scrollTopButton"
      onClick={scrollToTop}
      style={{display: isVisible ? 'flex' : 'none'}}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

function AllLearningProgress() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showMyPosts, setShowMyPosts] = useState(false); // Track filter mode
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    fetch('http://localhost:8080/learningProgress')
      .then((response) => response.json())
      .then((data) => {
        setProgressData(data);
        setFilteredData(data); // Initially show all data
      })
      .catch((error) => console.error('Error fetching learning progress data:', error));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning progress?')) {
      try {
        const response = await fetch(`http://localhost:8080/learningProgress/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Learning Progress deleted successfully!');
          setFilteredData(filteredData.filter((progress) => progress.id !== id));
        } else {
          alert('Failed to delete Learning Progress.');
        }
      } catch (error) {
        console.error('Error deleting learning progress:', error);
      }
    }
  };

  const toggleFilter = () => {
    if (showMyPosts) {
      setFilteredData(progressData); // Show all posts
    } else {
      const myPosts = progressData.filter((progress) => progress.postOwnerID === userId);
      setFilteredData(myPosts); // Show only user's posts
    }
    setShowMyPosts(!showMyPosts); // Toggle filter mode
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="sidebarWrapper">
          {/* SideBar component would be rendered here */}
        </div>
        <div className="contentSection">
          <button
            className="actionButtonAdd"
            onClick={() => (window.location.href = '/addLearningProgress')}
          >
            <IoMdAdd /> Create Post
          </button>
          <button className="actionButtonMy" onClick={toggleFilter}>
            <IoEye /> {showMyPosts ? 'Show All Posts' : 'Show My Posts'}
          </button>
          <div className="postCardContainer">
            {filteredData.length === 0 ? (
              <div className="notFoundBox">
                <div className="notFoundImg"></div>
                <p className="notFoundMsg">No posts found. Please create a new post.</p>
                <button
                  className="notFoundBtn"
                  onClick={() => (window.location.href = '/addLearningProgress')}
                >
                  Create New Post
                </button>
              </div>
            ) : (
              filteredData.map((progress) => (
                <div key={progress.id} className="postCard">
                  <div className="userDetailsCard">
                    <div className="nameSectionPost">
                      <p className="nameSectionPostOwnerName"><FaUserCircle />{progress.postOwnerName}</p>
                    </div>
                    {progress.postOwnerID === userId && (
                      <div>
                        <div className="actionBtnIconPost">
                          <FaEdit
                            onClick={() => (window.location.href = `/updateLearningProgress/${progress.id}`)} 
                            className="actionBtnIcon" />
                          <RiDeleteBin6Fill
                            onClick={() => handleDelete(progress.id)}
                            className="actionBtnIcon" />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="topicCont">{progress.skillTitle}{" "}<span className="topicContB">{progress.field}{" "}</span><span className="topicContB">{progress.level}%</span></p>
                  <div className="disCon">
                    <p className="disConTopic">Description</p>
                    <p className="disConPera" style={{ whiteSpace: "pre-line" }}>{progress.description}</p>
                  </div>
                  <div className="dateCard">
                    <p className="dateCardDte">
                      <HiCalendarDateRange /> 
                      {new Date(progress.startDate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })} to {new Date(progress.endDate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <p></p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}

export default AllLearningProgress;

