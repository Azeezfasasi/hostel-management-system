import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const getBedColor = (status) => {
  switch (status) {
    case "occupied":
      return "bg-red-500";
    case "available":
      return "bg-green-500";
    default:
      return "bg-gray-400";
  }
};


const RoomAllocationMain = () => {
  const [selectedHostel, setSelectedHostel] = useState("All");
  const [selectedBlock, setSelectedBlock] = useState("All");
  const [selectedFloor, setSelectedFloor] = useState("All");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(`${API_BASE_URL}/room`, config);
        const rooms = res.data.data || [];
        // Transform flat rooms to nested structure
        const grouped = {};
        rooms.forEach(room => {
          const hostelName = room.hostelId?.name || "Unknown Hostel";
          const block = room.roomBlock || "Unknown Block";
          const floor = room.roomFloor || "Unknown Floor";
          if (!grouped[hostelName]) grouped[hostelName] = {};
          if (!grouped[hostelName][block]) grouped[hostelName][block] = {};
          if (!grouped[hostelName][block][floor]) grouped[hostelName][block][floor] = [];
          // Build beds array: occupied for assignedStudents, available for the rest
          const beds = Array.from({ length: room.capacity }, (_, i) =>
            i < room.assignedStudents.length ? "occupied" : "available"
          );
          grouped[hostelName][block][floor].push({
            name: room.roomNumber,
            beds,
          });
        });
        // Convert to array structure for rendering
        const nested = Object.entries(grouped).map(([hostel, blocks]) =>
          Object.entries(blocks).map(([block, floors]) => ({
            hostel,
            block,
            floors: Object.entries(floors).map(([floor, rooms]) => ({
              floor,
              rooms,
            })),
          }))
        ).flat();
        setData(nested);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch room data");
      }
      setLoading(false);
    };
    fetchRooms();
  }, []);

  // Get options for filters
  const hostelOptions = Array.from(new Set(data.map(d => d.hostel)));
  const blockOptions = Array.from(new Set(data.map(d => d.block)));
  const floorOptions = Array.from(new Set(data.flatMap(d => d.floors.map(f => f.floor))));

  // Filtered data
  const filteredData = data.filter(d =>
    (selectedHostel === "All" || d.hostel === selectedHostel) &&
    (selectedBlock === "All" || d.block === selectedBlock)
  );

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={selectedHostel}
          onChange={e => setSelectedHostel(e.target.value)}
          className="border rounded p-2"
        >
          <option value="All">Hostel</option>
          {hostelOptions.map((h, i) => (
            <option key={i} value={h}>{h}</option>
          ))}
        </select>
        <select
          value={selectedBlock}
          onChange={e => setSelectedBlock(e.target.value)}
          className="border rounded p-2"
        >
          <option value="All">All Blocks</option>
          {blockOptions.map((b, i) => (
            <option key={i} value={b}>{b}</option>
          ))}
        </select>
        <select
          value={selectedFloor}
          onChange={e => setSelectedFloor(e.target.value)}
          className="border rounded p-2"
        >
          <option value="All">All Floors</option>
          {floorOptions.map((f, i) => (
            <option key={i} value={f}>{f}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        filteredData.map((block, i) => (
          <div key={i} className="mb-8">
            <h2 className="text-xl text-blue-600 font-bold mb-2 underline">Block {block.block}</h2>
            {block.floors
              .filter(f => selectedFloor === "All" || f.floor === selectedFloor)
              .map((floor, j) => {
                const allBeds = floor.rooms.flatMap(r => r.beds);
                const occupiedCount = allBeds.filter(b => b === "occupied").length;
                const availableCount = allBeds.filter(b => b === "available").length;
                return (
                  <div key={j} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">
                        Floor {floor.floor} - ({floor.rooms.length} Rooms)
                      </h3>
                      <div className="flex gap-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          Available {availableCount}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                          Occupied {occupiedCount}
                        </span>
                      </div>
                    </div>
                    {/* Rooms */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {floor.rooms.map((room, k) => {
                        const occ = room.beds.filter(b => b === "occupied").length;
                        const avail = room.beds.filter(b => b === "available").length;
                        const status =
                          occ === room.beds.length
                            ? "Fully Occupied"
                            : avail === room.beds.length
                            ? "Vacant"
                            : "Partly Occupied";
                        return (
                          <div
                            key={k}
                            className="border rounded p-4 bg-white shadow"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">{room.name}</h4>
                              <span className="text-sm text-gray-600">
                                {status}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {room.beds.map((bed, idx) => (
                                <div
                                  key={idx}
                                  className={`w-8 h-8 flex items-center justify-center text-white rounded ${getBedColor(
                                    bed
                                  )}`}
                                  title={bed}
                                >
                                  🛏
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        ))
      )}
    </div>
  );
};

export default RoomAllocationMain;
