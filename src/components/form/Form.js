// Render Prop
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const BasicForm = () => (
  <div>

    <Formik
      initialValues={{ email: '', password: '' }}
      validate={values => {
        const errors = {};
        if (!values.email) {
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form className='submission-form'>
          <Field type="name" name="name" placeholder='Your name' className= 'input-name' />
          <Field type="email" name="email" placeholder='Email' className= 'input-email' />
          <ErrorMessage name="email" component="div" className='error-message'/>

          <Field type="number" name="phone" placeholder='Phone number' className= 'input-phone' />
          
          <textarea type= "input" name="input" placeholder= 'WHAT DO YOU NEED? (LET US KNOW THE DETAILS OF YOUR REQUEST AND WE WILL REACH OUT TO YOU ASAP)' className='message-box'/>
          <button type="submit" disabled={isSubmitting} className='form-submit'>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
);

export default BasicForm;