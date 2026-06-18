import { useState } from "react"

import {
  addDoc,
  collection
} from "firebase/firestore"

import {
  auth,
  db
} from "../firebase/firebase"

function LendingForm({

  fetchRecords

}) {

  const [personName,
    setPersonName] =
    useState("")

  const [amount,
    setAmount] =
    useState("")

  const [type,
    setType] =
    useState("given")

  const [repayDate,
    setRepayDate] =
    useState("")

  const [interestEnabled,
    setInterestEnabled] =
    useState(false)

  const [interestType,
    setInterestType] =
    useState("simple")

  const [interestRate,
    setInterestRate] =
    useState("")

  const [interestMode,
    setInterestMode] =
    useState("monthly")

  const [errorMessage,
    setErrorMessage] =
    useState("")

  // Duration
  const calculateDuration =
    () => {

      if (!repayDate)
        return 1

      const today =
        new Date()

      const due =
        new Date(
          repayDate
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
        diffDays <= 0
      ) return 1

      if (
        interestMode ===
        "daily"
      ) {

        return diffDays

      }

      if (
        interestMode ===
        "monthly"
      ) {

        return diffDays / 30

      }

      return diffDays / 365

  }

  // Interest Calculation
  const calculateInterest =
    () => {

      const principal =
        Number(amount)

      const rate =
        Number(
          interestRate
        )

      if (

        !interestEnabled ||

        !rate ||

        !amount

      ) {

        return {

          principal,

          interestAmount: 0,

          totalPayable:
            principal

        }

      }

      const duration =
        calculateDuration()

      let interestAmount = 0

      if (
        interestType ===
        "simple"
      ) {

        interestAmount =

          (
            principal *
            rate *
            duration
          ) / 100

      }

      else {

        const total =

          principal *

          Math.pow(

            1 + rate / 100,

            duration

          )

        interestAmount =
          total - principal

      }

      return {

        principal,

        interestAmount:
          Math.round(
            interestAmount
          ),

        totalPayable:
          Math.round(

            principal +
            interestAmount

          )

      }

  }

  // Add Record
  const handleAddRecord =
    async () => {

      try {

        setErrorMessage("")

        if (

          !personName ||

          !amount ||

          !repayDate

        ) {

          setErrorMessage(
            "Fill all required fields"
          )

          return

        }

        // Interest Limits
        if (
          interestEnabled
        ) {

          if (

            interestMode ===
              "daily" &&

            Number(
              interestRate
            ) > 1

          ) {

            setErrorMessage(
              "Maximum Daily Interest: 1%"
            )

            return

          }

          if (

            interestMode ===
              "monthly" &&

            Number(
              interestRate
            ) > 30

          ) {

            setErrorMessage(
              "Maximum Monthly Interest: 30%"
            )

            return

          }

          if (

            interestMode ===
              "yearly" &&

            Number(
              interestRate
            ) > 100

          ) {

            setErrorMessage(
              "Maximum Yearly Interest: 100%"
            )

            return

          }

        }

        const user =
          auth.currentUser

        if (!user)
          return

        const calculation =
          calculateInterest()

        await addDoc(

          collection(
            db,
            "lendings"
          ),

          {

            personName,

            amount:
              calculation.principal,

            interestAmount:
              calculation.interestAmount,

            totalPayable:
              calculation.totalPayable,

            paidAmount: 0,

            remainingAmount:
              calculation.totalPayable,

            repayments: [],

            type,

            repayDate,

            status:
              "pending",

            interestEnabled,

            interestType,

            interestRate:
              Number(
                interestRate
              ),

            interestMode,

            userId:
              user.uid,

            createdAt:
              new Date()

          }

        )

        // Reset
        setPersonName("")
        setAmount("")
        setRepayDate("")
        setInterestRate("")
        setInterestEnabled(false)

        fetchRecords()

      } catch (error) {

        console.error(
          error
        )

      }

  }

  const calculation =
    calculateInterest()

  return (

    <div
      className="
      bg-white
      p-6
      rounded-2xl
      shadow-lg
      mb-8
      "
    >

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-4
        "
      >

        {/* Name */}

        <input

          type="text"

          placeholder="Person Name"

          value={personName}

          onChange={(e) => {

            const value =
              e.target.value

            if (

              /^[A-Za-z\s]*$/
                .test(value)

            ) {

              setPersonName(
                value
              )

            }

          }}

          className="
          border
          p-4
          rounded-xl
          "

        />

        {/* Amount */}

        <input

          type="number"

          placeholder="Amount"

          value={amount}

          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }

          className="
          border
          p-4
          rounded-xl
          "

        />

        {/* Type */}

        <select

          value={type}

          onChange={(e) =>
            setType(
              e.target.value
            )
          }

          className="
          border
          p-4
          rounded-xl
          "

        >

          <option value="given">
            Money Given 💰
          </option>

          <option value="borrowed">
            Money Borrowed 💸
          </option>

        </select>

        {/* Due Date */}

        <input

          type="date"

          value={repayDate}

          onChange={(e) =>
            setRepayDate(
              e.target.value
            )
          }

          className="
          border
          p-4
          rounded-xl
          "

        />

      </div>

      {/* Interest */}

      <div className="mt-5">

        <label
          className="
          flex
          gap-2
          font-semibold
          "
        >

          <input

            type="checkbox"

            checked={
              interestEnabled
            }

            onChange={(e) =>
              setInterestEnabled(
                e.target.checked
              )
            }

          />

          Apply Interest 📈

        </label>

      </div>

      {interestEnabled && (

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
          mt-4
          "
        >

          <select

            value={
              interestType
            }

            onChange={(e) =>
              setInterestType(
                e.target.value
              )
            }

            className="
            border
            p-4
            rounded-xl
            "

          >

            <option value="simple">
              Simple Interest
            </option>

            <option value="compound">
              Compound Interest
            </option>

          </select>

          <input

            type="number"

            placeholder="Interest %"

            value={
              interestRate
            }

            onChange={(e) =>
              setInterestRate(
                e.target.value
              )
            }

            className="
            border
            p-4
            rounded-xl
            "

          />

          <select

            value={
              interestMode
            }

            onChange={(e) =>
              setInterestMode(
                e.target.value
              )
            }

            className="
            border
            p-4
            rounded-xl
            "

          >

            <option value="daily">
              Daily
            </option>

            <option value="monthly">
              Monthly
            </option>

            <option value="yearly">
              Yearly
            </option>

          </select>

        </div>

      )}

      {/* Limits */}

      {interestEnabled && (

        <div
          className="
          mt-3
          text-sm
          text-gray-500
          "
        >

          {interestMode ===
            "daily" &&
            "⚠ Max Daily Interest: 1%"}

          {interestMode ===
            "monthly" &&
            "⚠ Max Monthly Interest: 30%"}

          {interestMode ===
            "yearly" &&
            "⚠ Max Yearly Interest: 100%"}

        </div>

      )}

      {/* Error */}

      {errorMessage && (

        <div
          className="
          mt-4
          bg-red-100
          text-red-700
          p-3
          rounded-xl
          "
        >

          {errorMessage}

        </div>

      )}

      {/* Preview */}

      <div
        className="
        mt-6
        bg-blue-50
        p-5
        rounded-xl
        "
      >

        <p>
          💰 Principal:
          ₹{calculation.principal}
        </p>

        <p>
          📈 Interest:
          ₹{calculation.interestAmount}
        </p>

        <p
          className="
          text-xl
          font-bold
          text-blue-700
          "
        >

          💵 Total:
          ₹{
            calculation.totalPayable
          }

        </p>

      </div>

      {/* Add */}

      <button

        onClick={
          handleAddRecord
        }

        className="
        mt-6
        bg-purple-500
        hover:bg-purple-600
        text-white
        px-6
        py-3
        rounded-xl
        font-semibold
        "

      >

        Add Record ➕

      </button>

    </div>

  )

}

export default LendingForm