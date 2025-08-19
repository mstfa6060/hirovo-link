class ApiService {
    static async call<T>(apiCall: Promise<any>): Promise<T> {
        try {
            const response = await apiCall;

            if (response.data) {
                return response.data;
            }

            return response;
        } catch (error: any) {
            console.error('API Error:', error);

            if (error.response) {
                // Server responded with error status
                const { status, data } = error.response;
                throw new Error(data?.message || `HTTP Error: ${status}`);
            } else if (error.request) {
                // Network error
                throw new Error('Network error. Please check your internet connection.');
            } else {
                // Other error
                throw error;
            }
        }
    }
}

export { ApiService };
