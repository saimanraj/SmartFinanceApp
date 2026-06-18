import { useState } from "react"
import { collection, addDoc } from "firebase/firestore"
import { auth, db } from "../firebase/firebase"
import Tesseract from "tesseract.js"

function ExpenseForm({ expenses, setExpenses }) {

  const [amount, setAmount] = useState("")
  const [purpose, setPurpose] = useState("")
  const [category, setCategory] = useState("Food 🍔")
  const [error, setError] = useState("")
  const [scanning, setScanning] =  useState(false)

const [scanSource, setScanSource] = useState("Manual")


  const handleReceiptScan =
  async (event) => {

    const file =
      event.target.files[0]

    if (!file)
      return

    try {

      setScanning(true)

      const result =
        await Tesseract.recognize(

          file,

          "eng"

        )

      const text =
        result.data.text

      console.log(
        text
      )

      // Amount

      let detectedAmount = null

const totalPatterns = [

  /total[:\s]*\$?(\d+(\.\d+)?)/i,

  /amount[:\s]*\$?(\d+(\.\d+)?)/i,

  /grand total[:\s]*\$?(\d+(\.\d+)?)/i,

  /subtotal[:\s]*\$?(\d+(\.\d+)?)/i

]

for (const pattern of totalPatterns) {

  const match =
    text.match(pattern)

  if (match) {

    detectedAmount =
      Number(match[1])

    break

  }

}


const lines =
  text.split("\n")

for (const line of lines) {

  const lower =
    line.toLowerCase()

  // Highest priority

  if (
    lower.includes("grand total")
  ) {

    const match =
      line.match(
        /([\d,]+\.\d{2})/
      )

    if (match) {

      detectedAmount =
        Number(
          match[1]
            .replace(/,/g, "")
        )

      break

    }

  }

  // Second priority

  if (
    lower.includes("total") &&
    !lower.includes("subtotal")
  ) {

    const match =
      line.match(
        /([\d,]+\.\d{2})/
      )

    if (match) {

      detectedAmount =
        Number(
          match[1]
            .replace(/,/g, "")
        )

      break

    }

  }

  // Third priority

  if (
    lower.includes("amount paid")
  ) {

    const match =
      line.match(
        /([\d,]+\.\d{2})/
      )

    if (match) {

      detectedAmount =
        Number(
          match[1]
            .replace(/,/g, "")
        )

      break

    }

  }

  // Fourth priority

  if (
    lower.includes("balance due")
  ) {

    const match =
      line.match(
        /([\d,]+\.\d{2})/
      )

    if (match) {

      detectedAmount =
        Number(
          match[1]
            .replace(/,/g, "")
        )

      break

    }

  }

}

if (detectedAmount) {

  setAmount(
    detectedAmount
  )

}



      // Purpose

      const firstLine =

        text
          .split("\n")
          .find(

            line =>

              line.trim()
                .length > 3

          )

      if (firstLine) {

        setPurpose(
          firstLine.trim()
        )

      }

      // Category Detection

      const lowerText =
        text.toLowerCase()

      if (

        lowerText.includes(
          "hotel"
        ) ||

        lowerText.includes(
          "restaurant"
        ) ||

        lowerText.includes(
          "food"
        )

      ) {

        setCategory(
          "Food 🍔"
        )
        setScanSource(
  "Manual"
)

      }

      else if (

        lowerText.includes(
          "petrol"
        ) ||

        lowerText.includes(
          "fuel"
        ) ||

        lowerText.includes(
          "bus"
        )

      ) {

        setCategory(
          "Travel ⛽"
        )

      }

      else if (

        lowerText.includes(
          "school"
        ) ||

        lowerText.includes(
          "college"
        ) ||

        lowerText.includes(
          "book"
        )

      ) {

        setCategory(
          "Education 📚"
        )

      }

      else if (

        lowerText.includes(
          "hospital"
        ) ||

        lowerText.includes(
          "medical"
        )

      ) {

        setCategory(
          "Health 🏥"
        )

      }

      else {

        setCategory(
          "Shopping 🛍️"
        )

      }

      setScanSource(
        "Receipt Scan"
      )

    } catch (error) {

      console.error(error)

      alert(
        "Receipt Scan Failed"
      )

    } finally {

      setScanning(false)

    }

  }
  
const handleAddExpense = async () => {

    // Remove extra spaces
    const trimmedPurpose = purpose.trim()

    // Validation
    if (!amount || !trimmedPurpose || !category) {
      setError("Please fill all fields")
      return
    }

    // Check if purpose contains only numbers
    if (/^\d+$/.test(trimmedPurpose)) {
      setError("Purpose cannot contain only numbers")
      return
    }

    // Amount validation
    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0")
      return
    }
    const user = auth.currentUser

if (!user) {
  alert("User not logged in")
  return
}
    const currentDate = new Date()

const formattedDate =
  currentDate.toLocaleDateString()

const formattedTime =
  currentDate.toLocaleTimeString()

const newExpense = {

  amount:
    Number(amount),

  purpose:
    trimmedPurpose,

  category,

  source:
    scanSource,

  userId:
    user.uid,

  date:
    formattedDate,

  time:
    formattedTime,

  createdAt:
    currentDate

}
    

    try {

  // Save to Firebase
  await addDoc(collection(db, "expenses"), newExpense)

  // Update local UI
  setExpenses([...expenses, newExpense])

} catch (error) {

  console.error("Error adding expense:", error)

}

    // Clear fields
    setAmount("")
    setPurpose("")
    setCategory("Food 🍔")
    setError("")
  }

  return (
    <div className="mt-10">

      <div className="bg-white p-6 rounded-2xl shadow-md">

        <h2 className="text-2xl font-bold mb-4">
          Add Expense 💸
        </h2>
        {scanning && (

  <div className="
  bg-yellow-100
  text-yellow-700
  p-3
  rounded-xl
  mb-4
  ">

    🔍 Scanning Receipt...

  </div>

)}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4">
            {error}
          </div>
        )}
        <div>

  <input

    type="file"

    accept="image/*"

    onChange={
      handleReceiptScan
    }

    className="
    border
    p-3
    rounded-xl
    w-full
    "

  />

</div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Amount Input */}
          <input
            type="number"
            placeholder="Amount"
            className="border p-3 rounded-xl"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* Purpose Input */}
          <input
            type="text"
            placeholder="Purpose"
            className="border p-3 rounded-xl"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />

          {/* Category Dropdown */}
          <select
            className="border p-3 rounded-xl"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Food 🍔</option>
            <option>Travel ⛽</option>
            <option>Shopping 🛍️</option>
            <option>Bills ⚡</option>
            <option>Education 📚</option>
            <option>Health 🏥</option>
            <option>Entertainment 🎮</option>
            <option>Savings 🏦</option>
          </select>

          {/* Add Button */}
          <button
            onClick={handleAddExpense}
            className="bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            Add
          </button>

        </div>

      </div>

     
    </div>
  )

} 

export default ExpenseForm

