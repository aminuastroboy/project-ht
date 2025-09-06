import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import Vitals from "./Vitals";

function Dashboard() {
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "vitals"), orderBy("timestamp", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setLatest(snapshot.docs[0].data());
      }
    });
    return () => unsubscribe();
  }, []);

  const handleNewVitals = (data) => {
    setLatest(data);
  };

  return (
    <div>
      <div className="bg-white shadow rounded-xl p-6">
        <h1 className="text-xl font-bold text-red-600">Heart Health Dashboard ❤️</h1>
        {latest ? (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Heart Rate</h2>
              <p className="text-2xl font-bold">{latest.heartRate} bpm</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Blood Pressure</h2>
              <p className="text-2xl font-bold">{latest.bloodPressure}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Cholesterol</h2>
              <p className="text-2xl font-bold">{latest.cholesterol} mg/dL</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Glucose</h2>
              <p className="text-2xl font-bold">{latest.glucose} mg/dL</p>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-gray-500">No vitals logged yet.</p>
        )}
      </div>

      <Vitals onSave={handleNewVitals} />
    </div>
  );
}

export default Dashboard;
