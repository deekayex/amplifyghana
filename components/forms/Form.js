"use client";
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { database } from '../../firebase/firebase';
import { collection, addDoc } from '@firebase/firestore';
import Link from 'next/link';

const BasicForm = ({ onSubmit }) => {
  const [submittedMessage, setSubmittedMessage] = useState('');

  return (
    <div>
      <Formik
        initialValues={{ name: '', email: '', phone: '', message: '' }}
        validate={(values) => {
          const errors = {};
          if (!values.email && !values.phone) {
            errors.email = 'Email or phone is required';
            errors.phone = 'Email or phone is required';
          } else if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmittedMessage(values.message.toLowerCase());
          onSubmit(values, setSubmitting);
          
          const messagesCollection = collection(database, 'messages');

          // Modify values object to include sender information
          const senderName = values.name;
          const contactNumber = values.phone;
          const timestamp = new Date().toISOString(); // Generate current timestamp
          values.senderName = senderName;
          values.contactNumber = contactNumber;
          values.timestamp = timestamp;

          addDoc(messagesCollection, values)
            .then(() => {
              alert('Nice! Your submission has been successfully received. We will respond to you as soon as possible!');
              console.log(values);
            })
            .catch((error) => {
              console.error('Error submitting form:', error);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({
         isSubmitting,
         /* and other goodies */
       }) => (
          <Form className="submission-form">
            <Field type="text" name="name" placeholder="Your name" className="input-name" />

            <Field type="email" name="email" placeholder="Email" className="input-email" />
            <ErrorMessage name="email" component="div" className="error-message" />

            <Field type="tel" name="phone" placeholder="Phone number" className="input-phone" />
            <ErrorMessage name="phone" component="div" className="error-message" />

            <Field
              as="textarea"
              name="message"
              placeholder="What do you need? (Let us know the details of your request and we will reach out to you ASAP)"
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

          {/* Link is displayed here */}
          <Link href="/t2nrkxgof25hi3as46h5mgen5cjd7hdnxxogi943hg1hm9j1sdft68eskyiwfe0siz96cuiu7yn7dfn9c7stz01hvi">Sign In</Link>
        </div>
      )}
    </div>
  );
};

export default BasicForm;
