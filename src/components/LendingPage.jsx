import { useEffect, useState } from "react"

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore"

import {
  onAuthStateChanged,
} from "firebase/auth"

import {
  auth,
  db,
} from "../firebase/firebase"

import LendingForm from "../components/LendingForm"
import LendingSummary from "../components/LendingSummary"
import LendingSearch from "../components/LendingSearch"
import LendingCard from "../components/LendingCard"

function LendingPage() {

  const [records, setRecords] =
    useState([])

  const [searchTerm,
    setSearchTerm] =
    useState("")

  const [loading,
    setLoading] =
    useState(true)

  const [currentUser,
    setCurrentUser] =
    useState(null)

  // Fetch Records
  const fetchRecords =
    async (user) => {

      try {

        if (!user) {

          setRecords([])
          setLoading(false)

          return

        }

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

        console.log(
          "User:",
          user.uid
        )

        console.log(
          "Records:",
          lendingData.length
        )

        setRecords(
          lendingData
        )

      } catch (error) {

        console.error(
          "Fetch Error:",
          error
        )

      } finally {

        setLoading(false)

      }

  }

  // Auth Listener
  useEffect(() => {

    const unsubscribe =

      onAuthStateChanged(

        auth,

        async (user) => {

          setCurrentUser(
            user
          )

          if (user) {

            await fetchRecords(
              user
            )

          } else {

            setRecords([])

            setLoading(false)

          }

        }

      )

    return () =>
      unsubscribe()

  }, [])

  // Search Filter
  const filteredRecords =

    records.filter(
      (record) =>

        record.personName
          ?.toLowerCase()

          .includes(

            searchTerm
              .toLowerCase()

          )
    )

  // Summary Data
  const totalGiven =

    records

      .filter(
        (record) =>
          record.type ===
          "given"
      )

      .reduce(

        (
          sum,
          record
        ) =>

          sum +

          (
            Number(
              record.amount
            ) || 0
          ),

        0

      )

  const totalBorrowed =

    records

      .filter(
        (record) =>
          record.type ===
          "borrowed"
      )

      .reduce(

        (
          sum,
          record
        ) =>

          sum +

          (
            Number(
              record.amount
            ) || 0
          ),

        0

      )

  const totalPaid =

    records.reduce(

      (
        sum,
        record
      ) =>

        sum +

        (
          Number(
            record.paidAmount
          ) || 0
        ),

      0

    )

  const totalRemaining =

    records.reduce(

      (
        sum,
        record
      ) =>

        sum +

        (
          Number(
            record.remainingAmount
          ) || 0
        ),

      0

    )

  const totalRecords =
    records.length

  const paidRecords =

    records.filter(
      (record) =>
        record.status ===
        "paid"
    ).length

  const pendingRecords =

    records.filter(
      (record) =>
        record.status ===
        "pending"
    ).length

  const overdueRecords =

    records.filter(
      (record) => {

        if (
          !record.repayDate
        ) return false

        return (

          new Date(
            record.repayDate
          ) < new Date()

          &&

          record.status !==
          "paid"

        )

      }
    ).length

  return (

    <div className="
    min-h-screen
    bg-gray-100
    p-6
    ">

      <div className="
      text-center
      mb-8
      ">

        <h1 className="
        text-4xl
        font-bold
        ">

          Lending Manager 💸

        </h1>

        <p className="
        text-gray-500
        mt-2
        ">

          Manage lending,
          borrowing and
          repayments

        </p>

      </div>

      <LendingForm
        fetchRecords={() =>
          fetchRecords(
            currentUser
          )
        }
      />

      <LendingSummary

        totalGiven={
          totalGiven
        }

        totalBorrowed={
          totalBorrowed
        }

        totalPaid={
          totalPaid
        }

        totalRemaining={
          totalRemaining
        }

        totalRecords={
          totalRecords
        }

        paidRecords={
          paidRecords
        }

        pendingRecords={
          pendingRecords
        }

        overdueRecords={
          overdueRecords
        }

      />

      <LendingSearch

        searchTerm={
          searchTerm
        }

        setSearchTerm={
          setSearchTerm
        }

      />

      <div className="
      space-y-4
      ">

        {loading ? (

          <div className="
          bg-white
          rounded-2xl
          p-8
          text-center
          shadow
          ">

            Loading...

          </div>

        ) : filteredRecords.length === 0 ? (

          <div className="
          bg-white
          rounded-2xl
          p-8
          text-center
          shadow
          text-gray-500
          ">

            No Records Found

          </div>

        ) : (

          filteredRecords.map(
            (record) => (

              <LendingCard

                key={
                  record.id
                }

                record={
                  record
                }

                fetchRecords={() =>
                  fetchRecords(
                    currentUser
                  )
                }

              />

            )
          )

        )}

      </div>

    </div>

  )

}

export default LendingPage