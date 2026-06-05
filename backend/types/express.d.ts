/* 

interface IUser {
    _id: mongoose.Types.ObjectId,
    username: string,
    email: string,
    password: string,
    studyGoal: 'Secondary School' | 'University' | 'Professional Certification' | 'Personal use',
    currentStreak: number,
    profileImage: string | null,
    lastLoginDate: Date | null, 
} */
import { IUser } from "../models/User"
declare global {
    namespace Express {
        interface Request {
            user?: IUser | null
        }
    }
}

export {}