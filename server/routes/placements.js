const express = require('express');
const router = express.Router();
const { Placement, sequelize } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');

// GET /analytics : (verifyToken) placement analytics for student view
router.get('/analytics', verifyToken, async (req, res) => {
  try {
    const placements = await Placement.findAll();

    let totalPlacements = 0;
    let totalPackageSum = 0;
    let highestPackage = 0;
    const deptMap = {};
    const companyMap = {};

    placements.forEach((p) => {
      const placed = parseInt(p.students_placed, 10) || 0;
      const lpa = parseFloat(p.package_lpa) || 0;
      const packageInRupees = lpa * 100000; // Convert LPA to rupees

      totalPlacements += placed;
      totalPackageSum += packageInRupees * placed;
      if (packageInRupees > highestPackage) {
        highestPackage = packageInRupees;
      }

      // Department stats
      if (!deptMap[p.department]) {
        deptMap[p.department] = {
          department: p.department,
          count: 0,
          total_package_sum: 0
        };
      }
      deptMap[p.department].count += placed;
      deptMap[p.department].total_package_sum += packageInRupees * placed;

      // Company stats
      if (!companyMap[p.company]) {
        companyMap[p.company] = {
          company_name: p.company,
          hire_count: 0
        };
      }
      companyMap[p.company].hire_count += placed;
    });

    const averagePackage = totalPlacements > 0 ? Math.round(totalPackageSum / totalPlacements) : 0;

    const departmentStats = Object.values(deptMap).map((d) => ({
      department: d.department,
      count: d.count,
      avg_package: d.count > 0 ? Math.round(d.total_package_sum / d.count) : 0
    }));

    // Get top 10 recruiters by hire count
    const topRecruiters = Object.values(companyMap)
      .sort((a, b) => b.hire_count - a.hire_count)
      .slice(0, 10);

    // Count unique companies
    const totalCompanies = Object.keys(companyMap).length;

    return res.json({
      total_placements: totalPlacements,
      highest_package: highestPackage,
      average_package: averagePackage,
      total_companies: totalCompanies,
      department_stats: departmentStats,
      top_recruiters: topRecruiters
    });
  } catch (error) {
    console.error('Error fetching placement analytics:', error);
    return res.status(500).json({ message: 'Failed to fetch placement analytics', error: error.message });
  }
});

// GET /stats : (verifyToken) aggregation: total placed, avg package, max package, count by department
// NOTE: Must be defined before GET /:id or matching routes to avoid parameter capture
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const placements = await Placement.findAll();

    let totalPlaced = 0;
    let totalPackageSum = 0;
    let maxPackage = 0;
    const deptMap = {};

    placements.forEach((p) => {
      const placed = parseInt(p.students_placed, 10) || 0;
      const lpa = parseFloat(p.package_lpa) || 0;

      totalPlaced += placed;
      totalPackageSum += lpa * placed;
      if (lpa > maxPackage) {
        maxPackage = lpa;
      }

      if (!deptMap[p.department]) {
        deptMap[p.department] = {
          department: p.department,
          students_placed: 0,
          total_package_sum: 0,
          companies_count: 0,
          max_package: 0
        };
      }

      deptMap[p.department].students_placed += placed;
      deptMap[p.department].total_package_sum += lpa * placed;
      deptMap[p.department].companies_count += 1;
      if (lpa > deptMap[p.department].max_package) {
        deptMap[p.department].max_package = lpa;
      }
    });

    const avgPackage = totalPlaced > 0 ? Number((totalPackageSum / totalPlaced).toFixed(2)) : 0;

    const byDepartment = Object.values(deptMap).map((d) => ({
      department: d.department,
      students_placed: d.students_placed,
      avg_package: d.students_placed > 0 ? Number((d.total_package_sum / d.students_placed).toFixed(2)) : 0,
      max_package: d.max_package,
      offers_count: d.companies_count
    }));

    return res.json({
      total_placed: totalPlaced,
      avg_package: avgPackage,
      max_package: maxPackage,
      by_department: byDepartment
    });
  } catch (error) {
    console.error('Error fetching placement stats:', error);
    return res.status(500).json({ message: 'Failed to aggregate placement stats', error: error.message });
  }
});

// GET / : (verifyToken) list placements with optional query filters
router.get('/', verifyToken, async (req, res) => {
  try {
    const { department, batch_year, type, company, package_min, package_max, year } = req.query;
    const { Op } = require('sequelize');
    const where = {};

    if (department) {
      where.department = department;
    }
    if (batch_year || year) {
      where.batch_year = batch_year || year;
    }
    if (type) {
      where.type = type;
    }
    if (company) {
      where.company = { [Op.like]: `%${company}%` };
    }

    const placements = await Placement.findAll({
      where,
      order: [['package_lpa', 'DESC'], ['company', 'ASC']]
    });

    // Transform to frontend format - create one row per placement record
    // Since we don't have individual student data, we'll show aggregate info
    const transformedPlacements = placements.map(p => ({
      id: p.placement_id,
      student_name: `${p.students_placed} Student${p.students_placed > 1 ? 's' : ''}`,
      roll_number: `${p.department}-Batch-${p.batch_year}`,
      company_name: p.company,
      role: 'Multiple Roles', // Since this is aggregate data
      department: p.department,
      package: p.package_lpa * 100000, // Convert LPA to rupees
      placement_year: p.batch_year,
      location: null,
      students_placed: p.students_placed
    }));

    // Filter by package range if provided
    let filtered = transformedPlacements;
    if (package_min) {
      const minInRupees = parseFloat(package_min) * 100000;
      filtered = filtered.filter(p => p.package >= minInRupees);
    }
    if (package_max) {
      const maxInRupees = parseFloat(package_max) * 100000;
      filtered = filtered.filter(p => p.package <= maxInRupees);
    }

    return res.json(filtered);
  } catch (error) {
    console.error('Error fetching placements:', error);
    return res.status(500).json({ message: 'Failed to fetch placements', error: error.message });
  }
});

// POST / : (verifyToken, authorize('Admin')) create placement record
router.post('/', verifyToken, authorize('Admin'), async (req, res) => {
  try {
    const { department, batch_year, company, package_lpa, type, students_placed } = req.body;

    if (!department || !batch_year || !company || package_lpa === undefined) {
      return res.status(400).json({ message: 'department, batch_year, company, and package_lpa are required.' });
    }

    const placement = await Placement.create({
      department,
      batch_year,
      company,
      package_lpa: parseFloat(package_lpa),
      type: type || 'On Campus',
      students_placed: students_placed !== undefined ? parseInt(students_placed, 10) : 1
    });

    return res.status(201).json({ message: 'Placement record created successfully', placement });
  } catch (error) {
    console.error('Error creating placement record:', error);
    return res.status(500).json({ message: 'Failed to create placement record', error: error.message });
  }
});

module.exports = router;
