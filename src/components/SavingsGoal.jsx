import {

  useEffect,
  useState

} from "react"

import {

  doc,
  getDoc,
  setDoc,
  deleteDoc

} from "firebase/firestore"

import {

  auth,
  db

} from "../firebase/firebase"

function SavingsGoal() {

  const [goalName, setGoalName] =
    useState("")

  const [targetAmount,
    setTargetAmount] =
    useState("")

  const [savedAmount,
    setSavedAmount] =
    useState(0)

  const [newSaving,
    setNewSaving] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  // Fetch Goal
  useEffect(() => {

    const fetchGoal = async () => {

      try {

        const user =
          auth.currentUser

        if (!user) return

        const goalRef = doc(

          db,

          "savingsGoals",

          user.uid

        )

        const goalSnap =
          await getDoc(goalRef)

        if (goalSnap.exists()) {

          const data =
            goalSnap.data()

          setGoalName(
            data.goalName || ""
          )

          setTargetAmount(
            data.targetAmount || ""
          )

          setSavedAmount(
            data.savedAmount || 0
          )

        }

      } catch (error) {

        console.error(
          "Goal Fetch Error:",
          error
        )

      }

    }

    fetchGoal()

  }, [])

  // Save Goal
  const handleSaveGoal =
    async () => {

      try {

        setLoading(true)

        const user =
          auth.currentUser

        if (!user) return

        await setDoc(

          doc(
            db,
            "savingsGoals",
            user.uid
          ),

          {

            goalName,

            targetAmount:
              Number(
                targetAmount
              ),

            savedAmount,

            updatedAt:
              new Date(),

          }

        )

        alert(
          "Goal Saved 🎉"
        )

      } catch (error) {

        console.error(
          "Save Goal Error:",
          error
        )

      } finally {

        setLoading(false)

      }

  }

  // Add Savings
  const handleAddSavings =
    async () => {

      // Prevent adding after completion
      if (progress >= 100) {

        alert(
          "Goal already completed 🎉"
        )

        return

      }

      if (!newSaving) return

      try {

        let updatedSavings =

          savedAmount +
          Number(newSaving)

        // Limit to target amount
        if (

          updatedSavings >
          targetAmount

        ) {

          updatedSavings =
            Number(targetAmount)

        }

        setSavedAmount(
          updatedSavings
        )

        setNewSaving("")

        const user =
          auth.currentUser

        if (!user) return

        await setDoc(

          doc(
            db,
            "savingsGoals",
            user.uid
          ),

          {

            goalName,

            targetAmount:
              Number(
                targetAmount
              ),

            savedAmount:
              updatedSavings,

            updatedAt:
              new Date(),

          }

        )

      } catch (error) {

        console.error(
          "Add Saving Error:",
          error
        )

      }

  }

  // Delete Goal
  const handleDeleteGoal =
    async () => {

      try {

        const user =
          auth.currentUser

        if (!user) return

        await deleteDoc(

          doc(
            db,
            "savingsGoals",
            user.uid
          )

        )

        // Reset States
        setGoalName("")
        setTargetAmount("")
        setSavedAmount(0)
        setNewSaving("")

        alert(
          "Goal Deleted Successfully 🗑"
        )

      } catch (error) {

        console.error(
          "Delete Goal Error:",
          error
        )

      }

  }

  // Progress
  const progress =

    targetAmount > 0

      ? Math.min(

          (
            savedAmount /
            targetAmount
          ) * 100,

          100

        )

      : 0

  // Remaining
  const remainingAmount =

    targetAmount -
    savedAmount

  return (

    <div className="mt-10">

      <div className="
      bg-gradient-to-r
      from-emerald-500
      to-green-600
      text-white
      p-6
      rounded-2xl
      shadow-lg
      ">

        {/* Title */}
        <h2 className="
        text-2xl
        font-bold
        mb-6
        ">

          Savings Goal Tracker 🎯

        </h2>

        {/* Goal Inputs */}
        <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-4
        ">

          {/* Goal Name */}
          <input

            type="text"

            placeholder="Goal Name"

            value={goalName}

            onChange={(e) =>
              setGoalName(
                e.target.value
              )
            }

            className="
            p-4
            rounded-xl
            text-black
            outline-none
            "

          />

          {/* Target */}
          <input

            type="number"

            placeholder="Target Amount"

            value={targetAmount}

            onChange={(e) =>
              setTargetAmount(
                e.target.value
              )
            }

            className="
            p-4
            rounded-xl
            text-black
            outline-none
            "

          />

        </div>

        {/* Buttons */}
        <div className="
        flex
        flex-wrap
        gap-4
        mt-6
        ">

          {/* Save Goal */}
          <button

            onClick={handleSaveGoal}

            disabled={loading}

            className="
            bg-white
            text-green-700
            font-bold
            px-6
            py-3
            rounded-xl
            hover:bg-green-100
            hover:scale-105
            active:scale-95
            transition-all
            duration-300
            shadow-md
            "

          >

            Save Goal 💾

          </button>

          {/* Delete Goal */}
          {goalName && (

            <button

              onClick={
                handleDeleteGoal
              }

              className="
              bg-red-500
              hover:bg-red-600
              hover:scale-105
              active:scale-95
              transition-all
              duration-300
              text-white
              font-bold
              px-6
              py-3
              rounded-xl
              shadow-md
              "

            >

              Delete Goal 🗑

            </button>

          )}

        </div>

        {/* Goal Details */}
        {goalName && (

          <div className="mt-8">

            <div className="
            flex
            justify-between
            mb-3
            ">

              <h3 className="
              text-xl
              font-bold
              ">

                {goalName}

              </h3>

              <p className="
              font-semibold
              ">

                {progress.toFixed(1)}%

              </p>

            </div>

            {/* Progress Bar */}
            <div className="
            w-full
            bg-white/30
            rounded-full
            h-6
            overflow-hidden
            ">

              <div

                className="
                bg-white
                h-6
                rounded-full
                transition-all
                duration-500
                "

                style={{
                  width:
                    `${progress}%`
                }}

              ></div>

            </div>

            {/* Stats */}
            <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
            mt-6
            ">

              <div className="
              bg-white/20
              p-4
              rounded-xl
              ">

                <p>🎯 Target</p>

                <h4 className="
                text-2xl
                font-bold
                ">

                  ₹{targetAmount}

                </h4>

              </div>

              <div className="
              bg-white/20
              p-4
              rounded-xl
              ">

                <p>💰 Saved</p>

                <h4 className="
                text-2xl
                font-bold
                ">

                  ₹{savedAmount}

                </h4>

              </div>

              <div className="
              bg-white/20
              p-4
              rounded-xl
              ">

                <p>📉 Remaining</p>

                <h4 className="
                text-2xl
                font-bold
                ">

                  ₹{remainingAmount}

                </h4>

              </div>

            </div>

            {/* Add Savings */}
            <div className="
            mt-8
            flex
            flex-col
            md:flex-row
            gap-4
            ">

              <input

                type="number"

                placeholder="Add Savings Amount"

                value={newSaving}

                onChange={(e) =>
                  setNewSaving(
                    e.target.value
                  )
                }

                disabled={
                  progress >= 100
                }

                className="
                flex-1
                p-4
                rounded-xl
                text-black
                outline-none
                disabled:bg-gray-300
                "

              />

              <button

                onClick={
                  handleAddSavings
                }

                disabled={
                  progress >= 100
                }

                className="
                bg-white
                text-green-700
                font-bold
                px-6
                py-3
                rounded-xl
                hover:bg-green-100
                hover:scale-105
                active:scale-95
                transition-all
                duration-300
                shadow-md
                disabled:bg-gray-300
                disabled:text-gray-500
                disabled:cursor-not-allowed
                "

              >

                Add Savings ➕

              </button>

            </div>

            {/* Motivation */}
            <div className="
            mt-6
            bg-white/20
            p-5
            rounded-2xl
            ">

              <p className="
              text-lg
              leading-relaxed
              ">

                {progress >= 100

                  ? "🎉 Goal completed successfully! Create a new goal after deleting this one."

                  : progress >= 70

                  ? "🔥 Almost there! Keep saving."

                  : progress >= 40

                  ? "👍 Good progress. Stay consistent."

                  : "🚀 Start saving regularly to reach your goal."}

              </p>

            </div>

          </div>

        )}

      </div>

    </div>

  )

}

export default SavingsGoal