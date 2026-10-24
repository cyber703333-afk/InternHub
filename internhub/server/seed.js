//   require('dotenv').config();
//   require('dns').setServers(['8.8.8.8', '1.1.1.1']);




// require('dotenv').config();
// const mongoose = require('mongoose');
// const User = require('./models/User');
// const Internship = require('./models/Internship');
// const Application = require('./models/Application');
// const Saved = require('./models/Saved');
// const Notification = require('./models/Notification');

// (async () => {
//   await mongoose.connect(process.env.MONGO_URI);
//   await Promise.all([User.deleteMany(), Internship.deleteMany(), Application.deleteMany(), Saved.deleteMany(), Notification.deleteMany()]);

//   await User.create({ name: 'Site Admin', email: 'admin@internhub.com', password: 'Admin@123', role: 'admin' });
//   const student = await User.create({ name: 'Riya Sharma', email: 'student@demo.com', password: 'Student@123', role: 'student', college: 'Demo Institute of Technology', course: 'B.Tech CSE', skills: ['React', 'Node.js', 'MongoDB'], resume: '/uploads/sample-resume.pdf', about: 'Final-year student interested in full-stack development.' });
//   await User.create({ name: 'Aman Verma', email: 'student2@demo.com', password: 'Student@123', role: 'student', college: 'City University', course: 'BCA', skills: ['Python', 'SQL'], resume: '/uploads/sample-resume.pdf' });
//   const c1 = await User.create({ name: 'Neha Kapoor', email: 'company@demo.com', password: 'Company@123', role: 'company', companyName: 'BrightByte Labs', industry: 'Software', location: 'Bengaluru', website: 'https://example.com', description: 'We build web products for growing businesses.' });
//   const c2 = await User.create({ name: 'Rahul Mehta', email: 'company2@demo.com', password: 'Company@123', role: 'company', companyName: 'GreenLeaf Analytics', industry: 'Data & AI', location: 'Pune', description: 'Data analytics for sustainability teams.' });

//   const d = (n) => new Date(Date.now() + n * 864e5);
//   const items = await Internship.insertMany([
//     { title: 'MERN Stack Developer Intern', description: 'Build and ship features across our React front end and Node/Express APIs. You will pair with a senior engineer and own small tickets end to end.', company: c1._id, category: 'Web Development', skills: ['React', 'Node.js', 'MongoDB'], stipend: 15000, duration: '3 months', location: 'Bengaluru', mode: 'Hybrid', openings: 3, deadline: d(30) },
//     { title: 'UI/UX Design Intern', description: 'Design flows and prototypes for our student-facing products and run quick usability tests.', company: c1._id, category: 'Design', skills: ['Figma', 'Prototyping'], stipend: 10000, duration: '2 months', location: 'Remote', mode: 'Remote', openings: 2, deadline: d(21) },
//     { title: 'Data Analyst Intern', description: 'Clean datasets, build dashboards and present weekly insights to the product team.', company: c2._id, category: 'Data Science', skills: ['Python', 'SQL', 'Power BI'], stipend: 12000, duration: '4 months', location: 'Pune', mode: 'Onsite', openings: 2, deadline: d(25) },
//     { title: 'Machine Learning Intern', description: 'Train and evaluate classification models on real customer data and document your experiments.', company: c2._id, category: 'Data Science', skills: ['Python', 'scikit-learn'], stipend: 18000, duration: '6 months', location: 'Remote', mode: 'Remote', openings: 1, deadline: d(40) },
//     { title: 'Content Writing Intern', description: 'Write blog posts, case studies and email campaigns about analytics and sustainability.', company: c2._id, category: 'Marketing', skills: ['Writing', 'SEO'], stipend: 0, duration: '2 months', location: 'Remote', mode: 'Remote', openings: 4, deadline: d(15) },
//     { title: 'QA & Testing Intern', description: 'Write test cases, run API tests in Postman and report bugs with clear reproduction steps.', company: c1._id, category: 'Web Development', skills: ['Postman', 'Testing'], stipend: 8000, duration: '3 months', location: 'Bengaluru', mode: 'Onsite', openings: 2, deadline: d(18) },
//   ]);

//   const a = await Application.create({ student: student._id, internship: items[0]._id, company: c1._id, coverLetter: 'I have built two MERN projects and would love to learn from your team.', resume: student.resume, status: 'Under Review', history: [{ status: 'Applied' }, { status: 'Under Review' }] });
//   await Application.create({ student: student._id, internship: items[2]._id, company: c2._id, coverLetter: 'Keen to work with real data.', resume: student.resume, history: [{ status: 'Applied' }] });
//   await Saved.create({ student: student._id, internship: items[3]._id });
//   await Notification.create({ user: student._id, message: `Your application for ${items[0].title} is now: Under Review.`, link: '/student/applications' });

