import React from 'react'
import { Link } from 'react-router-dom';
import Like from './like';
import VideoItem from './videoitem';
import MyListEntry from './mylistentry';
import 'bootstrap/dist/css/bootstrap.min.css';

// Creates a row for each video item with Like and Add/ Remove to/ From My List buttons.
const Video = React.forwardRef(({ video }, ref) => {    
    const videoBody = (
      <div class="border border-secondary m-0 rounded"> 
            <div class="container">
                <VideoItem videoId={video.id} title={video.title} desc={video.desc} mediaDesc={video.media_desc} 
                genreDesc={video.genre_desc} imag={video.imag} cast={video.cast} director={video.director}
                releaseDt={video.release_dt} mediaTyp={video.media_typ} genre={video.genre}/>
            </div>
            <div class='d-flex align-items-center justify-content-start'>
                <div class="d-flex flex-row m-1 p-2">
                    <Like videoId={video.id} likes={video.likes} curUsrLike={video.cur_usr_like}/>
                    <MyListEntry videoId={video.id} curUsrLstE={video.cur_usr_lst_e} filter={video.filter}/>
                </div>
            </div>     
        </div>
    )

    const content = ref
        ? <div ref={ref}>{videoBody}</div>
        : <div>{videoBody}</div>

    return content
})

export default Video