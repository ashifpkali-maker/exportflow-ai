return (
  <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
    <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
      
      <h1 className="text-2xl font-bold mb-6">Create Invoice</h1>

      {!showInvoice && (
        <>
          <input
            placeholder="Buyer Name"
            className="border p-3 w-full mb-4 rounded"
            onChange={(e) => setBuyer(e.target.value)}
          />

          <input
            placeholder="Product"
            className="border p-3 w-full mb-4 rounded"
            onChange={(e) => setProduct(e.target.value)}
          />

          <input
            placeholder="Amount"
            className="border p-3 w-full mb-4 rounded"
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={handleSave}
            className="bg-black text-white px-6 py-3 rounded w-full"
          >
            Generate Invoice
          </button>
        </>
      )}

      {showInvoice && (
        <>
          <div
            ref={invoiceRef}
            className="border p-6 rounded-lg mt-6"
          >
            {/* HEADER */}
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">ExportFlow AI</h2>
                <p className="text-sm text-gray-500">
                  Global Export Solutions
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">INVOICE</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* BUYER */}
            <div className="mb-6">
              <p className="text-sm text-gray-500">Bill To:</p>
              <p className="font-semibold">{buyer}</p>
            </div>

            {/* TABLE */}
            <table className="w-full border mb-6">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2">Product</th>
                  <th className="p-2">Amount</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="p-2 border">{product}</td>
                  <td className="p-2 border">₹{amount}</td>
                </tr>
              </tbody>
            </table>

            {/* TOTAL */}
            <div className="text-right mb-6">
              <p className="font-bold text-lg">
                Total: ₹{amount}
              </p>
            </div>

            {/* FOOTER */}
            <p className="text-sm text-gray-500 text-center">
              Thank you for your business!
            </p>
          </div>

          <button
            onClick={downloadPDF}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded w-full"
          >
            Download PDF
          </button>
        </>
      )}
    </div>
  </div>
);