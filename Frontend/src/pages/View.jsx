import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrip } from "../context/TripContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Edit, Trash2, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const View = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { deleteTrip, trips, fetchTrips, loading } = useTrip();
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (trips.length === 0) {
      fetchTrips();
    }
  }, []);

  const trip = trips.find((t) => t._id === id);

  const getExpenseData = () => {
    if (!trip) return [];

    return [
      { name: "Fuel Cost", value: trip.fuelCost || 0, color: "#ef4444" },
      {
        name: "Driver Payment",
        value: trip.driverAllowance?.paid || 0,
        color: "#3b82f6",
      },
      { name: "Hamaali", value: trip.hamaali || 0, color: "#f59e0b" },
      {
        name: "Paid Transport",
        value: trip.paidTransport || 0,
        color: "#8b5cf6",
      },
      {
        name: "Maintenance",
        value: trip.maintenanceCost || 0,
        color: "#10b981",
      },
      { name: "Commission", value: trip.commission || 0, color: "#ec4899" },
      { name: "Other", value: trip.otherExpenses || 0, color: "#6b7280" },
    ].filter((item) => item.value > 0);
  };

  const handleDelete = async () => {
    const result = await deleteTrip(id);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  const downloadPDF = async () => {
    try {
      const element = document.getElementById("trip-details-container");

      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      const originalPadding = element.style.padding;

       const gridElements = element.querySelectorAll('[class*="grid-cols"]');
    const originalGridClasses = [];
    
    gridElements.forEach((el, index) => {
      originalGridClasses[index] = el.className;
      if (el.className.includes('md:grid-cols-2')) {
        el.className = el.className.replace(/grid-cols-\d+/g, 'grid-cols-2');
      }
      if (el.className.includes('lg:grid-cols-3')) {
        el.className = el.className.replace(/grid-cols-\d+/g, 'grid-cols-3');
      }
      if (el.className.includes('md:grid-cols-4')) {
        el.className = el.className.replace(/grid-cols-\d+/g, 'grid-cols-4');
      }
    });

      element.style.width = "1200px";
      element.style.maxWidth = "1200px";
      element.style.padding = "40px"; 

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width:1200,
        windowWidth:1200
      });

      element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;
    element.style.padding = originalPadding;

    gridElements.forEach((el, index) => {
      el.className = originalGridClasses[index];
    });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("l", "mm", "a4");
      const imgWidth = 297;
      const pageHeight = 210;
      const pdfWidth = imgWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Trip-${trip.Vehicle_Number}-${trip.route}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      setError("Failed to generate PDF");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f3f4f6" }}
      >
        <div
          className="border-8 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: "#facc15" }}
        >
          <p className="text-2xl font-black uppercase tracking-tight animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f3f4f6" }}
      >
        <div
          className="border-8 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: "#f87171" }}
        >
          <p className="text-2xl font-black uppercase tracking-tight">
            Trip not found
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 font-bold uppercase px-4 py-2 border-4 border-black"
            style={{ backgroundColor: "#000000", color: "#ffffff" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f3f4f6" }}
      >
        <div
          className="border-8 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: "#f87171" }}
        >
          <p className="text-2xl font-black uppercase tracking-tight">
            {error}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 font-bold uppercase px-4 py-2 border-4 border-black"
            style={{ backgroundColor: "#000000", color: "#ffffff" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const expenseData = getExpenseData();
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      className="min-h-screen p-1 md:p-8"
      style={{ backgroundColor: "#f3f4f6" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8 gap-4">
          <div>
            <h1
              className="text-2xl md:text-5xl font-black uppercase tracking-tight border-b-4 border-black inline-block pb-2 px-2 sm:px-4 transform -rotate-1"
              style={{ backgroundColor: "#facc15" }}
            >
              Trip Details
            </h1>
            <p className="mt-3 font-bold uppercase text-xs sm:text-sm tracking-tight">
              {trip.Vehicle_Number} •{" "}
              <span className="break-words font-bold text-xs sm:text-sm">
                {trip.route}
              </span>
            </p>
          </div>

          
          <div className="flex gap-2 flex-wrap justify-end">
            <button
              onClick={() => navigate("/dashboard")}
              className="border-4 border-black px-3 sm:px-4 py-2 font-black uppercase text-xs sm:text-sm transition-colors cursor-pointer"
              style={{ backgroundColor: "#ffffff" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#facc15")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffffff")}
            >
              <span className="hidden sm:inline">← Back</span>
              <span className="sm:hidden">←</span>
            </button>

            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="border-4 border-black px-3 sm:px-4 py-2 font-black uppercase text-xs sm:text-sm transition-colors flex items-center gap-1 sm:gap-2 cursor-pointer"
              style={{ backgroundColor: "#60a5fa" }}
            >
              <Edit size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              onClick={downloadPDF}
              className="border-4 border-black px-3 sm:px-4 py-2 font-black uppercase text-xs sm:text-sm transition-colors flex items-center gap-1 sm:gap-2 cursor-pointer"
              style={{ backgroundColor: "#4ade80" }}
            >
              <Download size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="border-4 border-black px-3 sm:px-4 py-2 font-black uppercase text-xs sm:text-sm transition-colors flex items-center gap-1 sm:gap-2 cursor-pointer"
              style={{ backgroundColor: "#f87171" }}
            >
              <Trash2 size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        
        <div
          id="trip-details-container"
          style={{ backgroundColor: "#ffffff", padding: "2rem" }}
        >
          
          <div
            className="border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="border-b-4 border-black p-4"
              style={{ backgroundColor: "#facc15" }}
            >
              <h2 className="text-xl md:text-2xl font-black uppercase">
                📋 Basic Information
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#f9fafb" }}
              >
                <p
                  className="text-xs font-black uppercase mb-2"
                  style={{ color: "#4b5563" }}
                >
                  Vehicle Number
                </p>
                <p className="text-sm sm:text-2xl font-black">
                  {trip.Vehicle_Number}
                </p>
              </div>

              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#f9fafb" }}
              >
                <p
                  className="text-xs font-black uppercase mb-2"
                  style={{ color: "#4b5563" }}
                >
                  Route
                </p>
                <p className="text-sm sm:text-lg font-black break-words">
                  {trip.route}
                </p>
              </div>

              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#f9fafb" }}
              >
                <p
                  className="text-xs font-black uppercase mb-2"
                  style={{ color: "#4b5563" }}
                >
                  Month & Year
                </p>
                <p className="text-2xl font-black">{trip.monthAndYear}</p>
              </div>

              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#4ade80" }}
              >
                <p className="text-xs font-black uppercase mb-2">
                  Total Income
                </p>
                <p className="text-2xl font-black">
                  ₹{trip.totalIncome.toLocaleString("en-IN")}
                </p>
              </div>

              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#f87171" }}
              >
                <p className="text-xs font-black uppercase mb-2">
                  Total Expenses
                </p>
                <p className="text-2xl font-black">
                  ₹{totalExpenses.toLocaleString("en-IN")}
                </p>
              </div>

              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#facc15" }}
              >
                <p className="text-xs font-black uppercase mb-2">Net Profit</p>
                <p className="text-2xl font-black">
                  ₹{(trip.netProfit || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#fb923c" }}
              >
                <p className="text-xs font-black uppercase mb-2">
                  PhonePai Amount
                </p>
                <p className="text-2xl font-black">₹{(trip.phonePai || 0).toLocaleString("en-IN")}</p>
              </div>

              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#fb923c" }}
              >
                <p className="text-xs font-black uppercase mb-2">
                  Pending Amount
                </p>
                <p className="text-2xl font-black">
                  ₹{(trip.pendingAmount || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#f9fafb" }}
              >
                <p
                  className="text-xs font-black uppercase mb-2"
                  style={{ color: "#4b5563" }}
                >
                  Trip Date
                </p>
                <p className="text-lg font-black">
                  {new Date(trip.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#f9fafb" }}
              >
                <p
                  className="text-xs font-black uppercase mb-2"
                  style={{ color: "#4b5563" }}
                >
                  Commission Payment Date
                </p>
                <p className="text-lg font-black">
                  {new Date(trip.commissionPaymentDate).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          
          <div
            className="border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="border-b-4 border-black p-4"
              style={{ backgroundColor: "#f87171" }}
            >
              <h2 className="text-xl md:text-2xl font-black uppercase">
                💰 Expense Breakdown
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
             
              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#f9fafb" }}
              >
                <h3 className="font-black uppercase text-sm mb-4 text-center">
                  Expense Distribution
                </h3>
                {expenseData.length > 0 ? (
                  <>
                    <div className="w-full h-56 sm:h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ percent }) =>
                              `${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius="65%"
                            fill="#8884d8"
                            dataKey="value"
                            stroke="#000"
                            strokeWidth={2}
                            isAnimationActive={false}
                          >
                            {expenseData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) =>
                              `₹${value.toLocaleString("en-IN")}`
                            }
                            contentStyle={{
                              backgroundColor: "#ffffff",
                              border: "3px solid #000",
                              fontSize: "11px",
                              fontWeight: "bold",
                              padding: "6px 10px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {expenseData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 border-2 border-black flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs font-bold break-words">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p
                    className="text-center font-bold py-10"
                    style={{ color: "#6b7280" }}
                  >
                    No expenses recorded
                  </p>
                )}
              </div>

              

              <div className="space-y-2 sm:space-y-3">
                {trip.fuelCost > 0 && (
                  <div
                    className="border-4 border-black p-2 sm:p-3 flex justify-between items-center"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <span className="font-bold uppercase text-[10px] sm:text-sm">
                      Fuel Cost
                    </span>
                    <span className="font-black text-sm sm:text-lg">
                      ₹{trip.fuelCost.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {trip.driverAllowance?.paid > 0 && (
                  <div
                    className="border-4 border-black p-2 sm:p-3 flex justify-between items-center"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <span className="font-bold uppercase text-[10px] sm:text-sm">
                      Driver Payment
                    </span>
                    <span className="font-black text-sm sm:text-lg">
                      ₹{trip.driverAllowance.paid.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {trip.hamaali > 0 && (
                  <div
                    className="border-4 border-black p-2 sm:p-3 flex justify-between items-center"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <span className="font-bold uppercase text-[10px] sm:text-sm">
                      Hamaali
                    </span>
                    <span className="font-black text-sm sm:text-lg">
                      ₹{trip.hamaali.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {trip.paidTransport > 0 && (
                  <div
                    className="border-4 border-black p-2 sm:p-3 flex justify-between items-center"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <span className="font-bold uppercase text-[10px] sm:text-sm">
                      Paid Transport
                    </span>
                    <span className="font-black text-sm sm:text-lg">
                      ₹{trip.paidTransport.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {trip.maintenanceCost > 0 && (
                  <div
                    className="border-4 border-black p-2 sm:p-3 flex justify-between items-center"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <span className="font-bold uppercase text-[10px] sm:text-sm">
                      Maintenance
                    </span>
                    <span className="font-black text-sm sm:text-lg">
                      ₹{trip.maintenanceCost.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {trip.commission > 0 && (
                  <div
                    className="border-4 border-black p-2 sm:p-3 flex justify-between items-center"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <span className="font-bold uppercase text-[10px] sm:text-sm">
                      Commission
                    </span>
                    <span className="font-black text-sm sm:text-lg">
                      ₹{trip.commission.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {trip.otherExpenses > 0 && (
                  <div
                    className="border-4 border-black p-2 sm:p-3 flex justify-between items-center"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <span className="font-bold uppercase text-[10px] sm:text-sm">
                      Other Expenses
                    </span>
                    <span className="font-black text-sm sm:text-lg">
                      ₹{trip.otherExpenses.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div
                  className="border-4 border-black p-2 sm:p-3 flex justify-between items-center"
                  style={{ backgroundColor: "#000000", color: "#facc15" }}
                >
                  <span className="font-black uppercase text-xs sm:text-sm">
                    Total Expenses
                  </span>
                  <span className="font-black text-base sm:text-xl">
                    ₹{totalExpenses.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          
          <div
            className="border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="border-b-4 border-black p-4"
              style={{ backgroundColor: "#4ade80" }}
            >
              <h2 className="text-xl md:text-2xl font-black uppercase">
                👨‍✈️ Driver Allowance
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#f9fafb" }}
              >
                <p
                  className="text-xs font-black uppercase mb-2"
                  style={{ color: "#4b5563" }}
                >
                  Total Salary
                </p>
                <p className="text-2xl font-black">
                  ₹
                  {(trip.driverAllowance?.totalSalary || 0).toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#f9fafb" }}
              >
                <p
                  className="text-xs font-black uppercase mb-2"
                  style={{ color: "#4b5563" }}
                >
                  Bonus
                </p>
                <p className="text-2xl font-black">
                  ₹{(trip.driverAllowance?.bonus || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#4ade80" }}
              >
                <p className="text-xs font-black uppercase mb-2">Paid</p>
                <p className="text-2xl font-black">
                  ₹{(trip.driverAllowance?.paid || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div
                className="border-4 border-black p-4"
                style={{ backgroundColor: "#fb923c" }}
              >
                <p className="text-xs font-black uppercase mb-2">Remaining</p>
                <p className="text-2xl font-black">
                  ₹
                  {(
                    (trip.driverAllowance?.totalSalary || 0) +
                    (trip.driverAllowance?.bonus || 0) -
                    (trip.driverAllowance?.paid || 0)
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="border-b-4 border-black p-4"
              style={{ backgroundColor: "#f87171" }}
            >
              <h3 className="text-xl font-black uppercase">
                ⚠️ Confirm Delete
              </h3>
            </div>

            <div className="p-6">
              <p className="font-bold text-lg mb-4">
                Are you sure you want to delete this trip?
              </p>
              <p
                className="font-bold text-sm mb-2"
                style={{ color: "#4b5563" }}
              >
                Vehicle: {trip.Vehicle_Number}
              </p>
              <p
                className="font-bold text-sm mb-6"
                style={{ color: "#4b5563" }}
              >
                Route: {trip.route}
              </p>
              <p
                className="font-black uppercase text-sm"
                style={{ color: "#dc2626" }}
              >
                This action cannot be undone!
              </p>
            </div>

            <div className="border-t-4 border-black p-4 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border-4 border-black px-4 py-3 font-black uppercase transition-colors"
                style={{ backgroundColor: "#ffffff" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#facc15")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#ffffff")
                }
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 border-4 border-black px-4 py-3 font-black uppercase transition-colors"
                style={{ backgroundColor: "#f87171" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default View;
