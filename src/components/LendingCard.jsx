import { useState } from "react"

import {
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore"

import { db } from "../firebase/firebase"

import RepaymentHistory from "./RepaymentHistory"

function LendingCard({

  record,
  fetchRecords,

}) {

  const [expanded,
    setExpanded] =
    useState(false)

  const [editing,
    setEditing] =
    useState(false)

  const [repaymentAmount,
    setRepaymentAmount] =
    useState("")

  const [editData,
    setEditData] =
    useState({

      personName:
        record.personName || "",

      amount:
        record.amount || 0,

      repayDate:
        record.repayDate || "",

      interestRate:
        record.interestRate || 0,

      type:
        record.type || "given",

    })

  // Due Status
  const getDueStatus =
    () => {

      if (
        !record.repayDate
      ) return null

      const today =
        new Date()

      const due =
        new Date(
          record.repayDate
        )

      const diffDays =
        Math.ceil(

          (
            due - today
          ) /

          (
            1000 *
            60 *
            60 *
            24
          )

        )

      if (
        diffDays < 0
      ) {

        return {

          text:
            `🔴 Overdue by ${Math.abs(diffDays)} days`,

          color:
            "text-red-600",

        }

      }

      if (
        diffDays <= 3
      ) {

        return {

          text:
            `🟡 Due in ${diffDays} days`,

          color:
            "text-yellow-600",

        }

      }

      return {

        text:
          `🟢 ${diffDays} days remaining`,

        color:
          "text-green-600",

      }

  }

  // Save Edit
  const handleSave =
    async () => {

      try {

        const principal =
          Number(
            editData.amount
          )

        const rate =
          Number(
            editData.interestRate
          )

        const interestAmount =

          (
            principal *
            rate
          ) / 100

        const totalPayable =

          principal +
          interestAmount

        const paidAmount =

          record.paidAmount || 0

        const remainingAmount =

          totalPayable -
          paidAmount

        await updateDoc(

          doc(
            db,
            "lendings",
            record.id
          ),

          {

            personName:
              editData.personName,

            amount:
              principal,

            interestRate:
              rate,

            interestAmount:
              Math.round(
                interestAmount
              ),

            totalPayable:
              Math.round(
                totalPayable
              ),

            remainingAmount:
              Math.round(
                remainingAmount
              ),

            repayDate:
              editData.repayDate,

            type:
              editData.type,

          }

        )

        setEditing(false)

        fetchRecords()

      } catch (error) {

        console.error(
          error
        )

      }

  }

  // Delete
  const handleDelete =
    async () => {

      const confirmDelete =
        window.confirm(
          "Delete this record?"
        )

      if (
        !confirmDelete
      ) return

      try {

        await deleteDoc(

          doc(
            db,
            "lendings",
            record.id
          )

        )

        fetchRecords()

      } catch (error) {

        console.error(
          error
        )

      }

  }

  // Repayment
  const handleRepayment =
    async () => {

      try {

        const payment =
          Number(
            repaymentAmount
          )

        if (
          payment <= 0
        ) return

        const updatedPaid =

          (
            record.paidAmount || 0
          ) + payment

        let updatedRemaining =

          (
            record.totalPayable || 0
          ) - updatedPaid

        if (
          updatedRemaining < 0
        ) {

          updatedRemaining = 0

        }

        const repaymentHistory = [

          ...(record.repayments || []),

          {

            amount:
              payment,

            date:
              new Date()
                .toLocaleDateString(),

          },

        ]

        await updateDoc(

          doc(
            db,
            "lendings",
            record.id
          ),

          {

            paidAmount:
              updatedPaid,

            remainingAmount:
              updatedRemaining,

            repayments:
              repaymentHistory,

            status:

              updatedRemaining === 0

                ? "paid"

                : "pending",

          }

        )

        setRepaymentAmount("")

        fetchRecords()

      } catch (error) {

        console.error(
          error
        )

      }

  }

  const dueStatus =
    getDueStatus()

  return (

    <div
      className="
      bg-white
      rounded-2xl
      shadow
      overflow-hidden
      "
    >

      {/* Header */}

      <div

        onClick={() =>
          setExpanded(
            !expanded
          )
        }

        className="
        p-5
        flex
        justify-between
        items-center
        cursor-pointer
        hover:bg-gray-50
        "

      >

        <h2
          className="
          text-xl
          font-bold
          "
        >

          {record.personName}

        </h2>

        <span>

          {expanded
            ? "▲"
            : "▼"}

        </span>

      </div>

      {expanded && (

        <div
          className="
          p-5
          border-t
          space-y-3
          "
        >

          {editing ? (

            <>
              <input
                type="text"
                value={
                  editData.personName
                }
                onChange={(e) =>
                  setEditData({

                    ...editData,

                    personName:
                      e.target.value,

                  })
                }
                className="
                border
                p-2
                rounded
                w-full
                "
              />

              <input
                type="number"
                value={
                  editData.amount
                }
                onChange={(e) =>
                  setEditData({

                    ...editData,

                    amount:
                      e.target.value,

                  })
                }
                className="
                border
                p-2
                rounded
                w-full
                "
              />

              <input
                type="number"
                value={
                  editData.interestRate
                }
                onChange={(e) =>
                  setEditData({

                    ...editData,

                    interestRate:
                      e.target.value,

                  })
                }
                className="
                border
                p-2
                rounded
                w-full
                "
              />

              <input
                type="date"
                value={
                  editData.repayDate
                }
                onChange={(e) =>
                  setEditData({

                    ...editData,

                    repayDate:
                      e.target.value,

                  })
                }
                className="
                border
                p-2
                rounded
                w-full
                "
              />

              <button
                onClick={
                  handleSave
                }
                className="
                bg-green-500
                text-white
                px-4
                py-2
                rounded
                "
              >
                Save ✅
              </button>
            </>

          ) : (

            <>
              <p>
                💰 Principal:
                ₹{record.amount}
              </p>

              <p>
                📈 Interest:
                ₹{
                  record.interestAmount || 0
                }
              </p>

              <p>
                💵 Total:
                ₹{
                  record.totalPayable || 0
                }
              </p>

              <p className="text-green-600">
                ✅ Paid:
                ₹{
                  record.paidAmount || 0
                }
              </p>

              <p className="text-orange-600">
                ⚠ Remaining:
                ₹{
                  record.remainingAmount || 0
                }
              </p>

              <p>
                📅 Due Date:
                {record.repayDate}
              </p>

              <p>
                {record.type === "given"
                  ? "💰 Money Given"
                  : "💸 Money Borrowed"}
              </p>

              <p>
                Status:
                {" "}
                {record.status === "paid"
                  ? "✅ Paid"
                  : "⏳ Pending"}
              </p>

              {dueStatus && (

                <p
                  className={
                    dueStatus.color
                  }
                >
                  {
                    dueStatus.text
                  }
                </p>

              )}
            </>

          )}

          {/* Repayment */}

          {record.status !==
            "paid" && (

            <div className="flex gap-2">

              <input
                type="number"
                placeholder="Repayment Amount"
                value={
                  repaymentAmount
                }
                onChange={(e) =>
                  setRepaymentAmount(
                    e.target.value
                  )
                }
                className="
                border
                p-2
                rounded
                "
              />

              <button
                onClick={
                  handleRepayment
                }
                className="
                bg-blue-500
                text-white
                px-4
                rounded
                "
              >
                Pay 💵
              </button>

            </div>

          )}

          <RepaymentHistory
            repayments={
              record.repayments
            }
          />

          <div className="flex gap-2">

            <button
              onClick={() =>
                setEditing(
                  !editing
                )
              }
              className="
              bg-yellow-500
              text-white
              px-4
              py-2
              rounded
              "
            >
              Edit ✏️
            </button>

            <button
              onClick={
                handleDelete
              }
              className="
              bg-red-500
              text-white
              px-4
              py-2
              rounded
              "
            >
              Delete 🗑
            </button>

          </div>

        </div>

      )}

    </div>

  )

}

export default LendingCard