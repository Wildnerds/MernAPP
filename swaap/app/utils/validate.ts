import * as yup from "yup";

type ValidationResult<T> = { error?: string; values?: T };

export const yupValidator = async <T extends object>(
  schema: yup.Schema<T>,
  value: T
): Promise<ValidationResult<T>> => {
  try {
    const data = await schema.validate(value);
    return { values: data };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { error: error.message };
    } else {
      return { error: (error as any).message };
    }
  }
};


 export const myEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-.]+\.[a-zA-Z]{2,4}$/
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[A-Za-z\d\W]{8,}$/;


yup.addMethod(yup.string, 'email', function validateEmail(message) {
    return this.matches(myEmailRegex, {
      message,
      name: 'email',
      excludeEmptyString: true,
    });
  });

  const emailAndPasswordValidation = {
    email: yup.string().email("Invalid email").required("email is missing"),
    password: yup
      .string()
      .required("password is missing")
      .min(8, "Password must be at least 8 characters long")
      .matches(passwordRegex, "Password is too simple")
  }

export const newUserSchema = yup.object({
  name: yup.string().required("Name is missing"),
  ...emailAndPasswordValidation
 
});

export const signInSchema = yup.object({
   ...emailAndPasswordValidation
});

export const newProductSchema = yup.object({

  name: yup.string().required("Product name is missing"),
  description: yup.string().required("Product description is missing"),
  category: yup.string().required("Product category is missing"),
  price: yup.string().transform((value) => {
    if (isNaN(+value)) return " ";

    return value;
  }).required("Product Price is missing"),
  purchasingDate: yup.date()
  .required("Purchasing Price is missing"),
});


