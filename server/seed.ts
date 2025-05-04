import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './schema/User';
import Student from './schema/Student';
import Project from './schema/Project';
import Task from './schema/Task';

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('✅ Connected to MongoDB');

        // Clear old data
        await User.deleteMany({});
        await Student.deleteMany({});
        await Project.deleteMany({});
        await Task.deleteMany({});
        console.log('🧹 Old data cleared');

        // 1. Create Students
        const studentDocs = await Student.insertMany([
            { name: "Ali Yaseen" }, { name: "Braa Aeesh" }, { name: "Ibn Al-Jawzee" },
            { name: "Ibn Malik" }, { name: "Ayman Outom" }, { name: "Salah Salah" },
            { name: "Yahya Leader" }, { name: "Salam Kareem" }, { name: "Isaac Nasir" },
            { name: "Saeed Salam" }
        ]);
        console.log('👨‍🎓 Students inserted');

        // 2. Create Users
        const users = [
            { username: 'admin', password: 'admin123', name: 'Ali mohammed', role: 'Administrator' },
            { username: 'student1', password: 'student123', name: 'Ali Yaseen', role: 'Student', studentId: studentDocs[0]._id },
            { username: 'student2', password: 'student123', name: 'Braa Aeesh', role: 'Student', studentId: studentDocs[1]._id },
            { username: 'student3', password: 'student123', name: 'Ibn Al-Jawzee', role: 'Student', studentId: studentDocs[2]._id }
        ];
        await User.insertMany(users);
        console.log('👤 Users inserted');

        // 3. Create Projects
        const projects = await Project.insertMany([
            {
                title: "Website Redesign", description: "Redesign the company website", students: [studentDocs[0]._id],
                category: "Web Development", startDate: new Date("2023-01-01"), endDate: new Date("2023-06-01"),
                status: "Completed", progress: 100
            },
            {
                title: "Mobile App Development", description: "Develop a mobile app", students: [studentDocs[1]._id],
                category: "Mobile Development", startDate: new Date("2023-02-15"), endDate: new Date("2023-08-15"),
                status: "Completed", progress: 100
            },
            {
                title: "Data Analysis Project", description: "Analyze last quarter data", students: [studentDocs[2]._id],
                category: "Data Science", startDate: new Date("2023-03-01"), endDate: new Date("2023-05-01"),
                status: "Completed", progress: 100
            },
            {
                title: "Machine Learning Model", description: "ML model for predictions", students: [studentDocs[0]._id],
                category: "Machine Learning", startDate: new Date("2023-04-01"), endDate: new Date("2023-09-01"),
                status: "Completed", progress: 100
            },
            {
                title: "Machine Learning Model", description: "Second ML model", students: [studentDocs[0]._id],
                category: "Machine Learning", startDate: new Date("2023-04-01"), endDate: new Date("2026-09-01"),
                status: "In Progress", progress: 55
            }
        ]);
        console.log('📁 Projects inserted');

        // 4. Create Tasks
        const tasks = [
            { projectId: projects[0]._id, name: "Design Homepage Mockup", description: "Create mockup designs", assignedTo: studentDocs[0]._id, status: "Completed", dueDate: new Date("2023-04-24") },
            { projectId: projects[0]._id, name: "Code Frontend", description: "Implement frontend", assignedTo: studentDocs[1]._id, status: "Completed", dueDate: new Date("2023-01-16") },
            { projectId: projects[1]._id, name: "Design App UI", description: "Create UI designs", assignedTo: studentDocs[2]._id, status: "Completed", dueDate: new Date("2023-03-15") },
            { projectId: projects[1]._id, name: "Implement Backend API", description: "Backend API endpoints", assignedTo: studentDocs[3]?._id || studentDocs[0]._id, status: "In Progress", dueDate: new Date("2023-11-29") },
            { projectId: projects[2]._id, name: "Data Collection", description: "Collect data", assignedTo: studentDocs[4]._id, status: "Completed", dueDate: new Date("2023-03-24") },
            { projectId: projects[2]._id, name: "Data Cleaning", description: "Prepare data", assignedTo: studentDocs[4]._id, status: "In Progress", dueDate: new Date("2023-04-22") },
            { projectId: projects[3]._id, name: "Model Research", description: "Research ML models", assignedTo: studentDocs[0]._id, status: "Completed", dueDate: new Date("2023-04-22") },
            { projectId: projects[3]._id, name: "Dataset Preparation", description: "Prepare datasets", assignedTo: studentDocs[2]._id, status: "In Progress", dueDate: new Date("2023-04-22") },
            { projectId: projects[4]._id, name: "Feature Engineering", description: "Engineer features", assignedTo: studentDocs[0]._id, status: "In Progress", dueDate: new Date("2023-04-22") },
            { projectId: projects[4]._id, name: "Model Evaluation", description: "Evaluate performance", assignedTo: studentDocs[2]._id, status: "Pending", dueDate: new Date("2023-04-22") }
        ];
        await Task.insertMany(tasks);
        console.log('✅ Tasks inserted');

        console.log('🌱 Database seeding complete!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    }
}

seedDatabase();
