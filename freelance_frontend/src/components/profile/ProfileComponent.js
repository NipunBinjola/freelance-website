import React, { useEffect, useState } from "react";
import logo from '../../assets/images/logo/logo.svg';
import { withRouter } from "react-router-dom";
import profileData from "./profiledata";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { Nav } from "reactstrap";
import { getProfileDetails } from "../../services/profile/profile";
import { isAuthenticated } from "../../services/auth/auth";

const detailCard = (key, data) => {
    return (
        <li className="list-group-item">{key.charAt(0).toUpperCase() + key.slice(1)} <span className="float-right">{data}</span></li>
    )
}

const socialCard = (key, data) => {
    return (
        <li className="list-group-item">
            <center>
                <Link to={{pathname:data}} target="_blank">{key}</Link>
            </center>
        </li>
    )
}

const contestList = (profileD) => {
    const topDetailsField = ["country", "city"]
    return topDetailsField.map(key => {
        // console.log(profileData[key])
        return detailCard(key, profileD[key])
    })
    // return allContest.contest.map(contestCard);
}

const socialList = (profileD) => {
    return Object.keys(profileD["social_links"]).map(key => {
        // console.log(profileData[key])
        return socialCard(key, profileD["social_links"][key])
    })
    // return allContest.contest.map(contestCard);
}

const jobcard = (data) => {
    return <div class="card my-3">
        <div class="card-body">
            <h5 class="card-title">{data["title"]}</h5>
            <p class="card-text">{data["description"]}</p>
            {/* <center><span className=""><small>Google Cloud Services</small></span></center> */}
        </div>
        <ul>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-sm-12">Start Date: {data["from_date"]}</div>
                    <div className="col-md-6 col-sm-12">End Date: {data["to_date"]}</div>
                </div>
            </div>
        </ul>
        <div class="card-footer text-muted">
            <center>{data["client"]}</center>
        </div>
    </div>
}

const jobcard2 = (data) => {
    return <div class="card my-3">
        <div class="card-body">
            <h5 class="card-title">{data["title"]}</h5>
            <p class="card-text">{data["description"]}</p>
            {/* <center><span className=""><small>Google Cloud Services</small></span></center> */}
        </div>
        <ul>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-sm-12">Start Date: {data["from_date"]}</div>
                    <div className="col-md-6 col-sm-12">End Date: {data["to_date"]}</div>
                </div>
            </div>
        </ul>
        <div class="card-footer text-muted">
            <center>{data["employer"]}</center>
        </div>
    </div>
}


const reviewCard = (data) => {
    return <div class="card my-3">
        <div class="card-body">
            <p class="card-text">{data["review"]}</p>
            {/* <center><span className=""><small>Google Cloud Services</small></span></center> */}
        </div>
        <div class="card-footer text-muted">
            <h6>{data["client_name"]} Rating: {data["rating"]}</h6>
        </div>
    </div>
}

const experienceList = (type, profileD) => {
    return profileD["jobs"][type].map(jobcard)
}

const experienceRelList = (profileD) => {
    return profileD["experiences"].map(jobcard2)
}

const reviewList = (profileD) => {
    return profileD["reviews"].map(reviewCard)
}


