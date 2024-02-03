import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { database } from '../../firebase/firebase';
import { collection, addDoc } from '@firebase/firestore';
import { Link } from 'react-router-dom';

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
          addDoc(messagesCollection, values)
            .then(() => {
              alert('Nice! Your submission has been succesfully received we will respond to you as soon as possible!');
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
        {({ isSubmitting }) => (
          <Form className="submission-form">
            <Field type="name" name="name" placeholder="Your name" className="input-name" />

            <Field type="text" name="email" placeholder="Email" className="input-email" />
            <ErrorMessage name="email" component="div" className="error-message" />

            <Field type="text" name="phone" placeholder="Phone number" className="input-phone" />
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
          <Link to="/t2nrkxgof25hi3as46h5mgen5cjd7hdnxxogi943hg1hm9j1sdft68eskyiwfe0siz96cuiu7yn7dfn9c7stz01hvi">Sign In</Link>
        </div>
      )}
    </div>
  );
};

export default BasicForm;
