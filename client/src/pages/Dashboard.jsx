import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import { useAuth } from "../context/AuthContext";

import { getAnalytics }
  from "../services/analyticsService";

import {
  getRecentCandidates,
  getUpcomingInterviews,
  getTopCandidate
} from "../services/candidateService";

export default function Dashboard() {

  const { user } = useAuth();

  const navigate = useNavigate();
  const [recentCandidates,
    setRecentCandidates] =
    useState([]);

  const [upcomingInterviews,
    setUpcomingInterviews] =
    useState([]);

  const [topCandidate,
    setTopCandidate] =
    useState(null);

  const [analytics, setAnalytics] =
    useState(null);

  useEffect(() => {

    const fetchAnalytics =
      async () => {

        try {

          const data =
            await getAnalytics();

          setAnalytics(data);

          const recentData =
            await getRecentCandidates();

          setRecentCandidates(
            recentData.candidates
          );

          const interviewData =
            await getUpcomingInterviews();

          setUpcomingInterviews(
            interviewData.interviews
          );

          const topData =
            await getTopCandidate();

          setTopCandidate(
            topData.candidate
          );

        } catch (error) {

          console.error(error);

        }
      };

    fetchAnalytics();



  }, []);

  if (!analytics) {
    return (
      <AppLayout>
        <h1>Loading...</h1>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

      {/* Welcome Section */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Welcome back,
          {" "}
          {user?.name}
          👋

        </h1>

        <p className="text-gray-500 mt-2">

          Here's what's happening in your
          hiring pipeline today.

        </p>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500">
            Total Jobs
          </h2>
          <p className="text-4xl font-bold mt-2">
            {analytics.totalJobs}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500">
            Total Candidates
          </h2>
          <p className="text-4xl font-bold mt-2">
            {analytics.totalCandidates}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500">
            Average Score
          </h2>
          <p className="text-4xl font-bold mt-2">
            {analytics.averageScore.toFixed(0)}%
          </p>
        </div>

      </div>

      {/* Quick Actions */}

      <div className="mt-8">

        <h2 className="text-2xl font-bold mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={() =>
              navigate("/jobs/create")
            }
            className="
              bg-black
              text-white
              px-5
              py-3
              rounded
            "
          >
            Create Job
          </button>

          <button
            onClick={() =>
              navigate("/jobs")
            }
            className="
              bg-blue-600
              text-white
              px-5
              py-3
              rounded
            "
          >
            View Jobs
          </button>

          <button
            onClick={() =>
              navigate("/analytics")
            }
            className="
              bg-green-600
              text-white
              px-5
              py-3
              rounded
            "
          >
            Analytics
          </button>

        </div>

      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">

        <h2 className="text-2xl font-bold mb-4">
          Recent Candidates
        </h2>

        {recentCandidates.length === 0 ? (

          <p>No candidates found.</p>

        ) : (

          <div className="space-y-3">

            {recentCandidates.map(
              (candidate) => (

                <div
                  key={candidate._id}
                  className="
                    flex
                    justify-between
                    border-b
                    pb-2
                  "
                >

                  <span>
                    {candidate.name}
                  </span>

                  <span>
                    {candidate.matchScore}%
                  </span>

                </div>

              )
            )}

          </div>

        )}

      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">

        <h2 className="text-2xl font-bold mb-4">
          Upcoming Interviews
        </h2>

        {upcomingInterviews.length === 0 ? (

          <p>
            No interviews scheduled.
          </p>

        ) : (

          <div className="space-y-3">

            {upcomingInterviews.map(
              (interview) => (

                <div
                  key={interview._id}
                  className="
                    border-b
                    pb-2
                  "
                >

                  <p className="font-semibold">
                    {interview.name}
                  </p>

                  <p className="text-sm text-gray-500">

                    {new Date(
                      interview.interviewDate
                    ).toLocaleString()}

                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">

        <h2 className="text-2xl font-bold mb-4">
          Top Candidate
        </h2>

        {topCandidate ? (

          <div>

            <h3 className="text-xl font-bold">
              {topCandidate.name}
            </h3>

            <p className="mt-2">

              Match Score:
              {" "}
              {topCandidate.matchScore}%

            </p>

            <p className="mt-2">

              Status:
              {" "}
              {topCandidate.status}

            </p>

          </div>

        ) : (

          <p>No candidates found.</p>

        )}

      </div>

      {/* Hiring Pipeline */}

      <div className="mt-8 bg-white p-6 rounded-lg shadow">

        <h2 className="text-2xl font-bold mb-4">
          Hiring Pipeline
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div>
            <p className="text-yellow-600 font-bold">
              Pending
            </p>
            <p className="text-3xl">
              {analytics.pending}
            </p>
          </div>

          <div>
            <p className="text-green-600 font-bold">
              Shortlisted
            </p>
            <p className="text-3xl">
              {analytics.shortlisted}
            </p>
          </div>

          <div>
            <p className="text-blue-600 font-bold">
              Interview
            </p>
            <p className="text-3xl">
              {analytics.interviewScheduled}
            </p>
          </div>

          <div>
            <p className="text-red-600 font-bold">
              Rejected
            </p>
            <p className="text-3xl">
              {analytics.rejected}
            </p>
          </div>

        </div>

      </div>

      {/* Missing Skills */}

      <div className="mt-8 bg-white p-6 rounded-lg shadow">

        <h2 className="text-2xl font-bold mb-4">
          Most Missing Skills
        </h2>

        <div className="flex flex-wrap gap-3">

          {analytics.topMissingSkills.map(
            (item) => (

              <span
                key={item.skill}
                className="
                  bg-gray-200
                  px-3
                  py-1
                  rounded-full
                "
              >
                {item.skill}
                {" "}
                ({item.count})
              </span>

            )
          )}

        </div>

      </div>

    </AppLayout>
  );
}