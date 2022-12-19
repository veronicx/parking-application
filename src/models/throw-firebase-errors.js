export default class ThrowFirebaseErrors { 

    constructor(error, response) { 
        this.error = error
        this.response = response
    }

    checkFirebaseResponse() {
        if (this.response.error) {
          switch (this.response.error.code) {
            case 'ABORTED':
              return 'The operation was aborted';
            case 'DATA_LOSS':
              return 'There was a data loss';
            case 'INTERNAL':
              return 'There was an internal error';
            case 'INVALID_ARGUMENT':
              return 'Invalid argument';
            case 'NETWORK_ERROR':
              return 'There was a network error';
            case 'NOT_FOUND':
              return 'The requested resource was not found';
            case 'OUT_OF_RANGE':
              return 'The operation was out of range';
            case 'PERMISSION_DENIED':
              return 'Permission denied';
            case 'RESOURCE_EXHAUSTED':
              return 'The resource has been exhausted';
            case 'UNAUTHENTICATED':
              return 'User is not authenticated';
            case 'UNAVAILABLE':
              return 'The service is unavailable';
            case 'UNIMPLEMENTED':
              return 'The operation is not implemented';
            default:
              return 'Error';
          }
        } else {
          return 'Success';
        }
      }
   
  message() {
    let field = '';
    let message = '';
  
    switch (this.error.code) {
      case 'auth/invalid-email':
        field = 'email';
        message = 'Invalid email address.';
        break;
      case 'auth/user-disabled':
        field = 'email';
        message = 'User account has been disabled.';
        break;
      case 'auth/user-not-found':
        field = 'email';
        message = 'User not found.';
        break;
      case 'auth/wrong-password':
        field = 'password';
        message = 'Incorrect password.';
        break;
      case 'auth/weak-password':
        field = 'password';
        message = 'The password must be 6 characters long or more.';
        break;
      case 'auth/email-already-in-use':
        field = 'email';
        message = 'The email address is already in use by another account.';
        break;
      case 'auth/operation-not-allowed':
        field = 'email';
        message = 'Email and password accounts are not enabled.';
        break;
      case 'auth/invalid-password':
        field = 'password';
        message = 'The password is invalid or the user does not have a password.';
        break;
      case 'auth/display-name-already-in-use':
        field = 'displayName';
        message = 'The display name is already in use by another account.';
        break;
      default:
        field = 'unknown';
        message = 'An unexpected error occurred.';
        break;
    }
  
    return { field: field, message: message };
  }
  
}