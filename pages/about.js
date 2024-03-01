// pages/index.js (or any other page)
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const About = ({ data }) => {
  return (
    <div>
      <h1>Server-Side Rendering with Firebase and Next.js</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export async function getServerSideProps() {
  // Fetch data from Firebase Firestore
  const snapshot = await firebase.firestore().collection('items').get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return {
    props: {
      data,
    },
  };
}

export default About;
