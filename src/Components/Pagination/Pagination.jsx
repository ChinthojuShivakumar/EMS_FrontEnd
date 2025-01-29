import PropTypes from "prop-types"


const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
    const generatePageNumbers = () => {
        const maxPagesToShow = 5
        const pageNumbers = []

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            pageNumbers.push(1)
            if (currentPage > 3) pageNumbers.push("...")
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pageNumbers.push(i)
            }
            if (currentPage < totalPages - 2) pageNumbers.push("...")
            pageNumbers.push(totalPages)
        }
        return pageNumbers
    }
    return (
        <div className="w-full flex justify-end items-center gap-5">
            <button
                type="button"
                className="w-32 bg-green-600 text-white py-2 rounded-sm text-center shadow-md disabled:cursor-not-allowed disabled:bg-gray-500"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage == 1}
            >
                Previous
            </button>
            {generatePageNumbers().map((page, index) =>
                page === "..." ? (
                    <span key={index} className="px-4 py-2">
                        ...
                    </span>
                ) : (
                    <button
                        key={index}
                        className={`px-4 py-2 border rounded-md ${currentPage === page
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        onClick={() => handlePageChange(page)}
                    >
                        {String(page)}
                    </button>
                )
            )}
            <button
                className="w-32 bg-green-600 text-white py-2 rounded-sm text-center shadow-md disabled:cursor-not-allowed disabled:bg-gray-500" type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    )
}

Pagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    handlePageChange: PropTypes.func
}

export default Pagination