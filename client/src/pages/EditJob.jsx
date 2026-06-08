import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import {
  getJobById,
  updateJob
} from "../services/jobService";

const experienceLevels = [
  "Fresher",
  "Junior",
  "Mid",
  "Senior"
];

const jobTypes = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract"
];

export default function EditJob() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requiredSkills: "",
    experienceLevel: "",
    location: "",
    jobType: ""
  });

  useEffect(() => {

  const fetchJob = async () => {

    try {

      const data =
        await getJobById(id);

      const job = data.job;

      setFormData({
        title: job.title,
        company: job.company,
        description: job.description,
        requiredSkills:
          job.requiredSkills.join(", "),
        experienceLevel:
          job.experienceLevel,
        location:
          job.location,
        jobType:
          job.jobType
      });

    } catch (error) {

      console.error(error);

      alert("Failed to load job");

    } finally {

      setLoading(false);

    }
  };

  fetchJob();

}, [id]);

const handleChange = (e) => {

  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });

};

const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    setSaving(true);

    await updateJob(
      id,
      formData
    );

    alert(
      "Job updated successfully!"
    );

    navigate("/jobs");

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Update failed"
    );

  } finally {

    setSaving(false);

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
      Edit Job
    </h1>

    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow"
    >

      <div className="grid gap-4">

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-3 rounded"
          rows="5"
          required
        />

        <input
          type="text"
          name="requiredSkills"
          placeholder="React, Node.js, MongoDB"
          value={formData.requiredSkills}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <select
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        >
          <option value="">
            Select Experience Level
          </option>

          {experienceLevels.map((level) => (
            <option
              key={level}
              value={level}
            >
              {level}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="location"
          placeholder="Remote"
          value={formData.location}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <select
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        >
          <option value="">
            Select Job Type
          </option>

          {jobTypes.map((type) => (
            <option
              key={type}
              value={type}
            >
              {type}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={saving}
          className="
            bg-black
            text-white
            p-3
            rounded
            disabled:bg-gray-500
            disabled:cursor-not-allowed
          "
        >
          {saving
            ? "Updating..."
            : "Update Job"}
        </button>

      </div>

    </form>

  </AppLayout>
);
}