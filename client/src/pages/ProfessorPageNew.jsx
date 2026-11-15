import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../components/professor/Dashboard';
import MyBatches from '../components/professor/MyBatches';
import BatchDetailsPage from '../components/professor/BatchDetailsPage';
import Enrollments from '../components/professor/Enrollments';
import Attendance from '../components/professor/Attendance';
import AssignmentMgmt from '../components/professor/AssignmentMgmt';
import GradingPanel from '../components/professor/GradingPanel';

const ProfessorPage = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="batches" element={<MyBatches />} />
      <Route path="batch/:batchId" element={<BatchDetailsPage />} />
      <Route path="enrollments" element={<Enrollments />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="assignments" element={<AssignmentMgmt />} />
      <Route path="grading/:assignmentId" element={<GradingPanel />} />
    </Routes>
  );
};

export default ProfessorPage;
