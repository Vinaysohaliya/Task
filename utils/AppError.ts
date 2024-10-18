class AppError extends Error {
    statusCode: number; // Property to hold the status code
  
    constructor(message: string, statusCode: number) {
      super(message); // Call the parent class (Error) constructor with the message
  
      this.statusCode = statusCode; // Set the statusCode property
  
      // Capture the stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default AppError;
  