import {

  useEffect,
  useState

} from "react"

import {

  collection,
  getDocs,
  query,
  where

} from "firebase/firestore"

import {

  auth,
  db

} from "../firebase/firebase"

function ExpenseHistoryPage() {

  const [expenses,
    setExpenses] =
    useState([])

  const [loading,
    setLoading] =
    useState(true)

  useEffect(() => {

    fetchExpenses()

  }, [])

  const fetchExpenses =
    async () => {

      try {

        const user =
          auth.currentUser

        if (!user) {

          setLoading(false)

          return

        }

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

        const snapshot =
          await getDocs(q)

        const data =
          snapshot.docs.map(
            doc => ({

              id: doc.id,

              ...doc.data()

            })
          )

        setExpenses(
          data
        )

      } catch (error) {

        console.error(
          error
        )

      } finally {

        setLoading(false)

      }

  }

  const groupedExpenses = {}

  expenses.forEach(
    expense => {

      const date =
        expense.date

      if (
        !groupedExpenses[
          date
        ]
      ) {

        groupedExpenses[
          date
        ] = []

      }

      groupedExpenses[
        date
      ].push(
        expense
      )

    }
  )

  return (

    <div
      className="
      min-h-screen
      bg-gray-100
      p-6
      "
    >

      <h1
        className="
        text-4xl
        font-bold
        mb-8
        "
      >

        Expense History 💸

      </h1>

      {loading ? (

        <div>

          Loading...

        </div>

      ) : (

        Object.keys(
  groupedExpenses
)

.sort(

  (a, b) => {

    const [da, ma, ya] =
      a.split("/")

    const [db, mb, yb] =
      b.split("/")

    const dateA =
      new Date(
        ya,
        ma - 1,
        da
      )

    const dateB =
      new Date(
        yb,
        mb - 1,
        db
      )

    return (
      dateB - dateA
    )

  }

)
        .map(
          date => {

            let total = 0

            groupedExpenses[
              date
            ]

            .forEach(
              item => {

                total +=
                  Number(
                    item.amount
                  )

              }
            )

            return (

              <div

                key={date}

                className="
                bg-white
                rounded-2xl
                shadow
                p-5
                mb-5
                "

              >

                <div
  className="
  flex
  justify-center
  items-center
  mb-4
  "
>

  <h2
    className="
    text-2xl
    font-bold
    "
  >

    📅 {date}

  </h2>

</div>

                {

                  groupedExpenses[date]

.sort(

  (a, b) =>

    new Date(
      `1970/01/01 ${b.time}`
    ) -

    new Date(
      `1970/01/01 ${a.time}`
    )

)

                  .map(
                    item => (

                      <div

                        key={
                          item.id
                        }

                        className="
                        flex
                        justify-between
                        py-2
                        border-b
                        "

                      >

                        <div>

                          <p>

                            {
                              item.purpose
                            }

                          </p>

                          <p
                            className="
                            text-xs
                            text-gray-500
                            "
                          >

                            {
                              item.time
                            }

                          </p>

                        </div>

                        <div
                          className="
                          text-red-600
                          font-bold
                          "
                        >

                          ₹{
                            item.amount
                          }

                        </div>

                      </div>

                    )
                  )

                }

                <div
                  className="
                  mt-4
                  text-right
                  text-lg
                  font-bold
                  text-red-600
                  "
                >

                  Total:
                  ₹{total}

                </div>

              </div>

            )

          }
        )

      )}

    </div>

  )

}

export default ExpenseHistoryPage