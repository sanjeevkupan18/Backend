import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res)=>{

    // get user details from frotend
    const { username, fullname, password, email } = req.body;

    // check validation -  not empty
    if([fullname,email,password,username].some((field)=> field?.trim() === "")){
        throw new ApiError(400,"All fields are required.")
    }

    // Check if user already exits - email , password
    const existingUser = User.findOne({
        $or:[{ username }, { email }]
    })
    if(existingUser){
        throw new ApiError(409,"User with username and email already exist.")
    }

    // check for images , check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is required")
    }

    // upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400,"Avatar is required.")
    }

    // create user object , create entry in db
    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        username:username.toLowerCase(),
        password
    })

    // remove password and refreshToken from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // check for creation
    if(!createdUser){
        throw new ApiError(500,"Something went wrong")
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registeres successfully")
    )
    
})



export {registerUser}