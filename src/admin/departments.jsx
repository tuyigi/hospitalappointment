import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {Box,Typography,Button,LinearProgress} from '@material-ui/core';
import {AirportShuttle,Add,AccountTree,Block} from '@material-ui/icons';
import MUIDataTable from "mui-datatables";

import axios from 'axios';
import {HospitalAppointmentService} from "../utils/web_config";


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

function Departments(props){
  const classes = useStyles();

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
      name: "name",
      label: "Department Name",
      options: {
        display:true,
       filter: true,
       sort: true,
      }
     },
    {
     name: "abbreviation",
     label: "Abbreviation",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
      name: "createdAt",
      label: "Created At",
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
    get_departments(data.token);

  },[])

  const [departmentLoad,setDepartmentLoad]=useState(false);
  const [deparments,setDepartments]=useState([]);

  // get all departments
  const get_departments=(token)=>{
    setDepartmentLoad(true);
    const departmentInstance = axios.create(new HospitalAppointmentService().getHeaders(token));
    departmentInstance.get("/api/v1/department")
    .then(res=>{
      setDepartments(res.data.data);
      setDepartmentLoad(false);
    })
    .catch(err=>{
      setDepartmentLoad(false);

    })
  }

  return(
<>
<Box  style={{display:'flex'}}>
 
 <Box style={{display:'flex'}} alignItems="center" mt={2} className={classes.formTitle}>
 
 <Box mr={1}> <AccountTree fontSize="large" color="primary"/></Box> <Typography  variant="h5" color="default"><b>Departments</b></Typography>

 </Box>
 
 
<Button  
        className={classes.btn}
        size="small"
        startIcon={<Add/>} 
        onClick={()=>{

        }} 
        variant="contained" 
        color="primary"
        disableElevation={true}>

<Typography noWrap>New Department</Typography>
</Button>
 
     </Box>

     <Box>
     {departmentLoad&&<LinearProgress />}
      <MUIDataTable
        title={"Departments"}
        data={deparments}
        columns={columns}
        options={options}
      />
     </Box>



</>
  );
}

export default Departments;