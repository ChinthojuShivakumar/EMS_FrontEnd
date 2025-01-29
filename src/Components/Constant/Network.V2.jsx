import { axiosInstanceV2 } from "../../Utils/axiosSetUp.V2";


const successStatusCodes = [200, 201, 202, 204, 205, 206];
const userToken = JSON.parse(localStorage.getItem("token-newPanel"));

export const postApiV2 = async (url, formData, isMultipart = false) => {
    try {
        const headers = isMultipart
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" };
        const response = await axiosInstanceV2.post(url, formData, { headers })
        if (successStatusCodes.includes(response.status)) {
            return response
        } else {
            throw response
        }
    } catch (error) {
        console.log(error);
        return error.response
    }
}

export const fetchApiV2 = async (url) => {
    try {
        const response = await axiosInstanceV2.get(url)

        if (successStatusCodes.includes(response.status)) {
            return response
        } else {
            throw response
        }
    } catch (error) {
        console.log(error);
        return error.response
    }
}


export const patchApiV2 = async (url, formData) => {
    try {
        const response = await axiosInstanceV2.patch(url, formData)

        if (successStatusCodes.includes(response.status)) {
            return response
        } else {
            throw response
        }
    } catch (error) {
        console.log(error);
        return error.response
    }
}


export const putApiV2 = async (url, formData) => {
    try {
        const response = await axiosInstanceV2.put(url, formData)

        if (successStatusCodes.includes(response.status)) {
            return response
        } else {
            throw response
        }
    } catch (error) {
        console.log(error);
        return error.response
    }
}

export const deleteApiV2 = async (url) => {
    try {
        const response = await axiosInstanceV2.delete(url)

        if (successStatusCodes.includes(response.status)) {
            return response
        } else {
            throw response
        }
    } catch (error) {
        console.log(error);
        return error.response
    }
}


export const exportApiV2 = async (url, fileName = "Download") => {
    try {
        const response = await axiosInstanceV2({
            url: url,
            method: 'get',
            responseType: 'blob', // Ensures response is received as a file blob
            headers: userToken ? { Authorization: `Bearer ${userToken}` } : {}, // Add authorization if token is available
        });

        // Create URL for blob and set up download
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        const currentDate = new Date().toISOString().slice(0, 10); // Format date as YYYY-MM-DD
        link.href = blobUrl;
        link.setAttribute('download', `${fileName} ${currentDate}.xlsx`); // Sets dynamic filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up the link element

        // Display success message
        // successMessage("File downloaded successfully");
        return response.data;
    } catch (error) {

        return error;
    }
};