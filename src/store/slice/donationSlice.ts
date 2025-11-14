import { createSlice,PayloadAction } from "@reduxjs/toolkit";

const initialState:{
    amount:string;
    method:string;
}={
    amount:'50',
    method:"test",
}

const donationSlice=createSlice({

    name:'donation',
    initialState,
    reducers:{
        setAmount:(state,action:PayloadAction<string>)=>{
            state.amount=action.payload;
        },
        setMethod:(state,action:PayloadAction<string>)=>{
            state.method=action.payload;
        },
        resetDonation:(state)=>{
            state.amount='50';
            state.method="test";
        }
    }
})
export const{setAmount,setMethod,resetDonation}=donationSlice.actions;
export default donationSlice.reducer;