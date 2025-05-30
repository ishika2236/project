const cron = require('node-cron');
const mongoose = require('mongoose');
const Class = require('../model/class');
const Attendance = require('../model/attendance');

// Schedule task to run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled attendance check');
  
  try {
    // Find classes that have ended but aren't marked as completed
    const now = new Date();
    
    // Format current time as HH:MM for comparison with schedule.endTime
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay(); // 0-6, where 0 is Sunday
    
    // Find regular classes that should have ended by now
    const endedRegularClasses = await Class.find({
      isExtraClass: false,
      status: 'scheduled', // or 'in-progress'
      'schedule.daysOfWeek': currentDay,
      'schedule.endTime': { $lt: currentTime },
      'schedule.startDate': { $lte: now },
      'schedule.endDate': { $gte: now }
    });
    
    // Find extra classes that should have ended by now
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const endedExtraClasses = await Class.find({
      isExtraClass: true,
      status: 'scheduled', // or 'in-progress'
      extraClassDate: { $gte: today, $lt: tomorrow },
      'schedule.endTime': { $lt: currentTime }
    });
    
    const endedClasses = [...endedRegularClasses, ...endedExtraClasses];
    
    console.log(`Found ${endedClasses.length} classes that should be marked as completed`);
    
    // Process each class
    for (const classObj of endedClasses) {
      console.log(`Auto-completing class: ${classObj.title} (${classObj._id})`);
      
      // Mark class as completed
      classObj.status = 'completed';
      await classObj.save();
      
      // Generate attendance records for absent students
      await classObj.generateAbsentRecords();
    }
    
    console.log('Scheduled attendance check completed');
  } catch (error) {
    console.error('Error in scheduled attendance check:', error);
  }
});

// Export the scheduled task setup function
module.exports = {
  initScheduledTasks: () => {
    console.log('Attendance scheduled tasks initialized');
  }
};