import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Internships from './pages/Internships';
import InternshipDetail from './pages/InternshipDetail';
import StudentDashboard from './pages/StudentDashboard';
import MyApplications from './pages/MyApplications';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import CompanyDashboard from './pages/CompanyDashboard';
import InternshipForm from './pages/InternshipForm';
import Applicants from './pages/Applicants';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminInternships from './pages/AdminInternships';
import AdminApplications from './pages/AdminApplications';
import NotFound from './pages/NotFound';

const P = ({ roles, children }) => <ProtectedRoute roles={roles}>{children}</ProtectedRoute>;

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/internships/:id" element={<InternshipDetail />} />

          <Route path="/student" element={<P roles={['student']}><StudentDashboard /></P>} />
          <Route path="/student/applications" element={<P roles={['student']}><MyApplications /></P>} />
          <Route path="/student/saved" element={<P roles={['student']}><Saved /></P>} />
          <Route path="/profile" element={<P roles={['student', 'company']}><Profile /></P>} />

          <Route path="/company" element={<P roles={['company']}><CompanyDashboard /></P>} />
          <Route path="/company/internships" element={<P roles={['company']}><CompanyDashboard /></P>} />
          <Route path="/company/internships/new" element={<P roles={['company']}><InternshipForm /></P>} />
          <Route path="/company/internships/:id/edit" element={<P roles={['company']}><InternshipForm /></P>} />
          <Route path="/company/internships/:id/applicants" element={<P roles={['company']}><Applicants /></P>} />

          <Route path="/admin" element={<P roles={['admin']}><AdminDashboard /></P>} />
          <Route path="/admin/users" element={<P roles={['admin']}><AdminUsers /></P>} />
          <Route path="/admin/internships" element={<P roles={['admin']}><AdminInternships /></P>} />
          <Route path="/admin/applications" element={<P roles={['admin']}><AdminApplications /></P>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">Internship Management System · MERN stack project</footer>
    </>
  );
}
