import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";

import "./CreatePoint.css";
import logo from "./../../assets/logo.svg";
import { getCollectTypes, postPoint, PointContent } from "../../services/api";
import { getUf, getCities } from "../../services/apiIBGE";
import Dropzone from "./../../components/Dropzone/dropzone";

interface CollectItems {
  id: number;
  image_url: string;
  name: string;
}

interface PointInfo {
  image: string;
  name: string;
  email: string;
  whatsapp: number;
  latitude: number;
  longitude: number;
  address: number;
  number: number;
  city: string;
  uf: string;
}

interface Ufs {
  id: number;
  sigla: string;
  nome: string;
}

interface Cities {
  id: number;
  nome: string;
}

const CreatePoint = () => {
  const [collectItems, setCollectItems] = useState<CollectItems[]>([]);
  const [ufs, setUfs] = useState<Ufs[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>("0");
  const [cities, setCities] = useState<Cities[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("0");
  const [initialMapPosition, setInitialMapPosition] = useState<
    [number, number]
  >([0, 0]);
  const [selectedMapPosition, setSelectedMapPosition] = useState<
    [number, number]
  >([0, 0]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialMapPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    getCollectTypes().then((res) => {
      setCollectItems(res);
    });
  }, []);

  useEffect(() => {
    getUf().then((res) => {
      setUfs(res);
    });
  }, []);

  useEffect(() => {
    if (selectedUf !== "0") {
      getCities(selectedUf).then((res) => {
        setCities(res);
      });
    }
  }, [selectedUf]);

  const handleChangeUf = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUf(event.target.value);
  };

  const handleChangeCity = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const handleChangeMapLocate = (event: LeafletMouseEvent) => {
    setSelectedMapPosition([event.latlng.lat, event.latlng.lng]);
  };

  const handleInputEvent = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmitPoint = (event: FormEvent) => {
    event.preventDefault();

    const bodyFormData = new FormData();
    bodyFormData.append("name", formData.name);
    bodyFormData.append("email", formData.email);
    bodyFormData.append("whatsapp", formData.whatsapp);
    bodyFormData.append("uf", selectedUf);
    bodyFormData.append("city", selectedCity);
    bodyFormData.append("latitude", String(selectedMapPosition[0]));
    bodyFormData.append("longitude", String(selectedMapPosition[1]));
    bodyFormData.append("items", selectedItems.join(","));
    bodyFormData.append("address", "teste");
    bodyFormData.append("number", String(1));
    if (selectedFile) {
      bodyFormData.append("image", selectedFile);
    }

    // const data: PointContent = {
    //   name: formData.name,
    //   email: formData.email,
    //   whatsapp: Number(formData.whatsapp),
    //   uf: selectedUf,
    //   city: selectedCity,
    //   latitude: selectedMapPosition[0],
    //   longitude: selectedMapPosition[1],
    //   items: selectedItems,
    //   address: "teste",
    //   number: 1,
    //   image: selectedFile,
    // };

    postPoint(bodyFormData).then((res) => {
      history.push("/");
      console.log(res);
    });
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      var filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const renderCollectItems = () => {
    return (
      <ul className="items-grid">
        {collectItems.map((item) => {
          return (
            <li
              key={item.id}
              className={selectedItems.includes(item.id) ? "selected" : ""}
              onClick={() => handleSelectItem(item.id)}
            >
              <img src={item.image_url} alt={item.name} />
              <span>{item.name}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderUfs = () => {
    return (
      <select name="uf" id="uf" value={selectedUf} onChange={handleChangeUf}>
        <option value="0">Selecione uma UF</option>
        {ufs.map((uf) => (
          <option key={uf.id} value={uf.sigla}>
            {uf.sigla}
          </option>
        ))}
      </select>
    );
  };

  const renderCities = () => {
    return (
      <select
        name="uf"
        id="uf"
        value={selectedCity}
        onChange={handleChangeCity}
        disabled={selectedUf === "0"}
      >
        <option value="0">Selecione uma cidade</option>
        {cities.map((uf) => (
          <option key={uf.id} value={uf.nome}>
            {uf.nome}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="" />

        <Link to="/">
          <span>
            <FiArrowLeft />
          </span>
          <strong>Voltar para home</strong>
        </Link>
      </header>

      <main>
        <form onSubmit={handleSubmitPoint}>
          <h1>Cadastro do ponto de coleta</h1>

          <Dropzone onFileUploaded={setSelectedFile} />

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputEvent}
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputEvent}
                />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputEvent}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <Map
              center={initialMapPosition}
              zoom={15}
              onclick={handleChangeMapLocate}
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={selectedMapPosition} />
            </Map>

            <div className="field-group">
              <div className="field">
                <label htmlFor="address">Endereço</label>
                <input type="text" name="address" id="address" />
              </div>
              <div className="field">
                <label htmlFor="number">Número</label>
                <input type="text" name="number" id="number" />
              </div>
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                {renderUfs()}
              </div>
              <div className="field">
                <label htmlFor="city">Cidade</label>
                {renderCities()}
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Ítens de coleta</h2>
              <span>Selecione um ou mais ítens abaixo</span>
            </legend>

            {renderCollectItems()}
          </fieldset>

          <button type="submit">Cadastrar ponto de coleta</button>
        </form>
      </main>
    </div>
  );
};

export default CreatePoint;
