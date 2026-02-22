// =============================================
// 📁 src/clinic/Services/condition.service.js
// Condition API service layer
// Cookie-based auth + deployment ready
// =============================================

import adminAxios from "./adminAxios";

// =====================================================
// 🌍 PUBLIC — Fetch active conditions
// =====================================================
export const fetchConditions = async () => {
  const res = await adminAxios.get("/conditions");
  return res.data;
};

// =====================================================
// 🔐 PROTECTED — Create new condition
// Cookie auth handled automatically by adminAxios
// =====================================================
export const createCondition = async (data) => {
  const res = await adminAxios.post("/conditions", data);
  return res.data;
};

// =====================================================
// 🔐 PROTECTED — Delete condition (soft delete)
// =====================================================
export const deleteCondition = async (id) => {
  const res = await adminAxios.delete(`/conditions/${id}`);
  return res.data;
};
