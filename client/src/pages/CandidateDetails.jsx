import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import {
  getCandidateById,
  updateCandidateStatus,
  scheduleInterview,
  updateCandidateNotes
} from "../services/candidateService";
import StatusBadge
  from "../components/StatusBadge";

const statuses = [
  "Pending",
  "Shortlisted",
  "Rejected",
  "Interview Scheduled"
];

export default function CandidateDetails() {

  const { id } = useParams();

  const [candidate, setCandidate] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [status, setStatus] =
    useState("");

  const [notes, setNotes] =
  useState("");

  const [interviewData, setInterviewData] =
    useState({
      interviewDate: "",
      interviewMode: "Online",
      interviewNotes: ""
    });

  const [showInterviewForm,
    setShowInterviewForm] =
    useState(false);

  const [showNotesEditor,
  setShowNotesEditor] =
  useState(false);

  useEffect(() => {

    const fetchCandidate =
      async () => {

        try {

          const data =
            await getCandidateById(id);

          setCandidate(
            data.candidate
          );

          setStatus(
            data.candidate.status
          );

          setNotes(
            data.candidate.notes || ""
          );

          setInterviewData({
            interviewDate:
              data.candidate.interviewDate
                ? new Date(
                    data.candidate.interviewDate
                  )
                    .toISOString()
                    .slice(0, 16)
                : "",

            interviewMode:
              data.candidate.interviewMode ||
              "Online",

            interviewNotes:
              data.candidate.interviewNotes ||
              ""
          });

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);

        }
      };

    fetchCandidate();

  }, [id]);

  const handleStatusUpdate =
    async () => {

      try {

        const data =
        await updateCandidateStatus(
            id,
            status
        );

        setCandidate({
        ...candidate,
        status
        });

        alert(
        "Status updated successfully"
        );

      } catch (error) {

        console.error(error);

      }
    };

    const handleNotesSave =
        async () => {

          try {

            await updateCandidateNotes(
              id,
              notes
            );

            setCandidate({
              ...candidate,
              notes
            });

            alert(
              "Notes saved successfully"
            );
            setShowNotesEditor(false);

          } catch (error) {

            console.error(error);

            alert(
              "Failed to save notes"
            );

          }

      };

    const handleInterviewSchedule =
    async () => {

      try {

        await scheduleInterview(
          id,
          interviewData
        );

        setCandidate({
          ...candidate,

          status:
            "Interview Scheduled",

          ...interviewData
        });

        setStatus(
          "Interview Scheduled"
        );

        alert(
          "Interview scheduled successfully"
        );

        setShowInterviewForm(false);

    } catch (error) {

      console.error(error);

      alert(
        "Failed to schedule interview"
      );

    }
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

      <h1 className="text-3xl font-bold mb-6">
        Candidate Details
      </h1>

      <div className="grid gap-6">

        {/* Candidate Info */}

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-xl font-bold mb-4">
            Candidate Information
          </h2>

          <p>
            <strong>Name:</strong>
            {" "}
            {candidate.name}
          </p>

          <p>
            <strong>Email:</strong>
            {" "}
            {candidate.email}
          </p>

          <p>
            <strong>Phone:</strong>
            {" "}
            {candidate.phone}
          </p>

        </div>

        {/* Job Info */}

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-xl font-bold mb-4">
            Applied Job
          </h2>

          <p>
            <strong>Title:</strong>
            {" "}
            {candidate.jobId?.title}
          </p>

          <p>
            <strong>Company:</strong>
            {" "}
            {candidate.jobId?.company}
          </p>

        </div>

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-xl font-bold mb-4">
            Resume
          </h2>

          {
            candidate.resumeFilePath ? (

              <button
                onClick={() =>
                  window.open(
                    `http://localhost:5000/${candidate.resumeFilePath}`,
                    "_blank"
                  )
                }
                className="
                  bg-blue-600
                  text-white
                  px-4
                  py-2
                  rounded
                "
              >
                View Resume
              </button>

            ) : (

              <p className="text-gray-500">
                Resume not available
              </p>

            )
          }

        </div>

        {/* Score */}

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-xl font-bold">
            Match Score
          </h2>

          <p className="text-5xl font-bold mt-4">
            {candidate.matchScore}%
          </p>

        </div>

        {/* Skills */}

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-xl font-bold mb-4">
            Matched Skills
          </h2>

          <div className="flex flex-wrap gap-2">

            {candidate.matchedSkills?.map(
              (skill, index) => (
                <span
                  key={index}
                  className="
                    bg-green-200
                    px-3
                    py-1
                    rounded-full
                  "
                >
                  {skill}
                </span>
              )
            )}

          </div>

        </div>

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-xl font-bold mb-4">
            Missing Skills
          </h2>

          <div className="flex flex-wrap gap-2">

            {candidate.missingSkills?.map(
              (skill, index) => (
                <span
                  key={index}
                  className="
                    bg-red-200
                    px-3
                    py-1
                    rounded-full
                  "
                >
                  {skill}
                </span>
              )
            )}

          </div>

        </div>

        {/* AI Summary */}

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-xl font-bold mb-4">
            AI Summary
          </h2>

          <p className="whitespace-pre-wrap">
            {candidate.aiSummary}
          </p>

        </div>
        <div className="mb-4">

        <StatusBadge
            status={candidate.status}
        />

        </div>

        <div className="bg-white p-6 rounded-lg shadow">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-xl font-bold">
              Recruiter Notes
            </h2>

            {
              !showNotesEditor && (

                <button
                  onClick={() =>
                    setShowNotesEditor(true)
                  }
                  className="
                    bg-black
                    text-white
                    px-3
                    py-2
                    rounded
                  "
                >
                  {
                    candidate.notes
                      ? "Edit Notes"
                      : "Add Notes"
                  }
                </button>

              )
            }

          </div>

          {
            !showNotesEditor ? (

              candidate.notes ? (

                <div className="
                  whitespace-pre-wrap
                  bg-gray-50
                  p-4
                  rounded
                ">
                  {candidate.notes}
                </div>

              ) : (

                <p className="text-gray-500">
                  No notes added yet.
                </p>

              )

            ) : (

              <div>

                <textarea

                  style={{
                    minHeight: "120px"
                  }}

                  value={notes}
                  onChange={(e) =>
                    setNotes(
                      e.target.value
                    )
                  }
                  rows="6"
                  className="
                    w-full
                    border
                    rounded
                    p-3
                  "
                />

                <div className="flex gap-3 mt-4">

                  <button
                    onClick={
                      handleNotesSave
                    }
                    className="
                      bg-black
                      text-white
                      px-4
                      py-2
                      rounded
                    "
                  >
                    Save
                  </button>

                  <button
                    onClick={() => {

                      setNotes(
                        candidate.notes || ""
                      );

                      setShowNotesEditor(
                        false
                      );

                    }}
                    className="
                      border
                      px-4
                      py-2
                      rounded
                    "
                  >
                    Cancel
                  </button>

                </div>

              </div>

            )
          }

        </div>

        {/* Status */}

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-xl font-bold mb-4">
            Candidate Status
          </h2>

          <div className="flex gap-4">

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              className="
                border
                p-3
                rounded
              "
            >

              {statuses.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

            <button
              onClick={
                handleStatusUpdate
              }
              className="
                bg-black
                text-white
                px-4
                py-2
                rounded
              "
            >
              Update Status
            </button>

          </div>

        </div>

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-xl font-bold mb-4">
            Interview Scheduling
          </h2>

          {!showInterviewForm ? (

            <button
              onClick={() =>
                setShowInterviewForm(true)
              }
              className="
                bg-purple-600
                text-white
                px-4
                py-2
                rounded
              "
            >
              {
                candidate.interviewDate
                  ? "Edit Interview"
                  : "Schedule Interview"
              }
            </button>

          ) : (

            <div className="grid gap-4">

              <input
                type="datetime-local"
                value={
                  interviewData.interviewDate
                }
                onChange={(e) =>
                  setInterviewData({
                    ...interviewData,
                    interviewDate:
                      e.target.value
                  })
                }
                className="
                  border
                  p-3
                  rounded
                "
              />

              <select
                value={
                  interviewData.interviewMode
                }
                onChange={(e) =>
                  setInterviewData({
                    ...interviewData,
                    interviewMode:
                      e.target.value
                  })
                }
                className="
                  border
                  p-3
                  rounded
                "
              >
                <option value="Online">
                  Online
                </option>

                <option value="Offline">
                  Offline
                </option>

              </select>

              <textarea
                rows="4"
                placeholder="Interview Notes"
                value={
                  interviewData.interviewNotes
                }
                onChange={(e) =>
                  setInterviewData({
                    ...interviewData,
                    interviewNotes:
                      e.target.value
                  })
                }
                className="
                  border
                  p-3
                  rounded
                "
              />

              <div className="flex gap-3">

                <button
                  onClick={
                    handleInterviewSchedule
                  }
                  className="
                    bg-purple-600
                    text-white
                    px-4
                    py-2
                    rounded
                  "
                >
                  Save Interview
                </button>

                <button
                  onClick={() =>
                    setShowInterviewForm(false)
                  }
                  className="
                    border
                    px-4
                    py-2
                    rounded
                  "
                >
                  Cancel
                </button>

              </div>

            </div>

          )}

        </div>

        {
          candidate.interviewDate && (

            <div className="bg-white p-6 rounded-lg shadow">

              <h2 className="text-xl font-bold mb-4">
                Scheduled Interview
              </h2>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  candidate.interviewDate
                ).toLocaleString()}
              </p>

              <p>
                <strong>Mode:</strong>{" "}
                {candidate.interviewMode}
              </p>

              <p>
                <strong>Notes:</strong>{" "}
                {candidate.interviewNotes}
              </p>

            </div>

          )
        }

      </div>

    </AppLayout>
  );
}