import React, { useState } from "react";
import { Order, Product, DiscountCode } from "../types";
import { ShoppingBasket, Truck, ArrowLeftRight, Clock, Plus, Filter, Search, ChevronRight, UserPlus, CheckCircle2, Ticket } from "lucide-react";

interface SalesProps {
  orders: Order[];
  products: Product[];
  discountCodes: DiscountCode[];
  onOrderChange: () => void;
}

export default function Sales({ orders, products, discountCodes, onOrderChange }: SalesProps) {
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Ship tracking code input
  const [trackingCode, setTrackingCode] = useState("");
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null);

  // New order simulation state
  const [showCheckoutSim, setShowCheckoutSim] = useState(false);
  const [checkoutCustName, setCheckoutCustName] = useState("Gianni Vercelli");
  const [checkoutEmail, setCheckoutEmail] = useState("gianni@vercelli.it");
  const [checkoutProdId, setCheckoutProdId] = useState("");
  const [checkoutQty, setCheckoutQty] = useState(1);
  const [checkoutCode, setCheckoutCode] = useState("");
  const [checkoutNotes, setCheckoutNotes] = useState("Ship ASAP please");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPayment === "all" || o.paymentStatus === filterPayment || o.shippingStatus === filterPayment;
    return matchesSearch && matchesFilter;
  });

  // Handle ship
  const handleShip = async (orderId: string) => {
    try {
      const res = await fetch("/api/orders/ship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, trackingNumber: trackingCode })
      });
      const data = await res.json();
      if (data.success) {
        onOrderChange();
        setShippingOrderId(null);
        setTrackingCode("");
        // Sync selected overlay if open
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, shippingStatus: "shipped", trackingNumber: trackingCode || "Automatic system generated" });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Refund
  const handleRefund = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to refund this order? This will restore inventory stocks!")) return;
    try {
      const res = await fetch("/api/orders/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      if (data.success) {
        onOrderChange();
        // Sync selected overlay
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, paymentStatus: "refunded" });
        }
        alert("Refund successfully applied to ERP ledger! Stock back in inventory.");
      } else {
        alert(data.message || "Could not execute refund");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit checkout simulation
  const handlePerformCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutProdId) {
      alert("Please select a product");
      return;
    }
    setSubmittingOrder(true);
    setSuccessMessage("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: checkoutCustName,
          email: checkoutEmail,
          items: [{ productId: checkoutProdId, quantity: checkoutQty }],
          notes: checkoutNotes,
          discountCode: checkoutCode
        })
      });
      const data = await res.json();
      if (data.success) {
        onOrderChange();
        setSuccessMessage(`Order ${data.order.orderNumber} successfully ingested into the warehouse catalog!`);
        // reset form
        setCheckoutCode("");
        setCheckoutNotes("");
        setCheckoutQty(1);
      } else {
        alert(data.message || "Inventory stock limit reached!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action grid */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">🛒 销售中心 (Sales Order Hub)</h2>
          <p className="text-xs text-gray-500 mt-1">Manage physical shipments, trigger instant buyer refunds, or simulate new shop purchasing flows.</p>
        </div>
        
        <button
          onClick={() => {
            setShowCheckoutSim(!showCheckoutSim);
            setSuccessMessage("");
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 self-end md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {showCheckoutSim ? "隐藏下单模拟" : "模拟顾客自主下单 (B2C Checkout)"}
        </button>
      </div>

      {/* Checkout simulator section */}
      {showCheckoutSim && (
        <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border border-indigo-100 rounded-xl p-6 shadow-xs animate-fade-in">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-3 mb-4">
            <h3 className="text-sm font-semibold text-indigo-950 flex items-center gap-2">
              <ShoppingBasket className="w-4 h-4 text-indigo-600" />
              SaaS Store Checkout Sandbox Simulator (顾客自助结账体验)
            </h3>
            <span className="text-[10px] text-indigo-600 font-bold bg-white border border-indigo-200 px-2.5 py-1 rounded">FAST SANDBOX CHECKOUT</span>
          </div>

          {successMessage && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-lg text-xs font-medium mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handlePerformCheckout} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700">Buyer Full Name</label>
              <input
                type="text"
                value={checkoutCustName}
                onChange={e => setCheckoutCustName(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-gray-250 rounded focus:outline-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700">Buyer Email Address</label>
              <input
                type="email"
                value={checkoutEmail}
                onChange={e => setCheckoutEmail(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-gray-250 rounded focus:outline-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700">Product Catalogue Selection</label>
              <select
                value={checkoutProdId}
                onChange={e => setCheckoutProdId(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-gray-250 rounded focus:outline-indigo-500"
                required
              >
                <option value="">-- Choose item --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                    {p.name} - €{p.price} (Stock: {p.stock}) {p.stock <= 0 ? "[OUT OF STOCK]" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700">Quantity Selection</label>
              <input
                type="number"
                min="1"
                max="20"
                value={checkoutQty}
                onChange={e => setCheckoutQty(parseInt(e.target.value) || 1)}
                className="w-full text-xs p-2 bg-white border border-gray-250 rounded focus:outline-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                Apply Promo Code
                <Ticket className="w-3 h-3 text-indigo-500" />
              </label>
              <input
                type="text"
                placeholder="e.g. WELCOME10"
                value={checkoutCode}
                onChange={e => setCheckoutCode(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-gray-250 rounded focus:outline-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700">Order Delivery Notes</label>
              <input
                type="text"
                placeholder="Special instruction..."
                value={checkoutNotes}
                onChange={e => setCheckoutNotes(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-gray-250 rounded focus:outline-indigo-500"
              />
            </div>

            <div className="md:col-span-3 pt-2 text-right">
              <button
                type="submit"
                disabled={submittingOrder}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {submittingOrder ? "Ingesting order..." : "Verify & Confirm Checkout (SaaS Payment Charged)"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Orders filter and search bar */}
      <div className="bg-white border border-gray-150 p-4 rounded-xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, or email address..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Filter className="w-3.5 h-3.5 text-gray-500" />
          <select
            value={filterPayment}
            onChange={e => setFilterPayment(e.target.value)}
            className="text-xs py-2 bg-gray-50 border border-gray-200 rounded px-3 cursor-pointer"
          >
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="refunded">Refunded</option>
            <option value="pending">Shipping: Pending</option>
            <option value="shipped">Shipping: Shipped</option>
            <option value="delivered">Shipping: Delivered</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table list */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-150 overflow-hidden shadow-xs">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
            <span>SaaS Direct Orders List</span>
            <span>{filteredOrders.length} records found</span>
          </div>

          <div className="divide-y divide-gray-100 max-h-160 overflow-y-auto">
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  onClick={() => {
                    setSelectedOrder(order);
                    setShippingOrderId(null);
                  }}
                  className={`p-4 flex items-center justify-between hover:bg-gray-50/70 transition-colors cursor-pointer ${
                    selectedOrder?.id === order.id ? "bg-indigo-50/50" : ""
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">{order.orderNumber}</span>
                      <span className="text-[10px] text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs font-semibold text-gray-700">{order.customerName}</div>
                    <div className="text-[10px] text-gray-500 font-mono truncate">{order.email}</div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-sm font-bold text-gray-900">€{order.totalAmount.toFixed(2)}</div>
                      <div className="flex gap-1.5 mt-1">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          order.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-700" :
                          order.paymentStatus === "refunded" ? "bg-rose-50 text-rose-700" :
                          "bg-amber-50 text-amber-700"
                        }`}>
                          {order.paymentStatus.toUpperCase()}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          order.shippingStatus === "shipped" ? "bg-indigo-50 text-indigo-700" :
                          order.shippingStatus === "delivered" ? "bg-teal-50 text-teal-700" :
                          "bg-amber-50 text-amber-700"
                        }`}>
                          {order.shippingStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-gray-400">
                No orders match search parameters.
              </div>
            )}
          </div>
        </div>

        {/* Selected Overlay detail */}
        <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-xs h-fit space-y-5">
          {selectedOrder ? (
            <>
              <div className="border-b border-gray-100 pb-3">
                <div className="flex justify-between items-center text-xs font-bold text-indigo-600 block">
                  <span>METRICS OVERVIEW</span>
                  <span>{selectedOrder.orderNumber}</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mt-1">{selectedOrder.customerName}</h4>
                <div className="text-[11px] text-gray-500 font-mono mt-0.5">{selectedOrder.email}</div>
              </div>

              {/* Items in order */}
              <div className="space-y-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Line Purchases</span>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                  {selectedOrder.items.map((it, index) => (
                    <div key={index} className="flex justify-between items-start text-xs border-b border-gray-100/50 pb-1 last:border-b-0 last:pb-0">
                      <div>
                        <span className="font-semibold text-gray-800">{it.name}</span>
                        <div className="text-[9px] text-gray-400">SKU: {it.sku}</div>
                      </div>
                      <div className="text-right">
                        <div>€{it.price} x {it.quantity}</div>
                        <div className="font-semibold text-gray-900">€{(it.price * it.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* General state tags */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase block">Order value</span>
                  <span className="font-bold text-gray-900">€{selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase block">Discount Applied</span>
                  <span className="font-semibold text-amber-700">{selectedOrder.discountCode || "No code"}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase block">Payment method</span>
                  <span className="font-medium text-gray-700">Digital checkout</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase block">Tracking No.</span>
                  <span className="font-mono font-medium text-indigo-700">{selectedOrder.trackingNumber || "None"}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-2.5 bg-amber-50/50 border border-amber-100 rounded text-[11px] text-amber-900">
                  <span className="font-bold">Merchant Note:</span> {selectedOrder.notes}
                </div>
              )}

              {/* Quick operations */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Admin actions</span>
                
                {selectedOrder.shippingStatus === "pending" && (
                  <>
                    {shippingOrderId === selectedOrder.id ? (
                      <div className="space-y-2 bg-indigo-50/50 border border-indigo-100 p-3 rounded">
                        <label className="text-[10px] font-bold text-indigo-900">Courier Tracking Code</label>
                        <input
                          type="text"
                          placeholder="e.g. DHL-TRACK-928"
                          value={trackingCode}
                          onChange={e => setTrackingCode(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-gray-300 rounded focus:outline-indigo-500"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setShippingOrderId(null)}
                            className="text-[10px] font-bold text-gray-500 px-2 py-1 hover:bg-gray-200 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleShip(selectedOrder.id)}
                            className="text-[10px] font-bold text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded"
                          >
                            Submit Shipment
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setShippingOrderId(selectedOrder.id);
                          setTrackingCode("");
                        }}
                        className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" /> Dispatch physical shipment
                      </button>
                    )}
                  </>
                )}

                {selectedOrder.paymentStatus !== "refunded" && (
                  <button
                    onClick={() => handleRefund(selectedOrder.id)}
                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" /> Issue Instant Refunding
                  </button>
                )}

                <div className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-gray-300" />
                  <span>Placed: {new Date(selectedOrder.date).toLocaleString()}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center text-xs text-gray-400">
              <ShoppingBasket className="w-8 h-8 text-gray-200 mb-2" />
              <span>Select an order from the master list to verify, dispatch tracking, or refund ledger entry.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
