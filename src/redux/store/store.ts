import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import organizationReducer from "../slice/organizationSlice";
import agentsReducer from '../slice/agentsSlice';
import threadReducer from "../slice/threadSlice";
import chatsReducer from "../slice/chatSlice";
import authReducer from "../slice/authSlice";
import taskReducer from "../slice/taskSlice";
import settingsReducer from "../slice/settingsSlice";
import faqReducer from "../slice/faqSlice";
import notificationReducer from "../slice/notificationSlice";
import securityReducer from "../slice/securitySlice";
import selectedThreadReducer from "../slice/selectedThread";
import analyticsReducer from "../slice/analyticsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer, 
    organization: organizationReducer,
    agents: agentsReducer,
    thread: threadReducer,
    chats: chatsReducer,
    auth: authReducer,
    task: taskReducer,
    settings: settingsReducer,
    faq: faqReducer,
    notification:notificationReducer,
    security: securityReducer,
    selectedThread:selectedThreadReducer,
    analytics: analyticsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
