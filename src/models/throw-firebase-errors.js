export default class ThrowFirebaseErrors { 

    constructor(error) { 
        this.error = error
    }

    message() { 
        switch (this.error.code) { 
            case 'auth/email-already-in-use': { 
                return  { field: 'email', message: 'This email already exists'}
            }
            case 'auth/invalid-email': { 
                return { field: 'email', message: 'This is an invalid email'}
            }
            case 'auth/weak-password': {
                return { field: 'password', message: 'Password should be at least 6 characters'}
            }
        }
    }
}