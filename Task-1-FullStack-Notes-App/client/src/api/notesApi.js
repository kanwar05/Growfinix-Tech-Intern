import http from "./http";

export const fetchNotes = async (params = {}) => {
  const { data } = await http.get("/notes", { params });
  return data;
};

export const fetchNote = async (id) => {
  const { data } = await http.get(`/notes/${id}`);
  return data;
};

export const fetchTrashNotes = async () => {
  const { data } = await http.get("/notes/trash");
  return data;
};

export const createNote = async (payload) => {
  const { data } = await http.post("/notes", payload);
  return data;
};

export const updateNote = async (id, payload) => {
  const { data } = await http.put(`/notes/${id}`, payload);
  return data;
};

export const togglePinNote = async (id) => {
  const { data } = await http.patch(`/notes/${id}/pin`);
  return data;
};

export const toggleArchiveNote = async (id) => {
  const { data } = await http.patch(`/notes/${id}/archive`);
  return data;
};

export const deleteNote = async (id) => {
  const { data } = await http.delete(`/notes/${id}`);
  return data;
};

export const restoreNote = async (id) => {
  const { data } = await http.patch(`/notes/${id}/restore`);
  return data;
};

export const permanentlyDeleteNote = async (id) => {
  const { data } = await http.delete(`/notes/${id}/permanent`);
  return data;
};
