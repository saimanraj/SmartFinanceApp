/*
import {

  useEffect,
  useState

} from "react"

import {

  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,

} from "firebase/firestore"

import {

  auth,
  db

} from "../firebase/firebase"

function LendingManager() {

  const [personName,
    setPersonName] =
    useState("")

  const [amount,
    setAmount] =
    useState("")

  const [type,
    setType] =
    useState("given")

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

  const [repayDate,
    setRepayDate] =
    useState("")

    
const [searchTerm,
  setSearchTerm] =
  useState("")

  const [records,
    setRecords] =
    useState([])

  const [expandedId,
    setExpandedId] =
    useState(null)

  const [repaymentAmounts,
    setRepaymentAmounts] =
    useState({})

  const [errorMessage,
    setErrorMessage] =
    useState("")

  // Fetch Records
  const fetchRecords =
    async () => {

      try {

        const user =
          auth.currentUser

        if (!user) return

        const q = query(

          collection(
            db,
            "lendings"
          ),

          where(
            "userId",
            "==",
            user.uid
          )

        )

        const querySnapshot =
          await getDocs(q)

        const lendingData =
          querySnapshot.docs.map(
            (doc) => ({

              id: doc.id,

              ...doc.data(),

            })
          )

        setRecords(lendingData)

      } catch (error) {

        console.error(error)

      }

  }


  useEffect(() => {

    fetchRecords()

  }, [])

  // Calculate Duration
  const calculateDuration =
    () => {

      if (!repayDate)
        return 1

      const today =
        new Date()

      const repay =
        new Date(repayDate)

      const diffTime =
        repay - today

      const diffDays =

        Math.ceil(

          diffTime /

          (
            1000 *
            60 *
            60 *
            24
          )

        )

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
        Number(interestRate)

      const duration =
        calculateDuration()

      if (

        !interestEnabled ||

        !rate ||

        !repayDate

      ) {

        return {

          principal,

          interestAmount: 0,

          totalPayable:
            principal,

        }

      }

      let interestAmount = 0

      // Simple Interest
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

      // Compound Interest
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

      const totalPayable =

        principal +
        interestAmount

      return {

        principal,

        interestAmount:
          Math.round(
            interestAmount
          ),

        totalPayable:
          Math.round(
            totalPayable
          ),

      }

  }

  // Interest Breakdown
  const calculateInterestBreakdown =
    (record) => {

      const principal =
        Number(record.amount)

      const rate =
        Number(
          record.interestRate
        )

      if (
        !record.interestEnabled
      ) {

        return {

          daily: 0,

          monthly: 0,

          yearly: 0,

        }

      }

      let daily = 0

      // Daily
      if (
        record.interestMode ===
        "daily"
      ) {

        daily =

          (
            principal *
            rate
          ) / 100

      }

      // Monthly
      else if (
        record.interestMode ===
        "monthly"
      ) {

        daily =

          (
            principal *
            rate
          ) / 100 / 30

      }

      // Yearly
      else {

        daily =

          (
            principal *
            rate
          ) / 100 / 365

      }

      const monthly =
        daily * 30

      const yearly =
        daily * 365

      return {

        daily:
          Math.round(daily),

        monthly:
          Math.round(monthly),

        yearly:
          Math.round(yearly),

      }

  }

  // Add Record
  const handleAddRecord =
    async () => {

      try {

        // Clear Old Error
        setErrorMessage("")

        // Validation
        if (
          !personName ||
          !amount
        ) {

          setErrorMessage(
            "⚠ Fill all required fields"
          )

          return

        }

        // Daily Limit
        if (

          interestEnabled &&

          interestMode ===
            "daily" &&

          Number(
            interestRate
          ) > 1

        ) {

          setErrorMessage(
            "⚠ Maximum Daily Interest: 1%"
          )

          return

        }

        // Monthly Limit
        if (

          interestEnabled &&

          interestMode ===
            "monthly" &&

          Number(
            interestRate
          ) > 30

        ) {

          setErrorMessage(
            "⚠ Maximum Monthly Interest: 30%"
          )

          return

        }

        // Yearly Limit
        if (

          interestEnabled &&

          interestMode ===
            "yearly" &&

          Number(
            interestRate
          ) > 100

        ) {

          setErrorMessage(
            "⚠ Maximum Yearly Interest: 100%"
          )

          return

        }

        const user =
          auth.currentUser

        if (!user) return

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

            interestEnabled,

            interestType,

            interestRate:
              Number(
                interestRate
              ),

            interestMode,

            repayDate,

            status:
              "pending",

            userId:
              user.uid,

            createdAt:
              new Date(),

          }

        )

        // Reset
        setPersonName("")
        setAmount("")
        setType("given")
        setInterestEnabled(false)
        setInterestRate("")
        setRepayDate("")
        setErrorMessage("")

        fetchRecords()

      } catch (error) {

        console.error(error)

      }

  }

  // Delete
  const handleDelete =
    async (id) => {

      try {

        await deleteDoc(

          doc(
            db,
            "lendings",
            id
          )

        )

        fetchRecords()

      } catch (error) {

        console.error(error)

      }

  }

  // Repayment
  const handleRepayment =
    async (record) => {

      try {

        const repayment =

          Number(

            repaymentAmounts[
              record.id
            ] || 0

          )

        if (repayment <= 0)
          return

        let updatedPaid =

          record.paidAmount +
          repayment

        let updatedRemaining =

          record.totalPayable -
          updatedPaid

        if (updatedRemaining < 0) {

          updatedRemaining = 0

          updatedPaid =
            record.totalPayable

        }

        const repaymentHistory =

          [

            ...(record.repayments || []),

            {

              amount:
                repayment,

              date:
                new Date()
                .toLocaleDateString(),

            },

          ]

        const newStatus =

          updatedRemaining === 0

            ? "paid"

            : "pending"

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
              newStatus,

          }

        )

        fetchRecords()

      } catch (error) {

        console.error(error)

      }

  }
  const totalGiven = records
  .filter(record => record.type === "given")
  .reduce(
    (sum, record) =>
      sum + (record.amount || 0),
    0
  )

const totalBorrowed = records
  .filter(record => record.type === "borrowed")
  .reduce(
    (sum, record) =>
      sum + (record.amount || 0),
    0
  )

const totalPaid = records
  .reduce(
    (sum, record) =>
      sum +
      (record.paidAmount || 0),
    0
  )

const totalRemaining = records
  .reduce(
    (sum, record) =>
      sum +
      (record.remainingAmount || 0),
    0
  )

  const filteredRecords =

  records.filter(
    record =>

      record.personName
        ?.toLowerCase()

        .includes(

          searchTerm
            .toLowerCase()

        )
  )
const getOverdueStatus =
  (repayDate) => {

    if (!repayDate)
      return null

    const today =
      new Date()

    const dueDate =
      new Date(repayDate)

    const diffDays =
      Math.ceil(
        (dueDate - today) /
        (
          1000 *
          60 *
          60 *
          24
        )
      )

    if (diffDays < 0) {

      return {

        text:
          `🔴 Overdue by ${Math.abs(diffDays)} days`,

        color:
          "text-red-600"

      }

    }

    if (diffDays <= 3) {

      return {

        text:
          `🟡 Due in ${diffDays} days`,

        color:
          "text-yellow-600"

      }

    }

    return {

      text:
        `🟢 Due in ${diffDays} days`,

      color:
        "text-green-600"

    }

}

  return (

    <div className="
    min-h-screen
    bg-gray-100
    p-6
    ">

     
      <h1 className="
      text-4xl
      font-bold
      text-center
      mb-8
      ">

        Lending Manager 💸

      </h1>

      
      <div className="
      bg-white
      p-6
      rounded-2xl
      shadow-lg
      mb-10
      ">

        <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-4
        ">

          
          <input

            type="text"

            placeholder="Person Name"

            value={personName}

            onChange={(e) => {

              const value =

                e.target.value

              // Letters + Spaces only
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

          <div className="
          flex
          flex-col
          ">

            <label className="
            mb-2
            font-semibold
            text-gray-700
            ">

              Repayment Due Date 📅

            </label>

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

        </div>

        <div className="mt-6">

          <label className="
          flex
          items-center
          gap-2
          font-semibold
          ">

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

          <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
          mt-4
          ">

            <select

              value={interestType}

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

            <div className="
            flex
            flex-col
            ">

              <input

                type="number"

                placeholder="Interest %"

                value={interestRate}

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

             
              <p className="
              text-sm
              text-gray-500
              mt-2
              ">

                {interestMode ===
                  "daily" &&
                  "Max Daily Interest: 1%"}

                {interestMode ===
                  "monthly" &&
                  "Max Monthly Interest: 30%"}

                {interestMode ===
                  "yearly" &&
                  "Max Yearly Interest: 100%"}

              </p>

            </div>

            <select

              value={interestMode}

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
                Daily Interest
              </option>

              <option value="monthly">
                Monthly Interest
              </option>

              <option value="yearly">
                Yearly Interest
              </option>

            </select>

          </div>

        )}

        {errorMessage && (

          <div className="
          mt-5
          bg-red-100
          border
          border-red-400
          text-red-700
          px-4
          py-3
          rounded-xl
          ">

            {errorMessage}

          </div>

        )}
        <h1 className="
text-4xl
font-bold
text-center
mb-8
">
  Lending Manager 💸
</h1>
<div className="
grid
grid-cols-1
md:grid-cols-4
gap-4
mb-8
">

  <div className="
  bg-green-100
  p-5
  rounded-2xl
  shadow
  ">
    <p className="
    text-green-700
    font-semibold
    ">
      💰 Total Given
    </p>

    <h2 className="
    text-2xl
    font-bold
    ">
      ₹{totalGiven}
    </h2>
  </div>
  

  <div className="
  bg-red-100
  p-5
  rounded-2xl
  shadow
  ">
    <p className="
    text-red-700
    font-semibold
    ">
      💸 Total Borrowed
    </p>

    <h2 className="
    text-2xl
    font-bold
    ">
      ₹{totalBorrowed}
    </h2>
  </div>

  <div className="
  bg-blue-100
  p-5
  rounded-2xl
  shadow
  ">
    <p className="
    text-blue-700
    font-semibold
    ">
      🟢 Total Paid
    </p>

    <h2 className="
    text-2xl
    font-bold
    ">
      ₹{totalPaid}
    </h2>
  </div>

  <div className="
  bg-orange-100
  p-5
  rounded-2xl
  shadow
  ">
    <p className="
    text-orange-700
    font-semibold
    ">
      🔴 Remaining
    </p>

    <h2 className="
    text-2xl
    font-bold
    ">
      ₹{totalRemaining}
    </h2>
  </div>

</div>

        {amount && (

          <div className="
          mt-6
          bg-gradient-to-r
          from-purple-100
          to-blue-100
          p-5
          rounded-2xl
          space-y-2
          ">

            <p className="
            text-lg
            font-semibold
            text-green-600
            ">

              💰 Principal:
              ₹{
                calculateInterest()
                .principal
              }

            </p>

            <p className="
            text-lg
            font-semibold
            text-purple-600
            ">

              📈 Interest:
              ₹{
                calculateInterest()
                .interestAmount
              }

            </p>

            <p className="
            text-2xl
            font-bold
            text-blue-700
            ">

              💵 Total:
              ₹{
                calculateInterest()
                .totalPayable
              }

            </p>

          </div>

        )}

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
          <div className="mt-8 mb-6">

  <input
    type="text"
    placeholder="🔍 Search Person"
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(
        e.target.value
      )
    }
    className="
    w-full
    border
    p-4
    rounded-xl
    "
  />

</div>

      </div>

    </div>

  )

}

export default LendingManager

*/