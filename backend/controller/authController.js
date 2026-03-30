import jwt from'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

export const registerUser = async(req, res, next) => {
 try{
    const {email , username, password, studyGoal} = req.body;

    if(!email || !username || !password){
        return res.status(404).json({
            success: false,
            error: 'Input your user info',
            statusCode: 404
        });
    }
     const userExists = await User.findOne({$or: [{email}]});
    if(userExists){
        res.status(400).json({
            success: false,
            error: 'User already exists'
        })
    }
    const user = await User.create({
        email,
        username,
        password,
        studyGoal
    });
   const token = generateToken(user._id);
    res.status(200).json({
        success: true,
        data: {
            user: {
            email: user.email,
            username: user.username,
            studyGoal: user.studyGoal,
            currentStreak: user.currentStreak,
            profileImage: user.profileImage,
            createdAt: user.createdAt
            }, token
        },
        message: 'User created Successfully'
    })
 }catch(error){
    next(error)
 }
};

export const LoginUser = async(req, res, next) => {
try{
    const {email , password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            success: false,
            error: 'Please provide a valid email and password',
            statusCode: 400
        })
    }
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({
            success: false,
            error: 'User not found',
            statusCode: 401
        })
    };
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return res.status(401).json({
            success: false,
            error: 'invalid credentials',
            statusCode: 401
        });
    }

    
    const getMidnight = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
    };

    const todayAtMidnight = getMidnight(new Date()); // Today
    const lastLoginAtMidnight = getMidnight(user.lastLoginDate); // Their last login

    
    const timeDifference = todayAtMidnight - lastLoginAtMidnight;
    const daysPassed = timeDifference / (1000 * 60 * 60 * 24);

    if (!user.lastLoginDate) {
  
    user.currentStreak = 1;

    } else if (daysPassed === 0) {
   

    } else if (daysPassed === 1) {

    user.currentStreak += 1;

    } else if (daysPassed > 1) {
    user.currentStreak = 1;
    }
    user.lastLoginDate = new Date(); 
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({
        success: true,
        data: {
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                currentStreak: user.currentStreak,
                studyGoal: user.studyGoal,
                profileImage: user.profileImage,
                
            },
            token,
            message: "Login Successful"
        }
    })
}catch(error){
    next(error);
}
}
export const getProfile = async(req, res , next) => {
    try{
        const user = await User.findById(req.user._id);
            res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                currentStreak: user.currentStreak,
                studyGoal: user.studyGoal,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    }catch(error){
        next(error)
    }
}
export const updateProfile = async(req, res, next) => {
   try{
    const {username , email , profileImage} = req.body;
    const user = await User.findById(req.user._id);
    if(username) user.username = username;
    if(email) user.email = email;
    if(profileImage) user.profileImage = profileImage;
    await user.save();
    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage
        },
        message: "Profile updated successfully"
    });
    }catch(err){
        next(err)
    }
}
export const changePassword = async(req, res, next ) => {
    try{
        const {currentPassword , newPassword, confirmNewPassword} = req.body;
        const user = await User.findById(req.user._id).select('+password');
        if(currentPassword === newPassword){
            return res.status(404).json({
                success: false,
                message: 'New password is the same \n select a new password',
                statusCode: 404
            });
        }
        if(confirmNewPassword !== newPassword){
            return res.status(404).json({
                success: false,
                error: 'Confirmation password must match the new password. Please try again.',
                statusCode: 404
            })
        };
        const matchPassword = await user.matchPassword(currentPassword);
        if(!matchPassword){
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect',
                statusCode: 404
            });
        };
        user.password = newPassword;
        await user.save();
    }catch(error){
        next(error)
    }
}