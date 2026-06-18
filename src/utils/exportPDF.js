import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export const exportFinanceReport = ({

  totalIncome,
  totalExpenses,
  totalSavings,
  walletBalance,

  incomeData = [],
  expenses = []

}) => {

  const doc = new jsPDF()

  // ==========================
  // PAGE 1
  // SUMMARY
  // ==========================

  doc.setFontSize(22)

  doc.text(
    "Personal Finance Report",
    14,
    20
  )

  doc.setFontSize(12)

  doc.text(

    `Generated: ${new Date().toLocaleDateString()}`,

    14,

    30

  )

  autoTable(doc, {

    startY: 40,

    head: [[

      "Metric",

      "Amount"

    ]],

    body: [

      [

        "Total Income",

        `Rs. ${totalIncome}`

      ],

      [

        "Total Expenses",

        `Rs. ${totalExpenses}`

      ],

      [

        "Total Savings",

        `Rs. ${totalSavings}`

      ],

      [

        "Wallet Balance",

        `Rs. ${walletBalance}`

      ]

    ]

  })

  // ==========================
  // PAGE 2
  // INCOME HISTORY
  // ==========================

  doc.addPage()

  doc.setFontSize(18)

  doc.text(

    "Income History",

    14,

    20

  )

  autoTable(doc, {

    startY: 30,

    head: [[

      "Date",

      "Time",

      "Source",

      "Amount"

    ]],

    body:

      incomeData.map(
        item => [

          item.date || "-",

          item.time || "-",

          item.source || "-",

          `Rs. ${item.amount}`

        ]
      )

  })

  // ==========================
  // PAGE 3
  // EXPENSE HISTORY
  // ==========================

  doc.addPage()

  doc.setFontSize(18)

  doc.text(

    "Expense History",

    14,

    20

  )

  autoTable(doc, {

    startY: 30,

    head: [[

      "Date",

      "Time",

      "Purpose",

      "Category",

      "Amount"

    ]],

    body:

      (Array.isArray(expenses)
 ? expenses
 : []
).map(
        
        item => [

          item.date || "-",

          item.time || "-",

          item.purpose || "-",

          item.category || "-",

          `Rs. ${item.amount}`

        ]
        
      )
      

  })

  // ==========================
  // PAGE 4
  // CATEGORY SUMMARY
  // ==========================

  const categoryTotals = {};

 (Array.isArray(expenses)
 ? expenses
 : []
).map(
    expense => {

      const category =

        expense.category ||

        "Others"

      categoryTotals[
        category
      ] =

        (
          categoryTotals[
            category
          ] || 0
        ) +

        Number(
          expense.amount
        )

    }
  )

  doc.addPage()

  doc.setFontSize(18)

  doc.text(

    "Expense Category Summary",

    14,

    20

  )

  autoTable(doc, {

    startY: 30,

    head: [[

      "Category",

      "Amount"

    ]],

    body:

      Object.entries(
        categoryTotals
      ).map(

        ([category, amount]) => [

          category,

          `Rs. ${amount}`

        ]

      )

  })

  // ==========================
  // SAVE
  // ==========================

  doc.save(
    "Finance_Report.pdf"
  )

}