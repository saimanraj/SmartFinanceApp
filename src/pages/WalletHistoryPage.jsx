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

function WalletHistoryPage() {

  const [
    transactions,
    setTransactions
  ] = useState([])

  const [
    loading,
    setLoading
  ] = useState(true)

  useEffect(() => {

    fetchTransactions()

  }, [])

  const fetchTransactions =
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
            "walletTransactions"
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

        setTransactions(
          data
        )

      } catch (error) {

        console.error(
          "Wallet Error:",
          error
        )

      } finally {

        setLoading(false)

      }

  }

  // Total Wallet Income

  const totalIncome =

    transactions.reduce(

      (sum, item) =>

        sum +
        Number(
          item.amount || 0
        ),

      0

    )

  // Group By Date

  const groupedData = {}

  transactions.forEach(
    transaction => {

      const date =
        transaction.date

      if (
        !groupedData[
          date
        ]
      ) {

        groupedData[
          date
        ] = []

      }

      groupedData[
        date
      ].push(
        transaction
      )

    }
  )

  return (

    <div className="
    min-h-screen
    bg-gray-100
    p-6
    ">

      {/* Header */}

      <h1 className="
      text-4xl
      font-bold
      text-center
      mb-8
      ">

        Wallet History 💰

      </h1>

      {/* Summary Cards */}

      <div className="
      grid
      md:grid-cols-2
      gap-4
      mb-8
      ">

        <div className="
        bg-green-500
        text-white
        p-6
        rounded-2xl
        shadow-lg
        hover:scale-105
        transition-all
        duration-300
        ">

          <h2 className="
          text-lg
          font-semibold
          ">

            Total Income

          </h2>

          <p className="
          text-3xl
          font-bold
          mt-2
          ">

            ₹{totalIncome}

          </p>

        </div>

        <div className="
        bg-blue-500
        text-white
        p-6
        rounded-2xl
        shadow-lg
        hover:scale-105
        transition-all
        duration-300
        ">

          <h2 className="
          text-lg
          font-semibold
          ">

            Transactions

          </h2>

          <p className="
          text-3xl
          font-bold
          mt-2
          ">

            {transactions.length}

          </p>

        </div>

      </div>

      {loading ? (

        <div className="
        text-center
        text-xl
        ">

          Loading...

        </div>

      ) : transactions.length === 0 ? (

        <div className="
        bg-white
        p-8
        rounded-2xl
        shadow
        text-center
        text-gray-500
        ">

          No Wallet Transactions Found

        </div>

      ) : (

        Object.keys(
          groupedData
        )

        .reverse()

        .map(
          date => {

            const dateTotal =

              groupedData[
                date
              ].reduce(

                (
                  sum,
                  item
                ) =>

                  sum +
                  Number(
                    item.amount
                  ),

                0

              )

            return (

              <div

                key={date}

                className="
                bg-white
                rounded-2xl
                shadow-lg
                p-6
                mb-6
                "

              >

                <div className="
                flex
                justify-between
                items-center
                mb-4
                ">

                  <h2 className="
                  text-xl
                  font-bold
                  ">

                    📅 {date}

                  </h2>

                  <span className="
                  bg-green-100
                  text-green-700
                  px-4
                  py-2
                  rounded-full
                  font-semibold
                  ">

                    ₹{dateTotal}

                  </span>

                </div>

                {

                  groupedData[
                    date
                  ]

                  .map(
                    item => (

                      <div

                        key={
                          item.id
                        }

                        className="
                        flex
                        justify-between
                        items-center
                        border-b
                        py-3
                        hover:bg-gray-50
                        transition-all
                        "

                      >

                        <div>

                          <p className="
                          font-semibold
                          ">

                            💵 {
                              item.source
                            }

                          </p>

                          <p className="
                          text-sm
                          text-gray-500
                          ">

                            ⏰ {
                              item.time
                            }

                          </p>

                        </div>

                        <div className="
                        text-green-600
                        font-bold
                        text-lg
                        ">

                          ₹{
                            item.amount
                          }

                        </div>

                      </div>

                    )
                  )

                }

              </div>

            )

          }
        )

      )}

    </div>

  )

}

export default WalletHistoryPage