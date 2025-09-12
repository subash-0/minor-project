import axios from "axios";
import toast from "react-hot-toast";

export const colorizeHistory = async () => {
    try {
        const url = `${import.meta.env.VITE_BASE_URL}/api/v1/search-history`;
        
        const response = await axios.get(url, { withCredentials: true });

        return response.data.data;
        
        // if (response.data.success) {
        //     console.log(response.data);
        //     return response.data;
        // } else {
        //     toast.error(response.data.message);
        //     return;
        // }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Error Response:", error.response);
            toast.error(error.response.data.message);
        } else {
            console.error("Unexpected Error:", error);
            toast.error('An error occurred. Please try again later.');
        }
        return;
    }
};


export const updateLabel = async (id: string, label: string) => {
    try {
        const url = `${import.meta.env.VITE_BASE_URL}/api/v1//update-label/${id}`;
        
        const response = await axios.put(url, { label }, { withCredentials: true });

        if (response.data.message) {
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.error(response.data.message);
            return;
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Error Response:", error.response);
            toast.error(error.response.data.message);
        } else {
            console.error("Unexpected Error:", error);
            toast.error('An error occurred. Please try again later.');
        }
        return;
    }
}


export const deleteHistory = async (id: string) => {
    try {
        const url = `${import.meta.env.VITE_BASE_URL}/api/v1/delete-image/${id}`;
        
        const response = await axios.delete(url, { withCredentials: true });     
            toast.success(response.data.message);
            return response.data;
      
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Error Response:", error.response);
            toast.error(error.response.data.message);
        } else {
            console.error("Unexpected Error:", error);
            toast.error('An error occurred. Please try again later.');
        }
        return;
    }
}


// export const colorizeImage = async (selectedImage: File, label: string) => {
//     try {
//         const url = `${import.meta.env.VITE_BASE_URL}/api/v1/color-image`;
//         console.log(selectedImage);
//         const formData = new FormData(); // Create a new FormData instance
//         formData.append("whiteimage", selectedImage); // Append the file
//         formData.append("label", label); // Append the label

//         const response = await axios.post(url, formData, {
//             withCredentials: true,
//             headers: { "Content-Type": "multipart/form-data" }, // Ensure correct content type
//         });

//         return response.data.data;
//     } catch (error) {
//         if (axios.isAxiosError(error) && error.response) {
//             console.error("Error Response:", error.response);
//             toast.error(error.response.data.message);
//         } else {
//             console.error("Unexpected Error:", error);
//             toast.error("An error occurred. Please try again later.");
//         }
//         return;
//     }
// };

export const colorizeImage = async (selectedImage: File, label: string) => {
    try {
        const url = `${import.meta.env.VITE_BASE_URL}/api/v1/color-image`;

        const formData = new FormData();
        formData.append("whiteimage", selectedImage);
        formData.append("label", label);

        
        const response = await axios.post(url, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }, 
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message);
        } else {
            toast.error("An error occurred. Please try again later.");
        }
        return;
    }
};
   


export const searchOneHistory = async (id: string) => {

    try {
        const url = `${import.meta.env.VITE_BASE_URL}/api/v1/search-one/${id}`;
        
        const response = await axios.get(url, { withCredentials: true });

        if(response.data.status === 404){
            toast.error(response.data.message);
            return;
        }
        return response.data.data;
        
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Error Response:", error.response);
            toast.error(error.response.data.message);
        } else {
            console.error("Unexpected Error:", error);
            toast.error('An error occurred. Please try again later.');
        }
        return;
    }
};



export const downloadImage = ({imageUrl,label}:{imageUrl:string,label:string}) => {
      fetch(imageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${label}.jpg`); // or any other extension
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('Image downloaded successfully');
        })

            
           
    
  };
  