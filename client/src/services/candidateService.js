import api from "./api";

export const uploadResume = async (
  jobId,
  formData
) => {

  const response = await api.post(
    `/candidates/upload/${jobId}`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data"
      }
    }
  );

  return response.data;
};

export const getCandidatesByJob =
  async (jobId) => {

    const response = await api.get(
      `/candidates/job/${jobId}`
    );

    return response.data;
};

export const getCandidateById =
  async (id) => {

    const response = await api.get(
      `/candidates/${id}`
    );

    return response.data;
};

export const updateCandidateStatus = async (
  id,
  status
) => {

  const response = await api.put(
    `/candidates/${id}/status`,
    { status }
  );

  return response.data;
};

export const exportCandidatesCSV = async (
  jobId
) => {

  const response = await api.get(
    `/export/job/${jobId}`,
    {
      responseType: "blob"
    }
  );

  return response.data;
};

export const scheduleInterview = async (
  id,
  interviewData
) => {

  const response = await api.put(
    `/candidates/${id}/interview`,
    interviewData
  );

  return response.data;
};

export const getRecentCandidates =
  async () => {

    const response =
      await api.get(
        "/candidates/recent"
      );

    return response.data;
};

export const getUpcomingInterviews =
  async () => {

    const response =
      await api.get(
        "/candidates/upcoming-interviews"
      );

    return response.data;
};

export const getTopCandidate =
  async () => {

    const response =
      await api.get(
        "/candidates/top"
      );

    return response.data;
};

export const updateCandidateNotes =
  async (id, notes) => {

    const response =
      await api.put(
        `/candidates/${id}/notes`,
        { notes }
      );

    return response.data;
};