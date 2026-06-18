import { useEffect, useState } from "react"

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore"

import {
  signOut
} from "firebase/auth"

import {
  auth,
  db
} from "../firebase/firebase"

import { useNavigate,
  Link
} from "react-router-dom"
import ExpenseForm from "../components/ExpenseForm"
import ExpenseAnalytics from "../components/ExpenseAnalytics"

import ExpenseCalendar from "../components/ExpenseCalendar"
import DailySummary from "../components/DailySummary"
import WalletManager from "../components/WalletManager"
import AIInsights from "../components/AIInsights"
import WasteInsights from "../components/WasteInsights"
import TrendAnalysis from "../components/TrendAnalysis"
import FinancialScore from "../components/FinancialScore"
//import BudgetManager from "../components/BudgetManager"
//import GroupedExpenseList from "../components/GroupedExpenseList"
import AIAssistant from "../components/AIAssistant"
import SavingsGoal from "../components/SavingsGoal"
import {
  exportFinanceReport
} from "../utils/exportPDF"



function Dashboard() {

  const navigate = useNavigate()


  // States
  const [expenses, setExpenses] = useState([])
  const [incomeData, setIncomeData] = useState([])

  const [walletBalance, setWalletBalance] =
    useState(0)

  // Logout
  const handleLogout = async () => {

    try {

      await signOut(auth)

      navigate("/login")

    } catch (error) {

      console.error(
        "Logout Error:",
        error
      )

    }

  }

  // Fetch Wallet Transactions
  const fetchWalletTransactions =
    async () => {

      try {

        const user = auth.currentUser

        if (!user) return

        const q = query(

          collection(
            db,
            "walletTransactions"
          ),

          where(
            "userId",
            "==",
            user.uid
          )

        )

        const querySnapshot =
          await getDocs(q)

        let totalWallet = 0

const transactions = []

querySnapshot.forEach((doc) => {

  const data = doc.data()

  totalWallet +=
    Number(data.amount || 0)

  transactions.push({

    id: doc.id,

    ...data

  })

})

setIncomeData(
  transactions
)

setWalletBalance(
  totalWallet
)

        setWalletBalance(totalWallet)

      } catch (error) {

        console.error(
          "Wallet Fetch Error:",
          error
        )

      }

  }

  // Fetch Expenses
  const fetchExpenses = async () => {

    try {

      const user = auth.currentUser

      if (!user) return

      const q = query(

        collection(
          db,
          "expenses"
        ),

        where(
          "userId",
          "==",
          user.uid
        )

      )

      const querySnapshot =
        await getDocs(q)

      const expenseData =
        querySnapshot.docs.map(
          (doc) => ({

            id: doc.id,

            ...doc.data(),

          })
        )

      setExpenses(expenseData)

    } catch (error) {

      console.error(
        "Error fetching expenses:",
        error
      )

    }

  }

  // Load Data
  useEffect(() => {

    fetchExpenses()

    fetchWalletTransactions()

  }, [])

  // Total Expense
 const totalExpenses = expenses.reduce(
  (sum, expense) =>
    sum + Number(expense.amount || 0),
  0
)

const totalIncome =
  walletBalance

const totalSavings =
  walletBalance - totalExpenses

const remainingBalance =
  walletBalance - totalExpenses

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Smart Finance Dashboard 💰
        </h1>

        <button
          onClick={handleLogout}
          className="
          bg-red-500
          hover:bg-red-600
          hover:scale-105
          active:scale-95
          transition-all
          duration-300
          text-white
          font-semibold
          px-5
          py-2
          rounded-xl
          shadow-md
          cursor-pointer
          "
        >
          Logout 🚪
        </button>

      </div>
      <Link to="/lending">

  <button className="
  bg-purple-500
  hover:bg-purple-600
  hover:scale-105
  active:scale-95
  transition-all
  duration-300
  text-white
  px-5
  py-3
  rounded-xl
  shadow-md
  font-semibold
  ">

    Lending Manager 💸

  </button>
  
</Link>
<Link to="/reminders">

  <button className="

  bg-indigo-500

  hover:bg-indigo-600

  hover:scale-105

  active:scale-95

  transition-all

  duration-300

  cursor-pointer

  text-white

  px-5

  py-3

  rounded-xl

  shadow-md

  font-semibold

  ">

    🔔 Reminder Center

  </button>

</Link>


      {/* Summary Cards */}
      <div className="
      grid
      grid-cols-1
      md:grid-cols-3
      gap-6
      ">

        {/* Wallet */}
        <div

  onClick={() =>
    navigate(
      "/wallet-history"
    )
  }

  className="
  bg-green-400
  hover:bg-green-300
  hover:scale-105
  transition-all
  duration-300
  cursor-pointer
  rounded-2xl
  p-5
  shadow
  "

>

  <h2
    className="
    text-lg
    font-bold
    "
  >

    💰 Wallet Balance

  </h2>

  <p
    className="
    text-3xl
    font-bold
    text-green-700
    "
  >

    ₹{walletBalance}

  </p>

  <p
    className="
    text-xs
    text-gray-500
    mt-2
    "
  >

    Click to view history →

  </p>

</div>
        {/* Expenses */}
       <div

  onClick={() =>
    navigate(
      "/expense-history"
    )
  }

  className="
  bg-red-400
  hover:bg-red-300
  hover:scale-105
  hover:shadow-xl
  transition-all
  duration-300
  cursor-pointer
  rounded-2xl
  p-5
  shadow
  "

>

  <h2
    className="
    text-lg
    font-bold
    text-red-700
    "
  >

    💸 Expenses

  </h2>

  <p
    className="
    text-3xl
    font-bold
    text-red-800
    "
  >

    ₹{totalExpenses}

  </p>

  <p
    className="
    text-xs
    text-gray-500
    mt-2
    "
  >

    Click to view history →

  </p>

</div>

        {/* Remaining */}
        <div className="
        bg-blue-500
        text-white
        p-6
        rounded-2xl
        shadow-lg
        ">

          <h2 className="text-xl font-semibold">
            Remaining Balance
          </h2>

          <p className="text-3xl mt-2">
            ₹{remainingBalance}
          </p>

        </div>

      </div>

      {/* Wallet Manager */}
      <WalletManager
        walletBalance={walletBalance}
        setWalletBalance={setWalletBalance}
      />
     
      {/* Expense Form */}
      <ExpenseForm
        expenses={expenses}
        setExpenses={setExpenses}
      />
      
      <button

  onClick={() =>

    exportFinanceReport({

      totalIncome,

      totalExpenses,

      totalSavings,

      walletBalance,

      expenses,

      incomeData

    })

  }
  

  className="
  bg-blue-500
  hover:bg-blue-600
  text-white
  px-6
  py-3
  rounded-xl
  shadow
  "

>

  📄 Export PDF

</button>

      {/* Analytics */}
      <ExpenseAnalytics
        expenses={expenses}
      />

      

      {/* Calendar */}
      <ExpenseCalendar
        expenses={expenses}
      />

      {/* Daily Summary */}
      
      <DailySummary
        expenses={expenses}
      />
      <AIInsights
        expenses={expenses}
      />  
      <WasteInsights
        expenses={expenses}
     />
      <TrendAnalysis
         expenses={expenses}
      />
      <FinancialScore
        walletBalance={walletBalance}
        expenses={expenses}
      />
      <AIAssistant
  expenses={expenses}
  walletBalance={walletBalance}
/>

<SavingsGoal
  walletBalance={walletBalance}
/>
    </div>

  )

}

export default Dashboard