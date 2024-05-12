import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { isAuthenticated } from "../../services/auth/auth";
import { humanPreciseDateFormat } from "../../services/humanDateFormat";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import { getAllJobs } from "../../services/jobs/jobs";
import { FaFacebookMessenger } from "react-icons/fa";
import { IconContext } from "react-icons";



const JobsComponent = (props) => {

    const isClient = isAuthenticated()["user"]["user_type"] == "client";

    const mainAreaFr = "col-md-10 col-sm12 border-right"
    const rightAreaFr = "col-md-2 col-sm12"
    const mainAreaClient = "col-md-12 col-sm12"

    useEffect(() => {
        fetchAllJobs()
    }, []);

    const [jobs, setJobs] = useState({
        jobList: [],
        isLoading: true,
        error: "",
        success: false
    })

    const fetchAllJobs = () => {
        getAllJobs()
            .then(data => {
                if (data.error) {
                    setJobs({ ...jobs, error: data.error, isLoading: false })
                } else {
                    setJobs({ ...jobs, jobList: data, success: true, isLoading: false, error: "" });
                }
            })
            .catch(err => {
                setJobs({ ...jobs, isLoading: false, error: "Please Check Your Internet Connection" })
            })
    }

    const applicantCard = (applicantData) => {

        let messagePage = `/message/${applicantData["freelancer"]["chat_id"]}`

        return <li class="list-group-item">
            <Link to={messagePage}>
                <IconContext.Provider value={{ size: "2em" }}>
                    <FaFacebookMessenger className="text-success mx-3" />
                </IconContext.Provider>
            </Link>
            {applicantData["freelancer"]["name"]}
        </li>
    }

    const applicantList = (applicants) => {
        return applicants.map(applicantCard)
    }

    const applicantsComp = (applicants) => {
        console.log(applicants)
        return isClient && <div className="col-md-12">
            <h1 className="text-center">Applicants</h1>
            <ul class="list-group list-group-flush list-unstyled card-columns">
                {applicantList(applicants)}
                {/* <li class="list-group-item">
                    <IconContext.Provider value={{ size: "2em" }}>
                        <FaFacebookMessenger className="text-success mx-3" />
                    </IconContext.Provider>
                    Cras justo odio
                </li>
                <li class="list-group-item">
                    <IconContext.Provider value={{ size: "2em" }}>
                        <FaFacebookMessenger className="text-success mx-3" />
                    </IconContext.Provider>
                    Cras justo odio
                </li>
                <li class="list-group-item">
                    <IconContext.Provider value={{ size: "2em" }}>
                        <FaFacebookMessenger className="text-success mx-3" />
                    </IconContext.Provider>
                    Cras justo odio
                </li>
                <li class="list-group-item">
                    <IconContext.Provider value={{ size: "2em" }}>
                        <FaFacebookMessenger className="text-success mx-3" />
                    </IconContext.Provider>
                    Cras justo odio
                </li> */}
            </ul>
        </div>
    }

    const connectWithClientComp = (chatDetailsList) => {
        let chatDetail = chatDetailsList[0]
        let messagePage = "/message/" + chatDetail["freelancer"]["chat_id"]
        return !isClient && <div className={rightAreaFr}>
                            <center>
                                <Link to={messagePage}>
                                <IconContext.Provider value={{ size: "3em" }}>
                                    <center>
                                    <FaFacebookMessenger className="mr-4 text-success my-4" />
                                    </center>
                                </IconContext.Provider>
                                </Link>
                                <small>chat with employer</small>
                            </center>
                        </div>
    }

    const applyNowComp = () => {
        return !isClient && <button className="btn btn-block btn-warning">Apply Now</button>
    }

    const leftClass = !isClient ? "col-md-10 col-sm12 border-right" : mainAreaClient

    const jobCard = (data) => {
        return <div className="mx-0 my-5 col-md-12">
            <div classname="card">
                <h5 className="card-header">{data["title"]}</h5>
                <div className="card-body">
                    <div className="row">
                        <div className={leftClass}>
                            <h5 class="card-title">{data["description"]}</h5>
                            <p class="card-text">{data["client"]}</p>
                        </div>

                        {connectWithClientComp(data["job_applications"])}
                        
                        {applicantsComp(data["job_applications"])}

                        {applyNowComp()}
                        
                        
                    </div>
                </div>
            </div>
        </div>
    }

    const jobList = (jList) => {
        return jList.map(jobCard)
    }

    const isLoadingText = () => {
        return jobs.isLoading && <center>Page is Loading...</center>
    }

    return <div className="container min-height-fix-footer">
        {isLoadingText()}
        <div className="row">
            {jobList(jobs.jobList)}
        </div>
    </div>
}

export default withRouter(JobsComponent);