import BitsLogo from './images/IPC-Logo.jpeg'
import placeHolder from './images/placeHolder.jpeg'
import Orientation_1 from './images/Orientation_1.jpeg'
import Orientation_2 from './images/Orientation_2.JPG'
import Orientation_3 from './images/Orientation_3.JPG'
import Orientation_4 from './images/Orientation_4.JPG'
import Orientation_5 from './images/Orientation_5.JPG'
import React, { useState } from 'react';
import './App.css';
import Axios from 'axios'
import Profile from './components/Profile'

const registerUrl = "http://172.24.16.141:8000/api/register"


function App() {
  const [capture,setCapture] = useState(false)
  const [values, setValues] = useState({
    id: '',
    student_name: '',
    images:[],
    error: false,
    success: false
  });

  const { id, student_name, images } = values;

  console.log(values)
  const handleChange = name => event => {
    console.log(name)
    if(name==='images'){
      const newVals = {...values}  
      newVals.images = [];  
      for (let i = 0; i < event.target.files.length; i++) {
        newVals.images.push(event.target.files[i]);
      }
      setValues(newVals);
    }else{
      setValues({ ...values, error: false, [name]: event.target.value });
    }
  
  };

  const handleSubmit = async (event)=>{
    event.preventDefault();
  
    try{
  
    const formData = new FormData();
    formData.append("id", id)
    formData.append("name", student_name)  
   

    if(!capture){
      images.forEach((image) => formData.append("images", image));

      if( images.length !== 5){
       
        setValues({...values,error:'5 images required!',images:[],success:false})
        return
      }
    }
   

    let response
    try {
     
      response = await Axios.post(registerUrl, formData);
      setValues({id: '',  student_name: '', images:images,error:false,success:'Form submitted successfully'})
    
    } catch (error) {

      setValues({...values,error:'server error'})

    }
       
 
        return response
            
    }catch(error){
      console.log(error)
            return error.response
    }  
   
  }


  let renderCapture = (<div>
    <Profile />
  </div>)

  return (
    <div className="App">
      <div>
        <div className='logo-wrapper'>
        
          <img src={BitsLogo}/>
      
        </div>
        <div style={{display:'flex',marginTop:'2em',justifyContent:'flex-end'}}>
        <div style={{backgroundColor:'#faca2c',height:'6px',width:'12%'}}>
          
          </div>
          <div style={{backgroundColor:'#6cbfe7',height:'6px',width:'12%'}}>
          
          </div>
          <div style={{backgroundColor:'#ed1c24',height:'6px',width:'12%'}}>
          
          </div>
        </div>
        <div style={{backgroundColor:'grey',height:'1px',width:'100%'}}></div>
        <div style={{ width:'80%', margin:'1em auto', color:'#211d70', fontWeight:'bold', fontSize:'22px'}}>BITS Pilani :: Entry/Exit Registration Portal</div>
        <div style={{ width:'80%', margin:'1em auto', fontSize:'17px'}}>
        Welcome to the User Entry/Exit Registration page! Please upload 5 images of yourself to showcase your beautiful smile, confident posture, and charismatic personality. Make sure the images are aligned in the orientation shown below to ensure a seamless and professional look. Don't forget to enter your BITS ID (For example: 2019B2A70898P) and your name in the designated fields. Your BITS ID helps us to identify you and your name lets us know who we are dealing with. Thank you for your cooperation, and we look forward to seeing your photos!
        </div>
        <div style={{display:'flex', width:'80%', margin:'0 auto', justifyContent:'space-around'}}>
        {[{image:Orientation_1,text:"Forward Face"},{image:Orientation_2,text:"Left Facing"},{image:Orientation_3,text:"Right Facing"},{image:Orientation_4,text:"Down Facing"},{image:Orientation_5,text:"Up Facing"}].map((doc,index)=>{
          
         return (<div key={index}> 
            <div>{doc.text}</div>
            <div>
            <img style={{ height:'215px', width:'200px', marginTop:'10px', marginRight:'20px'}} src={doc.image} />
            </div>
            
            </div>)

        })}
         </div>
       
     
        <div>
          <form onSubmit={handleSubmit}>
            {values.error && <div style={{marginTop:'1em', color:'red'}}> {values.error} </div>}
            {values.success && <div style={{marginTop:'1em', color:'green'}}> {values.success} </div>}
            <div style={{marginTop:'2em'}}>
            <input maxlength="13" minlength="13" required name='id'  style={{width:'20%'}} placeholder='BITS ID' onChange={handleChange('id')} value={id}></input>
            </div>
            <div style={{marginTop:'2em'}}>
            <input required  name='student_name' style={{width:'20%'}} placeholder='Name' onChange={handleChange('student_name')} value={student_name}></input>
            </div>
            <div style={{marginTop:'1em'}}>
              <button
              style={{cursor:'pointer', width:'100px'}}
              type="button"
              onClick={()=>{
                setCapture(false)
                setValues({...values, error:false, success:false})
              }}
              >
                Upload 
              </button>
              <button
               style={{cursor:'pointer',width:'100px'}}
              type="button"
              onClick={()=>{
                setValues({...values, error:false, success:false})
                setCapture(true)
              }}
              >
              Capture
              </button>

            </div>

            {capture?(
              <div>{renderCapture}</div>
            ):<div style={{marginTop:'2em'}} >
            <input required name='images' style={{width:'20%'}} multiple accept="image/*" type="file"  onChange={handleChange('images')}  />
            </div>}

          {/* <div style={{marginTop:'2em'}} >
            <input required name='images' style={{width:'20%'}} multiple accept="image/*" type="file"  onChange={handleChange('images')}  />
            </div> */}
            
           <button type="submit" style={{marginTop:'2em', cursor:'pointer'}}>Submit</button>
          </form>
        </div>
        <div style={{display:'flex',marginTop:'2em',justifyContent:'flex-start'}}>
        <div style={{backgroundColor:'#faca2c',height:'6px',width:'12%'}}>
          
          </div>
          <div style={{backgroundColor:'#6cbfe7',height:'6px',width:'12%'}}>
          
          </div>
          <div style={{backgroundColor:'#ed1c24',height:'6px',width:'12%'}}>
          
          </div>
         
        </div>
        <div style={{backgroundColor:'grey',height:'1px',width:'100%'}}></div>
      </div>

    </div>
  );
}

export default App;
