import { useEffect, useState } from 'react';

interface FlashMessagesProps {
  success?: string;
  error?: string;
}

export default function AppMasterFlashMessage({ success, error }: FlashMessagesProps) {
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (success) {
      setSuccessMessage(success);
      setSuccessVisible(true);
      const timer = setTimeout(() => setSuccessVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setErrorVisible(true);
      const timer = setTimeout(() => setErrorVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!successVisible && successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 500);
      return () => clearTimeout(timer);
    }
  }, [successVisible]);

  useEffect(() => {
    if (!errorVisible && errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 500);
      return () => clearTimeout(timer);
    }
  }, [errorVisible]);

  return (
    <>
      {successMessage && (
        <div
          className={`alert alert-success flash-message ${
            successVisible ? '' : 'fade-out'
          } d-flex justify-content-between align-items-center`}
        >
          <span>{successMessage}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar"
            onClick={() => setSuccessVisible(false)}
          ></button>
        </div>
      )}

      {errorMessage && (
        <div
          className={`alert alert-danger flash-message ${
            errorVisible ? '' : 'fade-out'
          } d-flex justify-content-between align-items-center`}
        >
          <span>{errorMessage}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar"
            onClick={() => setErrorVisible(false)}
          ></button>
        </div>
      )}
    </>
  );
}