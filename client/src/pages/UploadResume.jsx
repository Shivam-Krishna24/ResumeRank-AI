import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import {
  uploadResume
} from "../services/candidateService";

export default function UploadResume() {

  const { jobId } = useParams();

  const navigate = useNavigate();

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!file) {
        return alert(
          "Please select a PDF file"
        );
      }

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "resume",
          file
        );

        await uploadResume(
          jobId,
          formData
        );

        alert(
          "Resume uploaded successfully!"
        );

        navigate(
          `/jobs/${jobId}/candidates`
        );

      } catch (error) {

        console.error(error);

        alert(
          error.response?.data?.message ||
          "Upload failed"
        );

      } finally {

        setLoading(false);

      }
    };

  return (
    <AppLayout>

      <h1 className="text-3xl font-bold mb-6">
        Upload Resume
      </h1>

      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          p-6
          rounded-lg
          shadow
        "
      >

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setFile(
              e.target.files[0]
            )
          }
          className="mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="
            bg-black
            text-white
            px-6
            py-3
            rounded
          "
        >
          {loading
            ? "Uploading..."
            : "Upload Resume"}
        </button>

      </form>

    </AppLayout>
  );
}