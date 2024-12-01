import { Response } from "express";
import { generateToken } from "../utils /GeneratorLogic";
import { AuthReq } from "../middlewares/authenticateToken";
import { hashingPassword, verifyingPassword } from "../utils /hashPassword";
import prisma from "../utils /prisma";
import { storeToken, setNewToken, connectReddis} from "../cache";


connectReddis();

const saltRounds = parseInt(process.env.SALT_ROUNDS?? "10");

const secretKey = process.env.secretKey || "just_testing";

export const signUp = async (req: AuthReq, res: Response) => {    
    const {name, email, password}  = req.body;

    if(!email || !name || !password){
        res.status(400).json({ // 400 means bad request- missing fields don't use 403 here, 403 means sever understood the request but refuses to authorize it;
            msg: "please provide all the details"
        })
        return;
    }

    //checking user exits or not
    try{
        const userPresent = await prisma.user.findUnique({
            where: { email },
          });
        
          if(userPresent){
            res.status(409).json({
                msg: "User is already exits, please login"
            })
            return;
          }
        const hashedPassword = await hashingPassword(password);
        const user = await prisma.user.create({
            data: {
                username: name,
                email : email,
                password: hashedPassword,
            }
        })
        
    const user_id = user.id.toString();    
    const token = generateToken(name, email, user_id);

    const storingToken = await storeToken(user_id, token, 3600)
    if(!storingToken){
        res.status(500).json({
            msg: "Internal Server Error",
        })
        return;
    }

    res.status(201).json({ //not 200OK but 201, means succussfully created new resource 
        msg: "User created succussfully",
        data: {
            Name: name,
            User_Id: user_id,
            Email: email,
            
        },
        JWT_Token: token,
    })
    }
    catch(error){
        console.log(`Error Occured: ${error}`);
        res.status(500).json({
            msg: "An error occurred while creating the user. Please try again later.",
        })
    }


}
export const newBlog = async (req: AuthReq, res: Response) =>{
    //middleware comes in here

    const {title, description} = req.body;
    const {name, email, user_Id} = req.user!;

    if(!title || !description){
        res.status(400).json({
            msg: "Please Enter Your Title and Description"
        })
        return;
    }

    const insertPost = await prisma.post.create({
        data: {
            title: title,
            description: description,
            userId: user_Id,
        }
    })


    res.status(201).json({ //new resource is created
        msg: "New Blog Created Succussfully",
        blog:{
            name:{
            blog_id: insertPost.id,
            title: title,
            description: description,
            createdAt: insertPost.created_at,
            userId: user_Id,
            }
        }
    })

}
export const home = async (req: AuthReq, res: Response) => {
    //authentication middleware will send the control here;
try{
    const {name, email, user_Id} = req.user!;
    const userPosts = await prisma.post.findMany({
        where: {userId: user_Id},
    })

    res.status(200).json({
        msg: "Here are all your user posts",
        data: userPosts, // Return as an array of objects
      });
      return;
    }
    catch(error){
        console.log("An Error Occured: " + error);
        res.status(500).json({
            msg: "Failed to retrieve user posts",
        })
    }

}
export const login = async (req: AuthReq, res: Response) =>{

    // here user will send his email and password;
    const {email, password} = req.body; // hash the password and don't store as a plain text and compare too

    if(!email || !password){
        res.status(400).json({ //missing fields 
            msg: "please provide all the details"
        })
        return;
    }
    // const user_present = USERS.find(u => u.email == email && u.hashedPassword == password);
    const user_present = await prisma.user.findUnique({
        where: {email},
    })
    if(!user_present){
        res.status(404).json({
            msg: "user not found"
        })
        return;
    }

    const hashedPassword = user_present?.password;
    const verifyPass = await verifyingPassword(password, hashedPassword);

    if(user_present && verifyPass){ // if we don't use the await keyword, then the function will always return a promise, and in JS a Promise is a truthy value in JavaScript, even if the password comparison fails.
    const name = user_present.username;// and regardless the password matches, verifyPass will always be true
    const user_id  = user_present.id;
    const newToken = generateToken(name, email, user_id)
    await setNewToken(user_id, newToken, 3600);

    res.status(200).json({ //200 not 201, 
        msg: "Login Succussful, token is valid for 1 hour",
        newToken: newToken
    })
    return;
    }
    else{
        res.status(401).json({ //correct
            msg: "Wrong email or password",
        })
    }


}

// function extraInformation(){
//here he can see all his posts, and this is a protected route; -> home route

//      // const todo_id = uuidv4() //todoID

// // we can use in this way:
// //     const dateObject = new Date();
// // console.log(dateObject); // Example output: Wed Nov 15 2023 12:30:45 GMT+0000 (Coordinated Universal Time)
// // console.log(typeof dateObject); // Output: "object"

// // // You can access date components
// // console.log(dateObject.getFullYear()); // Output: 2023
// // console.log(dateObject.getMonth());    // Output: 10 (months are zero-indexed: 0 = January, 11 = December)
// // console.log(dateObject.getDate());     // Output: 15
/*we can pretty print the data as well, by using app.set('json spaces', 2) or by stringify((...),
 null,2) or by using middleware*/
// }}
