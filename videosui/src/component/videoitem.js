import React from "react";
import {useState} from "react";
import axios from "axios";
import {useLocation} from "react-router-dom";
import {useEffect} from "react";

// Video Item
const VideoItem = (props) => {

  const submitform = async e => {
    e.preventDefault();
    if(button === 'save') save(e) 
    if(button === 'cancel') cancel(e)           
    if(button === 'edit') edit(e) 
  }

  // edit function makes the form editable and 
  // keeps a copy of old values in case user decides to 
  // cancel edit
  const edit = async e => {
    setPrvTitle(title)
    setPrvDesc(desc)
    setPrvCast(cast)
    setPrvDirector(director)
    setPrvImag(imag)
    setPrvGenreDesc(genreDesc)
    setPrvMediaTypeDesc(mediaTypeDesc)
    setPrvGenre(genre)
    setPrvMediaTyp(mediaTyp)
    setPrvReleaseDt(releaseDt)
    setEditable(true)
  } 

  // cancel function resets previous video attributes
  const cancel = async e => {
    setTitle(prvTitle)
    setDesc(prvDesc)
    setCast(prvCast)
    setDirector(prvDirector)
    setImag(prvImag)
    setGenreDesc(prvGenreDesc)
    setMediaTypeDesc(prvMediaTypeDesc)
    setGenre(prvGenre)
    setMediaTyp(prvMediaTyp)
    setReleaseDt(prvReleaseDt)    
    setMessage('');
    setEditable(false);
    if(create === 'y') window.location.href='/'
  } 

  // save function allows an admin user to add a new video to the catalog or
  // edit information of an existing video using REST API
  // Displays error if any
  const save = async e => {
    try {
      const video = {
        title: title,
        desc: desc,
        cast: cast,
        director: director,
        imag: imag,
        releaseDt: releaseDt,
        genre: genre,
        mediaTyp: mediaTyp
      };      
      if(create === 'y'){
        const {data} = await axios.post('http://localhost:8000/videos', video ,{headers: {
        'Content-Type': 'application/json'}}, {withCredentials: true});
        if(data.error)
          setMessage(data.error)
        else{  
          window.location.href='/'
        }
      }else{ 
        const {data} = await axios.put('http://localhost:8000/videos/'+videoIdProp, video,{headers: {
          'Content-Type': 'application/json'}}, {withCredentials: true});
          if(data.error)
            setMessage(data.error)
          else{  
            setMessage('');     
            setEditable(false);
          }
      }
    } catch (e) {
      setMessage('Operation failure: save video')
    }
  }  
  // Set values with useState hook
  const [action, setAction] = useState('');  
  const [prvTitle, setPrvTitle] = useState(''); 
  const [prvDesc, setPrvDesc] = useState(''); 
  const [prvCast, setPrvCast] = useState(''); 
  const [prvDirector, setPrvDirector] = useState(''); 
  const [prvImag, setPrvImag] = useState(''); 
  const [prvReleaseDt, setPrvReleaseDt] = useState(''); 
  const [prvGenre, setPrvGenre] = useState(''); 
  const [prvMediaTyp, setPrvMediaTyp] = useState(''); 
  const [prvGenreDesc, setPrvGenreDesc] = useState(''); 
  const [prvMediaTypeDesc, setPrvMediaTypeDesc] = useState(''); 
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState(''); 
  const [cast, setCast] = useState(''); 
  const [director, setDirector] = useState(''); 
  const [imag, setImag] = useState(''); 
  const [releaseDt, setReleaseDt] = useState(''); 
  const [genre, setGenre] = useState(''); 
  const [mediaTyp, setMediaTyp] = useState(''); 
  const [genreDesc, setGenreDesc] = useState(''); 
  const [mediaTypeDesc, setMediaTypeDesc] = useState(''); 
  const [button, setButton] = useState('');
  const [editable, setEditable] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');
  
  const genres = [
    { label: 'Action', value: 'ACTION' }, 
    { label: 'Animation', value: 'ANIMATION' }, 
    { label: 'Comedy', value: 'COMEDY' }, 
    { label: 'Drama', value: 'DRAMA' }, 
    { label: 'Romance', value: 'ROMANCE' }, 
    { label: 'SciFi', value: 'SCIFI' }, 
    { label: 'UnSpecified', value: 'UNSPECIFIED' }, 
  ];
  const mediaTypes = [ 
    { label: 'Movie', value: 'MOVIE' }, 
    { label: 'TVshow', value: 'TV' },
  ];
  const getMediaTypeDesc = (val) => {
    let ret = ''
    mediaTypes.map((mediaType) => {
      if(mediaType.value === val){
        ret = mediaType.label}
    })
    return ret
  }
  const getGenreDesc = (val) => {
    let ret = ''
    genres.map((genre) => {
      if(genre.value === val){
        ret = genre.label}
    })
    return ret
  }

  // read query parameter 'create' with useLocation hook
  // to display new video page

  let location = useLocation()
  let params = new URLSearchParams(location.search)
  let create = params.get('create')
  let videoIdProp = props.videoId

  // disply error if user is not authenticated or 
  // doesn't have admin permissions
  useEffect(() => {    
    if(localStorage.getItem('access_token') !== null
      && localStorage.getItem('is_admin_user') !== null
      ){
        setIsAdmin(true) 
    }else{
      if(create === 'y') setMessage('Save Video Operation is Not Permitted')
    }

    // read video attributes passed in props
    setTitle(props.title)
    setDesc(props.desc)
    setCast(props.cast)
    setDirector(props.director)
    setImag(props.imag)
    setGenreDesc(props.genreDesc)
    setMediaTypeDesc(props.mediaDesc)
    setGenre(props.genre)
    setMediaTyp(props.mediaTyp)
    setReleaseDt(props.releaseDt)

    // Make the form editable for create new video page
    if(create === 'y'){
      setEditable(true)
      setAction('create')
      setGenre('UNSPECIFIED'); 
      setMediaTyp('MOVIE');    
    }
  }, []);

  return(
      <div class="border border-secondary mt-3 p-4 rounded">
      <form onSubmit={submitform}>
        <div>              
          {editable ? 
            <div className="form-group mt-3" >
              <h3>{action==='create'?'New Video': 'Edit Video'}</h3>
              <div className="d-flex flex-row form-group mt-0"><div class="p-2 mt-0 w-100">
                <label>Title</label>
                <input
                  className="form-control mt-1"
                  placeholder="Enter Title"
                  name='title'
                  type='text'
                  value={title}
                  required
                  onChange={e => setTitle(e.target.value)}
                />
              </div></div>                
              <div className="d-flex flex-row form-group mt-0"><div class="p-2 mt-0 w-100">
                <label>Description</label>
                <textarea
                  name='desc'
                  type="text"
                  className="form-control mt-1"
                  placeholder="Enter Description"
                  value={desc}
                  required
                  onChange={e => setDesc(e.target.value)}
                />
              </div></div>
              <div className="d-flex flex-row form-group mt-0"><div class="p-2 mt-0 w-100">
                <label>Cast</label>
                <input
                  className="form-control mt-1"
                  placeholder="Enter Cast"
                  name='cast'
                  type='text'
                  value={cast}
                  required
                  onChange={e => setCast(e.target.value)}
                />
              </div></div>
              <div className="d-flex flex-row form-group mt-0"><div class="p-2 mt-0 w-100">
                <label>Director</label>
                <input
                  className="form-control mt-1"
                  placeholder="Enter Director"
                  name='director'
                  type='text'
                  value={director}
                  required
                  onChange={e => setDirector(e.target.value)}
                />
              </div></div>
              <div className="d-flex flex-row form-group mt-0"><div class="p-2 mt-0 w-100 align-items-center">
                <label>Image</label>
                <input
                  className="form-control mt-1"
                  placeholder="Enter Image"
                  name='imag'
                  type='text'
                  value={imag}
                  onChange={e => setImag(e.target.value)}
                />
              </div></div>
              <div className="d-flex flex-row form-group mt-0"><div class="p-2 mt-0 w-100">
                <label>Select Media Type &nbsp;
                    <select value={mediaTyp} onChange={e => {setMediaTyp(e.target.value);setMediaTypeDesc(getMediaTypeDesc(e.target.value))}} required>
                        {mediaTypes.map((mediaType) => (
                            <option value={mediaType.value}>{mediaType.label}</option>
                        ))}
                    </select>
                </label>            
              </div></div>
              <div className="d-flex flex-row form-group mt-0"><div class="p-2 mt-0 w-100">
                <label>Select Genre &nbsp;
                    <select value={genre} onChange={e =>  {setGenre(e.target.value);setGenreDesc(getGenreDesc(e.target.value))}} required>
                        {genres.map((genre) => (
                            <option value={genre.value}>{genre.label}</option>
                        ))}
                    </select>
                </label>            
              </div></div>
              <div className="d-flex flex-row form-group mt-0"><div class="p-2 mt-0">
                <label>Release Date</label>
                <input
                  className="form-control mt-1"
                  placeholder="Enter Release Date"
                  name='releaseDt'
                  type='date'
                  value={releaseDt}
                  required
                  onChange={e => setReleaseDt(e.target.value)}
                />
              </div></div>  
              <div className="form-group mt-3">
                <p class="text-danger">{message}</p>       
              </div>  
              <div class="d-flex justify-content-center"> 
                <div class="d-flex flex-row m-1"> 
                  <div class="p-1">
                    <button type="submit" id="save" name="save" onClick={e => setButton(e.target.name)} className="btn btn-primary btn-sm" disabled={!isAdmin}>
                      Save
                    </button>
                  </div>
                  <div class="p-1">  
                    <button type="submit" id="cancel" name="cancel" onClick={e => setButton(e.target.name)} className="btn btn-primary btn-sm" formnovalidate="formnovalidate">
                      Cancel
                    </button>
                  </div> 
                </div>
              </div>         
          </div>
          :<div className="form-group mt-0">
            <div>              
                <div > 
                  <div class="text-secondary"><b>Title: <em>{title}</em></b></div>
                  <div class="text-secondary">Description: {desc}</div>   
                  <div class="text-secondary">Media Type: {mediaTypeDesc}</div> 
                  <div class="text-secondary">Genre: {genreDesc}</div> 
                  <div class="text-secondary">Image: <img src={imag} alt={title} /></div>                                     
                  <div class="text-secondary">Cast: {cast}</div>          
                  <div class="text-secondary">Director: {director}</div>
                  <div class="text-secondary">Release Date: {releaseDt}</div> 
                </div>
                <div class="d-flex justify-content-end" > 
                <div class="d-flex flex-row m-1"> 
                  <div class="p-1" hidden={!isAdmin}>
                    <button type="submit" id="edit" name="edit" onClick={e => setButton(e.target.name)} className="btn btn-primary btn-sm">
                      Edit
                    </button>
                  </div>
                </div>
              </div> 
            </div>
          </div>}
        </div>
      </form>
  </div>
  )
}

export default VideoItem;
