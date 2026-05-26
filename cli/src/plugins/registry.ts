export const registry = async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/arpitbhatia23/exon-cli/main/templates/registery.json",
  );
  const data = await response.json();
  return data;
};
