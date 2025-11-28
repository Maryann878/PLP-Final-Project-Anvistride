import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { getGlobalToast } from "@/lib/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCircle2, Mail, Calendar, Edit3, Save, X, Camera, Trash2, Eye, Target, CheckSquare2, Lightbulb } from "lucide-react";
import { getMyProfile, updateMyProfile } from "@/api/profile";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { visions, goals, tasks, ideas } = useAppContext();
  const navigate = useNavigate();
  
  // Safety checks: ensure all arrays are defined
  const safeVisions = visions || [];
  const safeGoals = goals || [];
  const safeTasks = tasks || [];
  const safeIdeas = ideas || [];
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    profileImage: user?.profileImage || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.profileImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const profileData = await getMyProfile();
        
        // Update local state with profile data
        setEditData({
          username: profileData.username || user?.name || "",
          email: profileData.email || user?.email || "",
          profileImage: profileData.profileImage || profileData.avatar || "",
        });
        setImagePreview(profileData.profileImage || profileData.avatar || null);
        
        // Update AuthContext with profile data
        updateUser({
          username: profileData.username || user?.name || "",
          email: profileData.email || user?.email || "",
          profileImage: profileData.profileImage || profileData.avatar || null,
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to user data if profile load fails
        setEditData({
          username: user?.username || user?.name || "",
          email: user?.email || "",
          profileImage: user?.profileImage || "",
        });
        setImagePreview(user?.profileImage || null);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (user) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id || user?._id]); // Only reload if user ID changes

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      username: user?.username || "",
      email: user?.email || "",
      profileImage: user?.profileImage || "",
    });
    setImagePreview(user?.profileImage || null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      username: user?.username || "",
      email: user?.email || "",
      profileImage: user?.profileImage || "",
    });
    setImagePreview(user?.profileImage || null);
  };

  const compressImage = (file: File, maxWidth: number = 200, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const toast = getGlobalToast();
      if (!file.type.startsWith('image/')) {
        toast?.({
          title: "Invalid File",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast?.({
          title: "File Too Large",
          description: "Image size should be less than 5MB.",
          variant: "destructive",
        });
        return;
      }

      try {
        const compressedImage = await compressImage(file, 200, 0.7);
        setImagePreview(compressedImage);
        setEditData(prev => ({
          ...prev,
          profileImage: compressedImage
        }));
      } catch (error) {
        console.error('Image compression error:', error);
        const toast = getGlobalToast();
        toast?.({
          title: "Error",
          description: "Failed to process the image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setEditData(prev => ({
      ...prev,
      profileImage: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const toast = getGlobalToast();
    
    try {
      // Prepare data for backend (map profileImage to avatar)
      const profileUpdate = {
        username: editData.username,
        profileImage: editData.profileImage, // Will be mapped to avatar in backend
      };

      // Call backend API to update profile
      const updatedProfile = await updateMyProfile(profileUpdate);
      
      // Update local state with response
      const updatedUserData = {
        username: updatedProfile.username || editData.username,
        email: updatedProfile.email || editData.email,
        profileImage: updatedProfile.profileImage || updatedProfile.avatar || editData.profileImage,
      };
      
      // Update AuthContext
      updateUser(updatedUserData);
      
      // Update local edit data
      setEditData({
        ...editData,
        ...updatedUserData,
      });
      setImagePreview(updatedUserData.profileImage || null);
      
      setIsEditing(false);
      
      toast?.({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast?.({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const glassClass = "backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10 rounded-2xl ring-1 ring-white/50";

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Enhanced Header - Modern & Professional */}
      <div className="relative">
        <div className={`${glassClass} p-6 sm:p-8`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Enhanced Icon with glow effect */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-teal-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/30 ring-2 ring-white/20 group-hover:scale-105 transition-transform duration-300">
                  <UserCircle2 className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 bg-clip-text text-transparent mb-2 tracking-tight leading-tight">
                  Your Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium">
                  Manage your account information and preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <Card className={glassClass}>
        <CardHeader>
          <div className="flex flex-col items-center text-center pb-6 border-b border-gray-200">
            {/* Avatar */}
            <div className="relative group">
              <div 
                className="w-32 h-32 bg-gradient-to-br from-purple-600 to-teal-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden relative cursor-pointer"
                onClick={isEditing ? () => fileInputRef.current?.click() : undefined}
              >
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="h-16 w-16 text-white" />
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-purple-100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      title="Upload image"
                    >
                      <Camera className="h-5 w-5 text-gray-700" />
                    </button>
                    {imagePreview && (
                      <button
                        type="button"
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        title="Remove image"
                      >
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mt-4">
              {isLoadingProfile ? 'Loading...' : (editData.username || user?.username || user?.name || 'User')}
            </CardTitle>
            <p className="text-gray-600 break-all px-2">{editData.email || user?.email}</p>
            {isEditing && (
              <p className="text-xs text-gray-500 italic mt-2">Click the camera icon to upload a profile image</p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b-2 border-purple-600 inline-block">Account Information</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 py-3 border-b border-gray-200">
                <Label className="flex items-center gap-2 text-gray-700 font-semibold sm:min-w-[150px]">
                  <UserCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span>Username</span>
                </Label>
                {isEditing ? (
                  <Input
                    name="username"
                    value={editData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="flex-1 sm:ml-4"
                  />
                ) : (
                  <span className="text-gray-600 font-medium sm:text-right flex-1 sm:ml-4 break-words">{editData.username || user?.username || user?.name || 'N/A'}</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 py-3 border-b border-gray-200">
                <Label className="flex items-center gap-2 text-gray-700 font-semibold sm:min-w-[150px]">
                  <Mail className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span>Email Address</span>
                </Label>
                {isEditing ? (
                  <Input
                    name="email"
                    type="email"
                    value={editData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="flex-1 sm:ml-4"
                  />
                ) : (
                  <span className="text-gray-600 font-medium sm:text-right flex-1 sm:ml-4 break-all">{editData.email || user?.email || 'N/A'}</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 py-3">
                <Label className="flex items-center gap-2 text-gray-700 font-semibold sm:min-w-[150px]">
                  <Calendar className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span>Member Since</span>
                </Label>
                <span className="text-gray-600 font-medium sm:text-right flex-1 sm:ml-4">
                  {formatDate(user?.createdAt || user?.signupTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="flex justify-center pt-2 pb-4">
            {isEditing ? (
              <div className="flex gap-3 w-full max-w-md">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-teal-500 text-white"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleEdit}
                className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-8"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b-2 border-purple-600 inline-block">Account Statistics</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200 hover:shadow-lg transition-all">
                <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{safeVisions.length}</p>
                <p className="text-xs uppercase tracking-wide text-gray-600">Visions</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-teal-50 to-white border border-teal-200 hover:shadow-lg transition-all">
                <Target className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{safeGoals.length}</p>
                <p className="text-xs uppercase tracking-wide text-gray-600">Goals</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 hover:shadow-lg transition-all">
                <CheckSquare2 className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{safeTasks.length}</p>
                <p className="text-xs uppercase tracking-wide text-gray-600">Tasks</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200 hover:shadow-lg transition-all">
                <Lightbulb className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{safeIdeas.length}</p>
                <p className="text-xs uppercase tracking-wide text-gray-600">Ideas</p>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
