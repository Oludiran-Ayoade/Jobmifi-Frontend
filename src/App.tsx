import { Routes, Route } from 'react-router-dom';
import IntroHome from './pages/IntroHome';
import PageNotFound from './pages/PageNotFound';
import CreateCompanyForm from './pages/Recruiters/AddCompany';
import ViewCompany from './pages/Recruiters/ViewCompany';
import RecruiterDashboard from './pages/Recruiters/Recruiter'
import Dashboard from './pages/Recruiters/Dashboard';
import ManageCompany from './pages/Recruiters/ManageCompany';
import ManageJob from './pages/Recruiters/ManageJob';
import Candidates from './pages/Recruiters/Candidates';
import ChangePassword from './pages/Recruiters/ChangePassword';
import UpdateCompanyForm from './pages/Recruiters/UpdateCompany';
import ViewCompanyId from './pages/Recruiters/ViewCompanyId';
import CreateJob from './pages/Recruiters/Jobs';
import UpdateJobForm from './pages/Recruiters/UpdateJob';
import ViewJob from './pages/Recruiters/ViewJob';
import Skillers from './pages/Skillers/Skillers';
import SkillersDashboard from './pages/Skillers/SkillersDash';
import Applications from './pages/Skillers/Applications';
import AllJobsComponent from './pages/Jobs/Jobs';
import JobList from './pages/Jobs/JobCategory';
import JobDetail from './pages/Jobs/JobById';
import CompanyDetails from './pages/Company/CompanyDetails';
import AllCompanies from './pages/Company/AllCompany';
import SkillersProfile from './pages/Skillers/SkillersProfile';
import SkillerProfile from './pages/Skillers/SkillerProfile';
import UserList from './pages/Candidates/UserList';
import UserProfile from './pages/Candidates/UserProfile';
import JobDetailPage from './pages/Skillers/JobDetails';
// import { useAuth } from '../src/context/useAuth';

const App = () => {
  // const { isAuthenticated } = useAuth();

  return (
    <Routes>
    <Route path="/" element={<IntroHome />} />
    <Route path="/jobs" element={<AllJobsComponent />} />
    <Route path="/companies" element={<AllCompanies />} />
    <Route path="/jobs-details/:jobId" element={<JobDetail/>} />
    <Route path="/jobs/:category" element={<JobList />} />
    <Route path="/company/:id" element={<CompanyDetails />} />
    <Route path="/candidates" element={<UserList />} /> 
    <Route path="/candidates/profile/:id" element={<UserProfile />} /> 
    <Route path="*" element={<PageNotFound />} />
    <Route path="/recruiter" element={<RecruiterDashboard />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-company" element={<ManageCompany />} />
          <Route path="manage-job" element={<ManageJob />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="create-company" element={<CreateCompanyForm />} />
          <Route path="view-companies" element={<ViewCompany />} />
          <Route path="update-company/:id" element={<UpdateCompanyForm />} />
          <Route path="view-company/:id" element={<ViewCompanyId />} />
          <Route path="job" element={<CreateJob />} />
          <Route path="view-job/:id" element={<ViewJob />} />
          <Route path="update-job/:id" element={<UpdateJobForm />} />
        </Route>
        <Route path="/skillers" element={<Skillers />}>
          <Route path="dashboard" element={<SkillersDashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="profile/:id" element={<SkillerProfile />} />
          <Route path="updateprofile/:id" element={<SkillersProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="job-details/:jobId" element={<JobDetailPage />} />
        </Route>
    </Routes>
  )
}

export default App