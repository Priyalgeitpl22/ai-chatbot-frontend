import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { Thread } from "./threadSlice";


interface ThreadState {
  threads: Thread|null;
  selected: boolean;
}

const initialState:ThreadState = {
    threads:null,
    selected:false
}


const selectedThread = createSlice({
    name:"selectedTherd",
    initialState,
    reducers:{
        setThread:(state,action:PayloadAction<Thread>)=>{
            state.selected=true
            state.threads=action.payload
        }
    }
})


export default selectedThread.reducer;
export const {setThread} = selectedThread.actions;