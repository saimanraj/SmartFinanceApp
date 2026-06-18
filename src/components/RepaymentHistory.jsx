function RepaymentHistory({

  repayments = []

}) {

  if (
    !repayments ||
    repayments.length === 0
  ) {

    return (

      <div
        className="
        mt-4
        bg-gray-50
        p-4
        rounded-xl
      "
      >

        <p
          className="
          text-gray-500
          text-sm
        "
        >

          No repayment history

        </p>

      </div>

    )

  }

  return (

    <div
      className="
      mt-4
      bg-white
      p-4
      rounded-xl
      border
    "
    >

      <h3
        className="
        text-lg
        font-bold
        mb-3
      "
      >

        Repayment History 📜

      </h3>

      <div
        className="
        space-y-2
      "
      >

        {repayments.map(

          (
            repayment,
            index
          ) => (

            <div

              key={index}

              className="
              flex
              justify-between
              items-center
              bg-gray-100
              p-3
              rounded-xl
              "

            >

              <div>

                <p
                  className="
                  font-semibold
                  text-green-700
                  "
                >

                  ₹{repayment.amount}

                </p>

              </div>

              <div>

                <p
                  className="
                  text-sm
                  text-gray-500
                  "
                >

                  📅 {repayment.date}

                </p>

              </div>

            </div>

          )

        )}

      </div>

    </div>

  )

}

export default RepaymentHistory