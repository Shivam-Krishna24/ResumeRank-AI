export default function StatusBadge({
  status
}) {

  const styles = {
    Pending:
      "bg-yellow-100 text-yellow-800",

    Shortlisted:
      "bg-green-100 text-green-800",

    Rejected:
      "bg-red-100 text-red-800",

    "Interview Scheduled":
      "bg-blue-100 text-blue-800"
  };

  return (
    <span
      className={`
        px-3
        py-1
        rounded-full
        text-sm
        font-medium
        ${styles[status]}
      `}
    >
      {status}
    </span>
  );
}