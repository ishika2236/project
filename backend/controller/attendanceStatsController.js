const Attendance = require('../model/attendance');
const User = require('../model/user');
const Classroom = require('../model/classroom');
const Class = require('../model/class');
const mongoose = require('mongoose');

// Helper function to get date range
const getDateRange = (req) => {
  const { startDate, endDate } = req.query;
  const dateFilter = {};
  
  if (startDate) {
    dateFilter.date = { $gte: new Date(startDate) };
  }
  
  if (endDate) {
    dateFilter.date = { ...dateFilter.date, $lte: new Date(endDate) };
  }
  
  return dateFilter;
};

// Controller methods for attendance reporting
const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user.userId;
    const dateFilter = getDateRange(req);
    
    const attendanceData = await Attendance.find({
      student: studentId,
      ...dateFilter
    })
    .populate('class')
    .populate('classroom')
    .populate('student')
   
    .sort({ date: -1 });
    
    // Calculate attendance statistics
    const totalClasses = attendanceData.length;
    const presentCount = attendanceData.filter(a => a.status === 'present').length;
    const absentCount = attendanceData.filter(a => a.status === 'absent').length;
    const lateCount = attendanceData.filter(a => a.status === 'late').length;
    
    const attendancePercentage = totalClasses > 0 ? 
      ((presentCount + (lateCount * 0.5)) / totalClasses * 100).toFixed(2) : 0;
    
    res.status(200).json({
      success: true,
      data: {
        records: attendanceData,
        stats: {
          totalClasses,
          presentCount,
          absentCount,
          lateCount,
          attendancePercentage
        }
      }
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance data',
      error: error.message
    });
  }
};

const getClassAttendance = async (req, res) => {
  try {
    const classId = req.params.classId;
    const dateFilter = getDateRange(req);
    
    const attendanceData = await Attendance.find({
      class: classId,
      ...dateFilter
    })
    .populate({
      path: 'student',
      select: 'firstName lastName rollNumber',
      model: 'User'
    })
    .populate('classroom', 'name')
    .populate({
      path: 'teacher',
      select: 'firstName lastName',
      model: 'User'
    })
    .sort({ date: -1 });
    
    // Group by date for easier consumption
    const groupedByDate = attendanceData.reduce((acc, record) => {
      const dateStr = record.date.toISOString().split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(record);
      return acc;
    }, {});
    
    // Calculate class statistics
    const totalAttendanceRecords = attendanceData.length;
    const totalStudentDays = Object.values(groupedByDate).reduce(
      (total, dayRecords) => total + dayRecords.length, 0
    );
    const presentCount = attendanceData.filter(a => a.status === 'present').length;
    const absentCount = attendanceData.filter(a => a.status === 'absent').length;
    const lateCount = attendanceData.filter(a => a.status === 'late').length;
    
    const attendancePercentage = totalStudentDays > 0 ? 
      ((presentCount + (lateCount * 0.5)) / totalStudentDays * 100).toFixed(2) : 0;
    
    res.status(200).json({
      success: true,
      data: {
        recordsByDate: groupedByDate,
        stats: {
          totalAttendanceRecords,
          totalStudentDays,
          presentCount,
          absentCount,
          lateCount,
          attendancePercentage
        }
      }
    });
  } catch (error) {
    console.error('Error fetching class attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch class attendance data',
      error: error.message
    });
  }
};

