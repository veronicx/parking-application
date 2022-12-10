import  UserModel from './user-model'

export default class ThrowAuthErrors extends  UserModel { 
    constructor(fullName, email, password) {
        super(fullName,email,password)
    }
    
    validateMail() {  
        return this.email.length > 0 && this.email.length <= 320
    }
    print() { 
        
        console.log(this.validateMail(),this.email,this.password)
    }
}
