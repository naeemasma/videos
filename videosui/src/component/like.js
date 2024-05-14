import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";

// allows a signed-in user to toggle whether or not they “like” that video.
const Like = (props) => {   
  const submitform = async e => {
    e.preventDefault();
    save(e)
  }
  
  const save = async e => { 
    if(localStorage.getItem('access_token') === null){
      window.location.href = '/login'  
    }
    else{   
      const like = {
        videoId: videoId
      };
      const {data} = await axios.post('http://localhost:8000/like', like ,{headers: {
        'Content-Type': 'application/json'
      }}, {withCredentials: true});
      if(data){  
        console.log('data.count: ' + data)                
        setLikeCnt(data.count)
        if(data.curUsrLike && data.curUsrLike>0){
          setButton('Unlike')
        }else{
          setButton('Like')
        }
      }
    }
  }

  let videoIdProp = props.videoId
  let likesCntProp = props.likes  
  let btn = 'Like'  
  if(props.curUsrLike > 0){btn = 'Unlike'}
  const [button, setButton] = useState(btn);
  const [videoId, setVideoId] = useState(videoIdProp);
  const [likeCnt, setLikeCnt] = useState(likesCntProp);
  const [loading, setLoading] = useState(true);
  useEffect(() => {  
      setLoading(false);       
  }, []);

  return(
    <div class="p-2">
      <form onSubmit={submitform}>
      {!loading ?
        <div> 
          <button type="submit" id="like" name="like" onClick={e => setButton(e.target.name)} className="btn btn-primary btn-sm">
              {button}
          </button>            
          {likeCnt > 0 ?`${likeCnt} Like(s)`:''} 
        </div>
        : <div> Loading... </div>
      }
      </form>
    </div>
  )
}  

export default Like;
