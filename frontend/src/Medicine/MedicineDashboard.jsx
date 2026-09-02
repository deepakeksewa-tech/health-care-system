import React, { useState, useMemo } from 'react';
import {
  Package,
  AlertTriangle,
  XCircle,
  Search,
  ShoppingBag,
  Activity,
  Plus,
  Clock,
  CheckCircle,
  Truck,
  FileText,
  MapPin,
  Phone,
  Check,
  X,
  IndianRupee,
  Receipt,
  Send,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Edit3
} from 'lucide-react';

const MedicineDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' ya 'products'
  const [search, setSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('All');

  // Modals state
  const [billingModalOrder, setBillingModalOrder] = useState(null);
  const [viewImageModal, setViewImageModal] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Pagination for Products
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Manual Billing Dynamic Items State
  const [manualBillItems, setManualBillItems] = useState([]);
  const [billDeliveryFee, setBillDeliveryFee] = useState(30);
  const [billDiscount, setBillDiscount] = useState(0);

  // Add Product Form State
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Antibiotics',
    qty: '',
    price: '',
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. INVENTORY STATE
  const [products, setProducts] = useState([
    { id: '#PRD101', name: 'Nullacin 500mg', category: 'Antibiotics', qty: 120, price: 180, status: 'In stock' },
    { id: '#PRD102', name: 'Medicanox Syrup 100ml', category: 'Respiratory', qty: 0, price: 140, status: 'Out Of stock' },
    { id: '#PRD103', name: 'Theralief Pain Gel', category: 'Pain Relievers', qty: 22, price: 220, status: 'Low stock' },
    { id: '#PRD104', name: 'CP-0004 Multivitamin', category: 'Vitamins', qty: 85, price: 350, status: 'In stock' },
    { id: '#PRD105', name: 'Amoxicillin Duo 200mg', category: 'Antibiotics', qty: 14, price: 290, status: 'Low stock' },
    { id: '#PRD106', name: 'Paracetamol 650mg', category: 'Pain Relievers', qty: 200, price: 35, status: 'In stock' },
    { id: '#PRD107', name: 'Cetirizine 10mg', category: 'Allergy', qty: 90, price: 45, status: 'In stock' },
    { id: '#PRD108', name: 'Azithromycin 500mg', category: 'Antibiotics', qty: 40, price: 120, status: 'In stock' },
  ]);

  // 2. CUSTOMER ORDERS (Both Direct & Prescription/Image Uploads)
  const [customerOrders, setCustomerOrders] = useState([
    {
      orderId: '#ORD-9841',
      customerName: 'Rahul Sharma',
      phone: '+91 98765-43210',
      address: 'House 42, Green Avenue, Amritsar',
      type: 'prescription_upload', // Requires manual pricing
      uploadedImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
      prescriptionText: 'Dr. Verma Rx: 1 Strip Nullacin + 1 Theralief Gel',
      items: [
        { name: 'Nullacin 500mg', qty: 1, unitPrice: 0 },
        { name: 'Theralief Gel', qty: 1, unitPrice: 0 }
      ],
      bill: null,
      status: 'Needs Pricing',
      time: '5 mins ago'
    },
    {
      orderId: '#ORD-9840',
      customerName: 'Priya Verma',
      phone: '+91 98111-22334',
      address: 'Flat 302, Palm Heights, Delhi',
      type: 'direct_order', // Already priced
      uploadedImage: null,
      items: [
        { name: 'CP-0004 Multivitamin', qty: 1, unitPrice: 350 }
      ],
      bill: {
        subtotal: 350,
        discount: 0,
        deliveryFee: 30,
        finalTotal: 380,
        billNo: 'INV-2026-9840'
      },
      status: 'Bill Sent (Waiting Payment)',
      time: '40 mins ago'
    },
    {
      orderId: '#ORD-9839',
      customerName: 'Amit Patel',
      phone: '+91 99887-76655',
      address: 'Shop 12, Main Bazaar, Jalandhar',
      type: 'direct_order',
      uploadedImage: null,
      items: [
        { name: 'Amoxicillin Duo 200mg', qty: 2, unitPrice: 290 }
      ],
      bill: {
        subtotal: 580,
        discount: 30,
        deliveryFee: 30,
        finalTotal: 580,
        billNo: 'INV-2026-9839'
      },
      status: 'Out for Delivery',
      time: '2 hrs ago'
    }
  ]);

  // Open Billing Modal & Pre-fill items
  const handleOpenBillingModal = (order) => {
    setBillingModalOrder(order);
    setManualBillItems(
      order.items.map((it) => ({
        name: it.name,
        qty: it.qty || 1,
        unitPrice: it.unitPrice || ''
      }))
    );
    setBillDiscount(0);
    setBillDeliveryFee(30);
  };

  // Add Item inside Billing Modal
  const handleAddManualItem = () => {
    setManualBillItems([...manualBillItems, { name: '', qty: 1, unitPrice: '' }]);
  };

  // Remove Item inside Billing Modal
  const handleRemoveManualItem = (index) => {
    setManualBillItems(manualBillItems.filter((_, idx) => idx !== index));
  };

  // Update item field inside Billing Modal
  const handleItemFieldChange = (index, field, value) => {
    const updated = [...manualBillItems];
    updated[index][field] = value;
    setManualBillItems(updated);
  };

  // Calculated Bill Total
  const calculatedTotal = useMemo(() => {
    const subtotal = manualBillItems.reduce((acc, it) => {
      const q = Number(it.qty) || 0;
      const p = Number(it.unitPrice) || 0;
      return acc + q * p;
    }, 0);
    const discountAmt = (subtotal * Number(billDiscount || 0)) / 100;
    const finalTotal = Math.max(0, subtotal - discountAmt + Number(billDeliveryFee || 0));
    return { subtotal, discountAmt, finalTotal: Math.round(finalTotal) };
  }, [manualBillItems, billDiscount, billDeliveryFee]);

  // Submit Bill and Send to Customer
  const handleSendBillToCustomer = (e) => {
    e.preventDefault();
    if (!billingModalOrder) return;

    if (manualBillItems.some((it) => !it.name || !it.unitPrice)) {
      alert('Please fill Medicine name and Unit Price for all items.');
      return;
    }

    const newBill = {
      billNo: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      subtotal: calculatedTotal.subtotal,
      discount: calculatedTotal.discountAmt,
      deliveryFee: Number(billDeliveryFee),
      finalTotal: calculatedTotal.finalTotal,
      items: manualBillItems.map((it) => ({ ...it, qty: Number(it.qty), unitPrice: Number(it.unitPrice) }))
    };

    setCustomerOrders(
      customerOrders.map((ord) =>
        ord.orderId === billingModalOrder.orderId
          ? {
              ...ord,
              items: newBill.items,
              bill: newBill,
              status: 'Bill Sent (Waiting Payment)'
            }
          : ord
      )
    );

    triggerToast(`Bill of ₹${calculatedTotal.finalTotal} & Payment Request sent to ${billingModalOrder.customerName}!`);
    setBillingModalOrder(null);
  };

  // Order Lifecycle Status Updater
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setCustomerOrders(
      customerOrders.map((ord) => (ord.orderId === orderId ? { ...ord, status: newStatus } : ord))
    );
    triggerToast(`Order ${orderId} updated to: ${newStatus}`);
  };

  // Add Product to Inventory
  const handleAddNewProduct = (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.qty || !newProductForm.price) return;

    const qtyNum = Number(newProductForm.qty);
    const newProd = {
      id: `#PRD${Math.floor(100 + Math.random() * 900)}`,
      name: newProductForm.name,
      category: newProductForm.category,
      qty: qtyNum,
      price: Number(newProductForm.price),
      status: qtyNum > 20 ? 'In stock' : qtyNum > 0 ? 'Low stock' : 'Out Of stock'
    };

    setProducts([newProd, ...products]);
    setIsAddProductOpen(false);
    setNewProductForm({ name: '', category: 'Antibiotics', qty: '', price: '' });
    triggerToast(`"${newProd.name}" added to inventory!`);
  };

  // Delete Product
  const handleDeleteProduct = (id) => {
    if (window.confirm('Delete this product from inventory?')) {
      setProducts(products.filter((p) => p.id !== id));
      triggerToast('Product deleted from inventory.');
    }
  };

  // Products Filtering and Pagination Logic
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredProducts.slice(start, start + rowsPerPage);
  }, [filteredProducts, currentPage, rowsPerPage]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return customerOrders.filter((o) => {
      const matchSearch =
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.orderId.toLowerCase().includes(search.toLowerCase()) ||
        o.phone.includes(search);
      const matchStatus = orderFilter === 'All' || o.status.includes(orderFilter);
      return matchSearch && matchStatus;
    });
  }, [customerOrders, search, orderFilter]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-16">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-teal-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 z-50 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Navigation Tabs */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => { setActiveTab('orders'); setSearch(''); }} 
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-xs">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="font-extrabold text-xl tracking-tight leading-none">
                <span className="text-teal-800">MED</span>
                <span className="text-slate-600 font-light">SEWA</span>
              </div>
            </div>

            {/* Segmented Control Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
              <button
                onClick={() => { setActiveTab('orders'); setSearch(''); }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-teal-700'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Customer Orders</span>
                {customerOrders.filter((o) => o.status === 'Needs Pricing').length > 0 && (
                  <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {customerOrders.filter((o) => o.status === 'Needs Pricing').length} Action
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveTab('products'); setSearch(''); }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'products'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-teal-700'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Product Catalog</span>
                <span className="text-slate-400 text-[10px]">({products.length})</span>
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-52 sm:w-64">
            <input
              type="text"
              placeholder={activeTab === 'orders' ? 'Search customer, order #...' : 'Search medicine, category...'}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-teal-700"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

        </div>
      </header>

      {/* 2. MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">

        {/* ============================================================ */}
        {/* VIEW 1: CUSTOMER ORDERS & PRESCRIPTION BILLING FLOW          */}
        {/* ============================================================ */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Top Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Needs Pricing / Rx</span>
                  <h3 className="text-xl font-bold text-amber-600 mt-0.5">
                    {customerOrders.filter((o) => o.status === 'Needs Pricing').length} Orders
                  </h3>
                </div>
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><Clock className="w-5 h-5" /></div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Bill Dispatched</span>
                  <h3 className="text-xl font-bold text-blue-600 mt-0.5">
                    {customerOrders.filter((o) => o.status.includes('Bill Sent')).length} Invoices
                  </h3>
                </div>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><Receipt className="w-5 h-5" /></div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">In Dispatch</span>
                  <h3 className="text-xl font-bold text-purple-600 mt-0.5">
                    {customerOrders.filter((o) => o.status === 'Out for Delivery').length} Orders
                  </h3>
                </div>
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg"><Truck className="w-5 h-5" /></div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Delivered</span>
                  <h3 className="text-xl font-bold text-emerald-700 mt-0.5">
                    {customerOrders.filter((o) => o.status === 'Delivered').length} Completed
                  </h3>
                </div>
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg"><CheckCircle className="w-5 h-5" /></div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Needs Pricing', 'Bill Sent', 'Out for Delivery', 'Delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    orderFilter === st
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-teal-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900">{order.orderId}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{order.time}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mt-1">{order.customerName}</h4>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          order.status === 'Needs Pricing'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : order.status.includes('Bill Sent')
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : order.status === 'Out for Delivery'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Customer Contact */}
                    <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span>{order.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span className="truncate">{order.address}</span>
                      </div>
                    </div>

                    {/* Uploaded Prescription / Image Preview Box */}
                    {order.uploadedImage && (
                      <div className="border border-amber-200 bg-amber-50/50 p-3 rounded-xl flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={order.uploadedImage}
                            alt="Prescription"
                            className="w-10 h-10 object-cover rounded-lg border border-amber-300 cursor-pointer"
                            onClick={() => setViewImageModal(order.uploadedImage)}
                          />
                          <div>
                            <span className="font-bold text-amber-900 block">Uploaded Prescription / Image</span>
                            <span className="text-[11px] text-amber-700">{order.prescriptionText}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setViewImageModal(order.uploadedImage)}
                          className="px-2.5 py-1 bg-white border border-amber-300 text-amber-800 rounded-lg text-xs font-bold hover:bg-amber-100"
                        >
                          View Image
                        </button>
                      </div>
                    )}

                    {/* Ordered Medicines Breakdown */}
                    <div className="space-y-1 text-xs">
                      <span className="font-semibold text-slate-500 text-[11px]">Medicines Summary:</span>
                      <div className="border border-slate-100 rounded-xl p-2.5 bg-slate-50/50 divide-y divide-slate-100">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between py-1 first:pt-0 last:pb-0">
                            <span>
                              {it.name || 'Custom item'} <strong className="text-slate-800">× {it.qty}</strong>
                            </span>
                            <span className="font-bold text-slate-900">
                              {it.unitPrice ? `₹${it.qty * it.unitPrice}` : 'Price not set'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Footer & Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <div>
                      {order.bill ? (
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-medium">{order.bill.billNo}</span>
                          <span className="text-base font-black text-slate-900">₹{order.bill.finalTotal}</span>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-bold">Bill Pending</span>
                      )}
                    </div>

                    {/* Action Triggers based on Order Stage */}
                    <div className="flex gap-2">
                      {/* Step 1: Generate / Edit Bill for Uploaded Rx or Direct Order */}
                      {(!order.bill || order.status === 'Needs Pricing') && (
                        <button
                          onClick={() => handleOpenBillingModal(order)}
                          className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" /> Generate & Send Bill
                        </button>
                      )}

                      {/* Step 2: Bill Sent -> Move to Dispatch */}
                      {order.status.includes('Bill Sent') && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.orderId, 'Out for Delivery')}
                          className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" /> Mark Out for Delivery
                        </button>
                      )}

                      {/* Step 3: Out for Delivery -> Delivered */}
                      {order.status === 'Out for Delivery' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.orderId, 'Delivered')}
                          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Delivered
                        </button>
                      )}

                      {order.status === 'Delivered' && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          ✓ Completed & Paid
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: PRODUCT LIST INVENTORY WITH PAGINATION & ADD OPTION */}
        {/* ============================================================ */}
        {activeTab === 'products' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            
            {/* Table Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pharmacy Product Catalog</h3>
                <p className="text-xs text-slate-500">Live drug inventory, stock control & pricing</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Medicine
                </button>

                {/* Rows per page selector */}
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span>Rows:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="border border-slate-200 rounded-lg p-1 text-slate-700 font-bold outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-semibold">
                    <th className="py-3 px-3">Product ID</th>
                    <th className="py-3 px-3">Medicine Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Available Stock</th>
                    <th className="py-3 px-3">Unit Price</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-500">{prod.id}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{prod.name}</td>
                        <td className="py-3 px-3 text-slate-500">{prod.category}</td>
                        <td className="py-3 px-3 font-medium">{prod.qty} Units</td>
                        <td className="py-3 px-3 font-bold text-slate-900">₹{prod.price}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              prod.status === 'In stock'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : prod.status === 'Low stock'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {prod.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-slate-400">
                        No products found matching "{search}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
              <span className="text-slate-500">
                Showing {paginatedProducts.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{' '}
                {Math.min(currentPage * rowsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 font-bold text-teal-800">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* 3. MODAL: MANUAL BILLING & PRICING GENERATOR                  */}
      {/* ============================================================ */}
      {billingModalOrder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setBillingModalOrder(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Generate Medicine Bill & Set Prices</h4>
                <p className="text-xs text-slate-400">Order: {billingModalOrder.orderId} • {billingModalOrder.customerName}</p>
              </div>
            </div>

            <form onSubmit={handleSendBillToCustomer} className="py-4 space-y-4 text-xs">
              
              {/* Prescribed Item Rows (Editable) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Enter Prescribed Medicines & Rates:</span>
                  <button
                    type="button"
                    onClick={handleAddManualItem}
                    className="text-teal-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>

                <div className="space-y-2">
                  {manualBillItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        placeholder="Medicine name"
                        required
                        value={item.name}
                        onChange={(e) => handleItemFieldChange(idx, 'name', e.target.value)}
                        className="flex-1 border border-slate-200 bg-white rounded-lg p-1.5 outline-none focus:ring-1 focus:ring-teal-700 font-medium text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        required
                        value={item.qty}
                        onChange={(e) => handleItemFieldChange(idx, 'qty', e.target.value)}
                        className="w-14 border border-slate-200 bg-white rounded-lg p-1.5 outline-none focus:ring-1 focus:ring-teal-700 text-center font-bold text-xs"
                      />
                      <div className="relative w-24">
                        <span className="absolute left-2 top-2 text-slate-400">₹</span>
                        <input
                          type="number"
                          placeholder="Price"
                          min="0"
                          required
                          value={item.unitPrice}
                          onChange={(e) => handleItemFieldChange(idx, 'unitPrice', e.target.value)}
                          className="w-full pl-5 pr-2 py-1.5 border border-slate-200 bg-white rounded-lg outline-none focus:ring-1 focus:ring-teal-700 font-bold text-xs"
                        />
                      </div>
                      {manualBillItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveManualItem(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Fee & Discount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={billDiscount}
                    onChange={(e) => setBillDiscount(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-bold outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Delivery Charge (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={billDeliveryFee}
                    onChange={(e) => setBillDeliveryFee(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 font-bold outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>
              </div>

              {/* Bill Summary Box */}
              <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold">₹{calculatedTotal.subtotal}</span>
                </div>
                {calculatedTotal.discountAmt > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>- ₹{calculatedTotal.discountAmt}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>+ ₹{billDeliveryFee}</span>
                </div>
                <div className="pt-2 border-t border-teal-200 flex justify-between font-black text-sm text-teal-950">
                  <span>Customer Payable:</span>
                  <span className="text-base text-teal-900">₹{calculatedTotal.finalTotal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setBillingModalOrder(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Send Bill to Customer
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. MODAL: ADD PRODUCT FORM                                    */}
      {/* ============================================================ */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-slate-900 mb-1">Add Medicine to Inventory</h3>
            <p className="text-xs text-slate-500 mb-4">Add new pharmaceutical stock and pricing details.</p>

            <form onSubmit={handleAddNewProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Medicine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol 650mg"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:ring-1 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={newProductForm.category}
                  onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2 outline-none bg-white focus:ring-1 focus:ring-teal-700"
                >
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Pain Relievers">Pain Relievers</option>
                  <option value="Respiratory">Respiratory</option>
                  <option value="Vitamins">Vitamins</option>
                  <option value="Allergy">Allergy</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50"
                    value={newProductForm.qty}
                    onChange={(e) => setNewProductForm({ ...newProductForm, qty: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 120"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="flex-1 py-2 border border-slate-200 font-bold rounded-xl text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. MODAL: PRESCRIPTION IMAGE VIEWER                          */}
      {/* ============================================================ */}
      {viewImageModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 shadow-2xl relative">
            <button
              onClick={() => setViewImageModal(null)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="font-bold text-sm text-slate-800 mb-3">Customer Uploaded Prescription / Image</h4>
            <img src={viewImageModal} alt="Prescription Full View" className="w-full h-80 object-cover rounded-xl border border-slate-200" />
            <button
              onClick={() => setViewImageModal(null)}
              className="w-full mt-3 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MedicineDashboard;