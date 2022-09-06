const authorModel=require('../Model/authorModel')
let {isValidEmail,isValid,isValidPassword,isValidName}=require('../Validation/validatorAuthor')

const validator=require("validator")

// const {emailRegex}=require('../middleWare/validator')//destructure
const createAuthor=async function(req,res){
    try{
    //     let {email}=req.body
    // if(!emailRegex(email)) return res.status(400).send({status:false,data:"Email is Invalid"})
    const data=req.body
    let{fname,lname,title,email,password}=data
        if(Object.keys(data).length===0) return res.status(400).send({status:false,message:"The Body Can't be Empty"})

   
    if(!lname) return res.status(400).send({status:false,message:"The last name is required"})
    if(!fname) return res.status(400).send({status:false,message:"The first name is required"})
    if(!title) return res.status(400).send({status:false,message:"The title is required"})
    if(!email) return res.status(400).send({status:false,message:"The Email is required"})
    if(!password) return res.status(400).send({status:false,message:"The password is required"})

    
    if(!isValid(fname)) return res.status(400).send({status:false,message:"Don't leave fname name Empty"})
    if(!isValidName(fname)) return res.status(400).send({status:false,message:"Please give Valid first Name"})
    if(!isValidName(lname)) return res.status(400).send({status:false,message:"Please give Valid last Name"})
    if(!isValid(lname)) return res.status(400).send({status:false,message:"Don't leave lname name Empty"})
    if(!isValid(email)) return res.status(400).send({status:false,message:"Don't leave Email Empty"})
    if(!isValid(title)) return res.status(400).send({status:false,message:"Don't leave title Empty"})
    if(!isValid(password)) return res.status(400).send({status:false,message:"Don't leave password Empty"})
    
    // if(!validator.isEmail(email)) return res.status(400).send({status:false,message:"Please Enter valid Email"})
    if(!isValidEmail(email)) return res.status(400).send({status:false,message:"Please Enter valid Email"})
    if(!isValidPassword(password)) return res.status(400).send({status:false,message:"Please Enter valid Password"})
    
    if(await authorModel.findOne({email})) return res.status(400).send({status:false,message:"Email already Exist"})


    let titles =['Mr', 'Mrs', 'Miss']
    if(!titles.includes(title)) return res.status(400).send({status:false,message:`Title should be among ${titles}`})
    
    const createA=await authorModel.create(data)
    res.status(201).send({status:true,data:createA})

}
    catch(err){
      return  res.status(500).send(err.message)
    }
}


module.exports.createAuthor=createAuthor