const allowedMediaExtensions = ['mp4', 'mp3', 'wav'];

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

export function getMediaType(url: string): 'video' | 'audio' | 'invalid' {
  const ext = url.split('.').pop()?.toLowerCase() || '';
  if (!allowedMediaExtensions.includes(ext)) return 'invalid';
  if (ext === 'mp4') return 'video';
  if (['mp3', 'wav'].includes(ext)) return 'audio';
  return 'invalid';
}
