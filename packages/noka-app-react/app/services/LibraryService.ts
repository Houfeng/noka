export async function getLibraryEntityContent(path: string) {
  const res = await fetch(`/api/libraries/${path}`);
  return res.json();
}
