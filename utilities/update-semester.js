const { MongoClient } = require('mongodb');

// MongoDB connection
const uri = process.env.DEVURI || 'mongodb://localhost:27017/class-connect';

async function updateSemester() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db('class-connect');
        const coursesCollection = db.collection('courses');
        const professorsCollection = db.collection('professors');
        
        // Update all courses from "23-24 EVEN" to "25-26 ODD"
        const courseResult = await coursesCollection.updateMany(
            { semester: "23-24 EVEN" },
            { $set: { semester: "25-26 ODD" } }
        );
        
        console.log(`Updated ${courseResult.modifiedCount} courses to semester "25-26 ODD"`);
        
        // Update all professors from "23-24 EVEN" to "25-26 ODD" if they have semester field
        const profResult = await professorsCollection.updateMany(
            { semester: "23-24 EVEN" },
            { $set: { semester: "25-26 ODD" } }
        );
        
        console.log(`Updated ${profResult.modifiedCount} professors to semester "25-26 ODD"`);
        
        // Verify the update
        const courseCount = await coursesCollection.countDocuments({ semester: "25-26 ODD" });
        const profCount = await professorsCollection.countDocuments({ semester: "25-26 ODD" });
        
        console.log(`\nVerification:`);
        console.log(`Total courses with "25-26 ODD": ${courseCount}`);
        console.log(`Total professors with "25-26 ODD": ${profCount}`);
        
    } catch (error) {
        console.error('Error updating semester:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

updateSemester();
