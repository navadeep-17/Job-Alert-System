// Quick script to add a real job
// Usage: node add-job.js

const job = {
  title: "Senior React Developer",
  company: "Your Company Name",
  location: "Remote",
  description: "Full job description here...",
  category: "Software Engineering",
  url: "https://company.com/careers/job-id",
  salary: "$120k-$150k",
  type: "Full-time",
  remote: true
};

fetch('http://localhost:3000/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(job)
})
.then(res => res.json())
.then(data => console.log('✅ Job added:', data))
.catch(err => console.error('❌ Error:', err));
