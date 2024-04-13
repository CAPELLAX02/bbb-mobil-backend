import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import issues from './data/issues.js';
import User from './models/userModel.js';
import Issue from './models/issueModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Issue.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    const sampleIssues = issues.map((issue) => {
      return { ...issue, user: adminUser };
    });

    await Issue.insertMany(sampleIssues);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.log(`${error}`);
    process.exit();
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Issue.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
