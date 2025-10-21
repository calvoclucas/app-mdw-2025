import React, { useState } from "react";

interface FakeCardFormProps {
  onChange?: (data: {
    numero: string;
    nombre: string;
    vencimiento: string;
    cvv: string;
  }) => void;
}

const FakeCardForm: React.FC<FakeCardFormProps> = ({ onChange }) => {
  const [numero, setNumero] = useState("");
  const [nombre, setNombre] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");

  const handleChange = () => {
    onChange?.({ numero, nombre, vencimiento, cvv });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
      <input
        type="text"
        placeholder="Número de tarjeta"
        value={numero}
        onChange={(e) => {
          setNumero(e.target.value);
          handleChange();
        }}
        className="w-full p-2 rounded border border-gray-300"
      />
      <input
        type="text"
        placeholder="Nombre en la tarjeta"
        value={nombre}
        onChange={(e) => {
          setNombre(e.target.value);
          handleChange();
        }}
        className="w-full p-2 rounded border border-gray-300"
      />
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="MM/AA"
          value={vencimiento}
          onChange={(e) => {
            setVencimiento(e.target.value);
            handleChange();
          }}
          className="flex-1 p-2 rounded border border-gray-300"
        />
        <input
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => {
            setCvv(e.target.value);
            handleChange();
          }}
          className="w-20 p-2 rounded border border-gray-300"
        />
      </div>
    </div>
  );
};

export default FakeCardForm;
