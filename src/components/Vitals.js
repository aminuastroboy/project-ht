import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

function Vitals({ onSave }) {
  const [heartRate, setHeartRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [cholesterol, setCholesterol] = useState("");
  const [glucose, setGlucose] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newVitals = {
      heartRate: Number(heartRate),
      bloodPressure,
      cholesterol: Number(cholesterol),
      glucose: Number(glucose),
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, "vitals"), {
        ...newVitals,
        timestamp: serverTimestamp(),
      });

      if (onSave) onSave(newVitals);

      setHeartRate("");
      setBloodPressure("");
      setCholesterol("");
      setGlucose("");

      toast.success("Vitals logged successfully ✅");
    } catch (error) {
      console.error("Error adding vitals: ", error);
      toast.error("Error saving vitals ❌");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 mt-6">
      <h2 className="text-lg font-bold text-gray-700">Log Vitals</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
        <input type="number" placeholder="Heart Rate (bpm)" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} className="border p-2 rounded" required />
        <input type="text" placeholder="Blood Pressure (e.g. 120/80)" value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} className="border p-2 rounded" required />
        <input type="number" placeholder="Cholesterol (mg/dL)" value={cholesterol} onChange={(e) => setCholesterol(e.target.value)} className="border p-2 rounded" required />
        <input type="number" placeholder="Glucose (mg/dL)" value={glucose} onChange={(e) => setGlucose(e.target.value)} className="border p-2 rounded" required />
        <button type="submit" disabled={loading} className="bg-red-500 text-white py-2 rounded hover:bg-red-600 transition">{loading ? "Saving..." : "Save Vitals"}</button>
      </form>
    </div>
  );
}

export default Vitals;
