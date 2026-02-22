export type keyValues_errors = "email" | "full_name" | "password" | "birth_date";

export type setForm = React.Dispatch<React.SetStateAction<FormType>>;

export type setDate = React.Dispatch<React.SetStateAction<Date|null>>;

export type setErrors = React.Dispatch<React.SetStateAction<{full_name:string,email:string,password:string,birth_date:string}>>;

export type errors = {full_name:string,email:string,password:string,birth_date:string};

export type animate = {
  ref:HTMLDivElement;
  prevRect: DOMRect | null;
}

export type radio={
  value:FormType;
  setValue:React.Dispatch<React.SetStateAction<FormType>>;
}

export type select={
  options:string[];
  name:string;
  defaultValue:string;
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
  errors?:errors;
  setErrors?:setErrors;
  test?:boolean;
  input_ref?:any;
}

export type keyValues_input = "email" | "gender" | "password" | "full_name" | "location" | "birth_date";

export type FormType = {
  full_name: string;
  email: string;
  password: string;
  gender: string;
  location: string;
  birth_date: string;
}