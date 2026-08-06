import React from 'react'
import { useSelector } from 'react-redux'
import BranchRecommendations from '../BranchRecommendations'
import Navbar from '../shared/Navbar'

const BranchRecommendationsPage = () => {
    const { user } = useSelector(store => store.auth);

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-6 px-4 md:px-0'>
                <BranchRecommendations profile={user?.profile} />
            </div>
        </div>
    )
}

export default BranchRecommendationsPage
