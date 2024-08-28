import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { Toast } from 'primereact/toast';

type Job = {
  _id: string;
  title: string;
  category: string;
  description: string;
  type: string;
  location: string;
  showFullDescription?: boolean;
};

const JobList: React.FC = () => {
  let navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { jobId } = useParams<{ jobId: string }>();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAll, setShowAll] = useState<boolean>(false);
  const { auth } = useAuth();
  const { user, token } = auth;
  const userId = user?._id || '';

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/getjob/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (userId) {
      fetchJobs();
    }
  }, [userId, jobId]);

  const handleDelete = async (jobId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/delete/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(jobs.filter(job => job._id !== jobId));
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Job deleted successfully', life: 2000 });
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete job', life: 3000 });
    }
  };

  const handleUpdate = (jobId: string) => {
    navigate(`/recruiter/update-job/${jobId}`);
  };

  const toggleDescription = (jobId: string) => {
    setJobs(jobs.map(job => {
      if (job._id === jobId) {
        job.showFullDescription = !job.showFullDescription;
      }
      return job;
    }));
  };

  const truncateDescription = (description: string): string => {
    const words = description.split(' ');
    if (words.length > 8) {
      return words.slice(0, 8).join(' ') + '...';
    }
    return description;
  };

  const displayedJobs = showAll ? jobs : jobs.slice(0, 3);

  if (loading) {
    return <div className="text-center" style={{ paddingTop: '150px' }}><Spinner animation="border" style={{ color: '#002745' }} role="status"></Spinner></div>;
  }

  return (
    <>
      <Toast ref={toast} className="custom-toast" />
      <div className="job-list">
        <h1 style={{ marginBottom: '-10px', marginTop: '-50px' }}>Jobs</h1>
        {jobs.length > 0 ? (
          <>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedJobs.map(job => (
                  <tr key={job._id}>
                    <td>
                      <Link to={`/recruiter/view-job/${job._id}`} className="custom-link">{job.title}</Link>
                    </td>
                    <td>
                      <Link to={`/recruiter/view-job/${job._id}`} className="custom-link">{job.category}</Link>
                    </td>
                    <td>
                      <div>
                        {job.showFullDescription ? job.description : truncateDescription(job.description)}
                        {job.description.split(' ').length > 8 && (
                          <button 
                            className="btn btn-link p-0 ms-2"
                            onClick={() => toggleDescription(job._id)}
                          >
                            {job.showFullDescription ? 'See Less' : 'See More'}
                          </button>
                        )}
                      </div>
                    </td>
                    <td>{job.type}</td>
                    <td>{job.location}</td>
                    <td>
                      <button className="btn btn-primary mb-1" style={{ background: '#002745' }} onClick={() => handleUpdate(job._id)}>Update</button>
                      <button className="btn btn-danger ms-2" onClick={() => handleDelete(job._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-center">
              <button 
                className="btn btn-secondary mt-3" 
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : 'Show All'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p>No jobs found.</p>
          </div>
        )}
        <div className="text-center mt-4">
          {/* <button 
            className="btn btn-primary" 
            style={{ background: '#002745' }} 
            onClick={() => navigate('/recruiter/create-job')}
          >
            Create Job
          </button> */}
        </div>
      </div>
    </>
  );
};

export default JobList;
