export const BASE_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const contactApi = {
  get: async () => {
    const response = await fetch(`${BASE_URL}/contact`);
    if (!response.ok) throw new Error('İletişim bilgileri yüklenemedi.');
    return response.json();
  },
  update: async (data) => {
    const response = await fetch(`${BASE_URL}/contact`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Güncelleme sırasında hata oluştu.');
    return response.json();
  },
};

export const articleApi = {
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/makaleler`);
    if (!response.ok) throw new Error('Makaleler yüklenemedi.');
    return response.json();
  },
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/makaleler/${id}`);
    if (!response.ok) throw new Error('Makale bulunamadı.');
    return response.json();
  },
  add: async (data) => {
    const response = await fetch(`${BASE_URL}/makaleler`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Makale eklenemedi.');
    return response.json();
  },
  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/makaleler/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    if (response.status === 204) return {};
    if (!response.ok) throw new Error('Makale güncellenemedi.');
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/makaleler/${id}`, {
      method: 'DELETE' });
    if (!response.ok) throw new Error('Makale silinemedi.');
    return response.json();
  },
};

export const workingHoursApi = {
  get: async () => {
    const response = await fetch(`${BASE_URL}/workinghours`);
    if (!response.ok) throw new Error('Çalışma saatleri yüklenemedi.');
    return response.json();
  },
  update: async (data) => {
    const response = await fetch(`${BASE_URL}/workinghours`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Çalışma saatleri güncellenemedi.');
    return response.json();
  },
};

export const profileApi = {
  get: async () => {
    const response = await fetch(`${BASE_URL}/profile`);
    if (!response.ok) throw new Error('Profil bilgileri yüklenemedi.');
    return response.json();
  },
  update: async (data) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const res = await fetch(`${apiUrl}/Profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Update failed');
    return await res.json();
  },
  uploadPhoto: async (file) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${apiUrl}/Profile/photo`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: formData
    });
    if (!res.ok) throw new Error('Photo upload failed');
    return await res.json();
  },
  login: async ({ email, password }) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return await res.json();
  },
};

export const uploadApi = {
  uploadImage: async (file) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${apiUrl}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Resim yüklenemedi.');
    return response.json(); // { url: ... }
  }
}; 