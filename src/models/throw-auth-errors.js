import  UserModel from './user-model'

export default class ThrowAuthErrors extends  UserModel { 
    constructor(fullName, email, password) {
        super(fullName,email,password)
    }
    
    emailState() {  
        return this.email.length > 0 && this.email.length <= 320 && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email)
    }
    nameState() { 
        return this.fullName.length > 0 && this.fullName.length < 80 && /^[A-Za-z]+$/.test(this.fullName) 
    }
    passwordState() { 
        return this.password.length > 6 && this.password.length < 32 && !/\s/.test(this.password)
    }
    throwWarnings() { 
        const errors = []
        if (this.password && !this.passwordState()) { 
            errors.push({field: 'password', message: 'The password is invalid'})
        }
        if (this.email && !this.emailState()) { 
            errors.push({ field: 'email', message: 'This email is invalid' })
        }
         if (this.fullName && !this.nameState()) { 
            errors.push({field: 'name', message: 'This name is invalid'})
        } 
        return errors
    }
}
