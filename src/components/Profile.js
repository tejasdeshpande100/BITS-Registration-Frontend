import React, { useState } from 'react'
import Webcam from 'react-webcam'
import Axios from 'axios'


const registerUrl = "http://localhost:8000/api/register"

const WebcamComponent = () => <Webcam />

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: 'user',
}

const Profile = () => {
  const [pictures, setPictures] = useState([])
  const [uploaded, setUploaded] = useState(false)

  const webcamRef = React.useRef(null)

  const capture = React.useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot()
    setPictures([...pictures,pictureSrc])
  })



  async function upload(pictures, filename) {

    
    const formData = new FormData();
    
    formData.append("id", '2019B3A70562P')
    formData.append("name", 'Tejas Deshpande')  
    const files = [];

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
        console.log('Done!');
        return files; 
       
    }

    await processArray();

    files.forEach(file=>formData.append('images',file))
    // let res = await Axios.post(uploadUrl, formData);
    
    let response

    try {
    response = await Axios.post(registerUrl, formData);
    if(response.status==200){
        setUploaded(true)
    }
    console.log(response)
    
    } catch (error) {

    console.log(error)

    }
       
  }

  return (
    <div>
      <h2 className="mb-5 text-center">
        Photo Capturing
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
           <button 
           onClick={(e) => {
            e.preventDefault()
            upload(pictures,'hello')
           }}
            style={{marginLeft:'2em', cursor:'pointer'}}>
            Save
            </button>
           </>
        ) 
        }
      </div>
      {!uploaded && <div>

        <div>
            Photos:
        </div>
        {pictures.length && (
            <>
        {pictures.map((picture,index)=>
          <img style={{marginRight:'2em', marginTop:'2em', width: '200px', height:'200px'}} key={index} src={picture} />
        )}
        </>
        )}
      </div>}
     
     { uploaded && (<div style={{color:'green'}}>
       Uploaded successfully!
      </div>)}
      
    </div>
  )
}

export default Profile