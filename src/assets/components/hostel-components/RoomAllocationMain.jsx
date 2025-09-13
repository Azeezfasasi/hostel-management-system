import React, { useState } from "react";

const sampleData = [
  {
    hostel: "Hostel One",
    block: "Block A",
    floors: [
      {
        floor: "Floor 1",
        rooms: [
          {
            name: "Room 1",
            beds: ["occupied", "available", "available", "blocked"],
          },
          {
            name: "Room 2",
            beds: ["occupied", "occupied", "available"],
          },
          {
            name: "Room 3",
            beds: ["occupied", "occupied", "available"],
          },
        ],
      },
      {
        floor: "Floor 2",
        rooms: [
          {
            name: "Room 3",
            beds: ["occupied", "blocked", "available", "available"],
          },
        ],
      },
    ],
  },
  {
    hostel: "Hostel Two",
    block: "Block B",
    floors: [
      {
        floor: "Floor 1",
        rooms: [
          {
            name: "Room 1",
            beds: ["occupied", "occupied", "occupied"],
          },
        ],
      },
    ],
  },
];

const getBedColor = (status) => {
  switch (status) {
    case "occupied":
      return "bg-red-500";
    case "available":
      return "bg-green-500";
    case "blocked":
      return "bg-yellow-500";
    default:
      return "bg-gray-400";
  }
};

const RoomAllocationMain = () => {
  const [selectedHostel, setSelectedHostel] = useState("All");
  const [selectedBlock, setSelectedBlock] = useState("All");
  const [selectedFloor, setSelectedFloor] = useState("All");

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={selectedHostel}
          onChange={(e) => setSelectedHostel(e.target.value)}
          className="border rounded p-2"
        >
          <option value="All">Hostel</option>
          {sampleData.map((h, i) => (
            <option key={i} value={h.hostel}>
              {h.hostel}
            </option>
          ))}
        </select>

        <select
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}
          className="border rounded p-2"
        >
          <option value="All">All Blocks</option>
          {sampleData.map((b, i) => (
            <option key={i} value={b.block}>
              {b.block}
            </option>
          ))}
        </select>

        <select
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(e.target.value)}
          className="border rounded p-2"
        >
          <option value="All">All Floors</option>
          {sampleData
            .flatMap((b) => b.floors.map((f) => f.floor))
            .map((f, i) => (
              <option key={i} value={f}>
                {f}
              </option>
            ))}
        </select>
      </div>

      {/* Blocks */}
      {sampleData
        .filter((b) => selectedBlock === "All" || b.block === selectedBlock)
        .map((block, i) => (
          <div key={i} className="mb-8">
            <h2 className="text-xl font-bold mb-4">{block.block}</h2>

            {block.floors
              .filter((f) => selectedFloor === "All" || f.floor === selectedFloor)
              .map((floor, j) => {
                // Count beds
                const allBeds = floor.rooms.flatMap((r) => r.beds);
                const occupiedCount = allBeds.filter((b) => b === "occupied").length;
                const availableCount = allBeds.filter((b) => b === "available").length;
                const blockedCount = allBeds.filter((b) => b === "blocked").length;

                return (
                  <div key={j} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">
                        {floor.floor} ({floor.rooms.length} Rooms)
                      </h3>
                      <div className="flex gap-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          Available {availableCount}
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                          Blocked {blockedCount}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                          Occupied {occupiedCount}
                        </span>
                      </div>
                    </div>

                    {/* Rooms */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {floor.rooms.map((room, k) => {
                        const occ = room.beds.filter((b) => b === "occupied").length;
                        const avail = room.beds.filter((b) => b === "available").length;
                        const status =
                          occ === room.beds.length
                            ? "Occupied"
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
        ))}
    </div>
  );
};

export default RoomAllocationMain;
