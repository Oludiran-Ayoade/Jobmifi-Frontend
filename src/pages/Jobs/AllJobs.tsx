import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChartPie } from "react-icons/fa";
import { HiMiniBuildingLibrary } from "react-icons/hi2";
import { PiChatsCircleFill } from "react-icons/pi";
import { FaChartLine } from "react-icons/fa";
import { LuStethoscope } from "react-icons/lu";
import { FaRegIdCard } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { IoCodeSlashOutline } from "react-icons/io5";

interface Job {
  _id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  type: string;
}

interface JobsByCategory {
  [category: string]: Job[];
}

const JobCategoryComponent: React.FC = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  const categories = [
    'Business Development',
    'Construction',
    'Customer Service',
    'Finance',
    'Health Care',
    'Human Resources',
    'Project Management',
    'Software Engineering',
  ];

  const [jobsByCategory, setJobsByCategory] = useState<JobsByCategory>(() => {
    const initialCategories: JobsByCategory = {};
    categories.forEach(category => {
      initialCategories[category] = [];
    });
    return initialCategories;
  });
  const [error, setError] = useState<string | null>(null);

  const categoryImages: { [key: string]: any } = {
    'Business Development': <FaChartPie />,
    'Construction': <HiMiniBuildingLibrary />,
    'Customer Service': <PiChatsCircleFill />,
    'Finance': <FaChartLine />,
    'Health Care': <LuStethoscope />,
    'Human Resources': <FaRegIdCard />,
    'Project Management': <SlCalender />,
    'Software Engineering': <IoCodeSlashOutline />,
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://jobmifi-backend.onrender.com/api/users/alljobs/jobs');
        // console.log(response)
        const jobsData = response.data.jobs;
        if (Array.isArray(jobsData)) {
          const categorizedJobs = categorizeJobs(jobsData);
          setJobsByCategory(categorizedJobs);
          setLoading(false);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Error fetching jobs.');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const categorizeJobs = (jobs: Job[]): JobsByCategory => {
    const categorizedJobs: JobsByCategory = categories.reduce((acc, category) => {
      acc[category] = [];
      return acc;
    }, {} as JobsByCategory);

    jobs.forEach(job => {
      if (!categorizedJobs[job.category]) {
        categorizedJobs[job.category] = [];
      }
      categorizedJobs[job.category].push(job);
    });
    return categorizedJobs;
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    console.log('Swiped', direction);
  };

  if (loading) {
    return <div className="text-center" style={{paddingTop:'150px'}}><Spinner animation="border" style={{color: '#002745'}} role="status"></Spinner></div>;
  }
  
  if (error) {
    return <div>{error}</div>;
  }
  const handleCategoryClick = (category: string) => {
    navigate(`/jobs/${category}`)
  };
  
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    touchEvents: 'active',
    slidesToShow: 3,
    slidesToScroll: 1,
    touchThreshold: 55,
    swipeToSlide: true,
    onSwipe: (direction: 'left' | 'right') => handleSwipe(direction),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Container className="mt-4 swiper-container">
      <Row>
        <Col>
          <h1>Search by Category</h1>
          <p>Search your career opportunity with our categories</p>
        </Col>
      </Row>
      <Slider {...settings}>
        {Object.entries(jobsByCategory).map(([category, jobs]) => (
          <div key={category} className="p-2 custom-card border-4" onClick={() => handleCategoryClick(category)}>
            <Card style={{ height: '300px' }}>
              <div className="icon-wrapper">{categoryImages[category]}</div>
              <Card.Body  style={{marginLeft: '60px'}}>
                <Card.Title style={{fontSize: '25px'}}>{category}</Card.Title>
                <Card.Text>Number of jobs: {jobs.length}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default JobCategoryComponent;
