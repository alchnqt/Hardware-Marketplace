import { useEffect, useRef } from 'react';
import type { NavigateProps } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const Navigate: React.FC<NavigateProps> = ({ to, replace, state }) => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    navigateRef.current(to, { replace, state });
  }, [to, replace, state]);

  return null;
};

export default Navigate;