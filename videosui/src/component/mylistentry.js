import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";

// Allows a signed-in user to add/ remove item to/ from their MyList.
const MyListEntry = (props) => {   
  const submitform = async e => {
    e.preventDefault();
    save(e)
  }
  
  const save = async e => { 
    if(localStorage.getItem('access_token') === null){
      window.location.href = '/login'  
    }
    else{   
      const entry = {
        videoId: videoId
      };
      const {data} = await axios.post('http://localhost:8000/mylistentry', entry ,{headers: {
        'Content-Type': 'application/json'
      }}, {withCredentials: true});
      if(data){  
        if(data.cur_usr_lst_e && data.cur_usr_lst_e>0){
          setButton('Remove from My List')
        }else{
          setButton('Add to My List')
          if(filter === 'mylist')
            window.location.href = '/?f=mylist'
        }
      }
    }
  }

  let filterProp = props.filter
  let videoIdProp = props.videoId
  let btn = 'Add to My List'  
  if(props.curUsrLstE > 0){btn = 'Remove from My List'}
  const [button, setButton] = useState(btn);
  const [videoId, setVideoId] = useState(videoIdProp);
  const [filter, setFilter] = useState(filterProp);
  const [loading, setLoading] = useState(true);
  useEffect(() => {  
      setLoading(false);       
  }, []);

  return(
    <div class="p-2">
      <form onSubmit={submitform}>
      {!loading ?
        <div> 
          <button type="submit" id="mylistE" name="Add to My List" onClick={e => setButton(e.target.name)} className="btn btn-primary btn-sm">
              {button}
          </button>            
          {button === 'Remove from My List' ?` Added to My List`:''} 
        </div>
        : <div> Loading... </div>
      }
      </form>
    </div>
  )
}  

export default MyListEntry;
