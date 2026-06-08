import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import JobCard from "../components/JobCard";

import {
  getJobs,
  deleteJob
} from "../services/jobService";

export default function Jobs() {

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {

    try {

      const data = await getJobs();

      setJobs(data.jobs);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this job?"
      );

    if (!confirmDelete) return;

    try {

      await deleteJob(id);

      fetchJobs();

    } catch (error) {

      console.error(error);

    }
  };

  const handleEdit = (job) => {

    navigate(`/jobs/edit/${job._id}`);
  };

  if (loading) {
    return (
      <AppLayout>
        <h1>Loading...</h1>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

      <div className="flex justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Jobs
        </h1>

        <Link
          to="/jobs/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create Job
        </Link>

      </div>

      {jobs.length === 0 ? (

        <div className="bg-white p-6 rounded shadow">
          No jobs found.
        </div>

      ) : (

        <div className="grid gap-4">

          {jobs.map((job) => (

            <JobCard
              key={job._id}
              job={job}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />

          ))}

        </div>

      )}

    </AppLayout>
  );
}