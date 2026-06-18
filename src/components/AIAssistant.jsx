import { useState } from "react"

function AIAssistant({

  expenses,
  walletBalance

}) {

  const [question, setQuestion] =
    useState("")

  const [response, setResponse] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const handleAskAI = async () => {

    if (!question.trim()) {

      alert("Please enter question")

      return

    }

    try {

      setLoading(true)

      setResponse("Thinking... 🤖")

      // Build expense history
      const expenseHistory =
        expenses.map(

          (expense) =>

            `${expense.category} - ₹${expense.amount} for ${expense.purpose}`

        ).join("\n")

      // Prompt
      const prompt = `

You are a smart financial assistant.

Wallet Balance:
₹${walletBalance}

Expenses:
${expenseHistory}

User Question:
${question}

Give practical financial advice.

`
const apiKey =
  import.meta.env.VITE_GROQ_API_KEY

const apiResponse =
  await fetch(

    "https://api.groq.com/openai/v1/chat/completions",

    {

      method: "POST",

      headers: {

        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${apiKey}`

      },

      body: JSON.stringify({

        model:
          "llama-3.3-70b-versatile",

        messages: [

          {

            role: "system",

            content:
              "You are a smart financial assistant. Give practical money-saving advice."

          },

          {

            role: "user",

            content: prompt

          }

        ],

        temperature: 0.7

      })

    }

  )

const data =
  await apiResponse.json()

console.log(
  "Groq Response:",
  data
)

if (data.error) {

  setResponse(
    data.error.message
  )

  return

}

const aiText =

  data.choices?.[0]
      ?.message?.content

  ||

  "No response generated."

setResponse(aiText)

    } catch (error) {

      console.error(
        "AI Error:",
        error
      )

      setResponse(
        "AI request failed ❌"
      )

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="mt-10">

      <div className="
      bg-gradient-to-r
      from-violet-500
      to-purple-600
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
        text-center
        ">

          AI Financial Assistant 🤖

        </h2>

        {/* Input */}
        <div className="
        flex
        flex-col
        md:flex-row
        gap-4
        ">

          <input

            type="text"

            placeholder="Ask financial question..."

            value={question}

            onChange={(e) =>
              setQuestion(
                e.target.value
              )
            }

            className="
            flex-1
            p-4
            rounded-xl
            text-black
            outline-none
            "

          />

          <button

            onClick={handleAskAI}

            disabled={loading}

            className="
            bg-white
            text-purple-700
            font-bold
            px-6
            py-3
            rounded-xl
            hover:bg-purple-100
            hover:scale-105
            active:scale-95
            transition-all
            duration-300
            shadow-md
            cursor-pointer
            disabled:opacity-50
            "

          >

            {loading
              ? "Thinking..."
              : "Ask AI ✨"}

          </button>

        </div>

        {/* Response */}
        {response && (

          <div className="
          mt-6
          bg-white/20
          p-5
          rounded-2xl
          ">

            <h3 className="
            text-xl
            font-bold
            mb-3
            ">

              AI Response 🧠

            </h3>

            <p className="
            text-lg
            leading-relaxed
            whitespace-pre-line
            ">

              {response}

            </p>

          </div>

        )}

      </div>

    </div>

  )

}

export default AIAssistant