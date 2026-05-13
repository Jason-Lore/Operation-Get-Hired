import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import he from "he";
import '../JobPage.css';

const API_URL = "http://192.168.0.49:3005";

function JobPage() {
    const { id } = useParams();

    const [job, setJob] = useState(null);

    useEffect(() => {
        async function loadJob() {
            const res = await fetch(`${API_URL}/api/jobs/${id}`);
            const data = await res.json();

            setJob(data);
        }

        loadJob();
    }, [id]);

    if (!job) {
        return <h1>Loading...</h1>;
    }

    const cleanDescription = DOMPurify.sanitize(
        he.decode(job.description || "")
    );

    return (
        <div>
            <h1>{job.title}</h1>
            <h2>{job.company}</h2>

            <p>Location: {job.location}</p>
            <p>Score: {job.score}</p>

            <div
                className="job-description"
                dangerouslySetInnerHTML={{
                    __html: cleanDescription
                }}
            />
        </div>
    );
}

export default JobPage;