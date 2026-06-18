function AIInsights({ expenses }) {

  // Total spent per category
  const categoryTotals = {}

  expenses.forEach((expense) => {

    if (categoryTotals[expense.category]) {

      categoryTotals[expense.category] +=
        expense.amount

    } else {

      categoryTotals[expense.category] =
        expense.amount

    }

  })

  // Find highest spending category
  let topCategory = "None"

  let highestAmount = 0

  for (const category in categoryTotals) {

    if (
      categoryTotals[category] >
      highestAmount
    ) {

      highestAmount =
        categoryTotals[category]

      topCategory = category

    }

  }

  // Frequent purposes
  const purposeCount = {}

  expenses.forEach((expense) => {

    const purpose =
      expense.purpose.toLowerCase()

    if (purposeCount[purpose]) {

      purposeCount[purpose] += 1

    } else {

      purposeCount[purpose] = 1

    }

  })

  let repeatedExpense = "None"

  let repeatCount = 0

  for (const purpose in purposeCount) {

    if (
      purposeCount[purpose] >
      repeatCount
    ) {

      repeatCount =
        purposeCount[purpose]

      repeatedExpense = purpose

    }

  }

  return (

    <div className="mt-10">

      <div className="
      bg-gradient-to-r
      from-purple-500
      to-pink-500
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

          AI Financial Insights 🧠

        </h2>

        <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
        ">

          {/* Top Category */}
          <div className="
          bg-white/20
          p-5
          rounded-2xl
          ">

            <h3 className="
            text-lg
            font-semibold
            ">

              Highest Spending Category

            </h3>

            <p className="
            text-2xl
            font-bold
            mt-2
            ">

              {topCategory}

            </p>

            <p className="mt-2">

              ₹{highestAmount} spent

            </p>

          </div>

          {/* Repeated Expense */}
          <div className="
          bg-white/20
          p-5
          rounded-2xl
          ">

            <h3 className="
            text-lg
            font-semibold
            ">

              Most Repeated Expense

            </h3>

            <p className="
            text-2xl
            font-bold
            mt-2
            ">

              {repeatedExpense}

            </p>

            <p className="mt-2">

              Repeated {repeatCount} times

            </p>

          </div>

        </div>

      </div>

    </div>

  )

}

export default AIInsights