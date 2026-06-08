import { Link } from "react-router-dom";
import StatusBadge
  from "./StatusBadge";

export default function CandidateCard({
  candidate,
  rank
}) {

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-xl font-bold">
            #{rank} {candidate.name}
          </h2>

          <p className="text-gray-600">
            {candidate.email}
          </p>

        </div>

        <div className="text-right">

          <p className="text-2xl font-bold">
            {candidate.matchScore}%
          </p>

          <StatusBadge
            status={candidate.status}
          />

        </div>

      </div>

      <div className="mt-4">

        <Link
          to={`/candidates/${candidate._id}`}
          className="bg-black text-white px-4 py-2 rounded"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}