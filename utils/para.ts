import Para, { Environment } from "@getpara/react-sdk";

export const paraWeb = new Para(process.env.NEXT_PUBLIC_PARA_ENV as Environment, process.env.NEXT_PUBLIC_PARA_API_KEY as string);