function ProfileComponent(props) {
    let isClient = false;
    if(isAuthenticated() != null && isAuthenticated()["user"] != null) {
        isClient = isAuthenticated()["user"]["user_type"] == "client"
    }

    useEffect(() => {
        fetchUserProfile()
    }, [])

    const [profileD, setProfile] = useState(profileData)

    const fetchUserProfile = () => {
        getProfileDetails().then(data => {
            setProfile(data);
            console.log(data);
        })
    }
    
    const [state, setState] = useState({
        l1TabClass: "nav-link active",
        l2TabClass: "nav-link",
        l3TabClass: "nav-link"
    })

    const [liState, setLiState] = useState({
        l1: "col-md-12 my-3",
        l2: "d-none col-md-12 my-3",
        l3: "d-none col-md-12 my-3"
    })

    const tabClick = (e) => {
        const idList = ["l1TabClass", "l2TabClass", "l3TabClass"]
        
        let triggerId = e.currentTarget.dataset.id;

        setState({
            l1TabClass: "nav-link",
            l2TabClass: "nav-link",
            l3TabClass: "nav-link"
        });

        let idToUpdate = idList.filter(str => str.includes(triggerId))[0];

        let newObj = {
            l1TabClass: "nav-link",
            l2TabClass: "nav-link",
            l3TabClass: "nav-link"
        }
        newObj[idToUpdate] = "nav-link active"

        setState(newObj)

        setLiState({
            l1: "d-none col-md-12 my-3",
            l2: "d-none col-md-12 my-3",
            l3: "d-none col-md-12 my-3",
        })

        let newObj2 = {
            l1: "d-none col-md-12 my-3",
            l2: "d-none col-md-12 my-3",
            l3: "d-none col-md-12 my-3",
        }
        newObj2[triggerId] = "col-md-12 my-3"
        setLiState(newObj2);
    }


    const f1 = (profileD) => {
        return !isClient && <div className="card mb-4">
        <div className="card-header">
            Pricing
        </div>
        <div className="card-body">
            <ul className="list-group list-group-flush row">
                <center><h2>₹{profileD["pricing"]["min"]} - ₹{profileD["pricing"]["max"]}</h2></center>
            </ul>

        </div>
    </div>
    }

    const f2 = (profileD) => {
        return !isClient && <div className="card mb-4">
        <div className="card-header">
            Social Links
        </div>
        <div className="card-body">
            <ul className="list-group list-group-flush row">
                {/* <li className="list-group-item">Website <span className="float-right">https://saurass.in</span></li>
                <li className="list-group-item">Location <span className="float-right">India</span></li>
                <li className="list-group-item">Comapny <span className="float-right">OSSRNDC</span></li> */}
                {socialList(profileD)}
            </ul>

        </div>
    </div>
    }

    const f3 = (profileD) => {
        return !isClient && <div className="card mb-4">
        <div className="card-header">
            Ratings
        </div>
        <div className="card-body">
            <center>
                <h2>4.5*</h2>
                <span>100+ ratings</span>
            </center>

        </div>
    </div>
    }

    const f4 = (profileD) => {
        return !isClient && <div className="card mb-4">
        <div className="card-header">
            Jobs
        </div>
        <div className="card-body">
            <ul class="nav nav-tabs nav-fill" role="tablist">
                <li className="nav-item" role="presentation" id="ls1" onClick={tabClick.bind(this)} data-id="l1">
                    <p className={state.l1TabClass}>Applied</p>
                </li>
                <li className="nav-item" role="presentation" id="ls2" onClick={tabClick.bind(this)}  data-id="l2">
                    <p className={state.l2TabClass}>In Progress</p>
                </li>
                <li className="nav-item" role="presentation" id="ls3" onClick={tabClick.bind(this)}  data-id="l3">
                    <p className={state.l3TabClass}>Completed</p>
                </li>
            </ul>

            <div class="tab-content">
                <div className={liState.l1} id="l1">
                    {experienceList("applied_jobs", profileD)}
                </div>
                <div className={liState.l2} id="l2" role="tabpanel" aria-labelledby="ex1-tab-2">
                    {experienceList("ongoing", profileD)}
                </div>
                <div className={liState.l3} id="l3" role="tabpanel" aria-labelledby="ex1-tab-3">
                    {experienceList("completed", profileD)}
                </div>
            </div>

        </div>
    </div>
    }


    const f5 = (profileD) => {
        return !isClient && <div className="card mb-4">
        <div className="card-header">
            Experience
        </div>
        <div className="card-body">
            {experienceRelList(profileD)}
        </div>
    </div>
    }

    const f6 = (profileD) => {
        return !isClient && <div className="card mb-4">
        <div className="card-header">
            Reviews
        </div>
        <div className="container">
            {reviewList(profileD)}
        </div>
    </div>
    }
    
    return (
        <div className="min-height-fix-footer mx-0">
            {/* <p>{JSON.stringify(state)}</p> */}
            <div className="container">
                <div className="row my-5">
                    <div className="col-md-4">

                        <div className="card mb-4">
                            <div className="card-header">
                                Basic Details
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4 py-2">

                                        <img src={logo} alt="100x100" className="rounded-circle dp-profile img-fluid" data-holder-rendered="true"></img>

                                    </div>
                                    <div className="col-md-8 py-4">
                                        <h4>{profileD["name"]}</h4>
                                    </div>
                                </div>
                                <ul className="list-group list-group-flush row">
                                    {/* <li className="list-group-item">Website <span className="float-right">https://saurass.in</span></li>
                                    <li className="list-group-item">Location <span className="float-right">India</span></li>
                                    <li className="list-group-item">Comapny <span className="float-right">OSSRNDC</span></li> */}
                                    {contestList(profileD)}
                                </ul>

                            </div>
                        </div>

                        {f1(profileD)}

                        {f2(profileD)}

                        {f3(profileD)}

                    </div>
                    <div className=" col-md-8">

                        <div className="card mb-4">
                            <div className="card-header">
                                About
                            </div>
                            <div className="card-body">
                                {profileD["about"]}

                            </div>
                        </div>

                        {f4(profileD)}

                        {f5(profileD)}

                        {f6(profileD)}


                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(ProfileComponent);