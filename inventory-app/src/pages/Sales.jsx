import React, { useState, useEffect } from 'react';

const Sales = () => {
  // State management
  const [sales, setSales] = useState([]);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [amountLeft, setAmountLeft] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);

  // Load initial data
  useEffect(() => {
    loadSales();
    loadProducts();
  }, []);

  // Calculate amounts when dependencies change
  useEffect(() => {
    if (selectedProduct) {
      const totalPrice = selectedProduct.price * quantity;
      const discountAmount = (totalPrice * discount) / 100;
      const totalAfterDiscount = totalPrice - discountAmount;
      const left = totalAfterDiscount - (parseFloat(amountPaid) || 0);
      setAmountLeft(left > 0 ? left : 0);
    }
  }, [selectedProduct, quantity, discount, amountPaid]);

  // Data loading functions
  const loadSales = async () => {
    try {
      const sales = await window.electron.invoke('get-sales');
      setSales(sales);
    } catch (error) {
      console.error('Error loading sales:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const products = await window.electron.invoke('get-products');
      setProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  // Dashboard reload function
  const reloadDashboard = async () => {
    try {
      const dashboardElement = document.querySelector('[data-component="Dashboard"]');
      if (dashboardElement) {
        const event = new CustomEvent('reload-dashboard');
        dashboardElement.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error reloading dashboard:', error);
    }
  };

  // Handle sale submission
  const handleSaleSubmit = async () => {
    if (!customerName || !selectedProduct || quantity <= 0) {
      alert('Please fill all required fields');
      return;
    }

    if (quantity > selectedProduct.stock) {
      alert('Quantity exceeds available stock');
      return;
    }

    const totalPrice = selectedProduct.price * quantity;
    const discountAmount = (totalPrice * discount) / 100;
    const totalAfterDiscount = totalPrice - discountAmount;

    const saleData = {
      customerName,
      phoneNumber,
      subtotal: totalPrice,
      discount,
      totalDiscount: discountAmount,
      total: totalAfterDiscount,
      amountPaid: parseFloat(amountPaid) || 0,
      amountLeft: amountLeft > 0 ? amountLeft : 0,
      date: new Date().toISOString(),
      items: [{
        productId: selectedProduct.id,
        quantity,
        price: selectedProduct.price,
        discount,
        total: totalAfterDiscount
      }]
    };

    try {
      const result = await window.electron.invoke('create-sale', saleData);
      if (result.success) {
        alert('Sale completed successfully');
        setCustomerName('');
        setPhoneNumber('');
        setSelectedProduct(null);
        setQuantity(1);
        setDiscount(0);
        setAmountPaid('');
        setAmountLeft(0);
        setShowSaleForm(false);
        loadSales();
        loadProducts();
        reloadDashboard();
      } else {
        alert('Error completing sale: ' + result.error);
      }
    } catch (error) {
      console.error('Error completing sale:', error);
      alert('Error completing sale');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales History</h1>
        <button
          onClick={() => setShowSaleForm(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i className="fas fa-plus mr-2"></i>
          New Sale
        </button>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(sale.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{sale.customerName}</div>
                  {sale.phoneNumber && <div className="text-sm text-gray-500">{sale.phoneNumber}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Rs {sale.total.toFixed(2)}</div>
                  {sale.discount > 0 && (
                    <div className="text-xs text-gray-500">
                      Discount: {sale.discount}% (Rs {sale.totalDiscount.toFixed(2)})
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    sale.amountLeft > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {sale.amountLeft > 0 ? 'Partial' : 'Paid'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Sale Modal */}
      {showSaleForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">New Sale</h2>
              <button onClick={() => setShowSaleForm(false)} className="text-gray-400 hover:text-gray-500">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <select
                  value={selectedProduct ? selectedProduct.id : ''}
                  onChange={(e) => {
                    const product = products.find(p => p.id === parseInt(e.target.value));
                    setSelectedProduct(product);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id} disabled={product.stock === 0}>
                      {product.name} - Rs {product.price.toFixed(2)} (Stock: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity and Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
                  <input
                    type="number"
                    min="0"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount Left</label>
                  <input
                    type="number"
                    value={amountLeft.toFixed(2)}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowSaleForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaleSubmit}
                  disabled={!customerName || !selectedProduct || quantity <= 0}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Complete Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