const getClassroomAttendance = async (req, res) => {
  try {
    const classroomId = req.params.classroomId;
    const dateFilter = getDateRange(req);
    
    const attendanceData = await Attendance.find({
      classroom: classroomId,
      ...dateFilter
    })
    .populate({
      path: 'student',
      select: 'firstName lastName rollNumber',
      model: 'User'
    })
    .populate('class')
    .sort({ date: -1 });
    
    // Group by class for easier consumption
    const groupedByClass = attendanceData.reduce((acc, record) => {
      

      const classId = record?.class?._id?.toString();
      if (!acc[classId]) {
        acc[classId] = {
          className: record?.class?.title,
          records: []
        };
      }
      acc[classId].records.push(record);
      return acc;
    }, {});
    
    // Calculate classroom utilization stats
    const totalRecords = attendanceData.length;

    console.log(attendanceData)
    const uniqueDates = [...new Set(attendanceData
        .filter(a => a.date) // Only include records where `date` exists
        .map(a => a.date.toISOString().split('T')[0])
      )].length;
    
    res.status(200).json({
      success: true,
      data: {
        recordsByClass: groupedByClass,
        stats: {
          totalRecords,
          uniqueDates,
          utilization: uniqueDates > 0 ? (totalRecords / uniqueDates).toFixed(2) : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching classroom attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classroom attendance data',
      error: error.message
    });
  }
};

const getTeacherAttendance = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const dateFilter = getDateRange(req);
    
    const attendanceData = await Attendance.find({
      teacher: teacherId,
      ...dateFilter
    })
    .populate({
      path: 'student',
      select: 'firstName lastName rollNumber',
      model: 'User'
    })
    .populate('class', 'name')
    .populate('classroom', 'name')
    .sort({ date: -1 });
    
    // Group by class and date
    const groupedData = attendanceData.reduce((acc, record) => {
      const classId = record.class._id.toString();
      const dateStr = record.date.toISOString().split('T')[0];
      
      if (!acc[classId]) {
        acc[classId] = {
          className: record.class.name,
          dateRecords: {}
        };
      }
      
      if (!acc[classId].dateRecords[dateStr]) {
        acc[classId].dateRecords[dateStr] = [];
      }
      
      acc[classId].dateRecords[dateStr].push(record);
      return acc;
    }, {});
    
    // Calculate teacher stats
    const uniqueClasses = Object.keys(groupedData).length;
    const uniqueDates = [...new Set(attendanceData.map(a => 
      a.date.toISOString().split('T')[0]
    ))].length;
    
    res.status(200).json({
      success: true,
      data: {
        classSessions: groupedData,
        stats: {
          totalRecords: attendanceData.length,
          uniqueClasses,
          uniqueDates,
          averageClassSize: uniqueClasses > 0 && uniqueDates > 0 ? 
            (attendanceData.length / uniqueClasses / uniqueDates).toFixed(2) : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching teacher attendance data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teacher attendance data',
      error: error.message
    });
  }
};

const getOverallAttendance = async (req, res) => {
  try {
    // Verify admin privileges
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    const dateFilter = getDateRange(req);
    
    // Get aggregated attendance stats
    const attendanceStats = await Attendance.aggregate([
      { $match: dateFilter },
      { $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get attendance by class with proper population
    const attendanceByClass = await Attendance.aggregate([
      { $match: dateFilter },
      { $group: {
          _id: '$class',
          totalAttendance: { $sum: 1 },
          present: { 
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
          },
          absent: { 
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] }
          },
          late: { 
            $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] }
          }
        }
      },
      // Lookup class details
      { $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: '_id',
          as: 'classInfo'
        }
      },
      { $unwind: '$classInfo' },
      // Lookup course details for the class
      { $lookup: {
          from: 'courses',
          localField: 'classInfo.course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      { $unwind: { 
          path: '$courseInfo',
          preserveNullAndEmptyArrays: true
        } 
      },
      // Lookup group details for the class
      { $lookup: {
          from: 'groups',
          localField: 'classInfo.group',
          foreignField: '_id',
          as: 'groupInfo'
        }
      },
      { $unwind: { 
          path: '$groupInfo',
          preserveNullAndEmptyArrays: true
        } 
      },
      { $project: {
          className: '$classInfo.name',
          courseName: '$courseInfo.name',
          groupName: '$groupInfo.name',
          totalAttendance: 1,
          present: 1,
          absent: 1,
          late: 1,
          attendanceRate: { 
            $multiply: [
              { $divide: [
                { $add: ['$present', { $multiply: ['$late', 0.5] }] },
                '$totalAttendance'
              ]},
              100
            ]
          }
        }
      },
      { $sort: { attendanceRate: -1 } }
    ]);
    
    // Get attendance by classroom with enhanced population
    const attendanceByClassroom = await Attendance.aggregate([
      { $match: dateFilter },
      { $group: {
          _id: '$classroom',
          totalSessions: { $sum: 1 }
        }
      },
      { $lookup: {
          from: 'classrooms',
          localField: '_id',
          foreignField: '_id',
          as: 'classroomInfo'
        }
      },
      { $unwind: '$classroomInfo' },
      // Lookup building information if available
      { $lookup: {
          from: 'buildings',
          localField: 'classroomInfo.building',
          foreignField: '_id',
          as: 'buildingInfo'
        }
      },
      { $unwind: { 
          path: '$buildingInfo',
          preserveNullAndEmptyArrays: true
        } 
      },
      { $project: {
          classroomName: '$classroomInfo.name',
          classroomNumber: '$classroomInfo.roomNumber',
          building: '$buildingInfo.name',
          capacity: '$classroomInfo.capacity',
          totalSessions: 1
        }
      },
      { $sort: { totalSessions: -1 } }
    ]);
    
    // Get attendance by teacher with class and course details
    const attendanceByTeacher = await Attendance.aggregate([
      { $match: dateFilter },
      // Lookup class information first to get associated data
      { $lookup: {
          from: 'classes',
          localField: 'class',
          foreignField: '_id',
          as: 'classDetails'
        }
      },
      { $unwind: { 
          path: '$classDetails',
          preserveNullAndEmptyArrays: true
        } 
      },
      // Group by teacher, date, and class
      { $group: {
          _id: { 
            teacher: '$teacher', 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            class: '$class'
          },
          studentsPresent: { 
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
          },
          studentsAbsent: { 
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] }
          },
          studentsLate: { 
            $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] }
          },
          totalStudents: { $sum: 1 },
          className: { $first: '$classDetails.name' },
          courseId: { $first: '$classDetails.course' }
        }
      },
      // Group again by teacher
      { $group: {
          _id: '$_id.teacher',
          classSessions: { $sum: 1 },
          totalStudentsTracked: { $sum: '$totalStudents' },
          classes: { 
            $addToSet: { 
              classId: '$_id.class',
              className: '$className',
              courseId: '$courseId'
            } 
          },
          avgAttendanceRate: { 
            $avg: { 
              $multiply: [
                { $divide: [
                  { $add: ['$studentsPresent', { $multiply: ['$studentsLate', 0.5] }] },
                  '$totalStudents'
                ]},
                100
              ]
            }
          }
        }
      },
      // Lookup teacher details
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'teacherInfo'
        }
      },
      { $unwind: '$teacherInfo' },
      // Lookup courses for each class the teacher teaches
      { $lookup: {
          from: 'courses',
          let: { classesList: '$classes' },
          pipeline: [
            { $match: {
                $expr: {
                  $in: ['$_id', { $map: { input: '$$classesList', as: 'cls', in: '$$cls.courseId' } }]
                }
              }
            }
          ],
          as: 'coursesInfo'
        }
      },
      { $project: {
          teacherName: { 
            $concat: ['$teacherInfo.firstName', ' ', '$teacherInfo.lastName'] 
          },
          department: '$teacherInfo.department',
          classSessions: 1,
          totalStudentsTracked: 1,
          avgAttendanceRate: 1,
          courses: {
            $map: {
              input: '$classes',
              as: 'cls',
              in: {
                className: '$$cls.className',
                courseName: {
                  $let: {
                    vars: {
                      course: {
                        $arrayElemAt: [
                          { $filter: {
                              input: '$coursesInfo',
                              as: 'c',
                              cond: { $eq: ['$$c._id', '$$cls.courseId'] }
                            }
                          },
                          0
                        ]
                      }
                    },
                    in: '$$course.name'
                  }
                }
              }
            }
          }
        }
      },
      { $sort: { avgAttendanceRate: -1 } }
    ]);
    
    // Get students with low attendance (below 75%) with enhanced population
    const lowAttendanceStudents = await Attendance.aggregate([
      { $match: dateFilter },
      // Join with class to get group information
      { $lookup: {
          from: 'classes',
          localField: 'class',
          foreignField: '_id',
          as: 'classDetails'
        }
      },
      { $unwind: { 
          path: '$classDetails',
          preserveNullAndEmptyArrays: true
        } 
      },
      { $group: {
          _id: '$student',
          totalClasses: { $sum: 1 },
          presentCount: { 
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
          },
          lateCount: { 
            $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] }
          },
          classesTaken: {
            $addToSet: {
              classId: '$class',
              className: '$classDetails.name',
              groupId: '$classDetails.group'
            }
          }
        }
      },
      { $project: {
          totalClasses: 1,
          presentCount: 1,
          lateCount: 1,
          classesTaken: 1,
          attendancePercentage: { 
            $multiply: [
              { $divide: [
                { $add: ['$presentCount', { $multiply: ['$lateCount', 0.5] }] },
                '$totalClasses'
              ]},
              100
            ]
          }
        }
      },
      { $match: { attendancePercentage: { $lt: 75 } } },
      // Lookup student details
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' },
      { $match: { 'studentInfo.role': 'student' } },
      // Lookup group information
      { $lookup: {
          from: 'groups',
          let: { groups: { $map: { input: '$classesTaken', as: 'ct', in: '$$ct.groupId' } } },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$groups'] } } }
          ],
          as: 'groupInfo'
        }
      },
      { $project: {
          studentName: { 
            $concat: ['$studentInfo.firstName', ' ', '$studentInfo.lastName'] 
          },
          rollNumber: '$studentInfo.rollNumber',
          email: '$studentInfo.email',
          groupName: { 
            $arrayElemAt: ['$groupInfo.name', 0]
          },
          totalClasses: 1,
          presentCount: 1,
          lateCount: 1,
          attendancePercentage: 1,
          classes: {
            $map: {
              input: '$classesTaken',
              as: 'ct',
              in: '$$ct.className'
            }
          }
        }
      },
      { $sort: { attendancePercentage: 1 } }
    ]);
    
    // Get attendance by group
    const attendanceByGroup = await Attendance.aggregate([
      { $match: dateFilter },
      // Lookup class to get group ID
      { $lookup: {
          from: 'classes',
          localField: 'class',
          foreignField: '_id',
          as: 'classDetails'
        }
      },
      { $unwind: { 
          path: '$classDetails',
          preserveNullAndEmptyArrays: true
        } 
      },
      // Group by group and status
      { $group: {
          _id: {
            group: '$classDetails.group',
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      // Group again by just group to get all status counts
      { $group: {
          _id: '$_id.group',
          statusCounts: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          },
          totalAttendance: { $sum: '$count' }
        }
      },
      // Lookup group details
      { $lookup: {
          from: 'groups',
          localField: '_id',
          foreignField: '_id',
          as: 'groupInfo'
        }
      },
      { $unwind: { 
          path: '$groupInfo',
          preserveNullAndEmptyArrays: true
        } 
      },
      { $project: {
          groupName: '$groupInfo.name',
          totalAttendance: 1,
          present: {
            $ifNull: [
              { $arrayElemAt: [
                  { $filter: {
                      input: '$statusCounts',
                      as: 'sc',
                      cond: { $eq: ['$$sc.status', 'present'] }
                    }
                  },
                  0
                ]
              },
              { status: 'present', count: 0 }
            ]
          },
          absent: {
            $ifNull: [
              { $arrayElemAt: [
                  { $filter: {
                      input: '$statusCounts',
                      as: 'sc',
                      cond: { $eq: ['$$sc.status', 'absent'] }
                    }
                  },
                  0
                ]
              },
              { status: 'absent', count: 0 }
            ]
          },
          late: {
            $ifNull: [
              { $arrayElemAt: [
                  { $filter: {
                      input: '$statusCounts',
                      as: 'sc',
                      cond: { $eq: ['$$sc.status', 'late'] }
                    }
                  },
                  0
                ]
              },
              { status: 'late', count: 0 }
            ]
          }
        }
      },
      { $project: {
          groupName: 1,
          totalAttendance: 1,
          presentCount: '$present.count',
          absentCount: '$absent.count',
          lateCount: '$late.count',
          attendanceRate: { 
            $multiply: [
              { $divide: [
                { $add: ['$present.count', { $multiply: ['$late.count', 0.5] }] },
                '$totalAttendance'
              ]},
              100
            ]
          }
        }
      },
      { $sort: { attendanceRate: -1 } }
    ]);
    
    // Get attendance by course
    const attendanceByCourse = await Attendance.aggregate([
      { $match: dateFilter },
      // Lookup class to get course ID
      { $lookup: {
          from: 'classes',
          localField: 'class',
          foreignField: '_id',
          as: 'classDetails'
        }
      },
      { $unwind: { 
          path: '$classDetails',
          preserveNullAndEmptyArrays: true
        } 
      },
      // Group by course and status
      { $group: {
          _id: {
            course: '$classDetails.course',
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      // Group again by just course to get all status counts
      { $group: {
          _id: '$_id.course',
          statusCounts: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          },
          totalAttendance: { $sum: '$count' }
        }
      },
      // Lookup course details
      { $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      { $unwind: { 
          path: '$courseInfo',
          preserveNullAndEmptyArrays: true
        } 
      },
      { $project: {
          courseName: '$courseInfo.name',
          courseCode: '$courseInfo.code',
          totalAttendance: 1,
          present: {
            $ifNull: [
              { $arrayElemAt: [
                  { $filter: {
                      input: '$statusCounts',
                      as: 'sc',
                      cond: { $eq: ['$$sc.status', 'present'] }
                    }
                  },
                  0
                ]
              },
              { status: 'present', count: 0 }
            ]
          },
          absent: {
            $ifNull: [
              { $arrayElemAt: [
                  { $filter: {
                      input: '$statusCounts',
                      as: 'sc',
                      cond: { $eq: ['$$sc.status', 'absent'] }
                    }
                  },
                  0
                ]
              },
              { status: 'absent', count: 0 }
            ]
          },
          late: {
            $ifNull: [
              { $arrayElemAt: [
                  { $filter: {
                      input: '$statusCounts',
                      as: 'sc',
                      cond: { $eq: ['$$sc.status', 'late'] }
                    }
                  },
                  0
                ]
              },
              { status: 'late', count: 0 }
            ]
          }
        }
      },
      { $project: {
          courseName: 1,
          courseCode: 1,
          totalAttendance: 1,
          presentCount: '$present.count',
          absentCount: '$absent.count',
          lateCount: '$late.count',
          attendanceRate: { 
            $multiply: [
              { $divide: [
                { $add: ['$present.count', { $multiply: ['$late.count', 0.5] }] },
                '$totalAttendance'
              ]},
              100
            ]
          }
        }
      },
      { $sort: { attendanceRate: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        overallStats: {
          totalRecords: attendanceStats.reduce((sum, item) => sum + item.count, 0),
          statusCounts: attendanceStats.reduce((obj, item) => {
            obj[item._id] = item.count;
            return obj;
          }, {})
        },
        attendanceByClass,
        attendanceByGroup,
        attendanceByCourse,
        attendanceByClassroom,
        attendanceByTeacher,
        lowAttendanceStudents
      }
    });
  } catch (error) {
    console.error('Error fetching overall attendance data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overall attendance data',
      error: error.message
    });
  }
};
// Additional admin-specific methods
const getDailyAttendanceReport = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const dailyAttendance = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    })
    .populate({
      path: 'student',
      select: 'firstName lastName rollNumber',
      model: 'User'
    })
    .populate('class', 'name')
    .populate('classroom', 'name')
    .populate({
      path: 'teacher',
      select: 'firstName lastName',
      model: 'User'
    })
    .sort({ 'class.name': 1, 'student.rollNumber': 1 });
    
    // Group by class
    const attendanceByClass = dailyAttendance.reduce((acc, record) => {
      const classId = record.class._id.toString();
      
      if (!acc[classId]) {
        acc[classId] = {
          className: record.class.name,
          teacher: `${record.teacher.firstName} ${record.teacher.lastName}`,
          classroom: record.classroom.name,
          students: []
        };
      }
      
      acc[classId].students.push({
        name: `${record.student.firstName} ${record.student.lastName}`,
        rollNumber: record.student.rollNumber,
        status: record.status,
        remarks: record.remarks || ''
      });
      
      return acc;
    }, {});
    
    // Summary statistics
    const totalStudents = dailyAttendance.length;
    const presentCount = dailyAttendance.filter(a => a.status === 'present').length;
    const absentCount = dailyAttendance.filter(a => a.status === 'absent').length;
    const lateCount = dailyAttendance.filter(a => a.status === 'late').length;
    
    res.status(200).json({
      success: true,
      date: startOfDay,
      data: {
        summary: {
          totalStudents,
          presentCount,
          absentCount,
          lateCount,
          attendanceRate: totalStudents > 0 ? 
            ((presentCount + (lateCount * 0.5)) / totalStudents * 100).toFixed(2) : 0
        },
        classSessions: Object.values(attendanceByClass)
      }
    });
  } catch (error) {
    console.error('Error fetching daily attendance report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily attendance report',
      error: error.message
    });
  }
};

