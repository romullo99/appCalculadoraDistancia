import api from './api';

export const saveCalculation = async (data) => {
  try {
    const response = await api.post('/distances', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getCalculations = async () => {
  try {
    const response = await api.get('/distances');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
