const Pool=require("pg").Pool

const pool=new Pool({
    
     user:"postgres",
     password:"N2001i2001n",
     host:"localhost",
     port:5432, 
     database:"postgres"

})

module.exports=pool