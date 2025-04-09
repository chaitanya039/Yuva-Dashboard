// src/components/Reports.jsx

import React, { useState, useMemo } from "react";
import api from "../api/axiosInstance";
import {
  FaFileInvoice,
  FaMoneyBillWave,
  FaChartLine,
  FaRegCalendarAlt,
  FaPercentage,
  FaChartPie,
  FaClock,
  FaExclamationTriangle,
  FaReceipt,
  FaFileExcel,
  FaFilePdf,
  FaFileCsv,
  FaSearch,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// Utility to trigger download
const downloadBlob = (data, filename, type) => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const REPORTS = [
  {
    id: "orders",
    title: "Orders Export",
    category: "Exports",
    icon: FaFileInvoice,
    endpoint: "/reports/orders/export",
    formats: ["excel"],
  },
  {
    id: "expenses",
    title: "Expenses Export",
    category: "Exports",
    icon: FaMoneyBillWave,
    endpoint: "/reports/expenses/export",
    formats: ["excel"],
  },
  {
    id: "top-selling",
    title: "Top Selling Products",
    category: "Exports",
    icon: FaChartLine,
    endpoint: "/reports/top-selling-products",
    formats: ["csv"],
  },
  {
    id: "monthly-revenue",
    title: "Monthly Revenue",
    category: "Analytics",
    icon: FaRegCalendarAlt,
    endpoint: "/reports/monthly-revenue",
    formats: ["excel", "pdf"],
    needsDate: true,
  },
  {
    id: "discount-impact",
    title: "Discount Impact",
    category: "Analytics",
    icon: FaPercentage,
    endpoint: "/reports/discount-impact",
    formats: ["excel", "pdf"],
  },
  {
    id: "revenue-segment",
    title: "Revenue by Segment",
    category: "Analytics",
    icon: FaChartPie,
    endpoint: "/reports/revenue-by-segment",
    formats: ["excel", "pdf"],
  },
  {
    id: "ar-aging",
    title: "AR Aging Report",
    category: "Analytics",
    icon: FaClock,
    endpoint: "/reports/ar-aging",
    formats: ["excel", "pdf"],
  },
  {
    id: "outstanding-invoices",
    title: "Outstanding Invoices",
    category: "Analytics",
    icon: FaExclamationTriangle,
    endpoint: "/reports/outstanding-invoices",
    formats: ["excel", "pdf"],
  },
  {
    id: "dso",
    title: "DSO Report",
    category: "Analytics",
    icon: FaReceipt,
    endpoint: "/reports/dso",
    formats: ["excel", "pdf"],
  },
];

const Reports = () => {
  const [tab, setTab] = useState("Exports");
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [dates, setDates] = useState({ startDate: "", endDate: "" });

  const filtered = useMemo(
    () =>
      REPORTS.filter((r) => r.category === tab).filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
      ),
    [tab, search]
  );

  const handleDownload = async (report, format) => {
    try {
      setLoadingId(`${report.id}-${format}`);
      let url = report.endpoint;
      if (format !== "excel" || report.formats.includes(format)) {
        url += `?export=${format}`;
      }
      if (report.needsDate) {
        if (dates.startDate) url += `&startDate=${dates.startDate}`;
        if (dates.endDate) url += `&endDate=${dates.endDate}`;
      }
      const res = await api.get(url, { responseType: "blob" });
      const { mime, ext } = {
        excel: {
          mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ext: "xlsx",
        },
        pdf: { mime: "application/pdf", ext: "pdf" },
        csv: { mime: "text/csv", ext: "csv" },
      }[format];
      downloadBlob(res.data, `${report.id}.${ext}`, mime);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-sm text-gray-400">
          <Link to={"/"}>Dashboard</Link> {">"}{" "}
          <span className="text-gray-600 font-medium">Reports</span>
          <h2 className="text-2xl font-bold text-gray-800">
            Reports
          </h2>
        </div>
        <div className="flex space-x-2">
          {["Exports", "Analytics"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm rounded-full font-medium transition ${
                tab === t
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <FaSearch className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
      </div>

      {/* Date Range */}
      {tab === "Analytics" && filtered.some((r) => r.needsDate) && (
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex flex-col text-sm">
            From
            <input
              type="date"
              value={dates.startDate}
              onChange={(e) =>
                setDates((d) => ({ ...d, startDate: e.target.value }))
              }
              className="mt-1 p-2 border rounded-md"
            />
          </label>
          <label className="flex flex-col text-sm">
            To
            <input
              type="date"
              value={dates.endDate}
              onChange={(e) =>
                setDates((d) => ({ ...d, endDate: e.target.value }))
              }
              className="mt-1 p-2 border rounded-md"
            />
          </label>
        </div>
      )}

      {/* Report List */}
      <ul className="space-y-4">
        {filtered.map((r) => {
          const Icon = r.icon;
          return (
            <li
              key={r.id}
              className="flex text-sm items-center justify-between p-4 bg-white rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <Icon className="w-8 h-8 text-blue-500" />
                <span className="text-gray-800 font-medium">{r.title}</span>
              </div>
              <div className="flex gap-2">
                {r.formats.includes("excel") && (
                  <button
                    onClick={() => handleDownload(r, "excel")}
                    disabled={loadingId === `${r.id}-excel`}
                    className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm disabled:opacity-50 transition"
                  >
                    <FaFileExcel className="w-3 h-3" />
                    {loadingId === `${r.id}-excel` ? "..." : "Excel"}
                  </button>
                )}
                {r.formats.includes("pdf") && (
                  <button
                    onClick={() => handleDownload(r, "pdf")}
                    disabled={loadingId === `${r.id}-pdf`}
                    className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm disabled:opacity-50 transition"
                  >
                    <FaFilePdf className="w-3 h-3" />
                    {loadingId === `${r.id}-pdf` ? "..." : "PDF"}
                  </button>
                )}
                {r.formats.includes("csv") && (
                  <button
                    onClick={() => handleDownload(r, "csv")}
                    disabled={loadingId === `${r.id}-csv`}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full text-sm disabled:opacity-50 transition"
                  >
                    <FaFileCsv className="w-3 h-3" />
                    {loadingId === `${r.id}-csv` ? "..." : "CSV"}
                  </button>
                )}
              </div>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="text-center text-gray-500 py-6">No reports found.</li>
        )}
      </ul>
    </div>
  );
};

export default Reports;
