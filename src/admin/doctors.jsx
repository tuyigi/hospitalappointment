import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {Box,Typography,Button,LinearProgress,IconButton,
  MenuItem,
  Select,
  FormControl,
  TextField,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel} from '@material-ui/core';
import {AirportShuttle,Add,AccountTree,Block,PeopleOutline,Close} from '@material-ui/icons';
import MUIDataTable from "mui-datatables";

import axios from 'axios';
import {HospitalAppointmentService} from "../utils/web_config";
import { useSnackbar } from "notistack";



const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    flexFlow: 1,
    [theme.breakpoints.up("sm")]: {
      marginLeft: 250,
    },
  },
  type_list:{
    backgroundColor: theme.palette.background.paper,
  },
  btn: {
    textTransform: "capitalize",
    margin:theme.spacing(1)
  },
  formTitle: {
    flexGrow: 1,
  },
}));

function Doctors(props){
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const columns = [
    
    {
      name: "id",
      label: "id",
      options: {
        display:false,
       filter: true,
       sort: true,
      }
     },
     {
      name: "firstName",
      label: "First Name",
      options: {
        display:true,
       filter: true,
       sort: true,
      }
     },
    {
     name: "lastName",
     label: "Last Name",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
      name: "email",
      label: "Email",
      options: {
       filter: true,
       sort: false,
      }
     },
     {
       name: "phoneNumber",
       label: "Phone Number",
       options: {
        filter: true,
        sort: false,
       }
      },
      {
        name: "gender",
        label: "Gender",
        options: {
         filter: true,
         sort: false,
        }
       },
       {
         name: "workExperience",
         label: "Work Experience",
         options: {
          filter: true,
          sort: false,
         }
        },
        {
          name: "dayStartHour",
          label: "Start Work",
          options: {
           filter: true,
           sort: false,
          }
         },
         {
           name: "dayEndHour",
           label: "End Work",
           options: {
            filter: true,
            sort: false,
           }
          },
          {
            name: "departmentName",
            label: "Department Name",
            options: {
             filter: true,
             sort: false,
            }
           }
   ];

      
   const options = {
    textLabels: {
      body: {
        noMatch: "Loading..."
      },
    },
     filterType: 'checkbox',
     download:true,
     responsive:"standard",
     selectableRows:false,
     rowsPerPage: 10,
     elevation:0,
   };


  const [adminProdile,setAdminProfile]=useState({});

  useEffect(()=>{

    axios.defaults.baseURL = new HospitalAppointmentService().BASE_URL;
    var data=localStorage.getItem("admin_profile");
    if(data!=null){
      data=JSON.parse(data);
      setAdminProfile(data);
    }
    get_doctors(data.token);
    get_departments(data.token);
    
  },[]);


  // get doctors

  const [doctorLoad,setDoctorLoad]=useState(false);
  const [doctors,setDoctors]=useState([]);

  const get_doctors=(token)=>{
    setDoctorLoad(true);
    const doctorsInstance=axios.create(new HospitalAppointmentService().getHeaders(token));
    doctorsInstance.get("/api/v1/doctor")
    .then(res=>{
      setDoctorLoad(false);
      var data=res.data.data;
      data.map((o)=>{
        o['departmentName']=o['department']['name'];
        o['dayStartHour']=o['dayStartHour']+":00";
        o['dayEndHour']=o['dayEndHour']+":00"
      })
      setDoctors(data);
    })
    .catch(err=>{
      setDoctorLoad(false);
    });
  }


  // get departments

  const [departments,setDepartments]=useState([]);
  const get_departments=(token)=>{
    const departmentsInstance=axios.create(new HospitalAppointmentService().getHeaders(token));
    departmentsInstance.get("/api/v1/department")
    .then(res=>{
      setDepartments(res.data.data);
    })
    .catch(err=>{

    });
  }

  // new doctor 


  const [firstName,setFirstName]=useState({value:"",error:""});
  const [lastName,setLastName]=useState({value:"",error:""});
  const [phone,setPhone]=useState({value:"",error:""});
  const [email,setEmail]=useState({value:"",error:""});
  const [workExperience,setWorkExperience]=useState({value:"",error:""});
  const [dayStartHour,setDayStartHour]=useState({value:"",error:""});
  const [dayEndHour,setDayEndHour]=useState({value:"",error:""});
  const [gender,setGender]=useState({value:"",error:""});
  const [departmentId,setDepartmentId]=useState({value:"",error:""});


  const [newLoad,setNewLoad]=useState(false);
  const [newDialog,setNewDialog]=useState(false);

  const new_doctor=()=>{
    if(firstName.value==""){
      setFirstName({value:"",error:"Please enter first name"});
    }else if(lastName.value==""){
      setLastName({value:"",error:"PLease enter last name"});
    }else if(phone.value==""){
      setPhone({value:"",error:"Please enter your phone"});
    }else if(email.value==""){
      setEmail({value:"",error:"Please enter email"});
    }else if(workExperience.value==0){
      setWorkExperience({value:"",error:"Enter valid work experience"});
    }else if(dayStartHour.value==0){
      setDayStartHour({value:"",error:"Please provide valid start hour"});
    }else if(dayEndHour.value==0){
      setDayEndHour({value:"",error:"PLease enter valid end hour"});
    }else if(departmentId.value==0){
      setDepartmentId({value:"",error:"Please select atleast one department"})
    }else{
      setNewLoad(true);
      var requestObj={
        first_name:firstName.value,
        last_name:lastName.value,
        email:email.value,
        phone_number:phone.value,
        gender:gender.value,
        work_experience:workExperience.value,
        day_start_hour:dayStartHour.value,
        day_end_hour:dayEndHour.value,
        department:departmentId.value
    };

      const newInstance=axios.create(new HospitalAppointmentService().getHeaders(adminProdile.token));
      newInstance.post("/api/v1/doctor",requestObj)
      .then(res=>{
        var obj=res.data.data;
        obj['departmentName']=obj['department']['name'];
        obj['dayStartHour']=obj['dayStartHour']+":00";
        obj['dayEndHour']=obj['dayEndHour']+":00"
        var objs=doctors;
        objs.push(obj);
        setDoctors(objs);
        enqueueSnackbar(res.data.message, {
          variant: "success",
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
        setNewLoad(false);
        setNewDialog(false);
      })
      .catch(err=>{
        setNewLoad(false);
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
    <>
  
  <Box  style={{display:'flex'}}>
 
 <Box style={{display:'flex'}} alignItems="center" mt={2} className={classes.formTitle}>
 
 <Box mr={1}> <PeopleOutline fontSize="large" color="primary"/></Box> <Typography  variant="h5" color="default"><b>Doctors</b></Typography>

 </Box>
 
 
<Button  
        className={classes.btn}
        size="small"
        startIcon={<Add/>} 
        onClick={()=>{
          setNewDialog(true);
        }} 
        variant="contained" 
        color="primary"
        disableElevation={true}>

<Typography noWrap>New Doctor</Typography>
</Button>
 
     </Box>

     <Box>
     {doctorLoad&&<LinearProgress />}
      <MUIDataTable
        title={"Doctors"}
        data={doctors}
        columns={columns}
        options={options}
      />
     </Box>

     {/* dialog new doctor  */}
     <Dialog
    maxWidth="sm"
    fullWidth
        open={newDialog}
        onClose={()=>{
          setNewDialog(false);
        }}
        aria-labelledby="new doctor"
        aria-describedby="new doctor"
      >
        <DialogTitle >Record New Doctor</DialogTitle>
        <DialogContent>
          <DialogContentText >
            <Box>
            <Box display="flex" mt={1} style={{marginTop:2}} alignItems='center' justifyContent='center'>
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
              <Box display="flex" mt={1} style={{marginTop:2}} alignItems='center' justifyContent='center'>
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

              <Box display="flex" mt={1} style={{marginTop:2}} alignItems='center' justifyContent='center'>
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
            label="Email"
            color='primary' 
             fullWidth/>
              </Box>

              <Box display="flex" mt={1} style={{marginTop:2}} alignItems='center' justifyContent='center'>
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
            label="Phone"
            color='primary' 
             fullWidth/>
              </Box>

              <Box display="flex" mt={1} style={{marginTop:2}} alignItems='center' justifyContent='center'>
              <TextField size='small' 
              variant='outlined' 
                error={workExperience.error!==""}
                helperText={workExperience.error}
                value={workExperience.value}
                onChange={(e)=>{
                  if(e.target.value===""){
                    setWorkExperience({value:"",error:"Enter firstname"});
                  }else{
                    setWorkExperience({value:e.target.value,error:""});
                  }
                }}
            label="Work Experience"
            color='primary' 
             fullWidth/>
              </Box>

              <Box style={{marginTop:2}}>
              <FormControl variant="outlined"  size="small" fullWidth>
              <InputLabel >Select Department</InputLabel>
                <Select
                  labelId="department"
                  id="department"
                  value={departmentId.value}
                  onChange={(e)=>{
                    if(e.target.value!=0){
                      setDepartmentId({value:e.target.value,error:""});
                    }else{
                      setDepartmentId({value:0,error:"Incorrect value"})
                    }
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select Department</em>
                  </MenuItem>
                  {departments.map((o)=>{
                    return(
                      <MenuItem value={o.id}>{o.name+" ("+o.abbreviation+")"}</MenuItem>
                    );
                  })}
                
                </Select>
               </FormControl>
              </Box>

              <Box style={{marginTop:2}}>
              <FormControl variant="outlined"  size="small" fullWidth>
              <InputLabel >Select Gender</InputLabel>
                <Select
                  labelId="gender"
                  id="gender"
                  value={gender.value}
                  onChange={(e)=>{
                    if(e.target.value!=0){
                      setGender({value:e.target.value,error:""});
                    }else{
                      setGender({value:0,error:"Incorrect value"})
                    }
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select Gender</em>
                  </MenuItem>
                  <MenuItem value={"FEMALE"}>Female</MenuItem>
                  <MenuItem value={"MALE"}>Male</MenuItem>
                </Select>
               </FormControl>
              </Box>

              <Box style={{marginTop:2}}>
              <FormControl variant="outlined"  size="small" fullWidth>
              <InputLabel >Select Start Hour</InputLabel>
                <Select
                  labelId="start"
                  id="start"
                  value={dayStartHour.value}
                  onChange={(e)=>{
                    if(e.target.value!=0){
                      setDayStartHour({value:e.target.value,error:""});
                    }else{
                      setDayStartHour({value:0,error:"Incorrect value"})
                    }
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select Start Hour</em>
                  </MenuItem>
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map((v)=>{
                    return(
                      <MenuItem value={v}>{v+":00"}</MenuItem>
                    );
                  })}
                </Select>
               </FormControl>
              </Box>

              <Box style={{marginTop:2}}>
              <FormControl variant="outlined"  size="small" fullWidth>
                <InputLabel >Select End Hour</InputLabel>
                <Select
                  labelId="end"
                  id="end"
                  value={dayEndHour.value}
                  onChange={(e)=>{
                    if(e.target.value!=0){
                      setDayEndHour({value:e.target.value,error:""});
                    }else{
                      setDayEndHour({value:0,error:"Incorrect value"})
                    }
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select End Hour</em>
                  </MenuItem>
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map((v)=>{
                    return(
                      <MenuItem value={v}>{v+":00"}</MenuItem>
                    );
                  })}
                </Select>
               </FormControl>
              </Box>

              {/* <Box>
              <FormControl variant="outlined"  size="small" fullWidth>
                <Select
                  labelId="department"
                  id="department"
                  value={departmentId.value}
                  onChange={(e)=>{
                    if(e.target.value!=0){
                      setDepartmentId({value:e.target.value,error:""});
                    }else{
                      setDepartmentId({value:0,error:"Incorrect value"})
                    }
                  }}
                >
                  <MenuItem value={0}>
                    <em>Select Department</em>
                  </MenuItem>
                  {departments.map((o)=>{
                    return(
                      <MenuItem value={o.id}>{o.name+" ("+o.abbreviation+")"}</MenuItem>
                    );
                  })}
                
                </Select>
               </FormControl>
              </Box> */}

            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          
          <Button variant="outlined" className={classes.button} onClick={()=>{
            setNewDialog(false);
          }} color="secondary" >
          
           Cancel

          </Button>
             <Button autoFocus className={classes.button} disableElevation variant="contained" color="primary" onClick={()=>{
                new_doctor();
              }}>
               {newLoad?<CircularProgress  color="secondary" size={25}/>:"Save"}
                </Button>
         

        </DialogActions>
      </Dialog>
    </>
  );
}

export default Doctors;