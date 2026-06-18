function DailySummary({ expenses }) {

  const today =
    new Date().toLocaleDateString()

  // Today's expenses
  const todayExpenses = expenses.filter(
    (expense) =>
      expense.date === today
  )

  // Total expense today
  const totalTodayExpense =
    todayExpenses.reduce(
      (total, expense) =>
        total + expense.amount,
      0
    )

  // Category count
  const categoryCount = {}

  todayExpenses.forEach((expense) => {

    if (categoryCount[expense.category]) {

      categoryCount[expense.category] += 1

    } else {

      categoryCount[expense.category] = 1

    }

  })

  // Find top category
  let topCategory = "None"

  let maxCount = 0

  for (const category in categoryCount) {

    if (categoryCount[category] > maxCount) {

      maxCount = categoryCount[category]

      topCategory = category

    }

  }

  return (
    <div className="mt-10">

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-bold mb-6">
          Daily Summary 🌙
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Today's Expense */}
          <div className="bg-white/20 p-5 rounded-2xl">

            <h3 className="text-lg font-semibold">
              Today's Expense
            </h3>

            <p className="text-3xl font-bold mt-2">
              ₹{totalTodayExpense}
            </p>

          </div>

          {/* Transactions */}
          <div className="bg-white/20 p-5 rounded-2xl">

            <h3 className="text-lg font-semibold">
              Transactions
            </h3>

            <p className="text-3xl font-bold mt-2">
              {todayExpenses.length}
            </p>

          </div>

          {/* Top Category */}
          <div className="bg-white/20 p-5 rounded-2xl">

            <h3 className="text-lg font-semibold">
              Top Category
            </h3>

            <p className="text-2xl font-bold mt-2">
              {topCategory}
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default DailySummary