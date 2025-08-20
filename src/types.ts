//* TIPADOS DE TYPESCRIPT *//
const x: number = 30;
const y: number = 30;

const res = x + y;

type ning = string & number;

type Person = {
  age: number;
  name: string;
  birthDate: Date;
  isMarried?: boolean;
} | null;

type PersonExtended =
  | (Person & {
      lastName: string;
    })
  | null;

const personSample: Person = {
  age: 21,
  name: "Jhon",
  birthDate: new Date("1992-07-22"),
};

interface PersonInterface {
  age: number;
  name: string;
  birthDate: Date;
  isMarried?: boolean;
}

interface PersonInterfaceExtended extends PersonInterface {
  lastName: string;
}

type PersonPartial = Partial<Person>;

const personIntfSample: PersonInterfaceExtended = {
  age: 21,
  name: "Jhon",
  birthDate: new Date("1992-07-22"),
  lastName: "Doe",
};

interface PersonInterfaceShortened extends Omit<PersonInterface, "birthDate"> {
  lastName: string;
}
enum UserRole {
  ADMIN = "Admin",
  CLIENT = "Client",
  SUPER_ADMIN = "SuperAdmin",
}
interface Client {
  userName: string;
  password: string;
  role: UserRole;
}

const clientSample: Client = {
  userName: "Lucas",
  password: "1234",
  role: UserRole.ADMIN,
};

interface args {
  arg1: string;
  arg2: number;
}
type MyFunction = (arg1: string, arg2: number) => string;

const functionSample: MyFunction = (arg1: string, arg2: number) => {
  return arg1 + arg2;
};

type MyFunction1 = (arg: args) => string;

const functionSample1: MyFunction1 = (args: args) => {
  const { arg1, arg2 } = args; //Destructuring
  return arg1 + arg2;
};

const NOSEHACE: any = new Date("12");
const NOSEHACE1: unknown = new Date("12");
