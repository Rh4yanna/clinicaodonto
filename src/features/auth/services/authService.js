export async function login({
  email,
  senha,
  perfil,
}) {
  console.log({
    email,
    senha,
    perfil,
  });

  return {
    success: true,
  };
}