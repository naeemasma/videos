import axios from "axios";

// Every time a request is made with the axios instance, if we encounter error code 401, 
// we will create the POST request and get the new access token and refresh token and 
// reinitialize the token in localStorage and send the original request.

let refresh = false;
axios.interceptors.response.use(resp => resp, async error => {
    if (error.response.status === 401 && !refresh) {
        refresh = true;

        console.log(localStorage.getItem('refresh_token'))
        const response = await axios.post('http://localhost:8000/token/refresh/', {
            refresh:localStorage.getItem('refresh_token')
        }, {
            headers: {
              'Content-Type': 'application/json',
            }
          },{withCredentials: true});

        if (response.status === 200) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['access']}`;
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            return axios(error.config);
        }
    }
    refresh = false;
    return error;
});