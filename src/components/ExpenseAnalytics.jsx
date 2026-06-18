import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

function ExpenseAnalytics({ expenses }) {

  const categoryTotals = {}

  expenses.forEach((expense) => {

    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount
    } else {
      categoryTotals[expense.category] = expense.amount
    }

  })

  const chartData = Object.entries(categoryTotals).map(
    ([category, total]) => ({
      name: category,
      value: total,
    })
  )

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A020F0",
    "#FF4560",
    "#775DD0",
    "#3F51B5",
  ]

  return (
    <div className="mt-10">

      <div className="bg-white p-6 rounded-2xl shadow-md">

        <h2 className="text-2xl font-bold mb-6">
          Expense Analytics 📊
        </h2>

        {expenses.length === 0 ? (
          <p className="text-gray-500">
            No expenses added yet.
          </p>
        ) : (
          <>

            {/* Category Totals */}
            <div className="space-y-4 mb-10">

              {Object.entries(categoryTotals).map(
                ([category, total]) => (

                  <div
                    key={category}
                    className="flex justify-between items-center bg-gray-100 p-4 rounded-xl"
                  >

                    <h3 className="font-semibold text-lg">
                      {category}
                    </h3>

                    <p className="font-bold text-xl">
                      ₹{total}
                    </p>

                  </div>

                )
              )}

            </div>

            {/* Pie Chart */}
            
            <div className="w-full h-[400px]">

              <ResponsiveContainer>

                <PieChart>

                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >

                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}

                  </Pie>

                  <Tooltip />
                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </>
        )}

      </div>

    </div>
  )
}

export default ExpenseAnalytics