export type keyValues = "email" | "full_name" | "password";

export type setForm = React.Dispatch<React.SetStateAction<FormType>>;

export type setDate = React.Dispatch<React.SetStateAction<Date|null>>;

export type animate = {
  ref:HTMLDivElement;
  prevRect: DOMRect | null;
}

export type radio={
  value:FormType;
  setValue:React.Dispatch<React.SetStateAction<FormType>>;
}

export type inputType = {
  type: string;
  name:string;
  placeHolder?:string;
  required?:boolean;
  value:FormType;
  setValue:React.Dispatch<React.SetStateAction<FormType>>;
  setIsValid?:React.Dispatch<React.SetStateAction<boolean>>;
  isValid?:boolean;
  errors?:{full_name:string,email:string,password:string};
  setErrors?:React.Dispatch<React.SetStateAction<{full_name:string,email:string,password:string}>>;
  test?:boolean;
  input_ref?:any;
}

export type valueKeys = "email" | "gender" | "password" | "full_name" | "location" | "birth_date";

export type FormType = {
  full_name: string;
  email: string;
  password: string;
  gender: string;
  location: string;
  birth_date: string;
}