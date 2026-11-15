const express = require('express');
const router = express.Router();
const { Student, Professor, Course, Batch, Placement } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');

// GET /stats : (verifyToken, authorize('Admin')) return counts: total students, professors, courses, batches, placement rate, avg package
router.get('/stats', verifyToken, authorize('Admin'), async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const totalProfessors = await Professor.count();
    const totalCourses = await Course.count();
    const totalBatches = await Batch.count();

    const placements = await Placement.findAll();
    let totalPlaced = 0;
    let totalPackageSum = 0;

    placements.forEach((p) => {
      const placed = parseInt(p.students_placed, 10) || 0;
      const lpa = parseFloat(p.package_lpa) || 0;
      totalPlaced += placed;
      totalPackageSum += lpa * placed;
    });

    const avgPackage = totalPlaced > 0 ? Number((totalPackageSum / totalPlaced).toFixed(2)) : 0;
    const placementRate = totalStudents > 0
      ? Number(((Math.min(totalPlaced, totalStudents) / totalStudents) * 100).toFixed(2))
      : 0;

    return res.json({
      total_students: totalStudents,
      total_professors: totalProfessors,
      total_courses: totalCourses,
      total_batches: totalBatches,
      placement_rate: placementRate,
      avg_package: avgPackage,
      total_placed: totalPlaced
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ message: 'Failed to fetch admin stats', error: error.message });
  }
});

// GET /departments : (verifyToken, authorize('Admin')) return dept-wise summary (students count, faculty count, courses count, placement%)
router.get('/departments', verifyToken, authorize('Admin'), async (req, res) => {
  try {
    const allStudents = await Student.findAll({ attributes: ['department', 'roll_no'] });
    const allProfessors = await Professor.findAll({ attributes: ['department', 'prof_id'] });
    const allCourses = await Course.findAll({ attributes: ['department', 'course_code'] });
    const allPlacements = await Placement.findAll();

    const deptSet = new Set();
    allStudents.forEach((s) => s.department && deptSet.add(s.department));
    allProfessors.forEach((p) => p.department && deptSet.add(p.department));
    allCourses.forEach((c) => c.department && deptSet.add(c.department));
    allPlacements.forEach((pl) => pl.department && deptSet.add(pl.department));

    const departmentsSummary = Array.from(deptSet).sort().map((dept) => {
      const studentsCount = allStudents.filter((s) => s.department === dept).length;
      const facultyCount = allProfessors.filter((p) => p.department === dept).length;
      const coursesCount = allCourses.filter((c) => c.department === dept).length;

      const deptPlacements = allPlacements.filter((pl) => pl.department === dept);
      let deptPlaced = 0;
      let deptPackageSum = 0;

      deptPlacements.forEach((pl) => {
        const placed = parseInt(pl.students_placed, 10) || 0;
        const lpa = parseFloat(pl.package_lpa) || 0;
        deptPlaced += placed;
        deptPackageSum += lpa * placed;
      });

      const placementRate = studentsCount > 0
        ? Number(((Math.min(deptPlaced, studentsCount) / studentsCount) * 100).toFixed(2))
        : (deptPlaced > 0 ? 100 : 0);

      const avgPackage = deptPlaced > 0
        ? Number((deptPackageSum / deptPlaced).toFixed(2))
        : 0;

      return {
        department: dept,
        students_count: studentsCount,
        faculty_count: facultyCount,
        courses_count: coursesCount,
        students_placed: deptPlaced,
        placement_rate: placementRate,
        avg_package: avgPackage
      };
    });

    return res.json(departmentsSummary);
  } catch (error) {
    console.error('Error fetching department summary:', error);
    return res.status(500).json({ message: 'Failed to fetch department summary', error: error.message });
  }
});

module.exports = router;
