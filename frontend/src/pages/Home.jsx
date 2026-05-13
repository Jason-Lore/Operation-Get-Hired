import React from "react";
import { useState, useEffect } from 'react'

const API_URL = "http://192.168.0.49:3005";

function Home() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        async function loadJobs() {
            const res = await fetch(`${API_URL}/api/jobs/top?limit=10`);
            const data = await res.json();

            setJobs(data.jobs);
        }

        loadJobs();
    }, []);
    return (
        <div className="jobs-grid">
            {jobs.map((job, index) => (
                <div className="job-card" key={index}>
                    <a href={`/job/${job._id}`} key={index}>
                        <h2>{job.company}</h2>
                        <p className="job-title">{job.title}</p>
                        <p>Score: {job.score}</p>
                    </a>
                </div>
            ))}
        </div>
    );
}

export default Home;