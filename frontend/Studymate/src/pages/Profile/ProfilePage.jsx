import React, { useEffect, useState } from 'react';
import { User, Mail, Lock, Target, Flame, Camera, Eye, EyeOff } from 'lucide-react';
/* import './ProfileSettings.scss'; */
import './ProfilePage.scss';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
const ProfilePage = () => {
  const {user, updateUser} = useAuth();
  const [username, setUsername] = useState(user?.username);
  const [userEmail , setUserEmail] = useState(user?.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [studyGoal, setStudyGoal] = useState(user.studyGoal);

  useEffect(() => {
    if(user){
      setUsername(user.username || '');
      setUserEmail(user.email || '')
      setStudyGoal(user.studyGoal || '')
    }
  }, [user])

// To change profile details
 const hasChanges = 
    username !== (user?.username || '') ||
    userEmail !== (user?.email || '') ||
    studyGoal !== (user?.studyGoal || 'Secondary School');
 const emailRegex = /^[a-zA-Z0-9._%+-]+@(?!gmai\.co$)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const updateUserData = async() => {
   
if (!emailRegex.test(userEmail)) {
    toast.error("Please enter a valid email address.");
    return; 
}
      if(!hasChanges) return;

    try{
      const updateProfile = {
        username: username,
        email: userEmail,
        studyGoal: studyGoal
      }

      const response = await authService.updateProfile(updateProfile);
      updateUser(response.data);
      toast.success('Changes made successfully');
    }catch(error){
      console.error('Failed to update profile')
    }
  }

  //To change password
 const updatePassword = async () => {

    
 if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match!");
      return; 
    }
    
  if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    const passwords = {
      currentPassword,
      newPassword,
      confirmNewPassword
    };

    try{

        await authService.changePassword(passwords);
        console.log(passwords);
        toast.success('Password successfully changed');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
  }catch(error){
    console.error('Failed to change password', error);
    toast.error('Failed to change password' || error.message);
  }
 }
  const avatarInitial = username ? username.charAt(0).toUpperCase() : 'U';
  return (
    <div className="profile-settings">
      <h1 className="profile-settings__main-title">Profile Settings</h1>

      <section className="settings-card">
        <div className="settings-card__header-flex">
          <h2 className="settings-card__title">User Information</h2>
          
          {/* Static Streak Badge */}
          <div className="streak-badge">
            <Flame size={16} strokeWidth={2.5} />
            <span>{user.currentStreak} Day Streak</span>
          </div>
        </div>

        {/* Profile Image Section */}
        <div className="profile-image-section">
          <div className="profile-image-section__avatar" title='coming soon...'>
              <span>{avatarInitial}</span>
            <button className="profile-image-section__edit-btn" title="Change Avatar">
              <Camera size={14} />
            </button>
          </div>
          <div className="profile-image-section__info">
            <h3>Profile Picture</h3>
            <p>PNG, JPEG under 2MB</p>
          </div>
        </div>

        <div className="settings-card__form">
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Current Study Goal</label>
            <div className="input-wrapper">
              <Target size={18} className="input-icon" />
              <select 
                value={studyGoal}
                onChange={(e) => setStudyGoal(e.target.value)}
                className="select-input"
              >
                      <option value="Secondary School">Secondary School</option>
                      <option value="University">University</option>
                      <option value="Professional Certification">Professional Certification</option>
                      <option value="Personal use">Personal use</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="settings-card__actions">
          <button className="btn-save" onClick={updateUserData}
          disabled = {!hasChanges}>
            Save Changes
          </button>
        </div>
      </section>

      {/* --- CHANGE PASSWORD CARD --- */}
      <section className="settings-card">
        <h2 className="settings-card__title">Change Password</h2>
        
        <div className="settings-card__form">
          <div className="form-group">
            <label>Current Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type={showCurrentPassword ? "text" : "password"} 
                name="currentPassword"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                tabIndex="-1" 
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>
          </div>

          {/* Current Password Field */}
          <div className="form-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              
              {/* Dynamic Type: switches between text and password */}
              <input 
                type={showNewPassword ? "text" : "password"} 
                name="currentPassword"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              
           
            <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex="-1" 
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
    
          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="input-wrapper input-wrapper--active">
              <Lock size={18} className="input-icon" />
              <input 
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
             
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1" 
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* The Action Button at the bottom right */}
        <div className="settings-card__actions">
          <button className="btn-save" onClick={updatePassword}>Change Password</button>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;