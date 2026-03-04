import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const API = "http://localhost:5000";

  const [form, setForm] = useState({
    client_name: "",
    client_id: "",
    credit_value: "",
    interest_rate: "",
    months: "",
    commercial: "",
  });

  const [credits, setCredits] = useState([]);
  const [filter, setFilter] = useState("");
  const [showList, setShowList] = useState(true);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const fetchCredits = async () => {
    try {
      const res = await axios.get(`${API}/credits`);
      setCredits(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/credits`, form);
      alert("Crédito registrado ✅");
      setForm({
        client_name: "",
        client_id: "",
        credit_value: "",
        interest_rate: "",
        months: "",
        commercial: "",
      });
      fetchCredits();
    } catch (error) {
      console.error(error);
      alert("Error al registrar");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este crédito?")) return;

    try {
      await axios.delete(`${API}/credits/${id}`);
      fetchCredits();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar");
    }
  };

  const filteredCredits = credits.filter((c) =>
    c.client_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", background: "#f4f6f9", minHeight: "100vh" }}>
      <h1>Registro de Créditos</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <input name="client_name" placeholder="Nombre cliente" value={form.client_name} onChange={handleChange} required />
        <br /><br />
        <input name="client_id" placeholder="Cédula" value={form.client_id} onChange={handleChange} required />
        <br /><br />
        <input name="credit_value" placeholder="Valor crédito" value={form.credit_value} onChange={handleChange} required />
        <br /><br />
        <input name="interest_rate" placeholder="Tasa interés" value={form.interest_rate} onChange={handleChange} required />
        <br /><br />
        <input name="months" placeholder="Meses" value={form.months} onChange={handleChange} required />
        <br /><br />
        <input name="commercial" placeholder="Comercial" value={form.commercial} onChange={handleChange} required />
        <br /><br />
        <button type="submit">Registrar</button>
      </form>

      <button onClick={() => setShowList(!showList)} style={{ marginBottom: "20px" }}>
        {showList ? "Ocultar lista" : "Mostrar lista"}
      </button>

      {showList && (
        <>
          <h2>Lista de Créditos</h2>

          <input
            placeholder="Filtrar por nombre..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ marginBottom: "20px" }}
          />

          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Interés</th>
                <th>Meses</th>
                <th>Comercial</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredCredits.map((c) => (
                <tr key={c.id}>
                  <td>{c.client_name}</td>
                  <td>{c.credit_value}</td>
                  <td>{c.interest_rate}%</td>
                  <td>{c.months}</td>
                  <td>{c.commercial}</td>
                  <td>
                    <button onClick={() => handleDelete(c.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;