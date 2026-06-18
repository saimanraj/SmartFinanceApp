import { useState } from "react"

function BudgetManager({ expenses }) {
    console.log(expenses)

  const [foodBudget, setFoodBudget] =
    useState("")

  const [travelBudget, setTravelBudget] =
    useState("")

  const [shoppingBudget, setShoppingBudget] =
    useState("")

  // Category totals
  let foodSpent = 0
  let travelSpent = 0
  let shoppingSpent = 0

  expenses.forEach((expense) => {

  const category =
    expense.category
      ?.toLowerCase()
      .trim()

  if (category === "food") {

    foodSpent += expense.amount

  }

  if (category === "travel") {

    travelSpent += expense.amount

  }

  if (category === "shopping") {

    shoppingSpent += expense.amount

  }

})

  return (

    <div className="mt-10">

      <div className="
      bg-gradient-to-r
      from-cyan-500
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

          Budget Limit System 🎯

        </h2>

        <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
        ">

          {/* Food */}
          <div className="
          bg-white/20
          p-5
          rounded-2xl
          ">

            <h3 className="
            text-xl
            font-bold
            mb-3
            ">

              Food 🍔

            </h3>

            <input
              type="number"
              placeholder="Set Food Budget"
              value={foodBudget}
              onChange={(e) =>
                setFoodBudget(
                  e.target.value
                )
              }
              className="
              w-full
              p-3
              rounded-xl
              text-black
              mb-4
              "
            />

            <p>
              Spent: ₹{foodSpent}
            </p>

            <p>
              Remaining:
              ₹{
                Number(foodBudget) -
                foodSpent
              }
            </p>

            {foodSpent >
              Number(foodBudget) &&
              foodBudget && (

              <p className="
              mt-3
              font-bold
              text-yellow-300
              ">

                ⚠ Budget Exceeded

              </p>

            )}

          </div>

          {/* Travel */}
          <div className="
          bg-white/20
          p-5
          rounded-2xl
          ">

            <h3 className="
            text-xl
            font-bold
            mb-3
            ">

              Travel 🚗

            </h3>

            <input
              type="number"
              placeholder="Set Travel Budget"
              value={travelBudget}
              onChange={(e) =>
                setTravelBudget(
                  e.target.value
                )
              }
              className="
              w-full
              p-3
              rounded-xl
              text-black
              mb-4
              "
            />

            <p>
              Spent: ₹{travelSpent}
            </p>

            <p>
              Remaining:
              ₹{
                Number(travelBudget) -
                travelSpent
              }
            </p>

            {travelSpent >
              Number(travelBudget) &&
              travelBudget && (

              <p className="
              mt-3
              font-bold
              text-yellow-300
              ">

                ⚠ Budget Exceeded

              </p>

            )}

          </div>

          {/* Shopping */}
          <div className="
          bg-white/20
          p-5
          rounded-2xl
          ">

            <h3 className="
            text-xl
            font-bold
            mb-3
            ">

              Shopping 🛍

            </h3>

            <input
              type="number"
              placeholder="Set Shopping Budget"
              value={shoppingBudget}
              onChange={(e) =>
                setShoppingBudget(
                  e.target.value
                )
              }
              className="
              w-full
              p-3
              rounded-xl
              text-black
              mb-4
              "
            />

            <p>
              Spent: ₹{shoppingSpent}
            </p>

            <p>
              Remaining:
              ₹{
                Number(shoppingBudget) -
                shoppingSpent
              }
            </p>

            {shoppingSpent >
              Number(shoppingBudget) &&
              shoppingBudget && (

              <p className="
              mt-3
              font-bold
              text-yellow-300
              ">

                ⚠ Budget Exceeded

              </p>

            )}

          </div>

        </div>

      </div>

    </div>

  )

}

export default BudgetManager