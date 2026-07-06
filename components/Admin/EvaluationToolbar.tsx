export default function EvaluationToolbar() {
  return (
    <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <button className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700">
        + Add New Scholar
      </button>

      <div className="flex flex-wrap gap-3">
        <select className="rounded border px-3 py-2">
          <option>All 100</option>
        </select>

        <select className="rounded border px-3 py-2">
          <option>Academic</option>
        </select>

        <input placeholder="Search..." className="rounded border px-3 py-2" />
      </div>
    </div>
  );
}
