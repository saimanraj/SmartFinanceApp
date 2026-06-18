function FinancialScore({

  walletBalance,
  expenses

}) {

  // Total Expenses
  const totalExpenses =
    expenses.reduce(

      (total, expense) =>
        total + expense.amount,

      0

    )

  // Remaining Balance
  const remainingBalance =
    walletBalance - totalExpenses

  // Savings Ratio
  let savingsRatio = 0

  if (walletBalance > 0) {

    savingsRatio =
      (
        remainingBalance /
        walletBalance
      ) * 100

  }

  // Base Score
  let score = 50

  // Good savings
  if (savingsRatio >= 50) {

    score += 25

  } else if (savingsRatio >= 30) {

    score += 15

  } else {

    score -= 10

  }

  // Too many expenses
  if (expenses.length > 20) {

    score -= 10

  }

  // Overspending
  if (remainingBalance < 0) {

    score -= 30

  }

  // Limit score
  if (score > 100) {

    score = 100

  }

  if (score < 0) {

    score = 0

  }

  // Score Message
  let message = ""

  if (score >= 80) {

    message =
      "Excellent financial control 🚀"

  } else if (score >= 60) {

    message =
      "Good financial habits 👍"

  } else if (score >= 40) {

    message =
      "Need better expense control ⚠️"

  } else {

    message =
      "High overspending detected 🚨"

  }

  return (

    <div className="mt-10">

      <div className="
      bg-gradient-to-r
      from-green-500
      to-emerald-600
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

          Financial Health Score 💯

        </h2>

        <div className="
        flex
        flex-col
        md:flex-row
        items-center
        justify-between
        gap-6
        ">

          {/* Score Circle */}
          <div className="
          w-40
          h-40
          rounded-full
          border-8
          border-white
          flex
          items-center
          justify-center
          text-4xl
          font-bold
          shadow-lg
          bg-white/20
          ">

            {score}

          </div>

          {/* Details */}
          <div className="flex-1">

            <h3 className="
            text-2xl
            font-bold
            mb-3
            ">

              {message}

            </h3>

            <div className="
            space-y-2
            text-lg
            ">

              <p>
                💰 Wallet Balance:
                ₹{walletBalance}
              </p>

              <p>
                📉 Expenses:
                ₹{totalExpenses}
              </p>

              <p>
                💵 Remaining:
                ₹{remainingBalance}
              </p>

              <p>
                📊 Savings Ratio:
                {savingsRatio.toFixed(1)}%
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default FinancialScore