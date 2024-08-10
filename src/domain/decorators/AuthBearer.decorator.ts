export const AuthBearer = () => {
  return (
    target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: unknown[]) {
      const headers = <Headers>args[args.length - 1];
	  console.log(headers)
	  const authBearer:string = headers['authorization'];
		console.log(authBearer.replace('Bearer', ''));
      await originalMethod(this, ...args);
    };

    return descriptor;
  };
};
