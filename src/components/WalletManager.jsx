import { useState } from "react"
import {
  addDoc,
  collection,
} from "firebase/firestore"

import {
  auth,
  db,
} from "../firebase/firebase"

function WalletManager({

  walletBalance,
  setWalletBalance

}) {

  const [amount, setAmount] = useState("")

  const [source, setSource] = useState("")

 const handleAddMoney = async () => {

    if (!amount || !source) {

      alert("Please fill all fields")

      return

    }

    const newAmount = Number(amount)

    if (newAmount <= 0) {

      alert("Amount must be greater than 0")

      return

    }

    try {

  const user = auth.currentUser

  if (!user) {

    alert("User not logged in")

    return

  }

  const walletData = {

    amount: newAmount,

    source,

    userId: user.uid,

    date:
      new Date().toLocaleDateString(),

    time:
      new Date().toLocaleTimeString(),

    createdAt: new Date(),

  }

  // Save to Firestore
  await addDoc(
    collection(db, "walletTransactions"),
    walletData
  )

  // Update UI
  setWalletBalance(
    walletBalance + newAmount
  )

} catch (error) {

  console.error(
    "Wallet Save Error:",
    error
  )

}

    setAmount("")
    setSource("")

  }

  return (
    <div className="mt-10">

      <div className="bg-white p-6 rounded-2xl shadow-md">

        <h2 className="text-2xl font-bold mb-6">
          Wallet Manager 💰
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Amount */}
          <input
            type="number"
            placeholder="Enter Amount"
            className="border p-3 rounded-xl"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />

          {/* Source */}
          <input
            type="text"
            placeholder="Source (Parents, Salary...)"
            className="border p-3 rounded-xl"
            value={source}
            onChange={(e) =>
              setSource(e.target.value)
            }
          />

          {/* Button */}
          <button
            onClick={handleAddMoney}
            className="
            bg-green-500
            hover:bg-green-600
            hover:scale-105
            active:scale-95
            transition-all
            duration-300
            text-white
            font-semibold
            rounded-xl
            shadow-md
            "
          >
            Add Money ➕
          </button>

        </div>

      </div>

    </div>
  )
}

export default WalletManager