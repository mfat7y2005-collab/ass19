import{ z}from "zod";
import { generalValidationFileds } from "../../common/validation";



export const resendConfirmEmail = {
   body: z.strictObject({
     
        email:generalValidationFileds.email
    
     })

}
export const confirmEmail = {
   body: z.strictObject({
     
        otp:generalValidationFileds.otp
    
     })

}
export const loginSchema = {
   body: resendConfirmEmail.body.safeExtend({
     
        email:generalValidationFileds.email,
        password:generalValidationFileds.password,
        FCM:z.string().optional()
     })

}


export const signupSchema = {
    // params: z.strictObject({
    //     userId:z.string({error: "User ID must be a string"})
    // }),

    body: loginSchema.body.extend({
        username:generalValidationFileds.username,
        confirmPassword:generalValidationFileds.confirmPassword,
        phone:generalValidationFileds.phone.optional()
        //regex معندهاش error عندها message

        // extra:z.coerce.string()
        //tuple هو array بس بحدد نوع كل عنصر فيه 
        //refine بستخدمها عشان اعمل validation علي مستوي ال object مش علي مستوي كل property لو عندي شرط معين عايز اتأكد انه متحققش الا لما اشوف كل ال properties مع بعض
        //superRefine بستخدمها برضو عشان اعمل validation علي مستوي ال object بس بتديني access لل context اللي فيها ال addIssue اللي بستخدمها عشان اضيف error لو ال validation فشل
        //transform بستخدمها عشان احول ال data اللي جايه من ال client قبل ما توصل لل controller بتاعي يعني مثلا لو عايز اخلي ال username يتحول ل lowercase قبل ما يوصل لل controller بعمل transform علي ال username وبكتب جواها ال logic اللي هتخلي ال username يتحول ل lowercase
        
     }).superRefine((data, ctx) => {
        if(data.password !== data.confirmPassword){
            ctx.addIssue({
                code: "custom",
                message: "Passwords don't match",
                path: ["confirmPassword"]
            });
        }
        if(data.email.includes("test")){//لو ال email فيه كلمة test هضيف error
            ctx.addIssue({
                code: "custom",
                message: "Email should not contain 'test'",
                path: ["email"]
            });
        }

        console.log({data, ctx});
    })

       //.refine((data) => {//لو انا عايز check علي حاجه واحده
//         console.log({data})
//         return data.password === data.confirmPassword;
//     }
//    , {error: "Passwords don't match"})
    // .catchall(z.string())//معناها لو هتبعت حاجه زياده ابعتها من النوع كذا
    //كنت ممكن اخليها object واعمل ف الاخر .strict,.strip
    
}

