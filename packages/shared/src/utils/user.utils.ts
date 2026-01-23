export const getFallbackAvatar = (
  firstName?: string | null,
  lastName?: string | null,
): string => {
  const name = `${firstName ?? ''} ${lastName ?? ''}`.trim() || 'Aura User';
  const encodedName = encodeURIComponent(name);

  return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff`;
};
