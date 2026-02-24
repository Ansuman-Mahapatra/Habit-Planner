const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Goal = require('./models/Goal');
const Habit = require('./models/Habit');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected.');

    // Find the default user 'test@example.com'
    const user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
        console.error('Test user test@example.com not found. Create it in the app first!');
        process.exit(1);
    }
    const userId = user._id;

    // Clear existing goals and habits for this user
    await Goal.deleteMany({ user: userId });
    await Habit.deleteMany({ userId: userId });
    console.log('Cleared existing goals and habits for user: ', user.email);

    // Create the Timeline Goals
    // 12-Month
    const graduationGoal = await Goal.create({
        user: userId,
        name: 'Graduation / Career Goal',
        description: 'Job offer INR 6-7 LPA. Tech: DSA, Spring Boot, Python AI/ML.',
        startDate: '2026-02-17',
        endDate: '2027-02-28'
    });

    // 6-Month
    const sixMonthGoal = await Goal.create({
        user: userId,
        name: 'Mastery & Portfolio (6 Months)',
        description: 'Complete Smart Git Analyzer + 1 ML project. Confident in Medium DSA.',
        startDate: '2026-02-17',
        endDate: '2026-07-31'
    });

    // 3-Month
    const threeMonthGoal = await Goal.create({
        user: userId,
        name: 'The Grind Phase (3 Months)',
        description: '200 DSA problems. 3 ML models. Get 1 Internship.',
        startDate: '2026-02-17',
        endDate: '2026-04-30'
    });

    // Monthly Target (February)
    const febGoal = await Goal.create({
        user: userId,
        name: 'February Targets',
        description: '60 DSA problems. Apply to 20 internships. 30 Pushups.',
        startDate: '2026-02-17',
        endDate: '2026-02-28'
    });

    // Weeks
    const week1Goal = await Goal.create({ user: userId, name: 'Week 1: Array, Strings, Hashing', description: 'Sets up Git Commit Analyzer & Spring Boot basics.', startDate: '2026-02-17', endDate: '2026-02-23' });
    const week2Goal = await Goal.create({ user: userId, name: 'Week 2: Spring Boot APIs & Recursion', description: '3 REST APIs + JWT Auth. 15 DSA Recursion/Backtracking.', startDate: '2026-02-24', endDate: '2026-03-02' });
    const week3Goal = await Goal.create({ user: userId, name: 'Week 3: Frontend Integrations', description: 'Smart Git Analyzer frontend. Learn Microservices. Sliding window + Binary search.', startDate: '2026-03-03', endDate: '2026-03-09' });
    const week4Goal = await Goal.create({ user: userId, name: 'Week 4: Trees & Docker Basics', description: 'Tree/BST algorithms. Docker. ML Linear Regression model.', startDate: '2026-03-10', endDate: '2026-03-16' });

    // CREATE HABITS
    const commonProps = {
        userId, type: 'permanent', startDate: new Date().toISOString().split('T')[0], weeklyGoal: 100
    };

    // --- DAILY NON-NEGOTIABLES ---
    await Habit.create([
      { ...commonProps, title: 'Solve 2 DSA problems', category: 'work', frequency: 'daily' },
      { ...commonProps, title: 'Write 20+ lines project code', category: 'work', frequency: 'daily' },
      { ...commonProps, title: 'Learn something new (15m)', category: 'mind', frequency: 'daily' },
      { ...commonProps, title: 'High-intensity Exercise (15m)', category: 'health', frequency: 'daily' },
      { ...commonProps, title: 'Track Progress & Plan Daily', category: 'lifestyle', frequency: 'daily' }
    ]);

    // --- MILESTONE HABITS LINKED TO GOALS ---
    
    // Week 1 Habits
    await Habit.create([
      { ...commonProps, title: 'Set up Spring Boot Skeleton', category: 'work', frequency: 'times_per_month', timesPerMonth: 1, goalId: week1Goal._id },
      { ...commonProps, title: 'Watch ML Course (Andrew Ng)', category: 'mind', frequency: 'times_per_month', timesPerMonth: 1, goalId: week1Goal._id },
    ]);

    // Week 2 Habits
    await Habit.create([
      { ...commonProps, title: 'Build 3 REST APIs in Spring Boot', category: 'work', frequency: 'times_per_month', timesPerMonth: 3, goalId: week2Goal._id },
      { ...commonProps, title: 'Add JWT Auth to API', category: 'work', frequency: 'times_per_month', timesPerMonth: 1, goalId: week2Goal._id },
      { ...commonProps, title: 'Learn NumPy Basics', category: 'mind', frequency: 'times_per_month', timesPerMonth: 1, goalId: week2Goal._id },
      { ...commonProps, title: '25 Pushups continuous', category: 'health', frequency: 'times_per_month', timesPerMonth: 1, goalId: week2Goal._id },
    ]);

    // Week 3 Habits
    await Habit.create([
      { ...commonProps, title: 'Start Git Analyzer Frontend UI', category: 'work', frequency: 'times_per_month', timesPerMonth: 1, goalId: week3Goal._id },
      { ...commonProps, title: 'Learn Spring Boot Microservices', category: 'mind', frequency: 'times_per_month', timesPerMonth: 1, goalId: week3Goal._id },
      { ...commonProps, title: 'Learn Pandas Dataframes', category: 'mind', frequency: 'times_per_month', timesPerMonth: 1, goalId: week3Goal._id },
    ]);

    // Week 4 Habits
    await Habit.create([
      { ...commonProps, title: 'Add file upload to Analyzer', category: 'work', frequency: 'times_per_month', timesPerMonth: 1, goalId: week4Goal._id },
      { ...commonProps, title: 'Learn Docker container basics', category: 'mind', frequency: 'times_per_month', timesPerMonth: 1, goalId: week4Goal._id },
      { ...commonProps, title: 'Build ML Linear Regression model', category: 'mind', frequency: 'times_per_month', timesPerMonth: 1, goalId: week4Goal._id },
      { ...commonProps, title: '30 Pushups continuous', category: 'health', frequency: 'times_per_month', timesPerMonth: 1, goalId: week4Goal._id },
    ]);

    console.log('ALL GOALS AND HABITS SUCCESSFULLY INSERTED!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
