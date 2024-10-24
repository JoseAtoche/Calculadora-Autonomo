import React, { useState } from "react";
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './App.css';
import { Button } from 'primereact/button'; // Importar Button de PrimeReact


function App() {
    const [salarioBruto, setSalarioBruto] = useState(0);
    const [trabajaConsultoria, setTrabajaConsultoria] = useState(false);
    const [salarioNetoEmpleado, setSalarioNetoEmpleado] = useState(0);
    const [salarioNetoFreelance, setSalarioNetoFreelance] = useState(0);
    const [salarioHoraEmpleado, setSalarioHoraEmpleado] = useState(0);
    const [salarioHoraFreelance, setSalarioHoraFreelance] = useState(0);

    const [irpfFreelance, setIrpfFreelance] = useState(0);
    const [cuotaAutonomo, setCuotaAutonomo] = useState(0);

    const handleSalarioBrutoChange = (e) => {
        setSalarioBruto(e.value || 0);
    };

    const handleConsultoriaChange = (e) => {
        setTrabajaConsultoria(e.checked);
    };

    const calcularIRPF = (salario) => {
        if (salario <= 12450) return salario * 0.19;
        if (salario <= 20200) return 12450 * 0.19 + (salario - 12450) * 0.24;
        if (salario <= 35200) return 12450 * 0.19 + (20200 - 12450) * 0.24 + (salario - 20200) * 0.30;
        if (salario <= 60000) return 12450 * 0.19 + (20200 - 12450) * 0.24 + (35200 - 20200) * 0.30 + (salario - 35200) * 0.37;
        return 12450 * 0.19 + (20200 - 12450) * 0.24 + (35200 - 20200) * 0.30 + (60000 - 35200) * 0.45;
    };

    const calcularSeguridadSocialEmpleado = (salario) => salario * 0.0635;
    const calcularSeguridadSocialEmpresa = (salario) => salario * 0.30;

    const calcularCuotaAutonomo = (salario) => {
        if (salario <= 670) return 200;
        if (salario <= 900) return 220;
        if (salario <= 1166.7) return 260;
        if (salario <= 1300) return 291;
        if (salario <= 1500) return 294;
        if (salario <= 1700) return 294;
        if (salario <= 1850) return 350;
        if (salario <= 2030) return 370;
        if (salario <= 2330) return 390;
        if (salario <= 2760) return 415;
        if (salario <= 3190) return 440;
        if (salario <= 3620) return 465;
        if (salario <= 4050) return 490;
        if (salario <= 6000) return 530;
        return 590;
    };

    const calcularSalarios = () => {
      const irpfEmpleado = calcularIRPF(salarioBruto);
      const ssEmpleado = calcularSeguridadSocialEmpleado(salarioBruto);
      const ssEmpresa = calcularSeguridadSocialEmpresa(salarioBruto);
      const margenConsultoria = trabajaConsultoria ? salarioBruto * 0.1 : 0;

      let salarioNetoEmp = salarioBruto - irpfEmpleado - ssEmpleado;      

      setSalarioNetoEmpleado(salarioNetoEmp);
      setSalarioHoraEmpleado(Number((salarioNetoEmp / 2080).toFixed(2)));

      const salarioFreelanceBruto = salarioBruto + ssEmpresa + margenConsultoria;
      const irpfFree = calcularIRPF(salarioFreelanceBruto);
      const cuotaAuto = calcularCuotaAutonomo(salarioFreelanceBruto);
      const cuotaAnual = cuotaAuto * 12; // Cuota anual
      const salarioNetoFree = salarioFreelanceBruto - irpfFree - cuotaAnual; // Usar cuota anual

      setIrpfFreelance(irpfFree);
      setCuotaAutonomo(cuotaAnual);
      setSalarioNetoFreelance(salarioNetoFree);
      setSalarioHoraFreelance((salarioNetoFree / 2080).toFixed(2));
  };

    const tablaEmpleado = [
        { impuesto: 'IRPF', cantidad: calcularIRPF(salarioBruto).toFixed(2) },
        { impuesto: 'Seguridad Social (Empleado)', cantidad: calcularSeguridadSocialEmpleado(salarioBruto).toFixed(2) },
        { impuesto: 'Seguridad Social (Empresa)', cantidad: calcularSeguridadSocialEmpresa(salarioBruto).toFixed(2) },
        trabajaConsultoria && { impuesto: 'Margen Consultoría (10%)', cantidad: (salarioBruto * 0.1).toFixed(2) },
    ].filter(Boolean);

    const tablaFreelance = [
        { impuesto: 'IRPF', cantidad: irpfFreelance.toFixed(2) },
        { impuesto: 'Cuota Autónomo', cantidad: cuotaAutonomo.toFixed(2) },
    ];

    return (
        <div className="App">
          <h3>Advertencia: Estos son valores meramente informativos, pueden diferir de la realidad ya sea por nuevas legislaciones o por la region donde vivas</h3>
            <div className="left-div">
                <Card title="Tu salario Bruto" className="p-card">
                    <div className="field">
                        <label htmlFor="salarioBruto">Introduce tu salario bruto:</label>
                        <InputNumber
                            id="salarioBruto"
                            value={salarioBruto}
                            onValueChange={handleSalarioBrutoChange}
                            mode="currency"
                            currency="EUR"
                            locale="es-ES"
                        />
                    </div>
                    <div className="field-checkbox">
                        <Checkbox inputId="consultoria" checked={trabajaConsultoria} onChange={handleConsultoriaChange} />
                        <label htmlFor="consultoria">¿Trabajas para consultoría?</label>
                    </div>
                    <Button label="Calcular" onClick={calcularSalarios} className="p-button-primary" />


                    <h3>Salario Neto: {salarioNetoEmpleado.toFixed(2)} €</h3>
                    <h3>Salario Neto Mes: {(salarioNetoEmpleado / 12).toFixed(2)} €</h3>
                    <h3>Salario por hora: {salarioHoraEmpleado} €/hora</h3>

                    <DataTable value={tablaEmpleado}>
                        <Column field="impuesto" header="Impuesto/Concepto" />
                        <Column field="cantidad" header="Cantidad" />
                    </DataTable>
                </Card>
            </div>

            <div className="right-div">
                <Card title="Tu salario si fueras Freelance" className="p-card">
                    <h3>Salario Neto: {salarioNetoFreelance.toFixed(2)} €</h3>
                    <h3>Salario Neto Mes: {(salarioNetoFreelance / 12).toFixed(2)} €</h3>
                    <h3>Salario por hora: {salarioHoraFreelance} €/hora</h3>

                    <DataTable value={tablaFreelance}>
                        <Column field="impuesto" header="Impuesto/Concepto" />
                        <Column field="cantidad" header="Cantidad" />
                    </DataTable>
                </Card>
            </div>
        </div>
    );
}

export default App;
