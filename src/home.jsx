import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useSnackbar } from "notistack";
import {
  Box,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
  Divider,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core"; 

import Format from "date-fns/format";
import {Close,Today,DateRange} from '@material-ui/icons';
import {HospitalAppointmentService} from "./utils/web_config";
import Doctors from "./assets/doctors.svg";
import AppointmentIcon from "./assets/appointment.png";

import Logo from "./assets/logo.png";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

const useStyles = makeStyles((theme) => ({
  header: {
    height:"70px"
  },
  middle:{
    height:"350px",
    backgroundColor:"#007ACC"
  },
  formControl:{
    backgroundColor:"#fff",
    // width:250,
    marginTop:50,
    borderRadius:5,
    textTransform:"capitalize"
  },
  container:{
    marginTop:80
  },
  title:{
    marginTop:50,
    color:"#fff"
  },
  footer:{
    height:"50px",
    backgroundColor:"#535A6B" 
  },
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  button:{
    textTransform:"capitalize" 
  }
}));

function Home(props){
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(()=>{
    axios.defaults.baseURL = new HospitalAppointmentService().BASE_URL;
    get_doctors();
  },[])

  // get list of doctors 
  const [doctors,setDoctors]=useState([]);
  const get_doctors=()=>{
    const doctorsInstance = axios.create(new HospitalAppointmentService().getMsHeaders());
    doctorsInstance.get("/api/v1/doctor",)
      .then(res=>{
       console.log(res.data.data);
       setDoctors(res.data.data);
      }).catch(err=>{
        var e = err.message;
        if (err.response) {
          e = err.response.data.message;
          enqueueSnackbar(e, {
            variant: "error",
            action: (k) => (
              <IconButton
                onClick={() => {
                  closeSnackbar(k);
                }}
                size="small"
              >
                <Close fontSize="small" />
              </IconButton>
            ),
          });
        }
      });
  }


  // get doctor appointment schedule 

  const [appointmentDate, setAppointmentDate] = useState({value:Format(new Date(), ["yyyy-MM-dd",]),error:""});
  const [doctorId,setDoctorId]=useState({value:0,error:""});

  const [appointmentLoad,setAppointmentLoad]=useState(false);
  const [appointments,setAppointments]=useState([]);
  const get_appointment=()=>{
    if(doctorId.value==0){
      enqueueSnackbar("Please select doctor", {
        variant: "error",
        action: (k) => (
          <IconButton
            onClick={() => {
              closeSnackbar(k);
            }}
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        ),
      });
      return
    }else{
      setAppointmentLoad(true);
      const appointmentInstance = axios.create(new HospitalAppointmentService().getMsHeaders());
      var obj={
        id:doctorId.value,
        date:appointmentDate.value
      };
      appointmentInstance.post("/api/v1/appointment",obj)
      .then(res=>{
        var data=res.data.data;
        console.log(data);
        setAppointmentLoad(false);
        setAppointments(data);
      }).catch(err=>{
        setAppointmentLoad(false);
        var e = err.message;
        if (err.response) {
          e = err.response.data.message;
          enqueueSnackbar(e, {
            variant: "error",
            action: (k) => (
              <IconButton
                onClick={() => {
                  closeSnackbar(k);
                }}
                size="small"
              >
                <Close fontSize="small" />
              </IconButton>
            ),
          });
        }
      })
    }
  }

  // request doctor appointment

  const [requestDialog,setRequestDialog]=useState(false);
  const [firstName,setFirstName]=useState({value:"",error:""});
  const [lastName,setLastName]=useState({value:"",error:""});
  const [email,setEmail]=useState({value:"",error:""});
  const [phone,setPhone]=useState({value:"",error:""});
  const [requestLoad,setRequestLoad]=useState(false);
  const [appointmentHour,setAppointmentHour]=useState(0);
  const request_appointment=()=>{
    if(firstName.value==""){
      setFirstName({value:"",error:"Please enter your first name"});
    }else if(lastName.value==""){
      setLastName({value:"",error:"Please enter your last name"});
    }else if(email.value==""){
      setEmail({value:"",error:"Please enter your email"});
    }else if(phone.value==""){
      setPhone({value:"",error:"Please enter valid phone number"});
    }else{
      setRequestLoad(true);
      var requestBody={
        patient_names:firstName.value+" "+lastName.value,
        patient_email:email.value,
        patient_phone:phone.value,
        appointment_hour:appointmentHour,
        appointment_date:appointmentDate.value,
        doctor:doctorId.value
      };
      const requestInstance=axios.create(new HospitalAppointmentService().getMsHeaders());
      requestInstance.post("/api/v1/appointment/request",requestBody)
      .then((res)=>{
        var message=res.data.message;
        enqueueSnackbar(message, { 
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
        },
      });
      setRequestLoad(false);
      setRequestDialog(false);

      setFirstName({value:"",error:""});
      setLastName({value:"",error:""});
      setEmail({value:"",error:""});
      setPhone({value:"",error:""});

      })
      .catch((err)=>{
      setRequestLoad(false);
        var e = err.message;
        if (err.response) {
          e = err.response.data.message;
          enqueueSnackbar(e, {
            variant: "error",
            action: (k) => (
              <IconButton
                onClick={() => {
                  closeSnackbar(k);
                }}
                size="small"
              >
                <Close fontSize="small" />
              </IconButton>
            ),
          });
        }
      })
    }
  }

  return(
<div>
<Box className={classes.header} display="flex" >
  <Box ><img style={{marginTop:2,marginLeft:5}} src={Logo} height={40} /> <Typography variant="h9">Hospital Appointment System</Typography></Box>

</Box>
<Box>
<Box className={classes.middle}>
<Container maxWidth="sm">
<Box>
  
  <Grid container spacing={2}>
  <Grid item md={12} sm={12} >
    <center>
    <Box className={classes.title}>
      <Typography variant="h5">Search Available Appointment schedule</Typography>
    </Box>
    </center>
 
  </Grid>
    <Grid item md={5} sm={12}>
    <FormControl variant="outlined" className={classes.formControl} size="small" fullWidth>
        <Select
          labelId="doctor"
          id="doctor"
          value={doctorId.value}
          onChange={(e)=>{
            if(e.target.value!=0){
              setDoctorId({value:e.target.value,error:""});
            }else{
              setDoctorId({value:0,error:"Incorrect value"})
            }
          }}
        >
          <MenuItem value={0}>
            <em>None</em>
          </MenuItem>
          {doctors.map((o)=>{
            return(
              <MenuItem value={o.id}>{o.firstName+" "+o.lastName+" ("+o.department.name+")"}</MenuItem>
            );
          })}
        
        </Select>
      </FormControl>
    </Grid>
    <Grid item md={5} sm={12}>
    <TextField 
    className={classes.formControl}
    value={appointmentDate.value}
    id="odate" 
    type="date"  
    size="small" 
    variant="outlined" 
    onChange={(e)=>{
      setAppointmentDate({value:e.target.value,error:""});
      console.log(e.target.value);
    }}
    fullWidth />
    </Grid>
    <Grid item md={2} sm={12}>
      <Button 
      className={classes.formControl}
      disableElevation
      variant="contained"
      disabled={appointmentLoad}
      startIcon={<Today/>}
      onClick={()=>{get_appointment();}}
      >
        {appointmentLoad? <CircularProgress size={25} />:"Search"}
      </Button>
      </Grid>
  </Grid>
</Box>


</Container>
</Box>
<Box>
  <Container maxWidth="sm">
   
  <List>
    {appointments.map((o)=>{
      return(
      <>
      <ListItem>
        <ListItemAvatar>
        <img src={AppointmentIcon} width={50} height={50} />
        </ListItemAvatar>
        <ListItemText primary={<Typography>{o.date} {o.hour+":00"}</Typography>} secondary={<Chip label={o.status} size="small"  color={o.status=="AVAILABLE"?"primary":"secondary"}/>} />
         <ListItemSecondaryAction>
           {o.status=="AVAILABLE"&&
           <Button className={classes.button} startIcon={<DateRange/>} variant="outlined" onClick={()=>{
            setAppointmentHour(o.hour);
            setRequestDialog(true);
           }}>
             Request
             </Button>}
            
         </ListItemSecondaryAction>
      </ListItem>
      <Divider/>
      </>
      );
    })}
    
    </List>

   {appointments.length==0&&<center> 
    <img src={Doctors} width="250px"/>
    <Box>
    Available appointments
    </Box>
    </center>}
    
   
  </Container>
</Box>
</Box>
<Box className={classes.footer}>

</Box>

{/* request appointment  start dialog*/}
<Dialog
    maxWidth="sm"
    fullWidth
        open={requestDialog}
        onClose={()=>{
          setRequestDialog(false);
        }}
        aria-labelledby="request appointment"
        aria-describedby="request appointment"
      >
        <DialogTitle >Request Appointment</DialogTitle>
        <DialogContent>
          <DialogContentText >
            <Box>
              <Box>
              <ListItem>
                <ListItemAvatar>
                <img src={AppointmentIcon} width={50} height={50} />
                </ListItemAvatar>
                <ListItemText primary={<Typography>2{appointmentDate.value} {appointmentHour}:00</Typography>} secondary={<Chip label={"AVAILABLE"} size="small"  color={"primary"}/>} />
              </ListItem>
              </Box>
              <Box display="flex" mt={1} alignItems='center' justifyContent='center'>
              <TextField size='small' 
              variant='outlined' 
                error={firstName.error!==""}
                helperText={firstName.error}
                value={firstName.value}
                onChange={(e)=>{
                  if(e.target.value===""){
                    setFirstName({value:"",error:"Enter firstname"});
                  }else{
                    setFirstName({value:e.target.value,error:""});
                  }
                }}
            label="First Name"
            color='primary' 
             fullWidth/>
              </Box>
              <Box display="flex" style={{marginTop:6}} alignItems='center' justifyContent='center'>
              <TextField size='small' 
              variant='outlined' 
                error={lastName.error!==""}
                helperText={lastName.error}
                value={lastName.value}
                onChange={(e)=>{
                  if(e.target.value===""){
                    setLastName({value:"",error:"Enter firstname"});
                  }else{
                    setLastName({value:e.target.value,error:""});
                  }
                }}
            label="Last Name"
            color='primary' 
             fullWidth/>
              </Box>

              <Box display="flex" style={{marginTop:6}} alignItems='center' justifyContent='center'>
              <TextField size='small' 
              variant='outlined' 
                error={phone.error!==""}
                helperText={phone.error}
                value={phone.value}
                onChange={(e)=>{
                  if(e.target.value===""){
                    setPhone({value:"",error:"Enter firstname"});
                  }else{
                    setPhone({value:e.target.value,error:""});
                  }
                }}
                label="Phone Number"
                color='primary' 
                fullWidth/>
              </Box>

              <Box display="flex" style={{marginTop:6}} alignItems='center' justifyContent='center'>
              <TextField size='small' 
              variant='outlined' 
                error={email.error!==""}
                helperText={email.error}
                value={email.value}
                onChange={(e)=>{
                  if(e.target.value===""){
                    setEmail({value:"",error:"Enter firstname"});
                  }else{
                    setEmail({value:e.target.value,error:""});
                  }
                }}
                type="text"
                label="Email"
                color='primary' 
                fullWidth/>
              </Box>

            </Box>
            </DialogContentText>
       </DialogContent>
       <DialogActions>
          
          <Button variant="outlined" className={classes.button} onClick={()=>{
            setRequestDialog(false);
          }} color="secondary" >
          
           Cancel

          </Button>
             <Button autoFocus className={classes.button} disableElevation variant="contained" color="primary" onClick={()=>{
                request_appointment();
              }}>
               {requestLoad?<CircularProgress  color="secondary" size={25}/>:"Send Request"}
                </Button>
         

        </DialogActions>
</Dialog>
{/* request appointment  end dialog*/}
</div>
  );

}

export default Home;
