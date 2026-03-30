import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        trim: true,
        minLength: [3, "Username must be atleast 3 characters"]
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        lowercase: true,
        unique: true,
        match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email address',
        ],
    },
    password:{
        type: String,
        required: [true, 'Please provide a password'],
        select: false,
        minLength: [6, 'Password must have atleast 6 characters']
    },
    studyGoal:{
        type: String,
        required: true,
        enum: ['Secondary School' , 'University' , 'Professional Certification' , 'Personal use'],
    },
    currentStreak:{
        type: Number,
        default: 0
    },
    profileImage:{
        type: String,
        default:null
    },
    lastLoginDate: {
        type: Date,
        default: null
    }
},{
    timestamps: true
})
//Hash password before saving
userSchema.pre('save' , async function() {
    if(!this.isModified('password')){
        return;
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
});

userSchema.methods.matchPassword = async function(enteredPassword)  {
return await bcrypt.compare(enteredPassword, this.password);

}
const User = mongoose.model('User' , userSchema);
export default User;