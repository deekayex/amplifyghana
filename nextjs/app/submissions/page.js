"use client";
import React from "react";
import BasicForm from "../../components/forms/Form";
import "./Submissions.css";
import ScrollToTopOnMount from "../../components/ScrollToTop";
import { Helmet } from "react-helmet";

function Submissions() {
  const handleSubmit = async (values, setSubmitting) => {
    // Form submission logic here
  };

  return (
    <section className="submissions-container" id="submissions">
      <Helmet>
        <title>Submissions | Amplify Ghana</title>
        <meta
          property="og:image"
          content="https://ucarecdn.com/04cd01ca-f483-421d-acad-b64ab26cd7f1/sharelogo.png"
        />
        <meta
          name="description"
          content="Amplify Ghana is an Online Creative’s Promotion and Public Relations Agency Founded in 2020. Our Primary Mission is to Elevate Creatives Throughout Africa, With a Special Focus on Ghana, As that is Where We are Headquartered."
        />
        <link rel="canonical" href="/submissions"></link>
      </Helmet>
      <ScrollToTopOnMount />
      <div className="space" />
      <div className="forms-container">
        <h2 className="form-header-text">Reach out to us</h2>
        <div className="form-container">
          <BasicForm onSubmit={handleSubmit} />
        </div>
      </div>
    </section>
  );
}

export default Submissions;
