export function isValidEmail(value: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}
export function isValidPassword(value: string) {
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(value);
}

export function isValidUrl(value: string) {
  const urlRegex =
    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:\d+)?(\/[\w- .\/?%&=]*)?$/;
  return urlRegex.test(value);
}
