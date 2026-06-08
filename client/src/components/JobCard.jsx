import { Link } from "react-router-dom";

export default function JobCard({
  job,
  onDelete,
  onEdit
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold">
        {job.title}
      </h2>

      <p className="text-gray-600">
        {job.company}
      </p>

      <p className="mt-2">
        {job.location}
      </p>

      <p>
        {job.experienceLevel}
      </p>

      <div className="flex flex-wrap gap-2 mt-3">

        {job.requiredSkills?.map(
          (skill, index) => (
            <span
              key={index}
              className="bg-gray-200 px-2 py-1 rounded"
            >
              {skill}
            </span>
          )
        )}

      </div>

      <div className="flex flex-wrap gap-3 mt-5">

        <Link
            to={`/jobs/${job._id}/candidates`}
            className="bg-green-600 text-white px-4 py-2 rounded"
        >
            Candidates
        </Link>

        <Link
            to={`/jobs/${job._id}/upload`}
            className="bg-purple-600 text-white px-4 py-2 rounded"
        >
            Upload Resume
        </Link>

        <button
            onClick={() => onEdit(job)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
        >
            Edit
        </button>

        <button
            onClick={() => onDelete(job._id)}
            className="bg-red-500 text-white px-4 py-2 rounded"
        >
            Delete
        </button>

      </div>

    </div>
  );
}