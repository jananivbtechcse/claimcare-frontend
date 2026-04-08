
import api from '../api/api';

const normalise = (raw) => {
  if (Array.isArray(raw)) return { items: raw, totalCount: raw.length };
  return { items: raw.items ?? raw.data ?? [], totalCount: raw.totalCount ?? 0 };
};

const getAllUsers = async (pageNumber = 1, pageSize = 10) => {
  const res = await api.get('/api/User/users', {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return normalise(res.data);
};

const getPatients = async (pageNumber = 1, pageSize = 10) => {
  const res = await api.get('/api/User/patients', {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return normalise(res.data);
};

const getProviders = async (pageNumber = 1, pageSize = 10) => {
  const res = await api.get('/api/User/providers', {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return normalise(res.data);
};

const getInsuranceCompanies = async (pageNumber = 1, pageSize = 10) => {
  const res = await api.get('/api/User/insurance-companies', {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return normalise(res.data);
};

const deleteUser = async (id) => {
  const res = await api.delete(`/api/User/delete-user/${id}`);
  return res.data;
};

export default { getAllUsers, getPatients, getProviders, getInsuranceCompanies, deleteUser };