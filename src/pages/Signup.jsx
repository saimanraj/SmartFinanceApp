import { useState } from "react"

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from "firebase/auth"

import { auth }
from "../firebase/firebase"

import {
  useNavigate
} from "react-router-dom"

function Signup() {

  const navigate =
    useNavigate()

  const [email,
    setEmail] =
    useState("")

  const [password,
    setPassword] =
    useState("")

  const [loading,
    setLoading] =
    useState(false)

  const handleSignup =
    async () => {

      try {

        if (
          !email ||
          !password
        ) {

          alert(
            "Fill all fields"
          )

          return

        }

        setLoading(true)

        const userCredential =

          await createUserWithEmailAndPassword(

            auth,

            email,

            password

          )

        await sendEmailVerification(

          userCredential.user

        )

        await signOut(auth)

        alert(

          "Verification email sent 📧. Kindly verify before login (check in spam folder )."

        )

        navigate("/Login")

      } catch (error) {

        alert(
          error.message
        )

      } finally {

        setLoading(false)

      }

    }

  return (

    <div className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-gray-100
    ">

      <div className="
      bg-white
      p-8
      rounded-2xl
      shadow-lg
      w-[400px]
      ">

        <h1 className="
        text-3xl
        font-bold
        mb-6
        text-center
        ">

          Signup 🚀

        </h1>

        <div className="
        space-y-4
        ">

          <input

            type="email"

            placeholder="Email"

            className="
            w-full
            border
            p-3
            rounded-xl
            "

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

          />

          <input

            type="password"

            placeholder="Password"

            className="
            w-full
            border
            p-3
            rounded-xl
            "

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

          />

          <button

            onClick={
              handleSignup
            }

            disabled={
              loading
            }

            className="
            w-full
            bg-blue-500
            text-white
            p-3
            rounded-xl
            hover:bg-blue-600
            "

          >

            {loading
              ? "Creating..."
              : "Create Account"}

          </button>

          <button

            onClick={() =>
              navigate("/Login")
            }

            className="
            w-full
            bg-gray-200
            p-3
            rounded-xl
            "

          >

            Already have an account?

          </button>

        </div>

      </div>

    </div>

  )

}

export default Signup