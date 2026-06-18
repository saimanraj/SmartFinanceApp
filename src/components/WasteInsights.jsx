function WasteInsights({ expenses }) {

  // Repeated spending categories
  const categoryTotals = {}

  expenses.forEach((expense) => {

    const category = expense.category

    if (categoryTotals[category]) {

      categoryTotals[category] +=
        expense.amount

    } else {

      categoryTotals[category] =
        expense.amount

    }

  })

  // Detect highest expense category
  let wasteCategory = "None"

  let wasteAmount = 0

  for (const category in categoryTotals) {

    if (
      categoryTotals[category] >
      wasteAmount
    ) {

      wasteAmount =
        categoryTotals[category]

      wasteCategory = category

    }

  }

  // Estimate yearly savings
  const possibleSaving =
    Math.round(
      wasteAmount * 0.20 * 12
    )

  return (

    <div className="mt-10">

      <div className="
      bg-linear-to-r
      from-red-500
      to-orange-500
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

          Waste Spending Detection 🚨

        </h2>

        <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
        ">

          {/* Waste Category */}
          <div className="
          bg-white/20
          p-5
          rounded-2xl
          ">

            <h3 className="
            text-lg
            font-semibold
            ">

              Highest Spending Area

            </h3>

            <p className="
            text-2xl
            font-bold
            mt-2
            ">

              {wasteCategory}

            </p>

            <p className="mt-2">

              ₹{wasteAmount} spent

            </p>

          </div>

          {/* Savings Suggestion */}
          <div className="
          bg-white/20
          p-5
          rounded-2xl
          ">

            <h3 className="
            text-lg
            font-semibold
            ">

              Smart Suggestion

            </h3>

            <p className="
            text-lg
            mt-3
            leading-relaxed
            ">

              Reducing{" "}

              <span className="font-bold">
                {wasteCategory}
              </span>

              {" "}expenses by{" "}

              <span className="font-bold">
                20%
              </span>

              {" "}can save around{" "}

              <span className="font-bold">
                ₹{possibleSaving}
              </span>

              {" "}yearly 🚀

            </p>

          </div>

        </div>

      </div>

    </div>

  )

}

export default WasteInsights