function LendingSummary({

  totalGiven,
  totalBorrowed,
  totalPaid,
  totalRemaining,
  totalRecords,
  paidRecords,
  pendingRecords,
  overdueRecords,

}) {

  return (

    <div className="mb-8">

      {/* Financial Summary */}
      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-4
        mb-6
      "
      >

        {/* Total Given */}
        <div
          className="
          bg-green-100
          rounded-2xl
          p-5
          shadow
        "
        >

          <p
            className="
            text-green-700
            font-semibold
            mb-2
          "
          >

            💰 Total Given

          </p>

          <h2
            className="
            text-3xl
            font-bold
            text-green-800
          "
          >

            ₹{totalGiven}

          </h2>

        </div>

        {/* Total Borrowed */}
        <div
          className="
          bg-red-100
          rounded-2xl
          p-5
          shadow
        "
        >

          <p
            className="
            text-red-700
            font-semibold
            mb-2
          "
          >

            💸 Total Borrowed

          </p>

          <h2
            className="
            text-3xl
            font-bold
            text-red-800
          "
          >

            ₹{totalBorrowed}

          </h2>

        </div>

        {/* Total Paid */}
        <div
          className="
          bg-blue-100
          rounded-2xl
          p-5
          shadow
        "
        >

          <p
            className="
            text-blue-700
            font-semibold
            mb-2
          "
          >

            🟢 Total Paid

          </p>

          <h2
            className="
            text-3xl
            font-bold
            text-blue-800
          "
          >

            ₹{totalPaid}

          </h2>

        </div>

        {/* Remaining */}
        <div
          className="
          bg-orange-100
          rounded-2xl
          p-5
          shadow
        "
        >

          <p
            className="
            text-orange-700
            font-semibold
            mb-2
          "
          >

            🔴 Remaining

          </p>

          <h2
            className="
            text-3xl
            font-bold
            text-orange-800
          "
          >

            ₹{totalRemaining}

          </h2>

        </div>

      </div>

      {/* Record Statistics */}
      <div
        className="
        grid
        grid-cols-2
        lg:grid-cols-4
        gap-4
      "
      >

        {/* Total Records */}
        <div
          className="
          bg-white
          rounded-2xl
          p-5
          shadow
        "
        >

          <p
            className="
            text-gray-600
            font-medium
          "
          >

            📋 Total Records

          </p>

          <h2
            className="
            text-2xl
            font-bold
            mt-2
          "
          >

            {totalRecords}

          </h2>

        </div>

        {/* Paid */}
        <div
          className="
          bg-green-50
          rounded-2xl
          p-5
          shadow
        "
        >

          <p
            className="
            text-green-600
            font-medium
          "
          >

            ✅ Paid

          </p>

          <h2
            className="
            text-2xl
            font-bold
            mt-2
          "
          >

            {paidRecords}

          </h2>

        </div>

        {/* Pending */}
        <div
          className="
          bg-yellow-50
          rounded-2xl
          p-5
          shadow
        "
        >

          <p
            className="
            text-yellow-700
            font-medium
          "
          >

            ⏳ Pending

          </p>

          <h2
            className="
            text-2xl
            font-bold
            mt-2
          "
          >

            {pendingRecords}

          </h2>

        </div>

        {/* Overdue */}
        <div
          className="
          bg-red-50
          rounded-2xl
          p-5
          shadow
        "
        >

          <p
            className="
            text-red-700
            font-medium
          "
          >

            🚨 Overdue

          </p>

          <h2
            className="
            text-2xl
            font-bold
            mt-2
          "
          >

            {overdueRecords}

          </h2>

        </div>

      </div>

    </div>

  )

}

export default LendingSummary