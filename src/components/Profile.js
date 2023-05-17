import React, { useState } from 'react'
import Webcam from 'react-webcam'
import Axios from 'axios'


const registerUrl = "https://eerportal.bits-pilani.ac.in/backend/api/register"

const WebcamComponent = () => <Webcam />

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: 'user',
}

const Profile = (props) => {
  const [pictures, setPictures] = useState([])
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState(false)

  const webcamRef = React.useRef(null)

  const capture = React.useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot()
    setPictures([...pictures,pictureSrc])
  })



  async function upload(pictures) {

    
    const formData = new FormData();
    const {id, student_name, setValues} = props

    console.log( 'props',props)

    if(id==='' || student_name===''){
      setError('Above feilds and 5 images are required!')
      return
    }else{
      setError(false)
    }

    if(id.length<13){
      setError('id should be 13 characters long!')
      return
    }else{
      setError(false)
    }

    formData.append("id", id)
    formData.append("name", student_name)  
    const files = [];

    if(pictures.length<5){
      setError('5 images are required!')
      return
    }else{
      setError(false)
    }

    async function processArray() {
        
      for (let i = 0; i < pictures.length; i++) {
          const base64Image = pictures[i];
          const byteCharacters = atob(base64Image.split(',')[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let j = 0; j < byteCharacters.length; j++) {
            byteNumbers[j] = byteCharacters.charCodeAt(j);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/png' });
          const file = new File([blob], `image${i}.png`, { type: 'image/png' });
          files.push(file);
      }
      
      return files; 
       
    }

    await processArray();
    console.log('files',files);

    files.forEach(file=>formData.append('images',file))
    // let res = await Axios.post(uploadUrl, formData);
    
    let response

    try {
      response = await Axios.post(registerUrl, formData);
      if(response.status===200){
          setUploaded(true)
          setValues({id: '',  student_name: '', images:[],error:false,success:'Form submitted successfully'})
      }

    
    } catch (error) {

    console.log(error)

    }
       
  }

  return (
    <div>
      {error && <div style={{marginTop:'1em', color:'red'}}> {error} </div>}
      {/* { uploaded && (<div style={{color:'green'}}>
       Uploaded successfully!
      </div>)} */}
      <h2 className="mb-5 text-center">
        Photos Captured: {pictures.length}
      </h2>
      <div>
        {pictures.length < 5 && (
          <Webcam
            audio={false}
            height={400}
            ref={webcamRef}
            width={400}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        )}
      </div>
     
      <div>
        {pictures.length < 5 ?
        (
            <button
              onClick={(e) => {
                e.preventDefault()
                capture()
              }}
              className="btn btn-danger"
              style={{cursor:'pointer'}}
            >
              Capture
            </button>
          ):
        (
            <>
          <button
            onClick={(e) => {
              e.preventDefault()
              setPictures([])
              setUploaded(false)
            }}
            
            style={{cursor:'pointer'}}
          >
            Retake
          </button>
           
           </>
        ) 
        }
      </div>
      {!uploaded && <div>

        
        {pictures.length ? (
            <>
        {pictures.map((picture,index)=>
          <img style={{marginRight:'2em', marginTop:'2em', width: '200px', height:'200px'}} key={index} src={picture} />
        )}
        </>
        ):<></>}
      </div>}
     
     
      <button 
           onClick={(e) => {
            e.preventDefault()
            upload(pictures)
           }}
            style={{ cursor:'pointer', marginTop: '2em'}}>
            Save
            </button>
    </div>
  )
}

export default Profile