export class ApplicationException extends Error {
    constructor(override message: string,public statusCode:number,override cause?:unknown) {
        super();  
        // super(message,{cause}); // Pass the message
        this.name = this.constructor.name; // Set the error name to the class name
        Error.captureStackTrace(this, this.constructor);
    }               

}


