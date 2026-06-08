import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import CandidateCard from "../components/CandidateCard";

import {
  getCandidatesByJob,
  exportCandidatesCSV
} from "../services/candidateService";

export default function Candidates() {

  const { jobId } = useParams();

  const [candidates, setCandidates] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");
  const handleExport = async () => {

    try {

      const blob =
        await exportCandidatesCSV(
          jobId
        );

        const url =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement("a");

          link.href = url;

          link.download =
            "candidates.csv";

          document.body.appendChild(
            link
          );

          link.click();

          link.remove();

        } catch (error) {

          console.error(error);

          alert(
            "Failed to export CSV"
          );

        }
      };

  useEffect(() => {

    const fetchCandidates =
      async () => {

        try {

          const data =
            await getCandidatesByJob(jobId);
          setCandidates(data.candidates);
          

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);

        }
      };

    fetchCandidates();

  }, [jobId]);

  if (loading) {
    return (
      <AppLayout>
        <h1>Loading...</h1>
      </AppLayout>
    );
  }

  const filteredCandidates =
    candidates.filter(candidate => {

      const matchesSearch =
        candidate.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        candidate.email
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        statusFilter === "All" ||
        candidate.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  return (
    <AppLayout>
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            Candidates
          </h1>

        </div>

      <div className="flex flex-wrap gap-3 items-center">

        <input
          type="text"
          placeholder="Search candidate..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            border
            px-3
            py-2
            rounded
          "
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="
            border
            px-3
            py-2
            rounded
          "
        >

          <option value="All">
            All Statuses
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Shortlisted">
            Shortlisted
          </option>

          <option value="Rejected">
            Rejected
          </option>

          <option value="Interview Scheduled">
            Interview Scheduled
          </option>

        </select>

        <button
          onClick={handleExport}
          className="
            bg-green-600
            text-white
            px-4
            py-2
            rounded
          "
        >
          Export CSV
        </button>

      </div>

      {filteredCandidates.length === 0 ? (

        <div className="bg-white p-8 rounded shadow text-center">

          <h2 className="text-xl font-semibold">
            No candidates found
          </h2>

          <p className="text-gray-500 mt-2">
            Try changing your search or filter.
          </p>

        </div>

      ) : (

        <div className="grid gap-4">

          {filteredCandidates.map(
            (candidate, index) => (

              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                rank={index + 1}
              />

            )
          )}
          <p className="text-gray-600 mb-4">
            Showing {filteredCandidates.length}
            {" "}candidate(s)
          </p>

        </div>

      )}

    </AppLayout>
  );
}