import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { jsPDF } from 'jspdf';
import './F24OrdinaryForm.css';

// Base interface for common properties
interface BaseRow {
  id: string;
  importoDebito: string;
  importoCredito: string;
  annoRiferimento?: string;
  rateazione?: string;
}

// Type for the Erario section
interface ErarioRow extends BaseRow {
  codiceTributo: string;
}

// Type for the INPS section
interface InpsRow extends BaseRow {
  codiceSede: string;
  causaleContributo: string;
  matricolaInps: string;
  riferimentoMese1: string;
  riferimentoMese2: string;
  codiceTributo?: string; // Optional for compatibility
}

// Type for the Regioni section
interface RegioniRow extends BaseRow {
  codiceRegione: string;
  codiceTributo: string;
}

// Type for the IMU section
interface ImuRow extends BaseRow {
  codiceEnte: string;
  tipologiaImmobile: string;
  codiceTributo?: string; // Optional for compatibility
}

// Type for the INAIL section
interface InailRow extends BaseRow {
  codiceSede: string;
  codiceTributo: string;
  codicePosizione: string;
}

const F24OrdinaryForm = () => {
  // Stato per i dati anagrafici
  const [anagraficaData, setAnagraficaData] = useState({
    codiceFiscale: '',
    cognome: '',
    nome: '',
    dataNascita: '',
    comuneNascita: '',
    provinciaNascita: '',
    comune: '',
    provincia: '',
    viaNumero: '',
    codiceFiscaleCoobbligato: '',
    codiceIdentificativo: '',
  });

  // Stato per le varie sezioni
  const [erarioRows, setErarioRows] = useState<ErarioRow[]>([
    { id: '1', codiceTributo: '', importoDebito: '', importoCredito: '' }
  ]);
  
  const [inpsRows, setInpsRows] = useState<InpsRow[]>([
    { 
      id: '1', 
      codiceSede: '', 
      causaleContributo: '', 
      matricolaInps: '', 
      riferimentoMese1: '', 
      riferimentoMese2: '', 
      importoDebito: '', 
      importoCredito: '' 
    }
  ]);
  
  const [regioniRows, setRegioniRows] = useState<RegioniRow[]>([
    { id: '1', codiceRegione: '', codiceTributo: '', importoDebito: '', importoCredito: '' }
  ]);
  
  const [imuRows, setImuRows] = useState<ImuRow[]>([
    { id: '1', codiceEnte: '', tipologiaImmobile: '', importoDebito: '', importoCredito: '' }
  ]);
  
  const [inailRows, setInailRows] = useState<InailRow[]>([
    { id: '1', codiceSede: '', codiceTributo: '', codicePosizione: '', importoDebito: '', importoCredito: '' }
  ]);

  // Stato per i totali
  const [totals, setTotals] = useState({
    totaleA: '0,00',
    totaleB: '0,00',
    saldoAB: '0,00',
    totaleC: '0,00',
    totaleD: '0,00',
    saldoCD: '0,00',
    totaleE: '0,00',
    totaleF: '0,00',
    saldoEF: '0,00',
    totaleG: '0,00',
    totaleH: '0,00',
    saldoGH: '0,00',
    totaleI: '0,00',
    totaleL: '0,00',
    saldoIL: '0,00',
    totaleM: '0,00',
    totaleN: '0,00',
    saldoMN: '0,00',
    saldoFinale: '0,00'
  });

  // Stato per i dati di pagamento
  const [paymentData, setPaymentData] = useState({
    dataPagamento: '',
    banca: '',
    abi: '',
    cab: '',
    iban: '',
    tipoPagamento: 'bancario', // bancario o postale
  });

  // Funzione per aggiungere righe alle varie sezioni
  const addRow = (section: string) => {
    switch (section) {
      case 'erario':
        setErarioRows([...erarioRows, { 
          id: (erarioRows.length + 1).toString(), 
          codiceTributo: '', 
          importoDebito: '', 
          importoCredito: '' 
        }]);
        break;
      case 'inps':
        setInpsRows([...inpsRows, { 
          id: (inpsRows.length + 1).toString(), 
          codiceSede: '', 
          causaleContributo: '', 
          matricolaInps: '', 
          riferimentoMese1: '',
          riferimentoMese2: '',
          importoDebito: '', 
          importoCredito: '' 
        }]);
        break;
      case 'regioni':
        setRegioniRows([...regioniRows, { 
          id: (regioniRows.length + 1).toString(), 
          codiceRegione: '', 
          codiceTributo: '', 
          importoDebito: '', 
          importoCredito: '' 
        }]);
        break;
      case 'imu':
        setImuRows([...imuRows, { 
          id: (imuRows.length + 1).toString(), 
          codiceEnte: '', 
          tipologiaImmobile: '', 
          importoDebito: '', 
          importoCredito: '' 
        }]);
        break;
      case 'inail':
        setInailRows([...inailRows, { 
          id: (inailRows.length + 1).toString(), 
          codiceSede: '', 
          codiceTributo: '', 
          codicePosizione: '', 
          importoDebito: '', 
          importoCredito: '' 
        }]);
        break;
    }
  };

  // Funzione per rimuovere righe dalle varie sezioni
  const removeRow = (section: string, id: string) => {
    switch (section) {
      case 'erario':
        if (erarioRows.length > 1) {
          setErarioRows(erarioRows.filter(row => row.id !== id));
        }
        break;
      case 'inps':
        if (inpsRows.length > 1) {
          setInpsRows(inpsRows.filter(row => row.id !== id));
        }
        break;
      case 'regioni':
        if (regioniRows.length > 1) {
          setRegioniRows(regioniRows.filter(row => row.id !== id));
        }
        break;
      case 'imu':
        if (imuRows.length > 1) {
          setImuRows(imuRows.filter(row => row.id !== id));
        }
        break;
      case 'inail':
        if (inailRows.length > 1) {
          setInailRows(inailRows.filter(row => row.id !== id));
        }
        break;
    }
  };

  // Gestione dei cambiamenti nei campi anagrafici
  const handleAnagraficaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnagraficaData(prev => ({ ...prev, [name]: value }));
  };

  // Gestione dei cambiamenti nelle righe delle sezioni
  const handleRowChange = (section: string, id: string, field: string, value: string) => {
    switch (section) {
      case 'erario':
        setErarioRows(erarioRows.map(row => 
          row.id === id ? { ...row, [field]: value } : row
        ));
        break;
      case 'inps':
        setInpsRows(inpsRows.map(row => 
          row.id === id ? { ...row, [field]: value } : row
        ));
        break;
      case 'regioni':
        setRegioniRows(regioniRows.map(row => 
          row.id === id ? { ...row, [field]: value } : row
        ));
        break;
      case 'imu':
        setImuRows(imuRows.map(row => 
          row.id === id ? { ...row, [field]: value } : row
        ));
        break;
      case 'inail':
        setInailRows(inailRows.map(row => 
          row.id === id ? { ...row, [field]: value } : row
        ));
        break;
    }
  };

  // Gestione dei cambiamenti nei dati di pagamento
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  // Calcolo dei totali
  useEffect(() => {
    // Funzione helper per sommare gli importi
    // Funzione helper generica per sommare gli importi
  const sumImporti = <T extends BaseRow>(rows: T[], field: 'importoDebito' | 'importoCredito'): number => {
      return rows.reduce((acc, row) => {
        const importo = row[field].replace(',', '.');
        return acc + (parseFloat(importo) || 0);
      }, 0);
    };
    
    // Calcolo dei totali per ogni sezione
    const totaleAValue = sumImporti(erarioRows, 'importoDebito');
    const totaleBValue = sumImporti(erarioRows, 'importoCredito');
    const saldoABValue = totaleAValue - totaleBValue;
    
    const totaleCValue = sumImporti(inpsRows, 'importoDebito');
    const totaleDValue = sumImporti(inpsRows, 'importoCredito');
    const saldoCDValue = totaleCValue - totaleDValue;
    
    const totaleEValue = sumImporti(regioniRows, 'importoDebito');
    const totaleFValue = sumImporti(regioniRows, 'importoCredito');
    const saldoEFValue = totaleEValue - totaleFValue;
    
    const totaleGValue = sumImporti(imuRows, 'importoDebito');
    const totaleHValue = sumImporti(imuRows, 'importoCredito');
    const saldoGHValue = totaleGValue - totaleHValue;
    
    const totaleIValue = sumImporti(inailRows, 'importoDebito');
    const totaleLValue = sumImporti(inailRows, 'importoCredito');
    const saldoILValue = totaleIValue - totaleLValue;
    
    // Calcolo totali M e N (sezione altri enti - non implementata, rimarrebbero a 0)
    const totaleMValue = 0;
    const totaleNValue = 0;
    const saldoMNValue = totaleMValue - totaleNValue;
    
    // Calcolo saldo finale
    const saldoFinaleValue = saldoABValue + saldoCDValue + saldoEFValue + saldoGHValue + saldoILValue + saldoMNValue;
    
    // Formattazione dei valori numerici in formato italiano (virgola come separatore decimale)
    const formatNumber = (num: number): string => {
      return num.toFixed(2).replace('.', ',');
    };
    
    setTotals({
      totaleA: formatNumber(totaleAValue),
      totaleB: formatNumber(totaleBValue),
      saldoAB: formatNumber(saldoABValue),
      totaleC: formatNumber(totaleCValue),
      totaleD: formatNumber(totaleDValue),
      saldoCD: formatNumber(saldoCDValue),
      totaleE: formatNumber(totaleEValue),
      totaleF: formatNumber(totaleFValue),
      saldoEF: formatNumber(saldoEFValue),
      totaleG: formatNumber(totaleGValue),
      totaleH: formatNumber(totaleHValue),
      saldoGH: formatNumber(saldoGHValue),
      totaleI: formatNumber(totaleIValue),
      totaleL: formatNumber(totaleLValue),
      saldoIL: formatNumber(saldoILValue),
      totaleM: formatNumber(totaleMValue),
      totaleN: formatNumber(totaleNValue),
      saldoMN: formatNumber(saldoMNValue),
      saldoFinale: formatNumber(saldoFinaleValue)
    });
  }, [erarioRows, inpsRows, regioniRows, imuRows, inailRows]);

  // Gestione del tipo di pagamento (bancario/postale)
  const handleTipoPagamento = (tipo: 'bancario' | 'postale') => {
    setPaymentData(prev => ({ ...prev, tipoPagamento: tipo }));
  };

  // Funzione per ripulire i form
  const resetForm = () => {
    // Reset dati anagrafici
    setAnagraficaData({
      codiceFiscale: '',
      cognome: '',
      nome: '',
      dataNascita: '',
      comuneNascita: '',
      provinciaNascita: '',
      comune: '',
      provincia: '',
      viaNumero: '',
      codiceFiscaleCoobbligato: '',
      codiceIdentificativo: '',
    });
    
    // Reset sezioni
    setErarioRows([{ id: '1', codiceTributo: '', importoDebito: '', importoCredito: '' }]);
    setInpsRows([{ 
      id: '1', 
      codiceSede: '', 
      causaleContributo: '', 
      matricolaInps: '', 
      riferimentoMese1: '',
      riferimentoMese2: '',
      importoDebito: '', 
      importoCredito: '' 
    }]);
    setRegioniRows([{ id: '1', codiceRegione: '', codiceTributo: '', importoDebito: '', importoCredito: '' }]);
    setImuRows([{ id: '1', codiceEnte: '', tipologiaImmobile: '', importoDebito: '', importoCredito: '' }]);
    setInailRows([{ id: '1', codiceSede: '', codiceTributo: '', codicePosizione: '', importoDebito: '', importoCredito: '' }]);
    
    // Reset dati di pagamento
    setPaymentData({
      dataPagamento: '',
      banca: '',
      abi: '',
      cab: '',
      iban: '',
      tipoPagamento: 'bancario',
    });
    
    toast({
      title: "Modulo ripulito",
      description: "Tutti i campi del modulo F24 sono stati ripuliti."
    });
  };

  // Funzione per generare un PDF del modulo compilato
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Titolo
    doc.setFontSize(18);
    doc.text("Modello F24 Ordinario", 105, 15, { align: 'center' });
    
    // Dati anagrafici
    doc.setFontSize(12);
    doc.text("Dati anagrafici", 20, 25);
    doc.text(`Codice Fiscale: ${anagraficaData.codiceFiscale}`, 20, 35);
    doc.text(`Contribuente: ${anagraficaData.cognome} ${anagraficaData.nome}`, 20, 42);
    doc.text(`Nato il: ${anagraficaData.dataNascita} a ${anagraficaData.comuneNascita} (${anagraficaData.provinciaNascita})`, 20, 49);
    doc.text(`Domicilio: ${anagraficaData.comune} (${anagraficaData.provincia}), ${anagraficaData.viaNumero}`, 20, 56);
    
    // Aggiungi un po' di spazio
    let y = 65;
    
    // Sezione Erario
    if (erarioRows.some(row => row.codiceTributo || row.importoDebito || row.importoCredito)) {
      doc.text("Sezione Erario", 20, y);
      y += 7;
      erarioRows.forEach(row => {
        if (row.codiceTributo || row.importoDebito || row.importoCredito) {
          doc.text(`Cod. Tributo: ${row.codiceTributo}, Importo a debito: ${row.importoDebito}, Importo a credito: ${row.importoCredito}`, 20, y);
          y += 7;
        }
      });
      doc.text(`Totale A: ${totals.totaleA}, Totale B: ${totals.totaleB}, Saldo (A-B): ${totals.saldoAB}`, 20, y);
      y += 10;
    }
    
    // Sezione INPS
    if (inpsRows.some(row => row.codiceSede || row.causaleContributo || row.matricolaInps || row.importoDebito || row.importoCredito)) {
      doc.text("Sezione INPS", 20, y);
      y += 7;
      inpsRows.forEach(row => {
        if (row.codiceSede || row.causaleContributo || row.matricolaInps || row.importoDebito || row.importoCredito) {
          doc.text(`Cod. Sede: ${row.codiceSede}, Causale: ${row.causaleContributo}, Matricola: ${row.matricolaInps}`, 20, y);
          y += 7;
          doc.text(`Importo a debito: ${row.importoDebito}, Importo a credito: ${row.importoCredito}`, 20, y);
          y += 7;
        }
      });
      doc.text(`Totale C: ${totals.totaleC}, Totale D: ${totals.totaleD}, Saldo (C-D): ${totals.saldoCD}`, 20, y);
      y += 10;
    }
    
    // Se stiamo superando il limite della pagina, andiamo alla pagina successiva
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    
    // Sezione Regioni
    if (regioniRows.some(row => row.codiceRegione || row.codiceTributo || row.importoDebito || row.importoCredito)) {
      doc.text("Sezione Regioni", 20, y);
      y += 7;
      regioniRows.forEach(row => {
        if (row.codiceRegione || row.codiceTributo || row.importoDebito || row.importoCredito) {
          doc.text(`Cod. Regione: ${row.codiceRegione}, Cod. Tributo: ${row.codiceTributo}`, 20, y);
          y += 7;
          doc.text(`Importo a debito: ${row.importoDebito}, Importo a credito: ${row.importoCredito}`, 20, y);
          y += 7;
        }
      });
      doc.text(`Totale E: ${totals.totaleE}, Totale F: ${totals.totaleF}, Saldo (E-F): ${totals.saldoEF}`, 20, y);
      y += 10;
    }
    
    // Sezione IMU e Altri Tributi Locali
    if (imuRows.some(row => row.codiceEnte || row.tipologiaImmobile || row.importoDebito || row.importoCredito)) {
      doc.text("Sezione IMU e Altri Tributi Locali", 20, y);
      y += 7;
      imuRows.forEach(row => {
        if (row.codiceEnte || row.tipologiaImmobile || row.importoDebito || row.importoCredito) {
          doc.text(`Cod. Ente: ${row.codiceEnte}, Tipologia: ${row.tipologiaImmobile}`, 20, y);
          y += 7;
          doc.text(`Importo a debito: ${row.importoDebito}, Importo a credito: ${row.importoCredito}`, 20, y);
          y += 7;
        }
      });
      doc.text(`Totale G: ${totals.totaleG}, Totale H: ${totals.totaleH}, Saldo (G-H): ${totals.saldoGH}`, 20, y);
      y += 10;
    }
    
    // Se stiamo superando il limite della pagina, andiamo alla pagina successiva
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    
    // Sezione INAIL
    if (inailRows.some(row => row.codiceSede || row.codiceTributo || row.codicePosizione || row.importoDebito || row.importoCredito)) {
      doc.text("Sezione INAIL", 20, y);
      y += 7;
      inailRows.forEach(row => {
        if (row.codiceSede || row.codiceTributo || row.codicePosizione || row.importoDebito || row.importoCredito) {
          doc.text(`Cod. Sede: ${row.codiceSede}, Cod. Contributo: ${row.codiceTributo}, Pos.: ${row.codicePosizione}`, 20, y);
          y += 7;
          doc.text(`Importo a debito: ${row.importoDebito}, Importo a credito: ${row.importoCredito}`, 20, y);
          y += 7;
        }
      });
      doc.text(`Totale I: ${totals.totaleI}, Totale L: ${totals.totaleL}, Saldo (I-L): ${totals.saldoIL}`, 20, y);
      y += 10;
    }
    
    // Saldo finale
    doc.text(`SALDO FINALE: € ${totals.saldoFinale}`, 105, y, { align: 'center' });
    y += 10;
    
    // Informazioni sul pagamento
    doc.text("Estremi del versamento", 20, y);
    y += 7;
    doc.text(`Data: ${paymentData.dataPagamento}`, 20, y);
    y += 7;
    doc.text(`Tipo: ${paymentData.tipoPagamento === 'bancario' ? 'Pagamento bancario' : 'Pagamento postale'}`, 20, y);
    y += 7;
    if (paymentData.banca) {
      doc.text(`Banca: ${paymentData.banca}`, 20, y);
      y += 7;
    }
    if (paymentData.iban) {
      doc.text(`IBAN: ${paymentData.iban}`, 20, y);
    }
    
    // Salva il PDF
    doc.save("modello_f24_ordinario.pdf");
    
    toast({
      title: "PDF generato",
      description: "Il PDF del modello F24 è stato generato e scaricato.",
    });
  };

  return (
    <div className="f24-form-container">
      <div className="f24-header">
        <div className="f24-logo">
          <span className="logo-text">Agenzia Entrate</span>
        </div>
        <div className="f24-title">
          <h1>MODELLO DI PAGAMENTO UNIFICATO</h1>
        </div>
        <div className="f24-modello">
          <div className="modello-tag">Mod.</div>
          <div className="modello-number">F24</div>
        </div>
      </div>

      <div className="f24-section f24-delega">
        <div className="section-row">
          <div className="section-field">
            <span className="field-label">DELEGA IRREVOCABILE A:</span>
            <input type="text" className="text-input long-input" />
          </div>
        </div>
        <div className="section-row">
          <div className="section-field">
            <span className="field-label">AGENZIA</span>
            <span className="field-sublabel">PER L'ACCREDITO ALLA TESORERIA COMPETENTE</span>
            <input type="text" className="text-input medium-input" />
          </div>
          <div className="section-field">
            <span className="field-label">PROV.</span>
            <input type="text" className="text-input small-input" maxLength={2} />
          </div>
        </div>
      </div>

      <div className="f24-section f24-contribuente">
        <div className="section-header">
          <h2>CONTRIBUENTE</h2>
        </div>
        
        <div className="section-row">
          <div className="section-field">
            <span className="field-label">CODICE FISCALE</span>
            <input 
              type="text" 
              className="text-input cf-input" 
              name="codiceFiscale"
              value={anagraficaData.codiceFiscale}
              onChange={handleAnagraficaChange}
              maxLength={16}
            />
          </div>
          <div className="section-info">
            <span>barrare in caso di anno d'imposta<br />non coincidente con anno solare</span>
            <div className="checkbox-container">
              <input type="checkbox" id="anno-non-coincidente" />
              <label htmlFor="anno-non-coincidente"></label>
            </div>
          </div>
        </div>
        
        <div className="section-row">
          <div className="section-field">
            <span className="field-label">DATI ANAGRAFICI</span>
            <div className="anagrafica-container">
              <div className="anagrafica-row">
                <span className="field-sublabel">cognome, denominazione o ragione sociale</span>
                <input 
                  type="text" 
                  className="text-input long-input" 
                  name="cognome"
                  value={anagraficaData.cognome}
                  onChange={handleAnagraficaChange}
                />
                <span className="field-sublabel">nome</span>
                <input 
                  type="text" 
                  className="text-input medium-input" 
                  name="nome"
                  value={anagraficaData.nome}
                  onChange={handleAnagraficaChange}
                />
              </div>
              <div className="anagrafica-row">
                <span className="field-sublabel">data di nascita</span>
                <input 
                  type="text" 
                  className="text-input date-input" 
                  placeholder="GG MM AAAA"
                  name="dataNascita"
                  value={anagraficaData.dataNascita}
                  onChange={handleAnagraficaChange}
                />
                <span className="field-sublabel">sesso (M o F)</span>
                <input type="text" className="text-input small-input" maxLength={1} />
                <span className="field-sublabel">comune (o Stato estero) di nascita</span>
                <input 
                  type="text" 
                  className="text-input medium-input" 
                  name="comuneNascita"
                  value={anagraficaData.comuneNascita}
                  onChange={handleAnagraficaChange}
                />
                <span className="field-sublabel">prov.</span>
                <input 
                  type="text" 
                  className="text-input smallest-input" 
                  maxLength={2}
                  name="provinciaNascita"
                  value={anagraficaData.provinciaNascita}
                  onChange={handleAnagraficaChange}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="section-row">
          <div className="section-field">
            <span className="field-label">DOMICILIO FISCALE</span>
            <div className="domicilio-container">
              <span className="field-sublabel">comune</span>
              <input 
                type="text" 
                className="text-input medium-input" 
                name="comune"
                value={anagraficaData.comune}
                onChange={handleAnagraficaChange}
              />
              <span className="field-sublabel">prov.</span>
              <input 
                type="text" 
                className="text-input smallest-input" 
                maxLength={2}
                name="provincia"
                value={anagraficaData.provincia}
                onChange={handleAnagraficaChange}
              />
              <span className="field-sublabel">via e numero civico</span>
              <input 
                type="text" 
                className="text-input long-input" 
                name="viaNumero"
                value={anagraficaData.viaNumero}
                onChange={handleAnagraficaChange}
              />
            </div>
          </div>
        </div>
        
        <div className="section-row">
          <div className="section-field">
            <span className="field-label">CODICE FISCALE del coobbligato, erede, genitore, tutore o curatore fallimentare</span>
            <input 
              type="text" 
              className="text-input cf-input" 
              maxLength={16}
              name="codiceFiscaleCoobbligato"
              value={anagraficaData.codiceFiscaleCoobbligato}
              onChange={handleAnagraficaChange}
            />
            <span className="field-sublabel">codice identificativo</span>
            <input 
              type="text" 
              className="text-input small-input" 
              name="codiceIdentificativo"
              value={anagraficaData.codiceIdentificativo}
              onChange={handleAnagraficaChange}
            />
          </div>
        </div>
      </div>

      <div className="f24-section f24-erario">
        <div className="section-header">
          <h2>SEZIONE ERARIO</h2>
        </div>
        
        <div className="section-table">
          <div className="table-header">
            <div className="table-cell">codice tributo</div>
            <div className="table-cell">riferimento/<br />anno di riferimento</div>
            <div className="table-cell">importi a debito versati</div>
            <div className="table-cell">importi a credito compensati</div>
          </div>
          
          {erarioRows.map((row, index) => (
            <div className="table-row" key={`erario-${row.id}`}>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  value={row.codiceTributo}
                  onChange={(e) => handleRowChange('erario', row.id, 'codiceTributo', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  placeholder="ANNO"
                  value={row.annoRiferimento || ''}
                  onChange={(e) => handleRowChange('erario', row.id, 'annoRiferimento', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input money-input" 
                  value={row.importoDebito}
                  onChange={(e) => handleRowChange('erario', row.id, 'importoDebito', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input money-input" 
                  value={row.importoCredito}
                  onChange={(e) => handleRowChange('erario', row.id, 'importoCredito', e.target.value)}
                />
              </div>
              {index === erarioRows.length - 1 && (
                <button 
                  type="button" 
                  className="add-row-btn"
                  onClick={() => addRow('erario')}
                >+</button>
              )}
              {erarioRows.length > 1 && (
                <button 
                  type="button" 
                  className="remove-row-btn"
                  onClick={() => removeRow('erario', row.id)}
                >-</button>
              )}
            </div>
          ))}
          
          <div className="table-footer">
            <div className="table-cell"></div>
            <div className="table-cell">TOTALE</div>
            <div className="table-cell totals-cell">A {totals.totaleA}</div>
            <div className="table-cell totals-cell">B {totals.totaleB}</div>
            <div className="table-cell saldo-cell">SALDO (A-B) {totals.saldoAB}</div>
          </div>
        </div>
      </div>

      <div className="f24-section f24-inps">
        <div className="section-header">
          <h2>SEZIONE INPS</h2>
        </div>
        
        <div className="section-table">
          <div className="table-header">
            <div className="table-cell">codice sede</div>
            <div className="table-cell">causale contributo</div>
            <div className="table-cell">matricola INPS/<br />codice INPS/filiale azienda</div>
            <div className="table-cell">periodo di riferimento<br />da mm/aaaa a mm/aaaa</div>
            <div className="table-cell">importi a debito versati</div>
            <div className="table-cell">importi a credito compensati</div>
          </div>
          
          {inpsRows.map((row, index) => (
            <div className="table-row" key={`inps-${row.id}`}>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  value={row.codiceSede || ''}
                  onChange={(e) => handleRowChange('inps', row.id, 'codiceSede', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  value={row.causaleContributo || ''}
                  onChange={(e) => handleRowChange('inps', row.id, 'causaleContributo', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  value={row.matricolaInps || ''}
                  onChange={(e) => handleRowChange('inps', row.id, 'matricolaInps', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <div className="period-inputs">
                  <input 
                    type="text" 
                    className="text-input period-input" 
                    placeholder="MM/AAAA"
                    value={row.riferimentoMese1 || ''}
                    onChange={(e) => handleRowChange('inps', row.id, 'riferimentoMese1', e.target.value)}
                  />
                  <input 
                    type="text" 
                    className="text-input period-input" 
                    placeholder="MM/AAAA"
                    value={row.riferimentoMese2 || ''}
                    onChange={(e) => handleRowChange('inps', row.id, 'riferimentoMese2', e.target.value)}
                  />
                </div>
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input money-input" 
                  value={row.importoDebito}
                  onChange={(e) => handleRowChange('inps', row.id, 'importoDebito', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input money-input" 
                  value={row.importoCredito}
                  onChange={(e) => handleRowChange('inps', row.id, 'importoCredito', e.target.value)}
                />
              </div>
              {index === inpsRows.length - 1 && (
                <button 
                  type="button" 
                  className="add-row-btn"
                  onClick={() => addRow('inps')}
                >+</button>
              )}
              {inpsRows.length > 1 && (
                <button 
                  type="button" 
                  className="remove-row-btn"
                  onClick={() => removeRow('inps', row.id)}
                >-</button>
              )}
            </div>
          ))}
          
          <div className="table-footer">
            <div className="table-cell"></div>
            <div className="table-cell"></div>
            <div className="table-cell"></div>
            <div className="table-cell">TOTALE</div>
            <div className="table-cell totals-cell">C {totals.totaleC}</div>
            <div className="table-cell totals-cell">D {totals.totaleD}</div>
            <div className="table-cell saldo-cell">SALDO (C-D) {totals.saldoCD}</div>
          </div>
        </div>
      </div>

      <div className="f24-section f24-regioni">
        <div className="section-header">
          <h2>SEZIONE REGIONI</h2>
        </div>
        
        <div className="section-table">
          <div className="table-header">
            <div className="table-cell">codice regione</div>
            <div className="table-cell">codice tributo</div>
            <div className="table-cell">rateazione/<br />mese rif.</div>
            <div className="table-cell">anno di<br />riferimento</div>
            <div className="table-cell">importi a debito versati</div>
            <div className="table-cell">importi a credito compensati</div>
          </div>
          
          {regioniRows.map((row, index) => (
            <div className="table-row" key={`regioni-${row.id}`}>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  value={row.codiceRegione || ''}
                  onChange={(e) => handleRowChange('regioni', row.id, 'codiceRegione', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  value={row.codiceTributo}
                  onChange={(e) => handleRowChange('regioni', row.id, 'codiceTributo', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  value={row.rateazione || ''}
                  onChange={(e) => handleRowChange('regioni', row.id, 'rateazione', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  placeholder="AAAA"
                  value={row.annoRiferimento || ''}
                  onChange={(e) => handleRowChange('regioni', row.id, 'annoRiferimento', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input money-input" 
                  value={row.importoDebito}
                  onChange={(e) => handleRowChange('regioni', row.id, 'importoDebito', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input money-input" 
                  value={row.importoCredito}
                  onChange={(e) => handleRowChange('regioni', row.id, 'importoCredito', e.target.value)}
                />
              </div>
              {index === regioniRows.length - 1 && (
                <button 
                  type="button" 
                  className="add-row-btn"
                  onClick={() => addRow('regioni')}
                >+</button>
              )}
              {regioniRows.length > 1 && (
                <button 
                  type="button" 
                  className="remove-row-btn"
                  onClick={() => removeRow('regioni', row.id)}
                >-</button>
              )}
            </div>
          ))}
          
          <div className="table-footer">
            <div className="table-cell"></div>
            <div className="table-cell"></div>
            <div className="table-cell"></div>
            <div className="table-cell">TOTALE</div>
            <div className="table-cell totals-cell">E {totals.totaleE}</div>
            <div className="table-cell totals-cell">F {totals.totaleF}</div>
            <div className="table-cell saldo-cell">SALDO (E-F) {totals.saldoEF}</div>
          </div>
        </div>
      </div>

      <div className="f24-section f24-imu">
        <div className="section-header">
          <h2>SEZIONE IMU E ALTRI TRIBUTI LOCALI</h2>
        </div>
        
        <div className="section-table">
          <div className="table-header">
            <div className="table-cell">codice ente/<br />codice comune</div>
            <div className="table-cell">Immob.<br />variati</div>
            <div className="table-cell">Acc.</div>
            <div className="table-cell">Saldo</div>
            <div className="table-cell">Num.<br />immob.</div>
            <div className="table-cell">codice tributo</div>
            <div className="table-cell">rateazione/<br />mese rif.</div>
            <div className="table-cell">anno di<br />riferimento</div>
            <div className="table-cell">importi a debito versati</div>
            <div className="table-cell">importi a credito compensati</div>
          </div>
          
          {imuRows.map((row, index) => (
            <div className="table-row" key={`imu-${row.id}`}>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  value={row.codiceEnte || ''}
                  onChange={(e) => handleRowChange('imu', row.id, 'codiceEnte', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input type="checkbox" />
              </div>
              <div className="table-cell">
                <input type="checkbox" />
              </div>
              <div className="table-cell">
                <input type="checkbox" />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  value={row.tipologiaImmobile || ''}
                  onChange={(e) => handleRowChange('imu', row.id, 'tipologiaImmobile', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input"
                  value={row.codiceTributo || ''}
                  onChange={(e) => handleRowChange('imu', row.id, 'codiceTributo', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input"
                  value={row.rateazione || ''}
                  onChange={(e) => handleRowChange('imu', row.id, 'rateazione', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  placeholder="AAAA"
                  value={row.annoRiferimento || ''}
                  onChange={(e) => handleRowChange('imu', row.id, 'annoRiferimento', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input money-input" 
                  value={row.importoDebito}
                  onChange={(e) => handleRowChange('imu', row.id, 'importoDebito', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input money-input" 
                  value={row.importoCredito}
                  onChange={(e) => handleRowChange('imu', row.id, 'importoCredito', e.target.value)}
                />
              </div>
              {index === imuRows.length - 1 && (
                <button 
                  type="button" 
                  className="add-row-btn"
                  onClick={() => addRow('imu')}
                >+</button>
              )}
              {imuRows.length > 1 && (
                <button 
                  type="button" 
                  className="remove-row-btn"
                  onClick={() => removeRow('imu', row.id)}
                >-</button>
              )}
            </div>
          ))}
          
          <div className="table-footer">
            <div className="table-cell"></div>
            <div className="table-cell"></div>
            <div className="table-cell"></div>
            <div className="table-cell"></div>
            <div className="table-cell"></div>
            <div className="table-cell"></div>
            <div className="table-cell"></div>
            <div className="table-cell">TOTALE</div>
            <div className="table-cell totals-cell">G {totals.totaleG}</div>
            <div className="table-cell totals-cell">H {totals.totaleH}</div>
            <div className="table-cell saldo-cell">SALDO (G-H) {totals.saldoGH}</div>
          </div>
        </div>
      </div>

      <div className="f24-section f24-inail">
        <div className="section-header">
          <h2>SEZIONE INAIL</h2>
        </div>
        
        <div className="section-table">
          <div className="table-header">
            <div className="table-cell">codice sede</div>
            <div className="table-cell">codice ditta</div>
            <div className="table-cell">c.c.</div>
            <div className="table-cell">numero di<br />riferimento</div>
            <div className="table-cell">importi a debito versati</div>
            <div className="table-cell">importi a credito compensati</div>
          </div>
          
          {inailRows.map((row, index) => (
            <div className="table-row" key={`inail-${row.id}`}>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  value={row.codiceSede || ''}
                  onChange={(e) => handleRowChange('inail', row.id, 'codiceSede', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  value={row.codiceTributo || ''}
                  onChange={(e) => handleRowChange('inail', row.id, 'codiceTributo', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input"
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input" 
                  value={row.codicePosizione || ''}
                  onChange={(e) => handleRowChange('inail', row.id, 'codicePosizione', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input money-input" 
                  value={row.importoDebito}
                  onChange={(e) => handleRowChange('inail', row.id, 'importoDebito', e.target.value)}
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  className="text-input money-input" 
                  value={row.importoCredito}
                  onChange={(e) => handleRowChange('inail', row.id, 'importoCredito', e.target.value)}
                />
              </div>
              {index === inailRows.length - 1 && (
                <button 
                  type="button" 
                  className="add-row-btn"
                  onClick={() => addRow('inail')}
                >+</button>
              )}
              {inailRows.length > 1 && (
                <button 
                  type="button" 
                  className="remove-row-btn"
                  onClick={() => removeRow('inail', row.id)}
                >-</button>
              )}
            </div>
          ))}
          
          <div className="table-footer">
            <div className="table-cell"></div>
            <div className="table-cell"></div>
            <div className="table-cell"></div>
            <div className="table-cell">TOTALE</div>
            <div className="table-cell totals-cell">I {totals.totaleI}</div>
            <div className="table-cell totals-cell">L {totals.totaleL}</div>
            <div className="table-cell saldo-cell">SALDO (I-L) {totals.saldoIL}</div>
          </div>
        </div>
      </div>

      <div className="f24-section f24-firma">
        <div className="section-row">
          <span className="field-label">FIRMA</span>
          <div className="signature-box"></div>
        </div>
      </div>

      <div className="f24-section f24-saldo-finale">
        <div className="section-row">
          <span className="field-label">SALDO FINALE</span>
          <div className="saldo-finale-box">
            <span className="currency">EURO</span>
            <span className="saldo-value">{totals.saldoFinale}</span>
          </div>
        </div>
      </div>

      <div className="f24-section f24-versamento">
        <div className="section-header">
          <h2>ESTREMI DEL VERSAMENTO</h2>
          <span className="header-subtitle">(DA COMPILARE A CURA DI BANCA/POSTE/AGENTE DELLA RISCOSSIONE)</span>
        </div>
        
        <div className="versamento-container">
          <div className="data-container">
            <div className="data-label">DATA</div>
            <div className="data-fields">
              <input 
                type="text" 
                className="text-input date-part" 
                placeholder="GG" 
                maxLength={2}
                value={paymentData.dataPagamento.split('-')[0] || ''}
                onChange={(e) => {
                  const day = e.target.value;
                  const oldValues = paymentData.dataPagamento.split('-');
                  const month = oldValues[1] || '';
                  const year = oldValues[2] || '';
                  setPaymentData({...paymentData, dataPagamento: `${day}-${month}-${year}`});
                }}
              />
              <input 
                type="text" 
                className="text-input date-part" 
                placeholder="MM" 
                maxLength={2}
                value={paymentData.dataPagamento.split('-')[1] || ''}
                onChange={(e) => {
                  const month = e.target.value;
                  const oldValues = paymentData.dataPagamento.split('-');
                  const day = oldValues[0] || '';
                  const year = oldValues[2] || '';
                  setPaymentData({...paymentData, dataPagamento: `${day}-${month}-${year}`});
                }}
              />
              <input 
                type="text" 
                className="text-input date-part" 
                placeholder="AAAA" 
                maxLength={4}
                value={paymentData.dataPagamento.split('-')[2] || ''}
                onChange={(e) => {
                  const year = e.target.value;
                  const oldValues = paymentData.dataPagamento.split('-');
                  const day = oldValues[0] || '';
                  const month = oldValues[1] || '';
                  setPaymentData({...paymentData, dataPagamento: `${day}-${month}-${year}`});
                }}
              />
            </div>
          </div>
          
          <div className="tipo-container">
            <div className="tipo-label">TIPO</div>
            <div className="tipo-options">
              <div className="tipo-option">
                <input 
                  type="radio" 
                  id="bancario" 
                  name="tipoPagamento" 
                  checked={paymentData.tipoPagamento === 'bancario'}
                  onChange={() => handleTipoPagamento('bancario')}
                />
                <label htmlFor="bancario">bancario/postale</label>
              </div>
              <div className="tipo-option">
                <input 
                  type="radio" 
                  id="circolare" 
                  name="tipoPagamento" 
                  checked={paymentData.tipoPagamento === 'postale'}
                  onChange={() => handleTipoPagamento('postale')}
                />
                <label htmlFor="circolare">circolare/vaglia postale</label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="versamento-container">
          <div className="codice-container">
            <div className="codice-label">CODICE BANCA/POSTE/AGENTE DELLA RISCOSSIONE</div>
            <div className="codice-fields">
              <input 
                type="text" 
                className="text-input medium-input" 
                value={paymentData.banca}
                onChange={(e) => setPaymentData({...paymentData, banca: e.target.value})}
              />
            </div>
          </div>
          
          <div className="cab-container">
            <div className="cab-label">CAB/SPORTELLO</div>
            <div className="cab-fields">
              <input 
                type="text" 
                className="text-input medium-input" 
                value={paymentData.cab}
                onChange={(e) => setPaymentData({...paymentData, cab: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <div className="versamento-container">
          <div className="pagamento-container">
            <div className="pagamento-label">Pagamento effettuato con assegno</div>
            <div className="pagamento-fields">
              <input type="checkbox" id="pagamento-assegno" />
              <input type="text" className="text-input long-input" placeholder="n.ro" />
              <input type="text" className="text-input medium-input" placeholder="tratto / emesso su" />
            </div>
          </div>
          
          <div className="abi-container">
            <div className="abi-label">ABI</div>
            <div className="abi-fields">
              <input 
                type="text" 
                className="text-input small-input" 
                value={paymentData.abi}
                onChange={(e) => setPaymentData({...paymentData, abi: e.target.value})}
              />
            </div>
          </div>
          
          <div className="cab-container">
            <div className="cab-label">CAB</div>
            <div className="cab-fields">
              <input 
                type="text" 
                className="text-input small-input" 
                value={paymentData.cab}
                onChange={(e) => setPaymentData({...paymentData, cab: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <div className="versamento-container">
          <div className="autorizzo-container">
            <div className="autorizzo-label">Autorizzo addebito su conto corrente codice IBAN</div>
            <div className="autorizzo-fields">
              <input 
                type="text" 
                className="text-input iban-input" 
                placeholder="IT00A0000000000000000000000" 
                value={paymentData.iban}
                onChange={(e) => setPaymentData({...paymentData, iban: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <div className="versamento-container">
          <div className="firma-container">
            <div className="firma-label">Firma</div>
            <div className="firma-field"></div>
          </div>
        </div>
      </div>

      <div className="form-footer">
        <div className="footer-info">
          1° COPIA PER LA BANCA/POSTE/AGENTE DELLA RISCOSSIONE
        </div>
      </div>

      <div className="f24-actions">
        <Button 
          className="action-button" 
          onClick={resetForm}
        >
          Ripulisci form
        </Button>
        <Button 
          className="action-button" 
          onClick={generatePDF}
        >
          Genera PDF
        </Button>
      </div>
    </div>
  );
};

export default F24OrdinaryForm;