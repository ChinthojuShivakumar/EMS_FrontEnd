import PropTypes from "prop-types";
import Pagination from "../Pagination/Pagination";

const TableComponent = ({ headers, data, totalPages, currentPage, handlePageChange }) => {
    const isISODateString = (value) => {
        // Check if value is a string and matches ISO 8601 date format
        return typeof value === "string" && !isNaN(Date.parse(value));
    };

    return (
        <div>
            <table className="w-full text-center">
                <thead className="bg-green-300">
                    <tr>
                        {headers.length > 0 &&
                            headers?.map((header) => (
                                <th className="py-2 border-r-2" key={header?._id}>
                                    {header.header}
                                </th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.length > 0 &&
                        data?.map((row, rowIndex) => {
                            return (
                                <tr key={rowIndex} className="text-center font-thin border-2 border-opacity-85">
                                    {headers.map((header, colIndex) => {
                                        return (
                                            <td className="py-2 border-r-2" key={colIndex}>
                                                {header.render
                                                    ? header.render(row[header.key], row, rowIndex)
                                                    : isISODateString(row[header.key])
                                                    ? new Date(row[header.key]).toLocaleDateString() // Format the ISO date string
                                                    : row[header.key] === null
                                                    ? "Not Available"
                                                    : row[header.key] || ""}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    <tr className="text-center font-thin border-2 border-opacity-85">
                        <td colSpan={headers.length} className="px-4 py-4 bg-gray-100">
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                handlePageChange={handlePageChange}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

TableComponent.propTypes = {
    headers: PropTypes.array.isRequired,
    data: PropTypes.array,
    totalPages: PropTypes.any,
    currentPage: PropTypes.number.isRequired,
    handlePageChange: PropTypes.func.isRequired,
};

export default TableComponent;
