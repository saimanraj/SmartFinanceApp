import { useEffect, useState } from "react"

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore"

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

  // Fetch Records
  const fetchRecords =
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

        const data =
          querySnapshot.docs.map(
            (doc) => ({

              id: doc.id,

              ...doc.data(),

            })
          )

        setRecords(data)

      } catch (error) {

        console.error(
          "Fetch Error:",
          error
        )

      } finally {

        setLoading(false)

      }

  }

  useEffect(() => {

    fetchRecords()

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

  // Dashboard Totals

  const totalGiven =

    records

      .filter(
        (record) =>
          record.type ===
          "given"
      )

      .reduce(
        (sum, record) =>

          sum +
          (record.amount || 0),

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
        (sum, record) =>

          sum +
          (record.amount || 0),

        0
      )

  const totalPaid =

    records.reduce(
      (sum, record) =>

        sum +
        (record.paidAmount || 0),

      0
    )

  const totalRemaining =

    records.reduce(
      (sum, record) =>

        sum +
        (record.remainingAmount || 0),

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

      {/* Title */}

      <h1 className="
      text-4xl
      font-bold
      text-center
      mb-8
      ">

        Lending Manager 💸

      </h1>

      {/* Form */}

      <LendingForm
        fetchRecords={
          fetchRecords
        }
      />

      {/* Dashboard */}

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

      {/* Search */}

      <LendingSearch

        searchTerm={
          searchTerm
        }

        setSearchTerm={
          setSearchTerm
        }

      />

      {/* Records */}

      <div className="
      space-y-4
      ">

        {loading ? (

          <div className="
          text-center
          py-10
          ">

            Loading...

          </div>

        ) : filteredRecords.length === 0 ? (

          <div className="
          text-center
          py-10
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

                fetchRecords={
                  fetchRecords
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