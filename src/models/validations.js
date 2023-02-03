function validateInput(key, input) {
    const result = {
      key: key,
      message: ''
    };
  
    switch(key) {
      case 'name':
        if (!input || input.length < 2 || input.length > 50) {
          result.message = 'Name must be between 2 and 50 characters';
        }
        break;
      case 'email':
        if (!input || !input.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
          result.message = 'Email is not valid';
        }
        break;
      case 'phone':
        if (!input || !input.match(/^\+383\d{8}$/)) {
          //+383800123456
          //+38349970385
          result.message = 'Phone number is not valid (e.g. +383800123456)';
        }
        break;
      case 'duration':
        if (!input.startDate || !input.endDate || input.endDate < input.startDate) {
          result.message = 'Invalid order duration';
        }
        break;
      default:
        result.message = 'Invalid key';
        break;
    }
  
    return result;
  }

  export { validateInput }