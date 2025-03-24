// NavigationControl.js
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationControl = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if coming from submissions
    const fromSubmissions = new URLSearchParams(location.search).get('fromSubmissions');
    const allowLogin = fromSubmissions === 'true';

    if (!allowLogin) {
      // Redirect to the Blank component if not allowed
      navigate('/blank');
    }
  }, [location.search, navigate]);

  return null; // Since this is a utility component, it doesn't render anything
};

export default NavigationControl;
