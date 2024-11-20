// export const API_BASE_URL = process.env.API_BASE_URL;
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// export const ENDPOINTS = {
//   GET_ALL_USERS: "/api/users/allusers",
//   LOGIN: "/api/users/login",
//   REGISTER: "/api/users/register",
//   USER_PROFILE: "/api/users/userProfile",
//   USER_RECAP: "/api/user/recap",
//   USER_POST_ACTIVITY: "/api/user/activities",
//   USER_ACTIVITY_SUMMARY: "/api/user/activities/summary",
//   USER_LEADERBOARDS: "/api/users/leaderboards",
//   USER_UPDATE_PROFILE: "/api/users/update/profile",
//   USER_FOLLOWING: "/api/user/following",
//   USER_FOLLOWER: "/api/user/followers",
//   FOLLOW: "/api/user/follow",
//   UNFOLLOW: "/api/user/unfollow",
//   NOTIFICATIONS_REGISTER: "/api/notifications/register",
//   NOTIFICATIONS_SEND: "/api/notifications/send",
// };  

// import { API_BASE_URL } from '@env';
// console.log('API_BASE_URL:', API_BASE_URL);

export const ENDPOINTS = {
  GET_ALL_USERS: `${API_BASE_URL}/api/users/allusers`,
  LOGIN: `${API_BASE_URL}/api/users/login`,
  REGISTER: `${API_BASE_URL}/api/users/register`,
  USER_PROFILE: `${API_BASE_URL}/api/users/userProfile`,
  USER_RECAP: `${API_BASE_URL}/api/user/recap`,
  USER_POST_ACTIVITY: `${API_BASE_URL}/api/user/activities`,
  GET_ALL_USERS_ACTIVITY: `${API_BASE_URL}/api/user/activities`,
  USER_ACTIVITY_SUMMARY: `${API_BASE_URL}/api/user/activities/summary`,
  USER_LEADERBOARDS: `${API_BASE_URL}/api/users/leaderboards`,
  USER_UPDATE_PROFILE: `${API_BASE_URL}/api/users/update/profile`,
  USER_FOLLOWING: `${API_BASE_URL}/api/user/following`,
  USER_FOLLOWER: `${API_BASE_URL}/api/user/followers`,
  FOLLOW: `${API_BASE_URL}/api/user/follow`,
  UNFOLLOW: `${API_BASE_URL}/api/user/unfollow`,
  NOTIFICATIONS_REGISTER: `${API_BASE_URL}/api/notifications/register`,
  NOTIFICATIONS_SEND: `${API_BASE_URL}/api/notifications/send`,
};