// Format user full name
export const formatUserName = (u) => {
  if (u.vez_nev || u.ker_nev) {
    return `${u.vez_nev || ''} ${u.ker_nev || ''}`.trim();
  }
  return u.felhasznalonev || '-';
};

// Format creation date
export const formatCreatedAt = (u) => {
  if (u.created_at) {
    try {
      return new Date(u.created_at).toLocaleString();
    } catch (e) {
      return u.created_at;
    }
  }
  return '-';
};

// Filter users by query
export const filterUsers = (users, query) => {
  if (!query) return users;
  const q = query.toLowerCase();
  return users.filter(u => {
    const username = (u.felhasznalonev || '').toLowerCase();
    const fullName = formatUserName(u).toLowerCase();
    const email = (u.email || '').toLowerCase();
    return username.startsWith(q) || fullName.includes(q) || email.includes(q);
  });
};
