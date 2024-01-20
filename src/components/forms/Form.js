// Render Prop
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { database } from '../../firebase/firebase';
import { collection, addDoc } from '@firebase/firestore';
import { Link } from 'react-router-dom';

const BasicForm = ({onSubmit}) => {


  const [submittedMessage, setSubmittedMessage] = useState('');
  
  return (

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

        setSubmittedMessage(values.message.toLowerCase());
              onSubmit(values, setSubmitting);
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
          <Field type="name" name="name" placeholder="Your name" className="input-name" required/>
          <Field type="email" name="email" placeholder="Email" className="input-email" required/>
          <ErrorMessage name="email" component="div" className="error-message" />

          <Field type="number" name="phone" placeholder="Phone number" className="input-phone" required/>

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
              {submittedMessage === 'gods of death love apples' && (
                <div>
                  <p>Well done! Message contains the required content.</p>
                  {/* Display your link here */}
                  <Link to='/login'>Sign In</Link>
                </div>
              )}
      </div>
      );
    }

export default BasicForm;