//   console.log('Seed complete.\n  Admin:   admin@internhub.com / Admin@123\n  Student: student@demo.com / Student@123\n  Company: company@demo.com / Company@123');
//   await mongoose.disconnect();
// })().catch((e) => { console.error(e); process.exit(1); });






require('dotenv').config();
// Some networks block SRV lookups for mongodb+srv:// – use public DNS
require('dns').setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const User = require('./models/User');
const Internship = require('./models/Internship');
const Application = require('./models/Application');
const Saved = require('./models/Saved');
const Notification = require('./models/Notification');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Internship.deleteMany(), Application.deleteMany(), Saved.deleteMany(), Notification.deleteMany()]);

  await User.create({ name: 'Site Admin', email: 'admin@internhub.com', password: 'Admin@123', role: 'admin' });
  const student = await User.create({ name: 'Riya Sharma', email: 'student@demo.com', password: 'Student@123', role: 'student', college: 'Demo Institute of Technology', course: 'B.Tech CSE', skills: ['React', 'Node.js', 'MongoDB'], resume: '/uploads/sample-resume.pdf', about: 'Final-year student interested in full-stack development.' });
  await User.create({ name: 'Aman Verma', email: 'student2@demo.com', password: 'Student@123', role: 'student', college: 'City University', course: 'BCA', skills: ['Python', 'SQL'], resume: '/uploads/sample-resume.pdf' });
  const c1 = await User.create({ name: 'Neha Kapoor', email: 'company@demo.com', password: 'Company@123', role: 'company', companyName: 'BrightByte Labs', industry: 'Software', location: 'Bengaluru', website: 'https://example.com', description: 'We build web products for growing businesses.' });
  const c2 = await User.create({ name: 'Rahul Mehta', email: 'company2@demo.com', password: 'Company@123', role: 'company', companyName: 'GreenLeaf Analytics', industry: 'Data & AI', location: 'Pune', description: 'Data analytics for sustainability teams.' });

  const d = (n) => new Date(Date.now() + n * 864e5);

  // ---- First 6 internships (applications below use these) ----
  const items = await Internship.insertMany([
    { title: 'MERN Stack Developer Intern', description: 'Build and ship features across our React front end and Node/Express APIs. You will pair with a senior engineer and own small tickets end to end.', company: c1._id, category: 'Web Development', skills: ['React', 'Node.js', 'MongoDB'], stipend: 15000, duration: '3 months', location: 'Bengaluru', mode: 'Hybrid', openings: 3, deadline: d(30) },
    { title: 'UI/UX Design Intern', description: 'Design flows and prototypes for our student-facing products and run quick usability tests.', company: c1._id, category: 'Design', skills: ['Figma', 'Prototyping'], stipend: 10000, duration: '2 months', location: 'Remote', mode: 'Remote', openings: 2, deadline: d(21) },
    { title: 'Data Analyst Intern', description: 'Clean datasets, build dashboards and present weekly insights to the product team.', company: c2._id, category: 'Data Science', skills: ['Python', 'SQL', 'Power BI'], stipend: 12000, duration: '4 months', location: 'Pune', mode: 'Onsite', openings: 2, deadline: d(25) },
    { title: 'Machine Learning Intern', description: 'Train and evaluate classification models on real customer data and document your experiments.', company: c2._id, category: 'Data Science', skills: ['Python', 'scikit-learn'], stipend: 18000, duration: '6 months', location: 'Remote', mode: 'Remote', openings: 1, deadline: d(40) },
    { title: 'Content Writing Intern', description: 'Write blog posts, case studies and email campaigns about analytics and sustainability.', company: c2._id, category: 'Marketing', skills: ['Writing', 'SEO'], stipend: 0, duration: '2 months', location: 'Remote', mode: 'Remote', openings: 4, deadline: d(15) },
    { title: 'QA & Testing Intern', description: 'Write test cases, run API tests in Postman and report bugs with clear reproduction steps.', company: c1._id, category: 'Web Development', skills: ['Postman', 'Testing'], stipend: 8000, duration: '3 months', location: 'Bengaluru', mode: 'Onsite', openings: 2, deadline: d(18) },
  ]);

  // ---- 24 more internships (total 30) ----
  const extra = await User.create([
    { name: 'Priya Nair', email: 'company3@demo.com', password: 'Company@123', role: 'company', companyName: 'PixelCraft Studio', industry: 'Design', location: 'Mumbai', description: 'A design studio crafting brands and apps.' },
    { name: 'Karan Singh', email: 'company4@demo.com', password: 'Company@123', role: 'company', companyName: 'FinEdge Solutions', industry: 'Finance', location: 'Delhi', description: 'Fintech tools for small businesses.' },
    { name: 'Sana Khan', email: 'company5@demo.com', password: 'Company@123', role: 'company', companyName: 'AppNest Technologies', industry: 'Mobile Apps', location: 'Hyderabad', description: 'We build Android and iOS apps.' },
  ]);
  const cos = [c1, c2, ...extra];
  const catalog = [
    ['Frontend Developer Intern', 'Web Development', ['React', 'CSS', 'JavaScript']],
    ['Backend Developer Intern', 'Web Development', ['Node.js', 'Express', 'MongoDB']],
    ['Full Stack Intern', 'Web Development', ['MERN', 'REST APIs', 'Git']],
    ['WordPress Developer Intern', 'Web Development', ['WordPress', 'PHP', 'CSS']],
    ['Graphic Design Intern', 'Design', ['Photoshop', 'Illustrator']],
    ['Product Design Intern', 'Design', ['Figma', 'User Research']],
    ['Motion Graphics Intern', 'Design', ['After Effects', 'Animation']],
    ['Brand Design Intern', 'Design', ['Branding', 'Canva']],
    ['Data Science Intern', 'Data Science', ['Python', 'Pandas', 'Statistics']],
    ['Business Analyst Intern', 'Data Science', ['Excel', 'SQL', 'Tableau']],
    ['AI Research Intern', 'Data Science', ['Python', 'TensorFlow']],
    ['Data Engineering Intern', 'Data Science', ['SQL', 'ETL', 'Python']],
    ['Digital Marketing Intern', 'Marketing', ['SEO', 'Google Ads']],
    ['Social Media Intern', 'Marketing', ['Instagram', 'Content Planning']],
    ['Email Marketing Intern', 'Marketing', ['Mailchimp', 'Copywriting']],
    ['Growth Marketing Intern', 'Marketing', ['Analytics', 'A/B Testing']],
    ['Android Developer Intern', 'Mobile', ['Kotlin', 'Android Studio']],
    ['iOS Developer Intern', 'Mobile', ['Swift', 'Xcode']],
    ['Flutter Developer Intern', 'Mobile', ['Flutter', 'Dart']],
    ['React Native Intern', 'Mobile', ['React Native', 'JavaScript']],
    ['Finance Intern', 'Finance', ['Excel', 'Accounting']],
    ['Equity Research Intern', 'Finance', ['Financial Modeling', 'Excel']],
    ['HR Intern', 'Other', ['Recruitment', 'Communication']],
    ['Technical Support Intern', 'Other', ['Troubleshooting', 'Communication']],
  ];
  const cities = ['Bengaluru', 'Pune', 'Delhi', 'Mumbai', 'Hyderabad', 'Remote', 'Chennai', 'Noida'];
  const durs = ['2 months', '3 months', '4 months', '6 months'];
  const stipends = [0, 5000, 8000, 10000, 12000, 15000, 18000, 20000, 25000];
  await Internship.insertMany(catalog.map(([title, category, skills], i) => {
    const location = cities[i % cities.length];
    return {
      title, category, skills, location,
      description: `Join the ${category} team and work on real projects with guidance from a mentor. You will learn tools used in industry and present your work at the end of the internship.`,
      company: cos[i % cos.length]._id,
      stipend: stipends[i % stipends.length],
      duration: durs[i % durs.length],
      mode: location === 'Remote' ? 'Remote' : ['Onsite', 'Hybrid'][i % 2],
      openings: 1 + (i % 4),
      deadline: d(10 + ((i * 3) % 40)),
    };
  }));

  // ---- Demo applications, saved item and notification ----
  await Application.create({ student: student._id, internship: items[0]._id, company: c1._id, coverLetter: 'I have built two MERN projects and would love to learn from your team.', resume: student.resume, status: 'Under Review', history: [{ status: 'Applied' }, { status: 'Under Review' }] });
  await Application.create({ student: student._id, internship: items[2]._id, company: c2._id, coverLetter: 'Keen to work with real data.', resume: student.resume, history: [{ status: 'Applied' }] });
  await Saved.create({ student: student._id, internship: items[3]._id });
  await Notification.create({ user: student._id, message: `Your application for ${items[0].title} is now: Under Review.`, link: '/student/applications' });

  const total = await Internship.countDocuments();
  console.log(`Seed complete. ${total} internships created.\n  Admin:   admin@internhub.com / Admin@123\n  Student: student@demo.com / Student@123\n  Company: company@demo.com / Company@123`);
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });