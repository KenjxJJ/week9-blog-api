require('dotenv').config();
const mongoose = require('mongoose');
const ArticleModel = require('../models/article.model');
const sampleArticles = require('./articles.seed.json');

const seedDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in your .env file');
        }

        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully.');

        console.log('🧹 Clearing existing test articles...');
        await ArticleModel.deleteMany({});
        console.log('✅ Collection cleared.');

        console.log(`🌱 Inserting ${sampleArticles.length} sample articles...`);
        const inserted = await ArticleModel.insertMany(sampleArticles);
        console.log(`🎉 Successfully seeded ${inserted.length} articles!`);

        console.log('\n--- Sample Article IDs for Testing ---');
        inserted.forEach((doc, idx) => {
            console.log(`[${idx + 1}] ID: ${doc._id} | Title: "${doc.title}" (Author: ${doc.author})`);
        });

        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
};

seedDB();
