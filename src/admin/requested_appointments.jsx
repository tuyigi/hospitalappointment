import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {Box,Typography,Button,LinearProgress,Chip, CircularProgress,
  Divider,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  IconButton,
  DialogTitle} from '@material-ui/core';
import {AirportShuttle,Add,AccountTree,Done,Block,FilterList,Close} from '@material-ui/icons';
import MUIDataTable from "mui-datatables";

import axios from 'axios';
import {HospitalAppointmentService} from "../utils/web_config";

import Format from "date-fns/format";
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
  approveBtn:{
    backgroundColor: "#6CAF51",
    color:"#fff"
  }
}));
function Appointments(props){

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
      name: "patientNames",
      label: "Patient Names",
      options: {
        display:true,
       filter: true,
       sort: true,
      }
     },
    {
     name: "patientEmail",
     label: "Patient Email",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
      name: "patientPhone",
      label: "Patient Phone",
      options: {
       filter: true,
       sort: false,
      }
     },
     {
       name: "appointmentHour",
       label: "Appointment Time",
       options: {
        filter: true,
        sort: false,
       }
      },
      {
        name: "appointmentDate",
        label: "Appointment Date",
        options: {
         filter: true,
         sort: false,
        }
       },
       
       {
         name: "doctorName",
         label: "Doctor",
         options: {
          filter: true,
          sort: false,
         }
        },
        {
          name: "departmentName",
          label: "Department",
          options: {
           filter: true,
           sort: false,
          }
         },
         {
           name: "status",
           label: "Status",
           options: {
            filter: true,
            sort: false,
            customBodyRender: (value, tableMeta, updateValue) => {
              if(value=="APPROVED"){
                return (
                  <Chip
                  variant="outlined"
                label={value}
                onDelete={()=>{}}
                deleteIcon={<Done />}
                color="primary"
              />
                );
              }else if(value=="DECLINED"){
                return (
                  <Chip
                  variant="contained"
                label={value}
                onDelete={()=>{}}
                deleteIcon={<Block />}
                color="secodnary"
              />
                );
              }else{
                return (
                  <Chip label={value} />
                );
              }
             
            }
           }
          },
          {
            name: "id",
            label: "Action",
            options: {
             filter: true,
             sort: false,
             customBodyRender: (value, tableMeta, updateValue) => {
               var obj=appointments.filter((o)=>o.id==value)[0];
               if(obj.status!="APPROVED"){
                return (
                  <Button className={classes.approveBtn} onClick={()=>{
                    approve_appointment(value);
                  }}  disableElevation variant="contained" >
                    Approve 
                  </Button>
                );
               }else{
                 return(
                   <></>
                 );
               }
                
               
              
             }
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
   const [filterDate,setFilterDate]=useState({value:Format(new Date(), ["yyyy-MM-dd",]),error:""});
  useEffect(()=>{

    axios.defaults.baseURL = new HospitalAppointmentService().BASE_URL;
    var data=localStorage.getItem("admin_profile");
    if(data!=null){
      data=JSON.parse(data);
      setAdminProfile(data);
    }

    get_requested_appointment(data.token)

  },[])

  const [appointments,setAppointments]=useState([]);
  const [appointmentLoad,setAppointmentLoad]=useState(false);

  const [filterDialog,setFilterDialog]=useState(false);
   
  // get all request appointment on specific date

  const get_requested_appointment=(token)=>{
    setAppointmentLoad(true);
    var reportRequest={
      date:filterDate.value
      };
    const appointmentsInstance=axios.create(new HospitalAppointmentService().getHeaders(token));
    appointmentsInstance.post("/api/v1/appointment/report",reportRequest)
    .then(res=>{
      var data=res.data.data;
      data.map((o)=>{
        o['departmentName']=o['doctor']['department']['name'];
        o['doctorName']=o['doctor']['firstName']+" "+o['doctor']['lastName'];
        o['appointmentHour']=o['appointmentHour']+":00";
      });
      setAppointments(data);
      setAppointmentLoad(false);
      setFilterDialog(false);
    })
    .catch(err=>{
      setAppointmentLoad(false);
    });
  }

  // approve appointment request

  const [approveLoad,setApproveLoad]=useState(false);
  const approve_appointment=(id)=>{
    setApproveLoad(true);
    const approveInstance=axios.create(new HospitalAppointmentService().getHeaders(adminProdile.token));
    approveInstance.put("/api/v1/appointment/approve/"+id)
    .then(res=>{
      var index=appointments.findIndex((o)=>o.id==id);
      var objs=appointments;
      objs[index]['status']="APPROVED";
      setAppointments(objs);
      setApproveLoad(false);
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
    })
    .catch(err=>{
      setApproveLoad(false);
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

  return(
<>
<Box  style={{display:'flex'}}>
 
 <Box style={{display:'flex'}} alignItems="center" mt={2} className={classes.formTitle}>
 
 <Box mr={1}> <AccountTree fontSize="large" color="primary"/></Box> <Typography  variant="h5" color="default"><b>Request Appointments</b></Typography>

 </Box>
 
 
<Button  
        className={classes.btn}
        size="small"
        startIcon={<FilterList/>} 
        onClick={()=>{
          setFilterDialog(true);
        }} 
        variant="outlined" 
        color="primary"
        disableElevation={true}>

<Typography noWrap>Filter Appointment</Typography>
</Button>
 
     </Box>

     <Box>
     {appointmentLoad&&<LinearProgress />}
      <MUIDataTable
        title={"Departments"}
        data={appointments}
        columns={columns}
        options={options}
      />
     </Box>

     <Dialog
    maxWidth="sm"
    fullWidth
        open={filterDialog}
        onClose={()=>{
          setFilterDialog(false);
        }}
        aria-labelledby="filter appointment"
        aria-describedby="filter appointment"
      >
        <DialogTitle >Select date</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box>
            <TextField 
              value={filterDate.value}
              id="odate" 
              type="date"  
              size="small" 
              variant="outlined" 
              onChange={(e)=>{
                setFilterDate({value:e.target.value,error:""});
                console.log(e.target.value);
              }}
              fullWidth />
            </Box>
          </DialogContentText>
          </DialogContent>
          <DialogActions>
          
          <Button variant="outlined" className={classes.btn} onClick={()=>{
            setFilterDialog(false);
          }} color="secondary" >
          
           Cancel

          </Button>
             <Button autoFocus className={classes.btn} disableElevation variant="contained" color="primary" onClick={()=>{
                get_requested_appointment(adminProdile.token);
              }}>
               {appointmentLoad?<CircularProgress  color="secondary" size={25}/>:"Filter"}
                </Button>
         

        </DialogActions>
      </Dialog>

      {/* dialog approve appointment  */}
      <Dialog
        open={approveLoad}
        aria-labelledby="approve appointment"
        aria-describedby="approve appointment"
      >
        <DialogContent>
          <DialogContentText>
            <CircularProgress/>
            </DialogContentText>
            </DialogContent>
            </Dialog>

</>
  );
}

export default Appointments;