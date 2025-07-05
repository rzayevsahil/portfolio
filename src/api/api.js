export const BASE_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to extract error message from response
const handleErrorResponse = async (response) => {
  try {
    const errorData = await response.json();
    // Backend'den gelen hata mesajını kullan, yoksa varsayılan mesaj
    if (errorData && errorData.message) {
      throw new Error(errorData.message);
    } else if (errorData && typeof errorData === 'string') {
      throw new Error(errorData);
    }
  } catch (parseError) {
    // JSON parse edilemezse varsayılan mesajları kullan
  }
  
  // HTTP status code'a göre varsayılan mesajlar
  const defaultMessages = {
    400: 'Geçersiz istek.',
    401: 'Yetkilendirme gerekli.',
    403: 'Erişim reddedildi.',
    404: 'Kaynak bulunamadı.',
    500: 'Sunucu hatası.',
    502: 'Sunucuya ulaşılamıyor.',
    503: 'Servis geçici olarak kullanılamıyor.'
  };
  
  const message = defaultMessages[response.status] || 'Bir hata oluştu.';
  throw new Error(message);
};

export const contactApi = {
  get: async () => {
    const response = await fetch(`${BASE_URL}/contact`);
    if (!response.ok) {
      if (response.status === 404) {
        const error = await response.json();
        throw new Error(error.message); // ya da özel mesaj döndür
      }
      await handleErrorResponse(response); // başka hataları ele al
    }
    return response.json();
  },
  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/contact/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleErrorResponse(response);
    return response.json();
  },
  create: async (data) => {
    const response = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleErrorResponse(response);
    return response.json();
  },
};

export const articleApi = {
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/article`);
    if (!response.ok) await handleErrorResponse(response);
    return response.json();
  },
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/article/${id}`);
    if (!response.ok) await handleErrorResponse(response);
    return response.json();
  },
  add: async (data) => {
    const response = await fetch(`${BASE_URL}/article`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleErrorResponse(response);
    return response.json();
  },
  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/article/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    if (response.status === 204) return {};
    if (!response.ok) await handleErrorResponse(response);
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/article/${id}`, {
      method: 'DELETE' });
    if (!response.ok) await handleErrorResponse(response);
    return response.json();
  },
  getPublished: async () => {
    const response = await fetch(`${BASE_URL}/article/published`);
    if (!response.ok) await handleErrorResponse(response);
    return response.json();
  },
};

export const workingHoursApi = {
  get: async () => {
    const response = await fetch(`${BASE_URL}/workinghour`);
    if (!response.ok) {
      if (response.status === 404) {
        const error = await response.json();
        throw new Error(error.message); // ya da özel mesaj döndür
      }
      await handleErrorResponse(response); // başka hataları ele al
    }
    return response.json();
  },
  update: async (data) => {
    const response = await fetch(`${BASE_URL}/workinghour`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleErrorResponse(response);
    return response.json();
  },
};

export const profileApi = {
  get: async () => {
    const response = await fetch(`${BASE_URL}/profile`);
    if (!response.ok) {
      if (response.status === 404) {
        const error = await response.json();
        throw new Error(error.message); // ya da özel mesaj döndür
      }
      await handleErrorResponse(response); // başka hataları ele al
    }
    return response.json();
  },
  update: async (data) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const res = await fetch(`${apiUrl}/Profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) await handleErrorResponse(res);
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
    if (!res.ok) await handleErrorResponse(res);
    return await res.json();
  },
  login: async ({ email, password }) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) await handleErrorResponse(res);
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
    if (!response.ok) await handleErrorResponse(response);
    return response.json(); // { url: ... }
  }
}; 