const getMonthlyAttendanceReport = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    const { year, month } = req.query;
    
    // Default to current month if not specified
    const reportDate = new Date();
    if (year) reportDate.setFullYear(parseInt(year));
    if (month) reportDate.setMonth(parseInt(month) - 1); // Month is 0-indexed in JS
    
    const startOfMonth = new Date(reportDate.getFullYear(), reportDate.getMonth(), 1);
    const endOfMonth = new Date(reportDate.getFullYear(), reportDate.getMonth() + 1, 0, 23, 59, 59, 999);
    
    // Get attendance data for the month
    const monthlyAttendanceData = await Attendance.aggregate([
      { 
        $match: { 
          date: { $gte: startOfMonth, $lte: endOfMonth } 
        } 
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            class: '$class'
          },
          presentCount: { 
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
          },
          absentCount: { 
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] }
          },
          lateCount: { 
            $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] }
          },
          totalCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: '_id.class',
          foreignField: '_id',
          as: 'classInfo'
        }
      },
      { $unwind: '$classInfo' },
      {
        $project: {
          date: '$_id.date',
          className: '$classInfo.name',
          presentCount: 1,
          absentCount: 1,
          lateCount: 1,
          totalCount: 1,
          attendanceRate: { 
            $multiply: [
              { $divide: [
                { $add: ['$presentCount', { $multiply: ['$lateCount', 0.5] }] },
                '$totalCount'
              ]},
              100
            ]
          }
        }
      },
      { $sort: { date: 1, className: 1 } }
    ]);
    
    // Group by date
    const groupedByDate = monthlyAttendanceData.reduce((acc, record) => {
      if (!acc[record.date]) {
        acc[record.date] = {
          date: record.date,
          classes: {}
        };
      }
      
      acc[record.date].classes[record.className] = {
        presentCount: record.presentCount,
        absentCount: record.absentCount,
        lateCount: record.lateCount,
        totalCount: record.totalCount,
        attendanceRate: record.attendanceRate
      };
      
      return acc;
    }, {});
    
    // Calculate monthly totals for each class
    const classMonthlyStats = {};
    monthlyAttendanceData.forEach(record => {
      if (!classMonthlyStats[record.className]) {
        classMonthlyStats[record.className] = {
          presentCount: 0,
          absentCount: 0,
          lateCount: 0,
          totalCount: 0,
          daysCounted: 0
        };
      }
      
      classMonthlyStats[record.className].presentCount += record.presentCount;
      classMonthlyStats[record.className].absentCount += record.absentCount;
      classMonthlyStats[record.className].lateCount += record.lateCount;
      classMonthlyStats[record.className].totalCount += record.totalCount;
      classMonthlyStats[record.className].daysCounted += 1;
    });
    
    // Calculate average attendance rates
    Object.keys(classMonthlyStats).forEach(className => {
      const stats = classMonthlyStats[className];
      stats.avgAttendanceRate = stats.totalCount > 0 ?
        ((stats.presentCount + (stats.lateCount * 0.5)) / stats.totalCount * 100).toFixed(2) : 0;
    });
    
    res.status(200).json({
      success: true,
      month: `${reportDate.getFullYear()}-${String(reportDate.getMonth() + 1).padStart(2, '0')}`,
      data: {
        dailyReports: Object.values(groupedByDate),
        monthlyClassStats: classMonthlyStats
      }
    });
  } catch (error) {
    console.error('Error fetching monthly attendance report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly attendance report',
      error: error.message
    });
  }
};
const attendanceStatsController = {getStudentAttendance,getDailyAttendanceReport, getClassAttendance, getClassroomAttendance, getTeacherAttendance, getOverallAttendance, getMonthlyAttendanceReport,getMonthlyAttendanceReport};
module.exports = attendanceStatsController;