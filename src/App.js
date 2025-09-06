import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function App() {
  const [heartRate, setHeartRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [records, setRecords] = useState([]);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("records");
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  // Save records when updated
  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
  }, [records]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!heartRate || !bloodPressure) return;
    const newRecord = {
      id: Date.now(),
      heartRate: Number(heartRate),
      bloodPressure,
      date: new Date().toLocaleString(),
    };
    setRecords([newRecord, ...records]);
    setHeartRate("");
    setBloodPressure("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6">❤️ Heart Tracker</h1>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block mb-2 font-medium">Heart Rate (bpm)</label>
          <input
            type="number"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. 75"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Blood Pressure</label>
          <input
            type="text"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. 120/80"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
        >
          Save Record
        </button>
      </form>

      {/* History */}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">📋 History</h2>
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Heart Rate</th>
              <th className="p-2 text-left">Blood Pressure</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.date}</td>
                <td className="p-2">{r.heartRate} bpm</td>
                <td className="p-2">{r.bloodPressure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <div className="mt-8 w-full max-w-2xl bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">📈 Heart Rate Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={records.slice().reverse()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="heartRate" stroke="#dc2626" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
