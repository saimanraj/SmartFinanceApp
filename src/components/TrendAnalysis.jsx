function TrendAnalysis({ expenses }) {

  const currentMonth =
    new Date().getMonth()

  const currentYear =
    new Date().getFullYear()

  // Current Month Expenses
  const currentMonthExpenses =
    expenses.filter((expense) => {

      if (!expense.createdAt) return false

      const date =
        new Date(
          expense.createdAt.seconds
          * 1000
        )

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      )

    })

  // Previous Month
  const previousMonth =
    currentMonth === 0
      ? 11
      : currentMonth - 1

  const previousYear =
    currentMonth === 0
      ? currentYear - 1
      : currentYear

  const previousMonthExpenses =
    expenses.filter((expense) => {

      if (!expense.createdAt) return false

      const date =
        new Date(
          expense.createdAt.seconds
          * 1000
        )

      return (
        date.getMonth() === previousMonth &&
        date.getFullYear() === previousYear
      )

    })

  // Totals
  const currentTotal =
    currentMonthExpenses.reduce(
      (total, expense) =>
        total + expense.amount,
      0
    )

  const previousTotal =
    previousMonthExpenses.reduce(
      (total, expense) =>
        total + expense.amount,
      0
    )

  // Percentage Difference
  let percentageChange = 0

  if (previousTotal > 0) {

    percentageChange =
      (
        (
          currentTotal -
          previousTotal
        ) / previousTotal
      ) * 100

  }

  const isIncrease =
    percentageChange > 0

  return (

    <div className="mt-10">

      <div className="
      bg-gradient-to-r
      from-indigo-500
      to-blue-500
      text-white
      p-6
      rounded-2xl
      shadow-lg
      ">

        <h2 className="
        text-2xl
        font-bold
        mb-6
        ">

          Trend Analysis 📈

        </h2>

        <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
        ">

          {/* Current Month */}
          <div className="
          bg-white/20
          p-5
          rounded-2xl
          ">

            <h3 className="
            text-lg
            font-semibold
            ">

              Current Month

            </h3>

            <p className="
            text-3xl
            font-bold
            mt-2
            ">

              ₹{currentTotal}

            </p>

          </div>

          {/* Previous Month */}
          <div className="
          bg-white/20
          p-5
          rounded-2xl
          ">

            <h3 className="
            text-lg
            font-semibold
            ">

              Previous Month

            </h3>

            <p className="
            text-3xl
            font-bold
            mt-2
            ">

              ₹{previousTotal}

            </p>

          </div>

          {/* Change */}
          <div className="
          bg-white/20
          p-5
          rounded-2xl
          ">

            <h3 className="
            text-lg
            font-semibold
            ">

              Spending Change

            </h3>

            <p className="
            text-2xl
            font-bold
            mt-2
            ">

              {Math.abs(
                percentageChange
              ).toFixed(1)}%

              {" "}

              {isIncrease
                ? "📈 Increased"
                : "📉 Reduced"}

            </p>

          </div>

        </div>

      </div>

    </div>

  )

}

export default TrendAnalysis