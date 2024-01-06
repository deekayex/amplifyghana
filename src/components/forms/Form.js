// Render Prop
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { database } from '../../firebase/firebase';
import { collection, addDoc } from '@firebase/firestore';

const BasicForm = () => (
  
  <div>

<Formik
  initialValues={{ name: '', email: '', phone: '', message: '' }}
  validate={(values) => {
    const errors = {};
    if (!values.email) {
      // Your validation logic
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    return errors;
  }}
  onSubmit={(values, { setSubmitting }) => {
    // Save the form details in Firebase Firestore
    const messagesCollection = collection(database, 'messages');
    addDoc(messagesCollection, values)
      .then(() => {
        // Show success message or perform other actions
        alert('Form submitted successfully!');
        console.log(values);
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        // Handle the error (e.g., show an error message to the user)
      })
      .finally(() => {
        setSubmitting(false);
      });
  }}
>
  {({ isSubmitting }) => (
    <Form className="submission-form">
      <Field type="name" name="name" placeholder="Your name" className="input-name" />
      <Field type="email" name="email" placeholder="Email" className="input-email" />
      <ErrorMessage name="email" component="div" className="error-message" />

      <Field type="number" name="phone" placeholder="Phone number" className="input-phone" />

      <Field
        as="textarea"
        name="message"
        placeholder="WHAT DO YOU NEED? (LET US KNOW THE DETAILS OF YOUR REQUEST AND WE WILL REACH OUT TO YOU ASAP)"
        className="message-box"
      />
      <button type="submit" disabled={isSubmitting} className="form-submit">
        Submit
      </button>
    </Form>
  )}
</Formik>

  </div>
);

export default BasicForm;