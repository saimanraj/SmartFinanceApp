import { useEffect, useState } from "react"

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where
} from "firebase/firestore"

import {
  auth,
  db
} from "../firebase/firebase"



function ReminderPage() {

  const notificationSound =
  new Audio(
    "/notification.mp3"
  )

  const [purpose,
    setPurpose] =
    useState("")

  const [notes,
    setNotes] =
    useState("")

  const [date,
    setDate] =
    useState("")

  const [time,
    setTime] =
    useState("")

  const [reminders,
    setReminders] =
    useState([])

  const [editingId,
    setEditingId] =
    useState(null)

    const [triggeredReminders,
  setTriggeredReminders] =
  useState([])

  const [notified,
  setNotified] =
  useState([])
  
useEffect(() => {

  const interval =

    setInterval(() => {

      reminders.forEach(

        (reminder) => {

          const now =
            new Date()

          const reminderTime =
            new Date(
              `${reminder.date}T${reminder.time}`
            )

          const diff =

            Math.abs(
              reminderTime - now
            )

          if (

            diff < 60000 &&

            !notified.includes(
              reminder.id
            )

          ) {

            notificationSound.play()

            alert(
              `🔔 ${reminder.purpose}`
            )

            setNotified(
              prev => [
                ...prev,
                reminder.id
              ]
            )

          }

        }

      )

    }, 1000)

  return () =>
    clearInterval(
      interval
    )

}, [reminders, notified])


  const fetchReminders =
    async () => {

      const user =
        auth.currentUser

      if (!user) return

      const q = query(

        collection(
          db,
          "reminders"
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

      setReminders(data)

    }

  const handleSave =
    async () => {

      if (
        !purpose ||
        !date ||
        !time
      ) {

        alert(
          "Fill all fields"
        )

        return

      }

      const selectedDate =
        new Date(
          `${date}T${time}`
        )

      const now =
        new Date()

      if (
        selectedDate <= now
      ) {

        alert(
          "Choose future date and time"
        )

        return

      }

      const user =
        auth.currentUser

      if (!user) return

      const reminderData = {

        purpose,

        notes,

        date,

        time,

        userId:
          user.uid,

        createdAt:
          new Date()

      }

      try {

        if (
          editingId
        ) {

          await updateDoc(

            doc(
              db,
              "reminders",
              editingId
            ),

            reminderData

          )

          setEditingId(
            null
          )

        } else {

          await addDoc(

            collection(
              db,
              "reminders"
            ),

            reminderData

          )

        }

        setPurpose("")
        setNotes("")
        setDate("")
        setTime("")

        fetchReminders()

      } catch (error) {

        console.error(
          error
        )

      }

    }

  const handleDelete =
    async (id) => {

      await deleteDoc(

        doc(
          db,
          "reminders",
          id
        )

      )

      fetchReminders()

    }

  const handleEdit =
    reminder => {

      setEditingId(
        reminder.id
      )

      setPurpose(
        reminder.purpose
      )

      setNotes(
        reminder.notes
      )

      setDate(
        reminder.date
      )

      setTime(
        reminder.time
      )

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
      mb-6
      ">

        🔔 Reminder Center

      </h1>

      <div className="
      bg-white
      p-6
      rounded-2xl
      shadow
      mb-8
      ">

        <div className="
        grid
        md:grid-cols-2
        gap-4
        ">

          <input

            type="text"

            placeholder="Purpose"

            value={purpose}

            onChange={(e) =>
              setPurpose(
                e.target.value
              )
            }

            className="
            border
            p-3
            rounded-xl
            "

          />

          <input

            type="date"

            value={date}

            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }

            onChange={(e) =>
              setDate(
                e.target.value
              )
            }

            className="
            border
            p-3
            rounded-xl
            "

          />

          <input

            type="time"

            value={time}

            onChange={(e) =>
              setTime(
                e.target.value
              )
            }

            className="
            border
            p-3
            rounded-xl
            "

          />

          <textarea

            placeholder="Notes"

            value={notes}

            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }

            className="
            border
            p-3
            rounded-xl
            "

          />

        </div>

        <button

          onClick={
            handleSave
          }

          className="
          mt-4
          bg-blue-500
          hover:bg-blue-600
          text-white
          px-6
          py-3
          rounded-xl
          "

        >

          {

            editingId

            ? "Update Reminder"

            : "Add Reminder"

          }

        </button>

      </div>

      <div className="
      space-y-4
      ">

        {

          reminders

          .sort(

            (a, b) =>

              new Date(
                `${a.date}T${a.time}`
              )

              -

              new Date(
                `${b.date}T${b.time}`
              )

          )

          .map(

            reminder => {

              const reminderDate =

                new Date(

                  `${reminder.date}T${reminder.time}`

                )

              const overdue =

                reminderDate <
                new Date()

              return (

                <div

                  key={
                    reminder.id
                  }

                  className={`

                  p-5

                  rounded-2xl

                  shadow

                  ${overdue

                    ? "bg-red-100"

                    : "bg-white"}

                  `}

                >

                  <h2 className="
                  text-xl
                  font-bold
                  ">

                    {
                      reminder.purpose
                    }

                  </h2>

                  <p>

                    📝 {
                      reminder.notes
                    }

                  </p>

                  <p>

                    📅 {
                      reminder.date
                    }

                  </p>

                  <p>

                    ⏰ {
                      reminder.time
                    }

                  </p>

                  {

                    overdue &&

                    <p className="
                    text-red-600
                    font-bold
                    ">

                      🔴 Overdue

                    </p>

                  }

                  <div className="
                  mt-3
                  flex
                  gap-3
                  ">

                    <button

                      onClick={() =>
                        handleEdit(
                          reminder
                        )
                      }

                      className="
                      bg-yellow-400
                      px-4
                      py-2
                      rounded-xl
                      "

                    >

                      ✏ Edit

                    </button>

                    <button

                      onClick={() =>
                        handleDelete(
                          reminder.id
                        )
                      }

                      className="
                      bg-red-500
                      text-white
                      px-4
                      py-2
                      rounded-xl
                      "

                    >

                      🗑 Delete

                    </button>

                  </div>

                </div>

              )

            }

          )

        }

      </div>

    </div>

  )

}

export default ReminderPage