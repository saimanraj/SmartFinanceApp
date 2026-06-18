import { useState } from "react"

import {
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore"

import { db } from "../firebase/firebase"

function GroupedExpenseList({ expenses }) {

  const [openDate, setOpenDate] = useState(null)

  const [editingId, setEditingId] = useState(null)

  const [editedPurpose, setEditedPurpose] = useState("")

  const [editedAmount, setEditedAmount] = useState("")

  // Group expenses by date
  const groupedExpenses = {}

  expenses.forEach((expense) => {

    const date = expense.date || "Unknown Date"

    if (!groupedExpenses[date]) {
      groupedExpenses[date] = []
    }

    groupedExpenses[date].push(expense)

  })

  // Delete Expense
  const handleDelete = async (id) => {

    try {

      await deleteDoc(doc(db, "expenses", id))

      window.location.reload()

    } catch (error) {

      console.error("Delete Error:", error)

    }

  }

  // Update Expense
  const handleUpdate = async (id) => {

    try {

      await updateDoc(
        doc(db, "expenses", id),
        {
          purpose: editedPurpose,
          amount: Number(editedAmount),
        }
      )

      setEditingId(null)

      window.location.reload()

    } catch (error) {

      console.error("Update Error:", error)

    }

  }

  return (
    <div className="mt-10">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Date Wise Expenses 📅
      </h2>

      <div className="space-y-6">

        {Object.entries(groupedExpenses).map(
          ([date, dateExpenses]) => (

            <div
              key={date}
              className="bg-white rounded-2xl shadow overflow-hidden"
            >

              {/* Date Header */}
              <div
                onClick={() =>
                  setOpenDate(
                    openDate === date ? null : date
                  )
                }
                cclassName="flex justify-between items-center p-5 cursor-pointer hover:bg-blue-50 transition duration-300"
              >

                <h3 className="text-xl font-bold">
                  📅 {date}
                </h3>

                <span className="text-lg">
                  {openDate === date ? "▲" : "▼"}
                </span>

              </div>

              {/* Expense List */}
              {openDate === date && (

                <div className="p-5 border-t space-y-4">

                  {dateExpenses.map((expense) => (

                    <div
                      key={expense.id}
                      className="bg-gray-100 p-5 rounded-2xl flex justify-between items-center hover:bg-gray-200 hover:scale-[1.01] transition duration-300"
                    >

                      {/* LEFT SIDE */}
                      <div>

                        {editingId === expense.id ? (

                          <div className="space-y-2">

                            <input
                              type="number"
                              value={editedAmount}
                              onChange={(e) =>
                                setEditedAmount(e.target.value)
                              }
                              className="border p-2 rounded w-full"
                            />

                            <input
                              type="text"
                              value={editedPurpose}
                              onChange={(e) =>
                                setEditedPurpose(e.target.value)
                              }
                              className="border p-2 rounded w-full"
                            />

                            <button
                              onClick={() =>
                                handleUpdate(expense.id)
                              }
                             className="bg-green-500 hover:bg-green-600 transition duration-300 text-white px-4 py-2 rounded cursor-pointer"
                            >
                              Save ✅
                            </button>

                          </div>

                        ) : (

                          <>

                            <p className="text-2xl font-bold">
                              ₹{expense.amount}
                            </p>

                            <p className="text-lg text-gray-700">
                              {expense.purpose}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              ⏰ {expense.time || "No Time"}
                            </p>

                          </>

                        )}

                      </div>

                      {/* RIGHT SIDE */}
                      <div className="flex flex-col items-end gap-3">

                        <span className="bg-white px-4 py-2 rounded-full text-sm">
                          {expense.category}
                        </span>

                        <div className="flex gap-2">

                          <button
                            onClick={() => {

                              setEditingId(expense.id)

                              setEditedPurpose(
                                expense.purpose
                              )

                              setEditedAmount(
                                expense.amount
                              )

                            }}
                            className="bg-yellow-400 hover:bg-yellow-500 transition duration-300 px-4 py-2 rounded cursor-pointer"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(expense.id)
                            }
                           className="bg-red-500 hover:bg-red-600 transition duration-300 text-white px-4 py-2 rounded cursor-pointer"
                          >
                            🗑️ Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          )
        )}

      </div>

    </div>
  )
}

export default GroupedExpenseList