import { useEffect, useState } from "react";

import AppLayout from "../layouts/AppLayout";

import AnalyticsCard from "../components/AnalyticsCard";

import { getAnalytics } from "../services/analyticsService";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export default function Analytics() {

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        const data =
          await getAnalytics();

        setAnalytics(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

    fetchAnalytics();

  }, []);

  if (loading) {
    return (
      <AppLayout>
        <h1>Loading...</h1>
      </AppLayout>
    );
  }
  const statusData = [
    {
      name: "Pending",
      value: analytics.pending
    },
    {
      name: "Shortlisted",
      value: analytics.shortlisted
    },
    {
      name: "Rejected",
      value: analytics.rejected
    },
    {
      name: "Interview Scheduled",
      value: analytics.interviewScheduled
    }
  ];

  const skillData =
    analytics.topMissingSkills;


  const COLORS = [
    "#facc15",
    "#22c55e",
    "#ef4444",
    "#3b82f6"
  ];

  return (
    <AppLayout>

      <h1 className="text-3xl font-bold mb-6">
        Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <AnalyticsCard
          title="Total Jobs"
          value={analytics.totalJobs}
        />

        <AnalyticsCard
          title="Total Candidates"
          value={analytics.totalCandidates}
        />

        <AnalyticsCard
          title="Shortlisted"
          value={analytics.shortlisted}
        />

        <AnalyticsCard
          title="Rejected"
          value={analytics.rejected}
        />

        <AnalyticsCard
          title="Average Score"
          value={`${analytics.averageScore}%`}
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* Status Distribution */}

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-xl font-bold mb-4">
            Candidate Status Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >

                {statusData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[index]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* Missing Skills Chart */}

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-xl font-bold mb-4">
            Top Missing Skills
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={skillData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="skill"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="count"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </AppLayout>
  );
}