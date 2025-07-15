const { MongoClient } = require('mongodb');

// MongoDB connection
const uri = process.env.DEVURI || 'mongodb://localhost:27017/class-connect';

async function verifySemesterUpdate() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB for verification');
        
        const db = client.db('class-connect');
        const coursesCollection = db.collection('courses');
        
        // Check all unique semester values
        const semesters = await coursesCollection.distinct('semester');
        console.log('\n📅 Unique semester values in database:');
        semesters.forEach(sem => console.log(`  - ${sem}`));
        
        // Count courses by semester
        const semesterCounts = await coursesCollection.aggregate([
            { $group: { _id: '$semester', count: { $sum: 1 } } }
        ]).toArray();
        
        console.log('\n📊 Course counts by semester:');
        semesterCounts.forEach(item => {
            console.log(`  - ${item._id}: ${item.count} courses`);
        });
        
        // Sample course data
        const sampleCourse = await coursesCollection.findOne({});
        console.log('\n📝 Sample course data:');
        console.log(`  Code: ${sampleCourse.code}`);
        console.log(`  Title: ${sampleCourse.title}`);
        console.log(`  Semester: ${sampleCourse.semester}`);
        console.log(`  Professor: ${sampleCourse.prof}`);
        
        // Check if any old semester data remains
        const oldSemesterCount = await coursesCollection.countDocuments({ semester: "23-24 EVEN" });
        if (oldSemesterCount > 0) {
            console.log(`\n⚠️  WARNING: ${oldSemesterCount} courses still have old semester "23-24 EVEN"`);
        } else {
            console.log('\n✅ SUCCESS: All courses updated to new semester format');
        }
        
    } catch (error) {
        console.error('Error during verification:', error);
    } finally {
        await client.close();
        console.log('\nDisconnected from MongoDB');
    }
}

verifySemesterUpdate();
