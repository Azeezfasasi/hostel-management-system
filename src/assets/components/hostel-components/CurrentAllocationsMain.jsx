import React from "react";

const CurrentAllocationsMain = ({ assignments, onUnassign }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Current Allocations</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Student</th>
              <th className="border p-3">Hostel</th>
              <th className="border p-3">Block</th>
              <th className="border p-3">Floor</th>
              <th className="border p-3">Room</th>
              <th className="border p-3">Bed</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* {assignments.map((a) => (
              <tr key={a._id} className="hover:bg-gray-50">
                <td className="border p-3">
                  {a.student?.firstName} {a.student?.lastName}
                </td>
                <td className="border p-3">{a.block?.name}</td>
                <td className="border p-3">{a.floor?.name}</td>
                <td className="border p-3">{a.room?.name}</td>
                <td className="border p-3">Bed {a.bed + 1}</td>
                <td className="border p-3">
                  <button
                    onClick={() => onUnassign(a._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Unassign
                  </button>
                </td>
              </tr>
            ))} */}
            {/* {assignments.length === 0 && ( */}
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No allocations yet
                </td>
              </tr>
            {/* )} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentAllocationsMain;
