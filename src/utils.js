const BASE_URL = 'https://saber.supermedium.com';

function getS3FileUrl (id, name) {
  return `${BASE_URL}/${id}-${name}?v=1`;
}
export default { getS3FileUrl };
