import { useState } from "react"

import Calendar from "react-calendar"

import "react-calendar/dist/Calendar.css"

import {
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore"

import { db } from "../firebase/firebase"

function ExpenseCalendar({ expenses }) {

  // Selected calendar date
  const [selectedDate, setSelectedDate] =
    useState(new Date())

  // Edit states
  const [editingId, setEditingId] =
    useState(null)

  const [editedAmount, setEditedAmount] =
    useState("")

  const [editedPurpose, setEditedPurpose] =
    useState("")

  // Format selected date
  const formattedSelectedDate =
    selectedDate.toLocaleDateString()

  // Filter expenses by selected date
  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.date === formattedSelectedDate
  )

  // Delete Expense
  const handleDelete = async (id) => {

    try {

      await deleteDoc(
        doc(db, "expenses", id)
      )

      window.location.reload()

    } catch (error) {

      console.error(
        "Delete Error:",
        error
      )

    }

  }

  // Update Expense
  const handleUpdate = async (id) => {

    try {

      await updateDoc(

        doc(db, "expenses", id),

        {

          amount:
            Number(editedAmount),

          purpose:
            editedPurpose,

        }

      )

      setEditingId(null)

      window.location.reload()

    } catch (error) {

      console.error(
        "Update Error:",
        error
      )

    }

  }

  return (

    <div className="mt-10">

      <div className="
      bg-white
      p-6
      rounded-2xl
      shadow-md
      ">

        {/* Title */}
        <h2 className="
        text-2xl
        font-bold
        mb-6
        text-center
        ">

          Expense Calendar 📅

        </h2>

        {/* Calendar */}
        <div className="
flex
justify-center
gap-4
mt-4
flex-wrap
text-sm
font-medium
">

  <div>
    🟢 ₹1 - ₹100
  </div>

  <div>
    🟡 ₹101 - ₹500
  </div>

  <div>
    🔴 ₹501+
  </div>

</div>
        <div className="
        flex
        justify-center
        ">

          <Calendar

  onChange={setSelectedDate}

  value={selectedDate}

  tileClassName={({ date }) => {

    const formattedDate =
      date.toLocaleDateString()

    const totalExpense =

      expenses

        .filter(
          expense =>

            expense.date ===
            formattedDate
        )

        .reduce(

          (sum, expense) =>

            sum +
            Number(
              expense.amount
            ),

          0

        )

    if (
      totalExpense === 0
    )
      return ""

    if (
      totalExpense <= 100
    )
      return "expense-low"

    if (
      totalExpense <= 500
    )
      return "expense-medium"

    return "expense-high"

  }}

 />

        </div>

        {/* Expense List */}
        <div className="mt-8">

          <h3 className="
          text-xl
          font-bold
          mb-4
          text-center
          ">

            Expenses on
            {" "}
            {formattedSelectedDate}
            <p className="
text-center
text-lg
font-semibold
text-blue-600
mb-4
">

  Total:
  ₹{

    filteredExpenses.reduce(

      (sum, expense) =>

        sum +
        Number(
          expense.amount
        ),

      0

    )

  }

</p>

          </h3>


          {filteredExpenses.length === 0 ? (

            <p className="
            text-gray-500
            text-center
            ">

              No expenses on this date.

            </p>

          ) : (

            <div className="space-y-4">

              {filteredExpenses.map(

                (expense) => (

                  <div

                   key={ expense.id || `${expense.date}-${expense.time}`}

                    className="
                    bg-gray-100
                    p-5
                    rounded-2xl
                    flex
                    justify-between
                    items-center
                    "

                  >

                    {/* LEFT SIDE */}
                    <div>

                      {editingId === expense.id ? (

                        <div className="space-y-2">

                          <input

                            type="number"

                            value={editedAmount}

                            onChange={(e) =>
                              setEditedAmount(
                                e.target.value
                              )
                            }

                            className="
                            border
                            p-2
                            rounded
                            w-full
                            "

                          />

                          <input

                            type="text"

                            value={editedPurpose}

                            onChange={(e) =>
                              setEditedPurpose(
                                e.target.value
                              )
                            }

                            className="
                            border
                            p-2
                            rounded
                            w-full
                            "

                          />

                          <button

                            onClick={() =>
                              handleUpdate(
                                expense.id
                              )
                            }

                            className="
                            bg-green-500
                            hover:bg-green-600
                            hover:scale-105
                            active:scale-95
                            transition-all
                            duration-300
                            text-white
                            px-4
                            py-2
                            rounded-xl
                            shadow-md
                            "

                          >

                            Save ✅

                          </button>

                        </div>

                      ) : (

                        <>

                          <p className="
                          text-2xl
                          font-bold
                          ">

                            ₹{expense.amount}

                          </p>

                          <p className="
                          text-lg
                          text-gray-700
                          ">

                            {expense.purpose}

                          </p>

                          <p className="
                          text-sm
                          text-gray-500
                          mt-1
                          ">

                            ⏰ {expense.time}

                          </p>

                        </>

                      )}

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="
                    flex
                    flex-col
                    items-end
                    gap-3
                    ">

                      {/* Category */}
                      <span className="
                      bg-white
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      ">

                        {expense.category}

                      </span>

                      {/* Buttons */}
                      <div className="
                      flex
                      gap-2
                      ">

                        <button

                          onClick={() => {

                            setEditingId(
                              expense.id
                            )

                            setEditedAmount(
                              expense.amount
                            )

                            setEditedPurpose(
                              expense.purpose
                            )

                          }}

                          className="
                          bg-yellow-400
                          hover:bg-yellow-500
                          hover:scale-105
                          active:scale-95
                          transition-all
                          duration-300
                          px-4
                          py-2
                          rounded-xl
                          shadow-md
                          "

                        >

                          ✏ Edit

                        </button>

                        <button

                          onClick={() =>
                            handleDelete(
                              expense.id
                            )
                          }

                          className="
                          bg-red-500
                          hover:bg-red-600
                          hover:scale-105
                          active:scale-95
                          transition-all
                          duration-300
                          text-white
                          px-4
                          py-2
                          rounded-xl
                          shadow-md
                          "

                        >

                          🗑 Delete

                        </button>

                      </div>

                    </div>

                  </div>

                )

              )}

            </div>

          )}

        </div>

      </div>

    </div>

  )

}

export default ExpenseCalendar  