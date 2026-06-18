function LendingSearch({

  searchTerm,
  setSearchTerm,

}) {

  return (

    <div className="mb-6">

      <input

        type="text"

        placeholder="🔍 Search Person"

        value={searchTerm}

        onChange={(e) =>
          setSearchTerm(
            e.target.value
          )
        }

        className="
        w-full
        border
        border-gray-300
        p-4
        rounded-2xl
        shadow-sm
        focus:outline-none
        focus:ring-2
        focus:ring-blue-400
        "

      />

    </div>

  )

}

export default LendingSearch