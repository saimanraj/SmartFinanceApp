import { useState }
from "react"

import {

  signInWithEmailAndPassword,

  signOut

} from "firebase/auth"

import { auth }
from "../firebase/firebase"

import {
  useNavigate
} from "react-router-dom"

function Login() {

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

  const handleLogin =
    async () => {

      try {

        setLoading(true)

        const userCredential =

          await signInWithEmailAndPassword(

            auth,

            email,

            password

          )

        const user =
          userCredential.user

        await user.reload()

        if (
          !user.emailVerified
        ) {

          await signOut(auth)

          alert(

            "Kindly verify your email before login (check in spam folder )📧"

          )

          return

        }

        alert(
          "Login successful ✅"
        )

        navigate(
          "/dashboard"
        )

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

          Login 🔐

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
              handleLogin
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
              ? "Logging in..."
              : "Login"}

          </button>

          <button

            onClick={() =>
              navigate("/")
            }

            className="
            w-full
            bg-gray-200
            p-3
            rounded-xl
            "

          >

            Go to Signup

          </button>

        </div>

      </div>

    </div>

  )

}

export default Login