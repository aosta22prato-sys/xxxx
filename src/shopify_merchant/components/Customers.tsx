import React, { useState } from "react";
import { Customer } from "../types";
import { Users, Search, GraduationCap, Phone, Sparkles, Filter, Mail, Calendar, Coins } from "lucide-react";

interface CustomersProps {
  customers: Customer[];
}

export default function Customers({ customers }: CustomersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSegment, setActiveSegment] = useState("all");

  const segments = [
    { key: "all", label: "全部客户 (All)" },
    { key: "High-Spenders", label: "高消费群 (High-Spenders)" },
    { key: "Repeat Customers", label: "高复购群 (Repeat Customers)" },
    { key: "Electronics buyers", label: "数码电子兴趣组" },
    { key: "Unconverted Leads", label: "零消费新注册" }
  ];

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.phone.includes(searchTerm);
    const matchesSegment = activeSegment === "all" || c.segments.includes(activeSegment);
    return matchesSearch && matchesSegment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">👥 客户中心 (CRM & Customers)</h2>
        <p className="text-xs text-gray-500 mt-1">Audit high value accounts, slice retention marketing cohorts, and query customer history metrics.</p>
      </div>

      {/* Segments horizontal scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider shrink-0 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          CRM 细分客群 (Segments):
        </span>
        {segments.map(seg => (
          <button
            key={seg.key}
            onClick={() => setActiveSegment(seg.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
              activeSegment === seg.key
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-150"
            }`}
          >
            {seg.label}
          </button>
        ))}
      </div>

      {/* Search CRM and total records count */}
      <div className="bg-white border border-gray-150 p-4 rounded-xl flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search CRM by name, phone digits, or customer email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-indigo-500"
          />
        </div>
      </div>

      {/* Customer profiles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map(cust => (
            <div key={cust.id} className="bg-white border border-gray-150 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between hover:border-indigo-200 transition-all">
              
              {/* Profile Card body */}
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={cust.avatar}
                    alt={cust.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                  />
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{cust.name}</h4>
                    <span className="text-[10px] text-gray-400 font-mono block">{cust.id}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {cust.labels.map((lab, idx) => (
                        <span key={idx} className="text-[8px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded">
                          {lab}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span className="font-mono truncate">{cust.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span className="font-mono">{cust.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span>Registered: {cust.dateJoined}</span>
                  </div>
                </div>

                {cust.notes && (
                  <div className="p-2.5 bg-gray-50 border border-gray-100 rounded text-[11px] text-gray-600">
                    <span className="font-bold text-gray-700">Internal memo:</span> {cust.notes}
                  </div>
                )}
              </div>

              {/* LTV aggregate footer strip */}
              <div className="bg-gray-50/70 border-t border-gray-100 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[9px] text-gray-400 font-semibold uppercase block">Gross Paid</span>
                    <span className="text-xs font-bold text-gray-900">€{cust.totalSpent.toFixed(2)}</span>
                  </div>
                  <div className="border-l border-gray-200 pl-4">
                    <span className="text-[9px] text-gray-400 font-semibold block uppercase">Orders count</span>
                    <span className="text-xs font-semibold text-gray-700">{cust.ordersCount} transactions</span>
                  </div>
                </div>

                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  cust.consentMarketing ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-gray-150 text-gray-500"
                }`}>
                  {cust.consentMarketing ? "EMAIL OPT-IN" : "NO SMS LINK"}
                </span>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full bg-white border border-gray-150 p-12 text-center rounded-xl text-gray-400 text-xs">
            <Users className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            No accounts matched chosen segment cohorts or words.
          </div>
        )}
      </div>

    </div>
  );
}
