import axios from 'axios';

export const fetchWithTimeout = async (url = '') => {
  let statusText = null;
  let code = null;

  const result = await axios
    .get(url, { timeout: 700 })
    .then((result) => {
      statusText = result.statusText;
      return result;
    })
    .catch((err) => {
      code = err.code;
      return err;
    });

  // ECONNABORTED' = timeout
  // ECONNREFUSED = offline

  return { statusText, code };
};
