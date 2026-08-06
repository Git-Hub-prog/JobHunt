import { createSlice } from "@reduxjs/toolkit";

const initialFilters = {
    keyword: "",
    location: "",
    role: "",
    jobType: "",
    salary: "",
};

const jobSlice = createSlice({
    name:"job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null,
        searchJobByText:"",
        allAppliedJobs:[],
        searchedQuery:"",
        jobFilters: initialFilters,
        savedJobIds: [],
    },
    reducers:{
        // actions
        setAllJobs:(state,action) => {
            state.allJobs = action.payload;
        },
        setSingleJob:(state,action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs:(state,action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText:(state,action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs:(state,action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery:(state,action) => {
            state.searchedQuery = action.payload;
        },
        setJobFilter:(state, action) => {
            const { name, value } = action.payload;
            if (!state.jobFilters) state.jobFilters = { ...initialFilters };
            state.jobFilters[name] = value;
        },
        clearJobFilters:(state) => {
            state.jobFilters = { ...initialFilters };
            state.searchedQuery = "";
        },
        toggleSavedJob:(state, action) => {
            const jobId = action.payload;
            if (!jobId) return;

            if (!state.savedJobIds) state.savedJobIds = [];

            if (state.savedJobIds.includes(jobId)) {
                state.savedJobIds = state.savedJobIds.filter((id) => id !== jobId);
            } else {
                state.savedJobIds.push(jobId);
            }
        },
        setSavedJobIds:(state, action) => {
            state.savedJobIds = action.payload;
        }
    }
});
export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery,
    setJobFilter,
    clearJobFilters,
    toggleSavedJob,
    setSavedJobIds,
} = jobSlice.actions;
export default jobSlice.reducer;
