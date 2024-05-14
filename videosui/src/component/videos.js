import { useState, useRef, useCallback } from 'react'
import useVideos from './useVideos'
import Video from './Video'
import {useLocation} from "react-router-dom";

const Videos = () => {
    const sortBy = async o => {
        setSortOrder(o)
        window.location.href = '/?f='+filter+'&o='+o
    }
    const sortOrders = [
        { label: 'Release Date Descending', value: 0 }, 
        { label: 'Release Date Ascending', value: 1 }, 
        { label: 'Title Ascending', value: 2 }, 
        { label: 'Title Descending', value: 3 }, 
    ];

    // Set username, search criteria, and sort order
    // with UseState hook

    let u = ''
    if (localStorage.getItem('username') !== null) {  
        u = localStorage.getItem('username');    
    }
    const [ username, setUsername ] = useState(u);

    // Read query parameters with useLocation hook

    let location = useLocation()
    let params = new URLSearchParams(location.search)
    let filterParam = params.get('f')
    const [filter, setFilter] = useState(filterParam)
    const [pageNum, setPageNum] = useState(1)
    let sortOrderParam = params.get('o')
    const [sortOrder, setSortOrder] = useState(sortOrderParam)

    // Use custom hook useVideos to fetch videos, handle error
    // and loading state

    const {
        isLoading,
        isError,
        error,
        results,
        hasNextPage
    } = useVideos(pageNum, username, filter, sortOrder)

    const intObserver = useRef()
    const lastVideoRef = useCallback(video => {
        if (isLoading) return

        if (intObserver.current) intObserver.current.disconnect()

        // Use Intersection Observer API to asynchronously observe changes
        // in the intersection of a target element 

        intObserver.current = new IntersectionObserver(videos => {
            if (videos[0].isIntersecting && hasNextPage) {
                console.log('We are near the last video!')
                setPageNum(prev => prev + 1)
            }
        })

        if (video) intObserver.current.observe(video)
    }, [isLoading, hasNextPage])

    if (isError) return <p className='center'>Error: {error.message}</p>

    // Add ref to only last element conditionally. 
    // If ref exists it means that it is a last element, so fetch more videos.
    const content = results.map((video, i) => {  
        video.filter = filter
        if (results.length === i + 1) {
            return <Video ref={lastVideoRef} key={video.id} video={video} />
        }
        return <Video key={video.id} video={video} />
    })

    return (
        <div id="content" class="ui container">
            <div >
                <div className="m-0" hidden={filter=='null' || filter==null || filter=='undefined'}>
                    <h4>{filter=='mylist'?'My List':'Your Search: '+filter}</h4>
                </div>
                <div className="m-0" hidden={!(filter=='null' || filter==null || filter=='undefined')}>
                    <h4>All Videos</h4>
                </div>
                <form>
                    <div>                                
                        <div className="form-group m-1 d-flex align-items-center justify-content-end p-2" >
                            <label>Sort by &nbsp;
                                <select value={sortOrder} onChange={e => {sortBy(e.target.value);}}>
                                    {sortOrders.map((sortOrder) => (
                                        <option value={sortOrder.value}>{sortOrder.label}</option>
                                    ))}
                                </select>&nbsp;
                            </label>  
                        </div>
                    </div>
                </form>
            </div>      
            {content}
            {isLoading && <p className="center">Loading More Posts...</p>}
            <p className="center"><a href="#">Back to Top</a></p>
        </div>
    )
}
export default Videos