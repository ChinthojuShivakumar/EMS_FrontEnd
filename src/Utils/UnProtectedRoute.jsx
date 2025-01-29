import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

const UnProtectedRoute = ({ children }) => {
    const token = JSON.parse(localStorage.getItem("token"))
    const location = useLocation();


    return !token ? (
        <div>
            {children}
        </div>
    ) : (
        <Navigate to="/" replace state={{ path: location.pathname }} />
    );
}
UnProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired, // 'children' must be a React node
}

export default UnProtectedRoute