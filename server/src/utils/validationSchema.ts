// import { object, string, number, date, InferType } from 'yup';
import { isValidObjectId } from 'mongoose';
import *as yup from 'yup';

const myEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-.]+\.[a-zA-Z]{2,4}$/
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[A-Za-z\d\W]{8,}$/;


yup.addMethod(yup.string, 'email', function validateEmail(message) {
    return this.matches(myEmailRegex, {
      message,
      name: 'email',
      excludeEmptyString: true,
    });
  });

export const newUserSchema = yup.object({
  name: yup.string().required("Name is missing"),
  email: yup.string().email("Invalid email").required("email is missing"),
  password: yup
  .string()
  .required("password is missing")
  .min(8, "Password must be at least 8 characters long")
  .matches(passwordRegex, "Password is too simple")
});

export const verifyTokenSchema = yup.object({
    id: yup.string().test({
      name: "valid-id",
      message: "Invalid user id",
      test: (value) => {
        return isValidObjectId(value);
        },
      }),
   
    token: yup.string().required("Token is missing"),
   
  });



