export const getAvatarConfig = (firstName: string, lastName: string) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Professional color palette (Future-proof: you can move this to a config)
  const colors = ['#4F46E5', '#7C3AED', '#2563EB', '#059669', '#D97706'];
  const charSum = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  const bgColor = colors[charSum % colors.length];

  return {
    initials,
    bgColor,
    url: null,
  };
};
