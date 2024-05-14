import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
const Logout = () => {
    useEffect(() => {
        (async () => {
            try {
                //Invoke REST API to logout user and clear local Storage.
                const {data} = await axios.post('http://localhost:8000/logout/',{
                    refresh_token:localStorage.getItem('refresh_token')
                } ,{headers: {
                    'Content-Type': 'application/json'
                }}, {withCredentials: true});

                console.log('logout', data)
                localStorage.clear();
                axios.defaults.headers.common['Authorization'] = null;
                window.location.href = '/'
            } catch (e) {
                console.log('logout not working')
            }
        })();
    }, []);

    return (
        <div></div>
    )
};

export default Logout;
