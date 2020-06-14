import axios from "axios";

export const getUf = async () => {
  return await axios
    .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};

export const getCities = async (ufSymbol: string) => {
  return await axios
    .get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSymbol}/municipios`
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
};
